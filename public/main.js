/* ═══════════════════════════════════════════════════════════════════════════
   main.js — turns content/content.js into the page, plus the theme toggle.

   You should not need to edit this file to change what the site says.
   Everything you normally change lives in content/content.js.
   ═══════════════════════════════════════════════════════════════════════════ */

(function () {
  "use strict";

  /* ─── Small DOM helpers. Text is always set with textContent, never HTML,
         so a stray < or & in your content can never break the page. ─────── */

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = String(text);
    return node;
  }

  function list(values) {
    return Array.isArray(values) ? values : [];
  }

  /* Renders one section into its placeholder. If the content for that section
     is malformed, only that section fails — the rest of the page is fine and
     the reader sees a note saying which file to look at. */
  /* If content.js failed to load or parse at all, every section would quietly
     vanish. Say so once, loudly, instead — and keep the rest of the page
     (theme toggle, navigation) working. */
  var haveContent = !!window.SITE && typeof window.SITE === "object";

  if (!haveContent) {
    var first = document.querySelector("[data-render]");
    if (first) {
      var warn = el("div", "render-error");
      warn.appendChild(el("p", null,
        "content/content.js did not load. Usually this means there is a typo in " +
        "that file — a missing comma, quote mark or bracket. Open it in GitHub " +
        "and check your most recent edit, or undo it."));
      first.appendChild(warn);
    }
  }

  function section(key, label, build) {
    if (!haveContent) return;

    var mount = document.querySelector('[data-render="' + key + '"]');
    if (!mount) return;

    try {
      var raw = window.SITE[key];

      // Present but not a list — e.g. a stray bracket turned [ ] into { }.
      // Without this check the section would just silently disappear.
      if (raw !== undefined && !Array.isArray(raw)) {
        throw new Error('"' + key + '" must be a list wrapped in square brackets [ ].');
      }

      var node = build(list(raw));
      if (node) mount.appendChild(node);
    } catch (err) {
      var box = el("div", "render-error");
      box.appendChild(el("p", null,
        "The " + label + " section could not be displayed. There is a mistake in " +
        "content/content.js — check for a missing comma or quote mark."));
      var detail = el("p", null, "");
      detail.appendChild(el("code", null, String(err && err.message ? err.message : err)));
      box.appendChild(detail);
      mount.appendChild(box);
    }
  }

  /* ─── Experience ─────────────────────────────────────────────────────── */

  section("experience", "Experience", function (roles) {
    if (!roles.length) return null;
    var ul = el("ul", "roles");

    roles.forEach(function (role) {
      var li = el("li", "role");

      var dates = el("p", "role__dates");
      dates.appendChild(el("span", null, role.dates || ""));
      if (role.current) dates.appendChild(el("span", "role__flag", "Current"));
      li.appendChild(dates);

      li.appendChild(el("h3", "role__title", role.title || ""));

      var org = [role.company, role.location].filter(Boolean).join(" · ");
      if (org) li.appendChild(el("p", "role__org", org));

      var bullets = list(role.bullets);
      if (bullets.length) {
        var ol = el("ul", "role__bullets");
        bullets.forEach(function (b) { ol.appendChild(el("li", null, b)); });
        li.appendChild(ol);
      }

      ul.appendChild(li);
    });

    return ul;
  });

  /* ─── Skills ─────────────────────────────────────────────────────────── */

  section("skills", "Technical skills", function (groups) {
    if (!groups.length) return null;
    var wrap = el("div", "skills");

    groups.forEach(function (group) {
      var block = el("div", "skill");
      block.appendChild(el("h3", "skill__group", group.group || ""));

      var ul = el("ul", "skill__items");
      list(group.items).forEach(function (item) {
        ul.appendChild(el("li", null, item));
      });
      block.appendChild(ul);

      wrap.appendChild(block);
    });

    return wrap;
  });

  /* ─── Projects ───────────────────────────────────────────────────────── */

  section("projects", "Projects", function (projects) {
    if (!projects.length) return null;
    var ul = el("ul", "projects");

    projects.forEach(function (project) {
      var li = el("li", "proj");

      li.appendChild(el("h3", "proj__name", project.name || ""));

      if (project.blurb) li.appendChild(el("p", "proj__blurb", project.blurb));

      var tech = list(project.tech);
      if (tech.length) li.appendChild(el("p", "proj__tech", tech.join("  ·  ")));

      // Only http(s) links are rendered, so a mistyped link can never turn
      // into a javascript: URL.
      if (project.link && /^https?:\/\//i.test(project.link)) {
        var p = el("p", "proj__link");
        var a = el("a", "link", project.linkLabel || "View project");
        a.href = project.link;
        a.rel = "noopener";
        p.appendChild(a);
        li.appendChild(p);
      }

      ul.appendChild(li);
    });

    return ul;
  });

  /* ─── Education ──────────────────────────────────────────────────────── */

  section("education", "Education", function (items) {
    if (!items.length) return null;
    var ul = el("ul", "edu");

    items.forEach(function (item) {
      var li = el("li", "edu__item");

      if (item.dates) li.appendChild(el("p", "edu__dates", item.dates));
      li.appendChild(el("h3", "edu__cred", item.credential || ""));

      var org = [item.institution, item.location].filter(Boolean).join(" · ");
      if (org) li.appendChild(el("p", "edu__org", org));

      if (item.note) li.appendChild(el("p", "edu__note", item.note));

      ul.appendChild(li);
    });

    return ul;
  });

  /* ─── Certifications (section disappears entirely when the list is empty) */

  section("certifications", "Certifications", function (certs) {
    if (!certs.length) return null;
    var wrap = el("div", "certs__block");
    wrap.appendChild(el("h3", "certs__h", "Certifications & affiliations"));

    var ul = el("ul", "certs");
    certs.forEach(function (cert) {
      var li = el("li", "cert");
      li.appendChild(el("p", "cert__name", cert.name || ""));

      var meta = [cert.issuer, cert.date].filter(Boolean).join(" · ");
      if (meta) li.appendChild(el("p", "cert__meta", meta));

      ul.appendChild(li);
    });
    wrap.appendChild(ul);

    return wrap;
  });

  /* ─── Theme toggle ───────────────────────────────────────────────────── */

  (function theme() {
    var button = document.getElementById("theme-toggle");
    if (!button) return;

    var label = button.querySelector(".toggle__label");
    var root = document.documentElement;
    var media = window.matchMedia("(prefers-color-scheme: dark)");

    function isDark() {
      return root.dataset.theme ? root.dataset.theme === "dark" : media.matches;
    }

    // The button is named for what it does, not for the state it is in.
    function paint() {
      var next = isDark() ? "light" : "dark";
      if (label) label.textContent = next === "dark" ? "Dark" : "Light";
      button.setAttribute("aria-label", "Switch to " + next + " theme");
    }

    button.addEventListener("click", function () {
      var next = isDark() ? "light" : "dark";
      root.dataset.theme = next;
      try { localStorage.setItem("theme", next); } catch (e) {}
      paint();
    });

    // Follow the system if the reader has never chosen manually.
    if (media.addEventListener) {
      media.addEventListener("change", function () { if (!root.dataset.theme) paint(); });
    }

    paint();
  })();

  /* ─── Mark the section currently in view in the navigation.
         Uses IntersectionObserver, not a scroll handler, so it costs nothing
         while the reader scrolls. ──────────────────────────────────────── */

  (function activeSection() {
    if (!("IntersectionObserver" in window)) return;

    var links = {};
    var targets = [];

    document.querySelectorAll('.rail__nav a[href^="#"]').forEach(function (a) {
      var id = a.getAttribute("href").slice(1);
      var target = document.getElementById(id);
      if (!target) return;
      links[id] = a;
      targets.push(target);
    });

    if (!targets.length) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var a = links[entry.target.id];
        if (!a) return;
        if (entry.isIntersecting) a.setAttribute("aria-current", "true");
        else a.removeAttribute("aria-current");
      });
    }, { rootMargin: "-45% 0px -50% 0px" });

    targets.forEach(function (t) { observer.observe(t); });
  })();

})();
