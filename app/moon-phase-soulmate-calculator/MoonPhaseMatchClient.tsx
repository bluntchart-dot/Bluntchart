"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const FAQS = [
  {
    q: "Is this actually accurate, or just a filter?",
    a: "The moon phase itself is a real calculation from your birth date, not an illustration or a filter. The illumination percentage and phase name shown are computed the same way an ephemeris would derive them — this isn't the CapCut template redrawn, it's the actual math behind it.",
  },
  {
    q: "What if our moons don't form a full moon — are we doomed?",
    a: "No. By TikTok law, a low score is \"not soulmates.\" By actual astrology, moon phase alignment was never a real compatibility signal — it's a fun coincidence, not a placement. The thing that actually matters is your moon signs, which is what the full Compatibility Reading is built on.",
  },
  {
    q: "Do I need my exact birth time?",
    a: "Not for this. Moon phase only depends on the date — it's the same for everyone born that day anywhere on Earth. Birth time only matters once you move to moon sign, which is part of the full reading.",
  },
  {
    q: "Can I do this for a friend, not a partner?",
    a: "Yes — the original trend started with couples but spread to best friends and even pets. The card works exactly the same either way; just enter both birthdays.",
  },
  {
    q: "What happens when I join the waitlist?",
    a: "You get the HD, watermark-free card the moment the full Compatibility Reading launches, plus the real moon-sign read added to your verdict. Waitlist members get launch pricing first — Sun, Moon, Venus, Mars, the fight decoder, all of it.",
  },
  {
    q: "What's actually different between this card and the full Compatibility Reading?",
    a: "This free card gives you one placement — the moon phase. The full Compatibility Reading covers all eleven modules: Sun, Moon, Venus, and Mars compatibility, the Fight Decoder, Emotional Safety, Green and Red Flags, your Relationship Timeline, and a Fight Card for both of you.",
  },
  {
    q: "Is my birth data stored or sold?",
    a: "It's used solely to calculate your card. We don't sell it, share it with third parties, or use it for advertising. Full details in our Privacy Policy.",
  },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`fitem${open ? " open" : ""}`}>
      <div className="fq" onClick={() => setOpen((o) => !o)}>
        <span>{q}</span>
        <span className="farrow">▾</span>
      </div>
      <div className="fa">
        <p>{a}</p>
      </div>
    </div>
  );
}

