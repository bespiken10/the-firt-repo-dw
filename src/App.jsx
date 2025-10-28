import React from "react";
import { submitFitAudit } from "./submit";

export default function App() {
  //() {
  // ===== Animated counters helper + Proof visibility =====
  // Page-load reveal state
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    const t = setTimeout(() => setMounted(true), 10);
    return () => clearTimeout(t);
  }, []);
  // helper to apply staggered reveal
  const reveal = (delay = 0) =>
    mounted
      ? { className: "animate-fadeSlideUp", style: { animationDelay: `${delay}ms` } }
      : { className: "opacity-0 translate-y-3" };

  const [proofVisible, setProofVisible] = React.useState(false);
  const proofRef = React.useRef(null);

  const useAnimatedNumber = (start, end, run, duration = 1200) => {
    const [val, setVal] = React.useState(start);
    React.useEffect(() => {
      if (!run) return;
      const diff = end - start;
      const startTime = Date.now();
      const tick = () => {
        const t = Math.min((Date.now() - startTime) / duration, 1);
        setVal(start + diff * t);
        if (t < 1) requestAnimationFrame(tick);
      };
      tick();
    }, [run, start, end, duration]);
    return val;
  };

  React.useEffect(() => {
    const el = proofRef.current;
    if (!el || typeof window === "undefined") return;
    if (!("IntersectionObserver" in window)) {
      setProofVisible(true);
      return;
    }
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e && e.isIntersecting) {
          setProofVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Animated numbers bound to visibility
  const vReturn = useAnimatedNumber(25, 15, proofVisible, 1400);
  const vDays = useAnimatedNumber(7, 2, proofVisible, 1200);
  const vAccuracy = useAnimatedNumber(0, 85, proofVisible, 1500);

  // Hero animated counters (run on mount)
  const hReturn = useAnimatedNumber(0, -40, true, 1200);
  const hAccuracy = useAnimatedNumber(0, 85, true, 1300);
  const hRepeat = useAnimatedNumber(0, 2, true, 1100);

  // Hero trust line typing (warm & trustworthy)
  const TRUST_LINE = "You'll see exactly where returns bleed cash — and how fast we can fix it.";
  const [typedTrust, setTypedTrust] = React.useState("");
  React.useEffect(() => {
    let i = 0;
    const speed = 22; // gentle pace
    const timer = setInterval(() => {
      i += 1;
      setTypedTrust(TRUST_LINE.slice(0, i));
      if (i >= TRUST_LINE.length) clearInterval(timer);
    }, speed);
    return () => clearInterval(timer);
  }, []);

  const sendWA = async () => {
    try {
      // Create named pillar scores object
      const namedPillarScores = {
        blocks: pillarScores[0],
        grading: pillarScores[1],
        tolerance: pillarScores[2],
        fabric: pillarScores[3],
        validation: pillarScores[4],
      };

      // Find weakest and strongest pillars
      const pillarNames = ["blocks", "grading", "tolerance", "fabric", "validation"];
      const weakestIndex = pillarScores.findIndex((score) => score === Math.min(...pillarScores));
      const strongestIndex = pillarScores.findIndex((score) => score === Math.max(...pillarScores));

      const weakestPillar = {
        name: pillarNames[weakestIndex],
        score: pillarScores[weakestIndex],
      };

      const strongestPillar = {
        name: pillarNames[strongestIndex],
        score: pillarScores[strongestIndex],
      };

      // Combine questions and answers
      const questionsAndAnswers = allQs.map((item, index) => ({
        question: item.q,
        answer: answers[index] || "",
        pillar: item.pillar,
      }));

      const result = await submitFitAudit({
        totalScore,
        percent,
        pillarScores: namedPillarScores,
        weakestPillar,
        strongestPillar,
        questionsAndAnswers,
        lead: {
          name: lead.name,
          email: lead.email,
          whatsapp: "+91" + lead.whatsapp,
        },
      });

      if (result.success) {
        // success toast
        setShowToastHint(true);
        return { success: true };
      } else {
        throw new Error(result.error || "Submission failed");
      }
    } catch (e) {
      console.warn("form submission fail", e);
      setWaError("Couldn't submit form. Please try again.");
    }
  };

  // ===== New: Progressive 25-question wizard state =====
  const pillars = [
    {
      name: "Blocks",
      qs: [
        "Do you have approved Fit Blocks for your top categories?",
        "Are blocks built for your target body type(s) (e.g., Indian sizing data)?",
        "Do all new styles map to a specific block at tech-pack stage?",
        "Are blocks version-controlled with change logs?",
        "Are blocks validated on-body at least once per season?",
      ],
    },
    {
      name: "Grading",
      qs: [
        "Do you use documented grade rules for each category?",
        "Are vertical and horizontal grades proportional to anatomy?",
        "Do you test grading on edge sizes (e.g., XS/XXL) before bulk?",
        "Are fabric stretch/shrink factors reflected in the grade rules?",
        "Are grade rules reviewed every 6–12 months using returns data?",
      ],
    },
    {
      name: "Tolerance",
      qs: [
        "Do you have a written tolerance table for all POMs by category?",
        "Are critical POMs tagged with tighter tolerances?",
        "Do vendors receive measurement SOPs with photos/diagrams for POMs?",
        "Do you audit production for POM drift every batch?",
        "Are out-of-tolerance actions defined (rework/hold/discount/kill)?",
      ],
    },
    {
      name: "Fabric",
      qs: [
        "Is there a shrinkage/relaxation test per fabric before sampling?",
        "Do you record stretch/recovery and adjust patterns accordingly?",
        "Are lining/fusing/interlining choices standardized per category?",
        "Do you run colorway fit checks for fabric changes across colors?",
        "Is there a fabric substitution protocol with required pattern updates?",
      ],
    },
    {
      name: "Validation",
      qs: [
        "Do you conduct on-body fit tests before scale?",
        "Do you track return reasons with a fit taxonomy (shoulder/chest/etc.)?",
        "Is there a 30/60/90-day post-launch review to adjust block/grade/tolerances?",
        "Is there a 'no sample to bulk' rule without signed fit approval?",
        "Does customer support tag tickets to SKUs + fit reasons to feed engineering?",
      ],
    },
  ];
  const allQs = pillars.flatMap((p) => p.qs.map((q) => ({ pillar: p.name, q })));
  const [answers, setAnswers] = React.useState(Array(allQs.length).fill("")); // "Yes"|"Partial"|"No"
  const [step, setStep] = React.useState(0); // 0..4 (5 questions per step)
  const groupSize = 5;
  const qTopRef = React.useRef(null);
  // Prevent initial auto-scroll to the questions on first load
  const stepFirstRunRef = React.useRef(true);
  const [lead, setLead] = React.useState({ name: "", email: "", whatsapp: "" });
  // Live phone helpers
  const cleanedPhone = (lead.whatsapp || "").replace(/\D/g, "");
  const normalizedPreview = cleanedPhone.startsWith("+91")
    ? cleanedPhone
    : cleanedPhone.length === 10
    ? "+91" + cleanedPhone
    : cleanedPhone;
  const isPhoneValid = /^\+91\d{10}$/.test(normalizedPreview);
  const [showScore, setShowScore] = React.useState(false);
  const scoreRef = React.useRef(null);
  const [scoreFlash, setScoreFlash] = React.useState(false);
  const roadmapRef = React.useRef(null);
  // Coordinated analysis phase before showing the roadmap — start only when user opens the roadmap (not just when score is shown)
  const [analysisPhase, setAnalysisPhase] = React.useState(false);
  const analysisStartedRef = React.useRef(false);
  const triggerAnalysis = React.useCallback((ms = 2500) => {
    if (analysisStartedRef.current) return; // run once per session
    analysisStartedRef.current = true;
    setAnalysisPhase(true);
    setTimeout(() => setAnalysisPhase(false), ms);
  }, []);

  // Auto-scroll the question group into view whenever the step changes
  React.useEffect(() => {
    if (typeof window === "undefined") return;
    // Skip on first render so the page stays at the hero
    if (stepFirstRunRef.current) {
      stepFirstRunRef.current = false;
      return;
    }
  }, [step]);
  const scrollToRoadmap = () => {
    roadmapRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    // Start analysis when user explicitly opens the roadmap (only if not already started)
    if (!analysisStartedRef.current) {
      triggerAnalysis(getAnalysisMs());
    }
  };

  // Observe roadmap visibility for subtle reveal animations and kick off analysis if the user scrolls there directly
  React.useEffect(() => {
    const el = roadmapRef.current;
    if (!el || typeof window === "undefined") return;
    if (!("IntersectionObserver" in window)) {
      return;
    }
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e && e.isIntersecting) {
          // Smart Mode: do not auto-start on scroll; analysis starts only via button click
          obs.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [showScore]);
  const [showToastHint, setShowToastHint] = React.useState(false);
  const [waError, setWaError] = React.useState("");
  const toastTimer = React.useRef(null);
  // Auto-dismiss toast after 7s; pause on hover, resume for 3s
  React.useEffect(() => {
    if (!showToastHint) return;
    const start = (ms = 7000) => {
      toastTimer.current && clearTimeout(toastTimer.current);
      toastTimer.current = setTimeout(() => setShowToastHint(false), ms);
    };
    start(7000);
    return () => {
      toastTimer.current && clearTimeout(toastTimer.current);
    };
  }, [showToastHint]);
  const ctaRef = React.useRef(null);
  const revealScore = () => {
    analysisStartedRef.current = false; // allow re-run of analysis on new score reveal

    // Check if all 25 questions are answered
    const allQuestionsAnswered = answers.every((answer) => answer !== "");
    if (!allQuestionsAnswered) {
      setWaError("Please answer all 25 questions before seeing your score.");
      return;
    }

    if (!lead.name.trim()) {
      setWaError("Please enter your name.");
      return;
    }
    if (!lead.email) {
      setWaError("Please enter your work email.");
      return;
    }
    if (!isPhoneValid) {
      setWaError("Enter a valid WhatsApp number (91XXXXXXXXXX).");
      return;
    }
    setWaError("");
    setShowScore(true);
    // --- Send form data
    sendWA();
    // --- Start analysis immediately when score is revealed
    triggerAnalysis(getAnalysisMs());
    requestAnimationFrame(() => {
      scoreRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      setScoreFlash(true);
      setTimeout(() => setScoreFlash(false), 900);
      try {
        const alreadyShown = sessionStorage.getItem("fit_toast_shown");
        if (!alreadyShown) {
          sessionStorage.setItem("fit_toast_shown", "1");
          setTimeout(() => setShowToastHint(true), 5000);
        }
      } catch {
        // Ignore sessionStorage errors in some browsers
      }
    });
  };

  const scoreOf = (val) => (val === "Yes" ? 1 : val === "Partial" ? 0.5 : 0);
  const totalScore = answers.reduce((s, a) => s + scoreOf(a), 0);
  const pillarScores = pillars.map((p, pi) => {
    const start = pi * 5;
    const slice = answers.slice(start, start + 5);
    return slice.reduce((s, a) => s + scoreOf(a), 0);
  });
  const percent = Math.round((totalScore / 25) * 100);
  // Dynamic analysis duration by score band
  const getAnalysisMs = () => (percent < 60 ? 5000 : percent < 80 ? 3500 : 2500);
  const canAdvance = answers.slice(step * groupSize, step * groupSize + groupSize).every((a) => a);
  const updateAnswer = (idx, val) =>
    setAnswers((prev) => {
      const n = [...prev];
      n[idx] = val;
      return n;
    });

  // --- Meta + Social Preview (no external libs) ---
  React.useEffect(() => {
    document.title = "Fit Audit System – Design Wolf Studio × TUKAcenter India";
    const upsert = (selector, tag, attrs) => {
      let el = document.querySelector(selector);
      if (!el) {
        el = document.createElement(tag);
        document.head.appendChild(el);
      }
      Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
    };
    upsert('link[rel="icon"]', "link", {
      rel: "icon",
      href: "data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 64 64%22%3E%3Crect width=%2264%22 height=%2264%22 rx=%2212%22 fill=%22%23000%22/%3E%3Ctext x=%2232%22 y=%2238%22 font-family=%22Inter,Arial%22 font-size=%2230%22 text-anchor=%22middle%22 fill=%22%23fff%22%3EDW%3C/text%3E%3C/svg%3E",
    });
    upsert('meta[name="description"]', "meta", {
      name: "description",
      content: "Engineer predictable fit. Cut returns with the Fit Audit Template.",
    });
    upsert('meta[property="og:title"]', "meta", { property: "og:title", content: "FIT WINS – The Fit Audit System" });
    upsert('meta[property="og:description"]', "meta", {
      property: "og:description",
      content: "Engineer predictable fit. Cut returns. Download the Fit Audit Template.",
    });
    upsert('meta[property="og:image"]', "meta", {
      property: "og:image",
      content: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAAACAQAAAB5k0rNAAAAAElFTkSuQmCC",
    });
    upsert('meta[name="twitter:card"]', "meta", { name: "twitter:card", content: "summary_large_image" });
  }, []);

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Option A: global keyframes for gentle reveals */}
      <style>{`
        /* Base reveal */
        @keyframes fadeSlideUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeSlideUp { animation: fadeSlideUp 600ms ease-out forwards; }

        /* CTA pulse */
        @keyframes ringPulse { 0% { box-shadow: 0 0 0 0 rgba(16,185,129,.35);} 70% { box-shadow: 0 0 0 14px rgba(16,185,129,0);} 100% { box-shadow: 0 0 0 0 rgba(16,185,129,0);} }
        .cta-pulse { animation: ringPulse 1.6s ease-out infinite; }

        /* Toast slide in (right) */
        @keyframes slideInRight { from { transform: translateX(110%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        .animate-slideInRight { animation: slideInRight 420ms ease-out both; }

        /* Typing caret */
        @keyframes caretBlink { 0%, 40% { opacity: 1; } 40.01%, 100% { opacity: 0; } }
        .caret { display:inline-block; width:1px; height:1.1em; margin-left:2px; background:#111827; animation: caretBlink 1s steps(1,end) infinite; }

        /* Smooth hover transitions */
        button, a { transition: all 0.25s cubic-bezier(0.4,0,0.2,1); }

        /* Reduced motion */
        @media (prefers-reduced-motion: reduce) {
          .animate-fadeSlideUp, .animate-slideInRight { animation-duration: 1ms; animation-iteration-count: 1; }
        }
      `}</style>
      {showToastHint && (
        <div
          className="fixed bottom-24 right-3 sm:right-6 z-50 animate-slideInRight"
          onMouseEnter={() => {
            if (toastTimer.current) clearTimeout(toastTimer.current);
          }}
          onMouseLeave={() => {
            toastTimer.current && clearTimeout(toastTimer.current);
            toastTimer.current = setTimeout(() => setShowToastHint(false), 3000);
          }}
        >
          <div className="mr-3 bg-white shadow-xl border rounded-l-2xl px-4 py-3 flex items-center gap-3">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
            <span className="text-sm text-gray-800">Preparing your roadmap…</span>
            <button
              onClick={() => setShowToastHint(false)}
              className="ml-1 text-gray-400 hover:text-gray-600"
              aria-label="Dismiss"
            >
              ✕
            </button>
          </div>
        </div>
      )}
      {/* NAV */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative h-9 w-9">
              <img
                src="/logo.png"
                alt="Design Wolf Logo"
                className="h-9 w-9 object-contain rounded-lg"
                loading="eager"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                  const f = e.currentTarget.nextElementSibling;
                  if (f) {
                    f.classList.remove("hidden");
                    f.classList.add("grid");
                  }
                }}
              />
              {/* Fallback monogram if image not found */}
              <div className="hidden absolute inset-0 rounded-2xl bg-black text-white place-items-center font-semibold">
                DW
              </div>
            </div>
            <div className="text-sm leading-tight">
              <div className="font-semibold">Design Wolf Studio</div>
              <div className="text-gray-500">+ TUKAcenter India</div>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            <a href="#what" className="hover:text-black text-gray-600">
              Why Returns Happen
            </a>
            <a href="#how" className="hover:text-black text-gray-600">
              Audit Your Fit
            </a>
            <a href="#proof" className="hover:text-black text-gray-600">
              Proven Fit Results
            </a>
            <a href="#cta" className="px-4 py-2 rounded-xl bg-black text-white hover:bg-gray-900">
              Get My Fit Audit – Free
            </a>
          </nav>
        </div>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden">
        {/* subtle background visuals */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-32 -right-24 h-96 w-96 rounded-full bg-amber-200/30 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-emerald-200/30 blur-3xl" />
          <svg
            className="absolute inset-0 h-full w-full opacity-[0.08]"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
            viewBox="0 0 800 600"
          >
            <defs>
              <pattern id="dots" width="20" height="20" patternUnits="userSpaceOnUse">
                <circle cx="1" cy="1" r="1" fill="#000" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dots)" />
          </svg>
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 md:py-6 grid md:grid-cols-2 gap-6 md:gap-8 items-center">
          <div>
            <p
              {...reveal(60)}
              className="inline-flex items-center gap-2 text-xs font-semibold tracking-wide uppercase text-emerald-700 bg-emerald-50 rounded-full px-3 py-1 mb-3"
            >
              Free Fit Audit Tool
            </p>
            <div {...reveal(140)}>
              <h1 className="text-4xl md:text-5xl xl:text-6xl font-extrabold leading-tight tracking-tight">
                Engineer predictable fit. Cut returns. Build trust.
              </h1>
            </div>

            <ul {...reveal(300)} className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
              <li className="rounded-2xl border p-4">
                <div className="text-2xl font-bold">{hReturn.toFixed(0)}%</div>
                <div className="text-gray-600">returns in 60 days (typical)</div>
              </li>
              <li className="rounded-2xl border p-4">
                <div className="text-2xl font-bold">{hAccuracy.toFixed(0)}%+</div>
                <div className="text-gray-600">size accuracy target</div>
              </li>
              <li className="rounded-2xl border p-4">
                <div className="text-2xl font-bold">{hRepeat.toFixed(1)}x</div>
                <div className="text-gray-600">repeat rate lift on winners</div>
              </li>
            </ul>

            {/* Inline CTA */}
            <a
              href="#cta"
              {...reveal(380)}
              className="mt-6 inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-black text-white hover:bg-gray-900"
            >
              Get My Fit Audit – Free
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M13.5 4.5a.75.75 0 0 1 .75-.75h6a.75.75 0 0 1 .75.75v6a.75.75 0 0 1-1.5 0V6.31l-8.47 8.47a.75.75 0 1 1-1.06-1.06l8.47-8.47h-4.19a.75.75 0 0 1-.75-.75Z" />
                <path d="M5.25 6a.75.75 0 0 1 .75.75v10.19h10.19a.75.75 0 0 1 0 1.5H6A1.5 1.5 0 0 1 4.5 16.94V6.75A.75.75 0 0 1 5.25 6Z" />
              </svg>
            </a>
            {/* Trust line with typing */}
            <p {...reveal(400)} className="mt-3 text-sm text-gray-800 font-medium italic">
              {typedTrust}
              <span className="caret" aria-hidden="true" />
            </p>

            <p {...reveal(420)} className="mt-3 text-xs text-gray-500">
              No spam. One-click unsubscribe. Built by founders, for founders.
            </p>

            {/* Alina intro (Placement: Hero) */}
            <div {...reveal(480)} className="mt-4 flex items-center gap-3">
              <img
                src="/assets/alina-avatar.png"
                alt="Alina – Fit Expert"
                className="h-9 w-9 rounded-full border object-cover"
                onError={(e) => {
                  e.currentTarget.src =
                    "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='72' height='72'><rect width='100%' height='100%' rx='36' fill='%23e5e7eb'/><text x='50%' y='55%' dominant-baseline='middle' text-anchor='middle' font-size='28' font-family='Inter, Arial' fill='%236b7280'>A</text></svg>";
                }}
              />
              <div className="text-sm bg-white border rounded-2xl px-4 py-2 shadow-sm">
                <div className="font-semibold">Hi, I’m Alina.</div>
                <div className="text-gray-600">I’ll personalize your roadmap as you answer.</div>
              </div>
            </div>
          </div>

          {/* Hero Visual */}
          <div className="relative max-h-[520px] md:max-h-[560px]" {...reveal(240)}>
            <div className="rounded-3xl border p-0 shadow-sm bg-white overflow-hidden">
              <div className="bg-black text-white px-6 py-3 text-sm font-medium flex items-center gap-2">
                <span className="inline-block h-2 w-2 rounded-full bg-emerald-400" /> Fit Map — Block → Grade →
                Tolerance
              </div>
              {/* Hero Video */}
              <div className="p-6">
                <video
                  src="/hero-video.mp4"
                  className="w-full rounded-2xl"
                  autoPlay
                  loop
                  playsInline
                  controls
                  aria-label="Fit system demonstration video"
                />
              </div>

              <div className="grid grid-cols-2 divide-x border-t">
                <div className="p-4 text-xs">
                  <div className="font-semibold">Fit Confidence</div>
                  <div className="mt-1 text-gray-600">25‑point score • highlights weak zones</div>
                </div>
                <div className="p-4 text-xs">
                  <div className="font-semibold">Action Plan</div>
                  <div className="mt-1 text-gray-600">90‑day pipeline • ownership by role</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {
        /* CREDIBILITY SECTION */
        <section id="proof" ref={proofRef} className="bg-white border-t">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
            {/* Top line: social proof + light personalization */}
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <h2 className="text-2xl md:text-3xl font-bold">Proven fit results</h2>
            </div>

            {/* Animated metrics */}
            <div className="grid md:grid-cols-3 gap-6 mt-8">
              <div className="rounded-2xl border p-6 bg-white shadow-sm">
                <div className="text-4xl font-extrabold text-gray-900">
                  25% → <span className="text-emerald-600">{vReturn.toFixed(0)}%</span>
                </div>
                <p className="mt-2 text-sm text-gray-600">
                  Return rate drop after 8 weeks on a 30–60 SKU menswear line (India).
                </p>
              </div>
              <div className="rounded-2xl border p-6 bg-white shadow-sm">
                <div className="text-4xl font-extrabold text-gray-900">
                  7d → <span className="text-emerald-600">{vDays.toFixed(0)}d</span>
                </div>
                <p className="mt-2 text-sm text-gray-600">
                  Exchange cycle time after introducing fit‑swap + block guidance.
                </p>
              </div>
              <div className="rounded-2xl border p-6 bg-white shadow-sm">
                <div className="text-4xl font-extrabold text-gray-900">
                  0% → <span className="text-emerald-600">{vAccuracy.toFixed(0)}%</span>
                </div>
                <p className="mt-2 text-sm text-gray-600">Size accuracy on block‑aligned products across sizes.</p>
              </div>
            </div>

            {/* Brand logos */}
            <div className="mt-10">
              <div className="text-center text-sm font-medium text-gray-700 mb-2">
                Used by <span className="font-semibold text-gray-900">80+ fashion teams</span>
              </div>
              <div className="text-center text-xs text-gray-600 mb-4">From startup to enterprise:</div>
              <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-gray-600 mb-6">
                {["D2C", "Private Label", "Manufacturers", "Export Houses"].map((tag) => (
                  <span key={tag} className="inline-flex items-center gap-1 rounded-full border px-3 py-1 bg-white">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="text-center text-sm text-gray-500 mb-3">Across product categories:</div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                {[
                  "Menswear",
                  "Womenswear",
                  "Athleisure",
                  "Streetwear",
                  "Ethnic/Fusion",
                  "Denim",
                  "Kidswear",
                  "Uniforms",
                ].map((cat) => (
                  <div key={cat} className="rounded-xl border px-4 py-3 bg-white text-center text-sm text-gray-800">
                    {cat}
                  </div>
                ))}
              </div>
              <div className="text-center text-sm text-gray-500 mb-3">Results delivered across:</div>
              <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-gray-600">
                {["Fit Systems", "Return Reduction", "Size Consistency", "Pattern Control"].map((tag) => (
                  <span key={tag} className="inline-flex items-center gap-1 rounded-full border px-3 py-1 bg-white">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        /* WHAT'S INSIDE — replaced with progressive wizard */
      }
      <section id="what" className="border-t bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            {/* LEFT: 25-question wizard, 5-at-a-time */}
            <div>
              <div ref={qTopRef} />
              <h2 className="text-2xl md:text-3xl font-bold">Quick Fit Audit — 5 questions at a time</h2>
              <p className="mt-2 text-gray-600 text-sm">
                Answer honestly. <span className="font-medium">Yes</span> = 1,{" "}
                <span className="font-medium">Partial</span> = 0.5, <span className="font-medium">No</span> = 0.
              </p>
              <div className="mt-6 flex items-center justify-between text-sm">
                <div className="font-medium">Block {step + 1} / 5</div>
                <div className="text-gray-500">
                  {step * groupSize + 1}–{Math.min((step + 1) * groupSize, allQs.length)} of {allQs.length}
                </div>
              </div>
              <div className="mt-3 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500"
                  style={{ width: `${(answers.filter(Boolean).length / 25) * 100}%` }}
                />
              </div>

              <div className="mt-6 space-y-3">
                {allQs.slice(step * groupSize, step * groupSize + groupSize).map((item, idx) => {
                  const globalIdx = step * groupSize + idx;
                  return (
                    <div key={globalIdx} className="rounded-2xl border bg-white p-4">
                      <div className="text-[11px] uppercase tracking-wide text-gray-500 mb-1">{item.pillar}</div>
                      <div className="text-sm font-medium text-gray-900">{item.q}</div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {["Yes", "Partial", "No"].map((opt) => (
                          <button
                            type="button"
                            key={opt}
                            onClick={() => updateAnswer(globalIdx, opt)}
                            className={`px-3 py-1.5 rounded-xl border text-sm ${
                              answers[globalIdx] === opt
                                ? "bg-black text-white border-black"
                                : "bg-white text-gray-700 hover:bg-gray-50"
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 flex items-center justify-between">
                <button
                  onClick={() => setStep((s) => Math.max(0, s - 1))}
                  disabled={step === 0}
                  className="px-4 py-2 rounded-xl border disabled:opacity-50"
                >
                  Back
                </button>
                {step < 4 ? (
                  <button
                    onClick={() => canAdvance && setStep((s) => s + 1)}
                    disabled={!canAdvance}
                    className="px-4 py-2 rounded-xl bg-black text-white disabled:opacity-50"
                  >
                    Next 5
                  </button>
                ) : (
                  <div className="w-full md:w-auto grid md:grid-cols-2 gap-3">
                    {!showScore && (
                      <>
                        <input
                          type="text"
                          required
                          placeholder="Your name"
                          value={lead.name}
                          onChange={(e) => setLead({ ...lead, name: e.target.value })}
                          className="rounded-xl border px-4 py-2"
                        />
                        <input
                          type="email"
                          required
                          placeholder="Work email"
                          value={lead.email}
                          onChange={(e) => setLead({ ...lead, email: e.target.value })}
                          className="rounded-xl border px-4 py-2"
                        />
                        <input
                          type="tel"
                          required
                          placeholder="WhatsApp number (+91XXXXXXXXXX)"
                          title="Enter WhatsApp number in international format, e.g. 919876543210"
                          value={lead.whatsapp}
                          onChange={(e) => setLead({ ...lead, whatsapp: e.target.value })}
                          onBlur={(e) => setLead({ ...lead, whatsapp: e.target.value.replace(/\D/g, "") })}
                          aria-invalid={lead.whatsapp ? !isPhoneValid : false}
                          className={`rounded-xl border px-4 py-2 ${
                            lead.whatsapp ? (isPhoneValid ? "border-emerald-500" : "border-red-500") : ""
                          }`}
                        />
                        <div className="md:col-span-2 text-xs text-gray-500 -mt-2">
                          {lead.whatsapp
                            ? isPhoneValid
                              ? `• Ready to send: ${normalizedPreview}`
                              : "• Enter 10‑digit number or 91XXXXXXXXXX"
                            : "• Example: +91XXXXXXXXXX"}
                        </div>
                      </>
                    )}
                    {!showScore && (
                      <button
                        onClick={revealScore}
                        className="md:col-span-2 px-4 py-2 rounded-xl bg-emerald-600 text-white"
                      >
                        See my score
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT: Live score preview / radar */}
            <div
              ref={scoreRef}
              className={`rounded-3xl border bg-white p-0 overflow-hidden transition-transform duration-500 ${
                scoreFlash ? "scale-[1.02] ring-2 ring-emerald-400/60" : ""
              }`}
            >
              <div className="bg-gray-900 text-white px-4 py-2 text-xs font-medium">Your Live Fit Score</div>
              <div className="p-6 grid gap-6">
                <div className="rounded-2xl border p-5 bg-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-semibold text-gray-900">Fit Score</div>
                      <div
                        className={`text-4xl font-extrabold transition-all duration-700 ease-out ${
                          showScore ? "text-emerald-600" : "text-gray-400"
                        }`}
                      >
                        {showScore ? Math.round(totalScore * 100) / 100 : "—"} / 25
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">
                      {showScore ? "Your live score" : "Complete questions to see score"}
                    </div>
                  </div>
                  {/* Simple radar substitute: 5 bars (mobile-safe). If you prefer polygon SVG, we can wire it next. */}
                  <div className="mt-4 grid grid-cols-5 gap-3">
                    {pillars.map((p, i) => (
                      <div key={p.name} className="text-center">
                        <div className="h-28 bg-gray-100 rounded-xl flex items-end overflow-hidden">
                          <div
                            className="w-full bg-linear-to-t from-emerald-400 to-amber-300 transition-all"
                            style={{ height: `${showScore ? (pillarScores[i] / 5) * 100 : 8}%` }}
                          />
                        </div>
                        <div className="mt-1 text-[11px] text-gray-600">
                          {p.name}
                          <br />
                          <span className="font-semibold text-gray-900">
                            {showScore ? pillarScores[i].toFixed(1) : "—"}/5
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                  {showScore && (
                    <>
                      <button
                        onClick={scrollToRoadmap}
                        className="mt-5 w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700"
                      >
                        See my 3‑step roadmap
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="w-5 h-5"
                        >
                          <path d="M13.5 4.5a.75.75 0 0 1 .75-.75h6a.75.75 0 0 1 .75.75v6a.75.75 0 0 1-1.5 0V6.31l-8.47 8.47a.75.75 0 1 1-1.06-1.06l8.47-8.47h-4.19a.75.75 0 0 1-.75-.75Z" />
                          <path d="M5.25 6a.75.75 0 0 1 .75.75v10.19h10.19a.75.75 0 0 1 0 1.5H6A1.5 1.5 0 0 1 4.5 16.94V6.75A.75.75 0  1 1 5.25 6Z" />
                        </svg>
                      </button>
                      <div className="mt-2 flex items-center justify-center text-xs text-gray-500">
                        <span className="animate-bounce">↓ See your 3‑step roadmap below</span>
                      </div>
                    </>
                  )}
                </div>
                {!showScore && (
                  <p className="text-xs text-gray-500">
                    Answer 25 questions. Enter email + WhatsApp to reveal your score and get the template.
                  </p>
                )}
                {waError && (
                  <div className="mt-2 text-xs text-red-600">
                    {waError}{" "}
                    <button
                      className="underline"
                      onClick={() => {
                        setWaError("");
                        revealScore();
                      }}
                    >
                      Retry
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS — upgraded to live carousel */}
      <section id="how" ref={roadmapRef}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-2xl md:text-3xl font-bold animate-fadeSlideUp">Your Fit Roadmap</h2>

          {/* Local styles for carousel + shimmer */}
          <style>{`
      @keyframes shimmer { 0% { transform: translateX(-100%);} 100% { transform: translateX(100%);} }
      .shimmer:before { content:''; position:absolute; inset:0; background:linear-gradient(90deg,transparent,rgba(255,255,255,.65),transparent); animation: shimmer 1.6s infinite; }
    `}</style>

          {showScore ? (
            (() => {
              const labels = ["Blocks", "Grading", "Tolerance", "Fabric", "Validation"];
              const weakest = (() => {
                const min = Math.min(...pillarScores);
                const idx = pillarScores.findIndex((s) => s === min);
                return { name: labels[idx], score: min };
              })();
              const band = percent < 60 ? "triage" : percent < 80 ? "optimize" : "scale";
              const steps = {
                triage: [
                  {
                    step: "01",
                    title: `Stabilize ${weakest.name}`,
                    desc: `This is your lowest pillar (${weakest.score.toFixed(
                      1
                    )}/5). Lock a 2‑week sprint on SOPs, tolerances and sign‑offs for ${weakest.name.toLowerCase()}.`,
                    cta: false,
                  },
                  {
                    step: "02",
                    title: "Prove the fix on 5 SKUs",
                    desc: "Run fast loops: adjust patterns → on‑body check → sample → POM audit. Watch return reasons for movement within 30 days.",
                    cta: false,
                  },
                  {
                    step: "03",
                    title: "Book your 20‑min Fit Review",
                    desc: "We’ll review your sheet and returns to set a 30/60/90 plan. Bring one problem style.",
                    cta: true,
                  },
                ],
                optimize: [
                  {
                    step: "01",
                    title: `Tighten ${weakest.name} discipline`,
                    desc: `You’re close. Formalize owner + cadence. Move ${weakest.name.toLowerCase()} from ad‑hoc to checklist with tolerances.`,
                    cta: false,
                  },
                  {
                    step: "02",
                    title: "Edge‑size validation",
                    desc: "Validate XS/XXL grade behavior and fabric recovery. Adjust rules where strain shows.",
                    cta: false,
                  },
                  {
                    step: "03",
                    title: "Book your 20‑min Fit Review",
                    desc: "We’ll pressure‑test your weakest pillar and set 3 priority actions for the next 30 days.",
                    cta: true,
                  },
                ],
                scale: [
                  {
                    step: "01",
                    title: "Systemize wins",
                    desc: "Turn your current practice into a playbook: version control, vendor training, QC gates.",
                    cta: false,
                  },
                  {
                    step: "02",
                    title: "Extend to new categories",
                    desc: "Port your blocks and rules to adjacent categories. Keep a validation loop by color/fabric.",
                    cta: false,
                  },
                  {
                    step: "03",
                    title: "Book your 20‑min Fit Review",
                    desc: "We’ll sanity‑check assumptions before you scale the system to 100+ SKUs.",
                    cta: true,
                  },
                ],
              }[band];

              function RoadmapSteps({ steps, analyzing }) {
                const [idx, setIdx] = React.useState(0);
                const cur = steps[idx];
                const autoDelay = 3000; // 3s per your setting

                // Auto‑advance when analyzing is finished
                React.useEffect(() => {
                  if (analyzing) return; // wait until analysis ends
                  const t = setTimeout(() => setIdx((i) => (i + 1) % steps.length), autoDelay);
                  return () => clearTimeout(t);
                }, [idx, analyzing, steps.length]);

                const Dots = () => (
                  <div className="mt-6 flex items-center justify-center gap-2">
                    {steps.map((_, i) => (
                      <span
                        key={i}
                        className={`h-2 w-2 rounded-full ${i === idx ? "bg-emerald-600" : "bg-gray-300"}`}
                      />
                    ))}
                  </div>
                );

                if (analyzing) {
                  return (
                    <div className="mt-8">
                      <div className="mb-4 flex items-center gap-2 text-xs text-emerald-700 font-medium">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600" />
                        </span>
                        Alina is analyzing your responses…
                      </div>
                      <div className="relative rounded-3xl border bg-white p-6 overflow-hidden">
                        <div className="absolute inset-0 shimmer opacity-40" />
                        <div className="flex items-center gap-3 text-sm font-semibold">
                          <span className="h-8 w-8 rounded-full bg-black text-white grid place-items-center">01</span>
                          Generating your personalized plan…
                        </div>
                        <div className="mt-4 h-4 bg-gray-100 rounded" />
                        <div className="mt-2 h-4 bg-gray-100 rounded w-3/4" />
                      </div>
                    </div>
                  );
                }

                return (
                  <div className="mt-8">
                    <div className="rounded-3xl border bg-white p-6">
                      <div className="flex items-start gap-4">
                        <div className="h-10 w-10 rounded-full bg-black text-white grid place-items-center font-semibold">
                          {cur.step}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-900">{cur.title}</h3>
                          <p className="mt-2 text-gray-700 text-sm leading-relaxed">{cur.desc}</p>
                          {cur.cta && (
                            <a
                              href="#cta"
                              className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700"
                            >
                              Book the 20‑min Fit Review
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                className="w-5 h-5"
                              >
                                <path d="M13.5 4.5a.75.75 0 0 1 .75-.75h6a.75.75 0 0 1 .75.75v6a.75.75 0 0 1-1.5 0V6.31l-8.47 8.47a.75.75 0 1 1-1.06-1.06l8.47-8.47h-4.19a.75.75 0 0 1-.75-.75Z" />
                                <path d="M5.25 6a.75.75 0 0 1 .75.75v10.19h10.19a.75.75 0  1 1 0 1.5H6A1.5 1.5 0 0 1 4.5 16.94V6.75A.75.75 0  1 1 5.25 6Z" />
                              </svg>
                            </a>
                          )}
                          <div className="mt-6 flex items-center justify-between">
                            <button
                              onClick={() => setIdx((i) => (i - 1 + steps.length) % steps.length)}
                              className="px-4 py-2 rounded-xl border"
                            >
                              Prev
                            </button>
                            <button
                              onClick={() => setIdx((i) => (i + 1) % steps.length)}
                              className="px-4 py-2 rounded-xl bg-black text-white"
                            >
                              Next
                            </button>
                          </div>
                        </div>
                      </div>
                      <Dots />
                    </div>
                  </div>
                );
              }

              return (
                <div className="mt-6">
                  {/* Gate: show analysis first when user clicks "See my 3‑step roadmap" */}
                  <RoadmapSteps steps={steps} analyzing={analysisPhase} />
                </div>
              );
            })()
          ) : (
            <div className="mt-6 text-sm text-gray-600">Reveal your score first to generate the roadmap.</div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section id="cta" ref={ctaRef} className="border-t bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <div className="rounded-3xl border p-6 bg-white grid md:grid-cols-2 gap-6 items-center">
            <div>
              <h3 className="text-2xl font-bold">Book your free 20‑min Fit Review</h3>
              <p className="mt-2 text-gray-600 text-sm">
                Bring one problem style. We’ll map 30/60/90 actions and share the Fit Audit template.
              </p>
            </div>
            <div className="md:text-right">
              <a
                href="https://hi.switchy.io/HighTea"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-emerald-600 text-white hover:bg-emerald-700"
              >
                Book a slot
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path d="M13.5 4.5a.75.75 0 0 1 .75-.75h6a.75.75 0 0 1 .75.75v6a.75.75 0 0 1-1.5 0V6.31l-8.47 8.47a.75.75 0 1 1-1.06-1.06l8.47-8.47h-4.19a.75.75 0 0 1-.75-.75Z" />
                  <path d="M5.25 6a.75.75 0 0 1 .75.75v10.19h10.19a.75.75 0  1 1 0 1.5H6A1.5 1.5 0 0 1 4.5 16.94V6.75A.75.75 0  1 1 5.25 6Z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t text-xs text-gray-500">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          ©️ {new Date().getFullYear()} Design Wolf Studio • TUKAcenter India
        </div>
      </footer>
    </div>
  );
}
