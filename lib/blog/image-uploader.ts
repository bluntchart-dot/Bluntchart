import type { SupabaseClient } from "@supabase/supabase-js";
import { randomUUID } from "crypto";
import { IMAGE_STORAGE_BUCKET, ERROR_CODES } from "./config";

export interface UploadResult {
  ok: boolean;
  publicUrl?: string;
  storagePath?: string;
  errorCode?: string;
  errorMessage?: string;
}

const CT_TO_EXT: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
};

export async function uploadImage(
  supabase: SupabaseClient,
  postId: string,
  bytes: Uint8Array,
  contentType: string
): Promise<UploadResult> {
  const ext = CT_TO_EXT[contentType] ?? "png";
  const storagePath = `${postId}/${randomUUID()}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from(IMAGE_STORAGE_BUCKET)
    .upload(storagePath, bytes, {
      contentType,
      upsert: false,
      cacheControl: "31536000",
    });

  if (uploadError) {
    return {
      ok: false,
      errorCode: ERROR_CODES.IMAGE_UPLOAD_FAILED,
      errorMessage: uploadError.message.slice(0, 300),
    };
  }

  const { data } = supabase.storage
    .from(IMAGE_STORAGE_BUCKET)
    .getPublicUrl(storagePath);

  if (!data?.publicUrl) {
    return {
      ok: false,
      errorCode: ERROR_CODES.IMAGE_UPLOAD_FAILED,
      errorMessage: "Uploaded but Supabase returned no public URL",
    };
  }

  return { ok: true, publicUrl: data.publicUrl, storagePath };
}
