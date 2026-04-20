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
        console.log("[TIC] document.body is ready");
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
    console.log("[TIC] xhr-hook.js injected");
    script.remove();
  };

  script.onerror = (e) => {
    console.error("[TIC] failed to inject xhr-hook.js", e);
  };

  parent.appendChild(script);
}

function applyCampusChanges() {
  if (!utils) {
    console.error("[TIC] campusOrtUtils is missing in applyCampusChanges()");
    return;
  }

  console.log("[TIC] applyCampusChanges()");
  utils.renameWithMap();
  utils.appendManagerLink();
}

async function start() {
  if (!utils) {
    console.error("[TIC] window.campusOrtUtils is missing");
    return;
  }

  injectXHRHookFile();

  await waitForBody();

  console.log("[TIC] start() running");

  const savedNameMap = await utils.getSavedNameMap();
  console.log("[TIC] savedNameMap loaded:", savedNameMap);

  utils.setNameMap(savedNameMap);

  applyCampusChanges();
  setTimeout(() => {
    console.log("[TIC] delayed applyCampusChanges()");
    applyCampusChanges();
  }, 1000);

  const observer = new MutationObserver(() => {
    console.log("[TIC] mutation detected");
    applyCampusChanges();
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

  console.log("[TIC] MutationObserver started");
}

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  console.log("[TIC] runtime message received:", message);

  if (message.type !== "NAME_MAP_UPDATED") {
    return false;
  }

  if (!utils) {
    console.error("[TIC] campusOrtUtils is missing in onMessage");
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
  if (event.data.type !== "LOGEAR_USUARIO_XHR") return;

  console.log("[TIC] message received from page hook:", event.data);

  chrome.runtime.sendMessage(
    {
      type: "LOGEAR_PAYLOAD",
      rawBody: event.data.rawBody
    },
    (response) => {
      if (chrome.runtime.lastError) {
        console.error("[TIC] background message error:", chrome.runtime.lastError.message);
        return;
      }

      console.log("[TIC] background response:", response);
    }
  );
});

start().catch((error) => {
  console.error("[TIC] start() failed:", error);
});