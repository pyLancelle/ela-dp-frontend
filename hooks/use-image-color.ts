"use client";

import { useEffect, useState } from "react";

export interface RGB {
  r: number;
  g: number;
  b: number;
}

/**
 * Extracts the dominant vibrant color from an image URL using canvas sampling.
 * Returns null while loading or if extraction fails.
 */
export function useImageColor(imageUrl: string | undefined | null): RGB | null {
  const [color, setColor] = useState<RGB | null>(null);

  useEffect(() => {
    if (!imageUrl) {
      setColor(null);
      return;
    }

    const img = new Image();
    img.crossOrigin = "anonymous";

    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        const size = 64; // downsample for speed
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        ctx.drawImage(img, 0, 0, size, size);
        const { data } = ctx.getImageData(0, 0, size, size);

        // Collect all pixels with decent saturation & brightness
        let bestR = 0, bestG = 0, bestB = 0;
        let bestScore = -1;

        // Bucket colors to find the most dominant vibrant one
        const buckets = new Map<string, { r: number; g: number; b: number; count: number; saturation: number }>();

        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const a = data[i + 3];
          if (a < 128) continue; // skip transparent

          // Quantize to 32-level buckets
          const qr = Math.round(r / 32) * 32;
          const qg = Math.round(g / 32) * 32;
          const qb = Math.round(b / 32) * 32;
          const key = `${qr},${qg},${qb}`;

          const max = Math.max(r, g, b);
          const min = Math.min(r, g, b);
          const saturation = max === 0 ? 0 : (max - min) / max;
          const brightness = max / 255;

          if (!buckets.has(key)) {
            buckets.set(key, { r, g, b, count: 0, saturation });
          }
          const bucket = buckets.get(key)!;
          bucket.count++;
          // Keep the most saturated sample in each bucket
          if (saturation > bucket.saturation) {
            bucket.r = r;
            bucket.g = g;
            bucket.b = b;
            bucket.saturation = saturation;
          }
        }

        // Score: favor saturation and frequency, penalize very dark/bright
        for (const bucket of buckets.values()) {
          const brightness = Math.max(bucket.r, bucket.g, bucket.b) / 255;
          const score =
            bucket.count * 0.3 +
            bucket.saturation * 100 +
            (brightness > 0.15 && brightness < 0.85 ? 30 : 0);

          if (score > bestScore) {
            bestScore = score;
            bestR = bucket.r;
            bestG = bucket.g;
            bestB = bucket.b;
          }
        }

        // Ensure minimum brightness for visibility on dark backgrounds
        const maxChannel = Math.max(bestR, bestG, bestB);
        if (maxChannel < 100) {
          const boost = 100 / Math.max(maxChannel, 1);
          bestR = Math.min(255, Math.round(bestR * boost));
          bestG = Math.min(255, Math.round(bestG * boost));
          bestB = Math.min(255, Math.round(bestB * boost));
        }

        setColor({ r: bestR, g: bestG, b: bestB });
      } catch {
        // CORS or other error — fallback to null (components use default colors)
        setColor(null);
      }
    };

    img.onerror = () => setColor(null);
    img.src = imageUrl;
  }, [imageUrl]);

  return color;
}
