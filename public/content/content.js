/* ═══════════════════════════════════════════════════════════════════════════
   content.js — THIS IS THE ONLY FILE YOU NORMALLY NEED TO EDIT.

   Everything on the site that is a list — jobs, the career chart, skills,
   projects, education, certifications — lives here.

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

   WHERE THIS SHOWS UP
     One file feeds all four pages. The same list can appear in two places —
     e.g. projects show as three cards on the home page and in full on the
     Projects page. You only ever edit it here, once.

   NOT IN THIS FILE
     Your name, the hero line, the About paragraphs and your contact links are
     written straight into the page files. CONTRIBUTING.md says exactly where.

   WHY THIS FILE LIVES INSIDE public/
     Only files inside public/ get served to the internet. A content folder
     next to public/ would never load. Do not move this file.
   ═══════════════════════════════════════════════════════════════════════════ */

window.SITE = {

  /* ─────────────────────────────────────────────────────────────────────────
     YOUR PHOTO — shows on the home page and on the About page.

     Nothing is shown until you add the file, and the layout is unaffected
     while it's missing, so there is no rush and nothing to undo.

       1. Export a square-ish headshot, about 600px wide. WebP is smallest;
          JPG is fine. Keep it under 60KB — it loads on every page.
       2. Upload it in the GitHub app to public/img/ as portrait.webp
          (Add file → Upload files, then choose the public/img folder).
       3. Delete the // in front of the "photo" line below.
       4. Commit the photo and this change together.

     Only paths inside /img/ are accepted, so the site can never be made to
     load a picture from someone else's server.
     ───────────────────────────────────────────────────────────────────────── */
  profile: {
     photo: "/img/portrait.webp",
    alt: "Sajib Islam",
  },

  /* ─────────────────────────────────────────────────────────────────────────
     CAREER — feeds BOTH charts from this one list:
       • the timeline on the home page (when each thing happened)
       • the column chart on /experience/ (how long each job lasted)

     Oldest first, top to bottom.

     "from" / "to"  are "YYYY-MM". Use "present" for the job you're in now.
                    ⚠ Write the month as two digits: "2007-09", not "2007-9".
                    The number of years is worked out from these, so nothing
                    ever goes stale — your current job grows on its own.
     "kind"         "study" draws a hollow bar and is left out of the column
                    chart. Leave it off for jobs.
     "mark"         short name for the tile when there is no logo file.
                    8 characters or fewer. Uppercased automatically.
     "logo"         optional. See the note below.
     "current"      draws in amber instead of teal. One job only.

     ── ADDING COMPANY LOGOS ────────────────────────────────────────────────
     Each entry shows a lettered tile until you give it a logo file.

       1. Get the logo from that company's own brand or press page. Check
          their brand guidelines — some ask permission before you use theirs.
       2. Save it as public/img/logos/nokia.svg (svg, png or webp).
          Square-ish works best. Monochrome or simple marks look sharpest.
       3. Add the line:   logo: "/img/logos/nokia.svg",
       4. Commit both the file and this change together.

     Only paths inside /img/logos/ are accepted, so nothing on this site can
     ever load an image from someone else's server.
     ───────────────────────────────────────────────────────────────────────── */
  timeline: [

    {
      company: "Bangladesh University of Engineering and Technology",
      mark: "BUET",
      kind: "study",
      role: "B.Sc. Electrical & Electronic Engineering",
      dates: "Apr 2002 — Jun 2007",
      from: "2002-04",
      to: "2007-06",
      logo: "/img/logos/buet.webp",
    },

    // ── COPY FROM HERE ──
    {
      company: "Grameenphone",
      mark: "GP",
      role: "Senior System Engineer",
      dates: "Sep 2007 — Oct 2011",
      from: "2007-09",
      to: "2011-10",
      logo: "/img/logos/grameenphone.webp",
    },
    // ── TO HERE ──

    {
      company: "Ericsson",
      mark: "ERICSSON",
      role: "Services Engineer",
      dates: "Oct 2011 — Nov 2013",
      from: "2011-10",
      to: "2013-11",
      logo: "/img/logos/ericsson.webp",
    },

    {
      company: "Huawei",
      mark: "HUAWEI",
      role: "Senior Engineer & Team Lead",
      dates: "Nov 2013 — Dec 2014",
      from: "2013-11",
      to: "2014-12",
      logo: "/img/logos/huawei.webp",
    },

    {
      company: "FlipNet (MTN Irancell)",
      mark: "FLIPNET",
      role: "4G & 3G Consultant / Team Lead",
      dates: "Dec 2014 — Jun 2018",
      from: "2014-12",
      to: "2018-06",
      logo: "/img/logos/flipnet.webp",
    },

    {
      company: "Nokia",
      mark: "NOKIA",
      role: "Senior NPO Engineer",
      dates: "Feb 2019 — Jan 2024",
      from: "2019-02",
      to: "2024-01",
      logo: "/img/logos/nokia.webp",
    },

    {
      company: "Genwave Technologies",
      mark: "GENWAVE",
      role: "RF Engineer",
      dates: "May 2025 — Present",
      from: "2025-05",
      to: "present",
      current: true,
      logo: "/img/logos/genwave.webp",
    },

  ],


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
        "Planned, implemented and optimized a network transition covering more than 2,000 sites, delivered inside an eighteen-month target.",
        "Troubleshot parameter mismatch, high uplink interference, TX faults, capacity bottlenecks, MIMO configuration and Carrier Aggregation issues.",
        "Mentored and trained team members in RF design and optimization methodology.",
      ],
    },

    {
      title: "Senior RNP/RNO Engineer & IBS Team Lead",
      company: "Huawei Technologies",
      location: "Dhaka, Bangladesh",
      dates: "Nov 2013 — Dec 2014",
      bullets: [
        "Led the IBS team executing a 250+ site in-building vendor swap from Ericsson to Huawei for the largest mobile operator in Bangladesh, holding KPI parity through every cutover.",
        "Delivered multi-vendor RAN planning, design and optimization for operators across Bangladesh and Myanmar (Telenor, Ooredoo).",
        "Coordinated multi-entity delivery, presented daily progress to senior management, and trained stakeholder and vendor teams through deployment cycles.",
      ],
    },

    {
      title: "Services Engineer",
      company: "Ericsson",
      location: "Dhaka, Bangladesh",
      dates: "Oct 2011 — Nov 2013",
      bullets: [
        "Designed and deployed 100+ in-building (IBS/DAS) systems and 200+ repeater sites for Grameenphone, the largest mobile operator in Bangladesh.",
        "Performed RF planning, design and optimization for 2G, 3G and LTE networks, including coverage prediction, link budgets and neighbour planning.",
        "Produced design packages, close-out documentation and performance reports for multi-site deployments.",
      ],
    },

    {
      title: "Senior System Engineer",
      company: "Grameenphone",
      location: "Dhaka, Bangladesh",
      dates: "Sep 2007 — Oct 2011",
      bullets: [
        "Completed planning and design for more than 200 sites, and built the end-to-end working process the technology division used for site solutions.",
        "Performed RF site surveys, coverage analysis and new-site candidate evaluations across the national network.",
        "Coordinated between planning, implementation and optimization teams to ensure sites met coverage and quality targets.",
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
        "Monte Carlo simulation",
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
        "Open RAN",
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
        "Worst-cell optimization",
        "SSV & KPI acceptance",
      ],
    },

    {
      group: "Data & automation",
      items: [
        "Python",
        "SQL",
        "Power BI",
        "Power Query",
        "Power Pivot",
        "DAX",
        "Tableau",
        "Looker Studio",
        "VBA",
        "Shell",
        "Excel (advanced)",
      ],
    },

    {
      group: "Mapping & documentation",
      items: [
        "MapInfo",
        "QGIS",
        "AutoCAD",
        "Design packages",
        "Close-out documentation",
      ],
    },

  ],


  /* ─────────────────────────────────────────────────────────────────────────
     PROJECTS — three of these show on the home page, all of them on /projects/.

     "blurb"  is the short version, used on the cards.
     "detail" is the longer version, used only on the Projects page.
              Delete the line if you don't want a longer version.
     "featured: true" picks which ones appear on the home page. Pick three.
     "link" is optional — delete it and "linkLabel" if there's nothing to link.
     ───────────────────────────────────────────────────────────────────────── */
  projects: [

    // ── COPY FROM HERE ──
    {
      name: "RF measurement & reporting automation",
      featured: true,
      blurb: "Python tooling that turns raw walk-test and measurement data into finished survey reports, replacing manual document assembly.",
      detail: "Site survey reporting used to mean exporting measurement data, pasting it into a template, redrawing floorplan overlays by hand and reformatting everything for the client. This ingests the raw measurement files directly and produces the finished report. The point was never the tooling — it was that engineering time was going into document assembly instead of engineering. Cut analysis turnaround time by 90%.",
      tech: ["Python", "Pandas", "Excel"],
      outcome: "90% faster turnaround",
    },
    // ── TO HERE ──

    {
      name: "Pre-swap / post-swap KPI analytics",
      featured: true,
      blurb: "Power BI model comparing network KPIs before and after vendor swaps across a large RAN estate, turning raw counter data into ranked optimization actions.",
      detail: "After an OEM swap, the question senior stakeholders ask is simply whether the network still performs. Answering it properly means comparing hundreds of counters across thousands of cells, in a form somebody can act on. This model pulled from SQL Server, SharePoint and CSV exports into one data model, applied row-level security so each team saw only its own estate, and produced a ranked list of what regressed and by how much — not a wall of charts.",
      tech: ["Power BI", "DAX", "Power Query", "SQL"],
      outcome: "Adopted for stakeholder reporting",
    },

    {
      name: "IBS vendor swap — 250+ sites",
      featured: true,
      blurb: "Planned and executed an in-building system swap from Ericsson to Huawei across more than 250 sites for the largest mobile operator in Bangladesh.",
      detail: "A vendor swap on in-building systems is unforgiving: the sites are venues with real occupants, the cutover windows are short, and the acceptance criterion is that nobody notices. This covered planning, sequencing and post-swap KPI optimization across more than 250 sites, holding performance parity through cutover.",
      tech: ["IBS / DAS", "Multi-vendor KPI mapping", "Huawei", "Ericsson"],
      outcome: "KPI parity held through cutover",
    },

    {
      name: "2,000-site network transition",
      blurb: "Planned, implemented and optimized a 4G/3G network transition covering more than 2,000 sites for MTN Irancell, delivered inside an eighteen-month target.",
      detail: "End-to-end RF planning and optimization at national scale in Atoll — coverage and capacity plans, link budgets, PCI and neighbour planning, and new-site candidate evaluation — while monitoring network, city and cluster level KPIs throughout and driving corrective action when clusters fell behind target.",
      tech: ["Atoll", "RF planning", "KPI optimization"],
      outcome: "2,000+ sites in 18 months",
    },

    {
      name: "Private 5G & Cisco URWB deployments",
      blurb: "Design, commissioning and optimization of Private 5G and Cisco URWB networks for large Canadian venues, from link budget through to close-out documentation.",
      detail: "Private networks in venues bring constraints a public macro network doesn't: the coverage target is a specific floor plate, the interference environment is other tenants, and the client wants evidence rather than assurances. Work spans design packages and link budgets, head-end and remote integration across ADRF, Corning/BTI and Zinwave, CW, PIM and walk testing, EMF and Safety Code 6 validation, and the close-out pack.",
      tech: ["Private 5G", "Cisco URWB", "iBwave", "Walk testing"],
    },

    {
      name: "5G SSV & KPI acceptance",
      blurb: "Prepared, verified and defended 5G system verification and KPI acceptance reports against contractual targets on domestic and overseas Nokia projects.",
      detail: "Acceptance is where a network stops being an engineering problem and becomes a contractual one. This meant running the verification, assembling the evidence, and then standing behind the numbers with the customer when a target was contested — including the multi-vendor counter and feature mapping needed to show that two different vendors' equipment were being measured on equivalent terms.",
      tech: ["5G NR", "Nokia NetAct", "KPI acceptance"],
    },

  ],


  /* ─────────────────────────────────────────────────────────────────────────
     EDUCATION — newest first.

     "note" is optional. Delete the line if you don't want one.
     ───────────────────────────────────────────────────────────────────────── */
  education: [

    // ── COPY FROM HERE ──
    {
      credential: "B.Sc. in Electrical & Electronic Engineering",
      institution: "Bangladesh University of Engineering and Technology (BUET)",
      location: "Dhaka, Bangladesh",
      dates: "Apr 2002 — Jun 2007",
      note: "Assessed by WES as equivalent to a Canadian four-year bachelor's degree.",
    },
    // ── TO HERE ──

  ],


  /* ─────────────────────────────────────────────────────────────────────────
     CERTIFICATIONS & AFFILIATIONS

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


  /* ─────────────────────────────────────────────────────────────────────────
     RECOGNITION — shows on the About page. Leave as [] to hide the section.
     ───────────────────────────────────────────────────────────────────────── */
  recognition: [

    // ── COPY FROM HERE ──
    {
      name: "Appreciate Excellence Award",
      detail: "Nokia / Ericsson — outstanding support on the TDD LTE2300 project.",
    },
    // ── TO HERE ──

    {
      name: "Appreciate Excellence Award",
      detail: "Nokia / Ericsson — sustained effort through an OEM network swap.",
    },

  ],

};
