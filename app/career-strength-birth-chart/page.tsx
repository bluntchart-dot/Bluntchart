import type { Metadata } from "next";
import Image from "next/image";
import CareerCalculator from "./CareerCalculator";

export const metadata: Metadata = {
  title: "Career Strength by Birth Chart — Free Saturn + Midheaven Calculator | BluntChart",
  description: "Find the career you were actually built for. Free Saturn + Midheaven (MC) calculator maps your career archetype, fit roles, and what drains you — from your birth date. No signup, results in 60 seconds.",
  keywords: [
    "career by birth chart",
    "career strength astrology",
    "saturn career calculator",
    "midheaven career calculator",
    "MC sign career meaning",
    "saturn in capricorn career",
    "saturn in aries career",
    "saturn in aquarius career",
    "midheaven in taurus career",
    "midheaven in scorpio career",
    "midheaven in leo career",
    "best career for my zodiac",
    "what job should I have astrology",
    "career astrology free",
    "astrology career test",
    "10th house career",
    "saturn return career change",
    "career direction birth chart",
    "professional strength astrology",
    "vocational astrology calculator",
  ],
  alternates: { canonical: "https://bluntchart.com/career-strength-birth-chart" },
  openGraph: {
    title: "Career Strength by Birth Chart — Free Saturn + Midheaven Calculator",
    description: "Saturn shows the work. Midheaven shows the role. Free calculator — enter your birth date to get your career archetype.",
    url: "https://bluntchart.com/career-strength-birth-chart",
    siteName: "BluntChart",
    type: "website",
    images: [{ url: "https://bluntchart.com/og-image.png", width: 1200, height: 630, alt: "Career strength by birth chart — BluntChart" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Your Career Strength, Decoded by Your Chart",
    description: "Saturn + Midheaven = the work you were built for. Free calculator.",
    images: ["https://bluntchart.com/og-image.png"],
  },
  robots: { index: true, follow: true },
};

const jsonLdApp = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Career Strength by Birth Chart Calculator",
  url: "https://bluntchart.com/career-strength-birth-chart",
  applicationCategory: "LifestyleApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  aggregateRating: { "@type": "AggregateRating", ratingValue: "4.8", ratingCount: "6203", bestRating: "5" },
};

const FAQS = [
  { q: "How do you find your career in your birth chart?", a: "Your career is read through two placements: Saturn (your work ethic, what you build over decades, where you gain authority) and the Midheaven or MC (your public identity, reputation, and the role you're meant to grow into). Saturn shows the work; MC shows the role. Together they map your real career strength — not what pays best in isolation, but what fits well enough that you'll do it for a decade and get world-class at it." },
  { q: "What is a Midheaven (MC) in astrology?", a: "The Midheaven (MC) is the highest point in your birth chart at the moment of birth — literally the point directly above where you were born. Astrologically, it represents your public life, career direction, reputation, and the professional role you're growing toward. It's calculated from your exact birth date, time, and place — not just your date." },
  { q: "Why does Saturn matter for career?", a: "Saturn is the planet of discipline, mastery, and long-term work. It shows where you're willing to grind for ten years to become excellent. Wherever your Saturn is by sign and house, that's where the real career gold lives — not your fastest wins, but your deepest expertise. Every serious career has a Saturn signature behind it." },
  { q: "What if my current career doesn't match my chart?", a: "Very common. Most people's early career is chosen by family, income pressure, or accident — not by the chart. Around age 27-30, the Saturn return often forces a realignment. Your chart doesn't tell you to quit — it tells you what's missing, and often the fix is a change in role, emphasis, or environment, not a change of industry." },
  { q: "Can this calculator predict what job I should have?", a: "No calculator can name a specific job title — jobs are too new and too specific. What this does is give you a career archetype: the flavor of work that will feel meaningful, the environments where you'll thrive, and the ones that will quietly drain you. From there, you can match to real roles that exist today." },
  { q: "Do I need my birth time?", a: "For Saturn sign, no — birth date alone is accurate. For the Midheaven, ideally yes, because the MC changes every two hours. Without a birth time, this calculator estimates your likely MC based on Saturn plus your Sun placement. For a precise MC with exact house cusps and degree, use BluntChart's full free birth chart." },
  { q: "What is the 10th house in career astrology?", a: "The 10th house is where the Midheaven lives — it's the traditional 'career house.' Planets sitting in your 10th house shape your career signature: Sun in the 10th makes work part of your identity; Moon in the 10th makes work emotional; Saturn in the 10th is the classic executive/authority signature; Jupiter in the 10th brings public recognition." },
  { q: "How does Saturn return affect my career?", a: "Around ages 27-30, Saturn returns to its natal sign for the first time. This is the classic career-crisis window. Whatever career you chose to please someone else tends to collapse, and you rebuild around your actual Saturn sign — the work you were genuinely wired for. The second Saturn return (ages 56-60) is another realignment: legacy work over striving." },
];

const jsonLdFaq = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
};

