const { getStore, authRequired, jsonResponse } = require("./common");
const { v4: uuidv4 } = require("uuid");
const store = getStore("banners", { consistency: "strong" });

// Utility to get list of banner URLs (relative to function)
async function listBanners(event) {
  const base = `${event.headers["x-forwarded-proto"] || "https"}://${event.headers.host}`;
  const urls = [];
  for await (const page of store.list({ paginate: true })) {
    for (const blob of page.blobs) {
      urls.push(`${base}/api/banners/${blob.key}`);
    }
  }
  return jsonResponse({ banners: urls });
}

// Upload new banner (binary or base64-json)
async function uploadBanner(event, context) {
  // Only admins may upload
  const authed = await authRequired(() => Promise.resolve(true))(event, context);
  if (authed.statusCode && authed.statusCode !== 200) {
    // Failed authRequired returns a full response – just forward it
    return authed;
  }

  const contentType = event.headers["content-type"] || event.headers["Content-Type"] || "";

  // CASE 1: Frontend sends JSON with { filename, dataBase64 }
  if (contentType.includes("application/json")) {
    let payload;
    try {
      payload = JSON.parse(event.body || "{}");
    } catch {
      return jsonResponse({ error: "Invalid JSON" }, 400);
    }
    const { filename, dataBase64 } = payload;
    if (!dataBase64) return jsonResponse({ error: "dataBase64 required" }, 400);
    const buffer = Buffer.from(dataBase64, "base64");
    const ext = filename && filename.includes(".") ? filename.split(".").pop() : "png";
    const id = `${uuidv4()}.${ext}`;
    await store.put(id, buffer);
    const base = `${event.headers["x-forwarded-proto"] || "https"}://${event.headers.host}`;
    return jsonResponse({ success: true, url: `${base}/api/banners/${id}`, id }, 201);
  }

  // CASE 2: Frontend sends binary (e.g., via fetch/FormData) → body is base64
  if (event.isBase64Encoded) {
    const extMatch = contentType.match(/image\/(\w+)/);
    const ext = extMatch ? extMatch[1] : "png";
    const id = `${uuidv4()}.${ext}`;
    const buffer = Buffer.from(event.body, "base64");
    await store.put(id, buffer, { metadata: { contentType } });
    const base = `${event.headers["x-forwarded-proto"] || "https"}://${event.headers.host}`;
    return jsonResponse({ success: true, url: `${base}/api/banners/${id}`, id }, 201);
  }

  return jsonResponse({ error: "Unsupported upload format" }, 415);
}

// Serve banner binary by key
async function serveBanner(id) {
  const blob = await store.get(id, { consistency: "strong" });
  if (!blob) return { statusCode: 404, body: "Not found" };
  // blob is Buffer
  return {
    statusCode: 200,
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
    isBase64Encoded: true,
    body: blob.toString("base64"),
  };
}

async function deleteBanner(id) {
  await store.delete(id);
  return jsonResponse({ success: true });
}

exports.handler = async (event, context) => {
  // Route: POST upload => not yet implemented; GET list; DELETE /api/banners/<id>
  const method = event.httpMethod;
  const pathParts = event.path.split("/").filter(Boolean);
  const maybeId = pathParts.length > 2 ? pathParts[pathParts.length - 1] : null;

  if (method === "GET") {
    if (maybeId) {
      // GET /api/banners/<id> → serve file
      return serveBanner(maybeId);
    }
    // GET /api/banners → list
    return listBanners(event);
  }

  if (method === "POST") {
    return uploadBanner(event, context);
  }

  if (method === "DELETE" && maybeId) {
    return authRequired(() => deleteBanner(maybeId))(event, context);
  }

  return { statusCode: 405, body: "Method Not Allowed" };
};