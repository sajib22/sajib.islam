/* ═══════════════════════════════════════════════════════════════════════════
   The DAS explainer animation.

   A seven-scene loop over the isometric artwork: the camera pushes into the
   donor antenna, follows the coax down to the head end, climbs the fibre
   riser, watches the remote units drive the indoor antennas, then runs out to
   the expansion units before pulling back to the whole system.

   Every path and coordinate below is measured off the artwork's own 1000x1007
   pixels, which is the same space /img/das-image.webp is drawn in and the
   same space the riser paths on this page have always used. Change the
   artwork and these numbers change with it.

   THE MODEL. The whole thing is a pure function of one number: T, seconds
   into the loop. Nothing is stateful, nothing is tweened by the browser —
   each frame computes T, then writes attributes. That is what keeps the
   camera, the pulses travelling along the cables and the captions in step
   with each other at any frame rate, and it is why the loop can be scrubbed
   to any point and look right.

   THE STAGE. Choreography is authored in a fixed 1920x1080 space so the
   camera arithmetic is readable, and the whole space is then scaled to
   whatever width the figure actually has. One scale factor, set on resize,
   rather than a responsive value on every element.

   No dependency, no build step: this is the React prototype's scene rewritten
   as the plain DOM calls it compiles to. See CONTRIBUTING.md before editing.
   ═══════════════════════════════════════════════════════════════════════════ */

