import { MODELS } from "./config";
import { generateJson, Type } from "./gemini-client";
import type { ContentBrief } from "./content-brief";

export interface ImagePromptResult {
  ok: boolean;
  image_prompt?: string;
  image_alt?: string;
  errorCode?: string;
  errorMessage?: string;
}

const SCHEMA = {
  type: Type.OBJECT,
  properties: {
    image_prompt: { type: Type.STRING },
    image_alt: { type: Type.STRING },
  },
  required: ["image_prompt", "image_alt"],
};

/**
 * Uses the cheap Gemini scoring model to build a Flux-friendly image
 * prompt and an accessible alt text for one blog post. Keeps prompts
 * editorial, symbolic, warm, and text-free — the hero image sits at
 * the top of a Blogger post, so text overlays would clash.
 */
export async function buildImagePrompt(
  title: string,
  brief: ContentBrief
): Promise<ImagePromptResult> {
  const systemAngle = brief.reader_pain_point?.slice(0, 240) ?? "";
  const cluster = "content cluster hint (not for the image): " + (brief.cta_plan?.target_product ?? "birth_chart");

  const prompt = `You are the art director for BluntChart, an astrology publication with a warm, cinematic, editorial look. Design a single hero image for one blog article.

ARTICLE TITLE: ${title}
READER PAIN POINT: ${systemAngle}
${cluster}

Produce two fields:

1) image_prompt — a single 45-80 word text-to-image prompt for the Flux-1-Schnell model. Requirements:
   - Editorial illustration, painterly, warm dusk palette (deep indigos, muted golds, terracotta), soft light.
   - Symbolic and metaphorical composition — no literal astrology chart wheels, no zodiac glyphs, no cartoon planets.
   - Human presence implied through silhouette or object, never a recognisable face.
   - 16:9 composition, cinematic framing, shallow depth of field.
   - No text, no lettering, no watermark, no logo, no UI elements.
   - No brand names, no celebrity references.
   - Concrete visual elements — describe objects, light, atmosphere. Not adjectives about feelings.

2) image_alt — a single 90-120 character accessible alt-text description of what a reader would literally see in the image (not the metaphor). Plain prose. Never repeats the article title.`;

  const result = await generateJson<{ image_prompt: string; image_alt: string }>({
    model: MODELS.scoring,
    prompt,
    schema: SCHEMA,
    temperature: 0.6,
    maxOutputTokens: 800,
  });

  if (!result.ok || !result.data) {
    return {
      ok: false,
      errorCode: result.errorCode,
      errorMessage: result.errorMessage,
    };
  }

  return {
    ok: true,
    image_prompt: result.data.image_prompt.trim().slice(0, 500),
    image_alt: result.data.image_alt.trim().slice(0, 160),
  };
}
