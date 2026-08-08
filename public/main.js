/* ═══════════════════════════════════════════════════════════════════════════
   main.js — turns content/content.js into the pages, plus the theme toggle.

   The same file runs on all four pages. Each page contains only the mount
   points it needs; anything it doesn't have is skipped silently.

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

  function cell(tag, text) {
    var node = el(tag, null, text);
    if (tag === "th") node.scope = "row";
    return node;
  }

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

  /* Renders one section into its placeholder. If the content for that section
     is malformed, only that section fails — the rest of the page is fine and
     the reader sees a note saying which file to look at.

     mountName is the data-render="..." value; dataKey is the list in
     content.js. They differ where one list feeds two different views. */
  function section(mountName, dataKey, label, build) {
    if (!haveContent) return;

    var mount = document.querySelector('[data-render="' + mountName + '"]');
    if (!mount) return;

    try {
      var raw = window.SITE[dataKey];

      // Present but not a list — e.g. a stray bracket turned [ ] into { }.
      // Without this check the section would just silently disappear.
      if (raw !== undefined && !Array.isArray(raw)) {
        throw new Error('"' + dataKey + '" must be a list wrapped in square brackets [ ].');
      }

      var node = build(list(raw), mount);
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

  /* ─── Career chart ───────────────────────────────────────────────────────

     Built from divs rather than an SVG on purpose: it has to turn from
     vertical bars into horizontal ones on a narrow screen, and CSS can do
     that to a grid but not to a fixed SVG viewBox.

     The bars are decorative — the table underneath carries the same numbers
     and is what a screen reader reads. */

  section("timeline", "timeline", "Career chart", function (jobs) {
    if (!jobs.length) return null;

    var max = 0;
    jobs.forEach(function (j) {
      var y = Number(j.years);
      if (isFinite(y) && y > max) max = y;
    });
    if (max <= 0) throw new Error('every entry in "timeline" needs a "years" number.');
    max = Math.ceil(max);

    var figure = el("figure", "chart");

    var plot = el("div", "chart__plot");
    plot.setAttribute("aria-hidden", "true");
    plot.style.setProperty("--max", String(max));

    var bars = el("ol", "chart__bars");

    jobs.forEach(function (job) {
      var years = Number(job.years) || 0;

      var col = el("li", "chart__col" + (job.current ? " is-current" : ""));
      col.style.setProperty("--yrs", String(years));

      var track = el("div", "chart__track");
      track.appendChild(el("span", "chart__val", years.toFixed(1)));
      track.appendChild(el("span", "chart__bar"));
      col.appendChild(track);

      // The company "logo": a wordmark tile set in the site's own type.
      // Swap in a real logo later by replacing this span with an <img>.
      col.appendChild(el("span", "chart__mark", job.mark || job.company || ""));
      col.appendChild(el("span", "chart__co", job.company || ""));

      bars.appendChild(col);
    });

    plot.appendChild(bars);
    figure.appendChild(plot);
    figure.appendChild(el("figcaption", "chart__cap", "Years at each company, oldest first"));

    // Accessible equivalent of the chart.
    var table = el("table", "chart__table");
    table.appendChild(el("caption", null, "Years spent at each company"));

    var thead = el("thead");
    var hrow = el("tr");
    ["Company", "Role", "Period", "Years"].forEach(function (h) {
      var th = el("th", null, h);
      th.scope = "col";
      hrow.appendChild(th);
    });
    thead.appendChild(hrow);
    table.appendChild(thead);

    var tbody = el("tbody");
    jobs.forEach(function (job) {
      var tr = el("tr");
      tr.appendChild(cell("th", job.company || ""));
      tr.appendChild(cell("td", job.role || ""));
      tr.appendChild(cell("td", job.dates || ""));
      tr.appendChild(cell("td", (Number(job.years) || 0).toFixed(1)));
      tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    figure.appendChild(table);

    return figure;
  });

  /* ─── Experience ─────────────────────────────────────────────────────── */

  section("experience", "experience", "Experience", function (roles) {
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

  section("skills", "skills", "Technical skills", function (groups) {
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

  /* ─── Projects ───────────────────────────────────────────────────────────
     Two views of one list: three cards on the home page, everything with the
     longer write-up on /projects/. */

  function projectCard(project, useDetail) {
    var li = el("li", "proj");

    li.appendChild(el("h3", "proj__name", project.name || ""));

    if (project.outcome) li.appendChild(el("p", "proj__outcome", project.outcome));

    var body = useDetail && project.detail ? project.detail : project.blurb;
    if (body) li.appendChild(el("p", "proj__blurb", body));

    var tech = list(project.tech);
    if (tech.length) {
      var ul = el("ul", "proj__tech");
      tech.forEach(function (t) { ul.appendChild(el("li", null, t)); });
      li.appendChild(ul);
    }

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

    return li;
  }

  section("projects-featured", "projects", "Projects", function (projects) {
    var picked = projects.filter(function (p) { return p.featured; });
    if (!picked.length) picked = projects.slice(0, 3);
    if (!picked.length) return null;

    var ul = el("ul", "projects");
    picked.forEach(function (p) { ul.appendChild(projectCard(p, false)); });
    return ul;
  });

  section("projects", "projects", "Projects", function (projects) {
    if (!projects.length) return null;
    var ul = el("ul", "projects projects--full");
    projects.forEach(function (p) { ul.appendChild(projectCard(p, true)); });
    return ul;
  });

  /* ─── Education ──────────────────────────────────────────────────────── */

  section("education", "education", "Education", function (items) {
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

  /* ─── Certifications (block disappears entirely when the list is empty) ── */

  section("certifications", "certifications", "Certifications", function (certs) {
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

  /* ─── Recognition ────────────────────────────────────────────────────── */

  section("recognition", "recognition", "Recognition", function (items) {
    if (!items.length) return null;
    var wrap = el("div", "certs__block");
    wrap.appendChild(el("h3", "certs__h", "Recognition"));

    var ul = el("ul", "certs");
    items.forEach(function (item) {
      var li = el("li", "cert");
      li.appendChild(el("p", "cert__name", item.name || ""));
      if (item.detail) li.appendChild(el("p", "cert__meta", item.detail));
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

})();
