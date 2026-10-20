"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { track } from "@vercel/analytics";
import LocationPicker from "@/components/LocationPicker";
import type { SelectedLocation } from "@/components/LocationPicker";
import {
  COMPAT_PRICE,
  COMPAT_CHECKOUT_URL,
  COMPAT_CHAPTERS,
  COMPAT_DIMENSIONS,
  COMPAT_COMPARE,
  COMPAT_FAQ,
  sunSignFromDate,
  pairLine,
} from "./content";

/* ─── TYPES ─────────────────────────────────────────────────────────── */

interface Person {
  name: string;
  dob: string;
  birth_time: string;
  time_unknown: boolean;
  birth_place: string;
  birth_lat?: number;
  birth_lng?: number;
}

type Step = 0 | 1 | 2;

interface Review {
  id: string;
  rating: number;
  name: string | null;
  testimonial: string | null;
  zodiac_sign: string | null;
}

const EMPTY_PERSON: Person = {
  name: "",
  dob: "",
  birth_time: "",
  time_unknown: false,
  birth_place: "",
};

const DRAFT_KEY = "bc_compat_draft_v1";

/* ─── HELPERS ───────────────────────────────────────────────────────── */

function personError(p: Person, who: "you" | "them"): string {
  const label = who === "you" ? "your" : "their";
  if (!p.name.trim()) return `Add ${label} first name.`;
  if (!p.dob) return `Add ${label} date of birth.`;
  const year = Number(p.dob.slice(0, 4));
  if (year < 1900 || year > new Date().getFullYear()) return `Check ${label} birth year.`;
  if (!p.time_unknown && !p.birth_time) return `Add ${label} birth time, or tick "I don't know".`;
  if (!p.birth_place.trim()) return `Add ${label} city of birth.`;
  return "";
}

function firstName(name: string, fallback: string) {
  return name.trim().split(/\s+/)[0] || fallback;
}

/* ─── PERSON FIELDS ─────────────────────────────────────────────────── */

function PersonFields({
  who,
  person,
  onChange,
}: {
  who: "you" | "them";
  person: Person;
  onChange: (p: Person) => void;
}) {
  const id = (f: string) => `cr-${who}-${f}`;
  const handleLocation = useCallback(
    (loc: SelectedLocation | null, raw: string) => {
      onChange({
        ...person,
        birth_place: loc?.displayName ?? raw,
        birth_lat: loc?.lat,
        birth_lng: loc?.lng,
      });
    },
    [person, onChange]
  );

  return (
    <div className="cr-fields">
      <div className="cr-field">
        <label htmlFor={id("name")}>{who === "you" ? "Your first name" : "Their first name"}</label>
        <input
          id={id("name")}
          className="cr-input"
          type="text"
          autoComplete={who === "you" ? "given-name" : "off"}
          placeholder={who === "you" ? "e.g. Maya" : "e.g. Dev"}
          value={person.name}
          onChange={(e) => onChange({ ...person, name: e.target.value })}
        />
      </div>
      <div className="cr-row">
        <div className="cr-field">
          <label htmlFor={id("dob")}>Date of birth</label>
          <input
            id={id("dob")}
            className="cr-input"
            type="date"
            min="1900-01-01"
            max={new Date().toISOString().slice(0, 10)}
            value={person.dob}
            onChange={(e) => onChange({ ...person, dob: e.target.value })}
          />
        </div>
        <div className="cr-field">
          <label htmlFor={id("time")}>Birth time</label>
          <input
            id={id("time")}
            className="cr-input"
            type="time"
            disabled={person.time_unknown}
            value={person.time_unknown ? "" : person.birth_time}
            onChange={(e) => onChange({ ...person, birth_time: e.target.value })}
          />
        </div>
      </div>
      <label className="cr-check">
        <input
          type="checkbox"
          checked={person.time_unknown}
          onChange={(e) => onChange({ ...person, time_unknown: e.target.checked })}
        />
        <span>I don&apos;t know {who === "you" ? "my" : "their"} birth time</span>
      </label>
      <div className="cr-field">
        <label>City of birth</label>
        <LocationPicker
          value={person.birth_place}
          onChange={handleLocation}
          placeholder="Start typing a city…"
        />
      </div>
    </div>
  );
}

/* ─── FORM CARD ─────────────────────────────────────────────────────── */

