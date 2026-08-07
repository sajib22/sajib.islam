/* ═══════════════════════════════════════════════════════════════════════════
   content.js — THIS IS THE ONLY FILE YOU NORMALLY NEED TO EDIT.

   Everything on the site that is a list — jobs, skills, projects, education,
   certifications — lives here, in the same order it appears on the page.

   HOW TO ADD SOMETHING
     1. Find the right section below.
     2. Copy the whole block between "COPY FROM HERE" and "TO HERE".
     3. Paste it directly underneath, and edit the text.
     4. Save. That's it.

   THREE RULES THAT KEEP THIS FILE WORKING
     • Every piece of text must sit inside "double quotes".
     • Every line inside a { } block ends with a comma.
     • If your text contains a " character, write it as \" instead.

   IF YOU BREAK IT
     Only the section you broke disappears, and the page shows a short message
     telling you which one. The rest of the site keeps working. Fix the typo,
     or undo your change in GitHub — see CONTRIBUTING.md.

   NOT IN THIS FILE
     Your name, the about paragraphs, and your contact links live in
     public/index.html. They change once a decade, so they are written
     straight into the page. CONTRIBUTING.md says exactly which lines.

   WHY THIS FILE LIVES INSIDE public/
     Only files inside public/ get served to the internet. A content folder
     next to public/ would never load. Do not move this file.
   ═══════════════════════════════════════════════════════════════════════════ */

