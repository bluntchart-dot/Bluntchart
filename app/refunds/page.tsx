import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Refund Policy — BluntChart",
  description: "BluntChart refund policy for birth chart readings.",
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
        <div style={{marginTop:64,padding:"24px 20px",background:"rgba(93,202,165,.06)",border:"0.5px solid rgba(93,202,165,.2)",borderRadius:12}}>
          <p style={{fontSize:".9rem",color:"rgba(232,228,240,.7)",marginBottom:8}}>
            <strong style={{color:"#5dcaa5"}}>Had an issue with your reading?</strong>
          </p>
          <p style={{fontSize:".88rem",color:"rgba(232,228,240,.5)",lineHeight:1.65}}>
            Email us at <a href="mailto:hello@bluntchart.com">hello@bluntchart.com</a> with your order details. We&rsquo;ll fix it or refund you &mdash; no drama, no waiting.
          </p>
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

export default function RefundsPage() {
  return (
    <PageShell
      title="Refund Policy"
      updated="25 April 2026"
      banner={
        <Banner text={<><strong style={{color:"#f0b84a"}}>Short version:</strong> All sales are final after delivery. If anything goes technically wrong &mdash; reading not delivered, error in generation &mdash; we will fix it or refund you in full, immediately.</>} />
      }
      sections={[
        {
          h:"Our Standard Policy",
          body:<>BluntChart sells digital products &mdash; personalised astrology readings generated and delivered immediately upon payment. Because readings are created instantly and delivered digitally, they cannot be &ldquo;returned&rdquo; in the traditional sense. All sales are therefore final once a reading has been successfully delivered.<p style={{marginTop:12}}>This is standard practice for digital goods and is consistent with consumer protection regulations in most jurisdictions.</p></>
        },
        {
          h:"When We Will Refund You",
          body:<>
            <p style={{marginBottom:12}}>We will issue a full refund, no questions asked, in any of the following cases:</p>
            <ul>
              <li>Your reading failed to generate due to a technical error on our end</li>
              <li>Your reading was not delivered to your email and cannot be recovered</li>
              <li>You were charged twice for the same reading</li>
              <li>A payment processing error resulted in an incorrect charge</li>
              <li>The reading content was clearly corrupted, incomplete, or blank</li>
            </ul>
            <p style={{marginTop:12}}>In these cases, contact us at <a href="mailto:hello@bluntchart.com">hello@bluntchart.com</a> with your order email and a brief description of the issue. We will respond within 24 hours and resolve it the same day.</p>
          </>
        },
        {
          h:"When We Cannot Refund",
          body:<>
            <p style={{marginBottom:12}}>We are unable to offer refunds in the following situations:</p>
            <ul>
              <li>You changed your mind after reading the content</li>
              <li>You disagree with the interpretation or tone of your reading</li>
              <li>You entered incorrect birth details (we recommend double-checking before payment)</li>
              <li>You did not find the reading applicable to your life circumstances</li>
              <li>You purchased a reading as a gift and the recipient did not want it</li>
            </ul>
            <p style={{marginTop:12}}>We take great care with the quality of our readings, but astrology is inherently interpretive. We cannot guarantee the content will resonate with every person.</p>
          </>
        },
        {
          h:"Incorrect Birth Details",
          body:<>If you entered incorrect birth details and notice before the reading is delivered, contact us immediately at <a href="mailto:hello@bluntchart.com">hello@bluntchart.com</a>. If we can intercept the generation, we will regenerate using the correct details at no extra charge. If the reading has already been delivered, we will offer one free regeneration as a goodwill gesture — though this is at our discretion, not a guaranteed right.</>
        },
        {
          h:"Chargebacks",
          body:<>If you initiate a chargeback through your bank or payment provider without first contacting us, we reserve the right to contest the chargeback with evidence of delivery. We strongly encourage you to contact us first &mdash; we resolve legitimate issues quickly and without friction.</>
        },
        {
          h:"Processing Refunds",
          body:<>Approved refunds are processed within 5 business days. Depending on your bank, the funds may take an additional 3&ndash;10 business days to appear in your account. Refunds are issued to the original payment method only.</>
        },
        {
          h:"Contact",
          body:<>For any refund requests: <a href="mailto:hello@bluntchart.com">hello@bluntchart.com</a><br/>Please include your order email and a brief description of the issue.</>
        },
      ]}
    />
  );
}