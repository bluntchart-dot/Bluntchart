"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import LocationPicker from "@/components/LocationPicker";
import type { SelectedLocation } from "@/components/LocationPicker";

/* ─── TYPES ─────────────────────────────────────────────────────────── */

interface FormData {
  name: string;
  email: string;
  dob: string;
  birth_time: string;
  birth_place: string;
  birth_lat?: number;
  birth_lng?: number;
  timezone?: string;
}

type FormStage = "landing" | "form" | "submitting";

/* ─── STAR BACKGROUND ───────────────────────────────────────────────── */

function StarBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let stars: { x: number; y: number; r: number; a: number; speed: number }[] = [];
    let shootingStars: {
      x: number; y: number; len: number; speed: number;
      angle: number; alpha: number; life: number; maxLife: number;
    }[] = [];

    function resize() {
      canvas!.width = window.innerWidth;
      canvas!.height = window.innerHeight * 3;
      initStars();
    }

    function initStars() {
      const count = Math.floor((canvas!.width * canvas!.height) / 8000);
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * canvas!.width,
        y: Math.random() * canvas!.height,
        r: Math.random() * 1.2 + 0.3,
        a: Math.random(),
        speed: Math.random() * 0.003 + 0.001,
      }));
    }

    function spawnShootingStar() {
      if (shootingStars.length >= 3) return;
      const maxLife = 60 + Math.random() * 40;
      shootingStars.push({
        x: Math.random() * canvas!.width * 0.8,
        y: Math.random() * canvas!.height * 0.4,
        len: 60 + Math.random() * 80,
        speed: 4 + Math.random() * 4,
        angle: Math.PI / 4 + (Math.random() - 0.5) * 0.3,
        alpha: 0,
        life: 0,
        maxLife,
      });
    }

    let frame = 0;
    function draw() {
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height);

      for (const s of stars) {
        s.a += s.speed;
        const alpha = 0.3 + Math.abs(Math.sin(s.a)) * 0.7;
        ctx!.beginPath();
        ctx!.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(240, 233, 220, ${alpha * 0.6})`;
        ctx!.fill();
      }

      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const ss = shootingStars[i];
        ss.life++;
        ss.x += Math.cos(ss.angle) * ss.speed;
        ss.y += Math.sin(ss.angle) * ss.speed;

        const progress = ss.life / ss.maxLife;
        ss.alpha = progress < 0.1 ? progress * 10 : progress > 0.7 ? (1 - progress) / 0.3 : 1;

        const grad = ctx!.createLinearGradient(
          ss.x, ss.y,
          ss.x - Math.cos(ss.angle) * ss.len,
          ss.y - Math.sin(ss.angle) * ss.len
        );
        grad.addColorStop(0, `rgba(191, 151, 90, ${ss.alpha * 0.9})`);
        grad.addColorStop(1, `rgba(191, 151, 90, 0)`);

        ctx!.beginPath();
        ctx!.moveTo(ss.x, ss.y);
        ctx!.lineTo(
          ss.x - Math.cos(ss.angle) * ss.len,
          ss.y - Math.sin(ss.angle) * ss.len
        );
        ctx!.strokeStyle = grad;
        ctx!.lineWidth = 1.5;
        ctx!.stroke();

        if (ss.life >= ss.maxLife) shootingStars.splice(i, 1);
      }

      frame++;
      if (frame % 90 === 0 && Math.random() < 0.7) spawnShootingStar();

      animationId = requestAnimationFrame(draw);
    }

    resize();
    window.addEventListener("resize", resize);
    draw();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 0,
      }}
    />
  );
}

/* ─── FAQ ITEM ──────────────────────────────────────────────────────── */

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="bcb-faq-item">
      <button className="bcb-faq-q" onClick={() => setOpen((o) => !o)}>
        {q}
        <span className={`bcb-faq-plus ${open ? "open" : ""}`}>+</span>
      </button>
      <div className={`bcb-faq-a ${open ? "open" : ""}`}>{a}</div>
    </div>
  );
}

/* ─── FAQS ──────────────────────────────────────────────────────────── */

const FAQS = [
  {
    q: "I've seen in-depth birth chart readings on Etsy for $8-$15. Why is this more?",
    a: "Three real differences. First, depth: most Etsy readings are 10-20 pages of bullet points covering Sun, Moon, Rising. This is 49 pages across 14 chapters, including your money story, what you're actually afraid of, your pattern cycles, and a current-season transit reading. Second, format: this isn't a flat PDF. It's a swipeable book experience, designed, paginated, readable. Third, sourcing: every paragraph cites the actual planet and house behind it.",
  },
  {
    q: "Is this actually specific to me, or is it a template with my name in it?",
    a: "Your chart only. The reading is built from the exact position of every planet at the moment and place you were born. Two people born on the same day in different cities get different readings. We show placement footnotes throughout so you can see exactly which planet and house produced each paragraph.",
  },
  {
    q: "Is it written by AI or a human astrologer?",
    a: "Both contributed. The interpretive framework was built by human astrologers. The narrative for your specific chart is generated by AI using that framework. We say this clearly because most sellers don't. The practical outcome: you get the depth of a $100+ human reading in minutes.",
  },
  {
    q: "What information do you need from me?",
    a: "Date of birth, exact time of birth (as close to the minute as you can get), and place of birth. If you don't know your birth time, you can still get a reading, but we'll note which chapters are more approximate.",
  },
  {
    q: "How is it delivered? How long does it take?",
    a: "After payment, your reading generates and lands in your email in 5-10 minutes. You get a link to the swipeable book and a downloadable PDF. It's yours permanently, no account required.",
  },
  {
    q: "What if it doesn't feel like me?",
    a: "Email us. If your reading feels genuinely inaccurate, not just unexpected, we'll refund it. We're building from real chart placements, so we're confident in the specificity.",
  },
];

/* ─── REVIEWS ───────────────────────────────────────────────────────── */

const REVIEWS = [
  {
    text: "I've paid astrologers $120 for readings that felt less personal than this. The chapter on what I'm afraid of, I actually had to put my phone down. It named something I've never said out loud.",
    name: "Priya M.",
    meta: "Sun Scorpio, Moon Cancer, Rising Virgo",
    featured: true,
  },
  {
    text: "The transit section told me exactly what's been happening in my life for the past 4 months. I sent it to my therapist.",
    name: "James T.",
    meta: "Sun Capricorn, Moon Pisces, Rising Aries",
  },
  {
    text: "I expected the usual Scorpio stuff. Instead it explained why I self-sabotage every time I get close to being seen.",
    name: "Lisa R.",
    meta: "Sun Scorpio, Moon Libra, Rising Sagittarius",
  },
  {
    text: "I was able to connect with every chapter... It was precise yet interesting. Good experience while reading it.",
    name: "Meera S.",
    meta: "Sun Taurus, Moon Capricorn, Rising Leo",
  },
  {
    text: "It was really fun reading the book... very entertaining. Worth it!",
    name: "Tom K.",
    meta: "Sun Aquarius, Moon Gemini, Rising Libra",
  },
];

/* ─── CHAPTERS ──────────────────────────────────────────────────────── */

const CHAPTERS_LEFT = [
  { num: "01", name: "Before We Begin", sub: "Sun, Moon, Rising" },
  { num: "02", name: "The Real You", sub: "Sun, Moon, Rising" },
  { num: "03", name: "How You Fight", sub: "Mars, Sun" },
  { num: "04", name: "How You Love", sub: "Venus, Moon, 7th House" },
  { num: "05", name: "What You're Actually Afraid Of", sub: "Saturn, 12th House, Pluto" },
  { num: "06", name: "The Pattern You Keep Repeating", sub: "Moon nodes, Saturn" },
  { num: "07", name: "How Your Mind Works", sub: "Mercury, 3rd House" },
  { num: "08", name: "Your Money Story", sub: "2nd House, Jupiter" },
];

const CHAPTERS_RIGHT = [
  { num: "09", name: "Where You're Actually Going", sub: "North Node, 10th House" },
  { num: "10", name: "What Makes You Feel Safe", sub: "Moon, 4th House, IC" },
  { num: "11", name: "The Version of You Nobody Sees", sub: "Rising, 1st House, Neptune" },
  { num: "12", name: "What the Sky Is Doing to You Right Now", sub: "Current transits" },
  { num: "13", name: "The One Theme Worth Paying Attention To", sub: "Major progressed aspects" },
  { num: "14", name: "How to Use This Reading", sub: "Synthesis, return checklist" },
];

/* ─── GUMROAD CHECKOUT ──────────────────────────────────────────────── */

import { buildCheckoutUrl } from "@/lib/products";

/* ─── MAIN COMPONENT ────────────────────────────────────────────────── */

export default function BirthChartBookClient() {
  const [stage, setStage] = useState<FormStage>("landing");
  const [form, setForm] = useState<FormData>({
    name: "",
    email: "",
    dob: "",
    birth_time: "",
    birth_place: "",
  });
  const [error, setError] = useState("");
  const formRef = useRef<HTMLDivElement>(null);

  const scrollToForm = useCallback(() => {
    setStage("form");
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  }, []);

  const handleLocationChange = useCallback(
    (loc: SelectedLocation | null, raw: string) => {
      setForm((f) => ({
        ...f,
        birth_place: loc?.displayName ?? raw,
        birth_lat: loc?.lat,
        birth_lng: loc?.lng,
      }));
    },
    []
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.name.trim() || !form.email.trim() || !form.dob || !form.birth_time || !form.birth_place.trim()) {
      setError("Please fill in all fields.");
      return;
    }

    setStage("submitting");

    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const res = await fetch("/api/save-pending", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim().toLowerCase(),
          dob: form.dob,
          birth_time: form.birth_time,
          city: form.birth_place,
          birth_lat: form.birth_lat,
          birth_lng: form.birth_lng,
          timezone: tz,
          product_type: "birth-chart-book",
        }),
      });

      const data = await res.json();
      if (!data.success) {
        setError(data.error || "Something went wrong. Please try again.");
        setStage("form");
        return;
      }

      const checkoutUrl = buildCheckoutUrl("birth-chart-book", {
        email: form.email.trim().toLowerCase(),
        sessionId: data.sessionId,
      });
      window.location.href = checkoutUrl;
    } catch {
      setError("Connection error. Please try again.");
      setStage("form");
    }
  };

  return (
    <div className="bcb">
      <style>{bcbStyles}</style>
      <StarBackground />

      {/* NAV */}
      <nav className="bcb-nav">
        <Link href="/" className="bcb-nav-logo">BluntChart</Link>
        <div className="bcb-nav-right">
          <span className="bcb-nav-price">Launch price · <s style={{ opacity: 0.4, fontSize: 11 }}>$29</s> $24</span>
          <button className="bcb-nav-btn" onClick={scrollToForm}>Get my reading →</button>
        </div>
      </nav>

      {/* HERO */}
      <section className="bcb-hero">
        <div className="bcb-hero-glow" />
        <div className="bcb-hero-inner">
          <div className="bcb-hero-content">
            <div className="bcb-hero-admit">
              <span className="bcb-admit-dot" />
              In-depth birth chart reading &nbsp;·&nbsp; 49 pages &nbsp;·&nbsp; Ready in 10 minutes
            </div>
            <h1 className="bcb-hero-h1">49 pages of your chart. Read without a filter.</h1>
            <h2 className="bcb-hero-h2">
              You've Googled yourself.<br />
              <span className="bcb-ital">This is what you actually found.</span>
            </h2>
            <p className="bcb-hero-pain">
              A personalized birth chart reading that goes beyond zodiac stereotypes.<br /><br />
              You already know your Sun sign. You've probably read your Moon and Rising too. And somehow you still feel like none of it fully explains <em>you</em>.<br /><br />
              This in-depth birth chart reading is the version that doesn't stop at your sign. It reads every planet, every house, every degree, and writes it like a story.
            </p>
            <div className="bcb-hero-proof">
              <span className="bcb-proof-item"><span className="bcb-proof-icon">✦</span> 49 pages, 14 chapters</span>
              <span className="bcb-proof-item"><span className="bcb-proof-icon">✦</span> Your chart only</span>
              <span className="bcb-proof-item"><span className="bcb-proof-icon" style={{ color: "#4CAF50" }}>⚡</span> Ready in 10 minutes</span>
            </div>
            <div className="bcb-hero-price">
              <s className="bcb-hero-price-old">$29</s> $24 <span className="bcb-price-tag">launch price · one-time</span>
            </div>
            <div className="bcb-hero-ctas">
              <button className="bcb-btn bcb-btn-gold" onClick={scrollToForm}>Get my in-depth reading →</button>
              <a href="#sample" className="bcb-btn bcb-btn-ghost">Read a real sample first</a>
            </div>
            <div className="bcb-hero-nosub">🔒 No recurring charges. No upsells. Yours forever.</div>
          </div>

          {/* BOOK VISUAL */}
          <div className="bcb-hero-visual">
            <div className="bcb-book-mockup">
              <div className="bcb-book-spine" />
              <div className="bcb-book-pages-pill">1 / 49</div>
              <div className="bcb-book-cover">
                <div className="bcb-bcf-brand">BluntChart</div>
                <div className="bcb-bcf-title">Your Story</div>
                <div className="bcb-bcf-sub">Some stories are written by life.<br />This one was written by the sky.</div>
                <div className="bcb-bcf-for">Prepared for</div>
                <div className="bcb-bcf-name">You</div>
                <div className="bcb-bcf-foot">about 20 min · one sitting or in pieces</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST BAR */}
      <div className="bcb-trust-bar">
        <div className="bcb-trust-inner">
          <span className="bcb-trust-item"><span className="bcb-trust-dot">✦</span> 49 pages</span>
          <span className="bcb-trust-item"><span className="bcb-trust-dot" style={{ color: "#4CAF50" }}>⚡</span> Ready in under 10 minutes</span>
          <span className="bcb-trust-item"><span className="bcb-trust-dot">✦</span> Book format, not a template PDF</span>
          <span className="bcb-trust-item"><span className="bcb-trust-dot">✦</span> Refund if it doesn't feel like you</span>
        </div>
      </div>

      {/* WHAT'S INSIDE */}
      <section className="bcb-section">
        <div className="bcb-wrap">
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <span className="bcb-eyebrow">What's inside your birth chart reading</span>
            <h2 className="bcb-section-title">14 Chapters. Every part of you.</h2>
            <p className="bcb-section-sub" style={{ margin: "0 auto", maxWidth: 820 }}>
              This isn't a personality summary you'll forget tomorrow. Each chapter focuses on one part of your birth chart... the parts that quietly influence how you love, why you overthink, what motivates you, where you self-sabotage, and why certain patterns keep repeating.
            </p>
            <p className="bcb-section-sub" style={{ margin: "20px auto 0", maxWidth: 820 }}>
              Together they become one complete birth chart reading... written like someone spent years getting to know you.
            </p>
          </div>

          {/* 3D BOOK TOC */}
          <div className="bcb-toc-grid">
            <div className="bcb-toc-book">
              <div className="bcb-toc-spine" />
              <div className="bcb-toc-inner">
                <span className="bcb-chapter-tag">Part I · Who you are</span>
                {CHAPTERS_LEFT.map((ch) => (
                  <div key={ch.num} className="bcb-chapter-row">
                    <span className="bcb-chapter-num">{ch.num}</span>
                    <div>
                      <div className="bcb-chapter-name">{ch.name}</div>
                      <div className="bcb-chapter-planets">{ch.sub}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bcb-toc-book">
              <div className="bcb-toc-spine" />
              <div className="bcb-toc-inner">
                <span className="bcb-chapter-tag">Part I cont. + Part II · Right now</span>
                {CHAPTERS_RIGHT.map((ch) => (
                  <div key={ch.num} className="bcb-chapter-row">
                    <span className="bcb-chapter-num">{ch.num}</span>
                    <div>
                      <div className="bcb-chapter-name">{ch.name}</div>
                      <div className="bcb-chapter-planets">{ch.sub}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SAMPLE CHAPTER */}
      <section id="sample" className="bcb-section" style={{ background: "#111111" }}>
        <div className="bcb-wrap" style={{ textAlign: "center" }}>
          <div className="bcb-sample-tag">
            <span style={{ fontSize: 9 }}>●</span> Real chapter — from a real reading
          </div>
          <h2 className="bcb-section-title">Read this. If it sounds like you, the rest of the book will too.</h2>
        </div>
        <div className="bcb-wrap">
          <div className="bcb-sample-frame">
            <div className="bcb-sample-chrome">
              <span>Understanding You · Chapter 1 of 11</span>
              <span style={{ color: "rgba(240,233,220,0.2)" }}>5 of 49</span>
            </div>
            <div className="bcb-sample-body">
              <div className="bcb-sample-ey">Chapter 1</div>
              <div className="bcb-sample-h">Before We Begin</div>
              <div className="bcb-sample-sub">I already know something about you.</div>
              <div className="bcb-sample-text">
                <p>You've been trying to understand yourself for a long time now.</p>
                <p>Not in some dramatic, soul-searching way. More like... you just notice things. You notice when something that's supposed to make you happy doesn't. You notice that you keep ending up in the same situations with different people. You notice the gap between how you come across and how you actually feel inside.</p>
                <p>And you've Googled it. You've read your Sun sign, your Moon sign, maybe even your Rising. But it always feels like reading about someone who's almost you... close enough to be interesting, but never close enough to actually help.</p>
                <p>Here's what I think is going on. You're harder on yourself than anyone around you realizes. There's a version of you that lives in your head... the one who has it together, who doesn't second-guess everything, who doesn't care so much about what other people think. And you've been quietly measuring the distance between that person and the one you actually are.</p>
                <p>You give people way too many chances. You replay conversations hours later and only then realize what actually happened. You forgive things you probably shouldn't, and then feel stupid about it later.</p>
                <p>None of that is random. Your chart shows exactly where all of it comes from... and honestly, once you see it laid out, a lot of things are going to make sense for the first time.</p>
              </div>
            </div>
            <div className="bcb-sample-fade" />
            <div style={{ padding: "0 40px 16px" }}>
              <div className="bcb-sample-callout">
                <span style={{ color: "var(--bcb-gold)", fontSize: 16, flexShrink: 0 }}>↳</span>
                <div>
                  <strong style={{ color: "rgba(240,233,220,0.75)", display: "block", marginBottom: 4 }}>What comes next is specific to your chart.</strong>
                  The next 44 pages cover your exact planetary placements, your Rising and how you're perceived, your Moon and what you actually need, your Saturn and where you keep stopping yourself.
                </div>
              </div>
            </div>
            <div className="bcb-sample-footer">
              <span style={{ fontStyle: "italic", color: "rgba(240,233,220,0.45)" }}>Yours is ready in under 10 minutes.</span>
              <button className="bcb-btn bcb-btn-gold" style={{ padding: "12px 24px", fontSize: 14 }} onClick={scrollToForm}>Get the full reading — <s style={{ opacity: 0.5 }}>$29</s> $24 →</button>
            </div>
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section className="bcb-section" style={{ background: "#111111" }}>
        <div className="bcb-wrap">
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <span className="bcb-eyebrow">What people actually said</span>
            <h2 className="bcb-section-title">The moment it clicks is different for everyone.</h2>
          </div>
          <div className="bcb-reviews-grid">
            {REVIEWS.map((r, i) => (
              <div key={i} className={`bcb-review-card ${r.featured ? "bcb-review-featured" : ""}`}>
                <div className="bcb-review-stars">★★★★★</div>
                <div className="bcb-review-text">"{r.text}"</div>
                <div className="bcb-review-byline"><strong>{r.name}</strong> · {r.meta}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT'S MADE */}
      <section className="bcb-section">
        <div className="bcb-wrap" style={{ textAlign: "center" }}>
          <span className="bcb-eyebrow">Transparency</span>
          <h2 className="bcb-section-title">How this reading is built</h2>
          <div className="bcb-honest-img-wrap">
            <Image
              src="/BluntChart-your book PDF preview.png"
              alt="BluntChart birth chart book PDF preview"
              width={900}
              height={520}
              className="bcb-honest-img"
            />
          </div>
          <div className="bcb-honest-card">
            <p className="bcb-honest-p" style={{ marginBottom: 0 }}>Your chart is calculated from the exact positions of every planet at the moment you were born. The interpretive framework was built by human astrologers. The narrative is generated by AI from your specific placements.</p>
            <p className="bcb-honest-p" style={{ marginTop: 14, marginBottom: 0 }}>We say this clearly because you deserve to know.</p>
            <div className="bcb-info-box" style={{ marginTop: 24 }}>
              <div className="bcb-info-label">What this means for you</div>
              <div className="bcb-info-text">A $140 human reading takes a week. This gets you the same depth in minutes, because the chart math is the same, the framework is the same, and the narrative is built from your actual placements.</div>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING + FORM */}
      <section id="pricing" className="bcb-section" ref={formRef}>
        <div className="bcb-wrap-md" style={{ textAlign: "center", marginBottom: 48 }}>
          <span className="bcb-eyebrow">In-Depth Birth Chart Reading</span>
          <h2 className="bcb-section-title">
            {stage === "form" || stage === "submitting"
              ? "Enter your birth details"
              : <>One Birth Chart Reading. <span style={{ color: "var(--bcb-gold)" }}>A book you'll come back to for years.</span></>}
          </h2>
        </div>
        <div className="bcb-wrap-md">
          {(stage === "form" || stage === "submitting") ? (
            <div className="bcb-pricing-card">
              <form onSubmit={handleSubmit} className="bcb-form">
                <div className="bcb-form-group">
                  <label className="bcb-form-label">Full Name</label>
                  <input
                    type="text"
                    className="bcb-form-input"
                    placeholder="Your full name"
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    disabled={stage === "submitting"}
                    autoComplete="name"
                  />
                </div>
                <div className="bcb-form-group">
                  <label className="bcb-form-label">Email</label>
                  <input
                    type="email"
                    className="bcb-form-input"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    disabled={stage === "submitting"}
                    autoComplete="email"
                  />
                </div>
                <div className="bcb-form-row">
                  <div className="bcb-form-group">
                    <label className="bcb-form-label">Date of Birth</label>
                    <input
                      type="date"
                      className="bcb-form-input"
                      value={form.dob}
                      onChange={(e) => setForm((f) => ({ ...f, dob: e.target.value }))}
                      disabled={stage === "submitting"}
                    />
                  </div>
                  <div className="bcb-form-group">
                    <label className="bcb-form-label">Exact Birth Time</label>
                    <input
                      type="time"
                      className="bcb-form-input"
                      value={form.birth_time}
                      onChange={(e) => setForm((f) => ({ ...f, birth_time: e.target.value }))}
                      disabled={stage === "submitting"}
                    />
                  </div>
                </div>
                <div className="bcb-form-group">
                  <label className="bcb-form-label">Birth Place</label>
                  <LocationPicker
                    value={form.birth_place}
                    onChange={handleLocationChange}
                    placeholder="City where you were born"
                  />
                </div>
                {error && <div className="bcb-form-error">{error}</div>}
                <button
                  type="submit"
                  className="bcb-btn bcb-btn-gold"
                  style={{ width: "100%", fontSize: 16, padding: "18px", marginTop: 8 }}
                  disabled={stage === "submitting"}
                >
                  {stage === "submitting" ? "Saving birth details..." : <>Continue to payment — <s style={{ opacity: 0.5 }}>$29</s> $24 →</>}
                </button>
                <div style={{ textAlign: "center", marginTop: 12, fontSize: 13, color: "rgba(240,233,220,0.4)" }}>
                  🔒 Your data is only used to generate your reading.
                </div>
              </form>
            </div>
          ) : (
            <div className="bcb-pricing-card" style={{ textAlign: "center" }}>
              <div className="bcb-pricing-badge">Launch Price</div>
              <div className="bcb-pricing-product">Your Story</div>
              <div className="bcb-pricing-tagline">49 pages. 14 chapters. Every planet in your chart.</div>
              <div className="bcb-price-big">
                <span className="bcb-price-struck">$29</span>
                <span className="bcb-price-sym">$</span>
                <span className="bcb-price-num">24</span>
              </div>
              <div className="bcb-price-once">one-time · no subscription</div>
              <div className="bcb-price-includes">
                <div className="bcb-price-inc-label">What you get</div>
                <div className="bcb-price-inc-item"><span className="bcb-inc-check">✦</span> 11 chapters on your natal chart</div>
                <div className="bcb-price-inc-item"><span className="bcb-inc-check">✦</span> 3 chapters on current-season transits</div>
                <div className="bcb-price-inc-item"><span className="bcb-inc-check">✦</span> Real placement footnotes on every line</div>
                <div className="bcb-price-inc-item"><span className="bcb-inc-check">✦</span> Swipeable book format + PDF download</div>
                <div className="bcb-price-inc-item"><span className="bcb-inc-check" style={{ color: "#4CAF50" }}>⚡</span> Ready in under 10 minutes</div>
                <div className="bcb-price-inc-item"><span className="bcb-inc-check">✓</span> Personalized from your exact birth details</div>
                <div className="bcb-price-inc-item"><span className="bcb-inc-check">✓</span> Lifetime access</div>
              </div>
              <button className="bcb-btn bcb-btn-gold" style={{ width: "100%", fontSize: 16, padding: "18px" }} onClick={scrollToForm}>
                Get my in-depth birth chart reading — <s style={{ opacity: 0.5 }}>$29</s> $24 →
              </button>
              <div style={{ marginTop: 14, fontSize: 13, color: "rgba(240,233,220,0.4)" }}>
                🔒 Refund if it doesn't feel like you.
              </div>
            </div>
          )}
        </div>
      </section>

      {/* FAQ */}
      <section className="bcb-section">
        <div className="bcb-wrap" style={{ textAlign: "center", marginBottom: 48 }}>
          <span className="bcb-eyebrow">Questions</span>
          <h2 className="bcb-section-title">The ones people actually ask.</h2>
        </div>
        <div className="bcb-wrap-md">
          {FAQS.map((f, i) => (
            <FaqItem key={i} q={f.q} a={f.a} />
          ))}
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="bcb-final">
        <div className="bcb-wrap" style={{ textAlign: "center" }}>
          <span className="bcb-eyebrow" style={{ display: "block", marginBottom: 20 }}>Ready?</span>
          <h2 className="bcb-final-h">
            You've been trying to understand yourself<br />
            <em>using a three-word summary.</em>
          </h2>
          <p className="bcb-final-sub">Your chart has 49 pages of actual answers.</p>
          <div className="bcb-final-price">
            <span style={{ fontSize: 24, color: "rgba(240,233,220,0.25)", textDecoration: "line-through" }}>$29</span>{" "}
            <span style={{ color: "var(--bcb-gold)" }}>$24</span>{" "}
            · launch price · ready in minutes
          </div>
          <button className="bcb-btn bcb-btn-gold" style={{ fontSize: 16, padding: "18px 48px" }} onClick={scrollToForm}>
            Get my in-depth birth chart reading →
          </button>
          <div style={{ marginTop: 16, fontSize: 12, color: "rgba(240,233,220,0.35)" }}>
            🔒 No subscription. In your inbox in under 10 minutes.
          </div>
        </div>
      </section>
    </div>
  );
}

/* ─── STYLES ────────────────────────────────────────────────────────── */

const bcbStyles = `
  .bcb {
    --bcb-bg: #0B0B0B;
    --bcb-bg-lift: #111111;
    --bcb-bg-card: #161616;
    --bcb-gold: #BF975A;
    --bcb-gold-lt: #D4B07A;
    --bcb-gold-dim: #7A5E35;
    --bcb-cream: #F0E9DC;
    --bcb-cream-dim: rgba(240,233,220,0.6);
    --bcb-cream-mute: rgba(240,233,220,0.35);
    --bcb-border: rgba(191,151,90,0.13);
    --bcb-border-strong: rgba(191,151,90,0.28);
    position: relative;
    font-family: var(--font-body), 'DM Sans', system-ui, sans-serif;
    color: var(--bcb-cream);
    line-height: 1.7;
  }

  /* NAV */
  .bcb-nav {
    position: sticky; top: 0; z-index: 200;
    background: rgba(11,11,11,0.92);
    backdrop-filter: blur(16px);
    border-bottom: 1px solid var(--bcb-border);
    padding: 0 32px; height: 56px;
    display: flex; align-items: center; justify-content: space-between;
  }
  .bcb-nav-logo {
    font-family: var(--font-body); font-size: 12px; font-weight: 600;
    letter-spacing: 0.18em; text-transform: uppercase;
    color: var(--bcb-gold); text-decoration: none;
  }
  .bcb-nav-right { display: flex; align-items: center; gap: 16px; }
  .bcb-nav-price { font-size: 13px; color: var(--bcb-cream-mute); }
  .bcb-nav-btn {
    background: var(--bcb-gold); color: #0B0B0B;
    font-size: 13px; font-weight: 600;
    padding: 9px 20px; border-radius: 100px;
    border: none; cursor: pointer; white-space: nowrap;
  }
  .bcb-nav-btn:hover { background: var(--bcb-gold-lt); }

  /* HERO */
  .bcb-hero {
    min-height: 100svh;
    display: flex; flex-direction: column; justify-content: center;
    padding: 80px 24px 60px; position: relative; overflow: hidden;
  }
  .bcb-hero-glow {
    position: absolute; top: -20%; left: 50%; transform: translateX(-50%);
    width: 900px; height: 500px;
    background: radial-gradient(ellipse, rgba(191,151,90,0.07) 0%, transparent 65%);
    pointer-events: none;
  }
  .bcb-hero-inner {
    max-width: 1080px; margin: 0 auto; width: 100%;
    display: grid; grid-template-columns: 1fr 440px; gap: 64px; align-items: center;
    position: relative; z-index: 1;
  }
  .bcb-hero-content { position: relative; z-index: 1; }
  .bcb-hero-admit {
    display: inline-flex; align-items: center; gap: 10px;
    font-size: 13px; color: var(--bcb-cream-mute); margin-bottom: 28px;
  }
  .bcb-admit-dot {
    width: 6px; height: 6px; border-radius: 50%; background: var(--bcb-gold);
    animation: bcb-pulse 2s ease-in-out infinite;
  }
  @keyframes bcb-pulse { 0%,100% { opacity:1 } 50% { opacity:0.4 } }
  .bcb-hero-h1 {
    font-family: var(--font-display), Georgia, serif;
    font-size: clamp(40px, 5.5vw, 72px); font-weight: 700;
    line-height: 1.05; letter-spacing: -0.025em;
    margin-bottom: 14px;
  }
  .bcb-hero-h2 {
    font-family: var(--font-display), Georgia, serif;
    font-size: clamp(22px, 3vw, 34px); font-weight: 500;
    line-height: 1.2; letter-spacing: -0.015em;
    margin-bottom: 26px;
  }
  .bcb-ital { font-style: italic; color: var(--bcb-gold); }
  .bcb-hero-pain {
    font-size: 17px; color: var(--bcb-cream-dim);
    font-weight: 300; line-height: 1.8;
    margin-bottom: 32px; max-width: 520px;
  }
  .bcb-hero-proof {
    display: flex; align-items: center; gap: 20px; flex-wrap: wrap;
    margin-bottom: 28px;
  }
  .bcb-proof-item { display: flex; align-items: center; gap: 7px; font-size: 13px; color: var(--bcb-cream-mute); }
  .bcb-proof-icon { color: var(--bcb-gold); font-size: 14px; }
  .bcb-hero-price {
    font-family: var(--font-display), Georgia, serif;
    font-size: 38px; font-weight: 700; margin-bottom: 16px;
  }
  .bcb-hero-price-old {
    font-size: 22px; text-decoration: line-through; opacity: 0.35;
    font-family: var(--font-body); font-weight: 400; margin-right: 10px;
  }
  .bcb-price-tag { font-size: 13px; color: var(--bcb-gold); font-family: var(--font-body); font-weight: 400; margin-left: 8px; }
  .bcb-hero-ctas { display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 12px; }
  .bcb-hero-nosub { font-size: 12px; color: var(--bcb-cream-mute); }

  /* BOOK */
  .bcb-hero-visual { position: relative; display: flex; justify-content: center; z-index: 1; }
  .bcb-book-mockup {
    width: 400px;
    border-radius: 4px 14px 14px 4px;
    border: 1px solid rgba(191,151,90,0.18);
    overflow: hidden;
    box-shadow: -5px 0 0 rgba(191,151,90,0.1), 32px 24px 80px rgba(0,0,0,0.7);
    position: relative;
  }
  .bcb-book-spine {
    position: absolute; left: 0; top: 0; bottom: 0; width: 5px;
    background: linear-gradient(90deg, rgba(191,151,90,0.5), rgba(191,151,90,0.1));
  }
  .bcb-book-pages-pill {
    position: absolute; top: 14px; right: 14px;
    background: rgba(0,0,0,0.6); font-size: 10px; color: var(--bcb-cream-mute);
    padding: 4px 10px; border-radius: 20px; letter-spacing: 0.06em; z-index: 2;
  }
  .bcb-book-cover {
    background: #0D0D0D; aspect-ratio: 0.72;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    padding: 48px 32px; text-align: center;
  }
  .bcb-bcf-brand { font-size: 9px; letter-spacing: 0.3em; text-transform: uppercase; color: var(--bcb-gold); margin-bottom: 40px; }
  .bcb-bcf-title { font-family: var(--font-display), Georgia, serif; font-size: 40px; font-weight: 700; color: var(--bcb-gold); line-height: 1.1; margin-bottom: 16px; }
  .bcb-bcf-sub { font-family: var(--font-display), Georgia, serif; font-style: italic; font-size: 12px; color: var(--bcb-cream-mute); margin-bottom: 56px; line-height: 1.65; }
  .bcb-bcf-for { font-size: 9px; letter-spacing: 0.25em; text-transform: uppercase; color: rgba(240,233,220,0.25); margin-bottom: 10px; }
  .bcb-bcf-name { font-family: var(--font-display), Georgia, serif; font-size: 20px; color: var(--bcb-cream); margin-bottom: 40px; }
  .bcb-bcf-foot { font-size: 10px; color: rgba(240,233,220,0.2); letter-spacing: 0.07em; }

  /* TRUST BAR */
  .bcb-trust-bar {
    border-top: 1px solid var(--bcb-border); border-bottom: 1px solid var(--bcb-border);
    padding: 22px 24px; background: #0F0F0F; position: relative; z-index: 1;
  }
  .bcb-trust-inner { max-width: 1200px; margin: 0 auto; display: flex; justify-content: center; align-items: center; gap: 40px; flex-wrap: wrap; }
  .bcb-trust-item {
    font-size: 14px; color: rgba(240,233,220,0.7); display: flex; align-items: center; gap: 10px;
    font-weight: 500; letter-spacing: 0.01em;
  }
  .bcb-trust-dot { color: var(--bcb-gold); font-size: 12px; }

  /* SECTIONS */
  .bcb-section { padding: 100px 24px; position: relative; z-index: 1; }
  .bcb-wrap { max-width: 1080px; margin: 0 auto; }
  .bcb-wrap-md { max-width: 780px; margin: 0 auto; padding: 0 24px; }
  .bcb-wrap-sm { max-width: 600px; margin: 0 auto; padding: 0 24px; }
  .bcb-eyebrow {
    display: inline-block; font-size: 11px; font-weight: 600;
    letter-spacing: 0.18em; text-transform: uppercase;
    color: var(--bcb-gold); margin-bottom: 16px;
  }
  .bcb-section-title {
    font-family: var(--font-display), Georgia, serif;
    font-size: clamp(28px, 3.8vw, 46px); font-weight: 700;
    line-height: 1.12; letter-spacing: -0.02em; margin-bottom: 18px;
  }
  .bcb-section-sub { font-size: 17px; color: var(--bcb-cream-dim); font-weight: 300; line-height: 1.75; max-width: 640px; }

  /* BUTTONS */
  .bcb-btn {
    display: inline-block; font-family: var(--font-body); font-size: 15px; font-weight: 600;
    padding: 15px 34px; border-radius: 100px;
    text-decoration: none; text-align: center; cursor: pointer; border: none;
    transition: all 0.18s;
  }
  .bcb-btn-gold { background: var(--bcb-gold); color: #0B0B0B; }
  .bcb-btn-gold:hover { background: var(--bcb-gold-lt); transform: translateY(-1px); }
  .bcb-btn-gold:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
  .bcb-btn-ghost { border: 1px solid var(--bcb-border-strong); color: var(--bcb-gold); background: transparent; }
  .bcb-btn-ghost:hover { background: rgba(191,151,90,0.08); border-color: var(--bcb-gold); }

  /* TOC BOOK GRID */
  .bcb-toc-grid {
    display: grid; grid-template-columns: 1fr 1fr; gap: 28px;
    max-width: 960px; margin: 0 auto;
  }
  .bcb-toc-book {
    background: #0D0D0D;
    border: 1px solid rgba(191,151,90,0.18);
    border-radius: 4px 14px 14px 4px;
    position: relative; overflow: hidden;
    box-shadow: -4px 0 0 rgba(191,151,90,0.08), 16px 12px 48px rgba(0,0,0,0.5);
  }
  .bcb-toc-spine {
    position: absolute; left: 0; top: 0; bottom: 0; width: 5px;
    background: linear-gradient(90deg, rgba(191,151,90,0.45), rgba(191,151,90,0.08));
  }
  .bcb-toc-inner { padding: 28px 28px 28px 36px; }
  .bcb-chapter-tag {
    font-size: 10px; font-weight: 600; letter-spacing: 0.16em; text-transform: uppercase;
    color: var(--bcb-gold); padding: 6px 0 10px; display: block;
  }
  .bcb-chapter-row {
    display: flex; align-items: flex-start; gap: 14px;
    padding: 12px 0; border-bottom: 1px solid rgba(191,151,90,0.1);
    transition: all 0.2s;
  }
  .bcb-chapter-row:last-child { border-bottom: none; }
  .bcb-chapter-num { font-size: 11px; color: var(--bcb-gold-dim); font-weight: 600; letter-spacing: 0.06em; min-width: 22px; padding-top: 3px; }
  .bcb-chapter-name {
    font-family: var(--font-display), Georgia, serif; font-size: 15px;
    color: rgba(240,233,220,0.8); line-height: 1.4; transition: color 0.2s;
  }
  .bcb-chapter-row:hover .bcb-chapter-name { color: var(--bcb-gold); }
  .bcb-chapter-planets { font-size: 11px; color: var(--bcb-cream-mute); margin-top: 3px; }

  /* SAMPLE */
  .bcb-sample-tag {
    display: inline-flex; align-items: center; gap: 8px;
    background: rgba(191,151,90,0.1); border: 1px solid var(--bcb-border-strong);
    color: var(--bcb-gold); font-size: 11px; font-weight: 600; letter-spacing: 0.14em;
    text-transform: uppercase; padding: 7px 16px; border-radius: 100px; margin-bottom: 32px;
  }
  .bcb-sample-frame {
    margin-top: 48px; background: #0D0D0D; border: 1px solid var(--bcb-border);
    border-radius: 16px; overflow: hidden; max-width: 820px; margin-left: auto; margin-right: auto;
  }
  .bcb-sample-chrome {
    background: #0A0A0A; border-bottom: 1px solid rgba(255,255,255,0.05);
    padding: 12px 24px; display: flex; justify-content: space-between; align-items: center;
    font-size: 10px; color: var(--bcb-cream-mute); letter-spacing: 0.1em; text-transform: uppercase;
  }
  .bcb-sample-body { padding: 48px 48px 0; }
  .bcb-sample-ey { font-size: 11px; font-weight: 600; letter-spacing: 0.2em; text-transform: uppercase; color: var(--bcb-gold); margin-bottom: 12px; }
  .bcb-sample-h { font-family: var(--font-display), Georgia, serif; font-size: 34px; font-weight: 700; margin-bottom: 8px; line-height: 1.15; }
  .bcb-sample-sub { font-family: var(--font-display), Georgia, serif; font-style: italic; font-size: 15px; color: var(--bcb-cream-mute); margin-bottom: 36px; }
  .bcb-sample-text { font-size: 16px; line-height: 1.9; color: rgba(240,233,220,0.78); font-weight: 300; }
  .bcb-sample-text p { margin-bottom: 22px; }
  .bcb-sample-fade { height: 120px; margin-top: -120px; position: relative; background: linear-gradient(transparent, #0D0D0D 80%); pointer-events: none; }
  .bcb-sample-callout {
    background: rgba(191,151,90,0.07); border: 1px solid rgba(191,151,90,0.15);
    border-radius: 12px; padding: 18px 20px; display: flex; align-items: flex-start; gap: 14px;
    font-size: 13px; color: rgba(240,233,220,0.55); line-height: 1.7;
  }
  .bcb-sample-footer { padding: 16px 48px 32px; display: flex; align-items: center; justify-content: space-between; gap: 20px; flex-wrap: wrap; }

  /* REVIEWS */
  .bcb-reviews-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  .bcb-review-card {
    padding: 28px 24px; border-radius: 14px;
    background: var(--bcb-bg-card); border: 1px solid var(--bcb-border);
  }
  .bcb-review-featured { grid-column: 1 / -1; text-align: center; background: rgba(191,151,90,0.06); border-color: var(--bcb-border-strong); }
  .bcb-review-stars { color: var(--bcb-gold); font-size: 12px; letter-spacing: 3px; margin-bottom: 14px; }
  .bcb-review-text {
    font-family: var(--font-display), Georgia, serif; font-style: italic;
    font-size: 16px; line-height: 1.75; color: rgba(240,233,220,0.8); margin-bottom: 20px;
  }
  .bcb-review-featured .bcb-review-text { font-size: 20px; max-width: 600px; margin: 0 auto 20px; }
  .bcb-review-byline { font-size: 12px; color: var(--bcb-cream-mute); }
  .bcb-review-byline strong { color: rgba(240,233,220,0.55); font-weight: 500; }

  /* HONEST */
  .bcb-honest-img-wrap {
    max-width: 820px; margin: 0 auto 40px; border-radius: 14px; overflow: hidden;
    border: 2px solid var(--bcb-gold);
    box-shadow: 0 12px 48px rgba(191,151,90,0.12);
  }
  .bcb-honest-img {
    width: 100%; height: auto; display: block;
  }
  .bcb-honest-card {
    max-width: 820px; margin: 0 auto;
    background: var(--bcb-bg-card); border: 1px solid var(--bcb-border); border-radius: 20px;
    padding: 40px 48px; text-align: left;
  }
  .bcb-honest-h { font-family: var(--font-display), Georgia, serif; font-size: 24px; font-weight: 700; margin-bottom: 16px; }
  .bcb-honest-p { font-size: 16px; color: var(--bcb-cream-dim); line-height: 1.8; margin-bottom: 14px; font-weight: 300; }
  .bcb-info-box { padding: 18px 20px; background: rgba(191,151,90,0.06); border: 1px solid var(--bcb-border); border-radius: 12px; }
  .bcb-info-label { font-size: 11px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: var(--bcb-gold); margin-bottom: 8px; }
  .bcb-info-text { font-size: 14px; color: var(--bcb-cream-dim); line-height: 1.7; }

  /* PRICING CARD */
  .bcb-pricing-card {
    max-width: 520px; margin: 0 auto;
    background: var(--bcb-bg-card); border: 1px solid var(--bcb-border-strong); border-radius: 24px;
    padding: 48px 40px; position: relative;
  }
  .bcb-pricing-badge {
    display: inline-block; background: rgba(191,151,90,0.1); border: 1px solid var(--bcb-border-strong);
    color: var(--bcb-gold); font-size: 11px; font-weight: 600; letter-spacing: 0.14em;
    text-transform: uppercase; padding: 7px 16px; border-radius: 100px; margin-bottom: 24px;
  }
  .bcb-pricing-product { font-family: var(--font-display), Georgia, serif; font-size: 30px; font-weight: 700; margin-bottom: 8px; }
  .bcb-pricing-tagline { font-size: 15px; color: var(--bcb-cream-mute); margin-bottom: 28px; font-weight: 300; }
  .bcb-price-big { display: flex; align-items: flex-start; justify-content: center; gap: 6px; margin-bottom: 6px; }
  .bcb-price-sym { font-size: 22px; color: var(--bcb-cream-mute); padding-top: 10px; }
  .bcb-price-num { font-family: var(--font-display), Georgia, serif; font-size: 72px; font-weight: 700; line-height: 1; }
  .bcb-price-struck { font-family: var(--font-display), Georgia, serif; font-size: 28px; color: rgba(240,233,220,0.25); text-decoration: line-through; padding-top: 18px; margin-right: 6px; }
  .bcb-price-once { font-size: 13px; color: var(--bcb-cream-mute); margin-bottom: 24px; }
  .bcb-price-includes { text-align: left; border-top: 1px solid var(--bcb-border); padding-top: 24px; margin-bottom: 28px; }
  .bcb-price-inc-label { font-size: 10px; color: var(--bcb-cream-mute); letter-spacing: 0.14em; text-transform: uppercase; margin-bottom: 14px; }
  .bcb-price-inc-item { display: flex; align-items: flex-start; gap: 10px; font-size: 14px; color: rgba(240,233,220,0.72); margin-bottom: 10px; line-height: 1.5; }
  .bcb-inc-check { color: var(--bcb-gold); flex-shrink: 0; }

  /* FORM */
  .bcb-form { display: flex; flex-direction: column; gap: 18px; }
  .bcb-form-group { display: flex; flex-direction: column; gap: 6px; }
  .bcb-form-label { font-size: 12px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: var(--bcb-gold); }
  .bcb-form-input {
    background: rgba(240,233,220,0.05); border: 1px solid var(--bcb-border);
    color: var(--bcb-cream); font-size: 15px; padding: 14px 16px; border-radius: 12px;
    font-family: var(--font-body); outline: none; transition: border-color 0.15s;
    width: 100%;
  }
  .bcb-form-input:focus { border-color: var(--bcb-gold); }
  .bcb-form-input::placeholder { color: rgba(240,233,220,0.25); }
  .bcb-form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  .bcb-form-error { color: #e54; font-size: 14px; padding: 10px 14px; background: rgba(229,68,68,0.08); border-radius: 10px; }

  /* FAQ */
  .bcb-faq-item { border-bottom: 1px solid var(--bcb-border); overflow: hidden; }
  .bcb-faq-q {
    width: 100%; background: none; border: none; padding: 22px 0; text-align: left;
    font-family: var(--font-display), Georgia, serif; font-size: 17px; font-weight: 500;
    color: rgba(240,233,220,0.88); cursor: pointer;
    display: flex; justify-content: space-between; align-items: center; gap: 16px;
  }
  .bcb-faq-q:hover { color: var(--bcb-cream); }
  .bcb-faq-plus { color: var(--bcb-gold); font-size: 20px; font-weight: 300; transition: transform 0.25s; flex-shrink: 0; }
  .bcb-faq-plus.open { transform: rotate(45deg); }
  .bcb-faq-a {
    max-height: 0; overflow: hidden; transition: max-height 0.35s cubic-bezier(0.4,0,0.2,1), padding 0.2s;
    font-size: 15px; color: var(--bcb-cream-mute); line-height: 1.8;
  }
  .bcb-faq-a.open { max-height: 320px; padding-bottom: 22px; }

  /* FINAL */
  .bcb-final {
    padding: 120px 24px; position: relative; z-index: 1;
    background: radial-gradient(ellipse 55% 60% at 50% 50%, rgba(191,151,90,0.06), transparent 65%);
  }
  .bcb-final-h {
    font-family: var(--font-display), Georgia, serif;
    font-size: clamp(30px, 4.5vw, 54px); font-weight: 700; line-height: 1.1; margin-bottom: 16px;
  }
  .bcb-final-h em { font-style: italic; color: var(--bcb-gold); }
  .bcb-final-sub { font-size: 17px; color: var(--bcb-cream-mute); margin-bottom: 12px; font-weight: 300; }
  .bcb-final-price { font-family: var(--font-display), Georgia, serif; font-size: 34px; margin-bottom: 32px; }

  /* RESPONSIVE */
  @media (max-width: 900px) {
    .bcb-hero-inner { grid-template-columns: 1fr; }
    .bcb-hero-visual { order: -1; }
    .bcb-book-mockup { width: 300px; }
    .bcb-toc-grid { grid-template-columns: 1fr; }
    .bcb-reviews-grid { grid-template-columns: 1fr; }
    .bcb-review-featured { grid-column: 1; }
    .bcb-honest-card { padding: 28px 24px; }
  }
  @media (max-width: 600px) {
    .bcb-section { padding: 72px 16px; }
    .bcb-nav { padding: 0 16px; }
    .bcb-nav-price { display: none; }
    .bcb-hero-ctas { flex-direction: column; align-items: stretch; }
    .bcb-pricing-card { padding: 32px 20px; }
    .bcb-sample-body { padding: 32px 24px 0; }
    .bcb-sample-footer { padding: 16px 24px 24px; }
    .bcb-form-row { grid-template-columns: 1fr; }
    .bcb-book-mockup { width: 260px; }
    .bcb-wrap-md { padding: 0 16px; }
  }
`;
