/* ═══════════════════════════════════════════════════════════════════════════
   tools.js — the RF calculators on /tools/.

   Everything here runs in the visitor's browser. No input ever leaves the
   page; there is no server to send it to. That is the whole point of the
   no-backend design, and it is worth keeping.

   Each calculator is a small self-contained function that wires up its own
   inputs. The maths is written out plainly rather than hidden behind a
   generic engine, so it can be read and checked against a reference.
   ═══════════════════════════════════════════════════════════════════════════ */

(function () {
  "use strict";

  var C = 299792458; // speed of light, m/s

  function $(id) { return document.getElementById(id); }

  // Parse a field to a finite number, or null if it's blank/invalid.
  function num(v) {
    if (v == null || String(v).trim() === "") return null;
    var n = parseFloat(v);
    return isFinite(n) ? n : null;
  }

  // Trim trailing zeros without mangling integers ("100.00" -> "100").
  function trim(s) {
    return s.indexOf(".") >= 0 ? s.replace(/0+$/, "").replace(/\.$/, "") : s;
  }

  // Format a number for display: fixed decimals, trimmed, with an exponential
  // fallback for very large or very small magnitudes.
  function fmt(x, dp) {
    if (x == null || !isFinite(x)) return "—";
    if (x !== 0 && (Math.abs(x) >= 1e7 || Math.abs(x) < 1e-4)) return x.toExponential(3);
    return trim(x.toFixed(dp == null ? 4 : dp));
  }

  // Write a value into an input without triggering its "input" event — this is
  // what stops two linked fields from updating each other in a loop.
  function put(el, value) { if (el) el.value = value; }
  function set(el, text) { if (el) el.textContent = text; }

  /* ─── 1. Power: W ⇄ mW ⇄ dBm ⇄ dBW ──────────────────────────────────────
       dBm = 10·log₁₀(P in mW).  All four fields track one another; editing
       any one recomputes the rest. Everything is derived from milliwatts. */

  (function power() {
    var w = $("pw-w"), mw = $("pw-mw"), dbm = $("pw-dbm"), dbw = $("pw-dbw");
    if (!w || !mw || !dbm || !dbw) return;

    function fromMilliwatts(mW, except) {
      if (mW == null || mW <= 0) {
        if (except !== w) put(w, "");
        if (except !== mw) put(mw, "");
        if (except !== dbm) put(dbm, "");
        if (except !== dbw) put(dbw, "");
        return;
      }
      var dBm = 10 * Math.log10(mW);
      if (except !== w) put(w, fmt(mW / 1000));
      if (except !== mw) put(mw, fmt(mW));
      if (except !== dbm) put(dbm, fmt(dBm, 2));
      if (except !== dbw) put(dbw, fmt(dBm - 30, 2));
    }

    w.addEventListener("input", function () { var v = num(w.value); fromMilliwatts(v == null ? null : v * 1000, w); });
    mw.addEventListener("input", function () { fromMilliwatts(num(mw.value), mw); });
    dbm.addEventListener("input", function () { var v = num(dbm.value); fromMilliwatts(v == null ? null : Math.pow(10, v / 10), dbm); });
    dbw.addEventListener("input", function () { var v = num(dbw.value); fromMilliwatts(v == null ? null : Math.pow(10, (v + 30) / 10), dbw); });

    fromMilliwatts(num(mw.value), null);
  })();

  /* ─── 2. LTE EARFCN ⇄ frequency ──────────────────────────────────────────
       Per 3GPP TS 36.101 §5.7.3:  F = F_low + 0.1·(N − N_offset), MHz.
       The band table carries F_low, the offset and the valid channel range
       for each link. TDD bands share one channel number for UL and DL. */

  var BANDS = [
    // FDD — { n, mode, dl:{low, off, min, max}, ul:{...} }
    { n: 1,  mode: "FDD", dl: { low: 2110.0, off: 0,     min: 0,     max: 599   }, ul: { low: 1920.0, off: 18000,  min: 18000,  max: 18599  } },
    { n: 2,  mode: "FDD", dl: { low: 1930.0, off: 600,   min: 600,   max: 1199  }, ul: { low: 1850.0, off: 18600,  min: 18600,  max: 19199  } },
    { n: 3,  mode: "FDD", dl: { low: 1805.0, off: 1200,  min: 1200,  max: 1949  }, ul: { low: 1710.0, off: 19200,  min: 19200,  max: 19949  } },
    { n: 4,  mode: "FDD", dl: { low: 2110.0, off: 1950,  min: 1950,  max: 2399  }, ul: { low: 1710.0, off: 19950,  min: 19950,  max: 20399  } },
    { n: 5,  mode: "FDD", dl: { low: 869.0,  off: 2400,  min: 2400,  max: 2649  }, ul: { low: 824.0,  off: 20400,  min: 20400,  max: 20649  } },
    { n: 7,  mode: "FDD", dl: { low: 2620.0, off: 2750,  min: 2750,  max: 3449  }, ul: { low: 2500.0, off: 20750,  min: 20750,  max: 21449  } },
    { n: 8,  mode: "FDD", dl: { low: 925.0,  off: 3450,  min: 3450,  max: 3799  }, ul: { low: 880.0,  off: 21450,  min: 21450,  max: 21799  } },
    { n: 12, mode: "FDD", dl: { low: 729.0,  off: 5010,  min: 5010,  max: 5179  }, ul: { low: 699.0,  off: 23010,  min: 23010,  max: 23179  } },
    { n: 13, mode: "FDD", dl: { low: 746.0,  off: 5180,  min: 5180,  max: 5279  }, ul: { low: 777.0,  off: 23180,  min: 23180,  max: 23279  } },
    { n: 14, mode: "FDD", dl: { low: 758.0,  off: 5280,  min: 5280,  max: 5379  }, ul: { low: 788.0,  off: 23280,  min: 23280,  max: 23379  } },
    { n: 17, mode: "FDD", dl: { low: 734.0,  off: 5730,  min: 5730,  max: 5849  }, ul: { low: 704.0,  off: 23730,  min: 23730,  max: 23849  } },
    { n: 18, mode: "FDD", dl: { low: 860.0,  off: 5850,  min: 5850,  max: 5999  }, ul: { low: 815.0,  off: 23850,  min: 23850,  max: 23999  } },
    { n: 19, mode: "FDD", dl: { low: 875.0,  off: 6000,  min: 6000,  max: 6149  }, ul: { low: 830.0,  off: 24000,  min: 24000,  max: 24149  } },
    { n: 20, mode: "FDD", dl: { low: 791.0,  off: 6150,  min: 6150,  max: 6449  }, ul: { low: 832.0,  off: 24150,  min: 24150,  max: 24449  } },
    { n: 21, mode: "FDD", dl: { low: 1495.9, off: 6450,  min: 6450,  max: 6599  }, ul: { low: 1447.9, off: 24450,  min: 24450,  max: 24599  } },
    { n: 25, mode: "FDD", dl: { low: 1930.0, off: 8040,  min: 8040,  max: 8689  }, ul: { low: 1850.0, off: 26040,  min: 26040,  max: 26689  } },
    { n: 26, mode: "FDD", dl: { low: 859.0,  off: 8690,  min: 8690,  max: 9039  }, ul: { low: 814.0,  off: 26690,  min: 26690,  max: 27039  } },
    { n: 28, mode: "FDD", dl: { low: 758.0,  off: 9210,  min: 9210,  max: 9659  }, ul: { low: 703.0,  off: 27210,  min: 27210,  max: 27659  } },
    { n: 30, mode: "FDD", dl: { low: 2350.0, off: 9770,  min: 9770,  max: 9869  }, ul: { low: 2305.0, off: 27660,  min: 27660,  max: 27759  } },
    { n: 66, mode: "FDD", dl: { low: 2110.0, off: 66436, min: 66436, max: 67335 }, ul: { low: 1710.0, off: 131972, min: 131972, max: 132671 } },
    { n: 71, mode: "FDD", dl: { low: 617.0,  off: 68586, min: 68586, max: 68935 }, ul: { low: 663.0,  off: 132672, min: 132672, max: 133021 } },
    // TDD — ul mirrors dl (one channel number)
    { n: 34, mode: "TDD", dl: { low: 2010.0, off: 36200, min: 36200, max: 36349 } },
    { n: 38, mode: "TDD", dl: { low: 2570.0, off: 37750, min: 37750, max: 38249 } },
    { n: 39, mode: "TDD", dl: { low: 1880.0, off: 38250, min: 38250, max: 38649 } },
    { n: 40, mode: "TDD", dl: { low: 2300.0, off: 38650, min: 38650, max: 39649 } },
    { n: 41, mode: "TDD", dl: { low: 2496.0, off: 39650, min: 39650, max: 41589 } },
    { n: 42, mode: "TDD", dl: { low: 3400.0, off: 41590, min: 41590, max: 43589 } },
    { n: 43, mode: "TDD", dl: { low: 3600.0, off: 43590, min: 43590, max: 45589 } },
    { n: 48, mode: "TDD", dl: { low: 3550.0, off: 55240, min: 55240, max: 56739 } }
  ];

  (function earfcn() {
    var sel = $("ea-band");
    if (!sel) return;

    BANDS.forEach(function (b) {
      if (b.mode === "TDD") b.ul = b.dl; // one channel for both links
    });

    BANDS.forEach(function (b, i) {
      var o = document.createElement("option");
      o.value = String(i);
      o.textContent = "Band " + b.n + " (" + b.mode + ")";
      sel.appendChild(o);
    });

    var dlN = $("ea-dl-n"), dlF = $("ea-dl-f"), dlS = $("ea-dl-status");
    var ulN = $("ea-ul-n"), ulF = $("ea-ul-f"), ulS = $("ea-ul-status");
    var ulRow = $("ea-ul-row"), note = $("ea-note");

    function band() { return BANDS[parseInt(sel.value, 10) || 0]; }

    function nToF(link, n) {
      if (n == null || n < link.min || n > link.max || n % 1 !== 0) return null;
      return link.low + 0.1 * (n - link.off);
    }
    function fToN(link, f) {
      if (f == null) return null;
      var n = Math.round((f - link.low) / 0.1) + link.off;
      if (n < link.min || n > link.max) return null;
      return n;
    }

    function refreshRange() {
      var b = band();
      var tdd = b.mode === "TDD";
      if (ulRow) ulRow.style.display = tdd ? "none" : "";
      set(note, tdd
        ? "Band " + b.n + " is TDD — uplink and downlink use the same channel. Raster 0.1 MHz."
        : "Band " + b.n + " is FDD — uplink and downlink have separate channels. Raster 0.1 MHz.");
      // Re-evaluate from whatever EARFCNs are currently entered.
      computeFrom("dl-n"); if (!tdd) computeFrom("ul-n");
    }

    function computeFrom(source) {
      var b = band();
      if (source === "dl-n") {
        var f = nToF(b.dl, num(dlN.value));
        put(dlF, f == null ? "" : fmt(f, 1));
        set(dlS, dlN.value.trim() === "" ? "" : (f == null ? "out of band " + b.dl.min + "–" + b.dl.max : ""));
      } else if (source === "dl-f") {
        var n = fToN(b.dl, num(dlF.value));
        put(dlN, n == null ? "" : String(n));
        set(dlS, dlF.value.trim() === "" ? "" : (n == null ? "no channel here" : "→ " + fmt(nToF(b.dl, n), 1) + " MHz on raster"));
      } else if (source === "ul-n") {
        var fu = nToF(b.ul, num(ulN.value));
        put(ulF, fu == null ? "" : fmt(fu, 1));
        set(ulS, ulN.value.trim() === "" ? "" : (fu == null ? "out of band " + b.ul.min + "–" + b.ul.max : ""));
      } else if (source === "ul-f") {
        var nu = fToN(b.ul, num(ulF.value));
        put(ulN, nu == null ? "" : String(nu));
        set(ulS, ulF.value.trim() === "" ? "" : (nu == null ? "no channel here" : "→ " + fmt(nToF(b.ul, nu), 1) + " MHz on raster"));
      }
    }

    sel.addEventListener("change", refreshRange);
    dlN.addEventListener("input", function () { computeFrom("dl-n"); });
    dlF.addEventListener("input", function () { computeFrom("dl-f"); });
    ulN.addEventListener("input", function () { computeFrom("ul-n"); });
    ulF.addEventListener("input", function () { computeFrom("ul-f"); });

    // Sensible starting point: Band 1, mid-channel.
    sel.value = "0";
    put(dlN, "300");
    refreshRange();
    computeFrom("dl-n");
    put(ulN, "18300");
    computeFrom("ul-n");
  })();

  /* ─── 3. Free-space path loss ────────────────────────────────────────────
       FSPL(dB) = 20·log₁₀(d) + 20·log₁₀(f) + 32.44,  d in km, f in MHz.
       The 32.44 constant folds in 4π/c and the km·MHz unit scaling. */

  (function fspl() {
    var f = $("fs-f"), d = $("fs-d"), unit = $("fs-unit"), out = $("fs-out"), lam = $("fs-lambda");
    if (!f || !d || !unit || !out) return;

    function toKm(v) {
      var u = unit.value;
      if (u === "m") return v / 1000;
      if (u === "mi") return v * 1.609344;
      return v; // km
    }

    function calc() {
      var fv = num(f.value), dv = num(d.value);
      if (fv == null || dv == null || fv <= 0 || dv <= 0) {
        set(out, "—"); set(lam, "—"); return;
      }
      var dkm = toKm(dv);
      if (dkm <= 0) { set(out, "—"); set(lam, "—"); return; }
      var loss = 20 * Math.log10(dkm) + 20 * Math.log10(fv) + 32.44;
      set(out, fmt(loss, 2) + " dB");
      set(lam, fmt((C / (fv * 1e6)) * 100, 1) + " cm"); // wavelength for context
    }

    f.addEventListener("input", calc);
    d.addEventListener("input", calc);
    unit.addEventListener("change", calc);
    calc();
  })();

  /* ─── 4. VSWR ⇄ return loss ⇄ mismatch loss ──────────────────────────────
       |Γ| = (VSWR−1)/(VSWR+1);  RL = −20·log₁₀|Γ|;  ML = −10·log₁₀(1−|Γ|²).
       Enter VSWR or return loss — the rest, and the reflected-power share,
       follow. */

  (function vswr() {
    var v = $("vs-vswr"), rl = $("vs-rl");
    var gOut = $("vs-gamma"), mlOut = $("vs-ml"), pOut = $("vs-pref");
    if (!v || !rl) return;

    function show(gamma) {
      if (gamma == null || gamma < 0 || gamma >= 1) {
        set(gOut, "—"); set(mlOut, "—"); set(pOut, "—"); return;
      }
      var ml = -10 * Math.log10(1 - gamma * gamma);
      set(gOut, fmt(gamma, 4));
      set(mlOut, fmt(ml, 3) + " dB");
      set(pOut, fmt(gamma * gamma * 100, 2) + " %");
    }

    v.addEventListener("input", function () {
      var vv = num(v.value);
      if (vv == null || vv < 1) { put(rl, ""); show(null); return; }
      var g = (vv - 1) / (vv + 1);
      put(rl, g === 0 ? "" : fmt(-20 * Math.log10(g), 3));
      show(g);
    });

    rl.addEventListener("input", function () {
      var rv = num(rl.value);
      if (rv == null || rv < 0) { put(v, ""); show(null); return; }
      var g = Math.pow(10, -rv / 20);
      put(v, fmt((1 + g) / (1 - g), 3));
      show(g);
    });

    // Start at a clean, familiar value: VSWR 1.5.
    put(v, "1.5");
    v.dispatchEvent(new Event("input"));
  })();

  /* ─── 5. Wavelength ⇄ frequency ──────────────────────────────────────────
       λ = c / f.  Quarter- and half-wave lengths come along for antenna work. */

  (function wavelength() {
    var f = $("wl-f"), l = $("wl-l");
    var half = $("wl-half"), quarter = $("wl-quarter");
    if (!f || !l) return;

    function outputs(lambda_m) {
      if (lambda_m == null || !isFinite(lambda_m) || lambda_m <= 0) {
        set(half, "—"); set(quarter, "—"); return;
      }
      set(half, fmt(lambda_m / 2 * 100, 2) + " cm");
      set(quarter, fmt(lambda_m / 4 * 100, 2) + " cm");
    }

    f.addEventListener("input", function () {
      var fv = num(f.value);
      if (fv == null || fv <= 0) { put(l, ""); outputs(null); return; }
      var lambda = C / (fv * 1e6); // metres
      put(l, fmt(lambda * 100, 4)); // cm
      outputs(lambda);
    });

    l.addEventListener("input", function () {
      var lv = num(l.value); // cm
      if (lv == null || lv <= 0) { put(f, ""); outputs(null); return; }
      var lambda = lv / 100; // metres
      put(f, fmt(C / lambda / 1e6, 4)); // MHz
      outputs(lambda);
    });

    // Start at 1800 MHz — a band Sajib has spent a lot of time in.
    put(f, "1800");
    f.dispatchEvent(new Event("input"));
  })();

})();
