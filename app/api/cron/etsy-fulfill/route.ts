import { NextRequest, NextResponse } from "next/server";
import { requireCronSecret } from "@/lib/blog/admin-auth";
import { createSupabaseAdmin } from "@/lib/supabase-admin";
import { DB } from "@/lib/db/tables";
import { dbLog, dbError } from "@/lib/db/log";
import { routeToGeneration } from "@/lib/pipeline/router";
import { isTarotProduct } from "@/lib/premium/products/registry";
import type { ReadingProduct } from "@/lib/premium/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

/**
 * Picks up one queued etsy_order per tick, runs it through the
 * reading pipeline, and stores the result. One-at-a-time to stay
 * within the 60s Vercel function limit.
 */
export async function GET(req: NextRequest) {
  const startedAt = Date.now();

  try {
    const authError = requireCronSecret(req);
    if (authError) return authError;

    const supabase = createSupabaseAdmin();

    const { data: queued } = await supabase
      .from(DB.etsyOrders)
      .select("*")
      .eq("status", "queued")
      .order("created_at", { ascending: true })
      .limit(1);

    if (!queued || queued.length === 0) {
      return NextResponse.json({
        ok: true,
        elapsed_ms: Date.now() - startedAt,
        message: "No queued orders",
      });
    }

    const row = queued[0];
    const product = row.product as ReadingProduct;
    const birthData = row.birth_data as {
      name: string;
      dob: string;
      birth_time: string;
      birth_place: string;
      focus_area?: string;
      birth_time_approximate?: boolean;
    } | null;

    const isTarot = isTarotProduct(product);

    if (!isTarot && !birthData) {
      await supabase
        .from(DB.etsyOrders)
        .update({
          status: "error",
          generation_error: "No birth data on queued order",
          updated_at: new Date().toISOString(),
        })
        .eq("id", row.id);

      return NextResponse.json({
        ok: false,
        elapsed_ms: Date.now() - startedAt,
        error: "No birth data on queued order",
        orderId: row.id,
      });
    }

    // Mark as generating to prevent double-processing
    const { data: claimed } = await supabase
      .from(DB.etsyOrders)
      .update({
        status: "generating",
        generation_attempts: (row.generation_attempts ?? 0) + 1,
        updated_at: new Date().toISOString(),
      })
      .eq("id", row.id)
      .eq("status", "queued")
      .select("id");

    if (!claimed || claimed.length === 0) {
      return NextResponse.json({
        ok: true,
        elapsed_ms: Date.now() - startedAt,
        message: "Order already claimed by another worker",
      });
    }

    dbLog("etsy-fulfill", "starting generation", {
      orderId: row.id,
      product,
      name: birthData?.name ?? "(tarot)",
    });

    const result = await routeToGeneration({
      product,
      ...(isTarot
        ? {
            tarot: {
              seed: String(row.etsy_receipt_id ?? row.id),
              question: row.question ?? undefined,
              customerName: birthData?.name ?? (row.raw_personalization as Record<string, string>)?.name,
            },
          }
        : {
            birth: {
              name: birthData!.name,
              dob: birthData!.dob,
              birth_time: birthData!.birth_time,
              birth_place: birthData!.birth_place,
              focus_area: birthData!.focus_area,
              birth_time_approximate: birthData!.birth_time_approximate,
            },
          }),
    });

    if (result.tier === "quick" || result.tier === "tarot" || result.tier === "compat") {
      if (result.ok && result.reading) {
        // Save the reading to the readings table
        const { data: readingRow, error: readingError } = await supabase
          .from(DB.readings)
          .insert([
            {
              birth_time: birthData?.birth_time ?? null,
              birth_place: birthData?.birth_place ?? null,
              reading_json: result.reading,
              reading_status: "complete",
              product_type: product,
              order_source: "etsy",
              access_token: row.access_token,
            },
          ])
          .select("id")
          .single();

        if (readingError) {
          dbError("etsy-fulfill", "reading insert failed", readingError);
          await supabase
            .from(DB.etsyOrders)
            .update({
              status: "error",
              generation_error: "Reading insert failed",
              updated_at: new Date().toISOString(),
            })
            .eq("id", row.id);

          return NextResponse.json({
            ok: false,
            elapsed_ms: Date.now() - startedAt,
            orderId: row.id,
            error: "Reading insert failed",
          });
        }

        // Update the etsy_order with the reading result
        await supabase
          .from(DB.etsyOrders)
          .update({
            status: "complete",
            reading_json: result.reading,
            reading_id: readingRow?.id ?? null,
            updated_at: new Date().toISOString(),
          })
          .eq("id", row.id);

        dbLog("etsy-fulfill", "reading complete", {
          orderId: row.id,
          product,
          attempts: result.attempts,
        });

        return NextResponse.json({
          ok: true,
          elapsed_ms: Date.now() - startedAt,
          orderId: row.id,
          product,
          status: "complete",
          attempts: result.attempts,
          deliveryUrl: row.delivery_url,
        });
      }

      // Generation failed
      dbError("etsy-fulfill", "generation failed", result.error ?? "unknown", {
        orderId: row.id,
        product,
      });

      await supabase
        .from(DB.etsyOrders)
        .update({
          status: "error",
          generation_error: result.error ?? "Generation failed",
          updated_at: new Date().toISOString(),
        })
        .eq("id", row.id);

      return NextResponse.json({
        ok: false,
        elapsed_ms: Date.now() - startedAt,
        orderId: row.id,
        product,
        error: result.error ?? "Generation failed",
      });
    }

    if (result.tier === "premium") {
      if (result.ok && result.reading) {
        const dbProductType = product === "birth-chart" ? "birth-chart-book" : product;

        const { data: readingRow, error: readingError } = await supabase
          .from(DB.readings)
          .insert([
            {
              birth_time: birthData?.birth_time ?? null,
              birth_place: birthData?.birth_place ?? null,
              reading_json: result.reading as unknown as Record<string, unknown>,
              reading_status: "complete",
              product_type: dbProductType,
              order_source: "etsy",
              access_token: row.access_token,
            },
          ])
          .select("id")
          .single();

        if (readingError) {
          dbError("etsy-fulfill", "premium reading insert failed", readingError);
          await supabase
            .from(DB.etsyOrders)
            .update({
              status: "error",
              generation_error: "Premium reading insert failed",
              updated_at: new Date().toISOString(),
            })
            .eq("id", row.id);

          return NextResponse.json({
            ok: false,
            elapsed_ms: Date.now() - startedAt,
            orderId: row.id,
            error: "Premium reading insert failed",
          });
        }

        await supabase
          .from(DB.etsyOrders)
          .update({
            status: "complete",
            reading_json: result.reading as unknown as Record<string, unknown>,
            reading_id: readingRow?.id ?? null,
            updated_at: new Date().toISOString(),
          })
          .eq("id", row.id);

        dbLog("etsy-fulfill", "premium reading complete", {
          orderId: row.id,
          product,
          dbProductType,
        });

        return NextResponse.json({
          ok: true,
          elapsed_ms: Date.now() - startedAt,
          orderId: row.id,
          product,
          status: "complete",
          deliveryUrl: row.delivery_url,
        });
      }

      dbError("etsy-fulfill", "premium generation failed", result.error, {
        orderId: row.id,
        product,
      });

      await supabase
        .from(DB.etsyOrders)
        .update({
          status: "error",
          generation_error: result.error,
          updated_at: new Date().toISOString(),
        })
        .eq("id", row.id);

      return NextResponse.json({
        ok: false,
        elapsed_ms: Date.now() - startedAt,
        orderId: row.id,
        product,
        error: result.error,
      });
    }

    // Unsupported tier
    await supabase
      .from(DB.etsyOrders)
      .update({
        status: "error",
        generation_error: `Unsupported pipeline tier: ${result.tier}`,
        updated_at: new Date().toISOString(),
      })
      .eq("id", row.id);

    return NextResponse.json({
      ok: false,
      elapsed_ms: Date.now() - startedAt,
      orderId: row.id,
      error: `Unsupported pipeline tier: ${result.tier}`,
    });
  } catch (err) {
    console.error(
      "[cron/etsy-fulfill] unhandled:",
      err instanceof Error ? err.stack ?? err.message : err
    );
    return NextResponse.json(
      {
        ok: false,
        elapsed_ms: Date.now() - startedAt,
        error: (err instanceof Error ? err.message : String(err)).slice(
          0,
          500
        ),
      },
      { status: 500 }
    );
  }
}
