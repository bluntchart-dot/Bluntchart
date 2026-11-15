"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function SiteNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <>
      <style>{`
        .sn{position:fixed;top:0;left:0;right:0;z-index:100;padding:14px 0;transition:all .3s}
        .sn.on{background:rgba(9,9,15,.94);border-bottom:1px solid rgba(255,255,255,0.08);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px)}
        .sn-i{max-width:1100px;margin:0 auto;padding:0 20px;display:flex;align-items:center;justify-content:space-between}
        .sn-logo{display:flex;align-items:center;gap:8px;text-decoration:none;flex-shrink:0}
        .sn-logo-t{font-family:var(--font-display,'Playfair Display',Georgia,serif);font-size:1.15rem;font-weight:700;background:linear-gradient(135deg,#f0b84a,#d4537e,#6b2fd4);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
        .sn-links{display:flex;align-items:center;gap:24px;list-style:none;margin:0;padding:0}
        .sn-links a{font-size:13px;font-weight:500;color:rgba(232,228,240,0.55);text-decoration:none;letter-spacing:.03em;text-transform:uppercase;transition:color .2s;white-space:nowrap}
        .sn-links a:hover{color:#e8e4f0}
        .sn-cta{color:#F0B84A!important;border:1px solid rgba(240,184,74,0.18);padding:6px 14px;border-radius:4px;font-weight:600!important}
        .sn-cta:hover{background:rgba(240,184,74,0.1)}
        .sn-ham{display:none;flex-direction:column;gap:5px;background:none;border:none;cursor:pointer;padding:6px;-webkit-tap-highlight-color:transparent}
        .sn-ham-l{display:block;width:22px;height:2px;background:rgba(232,228,240,.65);border-radius:2px;transition:all .25s}
        .sn-ham-l.open:nth-child(1){transform:rotate(45deg) translate(5px,5px)}
        .sn-ham-l.open:nth-child(2){opacity:0}
        .sn-ham-l.open:nth-child(3){transform:rotate(-45deg) translate(5px,-5px)}
        @media(max-width:768px){
          .sn-ham{display:flex}
          .sn-links{display:none;position:fixed;top:0;left:0;right:0;bottom:0;flex-direction:column;background:rgba(9,9,15,.98);padding:80px 24px 40px;gap:0;overflow-y:auto;-webkit-overflow-scrolling:touch}
          .sn-links.open{display:flex}
          .sn-links a{font-size:1rem;padding:16px 0;border-bottom:1px solid rgba(255,255,255,0.06);display:block;width:100%}
          .sn-links a:last-child{border-bottom:none}
          .sn-cta{text-align:center;margin-top:8px;border:1px solid rgba(240,184,74,0.25);padding:14px;border-radius:8px;background:rgba(240,184,74,0.06)}
        }
      `}</style>
      <nav className={`sn${scrolled ? " on" : ""}`}>
        <div className="sn-i">
          <Link href="/" className="sn-logo">
            <Image src="/mascot.png" alt="BluntChart" width={30} height={30} style={{ borderRadius: "50%" }} />
            <span className="sn-logo-t">BluntChart</span>
          </Link>
          <button className="sn-ham" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu" type="button" style={{ zIndex: 101 }}>
            <span className={`sn-ham-l${menuOpen ? " open" : ""}`} />
            <span className={`sn-ham-l${menuOpen ? " open" : ""}`} />
            <span className={`sn-ham-l${menuOpen ? " open" : ""}`} />
          </button>
          <ul className={`sn-links${menuOpen ? " open" : ""}`}>
            <li><Link href="/#try-it" onClick={() => setMenuOpen(false)}>Try Free</Link></li>
            <li><Link href="/free-birth-chart-readings" onClick={() => setMenuOpen(false)}>How It Works</Link></li>
            <li><Link href="/zodiac-signs" onClick={() => setMenuOpen(false)}>Zodiac Signs</Link></li>
            <li><Link href="/future-love-letter" onClick={() => setMenuOpen(false)}>Love Letter</Link></li>
            <li><Link href="/in-depth-birth-chart" className="sn-cta" onClick={() => setMenuOpen(false)}>Reading $24</Link></li>
          </ul>
        </div>
      </nav>
    </>
  );
}
