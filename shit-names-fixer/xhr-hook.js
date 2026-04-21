(() => {
  if (window.__ticRequestHookInstalled) {
    return;
  }

  window.__ticRequestHookInstalled = true;

  const TARGET_PATH_LOGIN = "/ajaxactions/LogearUsuario";
  const TARGET_PATH_LOGGED_DATA = "/ajaxactions/GetLoggedInData";

  //console.log("xhr --ok");

  const originalOpen = XMLHttpRequest.prototype.open;
  const originalSend = XMLHttpRequest.prototype.send;

  function getPathname(rawUrl) {
    if (typeof rawUrl !== "string" || !rawUrl) {
      return "";
    }

    try {
      return new URL(rawUrl, window.location.href).pathname;
    } catch (_error) {
      return rawUrl;
    }
  }

  function matchesPath(rawUrl, targetPath) {
    const pathname = getPathname(rawUrl);
    return pathname === targetPath || pathname.endsWith(targetPath);
  }

  function postExtensionMessage(payload) {
    window.postMessage(
      {
        source: "tic-extension",
        ...payload
      },
      "*"
    );
  }

  XMLHttpRequest.prototype.open = function (method, url, ...rest) {
    this.__ticMethod = String(method || "").toUpperCase();
    this.__ticUrl = String(url || "");

    return originalOpen.call(this, method, url, ...rest);
  };

  XMLHttpRequest.prototype.send = function (body) {
    try {
      const method = String(this.__ticMethod || "").toUpperCase();
      const url = String(this.__ticUrl || "");

      //  login request payload
      if (method === "POST" && matchesPath(url, TARGET_PATH_LOGIN)) {
        postExtensionMessage({
          type: "LOGEAR_USUARIO_XHR",
          rawBody: typeof body === "string" ? body : null,
          method,
          url
        });

        this.addEventListener("load", function () {

          postExtensionMessage({
            type: "LOGEAR_USUARIO_RESPONSE_XHR",
            method,
            url,
            status: this.status,
            responseText:
              typeof this.responseText === "string"
                ? this.responseText
                : null
          });
        });
      }

      // logged-in-data RESPONSE
      if (method === "GET" && matchesPath(url, TARGET_PATH_LOGGED_DATA)) {

        this.addEventListener("load", function () {
          try {
            postExtensionMessage({
              type: "GET_LOGGED_IN_DATA_RESPONSE_XHR",
              method,
              url,
              status: this.status,
              responseText:
                typeof this.responseText === "string"
                  ? this.responseText
                  : null
            });
          } catch (err) {}
        });
      }
    } catch (err) {
    }

    return originalSend.call(this, body);
  };
})();