function ReadingForm({ formRef }: { formRef: React.RefObject<HTMLDivElement | null> }) {
  const [step, setStep] = useState<Step>(0);
  const [you, setYou] = useState<Person>(EMPTY_PERSON);
  const [them, setThem] = useState<Person>(EMPTY_PERSON);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const restored = useRef(false);

  // Restore an unfinished draft so a returning visitor doesn't retype everything.
  // Deferred a tick so the first client render matches the server HTML.
  useEffect(() => {
    const t = setTimeout(() => {
      try {
        const raw = localStorage.getItem(DRAFT_KEY);
        if (raw) {
          const d = JSON.parse(raw);
          if (d.you) setYou({ ...EMPTY_PERSON, ...d.you });
          if (d.them) setThem({ ...EMPTY_PERSON, ...d.them });
          if (typeof d.email === "string") setEmail(d.email);
        }
      } catch {
        /* storage unavailable */
      }
      restored.current = true;
    }, 0);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!restored.current) return;
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify({ you, them, email }));
    } catch {
      /* storage unavailable */
    }
  }, [you, them, email]);

  const goTo = (next: Step) => {
    setError("");
    setStep(next);
    track("compat_step", { step: next });
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const next = () => {
    const err = step === 0 ? personError(you, "you") : personError(them, "them");
    if (err) return setError(err);
    goTo((step + 1) as Step);
  };

  const pay = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const err = personError(you, "you") || personError(them, "them");
    if (err) return setError(err);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return setError("Add the email where we should send your reading.");
    }

    track("compat_pay_click");
    setSubmitting(true);

    // Checkout isn't connected yet. Once the Gumroad link is set
    // (NEXT_PUBLIC_COMPAT_CHECKOUT_URL), save both people's details as a pending
    // lead here and redirect to the checkout URL with the session id.
    if (!COMPAT_CHECKOUT_URL) {
      setSubmitting(false);
      setError(
        "Checkout for this reading isn't open just yet. We're switching it on very soon. Your details are saved on this device, so you won't need to retype them."
      );
      return;
    }

    setSubmitting(false);
    setError("Something went wrong opening checkout. Please try again in a moment.");
  };

  const s1 = sunSignFromDate(you.dob);
  const s2 = sunSignFromDate(them.dob);
  const n1 = firstName(you.name, "You");
  const n2 = firstName(them.name, "Them");

  return (
    <div className="cr-card" ref={formRef} id="start">
      <div className="cr-card-head">
        <div className="cr-card-title">
          {step === 0 && "Start with you"}
          {step === 1 && "Now, them"}
          {step === 2 && "Where should we send it?"}
        </div>
        <ol className="cr-steps" aria-label="Progress">
          {["You", "Them", "Send"].map((label, i) => (
            <li
              key={label}
              className={i === step ? "on" : i < step ? "done" : ""}
              aria-current={i === step ? "step" : undefined}
            >
              <span>{i < step ? "✓" : i + 1}</span>
              {label}
            </li>
          ))}
        </ol>
      </div>

      {step === 0 && <PersonFields who="you" person={you} onChange={setYou} />}
      {step === 1 && <PersonFields who="them" person={them} onChange={setThem} />}

      {step === 2 && (
        <form onSubmit={pay} className="cr-fields" noValidate>
          <div className="cr-pair">
            <div className="cr-pair-names">
              <span>{n1}</span>
              <span className="cr-pair-x">×</span>
              <span>{n2}</span>
            </div>
            {s1 && s2 && (
              <>
                <div className="cr-pair-signs">
                  {s1.name} Sun · {s2.name} Sun
                </div>
                <p className="cr-pair-line">&ldquo;{pairLine(s1.el, s2.el)}&rdquo;</p>
                <p className="cr-pair-note">
                  That&apos;s just your Sun signs. Your reading compares both full charts: Moon, Venus,
                  Mars, Mercury, Saturn, Chiron and more.
                </p>
              </>
            )}
          </div>

          <div className="cr-field">
            <label htmlFor="cr-email">Your email</label>
            <input
              id="cr-email"
              className="cr-input"
              type="email"
              autoComplete="email"
              inputMode="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <span className="cr-hint">Your reading link goes here. Only you get it.</span>
          </div>

          {error && <div className="cr-error" role="alert">{error}</div>}

          <button type="submit" className="cr-btn cr-btn-gold cr-btn-full" disabled={submitting}>
            {submitting ? "Opening checkout…" : `Get our reading · $${COMPAT_PRICE}`}
          </button>
          <div className="cr-assure">
            <span>🔒 Secure checkout via Gumroad</span>
            <span>⚡ Ready in minutes</span>
            <span>No subscription</span>
          </div>
          <button type="button" className="cr-back" onClick={() => goTo(1)}>
            ← Edit details
          </button>
        </form>
      )}

      {step < 2 && (
        <>
          {error && <div className="cr-error" role="alert">{error}</div>}
          <div className="cr-nav">
            {step === 1 && (
              <button type="button" className="cr-back" onClick={() => goTo(0)}>
                ← Back
              </button>
            )}
            <button type="button" className="cr-btn cr-btn-gold cr-btn-grow" onClick={next}>
              {step === 0 ? "Next: their details →" : "Next: last step →"}
            </button>
          </div>
          <p className="cr-card-foot">
            {step === 0
              ? "Takes about 60 seconds. They don't need to know, and they won't be contacted."
              : "No birth time? Tick the box. We'll still map everything that doesn't depend on the hour."}
          </p>
        </>
      )}
    </div>
  );
}

