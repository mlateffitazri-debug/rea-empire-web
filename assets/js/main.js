// REA EMPIRE — site interactions
(function () {
  "use strict";

  var WA_NUMBER = "60194660000";

  // Shopee links per product. Paste each product's Shopee URL here;
  // any product left empty links to the main Shopee store.
  var SHOPEE_STORE = "https://shopee.com.my/reaempire";
  var SHOPEE_LINKS = {
    "premium-pomade-new": "https://shopee.com.my/PREMIUM-POMADE-by-REA-EMPIRE-(BIG)-i.1361868077.48315056081",
    "ea-premium-pomade": "https://shopee.com.my/PREMIUM-POMADE-by-REA-EMPIRE-(SMALL)-i.1361868077.29620925244",
    "ea-premium-clay": "https://shopee.com.my/PREMIUM-CLAY-by-REA-EMPIRE-i.1361868077.27145413861",
    "ea-hair-spray": "https://shopee.com.my/PREMIUM-HAIR-SPRAY-by-REA-EMPIRE-i.1361868077.50015044345",
    "travel-hair-spray": "",
    "ea-shampoo":"https://shopee.com.my/EABeauty-hair-shampoo-treatment-for-men-and-women-i.1361868077.29812256380",
    "ea-oil-treatment": "",
    "ea-snow": "",
    "premium-hoodie": ""
  };

  // Header background once the page scrolls
  var header = document.querySelector(".site-header");
  function onScroll() {
    if (header) header.classList.toggle("scrolled", window.scrollY > 20);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Mobile navigation: hamburger on tablets, bottom-sheet "Menu" tab on phones
  var nav = document.querySelector(".main-nav");
  var toggles = document.querySelectorAll(".nav-toggle, .tab-menu");
  function setNav(open) {
    nav.classList.toggle("open", open);
    document.body.classList.toggle("nav-open", open);
    toggles.forEach(function (t) {
      t.setAttribute("aria-expanded", String(open));
      t.classList.toggle("active", open);
    });
  }
  if (nav) {
    toggles.forEach(function (t) {
      t.addEventListener("click", function (e) {
        e.stopPropagation();
        setNav(!nav.classList.contains("open"));
      });
    });
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) setNav(false);
    });
    document.addEventListener("click", function (e) {
      if (nav.classList.contains("open") && !nav.contains(e.target)) setNav(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("open")) setNav(false);
    });
  }

  // Highlight the current page in the menu and the tab bar
  var page = location.pathname.split("/").pop().replace(".html", "") || "index";
  document.querySelectorAll(".main-nav a").forEach(function (a) {
    var target = a.getAttribute("href").replace(".html", "").replace("./", "") || "index";
    if (target === page) a.classList.add("active");
  });
  document.querySelectorAll(".tab-bar [data-tab]").forEach(function (a) {
    if (a.getAttribute("data-tab") === page) a.classList.add("active");
  });

  // Reveal sections as they scroll into view
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("in"); });
  }

  // WhatsApp "buy" links: data-product="Name|RM00.00"
  document.querySelectorAll("[data-product]").forEach(function (el) {
    var parts = el.getAttribute("data-product").split("|");
    var msg = "Salam REA Empire, saya berminat untuk membeli " + parts[0] +
      (parts[1] ? " — " + parts[1] : "") + ". Boleh saya dapatkan maklumat lanjut?";
    el.setAttribute("href", "https://wa.me/" + WA_NUMBER + "?text=" + encodeURIComponent(msg));
    el.setAttribute("target", "_blank");
    el.setAttribute("rel", "noopener");
  });

  // Shopee "buy" links: data-shopee="product-id"
  document.querySelectorAll("[data-shopee]").forEach(function (el) {
    el.setAttribute("href", SHOPEE_LINKS[el.getAttribute("data-shopee")] || SHOPEE_STORE);
    el.setAttribute("target", "_blank");
    el.setAttribute("rel", "noopener");
  });

  // Forms are sent through WhatsApp (the site has no backend)
  document.querySelectorAll("form[data-wa-form]").forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.reportValidity()) return;
      var lines = [form.getAttribute("data-wa-form")];
      form.querySelectorAll("[name]").forEach(function (field) {
        if (field.type === "checkbox") {
          lines.push(field.dataset.label + ": " + (field.checked ? "Ya" : "Tidak"));
        } else if (field.value.trim()) {
          lines.push(field.dataset.label + ": " + field.value.trim());
        }
      });
      window.open("https://wa.me/" + WA_NUMBER + "?text=" + encodeURIComponent(lines.join("\n")), "_blank", "noopener");
    });
  });

  // Product filter
  var filterBar = document.querySelector(".filter-bar");
  if (filterBar) {
    filterBar.addEventListener("click", function (e) {
      var btn = e.target.closest("button");
      if (!btn) return;
      filterBar.querySelectorAll("button").forEach(function (b) { b.classList.toggle("active", b === btn); });
      var cat = btn.dataset.filter;
      document.querySelectorAll("[data-cat]").forEach(function (item) {
        item.hidden = cat !== "all" && item.dataset.cat !== cat;
      });
    });
  }

  // Gallery lightbox
  var lightbox = document.querySelector(".lightbox");
  if (lightbox) {
    var lbImg = lightbox.querySelector("img");
    var close = function () { lightbox.classList.remove("open"); };
    document.querySelectorAll(".gallery button").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var img = btn.querySelector("img");
        lbImg.src = img.src;
        lbImg.alt = img.alt;
        lightbox.classList.add("open");
      });
    });
    lightbox.addEventListener("click", function (e) {
      if (e.target !== lbImg) close();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") close();
    });
  }

  // Dropdowns: folded on phones, always open on larger screens
  var phone = window.matchMedia("(max-width: 768px)");
  var folds = document.querySelectorAll("details[data-collapse-mobile]");
  function syncFolds() {
    folds.forEach(function (d) { d.open = !phone.matches; });
  }
  folds.forEach(function (d) {
    d.querySelector("summary").addEventListener("click", function (e) {
      if (!phone.matches) e.preventDefault();
    });
  });
  syncFolds();
  if (phone.addEventListener) phone.addEventListener("change", syncFolds);

  // Footer year
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  // Drifting gold dust in the hero
  var canvas = document.querySelector(".sparkles");
  if (canvas && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    var ctx = canvas.getContext("2d");
    var dots = [];
    var w, h, dpr;
    var resize = function () {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.offsetWidth;
      h = canvas.offsetHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      dots = [];
      var count = Math.round((w * h) / 9000);
      for (var i = 0; i < count; i++) {
        dots.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r: Math.random() * 1.6 + 0.3,
          vy: -(Math.random() * 0.25 + 0.05),
          vx: (Math.random() - 0.5) * 0.15,
          a: Math.random() * 0.7 + 0.2,
          t: Math.random() * Math.PI * 2
        });
      }
    };
    var tick = function () {
      ctx.clearRect(0, 0, w, h);
      dots.forEach(function (d) {
        d.x += d.vx;
        d.y += d.vy;
        d.t += 0.02;
        if (d.y < -5) { d.y = h + 5; d.x = Math.random() * w; }
        var alpha = d.a * (0.6 + 0.4 * Math.sin(d.t));
        ctx.beginPath();
        ctx.fillStyle = "rgba(243, 214, 143," + alpha.toFixed(3) + ")";
        ctx.shadowColor = "rgba(230, 180, 90, 0.9)";
        ctx.shadowBlur = 6;
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fill();
      });
      requestAnimationFrame(tick);
    };
    resize();
    window.addEventListener("resize", resize);
    tick();
  }
})();
