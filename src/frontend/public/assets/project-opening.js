(() => {
  const config = document.currentScript?.dataset ?? {};
  const title = config.title || "project";
  const selector = config.ready || "#root canvas, #root h1, #app h1, #app button, #app a[href], #preso .slide";
  const style = document.createElement("style");
  style.textContent = `#project-opening{position:fixed;inset:0;z-index:2147483647;display:grid;place-content:center;gap:16px;padding:24px;background:#090f1e;color:#e5f6ff;text-align:center;font:16px/1.5 system-ui}#project-opening p{margin:0}#project-opening button,#project-opening a{min-height:44px;padding:10px 18px;border:1px solid #b6e6ef;border-radius:8px;background:#102837;color:white;font:inherit;cursor:pointer}#project-opening a{display:inline-block;text-decoration:none}`;
  document.head.append(style);
  const panel = document.createElement("div");
  panel.id = "project-opening";
  panel.setAttribute("role", "status");
  const message = document.createElement("p");
  message.textContent = `Opening ${title}…`;
  const controls = document.createElement("div");
  controls.style.cssText = "max-width:100%";
  controls.hidden = true;
  const retry = document.createElement("button");
  retry.type = "button";
  retry.textContent = "Reload project";
  retry.addEventListener("click", () => window.location.reload());
  const back = document.createElement("a");
  back.href = "/#work";
  back.textContent = "Back to selected work";
  controls.append(retry, back);
  panel.append(message, controls);
  document.documentElement.append(panel);

  const recover = () => {
    if (!panel.isConnected) return;
    message.textContent = `${title} is taking longer to open. You can reload or return to the portfolio.`;
    panel.style.inset = "auto 12px 12px";
    panel.style.padding = "16px";
    panel.style.borderRadius = "12px";
    panel.style.maxHeight = "45dvh";
    panel.style.overflow = "auto";
    controls.hidden = false;
  };
  const check = () => {
    if (document.body && panel.parentElement !== document.body) document.body.append(panel);
    const ready = [...document.querySelectorAll(selector)].some(element => {
      const bounds = element.getBoundingClientRect();
      return bounds.width > 0 && bounds.height > 0 &&
        (element.tagName === "CANVAS" || element.textContent.trim().length > 0 ||
          Boolean(element.getAttribute("aria-label")?.trim()));
    });
    if (!ready) return;
    panel.remove();
    style.remove();
    window.clearInterval(poll);
    window.clearTimeout(timer);
    window.removeEventListener("load", check, true);
    window.removeEventListener("error", recover, true);
  };
  const timer = window.setTimeout(recover, 15000);
  const poll = window.setInterval(check, 200);
  window.addEventListener("load", check, true);
  window.addEventListener("error", recover, true);
})();
