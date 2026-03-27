import { NextRequest, NextResponse } from "next/server";

const GCS_BUCKET = "ela-dp-dev";
const GCS_PREFIX = "daily_check";

// ── JWT / OAuth2 helpers ───────────────────────────────────────────────────────

function base64urlEncode(str: string): string {
  return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64urlEncodeBuffer(buf: ArrayBuffer): string {
  return base64urlEncode(String.fromCharCode(...new Uint8Array(buf)));
}

async function getAccessToken(): Promise<string> {
  const keyJson = JSON.parse(process.env.GCS_KEY!);
  const { client_email, private_key } = keyJson;

  const now = Math.floor(Date.now() / 1000);
  const header = base64urlEncode(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claim = base64urlEncode(
    JSON.stringify({
      iss: client_email,
      scope: "https://www.googleapis.com/auth/devstorage.read_write",
      aud: "https://oauth2.googleapis.com/token",
      iat: now,
      exp: now + 3600,
    })
  );

  const signingInput = `${header}.${claim}`;

  // Import private key
  const pemBody = private_key
    .replace(/-----BEGIN PRIVATE KEY-----/, "")
    .replace(/-----END PRIVATE KEY-----/, "")
    .replace(/\n/g, "");
  const keyDer = Uint8Array.from(atob(pemBody), (c) => c.charCodeAt(0));
  const cryptoKey = await crypto.subtle.importKey(
    "pkcs8",
    keyDer,
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signature = await crypto.subtle.sign(
    "RSASSA-PKCS1-v1_5",
    cryptoKey,
    new TextEncoder().encode(signingInput)
  );

  const jwt = `${signingInput}.${base64urlEncodeBuffer(signature)}`;

  // Exchange JWT for access token
  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt,
    }),
  });

  if (!tokenRes.ok) {
    const err = await tokenRes.text();
    throw new Error(`OAuth2 token error: ${err}`);
  }

  const { access_token } = await tokenRes.json();
  return access_token;
}

// ── Route handler ─────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const checkinDate: string = body.checkin_date;
    if (!checkinDate) {
      return NextResponse.json({ error: "checkin_date is required" }, { status: 400 });
    }

    const timestamp = Math.floor(Date.now() / 1000);
    const filename = `daily_checkin_${checkinDate.replace(/-/g, "_")}__${timestamp}.json`;
    const objectName = `${GCS_PREFIX}/${filename}`;

    const jsonContent = JSON.stringify(body, null, 2);
    const accessToken = await getAccessToken();

    const uploadRes = await fetch(
      `https://storage.googleapis.com/upload/storage/v1/b/${GCS_BUCKET}/o?uploadType=media&name=${encodeURIComponent(objectName)}`,
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: jsonContent,
      }
    );

    if (!uploadRes.ok) {
      const errText = await uploadRes.text();
      console.error("GCS upload failed:", uploadRes.status, errText);
      return NextResponse.json(
        { error: "GCS upload failed", detail: errText },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true, filename: objectName });
  } catch (err) {
    console.error("Checkin API error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
