export type EmailTemplate = {
  subject: string;
  text: string;
  html: string;
};

type BaseVars = {
  firstName: string;
  birthDate?: string;
  readingUrl?: string;
  cardUrl?: string;
};

const esc = (value: string = "") =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

const wrap = (body: string) => `
  <div style="background:#09090f;padding:32px 16px;font-family:Arial,sans-serif;color:#e8e4f0;">
    <div style="max-width:640px;margin:0 auto;background:#12121e;border:1px solid rgba(255,255,255,0.08);border-radius:18px;padding:28px;">
      <div style="font-size:13px;letter-spacing:2px;text-transform:uppercase;color:#d4537e;margin-bottom:18px;font-weight:700;">
        BluntChart
      </div>
      ${body}
      <div style="margin-top:28px;padding-top:18px;border-top:1px solid rgba(255,255,255,0.08);font-size:12px;color:rgba(232,228,240,0.45);line-height:1.7;">
        bluntchart.com
      </div>
    </div>
  </div>
`;

const button = (href: string, label: string) => `
  <a href="${esc(href)}"
     style="display:inline-block;background:linear-gradient(135deg,#6b2fd4,#d4537e);color:#fff;text-decoration:none;
     padding:14px 22px;border-radius:12px;font-weight:700;margin-top:18px;">
    ${esc(label)}
  </a>
`;

export function previewMail({ firstName, birthDate, readingUrl }: BaseVars): EmailTemplate {
  const subject = `hey ${firstName}... your chart misses you already 🥺`;
  const text = `${firstName},

You put in ${birthDate ?? "your birth date"} and just... left?

Your planets are staring at me like "where she go?"

they have tea about:
your secret overthinking habit
why you attract the same chaos
that one placement screaming "therapy pls"

$15. one click. come back?

${readingUrl ?? "https://bluntchart.com"}

don't break their little hearts

xx bluntchart`;

  const html = wrap(`
    <p style="font-size:18px;line-height:1.8;margin:0 0 14px;">${esc(firstName)},</p>
    <p style="font-size:16px;line-height:1.9;margin:0 0 14px;">You put in <strong>${esc(birthDate ?? "your birth date")}</strong> and just... left?</p>
    <p style="font-size:16px;line-height:1.9;margin:0 0 14px;">Your planets are staring at me like <em>"where she go?"</em></p>
    <p style="font-size:16px;line-height:1.9;margin:0 0 14px;">They have tea about:</p>
    <ul style="margin:0 0 14px 20px;padding:0;line-height:1.9;">
      <li>your secret overthinking habit</li>
      <li>why you attract the same chaos</li>
      <li>that one placement screaming "therapy pls"</li>
    </ul>
    <p style="font-size:16px;line-height:1.9;margin:0 0 14px;">$15. one click. come back?</p>
    ${button(readingUrl ?? "https://bluntchart.com", "see my chart →")}
    <p style="font-size:14px;line-height:1.8;margin-top:18px;opacity:.85;">don't break their little hearts</p>
    <p style="font-size:14px;line-height:1.8;margin:0;">xx bluntchart</p>
  `);

  return { subject, text, html };
}

