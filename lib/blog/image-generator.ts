import { IMAGE_MODEL, IMAGE_ENDPOINT, ERROR_CODES } from "./config";

export interface GeneratedImageBytes {
  ok: boolean;
  bytes?: Uint8Array;
  contentType?: "image/png" | "image/jpeg" | "image/webp";
  errorCode?: string;
  errorMessage?: string;
}

/**
 * Detect image content-type from magic bytes so we upload with the
 * right MIME type into Supabase Storage. Flux Schnell almost always
 * returns PNG, but Cloudflare has flipped formats before — check.
 */
function sniffContentType(
  bytes: Uint8Array
): GeneratedImageBytes["contentType"] | null {
  if (bytes.length < 12) return null;
  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47
  )
    return "image/png";
  // JPEG: FF D8 FF
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff)
    return "image/jpeg";
  // WebP: "RIFF" ... "WEBP"
  if (
    bytes[0] === 0x52 &&
    bytes[1] === 0x49 &&
    bytes[2] === 0x46 &&
    bytes[3] === 0x46 &&
    bytes[8] === 0x57 &&
    bytes[9] === 0x45 &&
    bytes[10] === 0x42 &&
    bytes[11] === 0x50
  )
    return "image/webp";
  return null;
}

/**
 * Generates one hero image via Cloudflare Workers AI (Flux-1-Schnell).
 * Returns raw bytes + sniffed content-type ready for Supabase upload.
 *
 * Cloudflare responds two possible ways depending on account settings:
 *  - Binary image (Content-Type: image/*)
 *  - JSON envelope with base64 in result.image
 * We handle both.
 */
export async function generateImage(promptText: string): Promise<GeneratedImageBytes> {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const token = process.env.CLOUDFLARE_AI_API_TOKEN;

  if (!accountId || !token) {
    return {
      ok: false,
      errorCode: "IMAGE_ENV_MISSING",
      errorMessage:
        "CLOUDFLARE_ACCOUNT_ID and CLOUDFLARE_AI_API_TOKEN must be set",
    };
  }

  const url = IMAGE_ENDPOINT.replace("{accountId}", accountId).replace(
    "{model}",
    IMAGE_MODEL
  );

  let res: Response;
  try {
    res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "image/*, application/json",
      },
      body: JSON.stringify({ prompt: promptText }),
      cache: "no-store",
    });
  } catch (err) {
    return {
      ok: false,
      errorCode: ERROR_CODES.IMAGE_GENERATION_FAILED,
      errorMessage: (err instanceof Error ? err.message : String(err)).slice(0, 300),
    };
  }

  if (res.status === 429) {
    return {
      ok: false,
      errorCode: ERROR_CODES.IMAGE_GENERATION_QUOTA_ERROR,
      errorMessage: `Cloudflare AI quota exhausted (HTTP 429)`,
    };
  }

  if (!res.ok) {
    let detail = "";
    try {
      detail = (await res.text()).slice(0, 300);
    } catch {
      // ignore
    }
    return {
      ok: false,
      errorCode: ERROR_CODES.IMAGE_GENERATION_FAILED,
      errorMessage: `HTTP ${res.status}: ${detail}`,
    };
  }

  const rawContentType = (res.headers.get("content-type") ?? "").toLowerCase();

  let bytes: Uint8Array;
  if (rawContentType.startsWith("image/")) {
    bytes = new Uint8Array(await res.arrayBuffer());
  } else {
    let json: {
      result?: { image?: string };
      success?: boolean;
      errors?: unknown[];
    };
    try {
      json = (await res.json()) as typeof json;
    } catch (err) {
      return {
        ok: false,
        errorCode: ERROR_CODES.IMAGE_GENERATION_FAILED,
        errorMessage: `Non-JSON, non-image response: ${(err instanceof Error ? err.message : String(err)).slice(0, 200)}`,
      };
    }
    // Cloudflare's /ai/run/ endpoint returns { result: { image } } on
    // success — the standard v4 { success, errors, messages, result }
    // envelope is only used on error responses. Rely on result.image
    // being a non-empty string as the success signal; fall back to any
    // errors[] the envelope provides when it's absent.
    const image = json.result?.image;
    if (typeof image !== "string" || image.length === 0) {
      const errList = Array.isArray(json.errors) ? json.errors : [];
      const errStr = errList.length
        ? JSON.stringify(errList).slice(0, 200)
        : "empty result.image";
      return {
        ok: false,
        errorCode: ERROR_CODES.IMAGE_GENERATION_FAILED,
        errorMessage: `Cloudflare returned no image (${errStr})`,
      };
    }
    bytes = Uint8Array.from(Buffer.from(image, "base64"));
  }

  const contentType = sniffContentType(bytes);
  if (!contentType) {
    return {
      ok: false,
      errorCode: ERROR_CODES.IMAGE_GENERATION_FAILED,
      errorMessage: `Unrecognised image bytes; first 8: ${Array.from(bytes.slice(0, 8)).map((b) => b.toString(16)).join(" ")}`,
    };
  }

  // Guard against unexpectedly huge responses (Supabase bucket is 5MB).
  if (bytes.length > 5 * 1024 * 1024) {
    return {
      ok: false,
      errorCode: ERROR_CODES.IMAGE_GENERATION_FAILED,
      errorMessage: `Image too large: ${bytes.length} bytes (>5MB)`,
    };
  }

  return { ok: true, bytes, contentType };
}
