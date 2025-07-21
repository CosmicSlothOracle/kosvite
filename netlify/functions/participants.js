const { getStore } = require("./common");

exports.handler = async (event) => {
  // Check if user is authenticated via Netlify Identity
  const user = event.headers["x-netlify-user"];
  if (!user) {
    return {
      statusCode: 401,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Authentication required" })
    };
  }

  const store = getStore("participants");

  if (event.httpMethod === "GET") {
    try {
      const participants = await store.list();
      const participantData = [];

      for await (const page of participants) {
        for (const blob of page.blobs) {
          const data = await store.get(blob.key);
          if (data) {
            participantData.push(JSON.parse(data.toString()));
          }
        }
      }

      return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ participants: participantData })
      };
    } catch (error) {
      return {
        statusCode: 500,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: "Failed to load participants" })
      };
    }
  }

  if (event.httpMethod === "POST") {
    try {
      const body = JSON.parse(event.body);
      const { name, email, message } = body;

      if (!name) {
        return {
          statusCode: 400,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ error: "Name is required" })
        };
      }

      const participant = {
        name,
        email: email || "",
        message: message || "",
        timestamp: new Date().toISOString()
      };

      const key = `participant_${Date.now()}_${name.replace(/[^a-zA-Z0-9]/g, '_')}`;

      await store.set(key, JSON.stringify(participant));

      return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: "Participant added successfully" })
      };
    } catch (error) {
      return {
        statusCode: 500,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: "Failed to add participant" })
      };
    }
  }

  return {
    statusCode: 405,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ error: "Method not allowed" })
  };
};