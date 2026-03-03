import { NextRequest, NextResponse } from "next/server";
import { GoogleAuth } from "google-auth-library";

const BUCKET = "ela-dp-coaching";

const VALID_TYPES = ["route", "trail"];

function validatePayload(data: unknown): string | null {
  if (!data || typeof data !== "object") return "Invalid payload";

  const d = data as Record<string, unknown>;

  // Validate objectif_principal
  const obj = d.objectif_principal;
  if (!obj || typeof obj !== "object") return "Missing objectif_principal";
  const { date, type } = obj as Record<string, unknown>;

  if (typeof date !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return "Invalid date format (expected YYYY-MM-DD)";
  }
  if (!VALID_TYPES.includes(type as string)) return "Invalid type";

  // Validate objectifs_secondaires
  if (d.objectifs_secondaires !== undefined) {
    if (!Array.isArray(d.objectifs_secondaires)) return "objectifs_secondaires must be an array";
    if (d.objectifs_secondaires.some((s: unknown) => typeof s !== "string")) {
      return "objectifs_secondaires must contain strings";
    }
  }

  // Validate numeric fields
  if (d.seances_par_semaine !== undefined) {
    const s = d.seances_par_semaine as number;
    if (typeof s !== "number" || s < 1 || s > 7) return "seances_par_semaine must be 1-7";
  }
  if (d.renforcement_par_semaine !== undefined) {
    const r = d.renforcement_par_semaine as number;
    if (typeof r !== "number" || r < 0 || r > 7) return "renforcement_par_semaine must be 0-7";
  }

  // Validate notes (optional free text)
  if (d.notes !== undefined && typeof d.notes !== "string") {
    return "notes must be a string";
  }

  return null;
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    const validationError = validatePayload(data);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const credentials = process.env.GCS_KEY ? JSON.parse(process.env.GCS_KEY) : null;
    if (!credentials) {
      return NextResponse.json({ error: "GCS credentials not configured" }, { status: 500 });
    }

    const auth = new GoogleAuth({
      credentials,
      scopes: ["https://www.googleapis.com/auth/devstorage.read_write"],
    });

    const client = await auth.getClient();
    const tokenResponse = await client.getAccessToken();
    const token = tokenResponse.token;

    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const fileName = `training-plans/${timestamp}.json`;

    const uploadUrl = `https://storage.googleapis.com/upload/storage/v1/b/${BUCKET}/o?uploadType=media&name=${encodeURIComponent(fileName)}`;

    const uploadResponse = await fetch(uploadUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!uploadResponse.ok) {
      const error = await uploadResponse.text();
      console.error("GCS upload error:", error);
      return NextResponse.json({ error: "GCS upload failed" }, { status: 500 });
    }

    return NextResponse.json({ success: true, fileName });
  } catch (error) {
    console.error("Training plan upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