window.SITE = {

  /* ─────────────────────────────────────────────────────────────────────────
     EXPERIENCE — newest job first.

     "dates"   is free text. Write it however you like: "May 2025 — Present".
     "current" puts the amber "current" marker next to the role.
               Set it to true on exactly ONE job, and delete the line from
               every other job.
     "bullets" is a list of what you did. Two to four is the right number.
               Write scope and outcome, not responsibilities.
     ───────────────────────────────────────────────────────────────────────── */
  experience: [

    // ── COPY FROM HERE ──
    {
      title: "RF Engineer",
      company: "Genwave Technologies",
      location: "Toronto, ON",
      dates: "May 2025 — Present",
      current: true,
      bullets: [
        "Plan, design, commission and optimize multi-band 5G/LTE in-building systems and Private 5G / Cisco URWB networks for major Canadian venues, validating coverage, capacity and quality against engineered targets.",
        "Integrate and tune multi-vendor head-end and remote equipment — ADRF, Corning/BTI, Zinwave — with CW, PIM and walk testing, EMF and Safety Code 6 validation, and root-cause troubleshooting.",
        "Built Python automation for measurement-data processing and report generation that cut analysis turnaround time by 90%.",
        "Produce link budgets, design packages and stakeholder performance reports, coordinating with internal teams and OEM partners through delivery and close-out.",
      ],
    },
    // ── TO HERE ──

    {
      title: "Senior NPO Engineer",
      company: "Nokia Solutions and Networks",
      location: "Dhaka, Bangladesh",
      dates: "Feb 2019 — Jan 2024",
      bullets: [
        "Led LTE and 5G RAN optimization on domestic and overseas projects, preparing and defending 5G SSV and KPI acceptance reports against contractual targets.",
        "Performed multi-vendor KPI, counter, parameter and feature mapping across Nokia, Ericsson and Huawei to certify equivalent network behaviour after swaps and feature introductions.",
        "Resolved coverage (RSRP/RSCP), quality (RSRQ/SINR), mobility and handover problems through worst-cell parameter and Layer-1 optimization driven by drive-test and device-log analysis.",
        "Built Power BI pre-swap versus post-swap analytics that turned large KPI datasets into specific optimization recommendations for senior stakeholders.",
      ],
    },

    {
      title: "4G & 3G Consultant / Team Lead",
      company: "FlipNet (MTN Irancell)",
      location: "Tehran, Iran",
      dates: "Dec 2014 — Jun 2018",
      bullets: [
        "Owned end-to-end RF planning and optimization of 4G and 3G in Atoll — coverage and capacity planning, link budgets, PCI and neighbour planning, and new-site candidate evaluation.",
        "Monitored network, city and cluster level KPIs and drove corrective action to restore performance targets.",
        "Troubleshot parameter mismatch, high uplink interference, TX faults, capacity bottlenecks, MIMO configuration and Carrier Aggregation issues.",
        "Mentored and trained team members in RF design and optimization methodology.",
      ],
    },

    {
      title: "Senior RNP/RNO & IBS Team Lead, Services Engineer, Senior System Engineer",
      company: "Huawei, Ericsson & Grameenphone",
      location: "Dhaka, Bangladesh",
      dates: "Sep 2007 — Dec 2014",
      bullets: [
        "Designed and deployed 100+ in-building (IBS/DAS) systems and 200+ repeater sites, and executed a 250+ site IBS vendor swap from Ericsson to Huawei for the largest mobile operator in Bangladesh.",
        "Delivered multi-vendor RAN planning, design and optimization for operators across Bangladesh and Myanmar (Telenor, Ooredoo).",
        "Coordinated multi-entity delivery, presented daily progress to senior management, and trained stakeholder and vendor teams through deployment cycles.",
      ],
    },

  ],


  /* ─────────────────────────────────────────────────────────────────────────
     SKILLS — grouped by domain, not a flat tag cloud.

     Add a skill by adding "Its name", inside the right group's items list.
     Add a whole new group by copying a { } block.
     ───────────────────────────────────────────────────────────────────────── */
  skills: [

    // ── COPY FROM HERE ──
    {
      group: "RF design & planning",
      items: [
        "DAS / IBS",
        "Private 5G",
        "Cisco URWB",
        "Link budget analysis",
        "Coverage prediction",
        "Propagation model tuning",
        "Atoll",
        "iBwave",
        "Mentum Planet",
        "CW, PIM & walk testing",
        "EMF / Safety Code 6",
      ],
    },
    // ── TO HERE ──

    {
      group: "RAN & vendor platforms",
      items: [
        "Nokia SRAN & AirScale",
        "Ericsson",
        "Huawei",
        "NetAct / NPM",
        "Ericsson OSS",
        "WinFIOL",
        "Huawei U2000",
        "5G SA / NSA",
        "LTE",
        "HSPA",
        "GSM",
        "Carrier Aggregation",
        "Massive MIMO",
        "VoLTE / VoWiFi",
        "3GPP Rel 16/18",
      ],
    },

    {
      group: "Test & analysis",
      items: [
        "TEMS Investigation",
        "Nemo Analyzer",
        "ActixOne",
        "Huawei Genex",
        "Drive test analysis",
        "Call trace (GPEH, UeTR, CTR)",
        "Layer 3 signaling analysis",
      ],
    },

    {
      group: "Data & automation",
      items: [
        "Python",
        "SQL",
        "Power BI",
        "Power Query",
        "DAX",
        "Tableau",
        "Looker Studio",
        "VBA",
        "Shell",
        "Excel (advanced)",
      ],
    },

    {
      group: "Machine learning",
      items: [
        "scikit-learn",
        "TensorFlow / Keras",
        "Random Forest",
        "XGBoost",
        "LSTM",
        "U-Net",
      ],
    },

  ],


  /* ─────────────────────────────────────────────────────────────────────────
     PROJECTS — shown as cards.

     "link" is optional. If a project is private or has nothing to link to,
     delete the "link" and "linkLabel" lines entirely and the card renders
     without a link.
     ───────────────────────────────────────────────────────────────────────── */
  projects: [

    // ── COPY FROM HERE ──
    {
      name: "RF measurement & reporting automation",
      blurb: "Python tooling that ingests raw walk-test and measurement data and produces finished survey reports, replacing manual document assembly. Cut analysis turnaround time by 90%.",
      tech: ["Python", "Pandas", "Excel"],
    },
    // ── TO HERE ──

    {
      name: "Pre-swap / post-swap KPI analytics",
      blurb: "Power BI model comparing network KPIs before and after vendor swaps across a large RAN estate, turning raw counter data into ranked optimization actions for senior stakeholders.",
      tech: ["Power BI", "DAX", "Power Query", "SQL"],
    },

    {
      name: "IBS vendor swap — 250+ sites",
      blurb: "Planned and executed an in-building system swap from Ericsson to Huawei across more than 250 sites for the largest mobile operator in Bangladesh, holding KPI parity through cutover.",
      tech: ["IBS / DAS", "Multi-vendor KPI mapping"],
    },

    {
      name: "[[ML PROJECT NAME]]",
      blurb: "[[ONE OR TWO SENTENCES — the problem, the model you used, and the result. This is where your TMU coursework or side ML work goes.]]",
      tech: ["Python", "[[MODEL]]"],
    },

  ],


  /* ─────────────────────────────────────────────────────────────────────────
     EDUCATION — newest first.

     "note" is optional. Delete the line if you don't want one.
     ───────────────────────────────────────────────────────────────────────── */
  education: [

    // ── COPY FROM HERE ──
    {
      credential: "Master of Engineering, Electrical & Computer Engineering",
      institution: "Toronto Metropolitan University",
      location: "Toronto, ON",
      dates: "Jan 2025 — [[EXPECTED COMPLETION]]",
      note: "Artificial intelligence field of study. Part-time, alongside full-time engineering work.",
    },
    // ── TO HERE ──

    {
      credential: "B.Sc. in Electrical & Electronic Engineering",
      institution: "Bangladesh University of Engineering and Technology (BUET)",
      location: "Dhaka, Bangladesh",
      dates: "Apr 2002 — Jun 2007",
      note: "Assessed by WES as equivalent to a Canadian four-year bachelor's degree.",
    },

  ],


  /* ─────────────────────────────────────────────────────────────────────────
     CERTIFICATIONS

     If you ever have none, leave this as an empty list — like this:
     certifications: [],
     and the whole block disappears from the page.
     ───────────────────────────────────────────────────────────────────────── */
  certifications: [

    // ── COPY FROM HERE ──
    {
      name: "Nokia Certified Solution Associate (NCSA) — SRAN 22Rx Solution",
      issuer: "Nokia",
    },
    // ── TO HERE ──

    {
      name: "5G Radio Planning — Advanced (RA57210-V-22R3)",
      issuer: "Nokia",
    },

    {
      name: "5G Algorithms & Parameters (22R3-SR)",
      issuer: "Nokia",
    },

    {
      name: "5G System Fundamentals (3GPP Rel 16)",
      issuer: "Nokia",
    },

    {
      name: "Engineer-in-Training (EIT)",
      issuer: "APEGS — Association of Professional Engineers & Geoscientists of Saskatchewan",
      date: "Since 2018, working toward P.Eng.",
    },

    {
      name: "Member, Institution of Engineers, Bangladesh (IEB)",
      issuer: "IEB",
      date: "Since 2012",
    },

  ],

};