export default function MoonPhaseMatchClient() {
  const cardRef = useRef<HTMLDivElement>(null);
  const [shareState, setShareState] = useState<"idle" | "busy">("idle");

  useEffect(() => {
    function moonData(dateStr: string) {
      const d = new Date(dateStr + "T12:00:00Z");
      const knownNewMoon = Date.UTC(2000, 0, 6, 18, 14, 0);
      const synodic = 29.530588853;
      const diffDays = (d.getTime() - knownNewMoon) / 86400000;
      let p = (diffDays % synodic) / synodic;
      if (p < 0) p += 1;
      const angle = p * 2 * Math.PI;
      const illum = Math.round(50 * (1 - Math.cos(angle)));
      let name;
      if (p < 0.03 || p > 0.97) name = "New Moon";
      else if (p < 0.22) name = "Waxing Crescent";
      else if (p < 0.28) name = "First Quarter";
      else if (p < 0.47) name = "Waxing Gibbous";
      else if (p < 0.53) name = "Full Moon";
      else if (p < 0.72) name = "Waning Gibbous";
      else if (p < 0.78) name = "Last Quarter";
      else name = "Waning Crescent";
      return { p, angle, illum, name };
    }

    function paintMoon(halfId: string, ellipseId: string, angle: number, R: number, cx: number, p: number) {
      const cosA = Math.cos(angle);
      const rx = R * Math.abs(cosA);
      const litOnRight = p <= 0.5;
      const half = document.getElementById(halfId);
      const ell = document.getElementById(ellipseId);
      if (!half || !ell) return;
      half.setAttribute("x", String(litOnRight ? cx : cx - R));
      half.setAttribute("width", String(R));
      ell.setAttribute("rx", String(rx));
      ell.setAttribute("fill", cosA < 0 ? "white" : "black");
    }

    function fmtDate(dateStr: string) {
      const d = new Date(dateStr + "T12:00:00Z");
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      return months[d.getUTCMonth()] + " " + d.getUTCDate() + ", " + d.getUTCFullYear();
    }

    function verdictFor(score: number) {
      if (score >= 90) return "TikTok would call you soulmates. <b>By actual astrology,</b> we'd still want your real Moon signs before agreeing — but not a bad start. <b>We checked.</b>";
      if (score >= 70) return "Strong overlap. <b>By actual astrology,</b> that's enough to make us genuinely curious what your Moon signs say. <b>Worth checking.</b>";
      if (score >= 40) return "Some overlap, some gap. By TikTok law, inconclusive. <b>By actual astrology:</b> phase was never the part that mattered. <b>We checked.</b>";
      return "Barely any overlap. By TikTok law: not soulmates. <b>By actual astrology:</b> phase alignment was never the real signal — Moon sign is. <b>We checked.</b>";
    }

    const ringCirc = 2 * Math.PI * 100;

    function runMatch() {
      const n1El = document.getElementById("d1Name") as HTMLInputElement | null;
      const n2El = document.getElementById("d2Name") as HTMLInputElement | null;
      const dt1El = document.getElementById("d1Date") as HTMLInputElement | null;
      const dt2El = document.getElementById("d2Date") as HTMLInputElement | null;
      if (!n1El || !n2El || !dt1El || !dt2El) return;

      const n1 = n1El.value || "You";
      const n2 = n2El.value || "Them";
      const dt1 = dt1El.value;
      const dt2 = dt2El.value;
      if (!dt1 || !dt2) return;

      const a = moonData(dt1);
      const b = moonData(dt2);

      const setText = (id: string, text: string) => {
        const el = document.getElementById(id);
        if (el) el.textContent = text;
      };

      setText("outName1", n1);
      setText("outName2", n2);
      setText("outDates", fmtDate(dt1) + "  ×  " + fmtDate(dt2));
      setText("ph1", a.name);
      setText("il1", "Her birth moon · " + a.illum + "% lit");
      setText("ph2", b.name);
      setText("il2", "His birth moon · " + b.illum + "% lit");

      paintMoon("aHalf", "aEllipse", a.angle, 78, 100, a.p);
      paintMoon("bHalf", "bEllipse", b.angle, 78, 100, b.p);
      paintMoon("mHalfA", "mEllipseA", a.angle, 82, 120, a.p);
      paintMoon("mHalfB", "mEllipseB", b.angle, 82, 120, b.p);

      const score = Math.max(0, Math.min(100, 100 - Math.abs(a.illum + b.illum - 100)));

      const ring = document.getElementById("ringFill");
      const num = document.getElementById("pctNum");
      if (ring && num) {
        ring.style.transition = "none";
        ring.setAttribute("stroke-dasharray", "0 999");
        num.textContent = "0%";
        ring.getBoundingClientRect();
        requestAnimationFrame(() => {
          ring.style.transition = "stroke-dasharray 1.4s cubic-bezier(.25,.8,.3,1)";
          ring.setAttribute("stroke-dasharray", (ringCirc * score) / 100 + " " + ringCirc);
          let t0: number | null = null;
          function step(ts: number) {
            if (!t0) t0 = ts;
            const pr = Math.min((ts - t0) / 1300, 1);
            if (num) num.textContent = Math.round(score * (1 - Math.pow(1 - pr, 3))) + "%";
            if (pr < 1) requestAnimationFrame(step);
          }
          requestAnimationFrame(step);
        });
      }

      const verdictEl = document.getElementById("verdictText");
      if (verdictEl) verdictEl.innerHTML = verdictFor(score);
    }

    const form = document.getElementById("matchForm");
    const onSubmit = (e: Event) => {
      e.preventDefault();
      runMatch();
      document.getElementById("mooncard")?.scrollIntoView({ behavior: "smooth", block: "center" });
    };
    form?.addEventListener("submit", onSubmit);

    runMatch();

    return () => form?.removeEventListener("submit", onSubmit);
  }, []);

  async function handleShare() {
    if (!cardRef.current || shareState === "busy") return;
    setShareState("busy");
    try {
      const { default: html2canvas } = await import("html2canvas");
      const canvas = await html2canvas(cardRef.current, {
        scale: 3,
        backgroundColor: "#1c0b16",
        logging: false,
        useCORS: true,
        allowTaint: true,
      });
      const blob: Blob = await new Promise((res, rej) =>
        canvas.toBlob((b) => (b ? res(b) : rej(new Error("toBlob failed"))), "image/png")
      );
      const file = new File([blob], "bluntchart-moon-phase-match.png", { type: "image/png" });

      if (typeof navigator.share === "function" && typeof navigator.canShare === "function" && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: "Our Moon Phase Match",
          text: "Our moons, combined — via BluntChart bluntchart.com/moon-phase-soulmate-calculator",
        });
      } else if (typeof navigator.share === "function") {
        await navigator.share({
          title: "Our Moon Phase Match",
          text: "Our moons, combined — via BluntChart",
          url: window.location.href,
        });
      } else {
        const link = document.createElement("a");
        link.download = "bluntchart-moon-phase-match.png";
        link.href = canvas.toDataURL("image/png");
        link.click();
      }
    } catch (err) {
      const e = err as Error;
      if (e.name !== "AbortError" && e.name !== "NotAllowedError") {
        console.error("[MoonPhaseMatch] share error:", err);
        alert("Share failed. Try taking a screenshot instead.");
      }
    } finally {
      setShareState("idle");
    }
  }

  return (
    <>
      <link rel="canonical" href="https://bluntchart.com/moon-phase-soulmate-calculator" />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&family=Instrument+Serif:ital@0;1&family=Inter:wght@400;500;600;700&display=swap');
        .mpm{
          --bg:#150710; --panel:#221019; --panel2:#2c1521; --line:#43222f;
          --cream:#fff0f4; --dim:#cf9cae; --pink:#ff5c8a; --red:#ff3b52; --rose:#ffb3c7;
          --mint:#8be0b0; --glow:rgba(255,92,138,.35);
        }
        .mpm *{box-sizing:border-box}
        .mpm{background:var(--bg);color:var(--cream);font-family:'Inter',system-ui,sans-serif;line-height:1.6;
          background-image:radial-gradient(ellipse 55% 35% at 75% -5%, rgba(255,92,138,.13), transparent),
          radial-gradient(ellipse 45% 30% at 5% 30%, rgba(255,59,82,.07), transparent);}
        .mpm .wrap{max-width:900px;margin:0 auto;padding:0 20px}
        .mpm h1,.mpm h2,.mpm h3{font-family:'Space Grotesk',sans-serif}
        .mpm em{font-family:'Instrument Serif',Georgia,serif;font-style:italic;font-weight:400}
        .mpm a{color:inherit}

        .mpm .topbar{display:flex;justify-content:space-between;align-items:center;padding:18px 0;border-bottom:1px solid var(--line)}
        .mpm .logo{font-family:'Space Grotesk';font-weight:700;font-size:19px;text-decoration:none;color:var(--cream)}
        .mpm .logo b{color:var(--pink)}
        .mpm .navlinks{display:flex;gap:22px;font-size:13px;color:var(--dim)}
        .mpm .navlinks a{text-decoration:none}
        .mpm .navlinks a:hover{color:var(--cream)}
        .mpm .crumb{font-size:11.5px;color:var(--dim);padding:14px 0 0}
        .mpm .crumb b{color:var(--rose);font-weight:600}

        .mpm section{padding:52px 0}
        .mpm .kicker{font-size:11.5px;letter-spacing:.22em;text-transform:uppercase;color:var(--pink);margin-bottom:10px;text-align:center}
        .mpm h2{font-size:clamp(22px,4vw,30px);letter-spacing:-.02em;margin-bottom:12px;text-align:center}
        .mpm h2 em{color:var(--pink)}
        .mpm .lede{color:var(--dim);max-width:560px;margin:0 auto 30px;font-size:14.5px;text-align:center}

        .mpm .hero{text-align:center;padding:46px 0 10px}
        .mpm .eyebrow{font-size:11.5px;letter-spacing:.22em;text-transform:uppercase;color:var(--rose);border:1px solid rgba(255,92,138,.4);display:inline-block;padding:6px 16px;border-radius:99px;margin-bottom:20px}
        .mpm .hero h1{font-size:clamp(30px,5.4vw,46px);letter-spacing:-.03em;line-height:1.12;max-width:680px;margin:0 auto 16px}
        .mpm .hero h1 em{color:var(--pink)}
        .mpm .hero-sub{color:var(--dim);max-width:520px;margin:0 auto 34px;font-size:15px}

        .mpm .matchform{max-width:560px;margin:0 auto;background:var(--panel);border:1px solid var(--line);border-radius:20px;padding:26px 24px}
        .mpm .formrow{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:14px}
        @media(max-width:520px){.mpm .formrow{grid-template-columns:1fr}}
        .mpm .fgroup label{display:block;font-size:10.5px;letter-spacing:.1em;text-transform:uppercase;color:var(--dim);margin-bottom:7px}
        .mpm .fgroup input{width:100%;background:var(--bg);border:1px solid var(--line);border-radius:10px;color:var(--cream);
          font-family:'Inter';font-size:14px;padding:11px 12px}
        .mpm .fgroup input:focus{outline:none;border-color:var(--pink)}
        .mpm .revealbtn{width:100%;background:linear-gradient(90deg,var(--pink),var(--red));color:#fff;border:none;font-family:'Space Grotesk';
          font-weight:700;font-size:15px;padding:14px;border-radius:99px;cursor:pointer;margin-top:6px;box-shadow:0 8px 26px rgba(255,59,82,.3);transition:transform .2s}
        .mpm .revealbtn:hover{transform:translateY(-2px)}
        .mpm .trustrow{text-align:center;color:var(--dim);font-size:11.5px;margin-top:14px;letter-spacing:.02em}

        .mpm .mooncard{
          max-width:460px;margin:40px auto 0;position:relative;overflow:hidden;
          background:linear-gradient(170deg,#1c0b16,#241019 60%,#2c1521);
          border:1px solid var(--line);border-radius:26px;padding:38px 30px 28px;text-align:center;
          box-shadow:0 24px 70px rgba(255,59,82,.14), inset 0 1px 0 rgba(255,255,255,.04);
        }
        .mpm .grain{position:absolute;inset:0;opacity:.05;mix-blend-mode:overlay;pointer-events:none}
        .mpm .mooncard .stars i{position:absolute;background:var(--rose);border-radius:50%;opacity:.5;animation:mpmtw 3s ease-in-out infinite}
        @keyframes mpmtw{50%{opacity:.12}}
        .mpm .mc-label{font-size:10.5px;letter-spacing:.3em;text-transform:uppercase;color:var(--dim);position:relative}
        .mpm .mc-names{font-family:'Space Grotesk';font-weight:700;font-size:26px;margin-top:8px;position:relative}
        .mpm .mc-names span{color:var(--pink);font-family:'Instrument Serif',Georgia,serif;font-style:italic;font-weight:400}
        .mpm .mc-sub{font-size:12px;color:var(--dim);margin-top:6px;position:relative}
        .mpm .moon-row{display:flex;align-items:center;justify-content:center;gap:6px;margin:30px 0 6px;position:relative}
        .mpm .moon-cell{flex:1;max-width:130px}
        .mpm .moon-cell svg{width:100%;height:auto;display:block}
        .mpm .moon-cell .ph{font-family:'Space Grotesk';font-size:12px;margin-top:10px}
        .mpm .moon-cell .nm{font-size:10px;color:var(--dim);letter-spacing:.08em;text-transform:uppercase}
        .mpm .moon-plus{font-family:'Instrument Serif',Georgia,serif;font-style:italic;color:var(--pink);font-size:26px}
        .mpm .merge{margin:22px auto 4px;max-width:220px;position:relative}
        .mpm .merge svg{width:100%;height:auto;display:block;filter:drop-shadow(0 0 30px rgba(255,179,199,.22))}
        .mpm .merge-label{font-size:10px;letter-spacing:.24em;text-transform:uppercase;color:var(--dim);margin-top:12px}
        .mpm .mc-verdict{margin-top:18px;font-family:'Instrument Serif',Georgia,serif;font-style:italic;font-size:16px;line-height:1.55;color:var(--cream);min-height:70px}
        .mpm .mc-verdict b{color:var(--pink);font-style:normal;font-family:'Space Grotesk';font-weight:700}
        .mpm .mc-foot{margin-top:22px;border-top:1px dashed var(--line);padding-top:13px;display:flex;justify-content:space-between;align-items:center;font-size:10.5px;color:var(--dim)}
        .mpm .mc-foot b{color:var(--cream);font-family:'Space Grotesk'}
        .mpm .mc-foot .verified{display:inline-flex;align-items:center;gap:5px}
        .mpm .mc-foot .verified svg{width:11px;height:11px;flex:none}

        .mpm .ctarow{display:flex;gap:14px;justify-content:center;flex-wrap:wrap;max-width:460px;margin:26px auto 0}
        .mpm .ctabtn{flex:1;min-width:170px;text-align:center;padding:15px 18px;border-radius:14px;font-family:'Space Grotesk';font-weight:700;font-size:14px;text-decoration:none;cursor:pointer;border:1px solid var(--line);background:transparent;color:inherit}
        .mpm .ctabtn.ghost{background:transparent;color:var(--cream)}
        .mpm .ctabtn.ghost:hover{border-color:var(--pink)}
        .mpm .ctabtn.ghost:disabled{opacity:.6;cursor:wait}
        .mpm .ctabtn.solid{background:linear-gradient(90deg,var(--pink),var(--red));color:#fff;border:none;box-shadow:0 8px 26px rgba(255,59,82,.3)}
        .mpm .ctabtn small{display:block;font-family:'Inter';font-weight:400;font-size:11px;opacity:.8;margin-top:2px}

        .mpm .compare{display:grid;grid-template-columns:1fr 1fr;gap:18px;max-width:720px;margin:0 auto}
        @media(max-width:640px){.mpm .compare{grid-template-columns:1fr}}
        .mpm .cpanel{background:var(--panel);border:1px solid var(--line);border-radius:18px;padding:22px 22px 20px}
        .mpm .cpanel.bad{opacity:.85}
        .mpm .cpanel h3{font-size:13.5px;letter-spacing:.06em;text-transform:uppercase;margin-bottom:14px;color:var(--dim)}
        .mpm .cpanel.good h3{color:var(--pink)}
        .mpm .cpanel li{list-style:none;font-size:13.5px;color:#ecd4dd;padding:6px 0 6px 24px;position:relative;line-height:1.5}
        .mpm .cpanel.bad li::before{content:"✗";position:absolute;left:0;color:var(--red)}
        .mpm .cpanel.good li::before{content:"✓";position:absolute;left:0;color:var(--mint);font-weight:700}
        .mpm .cpanel .steps{font-size:11px;color:var(--dim);margin-top:12px;border-top:1px dashed var(--line);padding-top:10px}

        .mpm .edu{max-width:680px;margin:0 auto}
        .mpm .edu p{color:#ecd4dd;font-size:14.5px;margin-bottom:14px}
        .mpm .edu b{color:var(--cream)}
        .mpm .edu-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:22px}
        @media(max-width:600px){.mpm .edu-grid{grid-template-columns:1fr}}
        .mpm .edu-card{background:var(--panel);border:1px solid var(--line);border-radius:16px;padding:18px 20px}
        .mpm .edu-card h4{font-family:'Space Grotesk';font-size:14px;color:var(--pink);margin-bottom:8px}
        .mpm .edu-card p{font-size:13px;color:var(--dim);margin:0}

        .mpm .tgrid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;max-width:820px;margin:0 auto}
        @media(max-width:760px){.mpm .tgrid{grid-template-columns:1fr 1fr}}
        @media(max-width:520px){.mpm .tgrid{grid-template-columns:1fr}}
        .mpm .tcard{background:var(--panel);border:1px solid var(--line);border-radius:16px;padding:18px}
        .mpm .tcard .stars2{color:var(--pink);font-size:12px;letter-spacing:2px;margin-bottom:8px}
        .mpm .tcard p{font-size:13px;color:#ecd4dd;line-height:1.55;margin-bottom:12px}
        .mpm .tcard .who{font-size:11.5px;color:var(--dim)}
        .mpm .tcard .who b{color:var(--cream);font-family:'Space Grotesk'}

        .mpm .offerbox{max-width:460px;margin:0 auto;background:linear-gradient(165deg,#2c1521,var(--panel));border:1px solid rgba(255,92,138,.5);border-radius:22px;padding:30px 28px;text-align:center}
        .mpm .offerbox .tag2{font-size:10.5px;letter-spacing:.14em;text-transform:uppercase;color:var(--pink)}
        .mpm .offerbox .price{font-family:'Space Grotesk';font-weight:700;font-size:40px;margin:10px 0 16px}
        .mpm .offerbox .price span{font-size:14px;color:var(--dim);font-weight:400}
        .mpm .offerbox ul{text-align:left;max-width:300px;margin:0 auto 20px;list-style:none}
        .mpm .offerbox li{font-size:13.5px;color:#ecd4dd;padding:5px 0 5px 22px;position:relative}
        .mpm .offerbox li::before{content:"✓";position:absolute;left:0;color:var(--mint);font-weight:700}
        .mpm .offerbox .btn3{display:block;background:linear-gradient(90deg,var(--pink),var(--red));color:#fff;border:none;font-family:'Space Grotesk';font-weight:700;font-size:14.5px;padding:14px;border-radius:99px;text-decoration:none;box-shadow:0 8px 26px rgba(255,59,82,.3)}

        .mpm .decoder-preview{max-width:520px;margin:24px auto 0;background:var(--panel2);border:1px solid var(--line);border-radius:16px;padding:20px 22px}
        .mpm .decoder-preview .dlabel{font-size:10.5px;letter-spacing:.16em;text-transform:uppercase;color:var(--pink);margin-bottom:12px}
        .mpm .dstep{font-size:13px;color:#ecd4dd;margin-bottom:8px;line-height:1.5}
        .mpm .dstep .who{color:var(--dim);font-size:10.5px;letter-spacing:.1em;text-transform:uppercase;display:block;margin-bottom:2px}
        .mpm .dstep .meaning{font-family:'Instrument Serif',Georgia,serif;font-style:italic;color:var(--rose);display:block;margin-top:2px}
        .mpm .dnote{font-size:13px;color:var(--cream);margin-top:12px;padding-top:12px;border-top:1px dashed var(--line)}
        .mpm .chipwrap{display:flex;flex-wrap:wrap;gap:8px;justify-content:center;max-width:640px;margin:22px auto 0}
        .mpm .chip{background:var(--panel);border:1px solid var(--line);border-radius:99px;padding:8px 16px;font-size:12px;color:var(--dim)}
        .mpm .unlock-cta{text-align:center;margin-top:26px}
        .mpm .unlock-cta p{color:var(--dim);font-size:13px;margin-bottom:12px}

        .mpm .faq{max-width:680px;margin:0 auto}
        .mpm .fitem{border-bottom:1px solid var(--line)}
        .mpm .fq{display:flex;justify-content:space-between;align-items:center;padding:16px 4px;cursor:pointer;font-family:'Space Grotesk';font-size:14.5px}
        .mpm .farrow{color:var(--pink);transition:transform .3s ease}
        .mpm .fitem.open .farrow{transform:rotate(180deg)}
        .mpm .fa{max-height:0;overflow:hidden;transition:max-height .5s ease}
        .mpm .fitem.open .fa{max-height:220px}
        .mpm .fa p{font-size:13.5px;color:var(--dim);padding:0 4px 16px;line-height:1.6}
      `}</style>

      <div className="mpm">
        <div className="wrap topbar">
          <Link href="/" className="logo">Blunt<b>Chart</b></Link>
          <div className="navlinks">
            <Link href="/#try-it">Birth Chart</Link>
            <Link href="/#waitlist">Compatibility</Link>
            <Link href="/#try-it">Full Reading $15</Link>
          </div>
        </div>
        <div className="wrap crumb">
          <Link href="/">BluntChart</Link> / <b>Moon Phase Match</b>
        </div>

        {/* ================= HERO ================= */}
        <div className="wrap"><div className="hero">
          <div className="eyebrow">✦ 147M+ views on TikTok · zero CapCut required ✦</div>
          <h1>Do your moons <em>actually</em> make a full moon?</h1>
          <p className="hero-sub">The trend, minus the thirteen steps. Enter two birthdays — we calculate both real moon phases and hand you one merged card, already shareable.</p>

          <form className="matchform" id="matchForm">
            <div className="formrow">
              <div className="fgroup"><label>Your first name</label><input type="text" id="d1Name" defaultValue="Emma" /></div>
              <div className="fgroup"><label>Your birthday</label><input type="date" id="d1Date" defaultValue="1998-06-14" /></div>
            </div>
            <div className="formrow">
              <div className="fgroup"><label>Their first name</label><input type="text" id="d2Name" defaultValue="Jake" /></div>
              <div className="fgroup"><label>Their birthday</label><input type="date" id="d2Date" defaultValue="1996-03-02" /></div>
            </div>
            <button type="submit" className="revealbtn">Reveal our match ✨</button>
          </form>
          <div className="trustrow">Just two birthdays. No sign-in. No CapCut.</div>

          {/* ============ CARD ============ */}
          <div className="mooncard" id="mooncard" ref={cardRef}>
            <svg className="grain" width="100%" height="100%" preserveAspectRatio="none">
              <filter id="noise"><feTurbulence type="fractalNoise" baseFrequency={0.85} numOctaves={2} stitchTiles="stitch" /></filter>
              <rect width="100%" height="100%" filter="url(#noise)" />
            </svg>
            <div className="stars" aria-hidden="true">
              <i style={{ top: "8%", left: "10%", width: 2, height: 2 }}></i>
              <i style={{ top: "14%", left: "84%", width: 3, height: 3, animationDelay: ".8s" }}></i>
              <i style={{ top: "30%", left: "6%", width: 2, height: 2, animationDelay: "1.4s" }}></i>
              <i style={{ top: "24%", left: "92%", width: 2, height: 2, animationDelay: "2s" }}></i>
              <i style={{ top: "70%", left: "8%", width: 2, height: 2, animationDelay: ".4s" }}></i>
              <i style={{ top: "78%", left: "90%", width: 3, height: 3, animationDelay: "1.1s" }}></i>
            </div>

            <div className="mc-label">✦ Moon Phase Match ✦</div>
            <div className="mc-names"><span id="outName1">Emma</span> <span>&amp;</span> <span id="outName2">Jake</span></div>
            <div className="mc-sub" id="outDates">Jun 14, 1998 &nbsp;×&nbsp; Mar 2, 1996</div>

            <div className="moon-row">
              <div className="moon-cell">
                <svg viewBox="0 0 200 200">
                  <defs>
                    <filter id="aSoft"><feGaussianBlur stdDeviation={2.2} /></filter>
                    <filter id="aTex"><feGaussianBlur stdDeviation={3} /></filter>
                    <radialGradient id="aLit" cx="35%" cy="30%" r="75%">
                      <stop offset="0%" stopColor="#fff6f1" /><stop offset="55%" stopColor="#f2dfe6" /><stop offset="100%" stopColor="#c9aebd" />
                    </radialGradient>
                    <radialGradient id="aDark" cx="60%" cy="42%" r="70%">
                      <stop offset="0%" stopColor="#26111c" /><stop offset="100%" stopColor="#170a12" />
                    </radialGradient>
                    <clipPath id="aClip"><circle cx={100} cy={100} r={78} /></clipPath>
                    <mask id="aMask"><rect width={200} height={200} fill="black" />
                      <rect id="aHalf" x={100} y={0} width={78} height={200} fill="white" filter="url(#aSoft)" />
                      <ellipse id="aEllipse" cx={100} cy={100} rx={78} ry={78} fill="black" filter="url(#aSoft)" />
                    </mask>
                  </defs>
                  <circle cx={100} cy={100} r={78} fill="url(#aDark)" />
                  <g mask="url(#aMask)" clipPath="url(#aClip)">
                    <circle cx={100} cy={100} r={78} fill="url(#aLit)" />
                    <g filter="url(#aTex)" opacity={.55}>
                      <ellipse cx={78} cy={85} rx={22} ry={16} fill="#7d5f72" />
                      <ellipse cx={120} cy={70} rx={14} ry={11} fill="#7d5f72" />
                      <ellipse cx={110} cy={125} rx={26} ry={18} fill="#7d5f72" />
                      <ellipse cx={70} cy={135} rx={12} ry={9} fill="#7d5f72" />
                    </g>
                  </g>
                  <circle cx={100} cy={100} r={78} fill="none" stroke="#5e3a49" strokeWidth={1.5} />
                </svg>
                <div className="ph" id="ph1">Waxing Crescent</div>
                <div className="nm" id="il1">Her birth moon · 16% lit</div>
              </div>

              <div className="moon-plus">+</div>

              <div className="moon-cell">
                <svg viewBox="0 0 200 200">
                  <defs>
                    <filter id="bSoft"><feGaussianBlur stdDeviation={2.2} /></filter>
                    <filter id="bTex"><feGaussianBlur stdDeviation={3} /></filter>
                    <radialGradient id="bLit" cx="35%" cy="30%" r="75%">
                      <stop offset="0%" stopColor="#fff6f1" /><stop offset="55%" stopColor="#f2dfe6" /><stop offset="100%" stopColor="#c9aebd" />
                    </radialGradient>
                    <radialGradient id="bDark" cx="60%" cy="42%" r="70%">
                      <stop offset="0%" stopColor="#26111c" /><stop offset="100%" stopColor="#170a12" />
                    </radialGradient>
                    <clipPath id="bClip"><circle cx={100} cy={100} r={78} /></clipPath>
                    <mask id="bMask"><rect width={200} height={200} fill="black" />
                      <rect id="bHalf" x={100} y={0} width={78} height={200} fill="white" filter="url(#bSoft)" />
                      <ellipse id="bEllipse" cx={100} cy={100} rx={78} ry={78} fill="black" filter="url(#bSoft)" />
                    </mask>
                  </defs>
                  <circle cx={100} cy={100} r={78} fill="url(#bDark)" />
                  <g mask="url(#bMask)" clipPath="url(#bClip)">
                    <circle cx={100} cy={100} r={78} fill="url(#bLit)" />
                    <g filter="url(#bTex)" opacity={.55}>
                      <ellipse cx={88} cy={80} rx={20} ry={15} fill="#7d5f72" />
                      <ellipse cx={70} cy={118} rx={24} ry={17} fill="#7d5f72" />
                      <ellipse cx={115} cy={135} rx={13} ry={10} fill="#7d5f72" />
                    </g>
                  </g>
                  <circle cx={100} cy={100} r={78} fill="none" stroke="#5e3a49" strokeWidth={1.5} />
                </svg>
                <div className="ph" id="ph2">Waning Gibbous</div>
                <div className="nm" id="il2">His birth moon · 56% lit</div>
              </div>
            </div>

            <div className="merge">
              <svg viewBox="0 0 240 240">
                <defs>
                  <filter id="mSoft"><feGaussianBlur stdDeviation={2.4} /></filter>
                  <filter id="mTex"><feGaussianBlur stdDeviation={3} /></filter>
                  <radialGradient id="mLit" cx="35%" cy="30%" r="75%">
                    <stop offset="0%" stopColor="#fff6f1" /><stop offset="55%" stopColor="#f2dfe6" /><stop offset="100%" stopColor="#c9aebd" />
                  </radialGradient>
                  <radialGradient id="mDark" cx="60%" cy="42%" r="70%">
                    <stop offset="0%" stopColor="#26111c" /><stop offset="100%" stopColor="#170a12" />
                  </radialGradient>
                  <linearGradient id="mRing" x1={0} y1={0} x2={1} y2={1}>
                    <stop offset="0%" stopColor="#ff5c8a" /><stop offset="100%" stopColor="#ff3b52" />
                  </linearGradient>
                  <clipPath id="mClip"><circle cx={120} cy={120} r={82} /></clipPath>
                  <mask id="mMaskA"><rect width={240} height={240} fill="black" />
                    <rect id="mHalfA" x={120} y={0} width={82} height={240} fill="white" filter="url(#mSoft)" />
                    <ellipse id="mEllipseA" cx={120} cy={120} rx={82} ry={82} fill="black" filter="url(#mSoft)" />
                  </mask>
                  <mask id="mMaskB"><rect width={240} height={240} fill="black" />
                    <rect id="mHalfB" x={120} y={0} width={82} height={240} fill="white" filter="url(#mSoft)" />
                    <ellipse id="mEllipseB" cx={120} cy={120} rx={82} ry={82} fill="black" filter="url(#mSoft)" />
                  </mask>
                </defs>

                <circle cx={120} cy={120} r={100} fill="none" stroke="#3a1c29" strokeWidth={6} />
                <circle id="ringFill" cx={120} cy={120} r={100} fill="none" stroke="url(#mRing)" strokeWidth={6}
                  strokeLinecap="round" strokeDasharray="0 999" transform="rotate(-90 120 120)" />

                <circle cx={120} cy={120} r={82} fill="url(#mDark)" />
                <g mask="url(#mMaskA)" clipPath="url(#mClip)">
                  <circle cx={120} cy={120} r={82} fill="url(#mLit)" />
                  <g filter="url(#mTex)" opacity={.5}>
                    <ellipse cx={98} cy={102} rx={24} ry={17} fill="#7d5f72" />
                    <ellipse cx={128} cy={150} rx={28} ry={19} fill="#7d5f72" />
                  </g>
                </g>
                <g mask="url(#mMaskB)" clipPath="url(#mClip)">
                  <circle cx={120} cy={120} r={82} fill="url(#mLit)" />
                  <g filter="url(#mTex)" opacity={.5}>
                    <ellipse cx={140} cy={88} rx={15} ry={11} fill="#7d5f72" />
                    <ellipse cx={85} cy={150} rx={13} ry={10} fill="#7d5f72" />
                  </g>
                </g>
                <circle cx={120} cy={120} r={82} fill="none" stroke="#5e3a49" strokeWidth={1.5} />

                <rect x={62} y={172} width={116} height={46} rx={12} fill="rgba(10,4,8,.55)" />
                <text x={120} y={197} textAnchor="middle" fontFamily="Space Grotesk" fontWeight={700} fontSize={24} fill="#ff5c8a" id="pctNum">0%</text>
                <text x={120} y={211} textAnchor="middle" fontFamily="Inter" fontSize={8} letterSpacing={1.4} fill="#cf9cae">OF A FULL MOON</text>
              </svg>
              <div className="merge-label">Your moons, combined</div>
            </div>

            <p className="mc-verdict" id="verdictText">By TikTok law: not soulmates. <b>By actual astrology:</b> phase was never the part that mattered. <b>We checked.</b></p>

            <div className="mc-foot">
              <div><b>bluntchart.com</b>/moon-match</div>
              <div className="verified">
                <svg viewBox="0 0 24 24" fill="none" stroke="#8be0b0" strokeWidth={2.5}><path d="M20 6L9 17l-5-5" /></svg>
                Real ephemeris · not a filter
              </div>
            </div>
          </div>

          <div className="ctarow">
            <button type="button" className="ctabtn ghost" onClick={handleShare} disabled={shareState === "busy"}>
              {shareState === "busy" ? "Preparing…" : "Share free"}<small>Watermarked, standard res</small>
            </button>
            <Link href="/#waitlist" className="ctabtn solid">$9 — Unlock HD<small>+ the real astrology read</small></Link>
          </div>
        </div></div>

        {/* ================= WHY ================= */}
        <div className="wrap"><section>
          <div className="kicker">The DIY version vs. this</div>
          <h2>You could screenshot this yourself. <em>Or not.</em></h2>
          <p className="lede">This is the actual 13-step process the trend currently requires — and the one step it takes here.</p>
          <div className="compare">
            <div className="cpanel bad">
              <h3>The TikTok way</h3>
              <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
                <li>Find a moon phase site, enter your birthday</li>
                <li>Screenshot it, crop it by hand</li>
                <li>Repeat for your partner, crop again</li>
                <li>Download CapCut, find the right template</li>
                <li>Import both crops, retype both dates</li>
                <li>Export, then finally post</li>
              </ul>
              <div className="steps">13 steps · 2 apps · zero designed result</div>
            </div>
            <div className="cpanel good">
              <h3>The BluntChart way</h3>
              <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
                <li>Enter two birthdays</li>
                <li>We calculate both real moon phases</li>
                <li>Get one merged, designed card</li>
                <li>Share it or download the HD version</li>
              </ul>
              <div className="steps">1 step · 0 apps · one card built to be posted</div>
            </div>
          </div>
        </section></div>

        {/* ================= EDUCATIONAL ================= */}
        <div className="wrap"><section>
          <div className="kicker">The part everyone skips</div>
          <h2>A moon <em>phase</em> is not a moon <em>sign.</em> We check both.</h2>
          <div className="edu">
            <p><b>Your moon phase</b> is a simple physical fact — how much of the moon was lit on the night you were born. Everyone born that day, anywhere on Earth, shares it. It&apos;s why the TikTok version works off nothing but a date.</p>
            <p><b>Your moon sign</b> is which zodiac sign the moon was passing through at your exact birth time — the placement that actually governs emotional wiring, what you need to feel safe, and how you fight. It&apos;s the difference between a pretty picture and an actual insight.</p>
            <p>The free card above is the phase — real, calculated, still just the picture. The full unlock adds the sign-level read, the same data your Compatibility Reading is built on.</p>
            <div className="edu-grid">
              <div className="edu-card"><h4>Moon phase</h4><p>Physical fact. Same for everyone born that day. Needs only a date.</p></div>
              <div className="edu-card"><h4>Moon sign</h4><p>Astrological placement. Unique to your exact birth time. Needs a chart.</p></div>
            </div>
          </div>
        </section></div>

        {/* ================= COMPATIBILITY READING PREVIEW ================= */}
        <div className="wrap"><section>
          <div className="kicker">Where the moon sign read actually comes from</div>
          <h2>The card is one placement. <em>The reading is all eleven.</em></h2>
          <p className="lede">Same two birthdays, same real ephemeris — just the full chart instead of one crescent. Here&apos;s an unedited piece of Module 4.</p>

          <div className="decoder-preview">
            <div className="dlabel">Fight Decoder · your most common fight, translated live</div>
            <div className="dstep"><span className="who">She says</span>&quot;Just decide. Why does everything take you two weeks?&quot;<span className="meaning">What she means: &quot;Show me I&apos;m a priority.&quot;</span></div>
            <div className="dstep"><span className="who">He hears</span>&quot;You&apos;re failing. You&apos;re too slow.&quot;</div>
            <div className="dstep"><span className="who">He says</span>&quot;I need time. Stop pushing.&quot;<span className="meaning">What he means: &quot;I want to get this right — for us.&quot;</span></div>
            <div className="dnote">Neither of you is wrong. You&apos;re speaking two different emotional languages — and this is one of eleven modules that spell out exactly which ones.</div>
          </div>

          <div className="chipwrap">
            <div className="chip">Attraction Chemistry — 7 scores</div>
            <div className="chip">Emotional Safety — who chases, who withdraws</div>
            <div className="chip">Green Flags</div>
            <div className="chip">Red Flags</div>
            <div className="chip">The Hidden Pattern</div>
            <div className="chip">Relationship Timeline</div>
            <div className="chip">What Each Person Needs</div>
            <div className="chip">The Brutal Truth</div>
            <div className="chip">+ a Fight Card for both of you</div>
          </div>

          <div className="unlock-cta">
            <p>Your $9 unlock already counts toward it — add $15 for the rest.</p>
            <Link href="/#waitlist" className="ctabtn solid" style={{ display: "inline-block" }}>See the full Compatibility Reading — $24</Link>
          </div>
        </section></div>

        {/* ================= TESTIMONIALS ================= */}
        <div className="wrap"><section>
          <div className="kicker">People keep sending it to their friends</div>
          <h2>Real reactions. <em>Unfiltered,</em> because that&apos;s the whole point.</h2>
          <div className="tgrid">
            <div className="tcard"><div className="stars2">★★★★★</div><p>&quot;I&apos;ve done this trend four separate times with different DIY sites. This is the first one that looked like something instead of a screenshot collage.&quot;</p><div className="who"><b>Priya M.</b> · posted hers in under a minute</div></div>
            <div className="tcard"><div className="stars2">★★★★★</div><p>&quot;Ours only made it to 61%. I was ready to be sad about it until I read the actual astrology line. Rude, but fair.&quot;</p><div className="who"><b>Jordan K.</b> · Gemini Sun, Pisces Moon</div></div>
            <div className="tcard"><div className="stars2">★★★★★</div><p>&quot;Did this for my best friend, not a partner. Nobody tells you it works for that too. Now it&apos;s both our lock screens.&quot;</p><div className="who"><b>Ade O.</b> · friendship match, 84%</div></div>
          </div>
        </section></div>

        {/* ================= PRICING ================= */}
        <div className="wrap"><section id="pricing">
          <div className="kicker">The card above is already yours</div>
          <h2>Watermarked and free, <em>no time limit.</em> One thing costs $9.</h2>
          <p className="lede">Nothing to buy to use it. Share it as many times as you want. Here&apos;s what unlocking adds.</p>
          <div className="offerbox">
            <div className="tag2">One-time · no subscription</div>
            <div className="price">$9<span> · not $24</span></div>
            <ul>
              <li>HD download, no watermark</li>
              <li>The real astrology paragraph — Moon sign, not just phase</li>
              <li>Yours forever, share it anywhere</li>
              <li>Counts as a $9 credit toward your full Compatibility Reading</li>
            </ul>
            <Link href="/#waitlist" className="btn3">Join the waitlist — unlock at launch</Link>
          </div>
        </section></div>

        {/* ================= FAQ ================= */}
        <div className="wrap"><section>
          <div className="kicker">Common questions</div>
          <h2>Everything you&apos;re <em>wondering about.</em></h2>
          <div className="faq" id="faq">
            {FAQS.map((f) => (
              <FaqItem key={f.q} q={f.q} a={f.a} />
            ))}
          </div>
        </section></div>
      </div>
    </>
  );
}
