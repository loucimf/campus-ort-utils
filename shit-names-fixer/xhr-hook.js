(() => {
  const TARGET_PATH_LOGIN = "/ajaxactions/LogearUsuario";
  const TARGET_PATH_LOGGED_DATA = "/ajaxactions/GetLoggedInData";

  console.log("[TIC][page] xhr-hook.js loaded");

  const originalOpen = XMLHttpRequest.prototype.open;
  const originalSend = XMLHttpRequest.prototype.send;

  XMLHttpRequest.prototype.open = function (method, url, ...rest) {
    this.__ticMethod = String(method || "").toUpperCase();
    this.__ticUrl = String(url || "");

    console.log("[TIC][page] XHR open:", {
      method: this.__ticMethod,
      url: this.__ticUrl
    });

    return originalOpen.call(this, method, url, ...rest);
  };

  XMLHttpRequest.prototype.send = function (body) {
    try {
      const method = String(this.__ticMethod || "").toUpperCase();
      const url = String(this.__ticUrl || "");

      console.log("[TIC][page] XHR send:", { method, url, body });

      //  login request payload
      if (method === "POST" && url === TARGET_PATH_LOGIN) {
        console.log("[TIC][page] LOGIN REQUEST CAUGHT", {
          method,
          url,
          rawBody: body
        });

        window.postMessage(
          {
            source: "tic-extension",
            type: "LOGEAR_USUARIO_XHR",
            rawBody: typeof body === "string" ? body : null,
            method,
            url
          },
          "*"
        );
      }

      // logged-in-data RESPONSE
      if (method === "GET" && url === TARGET_PATH_LOGGED_DATA) {
        console.log("[TIC][page] GET_LOGGED_IN_DATA request detected");

        this.addEventListener("load", function () {
          try {
            console.log("[TIC][page] GET_LOGGED_IN_DATA response captured", {
              status: this.status,
              responseText: this.responseText
            });

            window.postMessage(
              {
                source: "tic-extension",
                type: "GET_LOGGED_IN_DATA_RESPONSE_XHR",
                method,
                url,
                status: this.status,
                responseText:
                  typeof this.responseText === "string"
                    ? this.responseText
                    : null
              },
              "*"
            );
          } catch (err) {
            console.error(
              "[TIC][page] failed reading GetLoggedInData response:",
              err
            );
          }
        });

        this.addEventListener("error", function () {
          console.error("[TIC][page] GET_LOGGED_IN_DATA XHR failed");
        });
      }
    } catch (err) {
      console.error("[TIC][page] XHR hook error:", err);
    }

    return originalSend.call(this, body);
  };
})();