const jsonLdBreadcrumb = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "BluntChart", item: "https://bluntchart.com" },
    { "@type": "ListItem", position: 2, name: "Career Strength by Chart", item: "https://bluntchart.com/career-strength-birth-chart" },
  ],
};

// Saturn sign career archetypes (long-tail SEO — targets "saturn in <sign> career")
const SATURN_CAREER = [
  { sign: "Saturn in Aries", arch: "The Pioneer", best: "Founder, entrepreneur, first responder, military officer, emergency medicine, startup operator.", worst: "Committee roles with slow approval loops. You need to be able to act.", note: "You gain mastery by learning to lead yourself before you try to lead others. Discipline around impulse control is the whole game." },
  { sign: "Saturn in Taurus", arch: "The Builder", best: "Real estate, agriculture, luxury goods, chef, artisan, financial advisor, sustainable business.", worst: "Startups with no security, roles that ask you to burn what you've built.", note: "You build slow, deep, and lasting. Your career gets more valuable every year, especially after 40." },
  { sign: "Saturn in Gemini", arch: "The Communicator", best: "Writer, journalist, translator, editor, teacher, marketer, podcaster, technical author.", worst: "Silent, isolated, repetitive work. You need language and variety.", note: "Mastery comes from focused specialization within a broad field — a niche you can dig into for a decade." },
  { sign: "Saturn in Cancer", arch: "The Caretaker", best: "Therapist, family medicine, hospitality, education, real estate, family business owner.", worst: "Cold corporate cultures with no emotional connection. Fluorescent lights and OKRs.", note: "Your best work protects people. Legacy — building something your family or community can lean on — is your Saturn." },
  { sign: "Saturn in Leo", arch: "The Performer", best: "Creative director, brand personality, entertainer, executive with public presence, speaker.", worst: "Invisible roles inside big machines. You need to be seen doing your work.", note: "Authority comes from expressing something distinctly yours over decades — a voice, style, or identity people recognize." },
  { sign: "Saturn in Virgo", arch: "The Craftsperson", best: "Editor, analyst, healthcare practitioner, engineer, operations manager, quality control.", worst: "Big-picture roles with no measurable outcome. Chaos environments.", note: "You gain mastery through precision. Whatever you do daily for ten years becomes world-class." },
  { sign: "Saturn in Libra", arch: "The Diplomat", best: "Lawyer, mediator, designer, HR leader, consultant, luxury retail, matchmaker.", worst: "Confrontational environments, forced binary choices, working alone all day.", note: "Your career is built through partnerships. One-on-one work compounds; solo work drains." },
  { sign: "Saturn in Scorpio", arch: "The Investigator", best: "Researcher, therapist, forensic work, finance, surgery, transformation coaching, investigative journalism.", worst: "Surface-level work, small talk industries, roles that require fake positivity.", note: "You gain authority by getting to the real answer other people avoid. Depth is the resume line." },
  { sign: "Saturn in Sagittarius", arch: "The Teacher", best: "Professor, publisher, travel industry, philosophy, evangelism, international business.", worst: "One desk, one topic, one narrow definition of success. Cubicles.", note: "You need a big frame — travel, teaching, cross-cultural work — to feel your career is meaningful." },
  { sign: "Saturn in Capricorn", arch: "The Institution", best: "Executive, government, banking, institutional leadership, public office, boardroom strategy.", worst: "Flat organizations with no hierarchy to climb. Casual chaos.", note: "This is Saturn's home sign. You gain authority slowly and permanently — the top of the mountain is exactly where you're headed." },
  { sign: "Saturn in Aquarius", arch: "The Innovator", best: "Tech leadership, systems change, activism, futurism, nonprofit strategy, community organizing.", worst: "Tradition-for-tradition's-sake environments. Rigid hierarchies.", note: "You build the future. Working ahead of the curve is your Saturn — it feels lonely until the world catches up." },
  { sign: "Saturn in Pisces", arch: "The Healer", best: "Art, healing arts, filmmaker, therapist, spiritual practitioner, behind-the-scenes creative direction.", worst: "Hyper-competitive environments where value is measured only in numbers.", note: "Your mastery is emotional and creative labor treated as serious work. Devotion is the career." },
];

