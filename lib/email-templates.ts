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

Your ${birthDate ?? "birth date"} chart is now processing using a high-precision ephemeris (Astronomy Engine).

This takes 45 seconds. Check back in 1 minute for your full reading link.

You're about to see what top astrologers charge $100/hour for.

Deep breath.

xx bluntchart`;

  const html = wrap(`
    <p style="font-size:18px;line-height:1.8;margin:0 0 14px;">${esc(firstName)},</p>
    <p style="font-size:16px;line-height:1.9;margin:0 0 14px;">✅ Payment received.</p>
    <p style="font-size:16px;line-height:1.9;margin:0 0 14px;">Your <strong>${esc(birthDate ?? "birth date")}</strong> chart is now processing using a high-precision ephemeris (Astronomy Engine).</p>
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

Your full personalized reading from ${birthDate ?? "your birth date"}. Planet positions use a high-precision ephemeris (Astronomy Engine).

Open My Full Chart:
${readingUrl ?? "https://bluntchart.com"}

Made you this shareable card too:
${cardUrl ?? "https://bluntchart.com"}

Take 5 minutes. It will explain a lot.

xx`;

  const html = wrap(`
    <p style="font-size:18px;line-height:1.8;margin:0 0 14px;">${esc(firstName)},</p>
    <p style="font-size:16px;line-height:1.9;margin:0 0 14px;">It's done.</p>
    <p style="font-size:16px;line-height:1.9;margin:0 0 14px;">Your full personalized reading from <strong>${esc(birthDate ?? "your birth date")}</strong>. Planet positions use a high-precision ephemeris (Astronomy Engine).</p>
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

/* ─── BIRTH CHART BOOK — shared styling ─── */

const bookWrap = (body: string) => `
  <div style="background:#0B0B0B;padding:32px 16px;font-family:'Helvetica Neue',Arial,sans-serif;color:#F0E9DC;">
    <div style="max-width:640px;margin:0 auto;background:#161616;border:1px solid rgba(191,151,90,0.15);border-radius:18px;padding:32px;">
      <div style="font-size:12px;letter-spacing:3px;text-transform:uppercase;color:#BF975A;margin-bottom:20px;font-weight:700;">
        BluntChart
      </div>
      ${body}
      <div style="margin-top:28px;padding-top:18px;border-top:1px solid rgba(191,151,90,0.12);font-size:12px;color:rgba(240,233,220,0.35);line-height:1.7;">
        bluntchart.com
      </div>
    </div>
  </div>
`;

const bookButton = (href: string, label: string) => `
  <a href="${esc(href)}"
     style="display:inline-block;background:#BF975A;color:#0B0B0B;text-decoration:none;
     padding:14px 28px;border-radius:100px;font-weight:700;font-size:15px;margin-top:18px;">
    ${esc(label)}
  </a>
`;

const bookPreheader = (text: string) =>
  `<div style="display:none;font-size:1px;color:#0B0B0B;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">${esc(text)}&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;</div>`;

const bP = (text: string) =>
  `<p style="font-size:16px;line-height:1.8;margin:0 0 14px;color:rgba(240,233,220,0.75);">${text}</p>`;
const bHi = (name: string) =>
  `<p style="font-size:20px;line-height:1.7;margin:0 0 16px;color:#F0E9DC;">Hey ${esc(name)},</p>`;
const bBold = (text: string) => `<strong style="color:#F0E9DC;">${esc(text)}</strong>`;
const bGold = (text: string) => `<strong style="color:#BF975A;">${text}</strong>`;

const bookSignOff = () => `
  <p style="font-size:14px;line-height:1.8;margin:24px 0 4px;color:rgba(240,233,220,0.65);">— The BluntChart Team</p>
  <p style="font-size:13px;line-height:1.6;margin:0;color:rgba(240,233,220,0.35);font-style:italic;">Still reading people's emotional baggage so they don't have to.</p>
`;

const textSignOff = `— The BluntChart Team
Still reading people's emotional baggage so they don't have to.`;

/* ─── BIRTH CHART BOOK — abandoned cart sequence ─── */

export function bookAbandonedPreviewMail({ firstName, readingUrl }: BaseVars): EmailTemplate {
  const subject = "your birth chart is waiting...";

  const text = `You were one step away.

Your birth details are already saved.

All that's left is completing checkout.

We'll keep everything ready for you.

${readingUrl ?? "https://bluntchart.com/in-depth-birth-chart"}

${textSignOff}`;

  const html = bookPreheader("and honestly... it's judging your commitment issues.") + bookWrap(`
    ${bP("You were one step away.")}
    ${bP("Your birth details are already saved.")}
    ${bP("All that's left is completing checkout.")}
    ${bP("We'll keep everything ready for you.")}
    ${bookButton(readingUrl ?? "https://bluntchart.com/in-depth-birth-chart", "Continue Where I Left Off")}
    ${bookSignOff()}
  `);

  return { subject, text, html };
}

