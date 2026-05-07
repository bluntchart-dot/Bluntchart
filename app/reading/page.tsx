"use client";

import Image from "next/image";
import { FormEvent, useEffect, useState } from "react";

const WAITLIST_URL =
  process.env.NEXT_PUBLIC_WAITLIST_WEBHOOK_URL ||
  "https://script.google.com/macros/s/AKfycbzJu0oofuXLpwJ1nsBH9aBl-5htJCNMQUPHWkydRzwQZM3tg1yfx4kQ1Ni1PWGRwJXSZg/exec";

const LAUNCH_DISCOUNT = "50%";

const READING_STEPS = [
  {
    step: "01",
    title: "Chart snapshot",
    body: "Your Sun, Moon, Rising, and the key placements that shape how you come across, what you need, and what keeps repeating.",
  },
  {
    step: "02",
    title: "Blunt reading",
    body: "Around 1,000 words in simple language with 3 question-led sections, deep pattern explanation, and a one-month-ahead line.",
  },
  {
    step: "03",
    title: "Share card",
    body: "A personalized identity card with your name, a punchy 2–4 line truth, and BluntChart branding at the end.",
  },
];

const OFFERINGS = [
  {
    badge: "Core product",
    title: "Full Birth Chart Reading",
    desc: "12 brutal insights across your planets, houses, and key life areas. Sun, Moon, Rising, Venus, Mars, Saturn, 12th house shadow — all of it.",
    price: "$12",
    featured: true,
  },
  {
    badge: "Add-on",
    title: "Compatibility Reading",
    desc: "You + a partner, friend, or situationship. Brutally honest about the real tension points and why the same fight keeps happening.",
    price: "$9",
    featured: false,
  },
  {
    badge: "Seasonal",
    title: "Year Ahead Reading",
    desc: "What your chart says about the next 12 months — love, money, career, and the major turning points.",
    price: "$18",
    featured: false,
  },
  {
    badge: "Gift market",
    title: "Gift a Reading",
    desc: "Buy for someone else — birthday, bachelorette, or just because. Delivered with a gift message.",
    price: "$12",
    featured: false,
  },
  {
    badge: "Opt-in later",
    title: "Monthly Transit Update",
    desc: "A recurring monthly update after purchase. Useful as a follow-up, but not the main product.",
    price: "$4.99/mo",
    featured: false,
  },
];

const REVIEWS = [
  {
    quote:
      "Way more accurate than Co-Star ever was. And it didn't sugarcoat the parts I wasn't ready to hear, which is the whole point.",
    name: "Sophie K.",
    meta: "Aries Sun, Pisces Moon",
    init: "S",
  },
  {
    quote:
      "I felt attacked. In a good way. My therapist has been saying the same thing for six months. My birth chart said it better in one paragraph.",
    name: "Dani L.",
    meta: "Capricorn Sun, Gemini Moon",
    init: "D",
  },
  {
    quote:
      "Finally astrology that doesn't sound like it was written for everyone and no one at the same time. Sent it to three friends immediately.",
    name: "Zara O.",
    meta: "Leo Sun, Scorpio Rising",
    init: "Z",
  },
  {
    quote:
      "I was ready to roll my eyes. Three paragraphs in I had to put my phone down. It just described me.",
    name: "Priya T.",
    meta: "Virgo Rising, Libra Sun",
    init: "P",
  },
  {
    quote:
      "This knew patterns I never told anyone. It was uncomfortable. I loved it.",
    name: "Maya R.",
    meta: "Scorpio Sun, Cancer Moon",
    init: "M",
  },
  {
    quote:
      "Twelve dollars felt cheap after I read the full thing. I kept thinking, how does this know me like that?",
    name: "Chloe M.",
    meta: "Sagittarius Sun, Aquarius Moon",
    init: "C",
  },
];

function WaitlistForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const submitWaitlist = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !reason) return;

    setSubmitting(true);

    try {
      await fetch(WAITLIST_URL, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "text/plain;charset=utf-8",
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          reason,
          source: "homepage",
        }),
      });

      setDone(true);
      setName("");
      setEmail("");
      setReason("");
    } catch {
      alert("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <div className="mx-auto max-w-xl rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-5 text-center text-sm text-emerald-300">
        You are on the list. Launch access and your discount code will land in
        your inbox.
      </div>
    );
  }

  return (
    <form onSubmit={submitWaitlist} className="mx-auto grid max-w-xl gap-3">
      <input
        required
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="First name"
        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-[#e8e4f0] outline-none transition placeholder:text-white/25 focus:border-violet-500/60"
        style={{ colorScheme: "dark" }}
      />

      <input
        required
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email address"
        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-[#e8e4f0] outline-none transition placeholder:text-white/25 focus:border-violet-500/60"
        style={{ colorScheme: "dark" }}
      />

      <select
        required
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-[#e8e4f0] outline-none transition focus:border-violet-500/60"
        style={{ colorScheme: "dark" }}
      >
        <option value="">What do you want clarity on?</option>
        <option value="Love">Love</option>
        <option value="Career">Career</option>
        <option value="Money">Money</option>
        <option value="Purpose">Purpose</option>
      </select>

      <button
        type="submit"
        disabled={submitting}
        className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-violet-600 via-fuchsia-500 to-rose-500 px-5 py-3 text-sm font-semibold text-white transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {submitting
          ? "Joining..."
          : `Join waitlist + ${LAUNCH_DISCOUNT} off launch pricing`}
      </button>

      <p className="text-center text-xs text-white/30">
        No spam. Unsubscribe anytime.
      </p>
    </form>
  );
}

export default function HomePage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#09090f] text-[#e8e4f0]">
      <nav
        className={`fixed inset-x-0 top-0 z-50 border-b transition-all duration-300 ${
          scrolled
            ? "border-white/10 bg-[#09090f]/95 backdrop-blur-xl"
            : "border-transparent bg-transparent"
        }`}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <a href="#" className="flex items-center gap-3">
            <Image
              src="/mascot.png"
              alt="BluntChart mascot"
              width={34}
              height={34}
              className="h-9 w-9 rounded-full"
              priority
            />

            <span
              className="text-lg font-semibold tracking-tight"
              style={{ fontFamily: "var(--font-display)" }}
            >
              <span className="bg-gradient-to-r from-amber-300 via-pink-400 to-violet-400 bg-clip-text text-transparent">
                BluntChart
              </span>
            </span>
          </a>

          <div className="hidden items-center gap-6 text-xs font-semibold uppercase tracking-[0.18em] text-white/45 md:flex">
            <a href="#product" className="transition hover:text-white">
              What you get
            </a>

            <a href="#offers" className="transition hover:text-white">
              Readings
            </a>

            <a href="#reviews" className="transition hover:text-white">
              Reviews
            </a>

            <a
              href="#waitlist"
              className="rounded-full border border-amber-300/20 bg-amber-300/10 px-4 py-2 text-amber-200 transition hover:bg-amber-300/15"
            >
              Join waitlist
            </a>
          </div>
        </div>
      </nav>

      <main className="pt-24">
        <section className="relative overflow-hidden px-6 pb-18 pt-18 sm:pb-24 sm:pt-24">
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(107,47,212,.12) 0%, transparent 60%), radial-gradient(ellipse 40% 40% at 85% 60%, rgba(212,83,126,.08) 0%, transparent 60%)",
            }}
          />

          <div className="relative mx-auto flex max-w-5xl flex-col items-center text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber-300/20 bg-amber-300/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-200">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Brutally honest birth chart readings
            </div>

            <div className="mb-6">
              <Image
                src="/mascot.png"
                alt="BluntChart mascot"
                width={120}
                height={120}
                priority
                className="mx-auto"
              />
            </div>

            <h1
              className="max-w-4xl text-4xl font-black leading-[1.02] tracking-tight text-white sm:text-6xl lg:text-7xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Your chart already knows
              <br />
              <span className="bg-gradient-to-r from-amber-300 via-orange-300 to-pink-400 bg-clip-text text-transparent">
                why you&apos;re like this.
              </span>
            </h1>

            <p
              className="mt-4 text-xl italic text-white/55 sm:text-2xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              It&apos;s time you did too.
            </p>

            <p className="mt-5 max-w-2xl text-base leading-7 text-white/60 sm:text-lg">
              BluntChart turns a birth date, time, and place into a reading that
              says the quiet part out loud — simple enough to understand,
              specific enough to feel personal, and sharp enough to send to a
              friend.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <a
                href="#waitlist"
                className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-violet-600 via-fuchsia-500 to-rose-500 px-6 py-3 text-sm font-semibold text-white transition hover:opacity-95"
              >
                Join waitlist
              </a>

              <a
                href="#product"
                className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:border-white/25 hover:bg-white/10"
              >
                See what the reading includes
              </a>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}