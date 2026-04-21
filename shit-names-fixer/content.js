const utils = window.campusOrtUtils;
let loggedInDataRequestInFlight = false;

console.log("[TIC] content.js loaded");

function waitForBody() {
  return new Promise((resolve) => {
    if (document.body) {
      resolve();
      return;
    }

    const onReady = () => {
      if (document.body) {
        resolve();
      }
    };

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", onReady, { once: true });
    } else {
      onReady();
    }
  });
}

function applyCampusChanges() {
  if (!utils) {
    return;
  }
  utils.renameWithMap();
  utils.appendManagerLink();
}

function sendMessageToBackground(payload) {
  chrome.runtime.sendMessage(payload, (response) => {
    if (chrome.runtime.lastError) {
      console.error(
        "[TIC] background message error:",
        chrome.runtime.lastError.message
      );
      return;
    }

    console.log("[TIC] background response:", response);
  });
}

async function fetchLoggedInDataDirectly() {
  if (loggedInDataRequestInFlight) {
    return;
  }

  loggedInDataRequestInFlight = true;

  try {
    console.log("[TIC] fetching GetLoggedInData directly after login");

    const response = await fetch("/ajaxactions/GetLoggedInData", {
      method: "GET",
      credentials: "include",
      headers: {
        "X-Requested-With": "XMLHttpRequest",
        "Accept": "application/json, text/javascript, */*; q=0.01"
      }
    });

    const responseText = await response.text();

    console.log("[TIC] direct GetLoggedInData response:", {
      status: response.status,
      responseText
    });

    sendMessageToBackground({
      type: "GET_LOGGED_IN_DATA_RESPONSE_XHR",
      method: "GET",
      url: "/ajaxactions/GetLoggedInData",
      status: response.status,
      responseText
    });
  } catch (error) {
    console.error("[TIC] direct GetLoggedInData fetch failed:", error);
  } finally {
    loggedInDataRequestInFlight = false;
  }
}

async function start() {
  if (!utils) {
    return;
  }

  await waitForBody();

  const savedNameMap = await utils.getSavedNameMap();
  utils.setNameMap(savedNameMap);

  applyCampusChanges();
  setTimeout(() => {
    applyCampusChanges();
  }, 1000);

  const observer = new MutationObserver(() => {
    applyCampusChanges();
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  console.log("[TIC] runtime message received:", message);

  if (message.type !== "NAME_MAP_UPDATED") {
    return false;
  }

  if (!utils) {
    sendResponse({ ok: false, error: "campusOrtUtils missing" });
    return false;
  }

  utils.setNameMap(message.nameMap);
  utils.renameWithMap();

  sendResponse({ ok: true });
  return false;
});

window.addEventListener("message", (event) => {
  if (event.source !== window) return;
  if (!event.data || event.data.source !== "tic-extension") return;

  const allowedTypes = [
    "LOGEAR_USUARIO_XHR",
    "LOGEAR_USUARIO_RESPONSE_XHR",
    "GET_LOGGED_IN_DATA_RESPONSE_XHR"
  ];

  if (!allowedTypes.includes(event.data.type)) return;

  console.log("[TIC] message received from page hook:", event.data);

  if (event.data.type === "LOGEAR_USUARIO_RESPONSE_XHR") {
    if (event.data.status >= 200 && event.data.status < 300) {
      window.setTimeout(() => {
        void fetchLoggedInDataDirectly();
      }, 900);
    }

    return;
  }

  sendMessageToBackground({
    type: event.data.type,
    rawBody: event.data.rawBody ?? null,
    method: event.data.method ?? null,
    url: event.data.url ?? null,
    status: event.data.status ?? null,
    responseText: event.data.responseText ?? null
  });
});

start()
