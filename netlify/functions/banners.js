const { getStore } = require("./common");

exports.handler = async (event, context) => {
  // Netlify provides verified Identity details via `context.clientContext.identity`
  const identity = context.clientContext && context.clientContext.identity;

  if (!identity) {
    return {
      statusCode: 401,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Authentication required" })
    };
  }

  const user = identity; // contains email and other metadata

  const store = getStore("banners");

  if (event.httpMethod === "GET") {
    try {
      const banners = await store.list();
      return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ banners: banners.map(b => b.url) })
      };
    } catch (error) {
      return {
        statusCode: 500,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: "Failed to load banners" })
      };
    }
  }

  if (event.httpMethod === "POST") {
    try {
      const body = JSON.parse(event.body);
      const { filename, dataBase64 } = body;

      if (!filename || !dataBase64) {
        return {
          statusCode: 400,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ error: "filename and dataBase64 required" })
        };
      }

      const buffer = Buffer.from(dataBase64, "base64");
      const key = `banner_${Date.now()}_${filename}`;

      await store.set(key, buffer, {
        metadata: { filename, uploadedBy: user.email || user.sub || "unknown", uploadedAt: new Date().toISOString() }
      });

      return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: "Banner uploaded successfully" })
      };
    } catch (error) {
      return {
        statusCode: 500,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: "Failed to upload banner" })
      };
    }
  }

  if (event.httpMethod === "DELETE") {
    try {
      const { id } = event.pathParameters || {};
      if (!id) {
        return {
          statusCode: 400,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ error: "Banner ID required" })
        };
      }

      await store.delete(id);

      return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: "Banner deleted successfully" })
      };
    } catch (error) {
      return {
        statusCode: 500,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: "Failed to delete banner" })
      };
    }
  }

  return {
    statusCode: 405,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ error: "Method not allowed" })
  };
};