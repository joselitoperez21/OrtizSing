const PROFILE_ID = "main";
const TABLE = process.env.SUPABASE_PROFILE_TABLE || "site_profile";

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

function getSupabaseConfig() {
  const url = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) return null;
  return { url, serviceKey };
}

async function getProfileFromSupabase({ url, serviceKey }) {
  const endpoint = `${url}/rest/v1/${TABLE}?id=eq.${PROFILE_ID}&select=profile&limit=1`;
  const response = await fetch(endpoint, {
    method: "GET",
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`
    }
  });

  if (!response.ok) return null;
  const rows = await response.json();
  return rows?.[0]?.profile ?? null;
}

async function upsertProfileToSupabase({ url, serviceKey }, profile) {
  const endpoint = `${url}/rest/v1/${TABLE}`;
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      Prefer: "resolution=merge-duplicates,return=minimal"
    },
    body: JSON.stringify([{ id: PROFILE_ID, profile }])
  });

  return response.ok;
}

export default async function handler(req, res) {
  const supabase = getSupabaseConfig();
  if (!supabase) {
    return res.status(500).json({
      error:
        "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in Vercel environment variables."
    });
  }

  if (req.method === "GET") {
    try {
      const profile = await getProfileFromSupabase(supabase);
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
    const ok = await upsertProfileToSupabase(supabase, payload.profile);
    if (!ok) {
      return res.status(500).json({ error: "Supabase upsert failed." });
    }
    return res.status(200).json({ ok: true });
  } catch {
    return res.status(500).json({ error: "Supabase write failed." });
  }
}
