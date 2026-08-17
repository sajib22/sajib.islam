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

     Write them in any order you like — both charts sort themselves, newest
     first, from the "from" dates below.

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
      role: "B.Sc. Electrical and Electronic Engineering",
      dates: "Apr 2002 — Jun 2007",
      from: "2002-04",
      to: "2007-06",
      logo: "/img/logos/buet.webp",
    },

    // ── COPY FROM HERE ──
    {
      company: "Grameenphone",
      mark: "GP",
      role: "System Engineer → Senior System Engineer",
      dates: "Sep 2007 — Oct 2011",
      from: "2007-09",
      to: "2011-10",
      logo: "/img/logos/grameenphone.webp",
    },
    // ── TO HERE ──

    {
      company: "Ericsson",
      mark: "ERICSSON",
      role: "Services Engineer (RAN Planning and Optimization)",
      dates: "Oct 2011 — Nov 2013",
      from: "2011-10",
      to: "2013-11",
      logo: "/img/logos/ericsson.webp",
    },

    {
      company: "Huawei Technologies",
      mark: "HUAWEI",
      role: "Senior RNP and RNO Engineer, IBS Team Lead",
      dates: "Nov 2013 — Dec 2014",
      from: "2013-11",
      to: "2014-12",
      logo: "/img/logos/huawei.webp",
    },

    {
      company: "FlipNet (MTN Irancell)",
      mark: "FLIPNET",
      role: "4G and 3G RF Consultant and Team Lead",
      dates: "Dec 2014 — Jun 2018",
      from: "2014-12",
      to: "2018-06",
      logo: "/img/logos/flipnet.webp",
    },

    {
      company: "Nokia",
      mark: "NOKIA",
      role: "Senior NPO Engineer (5G/4G/3G/2G)",
      dates: "Feb 2019 — Jan 2024",
      from: "2019-02",
      to: "2024-01",
      logo: "/img/logos/nokia.webp",
    },

    {
      company: "WIRELESSWAVE",
      mark: "WW",
      role: "Retail Sales Analyst",
      dates: "Apr 2024 — May 2025",
      from: "2024-04",
      to: "2025-05",
      logo: "/img/logos/wirelesswave.png",
    },

    {
      company: "Genwave Technologies",
      mark: "GENWAVE",
      role: "RF DAS Engineer",
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
     "bullets" is a list of what you did. Write scope and outcome rather than
               a job description. Six to ten suits a recent role; older roles
               can be shorter.
     ───────────────────────────────────────────────────────────────────────── */
  experience: [

    // ── COPY FROM HERE ──
    {
      title: "RF DAS Engineer",
      company: "Genwave Technologies",
      location: "Mississauga, ON",
      dates: "May 2025 — Present",
      current: true,
      bullets: [
        "Design and optimize 4G and 5G Distributed Antenna System solutions for commercial, healthcare, enterprise and public safety environments in iBwave, covering buildings up to 1.5M+ sq ft and improving indoor coverage by up to 25 dB.",
        "Plan, design, commission and optimize multi-band 5G/LTE in-building systems and Private 5G / Cisco URWB networks for major Canadian venues, validating coverage, capacity and quality against engineered targets.",
        "Conduct RF site surveys, walk tests and post-installation validation, analysing LTE and 5G KPIs including RSRP, SINR, throughput, VoLTE quality and packet loss to lift network performance by 20%+.",
        "Develop DAS prediction models and perform RF optimization for coverage, quality and capacity, holding carrier acceptance above 98% across multi-operator deployments.",
        "Integrate and tune multi-vendor head-end and remote equipment — ADRF, Corning/BTI, Zinwave — with CW, PIM and walk testing, EMF and Safety Code 6 validation, and root-cause troubleshooting.",
        "Run pre-sales and post-installation surveys for DAS and in-building wireless, identifying coverage gaps, interference and capacity limits, and preparing the technical RF analysis and client reports.",
        "Design and optimize indoor Wi-Fi for enterprise and commercial facilities, completing survey analysis, reporting and predictive design across 20+ sites.",
        "Build automation for RF engineering workflows — PCTel survey report automation, floor-area calculators, ROM estimators, Ekahau ESX parsers and iBwave test-sheet generators — saving around six man-hours per project.",
        "Develop Power BI dashboards for PCTel RF survey data and ISED site information, improving reporting efficiency and RF performance visualisation.",
        "Collaborate with engineering, construction and carrier teams at Bell, Rogers and Telus on neutral-host LTE/5G DAS and Public Safety DAS compliant with ISED standards.",
      ],
    },
    // ── TO HERE ──

    {
      title: "Retail Sales Analyst",
      company: "WIRELESSWAVE / WAVE SANS FIL",
      location: "Toronto, Ontario, Canada",
      dates: "Apr 2024 — May 2025",
      bullets: [
        "Increased overall sales by 127% YoY while consistently meeting personal sales targets over the final six months.",
        "Engaged customers to understand their needs, provide tailored solutions, and explain telecommunications products, services and promotions.",
        "Delivered customer-focused telecommunications solutions, driving upselling and cross-selling opportunities against target.",
        "Addressed inquiries, concerns and complaints promptly and professionally to reach satisfactory resolutions and hold long-term relationships.",
        "Provided end-to-end customer support, including product demonstrations, installations, troubleshooting, and issue resolution.",
        "Collaborated with technical support, retail support, billing and marketing to deliver a cohesive customer experience and meet sales targets.",
        "Stayed current on industry trends, new products and technology advances to sharpen product knowledge and sales effectiveness.",
      ],
    },

    {
      title: "Senior NPO Engineer (5G/4G/3G/2G Expert and Data Analyst)",
      company: "Nokia",
      location: "Dhaka, Bangladesh",
      dates: "Feb 2019 — Jan 2024",
      bullets: [
        "Led a team of 3 engineers to customer acceptance on more than 20 target KPIs, improving the network by 10% month over month.",
        "Led LTE and 5G RAN optimization on domestic and overseas projects, preparing and defending 5G SSV and KPI acceptance reports against contractual targets.",
        "Led end-to-end cluster optimization of 2G, 3G and 4G after the swap from Huawei to Nokia, holding KPIs through to final acceptance.",
        "Prepared SSV (Single Site Verification) and PAC (Preliminary Acceptance Certificate) reports after 5G NR deployment for the shared RAN networks of M1 and StarHub in Singapore.",
        "Diagnosed poor 5G NR performance from drive test — SS-RSRP, SS-SNR, downlink and uplink throughput, and serving SSB beam — and resolved each with written justification.",
        "Prepared planning and configuration data for the 2G, 3G and 4G swap and Nokia SRAN deployment, and radio network design data for LTE-TDD planning, deployment and acceptance.",
        "Performed multi-vendor KPI, counter, parameter and feature mapping across Nokia, Ericsson and Huawei to certify equivalent network behaviour after swaps and feature introductions.",
        "Executed parameter optimization, antenna tuning and transmission fault resolution to lift RRC and ERAB setup success, handover success, CQI, throughput, latency, SRVCC and VoLTE call setup and drop rates, and PRB utilisation.",
        "Resolved coverage (RSRP/RSCP), quality (RSRQ/SINR), mobility and handover problems through worst-cell parameter and Layer-1 optimization driven by drive-test and device-log analysis.",
        "Balanced traffic across LTE layers and tuned layering parameters, raising 10th-percentile throughput.",
        "Built Power BI, Tableau and Looker Studio analytics — including pre-swap versus post-swap comparison — that turned large KPI datasets into specific optimization recommendations for senior stakeholders.",
      ],
    },

    {
      title: "4G and 3G RF Consultant and Team Lead",
      company: "FlipNet (MTN Irancell)",
      location: "Tehran, Iran",
      dates: "Dec 2014 — Jun 2018",
      bullets: [
        "Planned, implemented and optimized a network transition covering more than 2,000 sites, delivered inside an eighteen-month target.",
        "Led the LTE-FDD, LTE-TDD and 3G radio planning and optimization team at FlipNet, service provider to MTN Irancell.",
        "Owned end-to-end RF planning and optimization of 4G and 3G in Atoll — coverage and capacity planning, link budgets, PCI and neighbour planning, and new-site candidate evaluation.",
        "Planned and designed LTE-FDD, LTE-TDD and 3G cell design data, PCI, PRACH, PSC and neighbour relations, plus the core network definition for the customer network.",
        "Ran drive tests and log-file analysis against poor RSRP/RSCP, Ec/No, RSRQ and pilot pollution, then executed the physical and parameter optimization to correct it.",
        "Tuned 3G (U900 and WCDMA F1/F2/F3) for accessibility (RRC and RAB), integrity (HS and EUL throughput), retainability (CS and HS drop), mobility (IRAT and soft handover), and power, code and CE congestion.",
        "Tuned LTE-FDD and LTE-TDD for accessibility (RRC, ERAB, S1), retainability (ERAB and UE context drop), integrity (throughput and latency), mobility, and PUSCH/PUCCH interference.",
        "Proposed and planned configuration for VoLTE, 4x4 MIMO, Carrier Aggregation, LTE900, LTE-TDD, LTE-FDD, UMTS900 and multi-layer WCDMA, and ran feature trials with reports to stakeholders.",
        "Prepared scripts for parameter baselines and new configurations including MIMO, Carrier Aggregation and RET (Remote Electrical Tilt).",
        "Troubleshot parameter mismatch, high uplink interference, TX faults, capacity bottlenecks, MIMO configuration and Carrier Aggregation issues.",
        "Mentored and trained team members in RF planning and optimization methodology.",
      ],
    },

    {
      title: "Senior RNP and RNO Engineer and IBS Team Lead",
      company: "Huawei Technologies",
      location: "Dhaka, Bangladesh",
      dates: "Nov 2013 — Dec 2014",
      bullets: [
        "Managed a team of 5 engineers delivering network services, hitting a network modernisation target within four months.",
        "Led the IBS team executing a 250+ site in-building vendor swap from Ericsson to Huawei for the largest mobile operator in Bangladesh, holding KPI parity through every cutover.",
        "Designed and planned 3G radio networks including IBS and small cell for operators to meet target KPIs inside the deadline.",
        "Analysed 3G KPIs daily — call drop, HS drop, R99 drop, RAB and RRC success, soft and IRAT handover success, and HS, EUL and R99 throughput — to drive optimization of the worst-performing cells.",
        "Prepared Active and Passive DAS designs to upgrade existing 2G IBS sites to 3G in the iBwave design tool, achieving target RSCP and Ec/Io.",
        "Compared walk and drive test results before and after NodeB integration, then executed physical and parameter optimization to meet the KPIs.",
        "Rectified parameter inconsistencies and missing neighbours after NodeB integration across a cluster, and resolved 3G service complaints inside SLA.",
        "Delivered multi-vendor RAN planning, design and optimization for operators across Bangladesh and Myanmar (Telenor, Ooredoo).",
        "Coordinated multi-entity delivery, presented regular reports and dashboards to senior management, and mentored the IBS team through deployment cycles.",
      ],
    },

    {
      title: "Services Engineer (RAN Planning and Optimization)",
      company: "Ericsson",
      location: "Dhaka, Bangladesh",
      dates: "Oct 2011 — Nov 2013",
      bullets: [
        "Designed and deployed 100+ in-building (IBS/DAS) systems and 200+ repeater sites for Grameenphone, the largest mobile operator in Bangladesh.",
        "Maintained RF network performance against pre-defined KPIs and project timelines, analysing daily cell-level and network-level performance and acting on the worst-performing cells.",
        "Performed RF planning, design and optimization for 2G, 3G and LTE networks, including coverage prediction, link budgets and neighbour planning.",
        "Ran routine drive tests to find coverage and quality black spots, then executed soft parameter optimization and hard tuning, reporting results to stakeholders.",
        "Reviewed IBS and repeater designs as a consultant and fed back the modifications needed before build.",
        "Raised change requests for network improvement through parameter tuning, neighbour optimization, and feature activation or deactivation.",
        "Performed pre- and post-KPI analysis and parameter audit after critical activity — network swap, BSC re-homing, network-level frequency change, and BSC migration.",
        "Checked cell-level utilisation and recommended capacity augmentation to the radio design team, and completed benchmarking against competing networks.",
        "Resolved customer complaints inside SLA, coordinating with other departments on hardware faults through trouble tickets to closure.",
        "Produced design packages, close-out documentation and performance reports for multi-site deployments.",
      ],
    },

    {
      title: "Senior System Engineer (IBS Specialist)",
      company: "Grameenphone",
      location: "Dhaka, Bangladesh",
      dates: "Feb 2011 — Oct 2011",
      bullets: [
        "Specialised in RF planning, design and optimization for In-Building Solutions (IBS), covering both active and passive DAS.",
        "Delivered the IBS for Jamuna Future Park, the largest shopping centre in Bangladesh, and the Old Dhaka optimization programme combining IBS with macro sites.",
        "Led an IBS network swap from Ericsson to Huawei across more than 200 in-building sites, and deployed femto and pico small cells.",
        "Designed Wi-Fi hotspots integrated with the IBS system and built repeater solutions for corporate and VIP clients.",
        "Ran preliminary 3G network planning, and repeater site planning for both indoor and outdoor coverage.",
        "Monitored site performance, post-processed results, and generated regular optimization and performance reports.",
        "Held radio network service through major events as a member of the Event Management team.",
      ],
    },

    {
      title: "Senior Executive",
      company: "Grameenphone",
      location: "Dhaka, Bangladesh",
      dates: "May 2010 — Feb 2011",
      bullets: [
        "Planned, designed and dimensioned outdoor and in-building coverage, capacity and quality as a member of the IBS team.",
        "Designed and dimensioned the first active DAS (fibre) system ever deployed for IBS in Bangladesh, at Grameenphone's corporate headquarters.",
        "Delivered Project Sting Ray, a cost-effective radio network solution for corporate and VIP customers, alongside the Old Dhaka optimization project.",
        "Built repeater solutions for corporate, VIP and strategic clients in response to customer complaints.",
        "Designed Wi-Fi network coverage integrated with IBS, and dimensioned voice and data service to hold predefined KPIs.",
        "Ran drive testing with TEMS, log-file analysis and post-processing, publishing performance reports with resolutions.",
        "Held radio network service with optimum resource utilisation through major events as a member of the Event Management team.",
      ],
    },

    {
      title: "System Engineer",
      company: "Grameenphone",
      location: "Dhaka, Bangladesh",
      dates: "Sep 2007 — May 2010",
      bullets: [
        "Planned, designed and optimized radio sites as a member of the Radio Planning team, and worked as an IBS specialist within the IBS team.",
        "Built indoor and outdoor repeater solutions, and designed Wi-Fi hotspots integrated with IBS.",
        "Designed and planned active and passive DAS for in-building systems, including customised solutions for VIP and corporate locations.",
        "Monitored site performance, ran regular voice and data dimensioning, and resolved poor-performing cells.",
        "Produced cost-effective and customised radio network solutions, with post-processing and regular report generation.",
        "Supported radio network coverage through major events as a member of the Event Management team.",
      ],
    },

  ],


  /* ─────────────────────────────────────────────────────────────────────────
     SKILLS — grouped by domain, not a flat tag cloud.

     Add a skill by adding "Its name", inside the right group's items list.
     Add a whole new group by copying a { } block.

     "level"  draws the signal-strength bars beside every skill in the group.
              5 = all five bars lit, for the core RF work.
              4 = four bars lit and the fifth left empty, for the advanced and
                  additional skills.
              Change the one number to change the whole group. Leave the line
              out entirely and the group shows five bars.
              Nothing below 4 is used, on purpose: a three-bar group reads to
              a recruiter as an admission rather than as a rating.
     ───────────────────────────────────────────────────────────────────────── */
  skills: [

    // ── COPY FROM HERE ──
    {
      group: "RF Design and Planning",
      level: 5,
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
        "CW, PIM and walk testing",
        "EMF / Safety Code 6",
      ],
    },
    // ── TO HERE ──

    {
      group: "RAN and Vendor Platforms",
      level: 5,
      items: [
        "Nokia SRAN and AirScale",
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
      group: "Test and Analysis",
      level: 5,
      items: [
        "TEMS Investigation",
        "Nemo Analyzer",
        "ActixOne",
        "Huawei Genex",
        "Drive test analysis",
        "Call trace (GPEH, UeTR, CTR)",
        "Layer 3 signaling analysis",
        "Worst-cell optimization",
        "SSV and KPI acceptance",
      ],
    },

    {
      group: "Data and Automation",
      level: 4,
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
      group: "Mapping and Documentation",
      level: 4,
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
     SOFT SKILLS — the people side, shown on the Skills page beside the
     technical groups above. Same shape: a "group", its "level" and its
     "items". "level" works exactly as it does for the skills above.
     ───────────────────────────────────────────────────────────────────────── */
  softSkills: [

    // ── COPY FROM HERE ──
    {
      group: "Leadership and Mentoring",
      level: 5,
      items: [
        "Led teams of 3 to 5 engineers to KPI acceptance",
        "Mentoring and training in RF planning and optimization",
        "Building the working process a technology division runs on",
      ],
    },
    // ── TO HERE ──

    {
      group: "Client and Stakeholder Communication",
      level: 5,
      items: [
        "Presenting results and recommendations to senior management",
        "Defending acceptance reports against contractual targets",
        "Carrier and OEM coordination — Bell, Rogers, Telus",
        "Turning measurement data into decisions non-specialists can act on",
      ],
    },

    {
      group: "Project Delivery",
      level: 5,
      items: [
        "End-to-end delivery from survey to close-out pack",
        "Multi-vendor and multi-entity coordination",
        "Working to SLA under deadline pressure",
        "Scope, risk and progress reporting",
      ],
    },

    {
      group: "Problem Solving",
      level: 5,
      items: [
        "Root-cause analysis on live networks",
        "Reading an in-building problem as a network problem first",
        "Proposing cost-effective alternatives to the obvious fix",
      ],
    },

    {
      group: "Working Across Cultures",
      level: 4,
      items: [
        "Delivered in Bangladesh, Iran, Myanmar, Singapore and Canada",
        "Teams where English was nobody's first language",
        "English — full professional proficiency",
        "Bengali — native or bilingual proficiency",
      ],
    },

  ],


  /* ─────────────────────────────────────────────────────────────────────────
     GLOSSARY — what the acronyms mean.

     Any term listed here gets a dotted underline the first time it appears in
     a paragraph of explanation, and shows its definition on hover or when
     tabbed to. Written once here, defined everywhere it is used, on every
     page — you never mark anything up in the page files.

     Add one by copying a line. Keep the definition to a sentence or two; it
     is read in a small box, not on a page of its own.

     Only whole words are matched, so "CW" will never be found inside a word
     like "network". A term that appears inside a link or a heading is left
     alone.
     ───────────────────────────────────────────────────────────────────────── */
  glossary: {
    "DAS": "Distributed Antenna System — one signal source shared across many low-power antennas spread through a building, instead of one distant high-power source.",
    "IBS": "In-Building Solution — the general term for any system built to deliver mobile coverage inside a structure the outdoor network cannot reach.",
    "BDA": "Bi-Directional Amplifier — amplifies both the downlink and the uplink of an off-air feed. Its usable gain is limited by isolation from the donor antenna.",
    "BTS": "Base Transceiver Station — the carrier's own radio equipment installed on site, giving the building dedicated capacity rather than borrowing the macro cell's.",
    "PIM": "Passive Intermodulation — unwanted mixing products from a corroded joint or a bad connector, which show up as unexplained noise on the uplink.",
    "CW": "Continuous Wave — a single unmodulated tone injected into the system to measure real path loss against the design prediction.",
    "EMF": "Electromagnetic Field — the radiated exposure a system produces, validated against a legal limit. In Canada that limit is Safety Code 6.",
    "RAN": "Radio Access Network — the radio side of a mobile network: the base stations and antennas between the handset and the core.",
    "KPI": "Key Performance Indicator — the measured numbers a network is judged by, such as accessibility, retainability and throughput.",
    "URWB": "Ultra-Reliable Wireless Backhaul — Cisco's wireless system for links that must stay up while moving, used for vehicles, cranes and trackside equipment.",
    "EIRP": "Effective Isotropic Radiated Power — the power actually leaving an antenna once gain and every cable and connector loss are accounted for.",
    "VSWR": "Voltage Standing Wave Ratio — how much power is reflected back down a feeder instead of radiating. A high figure means a fault in the line or the antenna.",
  },


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
      name: "RF Measurement and Reporting Automation",
      featured: true,
      blurb: "Python tooling that turns raw walk-test and measurement data into finished survey reports, replacing manual document assembly.",
      detail: "Site survey reporting used to mean exporting measurement data, pasting it into a template, redrawing floorplan overlays by hand and reformatting everything for the client. This reads the raw measurement files directly and produces the finished report. The problem it solves is not the tooling: engineering time was going into document assembly. Cut analysis turnaround time by 90%.",
      tech: ["Python", "Pandas", "Excel"],
      outcome: "90% faster turnaround",
    },
    // ── TO HERE ──

    {
      name: "Pre-swap / Post-swap KPI Analytics",
      featured: true,
      blurb: "Power BI model comparing network KPIs before and after vendor swaps across a large RAN estate, turning raw counter data into ranked optimization actions.",
      detail: "After an OEM swap, the question senior stakeholders ask is simply whether the network still performs. Answering it properly means comparing hundreds of counters across thousands of cells, in a form somebody can act on. This model pulled SQL Server, SharePoint and CSV exports into one data model, with row-level security so each team saw only its own estate. The output is a ranked list of what regressed and by how much, rather than a wall of charts.",
      tech: ["Power BI", "DAX", "Power Query", "SQL"],
      outcome: "Adopted for stakeholder reporting",
    },

    {
      name: "IBS Vendor Swap — 250+ Sites",
      featured: true,
      blurb: "Planned and executed an in-building system swap from Ericsson to Huawei across more than 250 sites for the largest mobile operator in Bangladesh.",
      detail: "A vendor swap on in-building systems is unforgiving: the sites are venues with real occupants, the cutover windows are short, and the acceptance criterion is that nobody notices. This covered planning, sequencing and post-swap KPI optimization across more than 250 sites, holding performance parity through cutover.",
      tech: ["IBS / DAS", "Multi-vendor KPI mapping", "Huawei", "Ericsson"],
      outcome: "KPI parity held through cutover",
    },

    {
      name: "2,000-site Network Transition",
      blurb: "Planned, implemented and optimized a 4G/3G network transition covering more than 2,000 sites for MTN Irancell, delivered inside an eighteen-month target.",
      detail: "RF planning and optimization at national scale in Atoll: coverage and capacity plans, link budgets, PCI and neighbour planning, and new-site candidate evaluation. Network, city and cluster KPIs were monitored throughout, with corrective action wherever a cluster fell behind target.",
      tech: ["Atoll", "RF planning", "KPI optimization"],
      outcome: "2,000+ sites in 18 months",
    },

    {
      name: "Private 5G and Cisco URWB Deployments",
      blurb: "Design, commissioning and optimization of Private 5G and Cisco URWB networks for large Canadian venues, from link budget through to close-out documentation.",
      detail: "Private networks in venues bring constraints a public macro network doesn't: the coverage target is a specific floor plate, the interference environment is other tenants, and the client wants evidence rather than assurances. Work spans design packages and link budgets, head-end and remote integration across ADRF, Corning/BTI and Zinwave, CW, PIM and walk testing, EMF and Safety Code 6 validation, and the close-out pack.",
      tech: ["Private 5G", "Cisco URWB", "iBwave", "Walk testing"],
    },

    {
      name: "5G SSV and KPI Acceptance",
      blurb: "Prepared, verified and defended 5G system verification and KPI acceptance reports against contractual targets on domestic and overseas Nokia projects.",
      detail: "Acceptance is where a network stops being an engineering problem and becomes a contractual one. That meant running the verification, assembling the evidence, and defending the numbers with the customer when a target was contested. It also meant the multi-vendor counter and feature mapping needed to show that two vendors' equipment were measured on equivalent terms.",
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
      credential: "B.Sc. in Electrical and Electronic Engineering",
      institution: "Bangladesh University of Engineering and Technology (BUET)",
      location: "Dhaka, Bangladesh",
      dates: "Apr 2002 — Jun 2007",
      /* "from" and "to" are what the timeline plot at the top of the page is
         drawn from — same "YYYY-MM" format as the career timeline. Leave them
         off an entry and it simply doesn't appear in the plot. "mark" is the
         short label shown when there is no logo file. */
      from: "2002-04",
      to: "2007-06",
      mark: "BUET",
      logo: "/img/logos/buet.webp",
      note: "Assessed by WES as equivalent to a Canadian four-year bachelor's degree.",
    },
    // ── TO HERE ──

    {
      credential: "Higher Secondary Certificate (H.S.C.), Science",
      institution: "Notre Dame College",
      location: "Dhaka, Bangladesh",
      dates: "Jun 1999 — May 2001",
      from: "1999-06",
      to: "2001-05",
      mark: "NDC",
      logo: "/img/logos/Notre_Dame_College_Dhaka.png",
    },

    {
      credential: "Secondary School Certificate (S.S.C.), Science",
      institution: "B.L. Government High School",
      location: "Sirajganj, Bangladesh",
      dates: "Jan 1997 — Mar 1999",
      from: "1997-01",
      to: "1999-03",
      mark: "BLGHS",
      logo: "/img/logos/BL_School_Logo.png",
    },

  ],


  /* ─────────────────────────────────────────────────────────────────────────
     CERTIFICATIONS and AFFILIATIONS

     If you ever have none, leave this as an empty list — like this:
     certifications: [],
     and the whole block disappears from the page.
     ───────────────────────────────────────────────────────────────────────── */
  certifications: [

    // ── COPY FROM HERE ──
    {
      name: "Nokia Certified Solution Associate (NCSA) — SRAN 22Rx Solution",
      issuer: "Nokia",
      logo: "/img/logos/nokia.webp",
      mark: "NOKIA",
    },
    // ── TO HERE ──

    {
      name: "5G Radio Planning — Advanced (RA57210-V-22R3)",
      issuer: "Nokia",
      logo: "/img/logos/nokia.webp",
      mark: "NOKIA",
    },

    {
      name: "5G Algorithms and Parameters (22R3-SR)",
      issuer: "Nokia",
      logo: "/img/logos/nokia.webp",
      mark: "NOKIA",
    },

    {
      name: "5G System Fundamentals (3GPP Rel 16)",
      issuer: "Nokia",
      logo: "/img/logos/nokia.webp",
      mark: "NOKIA",
    },

    {
      name: "Learning Data Analytics Part 1: Foundations",
      issuer: "LinkedIn Learning",
      logo: "/img/logos/linkedin_logo.png",
      mark: "LINKEDIN",
    },

    {
      name: "Learning Data Analytics Part 2: Extending and Applying Core Knowledge",
      issuer: "LinkedIn Learning",
      logo: "/img/logos/linkedin_logo.png",
      mark: "LINKEDIN",
    },

    {
      name: "Excel for Business Analysts",
      issuer: "LinkedIn Learning",
      logo: "/img/logos/linkedin_logo.png",
      mark: "LINKEDIN",
    },

    {
      name: "Quick Start Guide to SQL",
      issuer: "LinkedIn Learning",
      logo: "/img/logos/linkedin_logo.png",
      mark: "LINKEDIN",
    },

    {
      name: "MySQL Essential Training",
      issuer: "LinkedIn Learning",
      logo: "/img/logos/linkedin_logo.png",
      mark: "LINKEDIN",
    },

  ],


  /* ─────────────────────────────────────────────────────────────────────────
     ORGANISATIONS — professional bodies and memberships.

     Same shape as certifications: "name" is required, "issuer" and "date"
     are optional. Leave the list empty and the section disappears.
     ───────────────────────────────────────────────────────────────────────── */
  organizations: [

    // ── COPY FROM HERE ──
    {
      name: "Engineer-in-Training (EIT)",
      issuer: "APEGS — Association of Professional Engineers and Geoscientists of Saskatchewan",
      date: "Since 2018, working toward P.Eng.",
      logo: "/img/logos/apegs_logo.png",
      mark: "APEGS",
    },
    // ── TO HERE ──

    {
      name: "Member, Institution of Engineers, Bangladesh (IEB)",
      issuer: "IEB",
      date: "Since 2012",
      logo: "/img/logos/ieb_logo.webp",
      mark: "IEB",
    },

  ],


  /* ─────────────────────────────────────────────────────────────────────────
     RECOGNITION — shows on the About page. Leave as [] to hide the section.
     ───────────────────────────────────────────────────────────────────────── */
  recognition: [

    // ── COPY FROM HERE ──
    {
      name: "Appreciate Excellence Award: Open",
      detail: "Nokia — outstanding support on the TDD LTE2300 project.",
      logo: "/img/logos/nokia.webp",
      mark: "NOKIA",
    },
    // ── TO HERE ──

    {
      name: "Appreciate Excellence Award: Empowered",
      detail: "Nokia — sustained effort through an OEM network swap.",
      logo: "/img/logos/nokia.webp",
      mark: "NOKIA",
    },

  ],

};