(function () {
  "use strict";

  var stage = document.querySelector("[data-das-anim]");
  if (!stage) return;

  var still = stage.querySelector(".dasx__still");
  if (!still) return;

  /* Below this the 1920-wide space scales down so far that a caption would
     render at about six pixels. The artwork stays, as a plain image, and
     .diagram__alt carries the description — same arrangement the page used
     before the animation existed. */
  var WIDE = window.matchMedia ? window.matchMedia("(min-width: 46rem)") : null;
  var CALM = window.matchMedia
    ? window.matchMedia("(prefers-reduced-motion: reduce)")
    : null;

  /* ─── The authored timeline ──────────────────────────────────────────────
     Durations in seconds. CUES are the cumulative starts derived from them,
     so re-timing a scene is a single number here and everything keyed to that
     cue moves with it. */

  var SCENES = [
    ["Establish", 2.2],
    ["Donor", 2.6],
    ["HeadEnd", 2.3],
    ["Riser", 3.0],
    ["Antennas", 2.6],
    ["Expansion", 3.0],
    ["Legend", 2.3]
  ];

  var CUE = {};
  (function () {
    var acc = 0;
    for (var i = 0; i < SCENES.length; i++) {
      CUE[SCENES[i][0]] = acc;
      acc += SCENES[i][1];
    }
    CUE.END = acc;
  })();

  /* ─── Geometry, traced against the artwork ───────────────────────────── */

  var IMG_W = 1000, IMG_H = 1007;
  var VW = 1920, VH = 1080;

  var P = {
    donor:  "M413 30 L413 659 L387 675",
    bdaHe:  "M341 702 L305 726",
    btsHe:  "M146 718 L233 772 L261 753",
    riserA: "M279 733 L279 300",
    riserB: "M598 545 L598 252",
    riserC: "M859 780 L859 484",
    euB:    "M428 567 L434 561 L523 505 L589 548",
    euC:    "M429 575 L466 550 L760 730 L856 788"
  };

  var ANT_Y = [283, 376, 445, 513, 581];

  /* Each floor: the remote unit feeds a splitter, which feeds two antennas. */
  var BRANCH_A = [];
  var ANT_A = [];
  ANT_Y.forEach(function (y) {
    BRANCH_A.push("M250 " + (y - 6) + " L228 " + (y - 16) + " L207 " + (y - 6));
    BRANCH_A.push("M228 " + (y - 16) + " L248 " + (y - 36));
    ANT_A.push([201, y]);
    ANT_A.push([253, y - 38]);
  });

  /* ─── Small maths ────────────────────────────────────────────────────── */

  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
  function easeInOut(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  /* Visible between two times, fading in and out at the edges. */
  function win(T, a, b, fade) {
    fade = fade || 0.35;
    return clamp((T - a) / fade, 0, 1) * clamp((b - T) / fade, 0, 1);
  }
  function step(T, a, fade) {
    return clamp((T - a) / (fade || 0.4), 0, 1);
  }

  /* ─── The camera ─────────────────────────────────────────────────────────
     Keyframes of position in artwork coordinates plus a zoom. Between two
     keyframes the move is eased, so a push settles rather than stopping
     dead. */

  var CAM = [
    { t: 0,                      x: 500, y: 496, z: 0.86 },
    { t: CUE.Donor - 0.35,       x: 505, y: 492, z: 0.90 },
    { t: CUE.Donor + 0.45,       x: 400, y: 352, z: 1.28 },
    { t: CUE.HeadEnd - 0.2,      x: 394, y: 392, z: 1.34 },
    { t: CUE.HeadEnd + 0.5,      x: 244, y: 726, z: 2.05 },
    { t: CUE.Riser + 0.25,       x: 276, y: 700, z: 1.95 },
    { t: CUE.Riser + 2.5,        x: 278, y: 330, z: 1.95 },
    { t: CUE.Antennas + 0.6,     x: 244, y: 420, z: 2.00 },
    { t: CUE.Antennas + 2.3,     x: 250, y: 430, z: 2.10 },
    { t: CUE.Expansion + 0.8,    x: 630, y: 560, z: 1.02 },
    { t: CUE.Expansion + 2.8,    x: 648, y: 548, z: 1.06 },
    { t: CUE.Legend + 1.1,       x: 470, y: 520, z: 0.90 },
    { t: CUE.END,                x: 500, y: 496, z: 0.86 }
  ];

  function camAt(T) {
    if (T <= CAM[0].t) return CAM[0];
    for (var i = 1; i < CAM.length; i++) {
      if (T <= CAM[i].t) {
        var a = CAM[i - 1], b = CAM[i];
        var u = easeInOut(clamp((T - a.t) / Math.max(0.0001, b.t - a.t), 0, 1));
        return {
          x: a.x + (b.x - a.x) * u,
          y: a.y + (b.y - a.y) * u,
          z: a.z + (b.z - a.z) * u
        };
      }
    }
    return CAM[CAM.length - 1];
  }

  /* ─── Building the scene ─────────────────────────────────────────────── */

  var NS = "http://www.w3.org/2000/svg";
  function svg(tag, attrs) {
    var n = document.createElementNS(NS, tag);
    for (var k in attrs) n.setAttribute(k, attrs[k]);
    return n;
  }
  function div(cls, text) {
    var n = document.createElement("div");
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  /* A run of cable with pulses traveling along it. The base is the route
     drawing itself in; the comets are short dashes chasing each other down
     it. pathLength="1" on every path is what lets one set of numbers mean
     the same thing on a short branch and on a full-height riser. */
  function Flow(parent, d, tone, opts) {
    opts = opts || {};
    var width = opts.width || 3.5;
    var comets = opts.comets || 3;
    var g = svg("g", {});
    var base = svg("path", {
      d: d, fill: "none", "stroke-linecap": "round",
      "stroke-linejoin": "round", pathLength: 1,
      "stroke-width": width + 3.5
    });
    base.setAttribute("class", "dasx-flow dasx-flow--" + tone);
    g.appendChild(base);
    var cs = [];
    for (var i = 0; i < comets; i++) {
      var c = svg("path", {
        d: d, fill: "none", "stroke-linecap": "round",
        "stroke-linejoin": "round", pathLength: 1,
        "stroke-width": width, "stroke-dasharray": "0.075 0.925"
      });
      c.setAttribute("class", "dasx-comet dasx-comet--" + tone);
      g.appendChild(c);
      cs.push(c);
    }
    parent.appendChild(g);
    return {
      g: g, base: base, comets: cs, n: comets,
      speed: opts.speed || 0.55, start: opts.start || 0
    };
  }

  function drawFlow(f, T, on) {
    if (on <= 0.001) { f.g.style.display = "none"; return; }
    f.g.style.display = "";
    var grow = clamp((T - f.start) / 0.55, 0, 1);
    var phase = ((T - f.start) * f.speed) % 1;
    f.base.setAttribute("opacity", 0.14 * on);
    f.base.setAttribute("stroke-dasharray", grow + " 1");
    for (var i = 0; i < f.n; i++) {
      var ff = (phase + i / f.n) % 1;
      f.comets[i].setAttribute("opacity", on * 0.95);
      f.comets[i].setAttribute("stroke-dashoffset", 0.075 - ff * grow);
    }
  }

  /* Antennas are the only node that gets decoration, because they are the
     only node that radiates. */
  function Blink(parent, x, y, r) {
    var g = svg("g", {});
    var halo = svg("circle", { cx: x, cy: y });
    var core = svg("circle", { cx: x, cy: y });
    halo.setAttribute("class", "dasx-blink__halo");
    core.setAttribute("class", "dasx-blink__core");
    g.appendChild(halo); g.appendChild(core);
    parent.appendChild(g);
    return { g: g, halo: halo, core: core, r: r || 13 };
  }

  function drawBlink(b, T, on, start) {
    if (on <= 0.001) { b.g.style.display = "none"; return; }
    b.g.style.display = "";
    var k = ((T - start) * 1.6) % 1;
    var pulse = 0.5 - 0.5 * Math.cos(k * Math.PI * 2);
    b.g.setAttribute("opacity", on);
    b.halo.setAttribute("r", b.r * (1.5 + 0.25 * pulse));
    b.halo.setAttribute("opacity", 0.1 + 0.16 * pulse);
    b.core.setAttribute("r", b.r * (0.8 + 0.12 * pulse));
    b.core.setAttribute("opacity", 0.2 + 0.55 * pulse);
  }

  /* A label pinned to a point on the artwork. It carries the inverse of the
     camera zoom so it stays the same size on screen while the drawing behind
     it grows — a caption on a map, not a sticker on the building. */
  function Chip(parent, x, y, text, anchor, tone) {
    var n = div("dasx-chip" + (tone ? " dasx-chip--" + tone : ""), text);
    n.style.left = x + "px";
    n.style.top = y + "px";
    if (anchor === "right") n.classList.add("dasx-chip--right");
    parent.appendChild(n);
    return { n: n, right: anchor === "right" };
  }

  function drawChip(c, on, z) {
    if (on <= 0.001) { c.n.style.display = "none"; return; }
    c.n.style.display = "";
    c.n.style.opacity = on;
    c.n.style.transform =
      "translate(" + (c.right ? "-100%" : "0") + ", -50%) scale(" + (1 / z) + ")";
  }

  /* ─── Assemble ───────────────────────────────────────────────────────── */

  var space = div("dasx__space");          /* the 1920x1080 authored space */
  var world = div("dasx__world");          /* everything the camera moves  */
  var dim = div("dasx__dim");              /* knocks the artwork back      */

  /* The artwork in the markup is left exactly where it is: it is what a
     phone, a printer and a browser with no JavaScript get, and moving it into
     the stage would take it away from all three. The camera gets its own
     <img> at the same URL, which costs no second request — the browser has
     already fetched and decoded that file. */
  var art = document.createElement("img");
  art.className = "dasx__art";
  art.src = still.getAttribute("src");
  art.width = IMG_W;
  art.height = IMG_H;
  art.alt = "";
  art.setAttribute("aria-hidden", "true");
  world.appendChild(art);
  world.appendChild(dim);

  var sky = svg("svg", {
    width: IMG_W, height: IMG_H,
    viewBox: "0 0 " + IMG_W + " " + IMG_H
  });
  sky.setAttribute("class", "dasx__svg");
  sky.setAttribute("aria-hidden", "true");
  world.appendChild(sky);

  /* The artwork prints its own two-line legend in the bottom left. The scene
     draws a fuller one of its own, so the printed one is covered over rather
     than left to argue with it. Artwork coordinates, so it travels with the
     camera and stays exactly over the thing it hides. */
  var cover = svg("rect", { x: 110, y: 912, width: 340, height: 95 });
  cover.setAttribute("class", "dasx-cover");
  sky.appendChild(cover);

  /* The artwork labels the two expansion units CBU. The front face of each
     box is a flat colour sampled from the file, so repainting that one
     polygon and relabelling it here leaves no seam. It rides inside the
     camera group so it moves and scales with the box it covers. Delete this
     if the artwork is ever regenerated with the right label. */
  var relabel = svg("g", {});
  relabel.setAttribute("class", "dasx-relabel");
  [[581, 542, 601, 552, 601, 572, 581, 562, 591, 261.5],
   [842, 785, 862, 795, 862, 815, 842, 805, 852, 374]].forEach(function (b) {
    relabel.appendChild(svg("polygon", {
      points: b[0] + "," + b[1] + " " + b[2] + "," + b[3] + " " +
              b[4] + "," + b[5] + " " + b[6] + "," + b[7]
    }));
    var t = svg("text", { transform: "matrix(1 .5 0 1 0 0)", x: b[8], y: b[9] });
    t.textContent = "EU";
    relabel.appendChild(t);
  });
  sky.appendChild(relabel);

  var F = {
    donor:  Flow(sky, P.donor,  "rf",    { start: CUE.Donor + 0.3 }),
    bdaHe:  Flow(sky, P.bdaHe,  "rf",    { start: CUE.HeadEnd + 0.5, speed: 0.9 }),
    btsHe:  Flow(sky, P.btsHe,  "rf",    { start: CUE.HeadEnd + 0.5, speed: 0.8 }),
    riserA: Flow(sky, P.riserA, "optic", { start: CUE.Riser + 0.4, speed: 0.45 }),
    branch: BRANCH_A.map(function (d, i) {
      return Flow(sky, d, "rf", {
        start: CUE.Antennas + 0.45 + Math.floor(i / 2) * 0.16,
        width: 2.6, speed: 1.1, comets: 2
      });
    }),
    euB:    Flow(sky, P.euB,    "optic", { start: CUE.Expansion + 0.6,  speed: 0.5 }),
    euC:    Flow(sky, P.euC,    "optic", { start: CUE.Expansion + 0.75, speed: 0.4 }),
    riserB: Flow(sky, P.riserB, "optic", { start: CUE.Expansion + 1.4,  speed: 0.5 }),
    riserC: Flow(sky, P.riserC, "optic", { start: CUE.Expansion + 1.6,  speed: 0.5 })
  };

  var donorBlink = Blink(sky, 413, 16, 16);
  var antBlinks = ANT_A.map(function (p) { return Blink(sky, p[0], p[1], 11); });

  var CHIPS = [
    Chip(world, 372, 40,  "Donor antenna — macro network", "right"),
    Chip(world, 408, 676, "BDA — bi-directional amplifier", null, "optic"),
    Chip(world, 96,  648, "BTS — base station"),
    Chip(world, 330, 800, "HE — head end, RF to optical"),
    Chip(world, 352, 430, "RU — remote unit, one per floor"),
    Chip(world, 132, 620, "Indoor antennas", "right"),
    Chip(world, 624, 608, "EU — expansion unit", null, "optic"),
    Chip(world, 884, 846, "EU — expansion unit", null, "optic")
  ];

  space.appendChild(world);

  /* Chrome: fixed to the stage, not to the artwork, so the camera does not
     drag it about. */
  var title = div("dasx__title");
  title.appendChild(div("dasx__eyebrow", "In-building solutions"));
  title.appendChild(div("dasx__h", "Distributed Antenna System"));
  title.appendChild(div("dasx__rule"));
  space.appendChild(title);

  var legend = div("dasx__legend");
  legend.appendChild(div("dasx__legend-h", "Legend"));
  var lines = div("dasx__legend-lines");
  [["optic", "Optic Line — Fibre"], ["rf", "RF Line — Coax"]].forEach(function (r) {
    var sw = svg("svg", { viewBox: "0 0 78 14" });
    sw.setAttribute("class", "dasx__sw");
    sw.setAttribute("aria-hidden", "true");
    var f = Flow(sw, "M4 7 L74 7", r[0], {
      start: r[0] === "optic" ? 0 : 0.5, width: 3, speed: 0.45, comets: 2
    });
    lines.appendChild(sw);
    lines.appendChild(div("dasx__legend-t", r[1]));
    (legend.swatches = legend.swatches || []).push(f);
  });
  legend.appendChild(lines);
  legend.appendChild(div("dasx__legend-rule"));
  var terms = div("dasx__legend-terms");
  [["BTS", "Base Transceiver Station"],
   ["BDA", "Bi-Directional Amplifier"],
   ["HE",  "Head End Unit"],
   ["RU",  "Remote Unit"],
   ["EU",  "Expansion Unit"]].forEach(function (r) {
    terms.appendChild(div("dasx__term", r[0]));
    terms.appendChild(div("dasx__gloss", r[1]));
  });
  legend.appendChild(terms);
  space.appendChild(legend);

  var caption = div("dasx__caption");
  space.appendChild(caption);

  var bar = div("dasx__bar");
  var barFill = div("dasx__bar-fill");
  bar.appendChild(barFill);
  space.appendChild(bar);

  stage.appendChild(space);
  stage.classList.add("is-live");

  var CAPTIONS = [
    [0,                     CUE.Donor + 0.2, "One head end, one fibre riser, coverage on every floor."],
    [CUE.Donor + 0.5,       null,            "A donor antenna picks up the macro network and feeds the BDA over coax."],
    [CUE.HeadEnd + 0.55,    null,            "BTS and BDA signals arrive at the head end unit."],
    [CUE.Riser + 0.5,       null,            "The head end converts RF to optical. Fibre risers carry it up the building."],
    [CUE.Antennas + 0.5,    null,            "Remote units drive the indoor antennas, floor by floor."],
    [CUE.Expansion + 0.7,   null,            "The same fibre feeds expansion units in the adjacent buildings."],
    [CUE.Legend + 0.6,      CUE.END,         "One continuous path from the macro network to every floor."]
  ];
  var shownCaption = -1;

  /* ─── One frame ──────────────────────────────────────────────────────── */

  function frame(T) {
    var cam = camAt(T);

    world.style.transform =
      "translate(" + (VW / 2 - cam.x * cam.z) + "px," +
                     (VH / 2 - cam.y * cam.z) + "px) scale(" + cam.z + ")";

    var onDonor = win(T, CUE.Donor + 0.3, CUE.HeadEnd + 0.4);
    var onHead  = win(T, CUE.HeadEnd + 0.5, CUE.Riser + 0.5);
    var onRiser = win(T, CUE.Riser + 0.4, CUE.Antennas + 0.6);
    var onAnt   = win(T, CUE.Antennas + 0.5, CUE.Expansion + 0.5);
    var onExp   = win(T, CUE.Expansion + 0.6, CUE.Legend + 0.5);
    var onAll   = clamp((T - CUE.Legend - 0.3) / 0.6, 0, 1);

    dim.style.opacity =
      Math.max(onDonor, onHead, onRiser, onAnt, onExp) * 0.28;

    drawFlow(F.donor,  T, onDonor);
    drawFlow(F.bdaHe,  T, onHead);
    drawFlow(F.btsHe,  T, onHead);
    drawFlow(F.riserA, T, Math.max(onRiser, onAll));
    for (var i = 0; i < F.branch.length; i++) {
      drawFlow(F.branch[i], T, Math.max(onAnt, onAll * 0.8));
    }
    drawFlow(F.euB,    T, Math.max(onExp, onAll));
    drawFlow(F.euC,    T, Math.max(onExp, onAll));
    drawFlow(F.riserB, T, Math.max(onExp, onAll));
    drawFlow(F.riserC, T, Math.max(onExp, onAll));

    drawBlink(donorBlink, T, onDonor, CUE.Donor + 0.2);
    for (i = 0; i < antBlinks.length; i++) {
      var st = CUE.Antennas + 0.6 + Math.floor(i / 2) * 0.2;
      drawBlink(antBlinks[i], T,
        Math.max(onAnt, onAll * 0.85) * step(T, st, 0.3), st);
    }

    drawChip(CHIPS[0], onDonor, cam.z);
    drawChip(CHIPS[1], onDonor, cam.z);
    drawChip(CHIPS[2], onHead, cam.z);
    drawChip(CHIPS[3], Math.max(onHead, onRiser * 0.9), cam.z);
    drawChip(CHIPS[4], onRiser, cam.z);
    drawChip(CHIPS[5], onAnt, cam.z);
    drawChip(CHIPS[6], onExp, cam.z);
    drawChip(CHIPS[7], onExp, cam.z);

    legend.swatches.forEach(function (f) { drawFlow(f, T, 1); });

    /* The title and the legend share the establishing and closing shots and
       stand down while the camera is in among the equipment. */
    var panel = Math.max(1 - step(T, CUE.Donor - 0.5, 0.5),
                         step(T, CUE.Legend + 0.3, 0.6));
    title.style.opacity = panel;
    legend.style.opacity = panel;

    var pick = -1;
    for (i = 0; i < CAPTIONS.length; i++) {
      var a = CAPTIONS[i][0];
      var b = CAPTIONS[i][1] != null
        ? CAPTIONS[i][1]
        : (i + 1 < CAPTIONS.length ? CAPTIONS[i + 1][0] : CUE.END);
      if (T >= a && T < b) { pick = i; break; }
    }
    if (pick !== shownCaption) {
      shownCaption = pick;
      caption.textContent = pick < 0 ? "" : CAPTIONS[pick][2];
      caption.style.opacity = pick < 0 ? 0 : 1;
    }

    barFill.style.width = (clamp(T / CUE.END, 0, 1) * 100) + "%";
  }

  /* ─── Fit, run, and stop when nobody is looking ──────────────────────── */

  function fit() {
    var w = stage.clientWidth;
    space.style.transform = "scale(" + (w / VW) + ")";
    stage.style.height = (w * VH / VW) + "px";
  }

  var raf = 0, t0 = 0, visible = true, running = false;

  function tick(now) {
    if (!t0) t0 = now;
    frame(((now - t0) / 1000) % CUE.END);
    raf = requestAnimationFrame(tick);
  }

  function start() {
    if (running) return;
    running = true;
    t0 = 0;
    raf = requestAnimationFrame(tick);
  }
  function stop() {
    if (!raf) return;
    cancelAnimationFrame(raf);
    raf = 0;
    running = false;
  }

  /* The still frame: the whole system lit, which is where the loop ends. */
  function rest() { stop(); frame(CUE.END - 0.01); }

  function apply() {
    var wide = !WIDE || WIDE.matches;
    var calm = CALM && CALM.matches;
    stage.classList.toggle("is-live", wide);
    if (!wide) { stop(); return; }
    fit();
    if (calm) rest();
    else if (visible) start();
    else rest();
  }

  if (typeof ResizeObserver === "function") {
    new ResizeObserver(function () {
      if (stage.classList.contains("is-live")) fit();
    }).observe(stage);
  } else {
    window.addEventListener("resize", function () {
      if (stage.classList.contains("is-live")) fit();
    });
  }

  if (typeof IntersectionObserver === "function") {
    new IntersectionObserver(function (entries) {
      visible = entries[0].isIntersecting;
      if (!stage.classList.contains("is-live")) return;
      if (visible && !(CALM && CALM.matches)) start();
      else stop();
    }, { threshold: 0.05 }).observe(stage);
  }

  [WIDE, CALM].forEach(function (m) {
    if (!m) return;
    if (m.addEventListener) m.addEventListener("change", apply);
    else if (m.addListener) m.addListener(apply);
  });

  if (still.complete) apply();
  else still.addEventListener("load", apply);
  apply();
})();
