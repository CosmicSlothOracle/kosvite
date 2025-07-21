// Common helpers for all Netlify Functions (Node runtime)
// Each function can `require("./common")` to access utilities.

const { getStore } = require("@netlify/blobs");

function jsonResponse(data, statusCode = 200) {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify(data),
  };
}

module.exports = {
  jsonResponse,
  getStore,
};