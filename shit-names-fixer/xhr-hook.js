(() => {
  const TARGET_PATH = "/ajaxactions/LogearUsuario";

  console.log("[TIC][page] xhr-hook.js loaded");

  const originalOpen = XMLHttpRequest.prototype.open;
  const originalSend = XMLHttpRequest.prototype.send;

  XMLHttpRequest.prototype.open = function (method, url, ...rest) {
    this.__ticMethod = method;
    this.__ticUrl = url;

    console.log("[TIC][page] XHR open:", { method, url });

    return originalOpen.call(this, method, url, ...rest);
  };

  XMLHttpRequest.prototype.send = function (body) {
    try {
      const method = String(this.__ticMethod || "").toUpperCase();
      const url = String(this.__ticUrl || "");

      console.log("[TIC][page] XHR send:", { method, url, body });

      if (method === "POST" && url === TARGET_PATH) {
        console.log("[TIC][page] TARGET REQUEST CAUGHT", {
          method,
          url,
          rawBody: body
        });

        window.postMessage(
          {
            source: "tic-extension",
            type: "LOGEAR_USUARIO_XHR",
            rawBody: typeof body === "string" ? body : null
          },
          "*"
        );
      }
    } catch (err) {
      console.error("[TIC][page] XHR hook error:", err);
    }

    return originalSend.call(this, body);
  };
})();