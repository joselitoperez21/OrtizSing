import { list, put } from "@vercel/blob";

const PROFILE_PATH = "ortizsigns/profile.json";

function readRequestBody(req) {
  if (!req.body) return {};
  if (typeof req.body === "string") {
    try {
      return JSON.parse(req.body);
    } catch {
      return {};
    }
  }
  return req.body;
}

async function readStoredProfile() {
  const result = await list({ prefix: PROFILE_PATH, limit: 10 });
  const blob = result.blobs.find((item) => item.pathname === PROFILE_PATH) ?? result.blobs[0];
  if (!blob) return null;

  const response = await fetch(blob.url, { cache: "no-store" });
  if (!response.ok) return null;
  return response.json();
}

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const profile = await readStoredProfile();
      return res.status(200).json({ profile });
    } catch {
      return res.status(200).json({ profile: null });
    }
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const expectedPin = process.env.OWNER_EDIT_PIN || "2026";
  const payload = readRequestBody(req);

  if (payload.pin !== expectedPin) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (!payload.profile || typeof payload.profile !== "object") {
    return res.status(400).json({ error: "Missing profile" });
  }

  try {
    await put(PROFILE_PATH, JSON.stringify(payload.profile), {
      access: "public",
      addRandomSuffix: false,
      contentType: "application/json"
    });

    return res.status(200).json({ ok: true });
  } catch {
    return res.status(500).json({
      error: "Global save failed. Configure BLOB_READ_WRITE_TOKEN in Vercel."
    });
  }
}
