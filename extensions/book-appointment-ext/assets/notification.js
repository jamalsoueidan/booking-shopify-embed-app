window.addEventListener("load", function () {
  var MutationObserver =
    window.MutationObserver || window.WebKitMutationObserver;

  // https://stackoverflow.com/questions/3219758/detect-changes-in-the-dom
  var observeDOM = (function () {
    return function (obj, callback) {
      if (!obj || obj.nodeType !== 1) return;

      if (MutationObserver) {
        // define a new observer
        var mutationObserver = new MutationObserver(callback);

        // have the observer observe foo for changes in children
        mutationObserver.observe(obj, { childList: true, subtree: true });
        return mutationObserver;
      }

      // browser support fallback
      else if (window.addEventListener) {
        obj.addEventListener("DOMNodeInserted", callback, false);
      }
    };
  })();

  function connect(m) {
    observer.disconnect();
    const options = document.querySelectorAll(".product-option");
    options.forEach(function (option) {
      const dt = option.querySelector("dt");
      const dd = option.querySelector("dd");
      if (dt && dt) {
        if (dt.innerHTML.toLowerCase().includes("hour")) {
          const date = new Date(dd.innerHTML.trim());
          const value =
            date.getHours() +
            ":" +
            (date.getMinutes() < 10 ? "0" : "") +
            date.getMinutes();
          dd.innerHTML = value;
        }

        if (dt.innerHTML.toLowerCase().includes("staff")) {
          const value = JSON.parse(dd.innerHTML).fullname;
          dd.innerHTML = value;
        }
      }
    });
    observer = observeDOM(document.querySelector("cart-notification"), connect);
  }

  // Observe a specific DOM element:
  let observer = observeDOM(
    document.querySelector("cart-notification"),
    connect
  );
});
