(function () {
  "use strict";

  var COPY_BAR_ID = "mdp-copy-bar";
  var RAW_SOURCE_ID = "mdp-raw-source";
  var COPY_LABEL = "Copy";
  var COPIED_LABEL = "Copied!";
  var PROCESSING_ATTR = "data-mdp-copy-ready";
  var mutating = false;

  function decodeBase64UTF8(b64) {
    var bytes = Uint8Array.from(atob(b64), function (c) {
      return c.charCodeAt(0);
    });
    return new TextDecoder().decode(bytes);
  }

  function fallbackCopyToClipboard(text) {
    var textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
  }

  function copyToClipboard(text) {
    if (navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
      return navigator.clipboard.writeText(text).catch(function () {
        fallbackCopyToClipboard(text);
      });
    }

    fallbackCopyToClipboard(text);
    return Promise.resolve();
  }

  function flashCopied(btn, originalText) {
    btn.textContent = COPIED_LABEL;
    setTimeout(function () {
      btn.textContent = originalText;
    }, 2000);
  }

  function createCopyButton(className, label, onClick) {
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = className;
    btn.textContent = label;
    btn.setAttribute("aria-label", label);
    btn.addEventListener("click", function () {
      btn.disabled = true;

      Promise.resolve(onClick(btn, label))
        .catch(function (error) {
          console.error("md-copy: button action failed", error);
        })
        .finally(function () {
          btn.disabled = false;
        });
    });
    return btn;
  }

  function copyTextWithFeedback(text, btn, originalText) {
    return copyToClipboard(text)
      .then(function () {
        flashCopied(btn, originalText);
      })
      .catch(function (error) {
        console.error("md-copy: failed to copy text", error);
      });
  }

  function injectCopyButton() {
    if (document.getElementById(COPY_BAR_ID) || !document.body) return;

    var bar = document.createElement("div");
    bar.id = COPY_BAR_ID;
    bar.className = "mdp-copy-bar";

    var btn = createCopyButton("mdp-copy-btn", COPY_LABEL, function (button, label) {
      var el = document.getElementById(RAW_SOURCE_ID);
      if (el && el.dataset.source) {
        return copyTextWithFeedback(decodeBase64UTF8(el.dataset.source), button, label);
      }

      return Promise.resolve();
    });

    bar.appendChild(btn);
    document.body.prepend(bar);
  }

  function injectCodeCopyButtons() {
    var blocks = document.querySelectorAll("pre > code");

    blocks.forEach(function (code) {
      var pre = code.parentElement;
      if (!pre) return;
      if (pre.getAttribute(PROCESSING_ATTR) === "true") return;

      var parent = pre.parentNode;
      if (!parent) return;

      pre.setAttribute(PROCESSING_ATTR, "true");

      var wrapper = document.createElement("div");
      wrapper.className = "mdp-code-wrapper";
      parent.insertBefore(wrapper, pre);
      wrapper.appendChild(pre);

      var btn = createCopyButton(
        "mdp-copy-btn mdp-code-copy-btn",
        COPY_LABEL,
        function (button, label) {
          var text = (code.textContent || "").replace(/\n+$/, "");
          return copyTextWithFeedback(text, button, label);
        }
      );

      wrapper.appendChild(btn);
    });
  }

  function inject() {
    if (mutating) return;
    mutating = true;
    injectCopyButton();
    injectCodeCopyButtons();
    mutating = false;
  }

  var observer = new MutationObserver(function () {
    inject();
  });

  function start() {
    if (!document.body) return;
    inject();
    observer.observe(document.body, { childList: true, subtree: true });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }

  window.addEventListener("pagehide", function () {
    observer.disconnect();
  });
})();