export function bookAbandonedOneMail({ firstName, readingUrl }: BaseVars): EmailTemplate {
  const subject = "you keep wondering why you do certain things...";

  const text = `Yesterday you almost started your Birth Chart Book.

Then life happened.

Whenever you're ready...

your chart will still be here.

${readingUrl ?? "https://bluntchart.com/in-depth-birth-chart"}

${textSignOff}`;

  const html = bookPreheader("this was supposed to answer that.") + bookWrap(`
    ${bP("Yesterday you almost started your Birth Chart Book.")}
    ${bP("Then life happened.")}
    ${bP("Whenever you're ready...")}
    ${bP("your chart will still be here.")}
    ${bookButton(readingUrl ?? "https://bluntchart.com/in-depth-birth-chart", "Finish My Book")}
    ${bookSignOff()}
  `);

  return { subject, text, html };
}

export function bookAbandonedTwoMail({ firstName, readingUrl }: BaseVars): EmailTemplate {
  const subject = "curiosity usually doesn't disappear...";

  const text = `Most people who come back tell us the same thing.

"I wish I'd read this sooner."

No pressure.

Just leaving this here...

${readingUrl ?? "https://bluntchart.com/in-depth-birth-chart"}

${textSignOff}`;

  const html = bookPreheader("it just gets postponed.") + bookWrap(`
    ${bP("Most people who come back tell us the same thing.")}
    ${bP(`<em style="color:#F0E9DC;">"I wish I'd read this sooner."</em>`)}
    ${bP("No pressure.")}
    ${bP("Just leaving this here...")}
    ${bookButton(readingUrl ?? "https://bluntchart.com/in-depth-birth-chart", "Complete My Purchase")}
    ${bookSignOff()}
  `);

  return { subject, text, html };
}

export function bookAbandonedThreeMail({ firstName, readingUrl }: BaseVars): EmailTemplate {
  const subject = "this is the last reminder... promise.";

  const text = `We'll stop sending reminders after this email.

If you're still curious about what your birth chart actually says...

your saved details are waiting.

If not...

no hard feelings.

Either way, thanks for giving BluntChart a chance.

${readingUrl ?? "https://bluntchart.com/in-depth-birth-chart"}

${textSignOff}`;

  const html = bookPreheader("after this we'll stop bothering you.") + bookWrap(`
    ${bP("We'll stop sending reminders after this email.")}
    ${bP("If you're still curious about what your birth chart actually says...")}
    ${bP("your saved details are waiting.")}
    ${bP("If not...")}
    ${bP("no hard feelings.")}
    ${bP("Either way, thanks for giving BluntChart a chance.")}
    ${bookButton(readingUrl ?? "https://bluntchart.com/in-depth-birth-chart", "Read My Birth Chart")}
    ${bookSignOff()}
  `);

  return { subject, text, html };
}

/* ─── BIRTH CHART BOOK — post-purchase sequence ─── */