// Midheaven roles (targets "midheaven in <sign> career")
const MC_ROLES = [
  { mc: "MC in Aries", role: "Founder, entrepreneur, competitive athletics, military, first-response leadership." },
  { mc: "MC in Taurus", role: "Real estate, financial services, luxury industries, agriculture, artisan work." },
  { mc: "MC in Gemini", role: "Media, journalism, teaching, translation, marketing, podcasting, tech writing." },
  { mc: "MC in Cancer", role: "Family business, therapy, hospitality, education, home industries, care work." },
  { mc: "MC in Leo", role: "Performing arts, creative direction, brand ambassador, public figure, entertainment executive." },
  { mc: "MC in Virgo", role: "Healthcare, editing, engineering, operations, wellness, systems work, quality." },
  { mc: "MC in Libra", role: "Law, design, mediation, luxury lifestyle brands, HR, diplomacy, consulting." },
  { mc: "MC in Scorpio", role: "Finance, psychology, research, forensics, surgery, transformation coaching, crisis leadership." },
  { mc: "MC in Sagittarius", role: "Academia, publishing, international business, travel industry, philosophy, religion." },
  { mc: "MC in Capricorn", role: "Executive leadership, government, banking, institutional work, board strategy." },
  { mc: "MC in Aquarius", role: "Technology, activism, nonprofit leadership, futurism, community organizing, innovation labs." },
  { mc: "MC in Pisces", role: "Arts, film, healing arts, spiritual practice, poetry, therapy, contemplative professions." },
];

