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

/* ─── QUESTION TEASERS ─────────────────────────────────────────────── */

const QUESTION_TEASERS = [
  {
    question: "Why do people misread me?",
    chapter: "Chapter 1 · Who You Are",
    teaser: "People assume you're one thing — calm, easygoing, agreeable. But underneath that you're tracking everything. Every tone shift, every silence that lasted too long, every time someone said 'fine' when they meant…",
  },
  {
    question: "What career actually fits me?",
    chapter: "Chapter 2 · Purpose, Career & Success",
    teaser: "You've been measuring yourself against a version of success that was never yours. The way your chart is built, your actual talent isn't in the role you'd put on a résumé — it's in…",
  },
  {
    question: "Why do my relationships keep going this way?",
    chapter: "Chapter 3 · Love, Relationships & Intimacy",
    teaser: "There's a pattern you keep running. You attract people who feel like relief at first — someone who finally sees you. But then the same thing happens. You start noticing the gap between what they say and…",
  },
  {
    question: "How do I build wealth with my chart?",
    chapter: "Chapter 4 · Money & Wealth",
    teaser: "Your relationship with money isn't what you think it is. You don't have a spending problem or an earning problem — you have a…",
  },
  {
    question: "Why does anxiety keep showing up?",
    chapter: "Chapter 5 · Growth & Emotional Well-being",
    teaser: "It's not anxiety in the way you've been told. What you're actually carrying is something more specific — a kind of hypervigilance that started so early you think it's just…",
  },
  {
    question: "Why does everything feel so heavy right now?",
    chapter: "Chapter 6 · Your Life Right Now",
    teaser: "Because something is actually ending. Not metaphorically. The transit moving through your chart right now is pulling apart a structure you built your life around, and the reason it feels this heavy is because…",
  },
  {
    question: "When does it get better?",
    chapter: "Chapter 7 · What's Coming Next",
    teaser: "Sooner than you think — but not in the way you're expecting. The heaviest pressure in your chart right now eases within…",
  },
];

/* ─── QUESTION PICKER ──────────────────────────────────────────────── */

function QuestionPicker({ scrollToForm }: { scrollToForm: () => void }) {
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <section id="sample" className="bcb-section" style={{ background: "#111111" }}>
      <div className="bcb-wrap" style={{ textAlign: "center" }}>
        <span className="bcb-eyebrow">Your reading answers real questions</span>
        <h2 className="bcb-section-title">Which question brought you here tonight?</h2>
        <p className="bcb-section-sub" style={{ margin: "0 auto 48px", maxWidth: 720 }}>
          Pick the one that's been on your mind. Your reading has a full chapter on it — written from your exact chart.
        </p>
      </div>
      <div className="bcb-wrap" style={{ maxWidth: 820, margin: "0 auto" }}>
        <div className="bcb-qp-grid">
          {QUESTION_TEASERS.map((qt, i) => (
            <button
              key={i}
              className={`bcb-qp-pill ${selected === i ? "bcb-qp-active" : ""}`}
              onClick={() => setSelected(i)}
            >
              {qt.question}
            </button>
          ))}
        </div>

        {selected !== null && (
          <div className="bcb-qp-reveal">
            <div className="bcb-sample-chrome">
              <span>{QUESTION_TEASERS[selected].chapter}</span>
              <span style={{ color: "rgba(240,233,220,0.2)" }}>BluntChart</span>
            </div>
            <div className="bcb-qp-body">
              <div className="bcb-sample-text">
                <p>{QUESTION_TEASERS[selected].teaser}</p>
              </div>
            </div>
            <div className="bcb-qp-lock-fade" />
            <div className="bcb-qp-lock-row">
              <span className="bcb-qp-lock-icon">🔒</span>
              <span>Your reading continues from here — personalized to your natal chart.</span>
            </div>
            <div className="bcb-sample-footer">
              <span style={{ fontStyle: "italic", color: "rgba(240,233,220,0.45)", fontSize: 13 }}>
                8 chapters. 40+ pages. Every answer built from your exact birth chart.
              </span>
              <button className="bcb-btn bcb-btn-gold" style={{ padding: "12px 24px", fontSize: 14 }} onClick={scrollToForm}>
                Get my reading — $24 →
              </button>
            </div>
          </div>
        )}

        {selected === null && (
          <div className="bcb-qp-hint">
            ↑ Tap a question to see how your reading starts to answer it.
          </div>
        )}
      </div>
    </section>
  );
}

