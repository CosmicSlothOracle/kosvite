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

async function deleteBanner(id) {
  await store.delete(id);
  return jsonResponse({ success: true });
}

exports.handler = async (event, context) => {
  // Route: POST upload => not yet implemented; GET list; DELETE /api/banners/<id>
  const method = event.httpMethod;
  const pathParts = event.path.split("/").filter(Boolean);
  const maybeId = pathParts[pathParts.length - 1];

  if (method === "GET") {
    return listBanners(event);
  }

  if (method === "DELETE") {
    return authRequired(() => deleteBanner(maybeId))(event, context);
  }

  return { statusCode: 405, body: "Method Not Allowed" };
};