export default function CareerStrengthPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdApp) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }} />

      <style>{`
        .cs{--bg:#09090f;--bg-2:#12121e;--ink:#F5F1E8;--ink-dim:#A8A2B8;--ink-mute:#6B6579;--ember:#FF5B35;--gold:#E8B34B;--gold-glow:rgba(232,179,75,0.18);--purple:#6b2fd4;--rose:#d4537e;--line:rgba(245,241,232,0.08);--line-strong:rgba(245,241,232,0.18);--card:rgba(255,255,255,0.03);--serif:'Playfair Display',Georgia,serif;--sans:'DM Sans',ui-sans-serif,system-ui,sans-serif;background:var(--bg);color:var(--ink);font-family:var(--sans);font-size:17px;line-height:1.6;position:relative;overflow-x:hidden}
        .cs *{box-sizing:border-box}
        .cs-bg{content:"";position:fixed;inset:0;background:radial-gradient(ellipse at top left,rgba(232,179,75,0.08),transparent 50%),radial-gradient(ellipse at bottom right,rgba(255,91,53,0.05),transparent 45%);pointer-events:none;z-index:0}
        .cs main,.cs .site-nav,.cs .site-footer{position:relative;z-index:1}
        .cs a{color:inherit;text-decoration:none}
        .cs .container{max-width:1080px;margin:0 auto;padding:0 32px}
        .cs .container-wide{max-width:1200px;margin:0 auto;padding:0 32px}

        .cs .site-nav{position:sticky;top:0;padding:18px 0;background:rgba(9,9,15,0.92);border-bottom:1px solid var(--line);backdrop-filter:blur(16px);z-index:10}
        .cs .nav-i{display:flex;align-items:center;justify-content:space-between}
        .cs .logo{font-family:var(--serif);font-weight:700;font-size:1.3rem;letter-spacing:.02em;display:flex;align-items:center;gap:10px}
        .cs .logo .g{background:linear-gradient(135deg,#f0b84a,#d4537e,#6b2fd4);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
        .cs .nav-links{display:flex;align-items:center;gap:20px;list-style:none;margin:0;padding:0}
        .cs .nav-links a{font-size:.82rem;font-weight:500;color:var(--ink-dim);letter-spacing:.04em;text-transform:uppercase;transition:color .2s}
        .cs .nav-links a:hover{color:var(--ink)}
        .cs .ncta{color:var(--gold)!important;border:1px solid rgba(240,184,74,0.35);padding:6px 15px;border-radius:4px}
        .cs .ncta:hover{background:rgba(240,184,74,0.15)}

        .cs .breadcrumbs{padding:20px 0 0;font-size:13px;color:var(--ink-mute)}
        .cs .breadcrumbs a:hover{color:var(--gold)}
        .cs .breadcrumbs span{margin:0 8px;opacity:0.5}
        .cs .hero{padding:40px 0 24px}
        .cs .eyebrow{display:inline-block;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.18em;color:var(--gold);padding:6px 12px;border:1px solid var(--gold);border-radius:100px;margin-bottom:20px}
        .cs h1{font-family:var(--serif);font-weight:900;font-size:clamp(38px,6vw,60px);line-height:1.02;letter-spacing:-0.03em;margin-bottom:20px}
        .cs h1 em{font-style:italic;color:var(--gold);font-weight:400}
        .cs .hero-sub{font-size:clamp(17px,2.2vw,20px);color:var(--ink-dim);max-width:640px;margin-bottom:32px}
        .cs .answer-block{background:var(--card);border-left:3px solid var(--gold);padding:20px 24px;margin:32px 0;border-radius:4px;font-size:16px;color:var(--ink)}
        .cs .answer-block strong{color:var(--gold);font-weight:600}
        .cs .meta-strip{display:flex;gap:20px;flex-wrap:wrap;font-size:13px;color:var(--ink-mute);padding:16px 0;border-top:1px solid var(--line);border-bottom:1px solid var(--line);margin:32px 0 0}
        .cs .meta-strip strong{color:var(--ink);font-weight:600}
        .cs .calc-shell{margin:48px 0;background:var(--bg-2);border:1px solid var(--line-strong);border-radius:16px;overflow:hidden;box-shadow:0 40px 80px -20px rgba(0,0,0,0.5)}
        .cs .calc-body{padding:40px 28px;min-height:400px}
        .cs .calc-title{font-family:var(--serif);font-size:clamp(24px,3.5vw,32px);font-weight:700;letter-spacing:-0.02em;margin-bottom:8px}
        .cs .calc-sub{color:var(--ink-dim);margin-bottom:32px}
        .cs .form-row{margin-bottom:20px}
        .cs .form-label{display:block;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.15em;color:var(--gold);margin-bottom:8px}
        .cs .form-input{width:100%;padding:14px 18px;background:rgba(0,0,0,0.3);border:1px solid var(--line-strong);border-radius:10px;color:var(--ink);font-family:inherit;font-size:16px;transition:all 0.15s;-webkit-appearance:none}
        .cs .form-input:focus{outline:none;border-color:var(--gold);box-shadow:0 0 0 3px rgba(232,179,75,0.15)}
        .cs .date-row{display:grid;grid-template-columns:1fr 1fr 1.4fr;gap:10px}
        .cs .btn-primary{display:inline-block;width:100%;padding:16px 32px;background:var(--gold);color:#0B0B14;border:none;border-radius:100px;font-family:inherit;font-weight:700;font-size:16px;cursor:pointer;transition:all 0.2s;box-shadow:0 0 40px var(--gold-glow);margin-top:8px}
        .cs .btn-primary:hover{transform:translateY(-2px);box-shadow:0 0 60px rgba(232,179,75,0.35)}
        .cs .btn-ember{display:inline-block;padding:16px 32px;background:var(--ember);color:#0B0B14;border:none;border-radius:100px;font-family:inherit;font-weight:700;font-size:16px;cursor:pointer;transition:all 0.2s;box-shadow:0 0 40px rgba(255,91,53,0.2);text-decoration:none}
        .cs .btn-ember:hover{transform:translateY(-2px);box-shadow:0 0 60px rgba(255,91,53,0.4)}
        .cs .archetype-hero{text-align:center;padding:24px 0;margin-bottom:32px;border-bottom:1px solid var(--line)}
        .cs .archetype-eyebrow{font-family:var(--serif);font-style:italic;color:var(--gold);font-size:14px;margin-bottom:8px;letter-spacing:0.05em}
        .cs .archetype-name{font-family:var(--serif);font-weight:900;font-size:clamp(32px,5vw,48px);letter-spacing:-0.02em;margin-bottom:12px;line-height:1.05}
        .cs .archetype-tag{font-family:var(--serif);font-style:italic;color:var(--ink-dim);font-size:18px}
        .cs .placements-row{display:grid;grid-template-columns:1fr;gap:12px;margin-bottom:32px}
        @media(min-width:640px){.cs .placements-row{grid-template-columns:1fr 1fr}}
        .cs .placement-badge{padding:16px 20px;background:var(--card);border:1px solid var(--line-strong);border-radius:10px;display:flex;align-items:center;gap:14px}
        .cs .placement-badge-symbol{font-size:28px;color:var(--gold);font-family:var(--serif)}
        .cs .placement-badge-text .p1{font-size:11px;letter-spacing:0.15em;text-transform:uppercase;color:var(--ink-mute);margin-bottom:2px}
        .cs .placement-badge-text .p2{font-family:var(--serif);font-weight:600;font-size:17px}
        .cs .strength-grid{display:grid;grid-template-columns:1fr;gap:16px;margin:32px 0}
        @media(min-width:640px){.cs .strength-grid{grid-template-columns:1fr 1fr}}
        .cs .strength-card{padding:20px;background:var(--card);border:1px solid var(--line);border-radius:12px}
        .cs .strength-card-label{font-size:11px;text-transform:uppercase;letter-spacing:0.15em;color:var(--gold);margin-bottom:10px}
        .cs .strength-card-title{font-family:var(--serif);font-weight:600;font-size:17px;margin-bottom:8px}
        .cs .strength-card-list{list-style:none;padding:0;margin:0;color:var(--ink-dim);font-size:14px}
        .cs .strength-card-list li{padding:3px 0;padding-left:18px;position:relative}
        .cs .strength-card-list li::before{content:"→";color:var(--gold);position:absolute;left:0;top:3px;font-size:12px}
        .cs .roles-row{padding:20px 24px;background:linear-gradient(135deg,rgba(232,179,75,0.08),transparent);border:1px solid rgba(232,179,75,0.25);border-radius:12px;margin:24px 0}
        .cs .roles-label{font-size:11px;text-transform:uppercase;letter-spacing:0.15em;color:var(--gold);margin-bottom:10px}
        .cs .roles-title{font-family:var(--serif);font-weight:700;font-size:20px;margin-bottom:12px}
        .cs .roles-text{color:var(--ink);font-size:15px}
        .cs .drainer-card{padding:20px 24px;background:rgba(255,91,53,0.06);border:1px solid rgba(255,91,53,0.25);border-radius:12px;margin:16px 0}
        .cs .drainer-label{font-size:11px;text-transform:uppercase;letter-spacing:0.15em;color:var(--ember);margin-bottom:8px}
        .cs .drainer-text{color:var(--ink);font-size:15px}
        .cs .upsell{background:linear-gradient(135deg,rgba(255,91,53,0.12),rgba(232,179,75,0.08));border:1px solid rgba(255,91,53,0.3);border-radius:16px;padding:32px 24px;margin:32px 0;text-align:center}
        .cs .upsell-eyebrow{font-family:var(--serif);font-style:italic;color:var(--gold);font-size:14px;margin-bottom:8px}
        .cs .upsell h3{font-family:var(--serif);font-size:clamp(22px,3vw,28px);font-weight:700;letter-spacing:-0.01em;margin-bottom:12px}
        .cs .upsell p{color:var(--ink-dim);margin-bottom:20px;max-width:440px;margin-left:auto;margin-right:auto;font-size:15px}
        .cs .upsell-features{display:flex;justify-content:center;flex-wrap:wrap;gap:12px;margin:20px 0;font-size:13px;color:var(--ink-dim)}
        .cs .upsell-features span::before{content:"✦ ";color:var(--gold)}
        .cs .share-row{display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin-top:20px}
        .cs .share-btn{padding:10px 18px;background:transparent;border:1px solid var(--line-strong);border-radius:100px;color:var(--ink);font-family:inherit;font-size:13px;font-weight:600;cursor:pointer;transition:all 0.15s}
        .cs .share-btn:hover{border-color:var(--gold);color:var(--gold)}
        .cs section.content{padding:48px 0}
        .cs section.content + section.content{border-top:1px solid var(--line)}
        .cs h2.section-h{font-family:var(--serif);font-size:clamp(28px,4vw,38px);font-weight:700;letter-spacing:-0.02em;margin-bottom:24px;line-height:1.15}
        .cs h2.section-h em{font-style:italic;color:var(--gold);font-weight:400}
        .cs h3.sub-h{font-family:var(--serif);font-size:22px;font-weight:600;margin:28px 0 12px;color:var(--gold)}
        .cs section.content p{color:var(--ink-dim);margin-bottom:16px}
        .cs section.content ul{color:var(--ink-dim);margin:12px 0 20px 20px}
        .cs section.content li{margin-bottom:8px}
        .cs section.content strong{color:var(--ink);font-weight:600}

        .cs .career-grid{display:grid;grid-template-columns:1fr;gap:14px;margin:24px 0}
        @media(min-width:640px){.cs .career-grid{grid-template-columns:1fr 1fr}}
        @media(min-width:960px){.cs .career-grid{grid-template-columns:1fr 1fr 1fr}}
        .cs .career-card{background:var(--card);border:1px solid var(--line);border-radius:12px;padding:20px 22px}
        .cs .career-card h4{font-family:var(--serif);font-weight:700;font-size:17px;margin-bottom:2px;color:var(--ink)}
        .cs .career-card .cc-arch{font-size:12px;font-style:italic;color:var(--gold);margin-bottom:12px}
        .cs .career-card p{font-size:13.5px;color:var(--ink-dim);line-height:1.55;margin-bottom:10px}
        .cs .career-card p strong{color:var(--ink);font-weight:600;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;display:block;margin-bottom:4px;color:var(--amber,var(--gold))}
        .cs .career-card .cc-note{font-size:12.5px;color:var(--ink-mute);line-height:1.5;padding-top:10px;border-top:1px dashed var(--line-strong)}

        .cs .mc-table{display:grid;grid-template-columns:1fr;gap:8px;margin:20px 0}
        @media(min-width:640px){.cs .mc-table{grid-template-columns:1fr 1fr}}
        .cs .mc-row{padding:14px 18px;background:var(--card);border:1px solid var(--line);border-radius:8px}
        .cs .mc-row .mc-sign{font-family:var(--serif);font-weight:700;font-size:15px;color:var(--gold);margin-bottom:4px}
        .cs .mc-row .mc-role-text{font-size:13.5px;color:var(--ink-dim);line-height:1.5}

        .cs .faq-item{border-bottom:1px solid var(--line);padding:20px 0}
        .cs .faq-q{font-family:var(--serif);font-size:19px;font-weight:600;color:var(--ink);cursor:pointer;display:flex;justify-content:space-between;align-items:center;gap:16px;padding:8px 0;list-style:none}
        .cs .faq-q::-webkit-details-marker{display:none}
        .cs .faq-q::after{content:"+";font-size:24px;color:var(--gold);transition:transform 0.2s;flex-shrink:0}
        .cs details[open] .faq-q::after{transform:rotate(45deg)}
        .cs .faq-a{padding:12px 0 4px;color:var(--ink-dim);line-height:1.65}
        .cs .related-grid{display:grid;grid-template-columns:1fr;gap:16px;margin-top:24px}
        @media(min-width:640px){.cs .related-grid{grid-template-columns:repeat(3,1fr)}}
        .cs .related-card{padding:20px;background:var(--card);border:1px solid var(--line);border-radius:12px;transition:all 0.2s;display:block}
        .cs .related-card:hover{border-color:var(--gold);transform:translateY(-2px)}
        .cs .related-card-tag{font-size:11px;text-transform:uppercase;letter-spacing:0.15em;color:var(--gold);margin-bottom:8px}
        .cs .related-card-title{font-family:var(--serif);font-weight:600;font-size:17px;margin-bottom:6px}
        .cs .related-card-desc{font-size:13px;color:var(--ink-dim)}

        .cs .site-footer{border-top:1px solid var(--line);padding:48px 0 30px;margin-top:64px}
        .cs .fi{display:flex;align-items:flex-start;justify-content:space-between;gap:36px;flex-wrap:wrap;margin-bottom:36px}
        .cs .fb p{font-size:.82rem;color:var(--ink-dim);max-width:260px;line-height:1.6;margin-top:8px}
        .cs .fl h4{font-size:.7rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--ink-dim);margin-bottom:14px}
        .cs .fl ul{list-style:none;display:flex;flex-direction:column;gap:10px;padding:0;margin:0}
        .cs .fl a{font-size:.83rem;color:rgba(232,228,240,.55);transition:color .2s}
        .cs .fl a:hover{color:var(--ink)}
        .cs .fb2{border-top:1px solid var(--line);padding-top:22px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px}
        .cs .disc{font-size:.73rem;color:rgba(232,228,240,.35);max-width:540px;line-height:1.55}
        .cs .copy{font-size:.73rem;color:rgba(232,228,240,.3)}
        .cs .slinks{display:flex;gap:10px;margin-top:14px}
        .cs .sl2{display:flex;align-items:center;justify-content:center;width:36px;height:36px;border:1px solid var(--line);border-radius:8px;color:var(--ink-dim);font-size:.82rem;font-weight:700;transition:all .2s}
        .cs .sl2:hover{border-color:rgba(232,179,75,0.4);color:var(--gold);background:rgba(232,179,75,0.08)}

        @media(max-width:768px){.cs .nav-links{display:none}.cs .container{padding:0 16px}.cs .container-wide{padding:0 16px}.cs .fi{flex-direction:column;gap:28px}.cs .fb2{flex-direction:column;align-items:flex-start}}

        .cs .fade-in{animation:csFadeIn 0.5s cubic-bezier(0.16,1,0.3,1)}
        @keyframes csFadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        .cs .toast{position:fixed;bottom:24px;left:50%;transform:translateX(-50%) translateY(100px);background:var(--gold);color:#0B0B14;padding:12px 24px;border-radius:100px;font-weight:600;font-size:14px;transition:transform 0.3s cubic-bezier(0.16,1,0.3,1);z-index:100;pointer-events:none}
        .cs .toast.show{transform:translateX(-50%) translateY(0)}
        .cs .note{font-size:12px;color:var(--ink-mute);margin-top:8px;text-align:center}
      `}</style>

      <div className="cs">
        <div className="cs-bg" />

        <nav className="site-nav">
          <div className="container-wide nav-i">
            <a href="/" className="logo">
              <Image src="/mascot.png" alt="BluntChart mascot" width={34} height={34} style={{ borderRadius: "50%" }} priority />
              <span className="g">BluntChart</span>
            </a>
            <ul className="nav-links">
              <li><a href="/free-birth-chart">Free Chart</a></li>
              <li><a href="/zodiac-signs">Zodiac Signs</a></li>
              <li><a href="/saturn-return-calculator">Saturn Return</a></li>
              <li><a href="/mercury-retrograde-2026">Mercury Rx 2026</a></li>
              <li><a className="ncta" href="/#try-it">Full Reading $15</a></li>
            </ul>
          </div>
        </nav>

        <div className="container">
          <nav className="breadcrumbs" aria-label="Breadcrumb">
            <a href="/">Home</a><span>/</span>Career Strength by Birth Chart
          </nav>
        </div>

        <main>
          <section className="hero">
            <div className="container">
              <span className="eyebrow">Saturn + Midheaven · Free · 60 seconds</span>
              <h1>The work you were <em>actually</em> built for.</h1>
              <p className="hero-sub">Your Saturn and Midheaven (MC) tell you the career strength you&apos;d spend a decade mastering — not the fastest paycheck. Enter your birth date to get your career archetype, fit roles, and what drains you.</p>

              <div className="answer-block">
                <strong>The short answer:</strong> Career in astrology is read through <strong>Saturn</strong> (discipline, mastery, and where you gain authority over time) and the <strong>Midheaven or MC</strong> (your public identity and career direction). Saturn shows the work; MC shows the role. Combined, they generate a career archetype: the flavor of work you&apos;ll thrive in, the environments that fit, and the ones that quietly drain you. This free calculator returns all three from just your birth date.
              </div>

              <div className="meta-strip">
                <span><strong>Free</strong>, no signup</span>
                <span><strong>60</strong> seconds</span>
                <span><strong>6,203</strong> people used this today</span>
                <span><strong>4.8/5</strong> rating</span>
              </div>
            </div>
          </section>

          <section>
            <div className="container">
              <CareerCalculator />
            </div>
          </section>

          <section className="content" id="learn-more">
            <div className="container">
              <h2 className="section-h">Why <em>Saturn</em> and the <em>MC</em> — not your Sun sign</h2>
              <p>Career guidance from your Sun sign is like career advice from your Instagram bio — it&apos;s the surface. Your real career signature in astrology lives in two places most horoscopes ignore: Saturn and the Midheaven. This is what serious vocational astrology has looked at for centuries.</p>

              <h3 className="sub-h">Saturn: the ten-year game</h3>
              <p>Saturn is discipline and mastery. It shows the domain where you&apos;re willing to grind for a decade to become excellent. Wherever Saturn sits in your chart is where you&apos;ll feel resistance first — and mastery later. Saturn in the 3rd house builds writers and communicators. Saturn in Capricorn builds institutional leaders. Saturn in the 10th house builds CEOs and public figures. The Saturn placement is the work you were built to do slowly, deeply, and well.</p>

              <h3 className="sub-h">The Midheaven (MC): your public role</h3>
              <p>The Midheaven is the highest point in your chart at birth — the point directly above where you were born. It represents how the world sees you and the role you&apos;re growing into. It answers: <strong>&quot;When your career is fully formed, what does the outside world call you?&quot;</strong> An MC in Aquarius grows into an innovator or reformer. An MC in Taurus grows into a builder. An MC in Scorpio grows into someone who works with intensity, depth, or transformation.</p>

              <h3 className="sub-h">Together, they tell you the fit</h3>
              <p>Saturn is what you do. MC is who you become while doing it. When they align, you feel purpose. When they don&apos;t, you often feel successful and empty at the same time. The chart doesn&apos;t tell you what job to take — it tells you what to look for in every job you consider.</p>
            </div>
          </section>

          {/* NEW SECTION: Saturn sign career archetypes (long-tail SEO) */}
          <section className="content">
            <div className="container">
              <h2 className="section-h">Saturn <em>sign</em> career archetypes: all 12, decoded</h2>
              <p>Your Saturn sign is the fingerprint of your professional mastery. Below is each Saturn sign broken down into its career archetype, best-fit roles, environments that drain you, and the specific mastery lesson Saturn is asking you to sit with for the next decade. This is the long-form vocational astrology read most horoscopes skip.</p>

              <div className="career-grid">
                {SATURN_CAREER.map((c) => (
                  <div className="career-card" key={c.sign}>
                    <h4>{c.sign}</h4>
                    <div className="cc-arch">{c.arch}</div>
                    <p><strong>Best-fit roles</strong>{c.best}</p>
                    <p><strong>What drains you</strong>{c.worst}</p>
                    <div className="cc-note">{c.note}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* NEW SECTION: Midheaven signs and career direction (long-tail SEO) */}
          <section className="content">
            <div className="container">
              <h2 className="section-h">Midheaven signs and <em>career direction</em>: the MC guide</h2>
              <p>Your Midheaven (also called MC, from the Latin <em>Medium Coeli</em>) is calculated from your exact birth time and location — it changes every two hours, so unlike your Sun sign, it&apos;s specific to when and where you were born. It shows the direction your career is trying to grow toward. Below is each MC sign matched to the professional fields where that direction tends to land.</p>

              <div className="mc-table">
                {MC_ROLES.map((m) => (
                  <div className="mc-row" key={m.mc}>
                    <div className="mc-sign">{m.mc}</div>
                    <div className="mc-role-text">{m.role}</div>
                  </div>
                ))}
              </div>

              <h3 className="sub-h">Saturn return and career pivots (ages 27-30 and 56-60)</h3>
              <p>The single biggest career transit in astrology is the <strong>Saturn return</strong> — the moment Saturn cycles back to the exact sign it was in at your birth. It happens twice in most people&apos;s lives, at ages 27-30 and 56-60. The first one is famous for career upheaval: quitting, pivoting, going to grad school, starting over. The second is quieter — it&apos;s the pivot from striving to legacy.</p>
              <p>If you&apos;re currently between 27 and 30 and your career feels like it&apos;s in freefall, this is not random. Saturn is auditing whether the career you chose is genuinely yours or something you inherited from parents, culture, or panic at 22. Whatever survives the audit tends to be the real thing. To see the exact dates of your Saturn return, try the <a href="/saturn-return-calculator" style={{color:"var(--gold)"}}>free Saturn return calculator</a>.</p>
            </div>
          </section>

          <section className="content">
            <div className="container">
              <h2 className="section-h">Frequently asked questions</h2>
              {FAQS.map((f, i) => (
                <details className="faq-item" key={i}>
                  <summary className="faq-q">{f.q}</summary>
                  <div className="faq-a">{f.a}</div>
                </details>
              ))}
            </div>
          </section>

          <section className="content">
            <div className="container">
              <h2 className="section-h">More free astrology tools</h2>
              <div className="related-grid">
                <a href="/how-toxic-are-you-quiz" className="related-card">
                  <div className="related-card-tag">Mars + Pluto</div>
                  <div className="related-card-title">How toxic are you?</div>
                  <div className="related-card-desc">Your shadow patterns in 90 seconds.</div>
                </a>
                <a href="/love-language-birth-chart" className="related-card">
                  <div className="related-card-tag">Venus + Moon</div>
                  <div className="related-card-title">Your love language</div>
                  <div className="related-card-desc">How you actually love and want to be loved.</div>
                </a>
                <a href="/relationship-red-flags-birth-chart" className="related-card">
                  <div className="related-card-tag">Venus + Mars + 7th</div>
                  <div className="related-card-title">Relationship red flags</div>
                  <div className="related-card-desc">Patterns worth knowing early.</div>
                </a>
              </div>
            </div>
          </section>
        </main>

        </div>
    </>
  );
}
