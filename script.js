(function () {
  "use strict";

  var nav = document.getElementById("nav");
  var navToggle = document.getElementById("navToggle");
  var navMobile = document.getElementById("navMobile");
  var progressBar = document.getElementById("progressBar");
  var toTop = document.getElementById("toTop");
  var typedEl = document.getElementById("typed");
  var yearEl = document.getElementById("year");
  var cursorGlow = document.getElementById("cursorGlow");
  var particles = document.getElementById("particles");

  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ----------------------------------------------------------- nav state */

  var toggleIcon = function () {
    if (!navToggle) return;
    navToggle.innerHTML = navMobile && !navMobile.hidden
      ? '<svg class="icon"><use href="#i-x"></use></svg>'
      : '<svg class="icon"><use href="#i-menu"></use></svg>';
  };

  if (navToggle && navMobile) {
    navToggle.addEventListener("click", function () {
      var open = navMobile.hidden;
      navMobile.hidden = !open;
      navToggle.setAttribute("aria-expanded", String(open));
      toggleIcon();
    });

    navMobile.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        navMobile.hidden = true;
        navToggle.setAttribute("aria-expanded", "false");
        toggleIcon();
      });
    });
  }

  /* ------------------------------------------------- scroll: nav/progress */

  var onScroll = function () {
    var y = window.scrollY || document.documentElement.scrollTop;
    if (nav) nav.classList.toggle("scrolled", y > 50);

    var doc = document.documentElement;
    var max = doc.scrollHeight - doc.clientHeight;
    if (progressBar) progressBar.style.transform = "scaleX(" + (max > 0 ? y / max : 0) + ")";

    if (toTop) toTop.hidden = y <= 400;
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  if (toTop) {
    toTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ------------------------------------------------------- typing effect */

  var mantras = ["Automate. Analyze. Implement."];

  if (typedEl) {
    var text = mantras[0];
    var i = 0;
    var step = function () {
      if (i <= text.length) {
        typedEl.textContent = text.slice(0, i);
        i++;
        window.setTimeout(step, 70);
      } else {
        var blink = document.querySelector(".cursor-blink");
        if (blink) blink.classList.add("done");
      }
    };
    window.setTimeout(step, 900);
  }

  /* ----------------------------------------------------- reveal on scroll */

  var reveals = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* -------------------------------------------------- background particles */

  if (particles) {
    var count = window.innerWidth <= 768 ? 8 : 20;
    var frag = document.createDocumentFragment();
    for (var p = 0; p < count; p++) {
      var dot = document.createElement("span");
      dot.className = "particle";
      var size = Math.random() * 4 + 1;
      dot.style.width = size + "px";
      dot.style.height = size + "px";
      dot.style.top = Math.random() * 100 + "%";
      dot.style.left = Math.random() * 100 + "%";
      dot.style.setProperty("--drift", (Math.random() * 50 - 25) + "px");
      dot.style.animationDuration = Math.random() * 10 + 10 + "s";
      dot.style.animationDelay = Math.random() * 5 + "s";
      frag.appendChild(dot);
    }
    particles.appendChild(frag);
  }

  /* ------------------------------------------------ cursor-following glow */

  var isMobile = window.innerWidth <= 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  if (cursorGlow) {
    if (isMobile) {
      cursorGlow.style.display = "none";
    } else {
      var gx = window.innerWidth / 2;
      var gy = window.innerHeight / 2;
      var cx = gx;
      var cy = gy;

      window.addEventListener("mousemove", function (e) {
        gx = e.clientX;
        gy = e.clientY;
      }, { passive: true });

      var follow = function () {
        cx += (gx - cx) * 0.08;
        cy += (gy - cy) * 0.08;
        cursorGlow.style.left = cx + "px";
        cursorGlow.style.top = cy + "px";
        window.requestAnimationFrame(follow);
      };
      follow();
    }
  }
})();