export function bookConfirmationMail({ firstName, birthDate }: BaseVars): EmailTemplate {
  const subject = "we kidnapped your birth chart...";

  const text = `Hey ${firstName},

We just received your order.

Right now we're turning your exact birth chart into a personalized book... not a generic horoscope, not a template with your zodiac sign pasted into it.

Every chapter is generated from your birth date, birth time and birthplace, so it takes a few minutes to put everything together.

Give us around 5-10 minutes.

You'll receive another email the moment it's ready.

Until then...

Try not to overthink why you bought an entire book about yourself.

(Actually... that's probably one of the chapters.)

${textSignOff}`;

  const html = bookPreheader("don't worry... we'll return it in about 5–10 minutes.") + bookWrap(`
    ${bHi(firstName)}
    ${bP("We just received your order.")}
    ${bP("Right now we're turning your exact birth chart into a personalized book... not a generic horoscope, not a template with your zodiac sign pasted into it.")}
    ${bP(`Every chapter is generated from your ${bBold("birth date")}, ${bBold("birth time")} and ${bBold("birthplace")}, so it takes a few minutes to put everything together.`)}
    ${bP(`Give us around ${bGold("5–10 minutes")}.`)}
    ${bP("You'll receive another email the moment it's ready.")}
    ${bP("Until then...")}
    ${bP("Try not to overthink why you bought an entire book about yourself.")}
    ${bP(`<em style="color:rgba(240,233,220,0.5);">(Actually... that's probably one of the chapters.)</em>`)}
    ${bookButton("https://bluntchart.com/in-depth-birth-chart", "I'll Patiently Pretend Not To Refresh My Inbox")}
    ${bookSignOff()}
  `);

  return { subject, text, html };
}

/**
 * Manual-fulfillment confirmation email — used by /internal/premium when
 * a book is prepared without a Gumroad payment (Personal / Test / Etsy /
 * Other). Deliberately avoids "payment received", "your order", or any
 * transaction language because no payment happened through us. Design
 * matches the rest of the book sequence.
 */
export function manualBookConfirmationMail({ firstName, birthDate }: BaseVars): EmailTemplate {
  void birthDate;
  const subject = "your birth chart book is being prepared...";

  const text = `Hey ${firstName},

We've received your details and your personalized birth chart book is being prepared right now.

Every chapter is generated from your exact birth date, birth time and birthplace... not a generic horoscope, not a template with your zodiac sign pasted into it.

Give us around 5-10 minutes.

You'll receive another email the moment it's ready.

Until then... try not to overthink why you asked for an entire book about yourself.

(Actually... that's probably one of the chapters.)

${textSignOff}`;

  const html = bookPreheader("your book is being prepared... we'll be in touch shortly.") + bookWrap(`
    ${bHi(firstName)}
    ${bP("We've received your details and your personalized birth chart book is being prepared right now.")}
    ${bP(`Every chapter is generated from your ${bBold("birth date")}, ${bBold("birth time")} and ${bBold("birthplace")}... not a generic horoscope, not a template with your zodiac sign pasted into it.`)}
    ${bP(`Give us around ${bGold("5–10 minutes")}.`)}
    ${bP("You'll receive another email the moment it's ready.")}
    ${bP("Until then... try not to overthink why you asked for an entire book about yourself.")}
    ${bP(`<em style="color:rgba(240,233,220,0.5);">(Actually... that's probably one of the chapters.)</em>`)}
    ${bookSignOff()}
  `);

  return { subject, text, html };
}

export function bookDeliveryMail({ firstName, readingUrl }: BaseVars): EmailTemplate {
  const subject = "it's here... try not to feel too called out.";

  const text = `Hey ${firstName},

Your book is ready.

Inside you'll find 14 chapters built entirely from your birth chart... your relationships, career, emotional patterns, strengths, blind spots and the habits you probably thought nobody noticed.

Some pages will feel validating.

Some might make you close the tab for a minute.

Both are normal.

Open Your Book:
${readingUrl ?? "https://bluntchart.com"}

You can also download it as a PDF anytime.

One small warning...

Most people think they'll read one chapter.

Then accidentally finish the whole thing.

Enjoy.

${textSignOff}`;

  const html = bookPreheader("your birth chart book is officially ready.") + bookWrap(`
    ${bHi(firstName)}
    ${bP("Your book is ready.")}
    ${bP(`Inside you'll find ${bBold("14 chapters")} built entirely from your birth chart... your relationships, career, emotional patterns, strengths, blind spots and the habits you probably thought nobody noticed.`)}
    ${bP("Some pages will feel validating.")}
    ${bP("Some might make you close the tab for a minute.")}
    ${bP("Both are normal.")}
    ${bookButton(readingUrl ?? "https://bluntchart.com", "Open My Book")}
    ${bP("You can also download it as a PDF anytime.")}
    <p style="font-size:16px;line-height:1.8;margin:20px 0 8px;color:rgba(240,233,220,0.75);"><em>One small warning...</em></p>
    ${bP("Most people think they'll read one chapter.")}
    ${bP("Then accidentally finish the whole thing.")}
    ${bP("Enjoy.")}
    ${bookSignOff()}
  `);

  return { subject, text, html };
}

export function bookReviewMail({ firstName }: BaseVars): EmailTemplate {
  const subject = "okay... which chapter exposed you?";

  const text = `Hey ${firstName},

By now you've probably finished your book...

or at least skipped straight to the chapters you were secretly most curious about.

We're genuinely curious.

Which chapter made you stop for a second and think...

"Okay... that's annoyingly accurate."

Hit reply and tell us.

We read every response.

Some of our best improvements have come from people telling us exactly what landed... and what didn't.

This product gets better every time someone is brutally honest with us.

Seems fair.

${textSignOff}`;

  const html = bookPreheader("be honest.") + bookWrap(`
    ${bHi(firstName)}
    ${bP("By now you've probably finished your book...")}
    ${bP("or at least skipped straight to the chapters you were secretly most curious about.")}
    ${bP("We're genuinely curious.")}
    ${bP("Which chapter made you stop for a second and think...")}
    ${bP(`<em style="color:#F0E9DC;">"Okay... that's annoyingly accurate."</em>`)}
    ${bP("Hit reply and tell us.")}
    ${bP("We read every response.")}
    ${bP("Some of our best improvements have come from people telling us exactly what landed... and what didn't.")}
    ${bP("This product gets better every time someone is brutally honest with us.")}
    ${bP("Seems fair.")}
    ${bookSignOff()}
  `);

  return { subject, text, html };
}

export function bookSocialProofMail({ firstName, cardUrl }: BaseVars): EmailTemplate {
  const subject = "one tiny favour...";

  const text = `Hey ${firstName},

If your Birth Chart Book made you see yourself differently...

would you mind helping the next person who's sitting on the fence?

A quick review genuinely helps more people discover BluntChart than any advertisement ever could.

Whether you loved it...

or whether one chapter absolutely humbled you...

we'd love to hear it.

Leave your review here:
${cardUrl ?? "https://bluntchart.com/in-depth-birth-chart"}

Thanks for trusting us with something this personal.

It genuinely means a lot.

${textSignOff}`;

  const html = bookPreheader("it'll take less than a minute.") + bookWrap(`
    ${bHi(firstName)}
    ${bP("If your Birth Chart Book made you see yourself differently...")}
    ${bP("would you mind helping the next person who's sitting on the fence?")}
    ${bP("A quick review genuinely helps more people discover BluntChart than any advertisement ever could.")}
    ${bP("Whether you loved it...")}
    ${bP("or whether one chapter absolutely humbled you...")}
    ${bP("we'd love to hear it.")}
    ${bookButton(cardUrl ?? "https://bluntchart.com/in-depth-birth-chart", "Leave A Review")}
    ${bP("Thanks for trusting us with something this personal.")}
    ${bP("It genuinely means a lot.")}
    ${bookSignOff()}
  `);

  return { subject, text, html };
}

/* ═══════════════════════════════════════════════════════════════════
   FUTURE LOVE LETTER
   ═══════════════════════════════════════════════════════════════════ */

export function loveLetterConfirmationMail({ firstName }: BaseVars): EmailTemplate {
  const subject = "💌 Your letter is in the stars";

  const text = `Hey ${firstName},

Your letter is officially on its way.

We're putting the pieces together from your birth chart, and your future husband has already started writing.

Give us a little time.
We'll make sure it feels personal, warm, and a little too accurate.

Talk soon,
BluntChart`;

  const html = wrap(`
    <p style="font-size:18px;line-height:1.8;margin:0 0 14px;">Hey ${esc(firstName)},</p>
    <p style="font-size:16px;line-height:1.9;margin:0 0 14px;">Your letter is officially on its way.</p>
    <p style="font-size:16px;line-height:1.9;margin:0 0 14px;">We're putting the pieces together from your birth chart, and your future husband has already started writing.</p>
    <p style="font-size:16px;line-height:1.9;margin:0 0 14px;">Give us a little time.<br/>We'll make sure it feels personal, warm, and a little too accurate.</p>
    <p style="font-size:16px;line-height:1.9;margin:0 0 0;">Talk soon,<br/>BluntChart</p>
  `);

  return { subject, text, html };
}

export function loveLetterDeliveryMail({ firstName, readingUrl }: BaseVars): EmailTemplate {
  const subject = "Your Love Letter is here!";

  const text = `Hey ${firstName},

It's ready.

Your Future Husband Love Letter is waiting for you, and yes... it may know you a little better than it should.

Read it somewhere quiet if you can.
Some lines are sweet, some are teasing, and a few might make you blush.

Open your letter: ${readingUrl ?? "https://bluntchart.com"}

With love,
BluntChart`;

  const html = wrap(`
    <p style="font-size:18px;line-height:1.8;margin:0 0 14px;">Hey ${esc(firstName)},</p>
    <p style="font-size:16px;line-height:1.9;margin:0 0 14px;">It's ready.</p>
    <p style="font-size:16px;line-height:1.9;margin:0 0 14px;">Your Future Husband Love Letter is waiting for you, and yes... it may know you a little better than it should.</p>
    <p style="font-size:16px;line-height:1.9;margin:0 0 14px;">Read it somewhere quiet if you can.<br/>Some lines are sweet, some are teasing, and a few might make you blush.</p>
    ${button(readingUrl ?? "https://bluntchart.com", "Open your letter →")}
    <p style="font-size:16px;line-height:1.9;margin:18px 0 0;">With love,<br/>BluntChart</p>
  `);

  return { subject, text, html };
}

export function manualReadingConfirmationMail({ firstName, birthDate }: BaseVars): EmailTemplate {
  const subject = `${firstName}, your birth chart reading is on its way`;

  const text = `${firstName},

We've received your details and your personalized birth chart reading is being generated right now.

Your ${birthDate ?? "birth date"} chart is processing using a high-precision ephemeris (Astronomy Engine).

This takes about 45 seconds. You'll receive another email the moment it's ready with your full reading link.

You're about to see what top astrologers charge $100/hour for.

Deep breath.

xx bluntchart`;

  const html = wrap(`
    <p style="font-size:18px;line-height:1.8;margin:0 0 14px;">${esc(firstName)},</p>
    <p style="font-size:16px;line-height:1.9;margin:0 0 14px;">We've received your details and your personalized birth chart reading is being generated right now.</p>
    <p style="font-size:16px;line-height:1.9;margin:0 0 14px;">Your <strong>${esc(birthDate ?? "birth date")}</strong> chart is processing using a high-precision ephemeris (Astronomy Engine).</p>
    <p style="font-size:16px;line-height:1.9;margin:0 0 14px;">This takes about 45 seconds. You'll receive another email the moment it's ready with your full reading link.</p>
    <p style="font-size:16px;line-height:1.9;margin:0 0 14px;">You're about to see what top astrologers charge $100/hour for.</p>
    <p style="font-size:16px;line-height:1.9;margin:0 0 14px;">Deep breath.</p>
    <p style="font-size:14px;line-height:1.8;margin:0;">xx bluntchart</p>
  `);

  return { subject, text, html };
}

export function loveLetterReviewMail({ firstName, cardUrl }: BaseVars): EmailTemplate {
  const subject = `${firstName}, how was the letter?`;

  const text = `Hey ${firstName},

So... did he get you?

If your Future Husband's letter made you feel something — a smile, a blush, a "how did it know that?" — we'd love to hear about it.

Leave a review: ${cardUrl ?? "https://bluntchart.com/reviews/love-letter"}

Your feedback genuinely helps more people discover this.

With love,
BluntChart`;

  const html = wrap(`
    <p style="font-size:18px;line-height:1.8;margin:0 0 14px;">Hey ${esc(firstName)},</p>
    <p style="font-size:16px;line-height:1.9;margin:0 0 14px;">So... did he get you?</p>
    <p style="font-size:16px;line-height:1.9;margin:0 0 14px;">If your Future Husband's letter made you feel something — a smile, a blush, a "how did it know that?" — we'd love to hear about it.</p>
    ${button(cardUrl ?? "https://bluntchart.com/reviews/love-letter", "Leave a review →")}
    <p style="font-size:16px;line-height:1.9;margin:18px 0 0;">Your feedback genuinely helps more people discover this.</p>
    <p style="font-size:16px;line-height:1.9;margin:0;">With love,<br/>BluntChart</p>
  `);

  return { subject, text, html };
}

/* ─── MOON PHASE CARD — delivery ─── */

export function moonPhaseDeliveryMail({
  name1,
  name2,
  deliveryUrl,
}: {
  name1: string;
  name2: string;
  deliveryUrl: string;
}): EmailTemplate {
  const subject = `${name1} & ${name2} — your Moon Phase Card is ready`;

  const text = `Your Moon Phase Card for ${name1} & ${name2} is ready.

Download all formats — print-ready 8×10, phone wallpaper, social story, square, and PDF:

${deliveryUrl}

The link regenerates your artwork on-the-fly using the same moon data — it will always work.

xx bluntchart`;

  const html = wrap(`
    <p style="font-size:18px;line-height:1.8;margin:0 0 14px;">Your Moon Phase Card is ready.</p>
    <p style="font-size:16px;line-height:1.9;margin:0 0 14px;"><strong>${esc(name1)}</strong> &amp; <strong>${esc(name2)}</strong></p>
    <p style="font-size:16px;line-height:1.9;margin:0 0 14px;">All formats included — print-ready 8×10, phone wallpaper, social story, square, and PDF.</p>
    ${button(deliveryUrl, "Download your Moon Phase Card →")}
    <p style="font-size:14px;line-height:1.8;margin-top:18px;opacity:.75;">The link regenerates your artwork on-the-fly — it will always work.</p>
    <p style="font-size:14px;line-height:1.8;margin:0;">xx bluntchart</p>
  `);

  return { subject, text, html };
}