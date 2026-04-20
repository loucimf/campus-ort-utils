const utils = window.campusOrtUtils;

(function injectXHRHook() {
  console.log("[TIC] content.js loaded");

  const injected = document.createElement("script");

  injected.textContent = `
    (() => {
      const TARGET_URL = "https://campus.ort.edu.ar/ajaxactions/CheckBooksUsuario";

      console.log("[TIC][page] XHR hook injected");

      const originalOpen = XMLHttpRequest.prototype.open;
      const originalSend = XMLHttpRequest.prototype.send;

      XMLHttpRequest.prototype.open = function(method, url, ...rest) {
        this.__ticMethod = method;
        this.__ticUrl = url;

        console.log("[TIC][page] XHR open:", {
          method,
          url
        });

        return originalOpen.call(this, method, url, ...rest);
      };

      XMLHttpRequest.prototype.send = function(body) {
        try {
          const method = String(this.__ticMethod || "").toUpperCase();
          const url = String(this.__ticUrl || "");

          console.log("[TIC][page] XHR send:", {
            method,
            url,
            body
          });

          if (method === "POST" && url === TARGET_URL) {
            console.log("[TIC][page] TARGET REQUEST CAUGHT", {
              method,
              url,
              rawBody: body
            });

            window.postMessage({
              source: "tic-extension",
              type: "CHECK_BOOKS_USUARIO_XHR",
              rawBody: typeof body === "string" ? body : null
            }, "*");
          }
        } catch (err) {
          console.error("[TIC][page] XHR hook error:", err);
        }

        return originalSend.call(this, body);
      };
    })();
  `;

  (document.documentElement || document.head).appendChild(injected);
  injected.remove();
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