/* ─── FAQS ──────────────────────────────────────────────────────────── */

const FAQS = [
  {
    q: "What is an in-depth birth chart reading?",
    a: "A birth chart reading (also called a natal chart reading) is a personalized analysis of every planet, house, and aspect in the sky at the exact moment and place you were born. Unlike a basic horoscope that covers just your Sun sign, an in-depth birth chart reading interprets your Moon, Rising, Mercury, Venus, Mars, Saturn, and all outer planets across all 12 houses — revealing patterns in your personality, relationships, career, and life path. This reading also includes your current astrology transits, showing what's active in your life right now.",
  },
  {
    q: "How accurate are birth chart readings?",
    a: "The chart itself is mathematically precise — it's calculated from real ephemeris data using your exact birth time and coordinates. The interpretation depends on the astrological framework. BluntChart's framework was built by human astrologers, and the narrative is generated from your specific placements. Two people born on the same day in different cities get completely different readings. We show placement footnotes throughout so you can verify which planet and house produced each paragraph.",
  },
  {
    q: "What's the difference between a birth chart reading and a horoscope?",
    a: "A horoscope is a general forecast based on your Sun sign — one of 12 categories shared with millions of people. A birth chart reading is personalized to your exact birth time, date, and location. It analyzes all planetary placements, house positions, and aspects unique to you. This in-depth reading also covers current transits — where planets are now relative to your natal chart — so you understand what's happening in your life right now, not just your personality.",
  },
  {
    q: "I've seen birth chart readings on Etsy for $8-$15. Why is this more?",
    a: "Three real differences. First, depth: most Etsy readings are 10-20 pages of bullet points covering Sun, Moon, Rising. This is 8 chapters, 40+ pages — your current transits and your full natal chart analysis — covering career, love, money, emotional patterns, and actionable takeaways. Second, format: this isn't a flat PDF. It's a swipeable book experience you read online, plus a downloadable PDF. Third, sourcing: every paragraph cites the actual planet and house behind it.",
  },
  {
    q: "Is this birth chart reading written by AI or a human astrologer?",
    a: "Both contributed. The interpretive framework was built by human astrologers. The personalized narrative for your specific chart is generated by AI using that framework and your exact planetary placements. We say this clearly because most sellers don't. The practical outcome: you get the depth of a $100+ astrologer consultation in minutes.",
  },
  {
    q: "What information do you need for my natal chart reading?",
    a: "Three things: your date of birth, exact time of birth (as close to the minute as you can get), and place of birth. Your birth time determines your Rising sign and house placements, which are essential for an accurate birth chart analysis. If you don't know your exact birth time, you can still get a reading, but we'll note which chapters are more approximate.",
  },
  {
    q: "How is the birth chart reading delivered?",
    a: "After payment, your personalized birth chart reading generates in 5-10 minutes. You receive a link to a swipeable online book you can read immediately, plus a downloadable PDF version. It's yours permanently — no account required, no subscription.",
  },
  {
    q: "What if the reading doesn't feel like me?",
    a: "All sales are final — this is a personalized digital product generated instantly from your birth details. If something goes wrong on our end (reading not delivered, technical error, corrupted content), email us at hello@bluntchart.com and we'll fix it or regenerate it for you. We stand behind the quality of every reading.",
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
  { num: "01", name: "Who You Are", sub: "Sun · Moon · Rising · Mercury · Hidden strengths · What people misunderstand", question: "Why do people misread you — and what are you actually like underneath?" },
  { num: "02", name: "Purpose, Career & Success", sub: "Midheaven · Saturn · Jupiter · 10th House · North Node", question: "What career fits your chart — and when is the right time to make a move?" },
  { num: "03", name: "Love, Relationships & Intimacy", sub: "Venus · Mars · Moon · 5th & 7th Houses · Relationship patterns", question: "Why do your relationships follow the same pattern — and what do you actually need?" },
  { num: "04", name: "Money & Wealth", sub: "Jupiter · 2nd House · Venus · Saturn · Income paths", question: "How does your chart say you build wealth — and when should you be cautious?" },
];

const CHAPTERS_RIGHT = [
  { num: "05", name: "Growth & Emotional Well-being", sub: "Saturn · Pluto · 12th House · Chiron · Blind spots", question: "Why does anxiety keep showing up — and what actually brings you peace?" },
  { num: "06", name: "Your Life Right Now", sub: "Current Transits · What's ending · What's beginning · What demands attention", question: "Why does life feel the way it does right now — and what area needs your focus?" },
  { num: "07", name: "What's Coming Next", sub: "Upcoming Transits · Easier periods · Opportunities · What to prepare for", question: "When does it get better — and what opportunities are approaching?" },
  { num: "08", name: "What To Do With All of This", sub: "Synthesis · Actionable Takeaways · What to stop · What to start", question: "What matters most right now — and what should you actually do next?" },
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
          product_type: "in-depth-reading",
        }),
      });

      const data = await res.json();
      if (!data.success) {
        setError(data.error || "Something went wrong. Please try again.");
        setStage("form");
        return;
      }

      const checkoutUrl = buildCheckoutUrl("in-depth-reading", {
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
          <span className="bcb-nav-price">$24 · one-time · 40-page reading</span>
          <button className="bcb-nav-btn" onClick={scrollToForm}>Get my reading →</button>
        </div>
      </nav>

      {/* HERO */}
      <section className="bcb-hero">
        <div className="bcb-hero-glow" />
        <div className="bcb-hero-inner">
          <div className="bcb-hero-top">
            <div className="bcb-hero-admit">
              <span className="bcb-admit-dot" />
              Personalized birth chart reading &nbsp;·&nbsp; 8 chapters &nbsp;·&nbsp; 40+ pages &nbsp;·&nbsp; Ready in 10 minutes
            </div>
            <h1 className="bcb-hero-h1">Your In-Depth Birth Chart Reading</h1>
            <h2 className="bcb-hero-h2">
              8 chapters. 40+ pages. Every planet, every house, every transit.<br />
              <span className="bcb-ital">Personalized to the minute you were born.</span>
            </h2>
          </div>
          <div className="bcb-hero-split">
            <div className="bcb-hero-content">
              <p className="bcb-hero-pain">
                You already know your Sun sign. You've probably read your Moon and Rising too. But none of it has actually <em>explained</em> you.<br /><br />
                Why do you keep ending up in the same situations? Why does something feel off even when things are going well? What's actually supposed to come next?<br /><br />
                This birth chart reading goes through your entire natal chart — personality, career, love, money, growth, and your current astrology transits — and gives you real answers across 8 chapters and 40+ pages.
              </p>
              <div className="bcb-hero-proof">
                <span className="bcb-proof-item"><span className="bcb-proof-icon">✦</span> 8 chapters · 40+ pages of personalized analysis</span>
                <span className="bcb-proof-item"><span className="bcb-proof-icon">✦</span> Birth chart + current astrology transits</span>
                <span className="bcb-proof-item"><span className="bcb-proof-icon">✦</span> Online book + downloadable PDF</span>
                <span className="bcb-proof-item"><span className="bcb-proof-icon" style={{ color: "#4CAF50" }}>⚡</span> Ready in under 10 minutes</span>
              </div>
              <div className="bcb-hero-price">
                $24 <span className="bcb-price-tag">one-time payment · yours forever</span>
              </div>
              <div className="bcb-hero-ctas">
                <button className="bcb-btn bcb-btn-gold" onClick={scrollToForm}>Get my birth chart reading →</button>
                <a href="#chapters" className="bcb-btn bcb-btn-ghost">See what's inside</a>
              </div>
              <div className="bcb-hero-nosub">No subscription. No upsells. Delivered to your inbox.</div>
            </div>

            {/* BOOK VISUAL */}
            <div className="bcb-hero-visual">
              <div className="bcb-book-mockup">
                <div className="bcb-book-spine" />
                <div className="bcb-book-pages-pill">40+ pages</div>
                <div className="bcb-book-cover">
                  <div className="bcb-bcf-brand">BluntChart</div>
                  <div className="bcb-bcf-title">In-Depth Reading</div>
                  <div className="bcb-bcf-sub">Your birth chart, decoded.<br />8 chapters. 40+ pages.</div>
                  <div className="bcb-bcf-for">Prepared for</div>
                  <div className="bcb-bcf-name">You</div>
                  <div className="bcb-bcf-foot">about 20 min · one sitting or in pieces</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST BAR */}
      <div className="bcb-trust-bar">
        <div className="bcb-trust-inner">
          <span className="bcb-trust-item"><span className="bcb-trust-dot">✦</span> 8 chapters · 40+ pages of natal chart analysis</span>
          <span className="bcb-trust-item"><span className="bcb-trust-dot" style={{ color: "#4CAF50" }}>⚡</span> Birth chart reading — ready in minutes</span>
          <span className="bcb-trust-item"><span className="bcb-trust-dot">✦</span> Online book + downloadable PDF</span>
          <span className="bcb-trust-item"><span className="bcb-trust-dot">✦</span> Real planetary data · real ephemeris</span>
        </div>
      </div>

      {/* WHAT'S INSIDE */}
      <section id="chapters" className="bcb-section">
        <div className="bcb-wrap">
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <span className="bcb-eyebrow">What's inside your birth chart reading</span>
            <h2 className="bcb-section-title">8 Chapters. 40+ Pages. Every Question You've Been Asking — Answered.</h2>
            <p className="bcb-section-sub" style={{ margin: "0 auto", maxWidth: 820 }}>
              Each chapter covers one part of your natal chart — and answers a specific question you've probably been Googling. Your birth chart has the answers. This reading connects them into one story.
            </p>
          </div>

          {/* INTERACTIVE CHAPTER GRID */}
          <div className="bcb-toc-grid">
            <div className="bcb-toc-book">
              <div className="bcb-toc-spine" />
              <div className="bcb-toc-inner">
                <span className="bcb-chapter-tag">Part I · Your Birth Chart</span>
                {CHAPTERS_LEFT.map((ch) => (
                  <div key={ch.num} className="bcb-chapter-row">
                    <span className="bcb-chapter-num">{ch.num}</span>
                    <div>
                      <div className="bcb-chapter-name">{ch.name}</div>
                      <div className="bcb-chapter-question">{ch.question}</div>
                      <div className="bcb-chapter-planets">{ch.sub}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bcb-toc-book">
              <div className="bcb-toc-spine" />
              <div className="bcb-toc-inner">
                <span className="bcb-chapter-tag">Part II · Your Transits + Takeaways</span>
                {CHAPTERS_RIGHT.map((ch) => (
                  <div key={ch.num} className="bcb-chapter-row">
                    <span className="bcb-chapter-num">{ch.num}</span>
                    <div>
                      <div className="bcb-chapter-name">{ch.name}</div>
                      <div className="bcb-chapter-question">{ch.question}</div>
                      <div className="bcb-chapter-planets">{ch.sub}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* NUMBERS BAR */}
          <div className="bcb-numbers-bar">
            <div className="bcb-number-item">
              <div className="bcb-number-big">8</div>
              <div className="bcb-number-label">Chapters</div>
            </div>
            <div className="bcb-number-item">
              <div className="bcb-number-big">40+</div>
              <div className="bcb-number-label">Pages (PDF)</div>
            </div>
            <div className="bcb-number-item">
              <div className="bcb-number-big">Every</div>
              <div className="bcb-number-label">Planet & House</div>
            </div>
            <div className="bcb-number-item">
              <div className="bcb-number-big">&lt;10 min</div>
              <div className="bcb-number-label">Delivery time</div>
            </div>
          </div>
        </div>
      </section>

      {/* QUESTION PICKER */}
      <QuestionPicker scrollToForm={scrollToForm} />

      {/* REVIEWS */}
      <section className="bcb-section" style={{ background: "#111111" }}>
        <div className="bcb-wrap">
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <span className="bcb-eyebrow">Real birth chart reading reviews</span>
            <h2 className="bcb-section-title">Don't take our word for it — here's what people said about their readings.</h2>
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
          <span className="bcb-eyebrow">How it works</span>
          <h2 className="bcb-section-title">How is your personalized birth chart reading created?</h2>
          <div className="bcb-honest-img-wrap">
            <Image
              src="/BluntChart-your book PDF preview.png"
              alt="BluntChart personalized birth chart reading PDF preview showing natal chart analysis chapters"
              width={900}
              height={520}
              className="bcb-honest-img"
            />
          </div>
          <div className="bcb-honest-card">
            <p className="bcb-honest-p" style={{ marginBottom: 0 }}>Your natal chart is calculated from the exact positions of every planet at the moment and place you were born — using real ephemeris data, not approximations. The interpretive framework was built by human astrologers. The personalized narrative is generated by AI from your specific placements and current transits.</p>
            <p className="bcb-honest-p" style={{ marginTop: 14, marginBottom: 0 }}>We tell you this upfront because most sellers don't. You deserve to know how your reading is made.</p>
            <div className="bcb-info-box" style={{ marginTop: 24 }}>
              <div className="bcb-info-label">How this compares to a traditional astrologer</div>
              <div className="bcb-info-text">A 1-hour astrologer consultation costs $100-$200 and takes 1-2 weeks to book. This birth chart reading gives you 8 chapters, 40+ pages of personalized analysis in under 10 minutes — same planetary data, same astrological framework, every paragraph built from your actual placements. The depth is the same. The delivery is instant.</div>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING + FORM */}
      <section id="pricing" className="bcb-section" ref={formRef}>
        <div className="bcb-wrap-md" style={{ textAlign: "center", marginBottom: 48 }}>
          <span className="bcb-eyebrow">Get Your Personalized Birth Chart Reading</span>
          <h2 className="bcb-section-title">
            {stage === "form" || stage === "submitting"
              ? "Enter your birth details — your reading starts here"
              : <>Your natal chart reading. <span style={{ color: "var(--bcb-gold)" }}>8 chapters. 40+ pages. Yours forever.</span></>}
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
                  {stage === "submitting" ? "Saving birth details..." : "Continue to payment — $24 →"}
                </button>
                <div style={{ textAlign: "center", marginTop: 12, fontSize: 13, color: "rgba(240,233,220,0.4)" }}>
                  🔒 Your data is only used to generate your reading.
                </div>
              </form>
            </div>
          ) : (
            <div className="bcb-pricing-card" style={{ textAlign: "center" }}>
              <div className="bcb-pricing-badge">One-time purchase</div>
              <div className="bcb-pricing-product">In-Depth Birth Chart Reading</div>
              <div className="bcb-pricing-tagline">8 chapters. 40+ pages of personalized natal chart analysis. Birth chart + current astrology transits.</div>
              <div className="bcb-price-big">
                <span className="bcb-price-sym">$</span>
                <span className="bcb-price-num">24</span>
              </div>
              <div className="bcb-price-once">one-time · no subscription · yours forever</div>
              <div className="bcb-price-includes">
                <div className="bcb-price-inc-label">What you get</div>
                <div className="bcb-price-inc-item"><span className="bcb-inc-check">✦</span> 5 chapters of natal chart analysis (who you are, career, love, money, growth)</div>
                <div className="bcb-price-inc-item"><span className="bcb-inc-check">✦</span> 2 chapters on your current astrology transits + what's coming next</div>
                <div className="bcb-price-inc-item"><span className="bcb-inc-check">✦</span> Actionable takeaways chapter with specific next steps</div>
                <div className="bcb-price-inc-item"><span className="bcb-inc-check">✦</span> 40+ pages · online book + downloadable PDF</div>
                <div className="bcb-price-inc-item"><span className="bcb-inc-check" style={{ color: "#4CAF50" }}>⚡</span> Ready in under 10 minutes</div>
                <div className="bcb-price-inc-item"><span className="bcb-inc-check">✓</span> Built from your exact birth time, date, and location</div>
                <div className="bcb-price-inc-item"><span className="bcb-inc-check">✓</span> Lifetime access · no account needed</div>
              </div>
              <button className="bcb-btn bcb-btn-gold" style={{ width: "100%", fontSize: 16, padding: "18px" }} onClick={scrollToForm}>
                Get my birth chart reading — $24 →
              </button>
              <div style={{ marginTop: 14, fontSize: 13, color: "rgba(240,233,220,0.4)" }}>
                🔒 All sales final. We fix any delivery issue.
              </div>
            </div>
          )}
        </div>
      </section>

      {/* FAQ */}
      <section className="bcb-section">
        <div className="bcb-wrap" style={{ textAlign: "center", marginBottom: 48 }}>
          <span className="bcb-eyebrow">Birth chart reading FAQ</span>
          <h2 className="bcb-section-title">Questions about natal chart readings? We've got answers.</h2>
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
          <span className="bcb-eyebrow" style={{ display: "block", marginBottom: 20 }}>Still here?</span>
          <h2 className="bcb-final-h">
            Your Sun sign is 1 out of 40+ placements<br />
            <em>in your natal chart.</em>
          </h2>
          <p className="bcb-final-sub">8 chapters. 40+ pages. Every planet, every house, every transit — personalized birth chart analysis built from the exact minute you were born.</p>
          <div className="bcb-final-price">
            <span style={{ color: "var(--bcb-gold)" }}>$24</span>{" "}
            · one-time payment · ready in minutes
          </div>
          <button className="bcb-btn bcb-btn-gold" style={{ fontSize: 16, padding: "18px 48px" }} onClick={scrollToForm}>
            Get my birth chart reading →
          </button>
          <div style={{ marginTop: 16, fontSize: 12, color: "rgba(240,233,220,0.35)" }}>
            No subscription. Online book + PDF. Delivered to your inbox in under 10 minutes.
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
    position: relative; z-index: 1;
  }
  .bcb-hero-top { text-align: center; margin-bottom: 48px; }
  .bcb-hero-split {
    display: grid; grid-template-columns: 1fr 440px; gap: 64px; align-items: center;
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
  .bcb-chapter-question {
    font-family: var(--font-display), Georgia, serif; font-style: italic;
    font-size: 12px; color: var(--bcb-gold-dim); margin-top: 4px; line-height: 1.5;
  }
  .bcb-chapter-row:hover .bcb-chapter-question { color: var(--bcb-gold); }
  .bcb-chapter-planets { font-size: 11px; color: var(--bcb-cream-mute); margin-top: 3px; }

  /* SAMPLE / SHARED */
  .bcb-sample-chrome {
    background: #0A0A0A; border-bottom: 1px solid rgba(255,255,255,0.05);
    padding: 12px 24px; display: flex; justify-content: space-between; align-items: center;
    font-size: 10px; color: var(--bcb-cream-mute); letter-spacing: 0.1em; text-transform: uppercase;
  }
  .bcb-sample-text { font-size: 16px; line-height: 1.9; color: rgba(240,233,220,0.78); font-weight: 300; }
  .bcb-sample-text p { margin-bottom: 22px; }
  .bcb-sample-footer { padding: 16px 48px 32px; display: flex; align-items: center; justify-content: space-between; gap: 20px; flex-wrap: wrap; }

  /* QUESTION PICKER */
  .bcb-qp-grid {
    display: flex; flex-wrap: wrap; justify-content: center; gap: 10px;
    margin-bottom: 32px;
  }
  .bcb-qp-pill {
    background: rgba(191,151,90,0.06); border: 1px solid rgba(191,151,90,0.18);
    color: rgba(240,233,220,0.7); font-family: var(--font-display), Georgia, serif;
    font-size: 14px; font-style: italic; padding: 12px 22px; border-radius: 100px;
    cursor: pointer; transition: all 0.2s; white-space: nowrap;
  }
  .bcb-qp-pill:hover {
    border-color: var(--bcb-gold); color: var(--bcb-gold); background: rgba(191,151,90,0.1);
  }
  .bcb-qp-active {
    border-color: var(--bcb-gold) !important; color: var(--bcb-gold) !important;
    background: rgba(191,151,90,0.14) !important;
    box-shadow: 0 0 16px rgba(191,151,90,0.12);
  }
  .bcb-qp-reveal {
    background: #0D0D0D; border: 1px solid var(--bcb-border);
    border-radius: 16px; overflow: hidden;
    animation: bcb-qp-in 0.35s ease-out;
  }
  @keyframes bcb-qp-in {
    from { opacity: 0; transform: translateY(12px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .bcb-qp-body { padding: 36px 48px 0; }
  .bcb-qp-lock-fade {
    height: 80px; margin-top: -80px; position: relative;
    background: linear-gradient(transparent, #0D0D0D 80%);
    pointer-events: none;
  }
  .bcb-qp-lock-row {
    display: flex; align-items: center; justify-content: center; gap: 10px;
    padding: 8px 48px 20px; font-size: 13px; color: var(--bcb-cream-mute);
    font-style: italic;
  }
  .bcb-qp-lock-icon { font-size: 14px; }
  .bcb-qp-hint {
    text-align: center; font-size: 13px; color: var(--bcb-cream-mute);
    font-style: italic; padding: 24px 0;
  }

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

  /* NUMBERS BAR */
  .bcb-numbers-bar {
    display: flex; justify-content: center; gap: 48px; flex-wrap: wrap;
    margin-top: 56px; padding: 32px 24px;
    border-top: 1px solid var(--bcb-border); border-bottom: 1px solid var(--bcb-border);
  }
  .bcb-number-item { text-align: center; }
  .bcb-number-big {
    font-family: var(--font-display), Georgia, serif; font-size: 32px; font-weight: 700;
    color: var(--bcb-gold); line-height: 1;
  }
  .bcb-number-label { font-size: 12px; color: var(--bcb-cream-mute); margin-top: 6px; letter-spacing: 0.04em; }

  /* RESPONSIVE */
  @media (max-width: 900px) {
    .bcb-hero-split { grid-template-columns: 1fr; }
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
    .bcb-qp-body { padding: 24px 20px 0; }
    .bcb-qp-lock-row { padding: 8px 20px 20px; }
    .bcb-sample-footer { padding: 16px 20px 24px; flex-direction: column; text-align: center; }
    .bcb-qp-pill { font-size: 13px; padding: 10px 16px; white-space: normal; }
    .bcb-form-row { grid-template-columns: 1fr; }
    .bcb-book-mockup { width: 260px; }
    .bcb-wrap-md { padding: 0 16px; }
  }
`;