/* ─── FAQ ITEM ──────────────────────────────────────────────────────── */

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`cr-faq-item ${open ? "open" : ""}`}>
      <button className="cr-faq-q" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
        {q}
        <span className="cr-faq-plus" aria-hidden>+</span>
      </button>
      {open && <div className="cr-faq-a">{a}</div>}
    </div>
  );
}

/* ─── REVIEWS (real, from /api/reviews; hidden until there are some) ── */

function Reviews() {
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    fetch("/api/reviews?product=compatibility&limit=12")
      .then((r) => (r.ok ? r.json() : { reviews: [] }))
      .then((d) =>
        setReviews(
          ((d.reviews ?? []) as Review[]).filter((r) => r.rating >= 4 && r.testimonial?.trim()).slice(0, 6)
        )
      )
      .catch(() => {});
  }, []);

  if (reviews.length < 2) return null;

  return (
    <section className="cr-section">
      <div className="cr-wrap">
        <p className="cr-eyebrow">From couples who&apos;ve read theirs</p>
        <h2 className="cr-h2">What people said after reading it</h2>
        <div className="cr-reviews">
          {reviews.map((r) => (
            <figure key={r.id} className="cr-review">
              <div className="cr-stars" aria-label={`${r.rating} out of 5`}>
                {"★".repeat(r.rating)}
              </div>
              <blockquote>&ldquo;{r.testimonial}&rdquo;</blockquote>
              <figcaption>
                {r.name || "Verified buyer"}
                {r.zodiac_sign && <span> · {r.zodiac_sign[0].toUpperCase() + r.zodiac_sign.slice(1)}</span>}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── PAGE ──────────────────────────────────────────────────────────── */

export default function CompatibilityClient() {
  const formRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const [showSticky, setShowSticky] = useState(false);

  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setShowSticky(!entry.isIntersecting), {
      threshold: 0,
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const toForm = useCallback(() => {
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    setTimeout(() => {
      formRef.current?.querySelector<HTMLInputElement>("input")?.focus({ preventScroll: true });
    }, 450);
  }, []);

  return (
    <div className="cr">
      <style>{styles}</style>

      {/* NAV */}
      <nav className="cr-topnav">
        <Link href="/" className="cr-logo">BluntChart</Link>
        <button className="cr-nav-cta" onClick={toForm}>
          Start · ${COMPAT_PRICE}
        </button>
      </nav>

      {/* HERO */}
      <header className="cr-hero" ref={heroRef}>
        <div className="cr-hero-glow" aria-hidden />
        <div className="cr-hero-grid">
          <div className="cr-hero-top">
            <p className="cr-eyebrow">Compatibility Reading · from both birth charts</p>
            <h1 className="cr-h1">
              What&apos;s actually going on <em>between you two.</em>
            </h1>
            <p className="cr-sub">
              The pull, the fight you keep having, and what this connection is asking of both of you.
              <span className="cr-sub-more"> Written to you both by name, from your real charts.</span>{" "}
              Ready in minutes.
            </p>
          </div>

          <ReadingForm formRef={formRef} />

          <div className="cr-hero-bottom">
            <ul className="cr-ticks">
              <li>7 chapters · about 2,000 words, just about you two</li>
              <li>The chemistry <strong>and</strong> the friction, said plainly</li>
              <li>Works for a partner, crush, situationship or ex</li>
            </ul>
            <div className="cr-price-line">
              <strong>${COMPAT_PRICE}</strong> one-time · no subscription · no account
            </div>
          </div>
        </div>
      </header>

      {/* TRUST STRIP */}
      <div className="cr-strip">
        <div className="cr-strip-inner">
          <span>✦ Exact planetary positions for both of you</span>
          <span>✦ Every claim traced to a real aspect</span>
          <span>✦ Emailed link, read on any phone</span>
          <span>✦ Something wrong? We fix it</span>
        </div>
      </div>

      {/* RECOGNITION */}
      <section className="cr-section">
        <div className="cr-wrap cr-narrow">
          <p className="cr-eyebrow">If you&apos;re here, you&apos;ve probably thought one of these</p>
          <div className="cr-thoughts">
            <p>&ldquo;Why do we keep having the <em>same</em> fight?&rdquo;</p>
            <p>&ldquo;Are we actually compatible, or just used to each other?&rdquo;</p>
            <p>&ldquo;Why do I always feel like the one who cares more?&rdquo;</p>
            <p>&ldquo;Is this worth it, or am I ignoring something obvious?&rdquo;</p>
          </div>
          <p className="cr-lead">
            A Sun-sign chart can&apos;t answer those. Two full birth charts can. This reading lays them
            side by side and tells you, in plain words, what&apos;s happening between you, including the
            parts nobody&apos;s said out loud yet.
          </p>
        </div>
      </section>

      {/* WHAT'S INSIDE */}
      <section className="cr-section cr-alt" id="inside">
        <div className="cr-wrap">
          <p className="cr-eyebrow">What&apos;s inside</p>
          <h2 className="cr-h2">7 chapters about the two of you</h2>
          <p className="cr-section-sub">
            Opens with the dynamic neither of you has named. Closes with the honest bottom line.
          </p>
          <ol className="cr-chapters">
            {COMPAT_CHAPTERS.map((c) => (
              <li key={c.n} className="cr-chapter">
                <span className="cr-chapter-n">{c.n}</span>
                <div>
                  <h3>{c.title}</h3>
                  <p>{c.line}</p>
                  <span className="cr-chapter-planets">{c.planets}</span>
                </div>
              </li>
            ))}
          </ol>
          <div className="cr-center">
            <button className="cr-btn cr-btn-gold" onClick={toForm}>
              Get our reading · ${COMPAT_PRICE}
            </button>
          </div>
        </div>
      </section>

      {/* SAMPLE */}
      <section className="cr-section">
        <div className="cr-wrap cr-sample-grid">
          <div>
            <p className="cr-eyebrow">Read a sample</p>
            <h2 className="cr-h2">This is how it actually reads</h2>
            <p className="cr-lead">
              Short lines. Both names. The specific moment, not a vague trait. And the astrology
              explained after the feeling lands, so it makes sense even if you&apos;ve never looked at a
              chart.
            </p>
            <p className="cr-small">
              Excerpt from a demo reading for two sample charts. Yours is written from scratch for your
              two charts.
            </p>
          </div>
          <article className="cr-paper" aria-label="Sample excerpt">
            <div className="cr-paper-tag">Chapter 04 · The Fight You Keep Having</div>
            <p className="cr-paper-names">Maya × Dev</p>
            <p>It starts with something small. Dev says &ldquo;we&apos;ll see&rdquo; about the weekend.</p>
            <p>
              Maya hears &ldquo;you&apos;re not a priority.&rdquo; Dev meant exactly that: no idea
              yet.
            </p>
            <p className="cr-paper-quote">
              &ldquo;Why can&apos;t Dev just commit to one thing?&rdquo;
              <br />
              &ldquo;Why does everything have to be decided right now?&rdquo;
            </p>
            <p>
              Listen. Neither of you is wrong. Maya&apos;s Mars squares Dev&apos;s Sun, so her need to
              act lands on him as pressure, and his need for room lands on her as distance.
            </p>
            <p className="cr-paper-fade">
              The fight is never about the weekend. It&apos;s about who gets to set the pace. And the
              way out is…
            </p>
          </article>
        </div>
      </section>

      {/* METHOD */}
      <section className="cr-section cr-alt">
        <div className="cr-wrap">
          <p className="cr-eyebrow">How it&apos;s built</p>
          <h2 className="cr-h2">Real charts, not Sun-sign guesswork</h2>
          <p className="cr-section-sub">
            We calculate both natal charts from exact dates, times and places, then measure how your
            planets hit each other. The reading is written only from what&apos;s actually there.
          </p>
          <div className="cr-dims">
            {COMPAT_DIMENSIONS.map((d) => (
              <div key={d.label} className="cr-dim">
                <span className="cr-dim-label">{d.label}</span>
                <span className="cr-dim-pair">{d.pair}</span>
              </div>
            ))}
            <div className="cr-dim cr-dim-plus">
              <span className="cr-dim-label">+ Mercury, Chiron, Saturn, North Node</span>
              <span className="cr-dim-pair">and today&apos;s transits</span>
            </div>
          </div>
        </div>
      </section>

      {/* COMPARISON */}
      <section className="cr-section">
        <div className="cr-wrap">
          <p className="cr-eyebrow">Why this one</p>
          <h2 className="cr-h2">How it compares</h2>
          <div className="cr-table-wrap">
            <table className="cr-table">
              <thead>
                <tr>
                  <th />
                  {COMPAT_COMPARE.columns.map((c, i) => (
                    <th key={c} className={i === 2 ? "us" : ""}>{c}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMPAT_COMPARE.rows.map((r) => (
                  <tr key={r.label}>
                    <th scope="row">{r.label}</th>
                    {r.values.map((v, i) => (
                      <td key={i} className={i === 2 ? "us" : ""}>{v}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="cr-section cr-alt">
        <div className="cr-wrap">
          <p className="cr-eyebrow">How it works</p>
          <h2 className="cr-h2">Three steps, about a minute</h2>
          <div className="cr-how">
            <div>
              <span>1</span>
              <h3>Add both birth details</h3>
              <p>Name, date, time and city for each of you. Unknown birth time is fine.</p>
            </div>
            <div>
              <span>2</span>
              <h3>Check out securely</h3>
              <p>One payment of ${COMPAT_PRICE} through Gumroad. No account, no subscription.</p>
            </div>
            <div>
              <span>3</span>
              <h3>Read it in minutes</h3>
              <p>Your private link is emailed to you. Read it on your phone, come back anytime.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FOUNDER */}
      <section className="cr-section">
        <div className="cr-wrap cr-narrow">
          <div className="cr-founder">
            <Image
              src="/founder.jpeg"
              alt="Ishika, founder of BluntChart"
              width={88}
              height={88}
              className="cr-founder-img"
            />
            <div>
              <p className="cr-founder-text">
                &ldquo;I built BluntChart because most astrology tells you what you want to hear. This
                reading won&apos;t. It will show you what&apos;s genuinely good between you and what keeps
                going wrong, in words you can actually use in your next conversation.&rdquo;
              </p>
              <p className="cr-founder-name">
                Ishika, founder · <Link href="/founder">Why I built this</Link>
              </p>
            </div>
          </div>
        </div>
      </section>

      <Reviews />

      {/* FAQ */}
      <section className="cr-section cr-alt">
        <div className="cr-wrap cr-narrow">
          <p className="cr-eyebrow">Questions</p>
          <h2 className="cr-h2">Before you start</h2>
          <div className="cr-faq">
            {COMPAT_FAQ.map((f) => (
              <FaqItem key={f.q} q={f.q} a={f.a} />
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="cr-section cr-final">
        <div className="cr-wrap cr-narrow cr-center">
          <h2 className="cr-h2">You already feel it. Now see why.</h2>
          <p className="cr-lead">Two birth charts, one honest reading. Ready in minutes.</p>
          <button className="cr-btn cr-btn-gold" onClick={toForm}>
            Start our reading · ${COMPAT_PRICE}
          </button>
          <p className="cr-small">
            Questions? Read our <Link href="/refunds">delivery &amp; refund policy</Link>.
          </p>
        </div>
      </section>

      {/* STICKY MOBILE CTA */}
      <div className={`cr-sticky ${showSticky ? "show" : ""}`} aria-hidden={!showSticky}>
        <div>
          <strong>Compatibility Reading</strong>
          <span>${COMPAT_PRICE} · ready in minutes</span>
        </div>
        <button className="cr-btn cr-btn-gold" onClick={toForm} tabIndex={showSticky ? 0 : -1}>
          Start →
        </button>
      </div>
    </div>
  );
}

/* ─── STYLES ────────────────────────────────────────────────────────── */

const styles = `
.cr {
  --bg: #09090f;
  --bg-alt: #0e0e17;
  --card: #12121c;
  --line: rgba(255,255,255,0.08);
  --text: #e8e4f0;
  --muted: rgba(232,228,240,0.62);
  --faint: rgba(232,228,240,0.42);
  --gold: #f0b84a;
  --gold-ink: #1a1305;
  --rose: #e88fae;
  position: relative;
  background: var(--bg);
  color: var(--text);
  overflow-x: hidden;
  font-family: var(--font-body), system-ui, sans-serif;
}
.cr a { color: var(--gold); }
.cr em { font-style: italic; }

/* nav */
.cr-topnav {
  position: relative; z-index: 2;
  display: flex; align-items: center; justify-content: space-between;
  max-width: 1120px; margin: 0 auto; padding: 16px 16px;
}
.cr-logo { font-family: var(--font-display); font-weight: 700; font-size: 20px; color: var(--text) !important; text-decoration: none; }
.cr-nav-cta {
  background: transparent; color: var(--gold); border: 1px solid rgba(240,184,74,0.45);
  border-radius: 999px; padding: 8px 14px; font-size: 13px; font-weight: 600; cursor: pointer;
}
.cr-nav-cta:hover { background: rgba(240,184,74,0.08); }

/* hero */
.cr-hero { position: relative; padding: 8px 16px 48px; }
.cr-hero-glow {
  position: absolute; inset: -120px 0 auto 0; height: 620px; pointer-events: none;
  background:
    radial-gradient(420px 300px at 22% 30%, rgba(232,143,174,0.14), transparent 70%),
    radial-gradient(480px 340px at 78% 35%, rgba(240,184,74,0.10), transparent 70%);
}
.cr-hero-grid {
  position: relative; max-width: 1120px; margin: 0 auto;
  display: grid; gap: 20px; grid-template-columns: 1fr;
}
.cr-eyebrow {
  font-size: 11px; font-weight: 700; letter-spacing: .14em; text-transform: uppercase;
  color: var(--gold); margin: 0 0 12px;
}
.cr-h1 {
  font-family: var(--font-display); font-weight: 700; line-height: 1.05;
  font-size: clamp(34px, 8.4vw, 60px); margin: 0 0 14px; letter-spacing: -0.01em;
}
.cr-h1 em { color: var(--rose); }
.cr-sub { font-size: 16px; line-height: 1.55; color: var(--muted); margin: 0; max-width: 34em; }
.cr-sub-more { display: none; }
.cr-ticks { list-style: none; padding: 0; margin: 0 0 18px; display: grid; gap: 8px; }
.cr-ticks li { position: relative; padding-left: 26px; font-size: 15px; line-height: 1.45; }
.cr-ticks li::before {
  content: "✓"; position: absolute; left: 0; top: 0; color: var(--gold); font-weight: 700;
}
.cr-price-line { font-size: 14px; color: var(--muted); }
.cr-price-line strong { color: var(--text); font-size: 18px; margin-right: 4px; }

/* card / form */
.cr-card {
  background: var(--card); border: 1px solid var(--line); border-radius: 18px;
  padding: 20px 16px; box-shadow: 0 24px 80px rgba(0,0,0,0.45);
  scroll-margin-top: 16px; align-self: start;
}
.cr-card-head { display: flex; flex-direction: column; gap: 12px; margin-bottom: 16px; }
.cr-card-title { font-family: var(--font-display); font-size: 22px; font-weight: 700; }
.cr-steps { list-style: none; display: flex; gap: 6px; margin: 0; padding: 0; }
.cr-steps li {
  flex: 1; display: flex; align-items: center; gap: 6px; font-size: 12px; color: var(--faint);
  padding-top: 8px; border-top: 2px solid var(--line);
}
.cr-steps li span {
  display: inline-grid; place-items: center; width: 18px; height: 18px; border-radius: 50%;
  font-size: 10px; border: 1px solid var(--line);
}
.cr-steps li.on { color: var(--text); border-top-color: var(--gold); }
.cr-steps li.on span { background: var(--gold); color: var(--gold-ink); border-color: var(--gold); font-weight: 700; }
.cr-steps li.done { color: var(--muted); border-top-color: rgba(240,184,74,0.45); }
.cr-steps li.done span { color: var(--gold); border-color: rgba(240,184,74,0.45); }

.cr-fields { display: grid; gap: 14px; }
.cr-row { display: grid; grid-template-columns: 1.15fr 1fr; gap: 10px; }
.cr-field { display: grid; gap: 6px; min-width: 0; }
.cr-field label { font-size: 13px; font-weight: 600; color: var(--muted); }
.cr-input {
  width: 100%; min-width: 0; background: rgba(255,255,255,0.04); border: 0.5px solid rgba(255,255,255,0.1);
  border-radius: 10px; padding: 12px 13px; font-size: 16px; color: var(--text); font-family: inherit;
  outline: none; color-scheme: dark;
}
.cr-input:focus { border-color: rgba(240,184,74,0.6); }
.cr-input:disabled { opacity: .35; }
.cr-check { display: flex; align-items: center; gap: 8px; font-size: 13px; color: var(--muted); cursor: pointer; margin-top: -4px; }
.cr-check input { width: 16px; height: 16px; accent-color: var(--gold); }
.cr-hint { font-size: 12px; color: var(--faint); }

.cr-nav { display: flex; gap: 10px; align-items: center; margin-top: 16px; }
.cr-back {
  background: none; border: 0; color: var(--muted); font-size: 14px; cursor: pointer; padding: 10px 4px;
}
.cr-back:hover { color: var(--text); }
.cr-card-foot { font-size: 12px; color: var(--faint); margin: 12px 0 0; line-height: 1.5; }
.cr-error {
  margin-top: 4px; padding: 11px 13px; border-radius: 10px; font-size: 14px; line-height: 1.45;
  background: rgba(232,95,95,0.1); border: 1px solid rgba(232,95,95,0.35); color: #f3b0b0;
}
.cr-assure { display: flex; flex-wrap: wrap; justify-content: center; gap: 6px 14px; font-size: 12px; color: var(--faint); }

.cr-pair {
  border: 1px solid rgba(232,143,174,0.25); background: rgba(232,143,174,0.05);
  border-radius: 14px; padding: 14px; text-align: center;
}
.cr-pair-names { font-family: var(--font-display); font-size: 24px; font-weight: 700; display: flex; justify-content: center; gap: 10px; flex-wrap: wrap; }
.cr-pair-x { color: var(--rose); }
.cr-pair-signs { font-size: 12px; color: var(--gold); letter-spacing: .08em; text-transform: uppercase; margin-top: 4px; }
.cr-pair-line { font-size: 15px; line-height: 1.5; margin: 10px 0 6px; }
.cr-pair-note { font-size: 12px; color: var(--faint); margin: 0; line-height: 1.45; }

/* buttons */
.cr-btn {
  border: 0; border-radius: 12px; padding: 14px 20px; font-size: 16px; font-weight: 700;
  cursor: pointer; font-family: inherit; transition: transform .15s, filter .15s;
}
.cr-btn:active { transform: translateY(1px); }
.cr-btn:disabled { opacity: .6; cursor: progress; }
.cr-btn-gold { background: var(--gold); color: var(--gold-ink); }
.cr-btn-gold:hover { filter: brightness(1.07); }
.cr-btn-full { width: 100%; }
.cr-btn-grow { flex: 1; }

/* strip */
.cr-strip { border-top: 1px solid var(--line); border-bottom: 1px solid var(--line); background: var(--bg-alt); }
.cr-strip-inner {
  max-width: 1120px; margin: 0 auto; padding: 14px 16px;
  display: grid; grid-template-columns: 1fr 1fr; gap: 10px 16px; font-size: 13px; color: var(--muted);
}

/* sections */
.cr-section { padding: 64px 16px; }
.cr-alt { background: var(--bg-alt); }
.cr-wrap { max-width: 1120px; margin: 0 auto; }
.cr-narrow { max-width: 720px; }
.cr-center { text-align: center; }
.cr-h2 { font-family: var(--font-display); font-weight: 700; font-size: clamp(28px, 6vw, 40px); line-height: 1.12; margin: 0 0 12px; }
.cr-section-sub { color: var(--muted); font-size: 16px; line-height: 1.55; margin: 0 0 28px; max-width: 40em; }
.cr-lead { font-size: 17px; line-height: 1.6; color: var(--muted); }
.cr-small { font-size: 13px; color: var(--faint); line-height: 1.5; }

.cr-thoughts { display: grid; gap: 10px; margin: 8px 0 24px; }
.cr-thoughts p {
  margin: 0; font-family: var(--font-display); font-size: clamp(20px, 4.6vw, 26px); line-height: 1.3;
  padding-left: 16px; border-left: 2px solid rgba(232,143,174,0.45);
}
.cr-thoughts em { color: var(--rose); }

.cr-chapters { list-style: none; padding: 0; margin: 0 0 32px; display: grid; gap: 12px; grid-template-columns: 1fr; }
.cr-chapter {
  display: flex; gap: 14px; padding: 18px; border: 1px solid var(--line); border-radius: 14px; background: var(--card);
}
.cr-chapter-n { font-family: var(--font-display); font-size: 22px; color: var(--gold); line-height: 1; min-width: 30px; }
.cr-chapter h3 { margin: 0 0 6px; font-size: 17px; font-weight: 700; }
.cr-chapter p { margin: 0 0 8px; font-size: 15px; line-height: 1.5; color: var(--muted); }
.cr-chapter-planets { font-size: 11px; letter-spacing: .08em; text-transform: uppercase; color: var(--faint); }

.cr-sample-grid { display: grid; gap: 32px; align-items: center; }
.cr-paper {
  position: relative; background: #f6f1e7; color: #2a2433; border-radius: 16px; padding: 28px 22px;
  box-shadow: 0 30px 80px rgba(0,0,0,0.5); font-size: 16px; line-height: 1.6;
}
.cr-paper p { margin: 0 0 12px; }
.cr-paper-tag { font-size: 11px; letter-spacing: .12em; text-transform: uppercase; color: #9a6b1f; font-weight: 700; margin-bottom: 6px; }
.cr-paper-names { font-family: var(--font-display); font-size: 26px; font-weight: 700; margin-bottom: 14px !important; }
.cr-paper-quote { font-style: italic; color: #7a3a55; padding-left: 12px; border-left: 2px solid #e2a6bd; }
.cr-paper-fade {
  -webkit-mask-image: linear-gradient(#000 20%, transparent);
  mask-image: linear-gradient(#000 20%, transparent); margin-bottom: 0 !important;
}

.cr-dims { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.cr-dim { padding: 14px; border: 1px solid var(--line); border-radius: 12px; background: var(--card); display: grid; gap: 4px; }
.cr-dim-label { font-weight: 700; font-size: 15px; }
.cr-dim-pair { font-size: 12px; color: var(--gold); letter-spacing: .04em; }
.cr-dim-plus { grid-column: 1 / -1; border-style: dashed; }

.cr-table-wrap { overflow-x: auto; border: 1px solid var(--line); border-radius: 14px; -webkit-overflow-scrolling: touch; }
.cr-table { width: 100%; min-width: 560px; border-collapse: collapse; font-size: 14px; }
.cr-table th, .cr-table td { padding: 13px 14px; text-align: left; border-bottom: 1px solid var(--line); vertical-align: top; }
.cr-table thead th { font-size: 12px; text-transform: uppercase; letter-spacing: .08em; color: var(--faint); }
.cr-table tbody th { font-weight: 600; color: var(--text); }
.cr-table td { color: var(--muted); }
.cr-table .us { background: rgba(240,184,74,0.07); color: var(--text); font-weight: 600; }
.cr-table thead .us { color: var(--gold); }
.cr-table tr:last-child th, .cr-table tr:last-child td { border-bottom: 0; }

.cr-how { display: grid; gap: 14px; }
.cr-how > div { padding: 20px; border: 1px solid var(--line); border-radius: 14px; background: var(--card); }
.cr-how span {
  display: inline-grid; place-items: center; width: 30px; height: 30px; border-radius: 50%;
  background: rgba(240,184,74,0.12); color: var(--gold); font-weight: 700; margin-bottom: 10px;
}
.cr-how h3 { margin: 0 0 6px; font-size: 17px; }
.cr-how p { margin: 0; color: var(--muted); font-size: 15px; line-height: 1.5; }

.cr-founder { display: flex; gap: 18px; align-items: flex-start; padding: 22px; border: 1px solid var(--line); border-radius: 16px; background: var(--card); }
.cr-founder-img { border-radius: 50%; object-fit: cover; flex-shrink: 0; width: 64px; height: 64px; }
.cr-founder-text { margin: 0 0 10px; font-size: 16px; line-height: 1.6; }
.cr-founder-name { margin: 0; font-size: 13px; color: var(--muted); }

.cr-reviews { display: grid; gap: 14px; margin-top: 24px; }
.cr-review { margin: 0; padding: 20px; border: 1px solid var(--line); border-radius: 14px; background: var(--card); }
.cr-stars { color: var(--gold); letter-spacing: 2px; margin-bottom: 8px; }
.cr-review blockquote { margin: 0 0 10px; font-size: 15px; line-height: 1.55; }
.cr-review figcaption { font-size: 13px; color: var(--faint); }

.cr-faq { border-top: 1px solid var(--line); margin-top: 20px; }
.cr-faq-item { border-bottom: 1px solid var(--line); }
.cr-faq-q {
  width: 100%; display: flex; justify-content: space-between; gap: 16px; align-items: center; text-align: left;
  background: none; border: 0; color: var(--text); font-size: 16px; font-weight: 600; padding: 18px 0; cursor: pointer; font-family: inherit;
}
.cr-faq-plus { color: var(--gold); font-size: 22px; transition: transform .2s; }
.cr-faq-item.open .cr-faq-plus { transform: rotate(45deg); }
.cr-faq-a { padding: 0 0 18px; color: var(--muted); line-height: 1.6; font-size: 15px; }

.cr-final { background: radial-gradient(600px 300px at 50% 0%, rgba(232,143,174,0.10), transparent 70%); padding-bottom: 120px; }

.cr-sticky {
  position: fixed; left: 0; right: 0; bottom: 0; z-index: 40;
  display: flex; align-items: center; justify-content: space-between; gap: 12px;
  padding: 12px 16px calc(12px + env(safe-area-inset-bottom));
  background: rgba(14,14,23,0.94); backdrop-filter: blur(10px); border-top: 1px solid var(--line);
  transform: translateY(calc(100% + 32px)); visibility: hidden;
  transition: transform .25s ease, visibility 0s linear .25s;
}
.cr-sticky.show { transform: translateY(0); visibility: visible; transition: transform .25s ease; }
.cr-sticky div { display: grid; font-size: 13px; }
.cr-sticky span { color: var(--muted); font-size: 12px; }
.cr-sticky .cr-btn { padding: 11px 18px; font-size: 15px; }

@media (min-width: 640px) {
  .cr-strip-inner { grid-template-columns: repeat(4, auto); justify-content: space-between; }
  .cr-chapters { grid-template-columns: 1fr 1fr; }
  .cr-dims { grid-template-columns: repeat(4, 1fr); }
  .cr-how { grid-template-columns: repeat(3, 1fr); }
  .cr-reviews { grid-template-columns: repeat(2, 1fr); }
  .cr-card { padding: 24px; }
  .cr-founder-img { width: 88px; height: 88px; }
  .cr-paper { padding: 36px 34px; }
}
@media (min-width: 960px) {
  .cr-topnav { padding: 20px 24px; }
  .cr-hero { padding: 24px 24px 72px; }
  .cr-hero-grid {
    grid-template-columns: 1.05fr 0.95fr; column-gap: 56px; row-gap: 22px;
    grid-template-areas: "top form" "bottom form"; grid-template-rows: auto 1fr;
  }
  .cr-hero-top { grid-area: top; align-self: end; }
  .cr-hero-bottom { grid-area: bottom; }
  .cr-hero-grid > .cr-card { grid-area: form; align-self: center; }
  .cr-sub { font-size: 17px; }
  .cr-sub-more { display: inline; }
  .cr-section { padding: 88px 24px; }
  .cr-sample-grid { grid-template-columns: 0.9fr 1.1fr; gap: 56px; }
  .cr-reviews { grid-template-columns: repeat(3, 1fr); }
  .cr-sticky { left: auto; right: 24px; bottom: 24px; border: 1px solid var(--line); border-radius: 16px; width: 360px; padding: 12px 14px; }
}
@media (prefers-reduced-motion: reduce) {
  .cr-sticky, .cr-faq-plus, .cr-btn { transition: none; }
}
`;