export function abandonedOneMail({ firstName, birthDate, readingUrl }: BaseVars): EmailTemplate {
  const subject = `${firstName} you left me mid-calculation 😭`;

  const text = `${firstName},

you typed ${birthDate ?? "your birth date"}, hit calculate... then ghosted?

your chart's half-born and confused af.

it's dying to tell you why you:

sabotage nice things
have that one toxic pattern
cry at 2am for no reason

$15. be brave.

${readingUrl ?? "https://bluntchart.com"}

i believe in you

Yours Truly,
BluntChart`;

  const html = wrap(`
    <p style="font-size:18px;line-height:1.8;margin:0 0 14px;">${esc(firstName)},</p>
    <p style="font-size:16px;line-height:1.9;margin:0 0 14px;">you typed <strong>${esc(birthDate ?? "your birth date")}</strong>, hit calculate... then ghosted?</p>
    <p style="font-size:16px;line-height:1.9;margin:0 0 14px;">your chart's half-born and confused af.</p>
    <p style="font-size:16px;line-height:1.9;margin:0 0 14px;">it's dying to tell you why you:</p>
    <ul style="margin:0 0 14px 20px;padding:0;line-height:1.9;">
      <li>sabotage nice things</li>
      <li>have that one toxic pattern</li>
      <li>cry at 2am for no reason</li>
    </ul>
    <p style="font-size:16px;line-height:1.9;margin:0 0 14px;">$15. be brave.</p>
    ${button(readingUrl ?? "https://bluntchart.com", "finish it →")}
    <p style="font-size:14px;line-height:1.8;margin-top:18px;">i believe in you</p>
    <p style="font-size:14px;line-height:1.8;margin:0;">Yours Truly,<br/>BluntChart</p>
  `);

  return { subject, text, html };
}

export function abandonedTwoMail({ firstName, readingUrl }: BaseVars): EmailTemplate {
  const subject = `ok ${firstName} this is your last warning`;

  const text = `${firstName},

3 days. your chart's collecting dust.

it's not mad, just disappointed.

one click ends the suffering:

${readingUrl ?? "https://bluntchart.com"}

tomorrow i delete it. don't make me.

xx`;

  const html = wrap(`
    <p style="font-size:18px;line-height:1.8;margin:0 0 14px;">${esc(firstName)},</p>
    <p style="font-size:16px;line-height:1.9;margin:0 0 14px;">3 days. your chart's collecting dust.</p>
    <p style="font-size:16px;line-height:1.9;margin:0 0 14px;">it's not mad, just disappointed.</p>
    <p style="font-size:16px;line-height:1.9;margin:0 0 14px;">one click ends the suffering:</p>
    ${button(readingUrl ?? "https://bluntchart.com", "claim it →")}
    <p style="font-size:14px;line-height:1.8;margin-top:18px;">tomorrow i delete it. don't make me.</p>
    <p style="font-size:14px;line-height:1.8;margin:0;">xx</p>
  `);

  return { subject, text, html };
}

export function paidConfirmationMail({ firstName, birthDate }: BaseVars): EmailTemplate {
  const subject = `${firstName}, payment confirmed - chart calculating`;

  const text = `${firstName},

✅ Payment received.

Your ${birthDate ?? "birth date"} chart is now processing through Swiss Ephemeris.

This takes 45 seconds. Check back in 1 minute for your full reading link.

You're about to see what top astrologers charge $100/hour for.

Deep breath.

xx bluntchart`;

  const html = wrap(`
    <p style="font-size:18px;line-height:1.8;margin:0 0 14px;">${esc(firstName)},</p>
    <p style="font-size:16px;line-height:1.9;margin:0 0 14px;">✅ Payment received.</p>
    <p style="font-size:16px;line-height:1.9;margin:0 0 14px;">Your <strong>${esc(birthDate ?? "birth date")}</strong> chart is now processing through Swiss Ephemeris.</p>
    <p style="font-size:16px;line-height:1.9;margin:0 0 14px;">This takes 45 seconds. Check back in 1 minute for your full reading link.</p>
    <p style="font-size:16px;line-height:1.9;margin:0 0 14px;">You're about to see what top astrologers charge $100/hour for.</p>
    <p style="font-size:16px;line-height:1.9;margin:0 0 14px;">Deep breath.</p>
    <p style="font-size:14px;line-height:1.8;margin:0;">xx bluntchart</p>
  `);

  return { subject, text, html };
}

