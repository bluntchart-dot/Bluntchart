import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Privacy Policy — BluntChart",
  description: "How BluntChart collects, uses, and protects your data.",
};

function PageShell({ title, updated, banner, sections }: {
  title: string; updated: string; banner: React.ReactNode;
  sections: { h: string; body: React.ReactNode }[];
}) {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        body{background:#09090f;color:#e8e4f0;font-family:'DM Sans',system-ui,sans-serif;font-size:16px;line-height:1.7;-webkit-font-smoothing:antialiased}
        a{color:#f0b84a;text-decoration:none}a:hover{text-decoration:underline}
        ul{padding-left:20px;display:flex;flex-direction:column;gap:6px}
        li{font-size:.92rem;color:rgba(232,228,240,.7);line-height:1.65}
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
          Privacy questions? <a href="mailto:hello@bluntchart.com">hello@bluntchart.com</a>
        </div>
      </div>
    </>
  );
}

const Banner = ({ text }: { text: React.ReactNode }) => (
  <div style={{background:"rgba(107,47,212,.07)",border:"0.5px solid rgba(107,47,212,.25)",borderRadius:12,padding:"16px 20px",marginBottom:48,borderLeft:"3px solid #6b2fd4"}}>
    <p style={{fontSize:".9rem",color:"rgba(232,228,240,.75)",lineHeight:1.65}}>{text}</p>
  </div>
);

export default function PrivacyPage() {
  return (
    <PageShell
      title="Privacy Policy"
      updated="25 April 2026"
      banner={
        <Banner text={<><strong style={{color:"#b8a0ff"}}>Short version:</strong> We collect only what we need to give you your reading. We do not sell your data. We do not share it with advertisers. You can request deletion at any time.</>} />
      }
      sections={[
        {
          h:"1. Who We Are",
          body:<>BluntChart is an astrology entertainment service accessible at bluntchart.com. For privacy enquiries contact <a href="mailto:hello@bluntchart.com">hello@bluntchart.com</a>.</>
        },
        {
          h:"2. What Data We Collect",
          body:<>
            <p style={{marginBottom:12}}>When you use BluntChart, we may collect:</p>
            <ul>
              <li><strong style={{color:"#e8e4f0"}}>Birth data</strong> &mdash; your name, date of birth, time of birth, and birth city/country. This is used solely to calculate your chart and generate your reading.</li>
              <li><strong style={{color:"#e8e4f0"}}>Payment email</strong> &mdash; collected by our payment processor (Lemon Squeezy) to deliver your reading and send your receipt.</li>
              <li><strong style={{color:"#e8e4f0"}}>Usage data</strong> &mdash; basic analytics (page views, session duration) collected via PostHog. No personally identifiable data is attached to this unless you consent.</li>
              <li><strong style={{color:"#e8e4f0"}}>Cookies</strong> &mdash; functional cookies only, required to operate the Service. We use a GDPR-compliant cookie consent mechanism.</li>
            </ul>
          </>
        },
        {
          h:"3. How We Use Your Data",
          body:<>
            <p style={{marginBottom:12}}>We use your data exclusively to:</p>
            <ul>
              <li>Calculate your natal birth chart</li>
              <li>Generate your personalised astrology reading via the Anthropic Claude API</li>
              <li>Deliver your reading by email (via Resend)</li>
              <li>Process your payment (via Lemon Squeezy)</li>
              <li>Improve the Service through anonymised usage analytics</li>
            </ul>
            <p style={{marginTop:12}}>We do <strong style={{color:"#e8e4f0"}}>not</strong> use your data for advertising, profiling, or any purpose beyond delivering your reading.</p>
          </>
        },
        {
          h:"4. Third-Party Services",
          body:<>
            <p style={{marginBottom:12}}>We use the following third-party services, each with their own privacy policies:</p>
            <ul>
              <li><strong style={{color:"#e8e4f0"}}>Anthropic (Claude API)</strong> &mdash; your birth data is sent to Anthropic&rsquo;s API to generate your reading. Anthropic&rsquo;s data handling is governed by their API usage policies.</li>
              <li><strong style={{color:"#e8e4f0"}}>Lemon Squeezy</strong> &mdash; payment processing. They receive your payment details and email address.</li>
              <li><strong style={{color:"#e8e4f0"}}>Supabase</strong> &mdash; database storage for readings. Hosted on infrastructure that meets industry security standards.</li>
              <li><strong style={{color:"#e8e4f0"}}>Resend</strong> &mdash; transactional email delivery.</li>
              <li><strong style={{color:"#e8e4f0"}}>PostHog</strong> &mdash; product analytics. Data is anonymised by default.</li>
              <li><strong style={{color:"#e8e4f0"}}>Vercel</strong> &mdash; hosting and infrastructure.</li>
            </ul>
          </>
        },
        {
          h:"5. Data Retention",
          body:<>We retain your reading data for up to 12 months so you can access it again. After that, it is deleted from our systems. You may request earlier deletion at any time by contacting us.</>
        },
        {
          h:"6. Your Rights (GDPR / CCPA)",
          body:<>
            <p style={{marginBottom:12}}>Depending on where you live, you may have the right to:</p>
            <ul>
              <li>Access the personal data we hold about you</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your data (&ldquo;right to be forgotten&rdquo;)</li>
              <li>Object to or restrict processing of your data</li>
              <li>Request portability of your data</li>
              <li>Withdraw consent at any time (where processing is based on consent)</li>
            </ul>
            <p style={{marginTop:12}}>To exercise any of these rights, email <a href="mailto:hello@bluntchart.com">hello@bluntchart.com</a>. We will respond within 30 days.</p>
          </>
        },
        {
          h:"7. Children",
          body:<>BluntChart is not intended for anyone under 18. We do not knowingly collect data from minors. If you believe we have collected data from someone under 18, contact us and we will delete it immediately.</>
        },
        {
          h:"8. Security",
          body:<>We take reasonable technical and organisational measures to protect your data. However, no internet transmission is 100% secure. We cannot guarantee absolute security but we follow industry-standard practices.</>
        },
        {
          h:"9. Cookies",
          body:<>We use strictly necessary cookies to operate the Service. We ask for your consent before placing any non-essential cookies. You can manage your cookie preferences at any time via the consent banner on the site.</>
        },
        {
          h:"10. Changes to This Policy",
          body:<>We may update this Privacy Policy from time to time. The &ldquo;Last updated&rdquo; date at the top of this page will reflect any changes. Continued use of BluntChart after changes constitutes acceptance of the updated policy.</>
        },
        {
          h:"11. Contact",
          body:<>For any privacy questions or requests: <a href="mailto:hello@bluntchart.com">hello@bluntchart.com</a></>
        },
      ]}
    />
  );
}