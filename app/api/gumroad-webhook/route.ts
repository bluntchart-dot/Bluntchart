import { supabase } from "@/lib/supabase"

export async function POST(req: Request) {
  try {
    const raw = await req.text()
    const params = new URLSearchParams(raw)

    const email = params.get("email") || params.get("purchaser_email") || ""
    const paymentId = params.get("sale_id") || params.get("id") || ""
    const productId = params.get("product_id") || params.get("product_permalink") || ""
    const amount = Number(params.get("price") || "1200")

    if (!email) {
      return Response.json({ error: "Missing email" }, { status: 400 })
    }

    const { data: pending, error: pendingError } = await supabase
      .from("pending_readings")
      .select("*")
      .eq("email", email)
      .single()

    if (pendingError || !pending) {
      return Response.json({ error: "No pending data found" }, { status: 404 })
    }

    const { data: user, error: userError } = await supabase
      .from("users")
      .upsert([{ email, name: pending.name }], { onConflict: "email" })
      .select()
      .single()

    if (userError || !user) {
      return Response.json({ error: userError?.message || "User save failed" }, { status: 500 })
    }

    const reading_json = {
      summary: "You overthink everything and call it intuition.",
      love: "You chase people who confuse you.",
      career: "You delay decisions and blame timing.",
    }

    const { error: readingError } = await supabase.from("readings").insert([
      {
        user_id: user.id,
        dob: pending.dob,
        birth_time: pending.birth_time,
        city: pending.city,
        reading_json,
      },
    ])

    if (readingError) {
      return Response.json({ error: readingError.message }, { status: 500 })
    }

    const { error: paymentError } = await supabase.from("payments").insert([
      {
        user_id: user.id,
        gumroad_payment_id: paymentId,
        product_id: productId,
        amount,
        status: "paid",
      },
    ])

    if (paymentError) {
      return Response.json({ error: paymentError.message }, { status: 500 })
    }

    await supabase.from("pending_readings").delete().eq("email", email)

    return Response.json({ success: true })
  } catch (err) {
    return Response.json({ error: "Something went wrong" }, { status: 500 })
  }
}