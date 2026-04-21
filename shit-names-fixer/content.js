const utils = window.campusOrtUtils;

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

function injectXHRHookFile() {
  const parent = document.head || document.documentElement;

  if (!parent) {
    console.error("[TIC] No valid parent found to inject xhr-hook.js");
    return;
  }

  const script = document.createElement("script");
  script.src = chrome.runtime.getURL("xhr-hook.js");

  script.onload = () => {
    console.log("[TIC] xhr-hook.js --ok");
    script.remove();
  };

  script.onerror = (e) => {
    console.error("[TIC] xhr-hook.js --fail", e);
  };

  parent.appendChild(script);
}

function applyCampusChanges() {
  if (!utils) {
    return;
  }
  utils.renameWithMap();
  utils.appendManagerLink();
}

async function start() {
  if (!utils) {
    return;
  }

  injectXHRHookFile();
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
    "GET_LOGGED_IN_DATA_RESPONSE_XHR"
  ];

  if (!allowedTypes.includes(event.data.type)) return;

  console.log("[TIC] message received from page hook:", event.data);

  chrome.runtime.sendMessage(
    {
      type: event.data.type,
      rawBody: event.data.rawBody ?? null,
      method: event.data.method ?? null,
      url: event.data.url ?? null,
      status: event.data.status ?? null,
      responseText: event.data.responseText ?? null
    },
    (response) => {
      if (chrome.runtime.lastError) {
        console.error(
          "[TIC] background message error:",
          chrome.runtime.lastError.message
        );
        return;
      }

      console.log("[TIC] background response:", response);
    }
  );
});

start()