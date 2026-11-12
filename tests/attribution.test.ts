import { describe, expect, it } from "vitest";
import {
  parseAttribution,
  primarySource,
  serializeAttribution,
  touchFromLanding,
  withUtm,
} from "@/lib/attribution";
import { abandonedOneMail, bookAbandonedOneMail, moonPhaseDeliveryMail } from "@/lib/email-templates";

const NOW = new Date("2026-10-22T10:00:00Z");

describe("touchFromLanding", () => {
  it("reads UTM tags", () => {
    const t = touchFromLanding(
      "https://bluntchart.com/future-love-letter?utm_source=Instagram&utm_medium=social&utm_campaign=bio",
      "",
      NOW
    );
    expect(t).toMatchObject({
      source: "instagram",
      medium: "social",
      campaign: "bio",
      landing: "/future-love-letter",
    });
  });

  it("classifies search and social referrers", () => {
    expect(touchFromLanding("https://bluntchart.com/", "https://www.google.co.uk/", NOW)).toMatchObject({
      source: "google",
      medium: "organic",
    });
    expect(touchFromLanding("https://bluntchart.com/", "https://l.instagram.com/", NOW)).toMatchObject({
      source: "instagram",
      medium: "social",
    });
    expect(touchFromLanding("https://bluntchart.com/", "https://blog.bluntchart.com/post", NOW)).toMatchObject({
      source: "blog.bluntchart.com",
      medium: "referral",
    });
  });

  it("treats fbclid without UTM as Meta social", () => {
    expect(touchFromLanding("https://bluntchart.com/?fbclid=abc", "", NOW)).toMatchObject({
      source: "meta",
      medium: "social",
    });
  });

  it("returns null for internal or direct navigation", () => {
    expect(touchFromLanding("https://bluntchart.com/natal-chart", "https://bluntchart.com/", NOW)).toBeNull();
    expect(touchFromLanding("https://bluntchart.com/natal-chart", "", NOW)).toBeNull();
  });
});

describe("cookie round trip", () => {
  it("serializes, parses and picks the primary source", () => {
    const first = touchFromLanding("https://bluntchart.com/?utm_source=tiktok&utm_medium=social", "", NOW)!;
    const last = { source: "direct", medium: "none", at: NOW.toISOString() };
    const parsed = parseAttribution(serializeAttribution({ first, last }));
    expect(parsed?.first.source).toBe("tiktok");
    expect(primarySource(parsed)).toBe("tiktok");
  });

  it("rejects malformed cookies", () => {
    expect(parseAttribution("not-json")).toBeNull();
    expect(parseAttribution(encodeURIComponent(JSON.stringify({ first: { source: "x" } })))).toBeNull();
  });
});

describe("withUtm", () => {
  const tags = { source: "email", medium: "email", campaign: "test" };

  it("keeps the hash after the query", () => {
    expect(withUtm("https://bluntchart.com#try-it", tags)).toBe(
      "https://bluntchart.com/?utm_source=email&utm_medium=email&utm_campaign=test#try-it"
    );
  });

  it("leaves other hosts and pre-tagged links alone", () => {
    expect(withUtm("https://bluntchart.gumroad.com/l/x", tags)).toBe("https://bluntchart.gumroad.com/l/x");
    expect(withUtm("https://bluntchart.com/?utm_source=ig", tags)).toBe("https://bluntchart.com/?utm_source=ig");
  });
});

describe("email link tagging", () => {
  it("tags site links in text and html", () => {
    const mail = abandonedOneMail({ firstName: "Sam", readingUrl: "https://bluntchart.com#try-it" });
    expect(mail.text).toContain(
      "https://bluntchart.com/?utm_source=email&utm_medium=email&utm_campaign=abandoned_one#try-it"
    );
    expect(mail.html).toContain(
      'href="https://bluntchart.com/?utm_source=email&amp;utm_medium=email&amp;utm_campaign=abandoned_one#try-it"'
    );
  });

  it("uses a campaign per template", () => {
    const mail = bookAbandonedOneMail({ firstName: "Sam", readingUrl: "https://bluntchart.com/in-depth-birth-chart" });
    expect(mail.text).toContain("utm_campaign=book_abandoned_one");
  });

  it("keeps existing query params on access links", () => {
    const mail = moonPhaseDeliveryMail({
      name1: "Sam",
      name2: "Alex",
      deliveryUrl: "https://bluntchart.com/moon-phase/delivery?token=abc&v=2",
    });
    expect(mail.html).toContain("delivery?token=abc&amp;v=2&amp;utm_source=email");
    expect(mail.text).toContain("delivery?token=abc&v=2&utm_source=email");
  });
});
