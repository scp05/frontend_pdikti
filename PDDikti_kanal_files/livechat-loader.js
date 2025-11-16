/** @format */

function widgetApi() {
  return new Promise((resolve) => {
    let timeoutId;

    const getApi = () => {
      const event = new Event("getWidgetApi");
      timeoutId = window.setTimeout(getApi, 1000);
      window.dispatchEvent(event);
    };

    const onWidgetApi = (e) => {
      const api = e.detail;
      window.clearTimeout(timeoutId);
      resolve(api);
    };

    window.addEventListener("widgetApi", onWidgetApi, { once: true });
    getApi();
  });
}

// Handle Body Button
(() => {
  const script = document.currentScript;

  const loadWidget = () => {
    const widget = document.createElement("div");
    const tenant = script.getAttribute("id");

    const widgetStyle = widget.style;
    widgetStyle.display = "none";
    widgetStyle.boxSizing = "border-box";

    widgetStyle.width = "150px";
    widgetStyle.height = "150px";
    widget.id = `widget-${tenant}`;

    if (
      navigator.userAgent.match(/Android/i) ||
      navigator.userAgent.match(/iPhone/i)
    ) {
      widgetStyle.bottom = "75px";
    } else {
      widgetStyle.bottom = "5px";
    }

    widgetStyle.position = "fixed";
    widgetStyle.right = "10px";
    widgetStyle.borderRadius = "15px";
    widgetStyle.zIndex = 99999;
    widgetStyle.transition = "all 200ms ease-in-out";

    const iframe = document.createElement("iframe");

    const iframeStyle = iframe.style;
    iframeStyle.boxSizing = "borderBox";
    iframeStyle.position = "absolute";
    iframeStyle.right = 0;
    iframeStyle.top = 0;
    iframeStyle.width = "100%";
    iframeStyle.height = "100%";
    iframeStyle.border = 0;
    iframeStyle.margin = 0;
    iframeStyle.padding = 0;

    widget.appendChild(iframe);

    const MainColor = script.getAttribute("main-color");

    const api = {
      sendMessage: (message) => {
        iframe.contentWindow.postMessage(
          {
            sendMessage: message,
          },
          "*"
        );
      },

      show: () => {
        if (
          navigator.userAgent.match(/Android/i) ||
          navigator.userAgent.match(/iPhone/i)
        ) {
          widgetStyle.width = "100%";
          widgetStyle.height = "100%";
          widgetStyle.bottom = "0px";
          widgetStyle.right = "0px";
        } else {
          if (window.screen.availWidth <= 1024) {
            widgetStyle.width = "394px";
            widgetStyle.height = "100%";
          } else if (
            window.screen.availWidth >= 1025 &&
            window.screen.availWidth <= 1280
          ) {
            widgetStyle.width = "397px";
            widgetStyle.height = "90vh";
          } else if (
            window.screen.availWidth >= 1281 &&
            window.screen.availWidth <= 1440
          ) {
            widgetStyle.width = "400px";
            widgetStyle.height = "90vh";
          } else if (window.screen.availWidth >= 1441) {
            widgetStyle.width = "452px";
            widgetStyle.height = "90vh";
          }
        }
      },

      // closeIframe: () => {
      //   console.log("close IFrame");
      // },

      hide: () => {
        if (
          navigator.userAgent.match(/Android/i) ||
          navigator.userAgent.match(/iPhone/i)
        ) {
          widgetStyle.width = "90px";
          widgetStyle.height = "90px";
          widgetStyle.borderRadius = "15px";
          widgetStyle.bottom = "75px";
        } else {
          widgetStyle.width = "90px";
          widgetStyle.height = "90px";
          widgetStyle.borderRadius = "15px";
          widgetStyle.bottom = "5px";
        }
      },

      toggle: () => {
        const display = window.getComputedStyle(widget, null).display;
        widget.style.display = display === "none" ? "block" : "none";
      },

      hideBubble: () => {
        widgetStyle.width = "90px";
        widgetStyle.height = "90px";
      },

      clearIframe: () => {
        iframe.remove();
      },

      onHide: () => {},
    };

    const widgetAddress = "https://lc-dikti.omnix.co.id";

    iframe.addEventListener("load", () => {
      window.addEventListener("getWidgetApi", () => {
        const event = new CustomEvent("widgetApi", { detail: api });
        window.dispatchEvent(event);
      });

      window.addEventListener("message", (evt) => {
        if (evt.data === "show") {
          api.show();
        }
        if (evt.data == "hide") {
          api.hide();
        }

        if (evt.data == "removeIframe") {
          api.clearIframe();
        }

        if (evt.origin !== widgetAddress) {
          return;
        }

        if (evt.data == "hideBubble") {
          api.hideBubble();
        }
      });

      iframe.contentWindow.postMessage({ greeting: "test" }, widgetAddress);
      widgetStyle.display = "block";
    });

    const license = script.getAttribute("data-license");
    const postLoginToken = null;

    const widgetUrl = `${widgetAddress}/?license=${license}&postLoginToken=${postLoginToken}`;

    iframe.src = widgetUrl;
    iframe.id = `iframe-${tenant}`;
    iframe.allow = "geolocation";
    document.body.appendChild(widget);
  };

  if (document.readyState === "complete") {
    loadWidget();
  } else {
    document.addEventListener("readystatechange", () => {
      if (document.readyState === "complete") {
        loadWidget();
      }
    });
  }
})();
