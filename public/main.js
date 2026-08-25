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

  /* ─── Portrait ───────────────────────────────────────────────────────────

     Rendered rather than written into the HTML so that the page is unchanged
     while no photo file exists — an <img> pointing at a missing file would
     show a broken icon on every page. When one is added, the surrounding
     section gets .has-portrait and the CSS lays out around it. */

  (function portrait() {
    if (!haveContent) return;

    var mounts = document.querySelectorAll('[data-render="portrait"]');
    if (!mounts.length) return;

    var profile = window.SITE.profile;
    if (!profile || typeof profile !== "object") return;

    // Same guard as the logos: local files only, never another host.
    if (!profile.photo || !/^\/img\/[A-Za-z0-9._-]+\.(webp|jpg|jpeg|png)$/i.test(String(profile.photo))) return;

    Array.prototype.forEach.call(mounts, function (mount) {
      var img = document.createElement("img");
      img.src = profile.photo;
      img.alt = profile.alt || "";
      img.className = "portrait";
      img.decoding = "async";
      // Reserves the right box before the file arrives, so nothing jumps.
      img.width = 600;
      img.height = 600;
      mount.appendChild(img);

      var section = mount.closest("section");
      if (section) section.classList.add("has-portrait");
    });
  })();

  /* ─── Career: shared helpers for both charts ─────────────────────────────

     Dates are written "YYYY-MM" in content.js and turned into a decimal year
     here, so the length of every bar is derived rather than typed. That means
     the current job's bar grows on its own and can never go stale. */

  function decimalYear(value, field) {
    var text = String(value == null ? "" : value).trim();

    if (/^present$/i.test(text)) {
      var now = new Date();
      return now.getFullYear() + now.getMonth() / 12;
    }

    var m = /^(\d{4})-(\d{2})$/.exec(text);
    if (!m) {
      throw new Error(
        '"' + field + '" must be written as "YYYY-MM" with a two-digit month ' +
        '(or "present"). Got: ' + (text || "nothing"));
    }

    var month = Number(m[2]);
    if (month < 1 || month > 12) throw new Error('"' + field + '" has month ' + month + ".");

    return Number(m[1]) + (month - 1) / 12;
  }

  /* A company logo, when one has been supplied. Only paths inside
     /img/logos/ are accepted, so the site can never be made to request an
     image from a third-party host. Anything else falls back to the tile. */
  var LOGO_PATH = /^\/img\/logos\/[A-Za-z0-9._-]+\.(svg|png|webp)$/i;

  function badge(entry, className) {
    var box = el("span", className);

    if (entry.logo && LOGO_PATH.test(String(entry.logo))) {
      var img = document.createElement("img");
      img.src = entry.logo;
      img.alt = (entry.company || "") + " logo";
      img.className = "logo-img";
      img.loading = "lazy";
      img.decoding = "async";
      /* If the file named here hasn't been added yet, fall back to the text
         tile rather than leaving a broken-image icon in the middle of the
         chart. That makes it safe to name a logo before uploading it. */
      img.onerror = function () {
        box.removeChild(img);
        box.classList.remove("has-logo");
        box.appendChild(el("span", "logo-text", entry.mark || entry.company || ""));
      };
      box.appendChild(img);
      box.classList.add("has-logo");
    } else {
      box.appendChild(el("span", "logo-text", entry.mark || entry.company || ""));
    }

    return box;
  }

  function spanYears(entry) {
    return decimalYear(entry.to, "to") - decimalYear(entry.from, "from");
  }

  /* Whole months between the two dates, so a label can read "4 yrs 2 mos"
     instead of "4.1". Rounded, because "present" lands mid-month. */
  function spanMonths(entry) {
    return Math.max(Math.round(spanYears(entry) * 12), 0);
  }

  /* A non-breaking space holds each number to its unit, so a narrow column
     wraps as "4 yrs" / "11 mos" rather than "4 yrs 11" / "mos". */
  var NB = "\u00A0";

  function formatDuration(months) {
    var y = Math.floor(months / 12);
    var m = months % 12;
    var parts = [];
    if (y) parts.push(y + NB + (y === 1 ? "yr" : "yrs"));
    if (m) parts.push(m + NB + (m === 1 ? "mo" : "mos"));
    return parts.length ? parts.join(" ") : "0" + NB + "mos";
  }

  /* ─── Chart animation ─────────────────────────────────────────────────────

     The bars carry their real size in CSS; a "--grow" multiplier on the plot
     scales them. Adding .is-armed pins --grow to 0, and removing it on the
     next frame lets the transition run 0 → full. Doing it that way round
     means a chart is full size when the stylesheet loads and JavaScript does
     not, so a failure here can never leave an empty chart behind.

     Plays once when the chart first scrolls into view, and replays on every
     click anywhere in its section, as requested. */

  function animateChart(plot) {
    if (!plot || !plot.classList) return;

    var reduce = window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    function play() {
      plot.classList.add("is-armed");
      void plot.offsetWidth;               // paint the zeroed state first
      requestAnimationFrame(function () {
        requestAnimationFrame(function () { plot.classList.remove("is-armed"); });
      });
    }

    /* The caller is still building the figure, so the plot has no parent yet.
       Wiring waits a frame, by which point section() has mounted it and
       closest() can actually find the surrounding <section>. */
    requestAnimationFrame(function () {
      var section = plot.closest ? plot.closest("section") : null;
      if (section) section.addEventListener("click", play);

      if (typeof IntersectionObserver === "function") {
        var seen = new IntersectionObserver(function (entries, obs) {
          entries.forEach(function (e) {
            if (e.isIntersecting) { play(); obs.disconnect(); }
          });
        }, { threshold: 0.25 });
        seen.observe(plot);
      } else {
        play();
      }
    });
  }

  function careerTable(entries, caption, includeYears) {
    var table = el("table", "chart__table");
    table.appendChild(el("caption", null, caption));

    var head = ["Organisation", "Role", "Period"];
    if (includeYears) head.push("Duration");

    var thead = el("thead");
    var hrow = el("tr");
    head.forEach(function (h) {
      var th = el("th", null, h);
      th.scope = "col";
      hrow.appendChild(th);
    });
    thead.appendChild(hrow);
    table.appendChild(thead);

    var tbody = el("tbody");
    entries.forEach(function (entry) {
      var tr = el("tr");
      tr.appendChild(cell("th", entry.company || ""));
      tr.appendChild(cell("td", entry.role || ""));
      tr.appendChild(cell("td", entry.dates || ""));
      if (includeYears) tr.appendChild(cell("td", formatDuration(spanMonths(entry))));
      tbody.appendChild(tr);
    });
    table.appendChild(tbody);

    return table;
  }

  /* ─── Timeline plot: every entry laid out on one shared time axis ────────

     Used twice: the career timeline on the home page, and the schooling
     timeline on the education page. Entries must carry company, dates, from
     and to; mark, logo, kind and current are optional. */

  function buildTimeline(entries, captionText, tableCaption) {
    if (!entries.length) return null;

    /* Newest first, top to bottom. Sorted here rather than relying on the
       order in content.js, so both plots agree however the list is written. */
    entries = entries.slice().sort(function (x, y) {
      return decimalYear(y.from, "from") - decimalYear(x.from, "from");
    });

    var starts = entries.map(function (e) { return decimalYear(e.from, "from"); });
    var ends = entries.map(function (e) { return decimalYear(e.to, "to"); });

    var min = Math.floor(Math.min.apply(null, starts));
    var max = Math.ceil(Math.max.apply(null, ends));
    var span = max - min;
    if (span <= 0) throw new Error("the timeline needs a start earlier than its end.");

    var pct = function (year) { return ((year - min) / span) * 100; };

    var figure = el("figure", "tl");
    var plot = el("div", "tl__plot");
    plot.setAttribute("aria-hidden", "true");

    var rows = el("ol", "tl__rows");

    entries.forEach(function (entry, i) {
      var from = starts[i];
      var to = ends[i];

      var row = el("li", "tl__row"
        + (entry.current ? " is-current" : "")
        + (entry.kind === "study" ? " is-study" : ""));

      row.appendChild(badge(entry, "tl__badge"));

      var main = el("div", "tl__main");

      var label = el("p", "tl__label");
      label.appendChild(el("span", "tl__co", entry.company || ""));
      if (entry.dates) label.appendChild(el("span", "tl__dates", entry.dates));
      main.appendChild(label);

      var track = el("div", "tl__track");
      var bar = el("span", "tl__bar");
      bar.style.left = pct(from).toFixed(2) + "%";
      /* The final width lives in --w; styles.css multiplies it by --grow so
         the bar can be animated out from its start date. */
      bar.style.setProperty("--w", Math.max(pct(to) - pct(from), 0.8).toFixed(2) + "%");

      /* A dropped pin on the job being done right now, sitting at the live
         end of its bar. Marked aria-hidden because the row already says the
         company, the role and "Present" in text. */
      if (entry.current) {
        var pin = el("span", "tl__pin");
        pin.setAttribute("aria-hidden", "true");
        pin.appendChild(el("span", "tl__pin-dot"));
        pin.appendChild(el("span", "tl__pin-text", "I'm Here!"));
        bar.appendChild(pin);
      }

      track.appendChild(bar);
      main.appendChild(track);

      row.style.setProperty("--i", String(i));   // stagger, newest bar first
      row.appendChild(main);
      rows.appendChild(row);
    });

    plot.appendChild(rows);

    // Year axis, aligned under the tracks by reusing the row grid. A short
    // span gets closer ticks, or a ten-year plot would show only two labels.
    var axis = el("div", "tl__axis");
    axis.appendChild(el("span", "tl__badge tl__badge--blank"));
    var ticks = el("div", "tl__ticks");
    /* Strictly inside the span: a tick sitting exactly on the right edge has
       its label clipped by the edge of the plot. */
    var step = span > 12 ? 5 : 2;
    for (var y = Math.ceil(min / step) * step; y < max; y += step) {
      var tick = el("span", "tl__tick", String(y));
      tick.style.left = pct(y).toFixed(2) + "%";
      ticks.appendChild(tick);
    }
    axis.appendChild(ticks);
    plot.appendChild(axis);

    figure.appendChild(plot);
    /* {max} is the last year actually worked or studied — not the axis bound,
       which is rounded up and would claim a year that never happened. */
    var lastYear = Math.floor(Math.max.apply(null, ends));
    figure.appendChild(el("figcaption", "tl__cap",
      captionText.replace("{min}", min).replace("{max}", lastYear)));
    figure.appendChild(careerTable(entries, tableCaption, false));

    animateChart(plot);
    return figure;
  }

  /* ─── Career timeline: study first, then every job, on one time axis ──── */

  section("career-timeline", "timeline", "Career timeline", function (entries) {
    return buildTimeline(entries, "Studies and roles, {min} to today", "Career timeline");
  });

  /* ─── Education timeline: the same plot, built from the education list ───

     The education entries use their own field names, so they are mapped onto
     the shape buildTimeline expects. Sorted oldest first here rather than
     relying on list order, so the cards below can stay newest-first. */

  section("education-timeline", "education", "Education timeline", function (items) {
    var withDates = items.filter(function (e) { return e.from && e.to; });
    if (!withDates.length) return null;

    var entries = withDates.map(function (e) {
      return {
        company: e.institution || "",
        mark: e.mark || "",
        logo: e.logo,
        role: e.credential || "",
        dates: e.dates || "",
        from: e.from,
        to: e.to,
        kind: "study",
      };
    });

    return buildTimeline(entries, "Schooling, {min} to {max}", "Education timeline");
  });

  /* ─── Column chart: how long each job lasted ─────────────────────────────

     Vertical columns at every width. Built from divs rather than an SVG so
     the company logo under each column is a real <img> that stays crisp,
     and so the labels never shrink with a viewBox. */

  section("timeline", "timeline", "Career chart", function (entries) {
    var jobs = entries.filter(function (e) { return e.kind !== "study"; })
      .sort(function (x, y) {                       // newest company first
        return decimalYear(y.from, "from") - decimalYear(x.from, "from");
      });
    if (!jobs.length) return null;

    var years = jobs.map(spanYears);
    var max = Math.ceil(Math.max.apply(null, years)) || 1;

    var figure = el("figure", "chart");

    var plot = el("div", "chart__plot");
    plot.setAttribute("aria-hidden", "true");
    plot.style.setProperty("--max", String(max));

    var bars = el("ol", "chart__bars");

    jobs.forEach(function (job, i) {
      var col = el("li", "chart__col" + (job.current ? " is-current" : ""));

      /* Hover detail: the exact dates the column covers, and the job title
         that goes with them. Set as an attribute and drawn by CSS, so there
         is no listener to run and nothing to clean up. Skipped when there is
         nothing to say, which is what the [data-tip] selector keys off. */
      var tip = [job.role, job.dates].filter(Boolean).join("\n");
      if (tip) col.setAttribute("data-tip", tip);

      col.style.setProperty("--yrs", years[i].toFixed(2));
      col.style.setProperty("--i", String(i));   // stagger, newest column first

      var track = el("div", "chart__track");
      track.appendChild(el("span", "chart__val", formatDuration(spanMonths(job))));
      track.appendChild(el("span", "chart__bar"));
      col.appendChild(track);

      col.appendChild(badge(job, "chart__mark"));
      col.appendChild(el("span", "chart__co", job.company || ""));

      bars.appendChild(col);
    });

    plot.appendChild(bars);
    figure.appendChild(plot);
    figure.appendChild(el("figcaption", "chart__cap", "Years and Months at each company, newest first"));
    figure.appendChild(careerTable(jobs, "Years spent at each company", true));

    animateChart(plot);
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

      var orgP = el("p", "role__org");
      var matchedTimeline = haveContent && window.SITE.timeline ? window.SITE.timeline.filter(function (t) {
        return role.company && t.company && (role.company.indexOf(t.company) !== -1 || t.company.indexOf(role.company) !== -1);
      }) : [];
      if (matchedTimeline.length && matchedTimeline[0].logo && LOGO_PATH.test(String(matchedTimeline[0].logo))) {
        var logoImg = document.createElement("img");
        logoImg.src = matchedTimeline[0].logo;
        logoImg.alt = "";
        logoImg.className = "role__logo";
        logoImg.loading = "lazy";
        logoImg.decoding = "async";
        orgP.appendChild(logoImg);
      }
      var orgText = [role.company, role.location].filter(Boolean).join(" · ");
      if (orgText) {
        orgP.appendChild(document.createTextNode(orgText));
        li.appendChild(orgP);
      }

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

  /* ─── Signal-strength bars ────────────────────────────────────────────────

     Five bars beside every skill, lit to the group's "level". Drawn from five
     spans rather than an image or an SVG so they take the accent colour in
     both themes and cost nothing to load.

     The graphic is hidden from screen readers and the group says its rating
     once in words instead: forty skills each announcing "four of five" is
     noise, and the level is a property of the group, not of the item. */

  function skillLevel(group) {
    var raw = Number(group && group.level);
    // Anything missing or nonsense shows a full set rather than an empty one:
    // a typo should never quietly demote a skill.
    if (!isFinite(raw)) return 5;
    return Math.min(Math.max(Math.round(raw), 0), 5);
  }

  function signalBars(level) {
    var sig = el("span", "sig");
    sig.setAttribute("aria-hidden", "true");
    for (var i = 1; i <= 5; i++) {
      sig.appendChild(el("span", "sig__bar" + (i <= level ? " is-lit" : "")));
    }
    return sig;
  }

  function levelNote(level) {
    return el("p", "sr-only",
      "Every skill in this group is rated " + level + " out of 5.");
  }

  section("skills", "skills", "Technical skills", function (groups) {
    if (!groups.length) return null;
    var wrap = el("div", "skills");

    groups.forEach(function (group) {
      var block = el("div", "skill");
      block.appendChild(el("h3", "skill__group", group.group || ""));

      var level = skillLevel(group);
      block.appendChild(levelNote(level));

      var ul = el("ul", "skill__items");
      list(group.items).forEach(function (item) {
        var li = el("li", "skill__item");
        li.appendChild(el("span", "skill__name", item));
        li.appendChild(signalBars(level));
        ul.appendChild(li);
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

    /* Where the work was done and when, above the project's own name — the
       same order the roles list uses. The row is skipped entirely when a
       project has neither, so an entry without them looks as it did. */
    if (project.company || project.dates) {
      var meta = el("p", "proj__meta");
      if (project.company || project.logo) {
        meta.appendChild(badge({
          company: project.company,
          mark: project.mark,
          logo: project.logo,
        }, "proj__logo"));
      }
      if (project.company) meta.appendChild(el("span", "proj__co", project.company));
      if (project.dates) meta.appendChild(el("span", "proj__dates", project.dates));
      li.appendChild(meta);
    }

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

      /* Same crest as the timeline plot above, on the same terms: a local
         file under /img/logos/, falling back to the lettered tile. badge()
         reads .company, so the institution is passed under that name. */
      li.appendChild(badge({
        company: item.institution,
        mark: item.mark,
        logo: item.logo,
      }, "edu__logo"));

      var body = el("div", "edu__body");
      if (item.dates) body.appendChild(el("p", "edu__dates", item.dates));
      body.appendChild(el("h3", "edu__cred", item.credential || ""));

      var org = [item.institution, item.location].filter(Boolean).join(" · ");
      if (org) body.appendChild(el("p", "edu__org", org));

      if (item.note) body.appendChild(el("p", "edu__note", item.note));

      li.appendChild(body);
      ul.appendChild(li);
    });

    return ul;
  });

  /* ─── Certifications, recognition and memberships ────────────────────────

     All three are the same card: an issuer logo in front, then the name and a
     line of detail. Built once here rather than three times, so the crest sits
     in the same place on all three pages.

     The logo is on the same terms as everywhere else on the site — a local
     file under /img/logos/, falling back to a lettered tile. badge() reads
     .company, so whoever issued the thing is passed under that name. */

  function creditCard(item, metaText) {
    var li = el("li", "cert");

    li.appendChild(badge({
      company: item.issuer || item.name,
      mark: item.mark,
      logo: item.logo,
    }, "cert__logo"));

    var body = el("div", "cert__body");
    body.appendChild(el("p", "cert__name", item.name || ""));
    if (metaText) body.appendChild(el("p", "cert__meta", metaText));
    li.appendChild(body);

    return li;
  }

  function creditList(mountName, dataKey, label, heading, metaOf) {
    section(mountName, dataKey, label, function (items) {
      if (!items.length) return null;
      var wrap = el("div", "certs__block");
      wrap.appendChild(el("h3", "certs__h", heading));

      var ul = el("ul", "certs");
      items.forEach(function (item) { ul.appendChild(creditCard(item, metaOf(item))); });
      wrap.appendChild(ul);

      return wrap;
    });
  }

  /* Each block disappears entirely when its list is empty. */
  creditList("certifications", "certifications", "Certifications",
    "Certifications & affiliations",
    function (c) { return [c.issuer, c.date].filter(Boolean).join(" · "); });

  creditList("recognition", "recognition", "Recognition",
    "Recognition",
    function (r) { return r.detail || ""; });

  /* ─── Soft skills ────────────────────────────────────────────────────────
     Same shape and same renderer style as the technical groups. */

  section("soft-skills", "softSkills", "Soft skills", function (groups) {
    if (!groups.length) return null;
    var wrap = el("div", "skills");

    groups.forEach(function (group) {
      var block = el("div", "skill");
      block.appendChild(el("h3", "skill__group", group.group || ""));

      var level = skillLevel(group);
      block.appendChild(levelNote(level));

      var ul = el("ul", "skill__list");
      list(group.items).forEach(function (item) {
        /* Bars first here, unlike the chips above: these are sentences of
           different lengths, and a leading bar gives the list one straight
           edge to read down instead of a ragged trailing one. */
        var li = el("li", "skill__row");
        li.appendChild(signalBars(level));
        li.appendChild(el("span", "skill__name", item));
        ul.appendChild(li);
      });
      block.appendChild(ul);
      wrap.appendChild(block);
    });

    return wrap;
  });

  /* ─── Organisations ──────────────────────────────────────────────────── */

  creditList("organizations", "organizations", "Organisations",
    "Professional bodies",
    function (o) { return [o.issuer, o.date].filter(Boolean).join(" · "); });

  /* ─── Hamburger menu ──────────────────────────────────────────────────────

     The rail renders as an ordinary block until this runs. Adding .js-nav to
     <html> is what turns it into a drawer, so if this file fails to load the
     navigation stays on the page instead of being sealed shut. */

  (function navDrawer() {
    var rail = document.querySelector(".rail");
    var button = document.getElementById("nav-toggle");
    if (!rail || !button) return;

    var backdrop = el("div", "nav-backdrop");
    document.body.appendChild(backdrop);

    var lastFocus = null;

    function setOpen(open, byUser) {
      /* One flag, on <html>: the stylesheet drives the drawer, the backdrop
         and the page push from it, and the inline head script can set it
         before the first paint so a restored drawer never causes a jump. */
      document.documentElement.classList.toggle("nav-open", open);
      button.setAttribute("aria-expanded", open ? "true" : "false");
      button.setAttribute("aria-label", open ? "Close menu" : "Open menu");

      /* Only move focus when the reader actually pressed the button. On a
         restore at page load, stealing focus would fight the browser and
         throw away the reading position. */
      if (byUser) {
        if (open) {
          lastFocus = document.activeElement;
          var first = rail.querySelector(".rail__nav a");
          if (first) first.focus();
        } else if (lastFocus && lastFocus.focus) {
          lastFocus.focus();
        }
      }

      try { localStorage.setItem("nav", open ? "open" : "closed"); } catch (e) {}
    }

    /* The button is the only thing that closes the drawer, by request. There
       is deliberately no dismiss on the backdrop, on Escape, or on following
       a link — it stays open until the X is pressed. */
    button.addEventListener("click", function () {
      setOpen(button.getAttribute("aria-expanded") !== "true", true);
    });

    /* Every navigation is a full page load, so without remembering the state
       the drawer would shut itself the moment a link inside it was used —
       which is exactly the collapse the button is supposed to be in charge
       of. Restored without animating, so the page doesn't slide on arrival. */
    var wasOpen = document.documentElement.classList.contains("nav-open");
    setOpen(wasOpen, false);

    /* The head script decided drawer-or-not from the viewport before paint.
       Follow it across the breakpoint too, so rotating a tablet or dragging a
       window narrow hands back the plain top navigation rather than leaving a
       drawer with no way to open it. */
    if (window.matchMedia) {
      var wide = window.matchMedia("(min-width: 48rem)");
      var apply = function () {
        document.documentElement.classList.toggle("js-nav", wide.matches);
        if (!wide.matches) document.documentElement.classList.remove("nav-open");
      };
      if (wide.addEventListener) wide.addEventListener("change", apply);
      else if (wide.addListener) wide.addListener(apply);
    }
  })();

  /* ─── Title entrances ─────────────────────────────────────────────────────

     Every page title and section heading lifts into place the first time it
     scrolls into view. The hidden state is added here rather than in the
     stylesheet, and only to headings that are genuinely being observed, so
     a heading can never be left invisible by a script that failed or a
     browser without IntersectionObserver. */

  (function revealTitles() {
    var reduce = window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || typeof IntersectionObserver !== "function") return;

    var titles = document.querySelectorAll(".sheet h1, .sheet h2");
    if (!titles.length) return;

    /* Threshold 0 and no rootMargin on purpose: a heading reveals the moment
       any part of it touches the viewport. Pulling the trigger line inwards
       reads slightly better, but it risks stranding a heading that sits close
       to the bottom of a short page — the page can run out of scroll before
       that heading ever crosses the line, leaving it invisible for good. Not
       worth the polish. */
    var io = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add("is-revealed");
        obs.unobserve(e.target);       // one entrance each, not on every pass
      });
    }, { threshold: 0 });

    Array.prototype.forEach.call(titles, function (title) {
      title.classList.add("reveal");
      io.observe(title);
    });
  })();

  /* ─── Reading progress ────────────────────────────────────────────────────

     A 2px accent hairline across the top of the window, tracking how far down
     the page you have read. Built here rather than written into twelve page
     files, and it occupies no space in the layout — if this never runs, the
     pages are exactly as they were.

     Nothing is drawn on a page short enough to need no scrolling, where a bar
     that is either empty or full says nothing. */

  (function readingProgress() {
    var doc = document.documentElement;

    var wrap = el("div", "progress");
    wrap.setAttribute("aria-hidden", "true");
    var bar = el("span", "progress__bar");
    wrap.appendChild(bar);
    document.body.appendChild(wrap);

    var queued = false;

    function paint() {
      queued = false;
      var scrollable = doc.scrollHeight - window.innerHeight;
      // A few pixels of slack, so rounding on a barely-scrolling page does
      // not leave a sliver of bar sitting there permanently.
      if (scrollable < 8) {
        wrap.style.display = "none";
        return;
      }
      wrap.style.display = "";
      var ratio = (window.pageYOffset || doc.scrollTop || 0) / scrollable;
      bar.style.transform = "scaleX(" + Math.min(Math.max(ratio, 0), 1).toFixed(4) + ")";
    }

    function schedule() {
      if (queued) return;
      queued = true;
      requestAnimationFrame(paint);
    }

    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    /* The charts and lists are rendered by this same file and change the page
       height after it runs, so measure again once that has settled. */
    window.addEventListener("load", schedule);
    paint();
  })();

  /* ─── External links open in a new tab ───────────────────────────────────

     Done here rather than by hand in twelve page files: every link, including
     the ones rendered from content.js, and nothing to remember the next time
     a link is added from a phone.

     Anything pointing at another host gets it. Same-site links, mailto: and
     in-page anchors are left alone — a new tab for those is just a lost back
     button. rel="noopener" is not optional with target="_blank": without it
     the opened page gets a handle on this one through window.opener. */

  (function externalLinks() {
    var links = document.querySelectorAll('a[href^="http"]');

    Array.prototype.forEach.call(links, function (a) {
      if (a.hostname === window.location.hostname) return;
      a.target = "_blank";

      /* Keep any rel already written into the page — several links carry
         rel="me", which is what tells other sites the profile is really his. */
      var rel = (a.getAttribute("rel") || "").split(/\s+/).filter(Boolean);
      ["noopener", "noreferrer"].forEach(function (token) {
        if (rel.indexOf(token) === -1) rel.push(token);
      });
      a.setAttribute("rel", rel.join(" "));

      /* Says out loud what the icon-free link cannot: this leaves the site. */
      if (!a.querySelector(".sr-only") && !/opens in a new tab/i.test(a.getAttribute("aria-label") || "")) {
        var note = el("span", "sr-only", " (opens in a new tab)");
        a.appendChild(note);
      }
    });
  })();

  /* ─── Acronyms ────────────────────────────────────────────────────────────

     Wraps the first mention of each glossary term, per block of explanation,
     in an <abbr> carrying its definition. The copy in the page files and in
     content.js stays plain text: a term is defined once in the glossary and
     is then defined everywhere it appears.

     Text nodes only, and built with createElement and splitText rather than
     innerHTML — the same rule the rest of this file follows. Headings, links
     and anything already marked up are skipped: a definition inside a link
     would be unreachable, and a heading is not where you stop to read one. */

  (function acronyms() {
    if (!haveContent) return;

    var glossary = window.SITE.glossary;
    if (!glossary || typeof glossary !== "object") return;

    var terms = Object.keys(glossary).filter(function (t) {
      return /^[A-Za-z0-9./-]{2,12}$/.test(t);
    });
    if (!terms.length) return;

    /* Longest first, so "URWB" is matched before a shorter term that happens
       to be a prefix of it. \b on both ends keeps "CW" out of the middle of
       a word. */
    terms.sort(function (a, b) { return b.length - a.length; });
    var pattern = new RegExp("\\b(" + terms.join("|") + ")\\b");

    var SKIP = "a, h1, h2, h3, h4, abbr, code, .eyebrow, .chart, .tl, .secrail";

    Array.prototype.forEach.call(
      document.querySelectorAll(".prose, .diagram-explain"),
      function (block) {
        var seen = {};
        var walker = document.createTreeWalker(block, NodeFilter.SHOW_TEXT, null);
        var nodes = [];
        while (walker.nextNode()) nodes.push(walker.currentNode);

        nodes.forEach(function (node) {
          if (node.parentElement && node.parentElement.closest(SKIP)) return;

          var match = pattern.exec(node.nodeValue);
          if (!match) return;

          var term = match[1];
          // Case has to match the glossary key, or "das" in prose would be
          // marked up as the acronym.
          if (!Object.prototype.hasOwnProperty.call(glossary, term)) return;
          if (seen[term]) return;
          seen[term] = true;

          var rest = node.splitText(match.index);
          rest.splitText(term.length);

          var abbr = el("abbr", null, term);
          abbr.setAttribute("data-def", String(glossary[term]));
          abbr.setAttribute("title", String(glossary[term]));
          abbr.tabIndex = 0;
          rest.parentNode.replaceChild(abbr, rest);
        });
      }
    );
  })();

  /* ─── Section rail ────────────────────────────────────────────────────────

     A page opts in with data-rail on its <main>. The rail is built from the
     page's own section headings, so it can never fall out of step with them,
     and it marks the section you are currently reading.

     The stylesheet only shows it where there is room beside the reading
     column; it is harmless everywhere else. */

  (function sectionRail() {
    var main = document.querySelector("[data-rail]");
    if (!main || typeof IntersectionObserver !== "function") return;

    var sections = Array.prototype.filter.call(
      main.querySelectorAll("section[id]"),
      function (sec) { return sec.querySelector("h2"); }
    );
    if (sections.length < 4) return;

    var nav = el("nav", "secrail");
    nav.setAttribute("aria-label", "On this page");
    nav.appendChild(el("p", "secrail__h", "On this page"));

    var links = sections.map(function (sec) {
      var heading = sec.querySelector("h2");
      var a = el("a", null, (heading.textContent || "").trim());
      a.href = "#" + sec.id;
      nav.appendChild(a);
      return a;
    });

    document.body.appendChild(nav);

    function mark(index) {
      links.forEach(function (a, i) {
        if (i === index) a.setAttribute("aria-current", "true");
        else a.removeAttribute("aria-current");
      });
    }
    mark(0);

    /* The topmost section still touching the upper third of the viewport is
       the one being read. Tracking visibility ratios instead would flicker
       between two sections whenever a short one sits beside a long one. */
    var io = new IntersectionObserver(function () {
      var line = window.innerHeight / 3;
      var current = 0;
      sections.forEach(function (sec, i) {
        if (sec.getBoundingClientRect().top <= line) current = i;
      });
      mark(current);
    }, { rootMargin: "-33% 0px -66% 0px", threshold: 0 });

    sections.forEach(function (sec) { io.observe(sec); });
    window.addEventListener("scroll", function () {
      var line = window.innerHeight / 3;
      var current = 0;
      sections.forEach(function (sec, i) {
        if (sec.getBoundingClientRect().top <= line) current = i;
      });
      mark(current);
    }, { passive: true });
  })();

  /* ─── Send me a message ───────────────────────────────────────────────────

     Checking is done here rather than left to the browser, so the wording is
     ours and reads the same everywhere. The form carries novalidate for that
     reason; every field is still marked required, so a reader without
     JavaScript gets the browser's own checking instead of none.

     WHERE THE MESSAGE GOES is the one line below. The form posts JSON to the
     Worker route in ROADMAP.md item 1. Until that route exists the post comes
     back 404, and rather than lose what somebody typed, the message is handed
     to their mail app with every field already filled in. */

  var CONTACT_ENDPOINT = "/api/contact";
  var CONTACT_ADDRESS = "contact@sajibislam.com";

  (function messageForm() {
    var form = document.getElementById("msg-form");
    if (!form) return;

    var status = form.querySelector(".msg__status");
    var button = form.querySelector("button[type=submit]");

    function field(id) { return document.getElementById(id); }

    function say(node, text) {
      var slot = form.querySelector('.field__status[data-for="' + node.id + '"]');
      if (slot) slot.textContent = text || "";
      var wrap = node.closest(".field");
      if (wrap) wrap.classList.toggle("is-wrong", !!text);
    }

    /* An address needs an @, something on both sides of it, and a dot in the
       domain with at least two letters after it — which is what rules out
       "sajib@gmail" and "sajib@gmail." while still allowing .co.uk and any
       country domain. Deliberately not the full RFC pattern: that one accepts
       addresses no mail server would take, and rejecting a real address is
       worse than accepting a fake one the reply will simply bounce off. */
    var EMAIL = /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)*\.[A-Za-z]{2,}$/;

    function check() {
      var ok = true;

      [["msg-first", "Your first name, please."],
       ["msg-last",  "Your last name, please."]].forEach(function (pair) {
        var node = field(pair[0]);
        if (!node.value.trim()) { say(node, pair[1]); ok = false; }
        else say(node, "");
      });

      var email = field("msg-email");
      var value = email.value.trim();
      if (!value) { say(email, "An email address, so I can reply."); ok = false; }
      else if (value.indexOf("@") === -1) { say(email, "That is missing an @."); ok = false; }
      else if (!EMAIL.test(value)) {
        say(email, "That does not look complete — check the part after the @, like .com or .ca.");
        ok = false;
      } else say(email, "");

      var body = field("msg-body");
      if (body.value.trim().length < 10) {
        say(body, "A line or two about what you need.");
        ok = false;
      } else say(body, "");

      return ok;
    }

    function setStatus(text, kind) {
      status.textContent = text;
      status.classList.toggle("is-bad", kind === "bad");
      status.classList.toggle("is-good", kind === "good");
    }

    /* Everything typed, handed to the reader's mail app. Used when the Worker
       route is not there — the message is never silently dropped. */
    function handToMailApp(data) {
      var body = "From: " + data.first + " " + data.last +
        "\nEmail: " + data.email + "\n\n" + data.message + "\n";
      window.location.href = "mailto:" + CONTACT_ADDRESS +
        "?subject=" + encodeURIComponent("Website message from " + data.first + " " + data.last) +
        "&body=" + encodeURIComponent(body);
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      // A bot filled the hidden field. Say nothing useful and stop.
      if (field("msg-website").value) { setStatus("Thanks — message sent.", "good"); return; }

      if (!check()) {
        setStatus("Please check the fields marked above.", "bad");
        return;
      }

      var data = {
        first: field("msg-first").value.trim(),
        last: field("msg-last").value.trim(),
        email: field("msg-email").value.trim(),
        message: field("msg-body").value.trim(),
      };

      button.disabled = true;
      setStatus("Sending…", null);

      fetch(CONTACT_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }).then(function (res) {
        if (res.ok) {
          setStatus("Thanks — your message is on its way. I usually reply within a day or two.", "good");
          form.reset();
          return;
        }
        /* Carry the server's own reason forward rather than swallowing it.
           Without this every failure looks identical from the page, and the
           difference between "the route is not deployed", "the key is not
           set" and "the mail provider refused it" is invisible. */
        return res.json().catch(function () { return {}; }).then(function (payload) {
          throw new Error((payload && payload.error) || ("The server answered " + res.status + "."));
        });
      }).catch(function (err) {
        var reason = err && err.message ? err.message + " " : "";
        setStatus(reason + "Opening your email app instead — press send there and it reaches me.", "bad");
        handToMailApp(data);
      }).then(function () {
        button.disabled = false;
      });
    });

    /* Clears a complaint as soon as the reader fixes it, rather than making
       them press the button again to find out. */
    ["msg-first", "msg-last", "msg-email", "msg-body"].forEach(function (id) {
      var node = field(id);
      node.addEventListener("input", function () {
        if (node.closest(".field").classList.contains("is-wrong")) check();
      });
    });
  })();

  /* ─── Theme toggle ───────────────────────────────────────────────────── */

  (function theme() {
    var button = document.getElementById("theme-toggle");
    if (!button) return;

    var label = button.querySelector(".toggle__label");
    var iconWrap = button.querySelector(".toggle__icon");
    var root = document.documentElement;
    var media = window.matchMedia("(prefers-color-scheme: dark)");

    var sunSVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>';
    var moonSVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>';

    function isDark() {
      return root.dataset.theme ? root.dataset.theme === "dark" : media.matches;
    }

    function paint() {
      var dark = isDark();
      var next = dark ? "light" : "dark";
      if (label) label.textContent = dark ? "Light" : "Dark";
      if (iconWrap) iconWrap.innerHTML = dark ? sunSVG : moonSVG;
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
