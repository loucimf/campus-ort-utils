const utils = window.campusOrtUtils;

console.log("[TIC] content.js loaded");

(function injectXHRHookFile() {
  const script = document.createElement("script");
  script.src = chrome.runtime.getURL("xhr-hook.js");
  script.onload = () => {
    console.log("[TIC] xhr-hook.js injected");
    script.remove();
  };
  script.onerror = (e) => {
    console.error("[TIC] failed to inject xhr-hook.js", e);
  };

  (document.head || document.documentElement).appendChild(script);
})();

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
      console.log("[TIC] background response:", response);
    }
  );
});

async function start() {
  utils.setNameMap(await utils.getSavedNameMap());

  applyCampusChanges();
  setTimeout(applyCampusChanges, 1000);

  const observer = new MutationObserver(applyCampusChanges);
  observer.observe(document.body, { childList: true, subtree: true });
}

function applyCampusChanges() {
  utils.renameWithMap();
  utils.appendManagerLink();
}

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type !== 'NAME_MAP_UPDATED') {
    return false;
  }

  utils.setNameMap(message.nameMap);
  utils.renameWithMap();
  sendResponse({ ok: true });
  return false;
});

start();