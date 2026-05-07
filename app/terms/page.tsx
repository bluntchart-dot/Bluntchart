import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Terms of Service — BluntChart",
  description: "BluntChart Terms of Service.",
};

function PageShell({ title, updated, banner, sections }: {
  title: string;
  updated: string;
  banner: React.ReactNode;
  sections: { h: string; body: React.ReactNode }[];
}) {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        body{background:#09090f;color:#e8e4f0;font-family:'DM Sans',system-ui,sans-serif;font-size:16px;line-height:1.7;-webkit-font-smoothing:antialiased}
        a{color:#f0b84a;text-decoration:none}a:hover{text-decoration:underline}
      `}</style>
      <div style={{maxWidth:720,margin:"0 auto",padding:"96px 24px 80px"}}>
        <a href="/" style={{display:"inline-flex",alignItems:"center",gap:8,fontSize:".83rem",color:"rgba(232,228,240,.4)",marginBottom:48,letterSpacing:".04em",textTransform:"uppercase"}}>
          ← Back to BluntChart
        </a>
        <div style={{borderBottom:"0.5px solid rgba(255,255,255,.08)",paddingBottom:32,marginBottom:48}}>
          <p style={{fontSize:".7rem",fontWeight:700,letterSpacing:".16em",textTransform:"uppercase",color:"#f0b84a",marginBottom:12}}>Legal</p>
          <h1 style={{fontFamily:"'Playfair Display',Georgia,serif",fontSize:"clamp(2rem,5vw,3rem)",fontWeight:900,lineHeight:1.1,letterSpacing:"-.02em",marginBottom:12}}>{title}</h1>
          <p style={{fontSize:".85rem",color:"rgba(232,228,240,.4)"}}>Last updated: {updated}</p>
        </div>
        {banner}
        <div style={{display:"flex",flexDirection:"column",gap:40}}>
          {sections.map((s,i) => (
            <div key={i}>
              <h2 style={{fontFamily:"'Playfair Display',Georgia,serif",fontSize:"1.15rem",fontWeight:700,marginBottom:12,color:"#e8e4f0"}}>{s.h}</h2>
              <div style={{fontSize:".92rem",color:"rgba(232,228,240,.7)",lineHeight:1.75}}>{s.body}</div>
            </div>
          ))}
        </div>
        <div style={{marginTop:64,paddingTop:32,borderTop:"0.5px solid rgba(255,255,255,.08)",fontSize:".82rem",color:"rgba(232,228,240,.3)"}}>
          Questions? <a href="mailto:hello@bluntchart.com">hello@bluntchart.com</a>
        </div>
      </div>
    </>
  );
}

const Banner = ({ text }: { text: React.ReactNode }) => (
  <div style={{background:"rgba(240,184,74,.07)",border:"0.5px solid rgba(240,184,74,.25)",borderRadius:12,padding:"16px 20px",marginBottom:48,borderLeft:"3px solid #f0b84a"}}>
    <p style={{fontSize:".9rem",color:"rgba(232,228,240,.75)",lineHeight:1.65}}>{text}</p>
  </div>
);

export default function TermsPage() {
  return (
    <PageShell
      title="Terms of Service"
      updated="25 April 2026"
      banner={
        <Banner text={<><strong style={{color:"#f0b84a"}}>Entertainment only.</strong> BluntChart is an astrology entertainment service. Nothing here constitutes medical, psychological, financial, or legal advice. By using BluntChart you confirm you understand this.</>} />
      }
      sections={[
        {
          h:"1. Acceptance of Terms",
          body:<>By accessing or using BluntChart (&ldquo;the Service&rdquo;), you agree to be bound by these Terms of Service. If you do not agree, do not use the Service. We may update these terms at any time &mdash; continued use after changes constitutes acceptance.</>
        },
        {
          h:"2. Nature of the Service",
          body:<>BluntChart provides AI-generated birth chart readings for entertainment purposes only. Our readings are based on Western tropical astrology and generated using artificial intelligence (Anthropic&rsquo;s Claude API). We do not claim astrology is scientifically proven. Nothing produced by BluntChart should be interpreted as professional advice of any kind &mdash; medical, psychological, financial, or legal. Do not make significant life decisions based solely on your reading.</>
        },
        {
          h:"3. Eligibility",
          body:<>You must be at least 18 years old to use BluntChart. By using the Service you confirm you are 18 or older. We do not knowingly collect data from anyone under 18.</>
        },
        {
          h:"4. Payments",
          body:<>BluntChart charges a one-time fee per reading. All prices are in USD. Payments are processed securely through Lemon Squeezy. We do not store your payment card details. By completing a purchase you also agree to Lemon Squeezy&rsquo;s terms of service.</>
        },
        {
          h:"5. Refund Policy",
          body:<>Because readings are digital products generated and delivered immediately upon payment, all sales are final. If a technical error prevents your reading from being generated or delivered, contact us and we will regenerate it or issue a full refund &mdash; no questions asked. See our full <a href="/refunds">Refund Policy</a>.</>
        },
        {
          h:"6. Intellectual Property",
          body:<>All content produced by BluntChart &mdash; including readings, shareable cards, and website copy &mdash; is the property of BluntChart. You may share your personal reading for personal, non-commercial purposes. You may not resell, reproduce, or redistribute our content for commercial gain without written permission.</>
        },
        {
          h:"7. User Data",
          body:<>We collect birth data (name, date, time, location) and payment email solely to provide the Service. We do not sell your data. See our <a href="/privacy">Privacy Policy</a> for full details.</>
        },
        {
          h:"8. Prohibited Use",
          body:<>You agree not to: (a) use the Service for any unlawful purpose; (b) attempt to reverse-engineer or extract our underlying AI prompts or systems; (c) resell or redistribute readings; (d) submit false birth data to manipulate results; (e) use automated systems to access the Service at scale.</>
        },
        {
          h:"9. Disclaimer of Warranties",
          body:<>BluntChart is provided &ldquo;as is&rdquo; without warranties of any kind. Astrology readings are interpretive and subjective. We do not guarantee that readings will be accurate, complete, or applicable to your circumstances.</>
        },
        {
          h:"10. Limitation of Liability",
          body:<>To the fullest extent permitted by law, BluntChart shall not be liable for any indirect, incidental, or consequential damages arising from your use of the Service. Our maximum liability shall not exceed the amount you paid for your reading.</>
        },
        {
          h:"11. Mental Health",
          body:<>If you are experiencing a mental health crisis, please contact a qualified professional or a crisis helpline. In the United States, call or text 988 (Suicide and Crisis Lifeline). BluntChart is not a substitute for mental health support.</>
        },
        {
          h:"12. Contact",
          body:<>For questions about these Terms: <a href="mailto:hello@bluntchart.com">hello@bluntchart.com</a></>
        },
      ]}
    />
  );
}