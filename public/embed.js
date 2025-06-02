(function () {
  function createWidget(options) {
    var baseUrl = options.baseUrl || "";
    var iframe = document.createElement("iframe");
    iframe.src = baseUrl;
    iframe.style.position = "fixed";
    iframe.style.bottom = "16px";
    iframe.style.right = "16px";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "none";
    iframe.style.zIndex = "99999";
    iframe.style.transition = "all 0.3s";

    var button = document.createElement("button");
    button.textContent = "AI";
    button.style.position = "fixed";
    button.style.bottom = "16px";
    button.style.right = "16px";
    button.style.width = "56px";
    button.style.height = "56px";
    button.style.borderRadius = "9999px";
    button.style.background = "#2563eb";
    button.style.color = "white";
    button.style.border = "none";
    button.style.zIndex = "99999";
    button.onclick = function () {
      if (iframe.style.width === "0px" || iframe.style.width === "0") {
        iframe.style.width = "360px";
        iframe.style.height = "500px";
      } else {
        iframe.style.width = "0";
        iframe.style.height = "0";
      }
    };

    document.body.appendChild(button);
    document.body.appendChild(iframe);
  }

  window.createIGIDWidget = createWidget;
})();
