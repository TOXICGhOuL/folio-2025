const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./threejs-override-B-XZF2Lm.js","./three.core-DWO3AUHR.js","./Game-4iEIInCc.js"])))=>i.map(i=>d[i]);
let p;
let __tla = (async () => {
  (function() {
    const n = document.createElement("link").relList;
    if (n && n.supports && n.supports("modulepreload")) return;
    for (const e of document.querySelectorAll('link[rel="modulepreload"]')) a(e);
    new MutationObserver((e) => {
      for (const t of e) if (t.type === "childList") for (const r of t.addedNodes) r.tagName === "LINK" && r.rel === "modulepreload" && a(r);
    }).observe(document, {
      childList: true,
      subtree: true
    });
    function s(e) {
      const t = {};
      return e.integrity && (t.integrity = e.integrity), e.referrerPolicy && (t.referrerPolicy = e.referrerPolicy), e.crossOrigin === "use-credentials" ? t.credentials = "include" : e.crossOrigin === "anonymous" ? t.credentials = "omit" : t.credentials = "same-origin", t;
    }
    function a(e) {
      if (e.ep) return;
      e.ep = true;
      const t = s(e);
      fetch(e.href, t);
    }
  })();
  let w, P, L, h, g;
  w = "modulepreload";
  P = function(l, n) {
    return new URL(l, n).href;
  };
  L = {};
  p = function(n, s, a) {
    let e = Promise.resolve();
    if (s && s.length > 0) {
      let _ = function(o) {
        return Promise.all(o.map((u) => Promise.resolve(u).then((d) => ({
          status: "fulfilled",
          value: d
        }), (d) => ({
          status: "rejected",
          reason: d
        }))));
      };
      const r = document.getElementsByTagName("link"), i = document.querySelector("meta[property=csp-nonce]"), v = (i == null ? void 0 : i.nonce) || (i == null ? void 0 : i.getAttribute("nonce"));
      e = _(s.map((o) => {
        if (o = P(o, a), o in L) return;
        L[o] = true;
        const u = o.endsWith(".css"), d = u ? '[rel="stylesheet"]' : "";
        if (a) for (let f = r.length - 1; f >= 0; f--) {
          const m = r[f];
          if (m.href === o && (!u || m.rel === "stylesheet")) return;
        }
        else if (document.querySelector(`link[href="${o}"]${d}`)) return;
        const c = document.createElement("link");
        if (c.rel = u ? "stylesheet" : w, u || (c.as = "script"), c.crossOrigin = "", c.href = o, v && c.setAttribute("nonce", v), document.head.appendChild(c), u) return new Promise((f, m) => {
          c.addEventListener("load", f), c.addEventListener("error", () => m(new Error(`Unable to preload CSS for ${o}`)));
        });
      }));
    }
    function t(r) {
      const i = new Event("vite:preloadError", {
        cancelable: true
      });
      if (i.payload = r, window.dispatchEvent(i), !i.defaultPrevented) throw r;
    }
    return e.then((r) => {
      for (const i of r || []) i.status === "rejected" && t(i.reason);
      return n().catch(t);
    });
  };
  h = document.querySelector(".js-gate");
  g = document.querySelector(".js-gate-start");
  let y = false;
  const E = async () => {
    if (!y) {
      y = true, h.classList.add("is-loading"), g.setAttribute("disabled", "disabled");
      try {
        await p(() => import("./threejs-override-B-XZF2Lm.js"), __vite__mapDeps([0,1]), import.meta.url);
        const { Game: l } = await p(async () => {
          const { Game: s } = await import("./Game-4iEIInCc.js").then(async (m) => {
            await m.__tla;
            return m;
          }).then((a) => a.G);
          return {
            Game: s
          };
        }, __vite__mapDeps([2,1]), import.meta.url), { default: n } = await p(async () => {
          const { default: s } = await import("./consoleLog-M6CUjW2n.js");
          return {
            default: s
          };
        }, [], import.meta.url);
        console.log(...n), new l(), document.documentElement.classList.add("is-gate-done"), setTimeout(() => h.remove(), 600);
      } catch (l) {
        console.error(l), y = false, h.classList.remove("is-loading"), h.classList.add("is-error"), g.removeAttribute("disabled");
      }
    }
  };
  g.addEventListener("click", E);
  location.hash === "#drive" && E();
})();
export {
  p as _,
  __tla
};
