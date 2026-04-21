(() => {
  const TARGET_PATH_LOGIN = "/ajaxactions/LogearUsuario";
  const TARGET_PATH_LOGGED_DATA = "/ajaxactions/GetLoggedInData";

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

      handleRequest({
        method,
        url,
        body,
        targetPath: TARGET_PATH_LOGIN,
        targetMethod: "POST",
        messageType: "LOGEAR_USUARIO_XHR"
      });

      handleRequest({
        method,
        url,
        body,
        targetPath: TARGET_PATH_LOGGED_DATA,
        targetMethod: "GET",
        messageType: "GET_LOGGED_IN_DATA_XHR"
      });
    } catch (err) {
      console.error("[TIC][page] XHR hook error:", err);
    }

    return originalSend.call(this, body);
  };

  function handleRequest({
    method,
    url,
    body,
    targetPath,
    targetMethod,
    messageType
  }) {
    if (method === targetMethod && url === targetPath) {
      console.log("[TIC][page] TARGET REQUEST CAUGHT", {
        messageType,
        method,
        url,
        rawBody: body
      });

      window.postMessage(
        {
          source: "tic-extension",
          type: messageType,
          rawBody: typeof body === "string" ? body : null,
          method,
          url
        },
        "*"
      );
    }
  }
})();