export function fullReadingDeliveryMail({ firstName, birthDate, readingUrl, cardUrl }: BaseVars): EmailTemplate {
  const subject = `${firstName}, your chart is ready. open now.`;

  const text = `${firstName},

It's done.

Your full personalized reading from ${birthDate ?? "your birth date"}. Swiss Ephemeris precision.

Open My Full Chart:
${readingUrl ?? "https://bluntchart.com"}

Made you this shareable card too:
${cardUrl ?? "https://bluntchart.com"}

Take 5 minutes. It will explain a lot.

xx`;

  const html = wrap(`
    <p style="font-size:18px;line-height:1.8;margin:0 0 14px;">${esc(firstName)},</p>
    <p style="font-size:16px;line-height:1.9;margin:0 0 14px;">It's done.</p>
    <p style="font-size:16px;line-height:1.9;margin:0 0 14px;">Your full personalized reading from <strong>${esc(birthDate ?? "your birth date")}</strong>. Swiss Ephemeris precision.</p>
    ${button(readingUrl ?? "https://bluntchart.com", "Open My Full Chart →")}
    <p style="font-size:16px;line-height:1.9;margin:18px 0 10px;">Made you this shareable card too:</p>
    ${button(cardUrl ?? "https://bluntchart.com", "Flex your card with your friends →")}
    <p style="font-size:16px;line-height:1.9;margin:18px 0 0;">Take 5 minutes. It will explain a lot.</p>
    <p style="font-size:14px;line-height:1.8;margin:0;">xx</p>
  `);

  return { subject, text, html };
}

export function shareReminderOneMail({ firstName, cardUrl }: BaseVars): EmailTemplate {
  const subject = `${firstName}, flex your card now 👀`;

  const text = `${firstName},

That reading still living rent-free in your head?

Your share card is ready to go viral:
${cardUrl ?? "https://bluntchart.com"}

Post it. Tag friends who need this reality check. Best ones get reposted.

Make your timeline jealous.

xx`;

  const html = wrap(`
    <p style="font-size:18px;line-height:1.8;margin:0 0 14px;">${esc(firstName)},</p>
    <p style="font-size:16px;line-height:1.9;margin:0 0 14px;">That reading still living rent-free in your head?</p>
    <p style="font-size:16px;line-height:1.9;margin:0 0 14px;">Your share card is ready to go viral:</p>
    ${button(cardUrl ?? "https://bluntchart.com", "Download Card →")}
    <p style="font-size:16px;line-height:1.9;margin:18px 0 0;">Post it. Tag friends who need this reality check. Best ones get reposted.</p>
    <p style="font-size:16px;line-height:1.9;margin:0;">Make your timeline jealous.</p>
    <p style="font-size:14px;line-height:1.8;margin:0;">xx</p>
  `);

  return { subject, text, html };
}

export function shareReminderTwoMail({ firstName, cardUrl }: BaseVars): EmailTemplate {
  const subject = `${firstName} people are posting theirs...`;

  const text = `Yo ${firstName},

People need to see this. Drop it on Stories/TikTok/whatever: Tag us @bluntchart—best flexes get featured

Everyone's sharing their blunt charts on Stories.

Yours is fire. Don't sleep:
${cardUrl ?? "https://bluntchart.com"}

One tap to download. Post it. Watch the "wait what??" texts roll in.

xx bluntchart`;

  const html = wrap(`
    <p style="font-size:18px;line-height:1.8;margin:0 0 14px;">Yo ${esc(firstName)},</p>
    <p style="font-size:16px;line-height:1.9;margin:0 0 14px;">People need to see this. Drop it on Stories/TikTok/whatever: Tag us @bluntchart—best flexes get featured</p>
    <p style="font-size:16px;line-height:1.9;margin:0 0 14px;">Everyone's sharing their blunt charts on Stories.</p>
    <p style="font-size:16px;line-height:1.9;margin:0 0 14px;">Yours is fire. Don't sleep:</p>
    ${button(cardUrl ?? "https://bluntchart.com", "Grab Your Card →")}
    <p style="font-size:16px;line-height:1.9;margin:18px 0 0;">One tap to download. Post it. Watch the "wait what??" texts roll in.</p>
    <p style="font-size:14px;line-height:1.8;margin:0;">xx bluntchart</p>
  `);

  return { subject, text, html };
}