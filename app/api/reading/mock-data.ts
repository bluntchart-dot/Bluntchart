import { calculateChart } from "@/lib/chart-calculator";
import type { BirthData } from "@/lib/types";

const MOCK_BIRTHS: Record<string, BirthData> = {
  blind: {
    name: "Maya Rodriguez",
    date: "1994-11-08",
    time: "14:30",
    lat: 40.7128,
    lng: -74.006,
    timezone: "America/New_York",
    placeName: "New York, NY",
  },
  brutal: {
    name: "Sarah Mitchell",
    date: "1996-06-14",
    time: "03:15",
    lat: 51.5074,
    lng: -0.1278,
    timezone: "Europe/London",
    placeName: "London, UK",
  },
  situationship: {
    name: "Priya Sharma",
    date: "1998-03-02",
    time: "22:45",
    lat: 28.6139,
    lng: 77.209,
    timezone: "Asia/Kolkata",
    placeName: "New Delhi, India",
  },
  exlove: {
    name: "Rachel Kim",
    date: "1995-10-31",
    time: "08:20",
    lat: 34.0522,
    lng: -118.2437,
    timezone: "America/Los_Angeles",
    placeName: "Los Angeles, CA",
  },
  willheback: {
    name: "Emma Johnson",
    date: "1997-07-04",
    time: "19:10",
    lat: 41.8781,
    lng: -87.6298,
    timezone: "America/Chicago",
    placeName: "Chicago, IL",
  },
};

const BLIND_READING = {
  cards: [
    {
      position: "Past",
      card_name: "The Tower",
      orientation: "upright",
      interpretation: "Something already fell apart. You know exactly what I'm talking about — that thing from the last year or so that felt like the floor disappeared beneath you. The Tower doesn't show up in the past position to remind you of pain. It shows up to say: that destruction was necessary. The structure that collapsed wasn't protecting you anymore. It was a cage you'd decorated so nicely you forgot you couldn't leave.\n\nHere's what the cards won't sugarcoat: you're still flinching. The collapse is behind you but your body hasn't gotten the memo. You're still bracing for impact in situations that aren't dangerous anymore. That hypervigilance served you during the fall. Now it's just keeping you exhausted.\n\nThe Tower in your past means you've already survived the worst part. The rubble is cleared. The ground is solid again. But you keep checking for cracks that aren't there.",
    },
    {
      position: "Present",
      card_name: "Queen of Cups",
      orientation: "reversed",
      interpretation: "Reversed Queen of Cups in your present position and I need you to hear this clearly: you are emotionally pouring from an empty cup. You've been taking care of everyone else's feelings while pretending yours don't need attention. Someone in your life is getting your best emotional energy while you survive on whatever's left over.\n\nThis card reversed is basically the tarot equivalent of \"you're fine\" said through gritted teeth. You're not fine. You're depleted. The intuition you normally trust has been getting quieter because you keep overriding it to make other people comfortable.\n\nThe Queen of Cups reversed is not asking you to stop caring about people. She's asking you to stop abandoning yourself in the process. When was the last time someone asked how YOU were doing and you gave an honest answer? Not the curated version. The real one.\n\nYour emotional intelligence is a gift. Right now you're using it like a weapon — against yourself. Every time you sense what someone else needs and reshape yourself to provide it, you lose another piece of who you actually are.",
    },
    {
      position: "Future",
      card_name: "Ace of Wands",
      orientation: "upright",
      interpretation: "And here it is. The Ace of Wands in your future position is pure creative fire. Something new is coming — not in a vague \"the universe has plans\" way, but in a concrete, tangible, you're-going-to-feel-it-in-your-bones way. This is the spark of a new beginning that actually sticks.\n\nThe Ace of Wands is the most action-oriented new beginning in the entire deck. This isn't a gentle unfolding. This is an ignition. A moment where something clicks and suddenly you have the energy and the clarity to move on the thing you've been circling for months.\n\nBut here's what I need to flag: the Ace only works if you grab it. It's an offering, not a guarantee. The spark is coming whether you're ready or not. Your only job between now and then is to stop telling yourself you're not the kind of person this happens to.\n\nYou are. The cards are literally spelling it out. Past destruction, present exhaustion, future fire. The pattern is clear — you've been through the hard part and what's ahead is the beginning you actually deserve.",
    },
  ],
  narrative: "The story your cards are telling is almost aggressively clear. You went through something that broke you open — not broke you, broke you OPEN. And instead of letting that openness become your new operating system, you defaulted back to caretaking mode. Reversed Queen of Cups in the center is the whole problem: you survived The Tower but then immediately went back to putting everyone else's needs above your own.\n\nThe Ace of Wands says that's about to change. Not because you'll be forced to — because you'll finally want to badly enough. Something is going to light up inside you and for once, you're going to follow it instead of filing it away under \"nice idea, maybe later.\"",
  advice: "Stop waiting until you feel ready. The Tower already proved that your old definition of \"ready\" was just another word for \"comfortable.\" The Ace of Wands doesn't care if you're comfortable. It cares if you're honest. And honestly? You already know what you want to do next. You've known for a while. The cards are just confirming what your gut has been screaming.",
  _drawnCards: [
    { card: { id: "major-16", name: "The Tower" }, orientation: "upright" as const, position: "Past" },
    { card: { id: "cups-queen", name: "Queen of Cups" }, orientation: "reversed" as const, position: "Present" },
    { card: { id: "wands-1", name: "Ace of Wands" }, orientation: "upright" as const, position: "Future" },
  ],
};

const BRUTALLY_HONEST = {
  letter_opener:
    "Listen. I pulled your chart and I need you to sit down for this. You've got Scorpio rising with a Gemini Moon — which means you feel everything twice and then convince yourself you feel nothing. You walk into a room and people either want to confess their secrets to you or avoid you entirely. There is no middle ground with your energy, and honestly? You kind of love that.",
  paidInsights: [
    {
      planet: "Your Rising Sign (Scorpio)",
      truth: "You don't trust easily — and people can feel it the second you walk in.",
      explain: "Scorpio rising gives you this magnetic, slightly intimidating presence. People are drawn to you but they also sense that you're reading them. And you are. You're constantly scanning for inconsistencies, for body language that doesn't match words, for the thing someone is trying to hide.\n\nHere's the brutal truth: this hypervigilance isn't just intuition. It's a defense mechanism. Somewhere along the way, you learned that people who seem safe can hurt you the most, so you developed this internal radar that never turns off. You test people without telling them you're testing them. You ask questions you already know the answer to just to see if someone will lie.\n\nThe problem? The people who pass your tests are usually the ones who are just as guarded as you are. The genuinely open, vulnerable people in your life might actually fail your tests — not because they're dishonest, but because they're not playing the same game. Your chart is asking you to consider: what if the armor that protects you is also filtering out the people who could actually love you without conditions?",
      action: "This week, notice when you're testing someone. Don't stop doing it — just notice. Name it.",
    },
    {
      planet: "Your Moon (Gemini in the 8th House)",
      truth: "You process your deepest emotions by talking about them — but you talk around them, never through them.",
      explain: "Gemini Moon in the 8th house is one of the most psychologically complex placements in astrology. You feel things at volcanic depth (8th house) but your instinct is to intellectualize them (Gemini). So you'll spend an hour analyzing why you're upset instead of just letting yourself be upset.\n\nYou're the person who can explain someone else's trauma pattern in perfect detail but can't sit with your own sadness for more than thirty seconds without reaching for your phone, starting a project, or changing the subject. Your chart says this isn't emotional immaturity — it's emotional overwhelm dressed up as analysis.\n\nThe 8th house Moon means your emotional baseline is intense. You don't do surface-level feelings. Everything hits you in the place where love and fear live next to each other. And Gemini's response to that is to split — to become the observer of your own experience instead of the experiencer.",
      action: "Next time you catch yourself explaining your feelings, stop mid-sentence. Close your eyes. Just feel it for 60 seconds without narrating it.",
    },
    {
      planet: "Your Venus (Libra in the 12th House)",
      truth: "You fall in love with potential, not people.",
      explain: "Venus in the 12th house is the placement of secret loves, impossible crushes, and the tendency to romanticize what isn't there. In Libra, this gets amplified — you don't just see the best in people, you see a version of them that might not actually exist.\n\nThe 12th house hides things. With Venus here, what gets hidden is your actual needs in relationships. You become the accommodator, the one who adjusts, the one who would rather lose themselves in someone else's story than risk being rejected for their own. You've probably loved someone who couldn't fully see you and told yourself it was enough.\n\nHere's the hard truth: you know what you deserve in love. You can articulate it perfectly to your friends. You can give flawless relationship advice to everyone around you. But when it's your own heart on the line, the 12th house creates this fog that makes you forget everything you know.",
      action: "Write down three things you need in a relationship that you've never said out loud to a partner. Not wants — needs.",
    },
    {
      planet: "Your Mars (Aries in the 6th House)",
      truth: "You use productivity as a coping mechanism — and it's burning you out.",
      explain: "Mars in Aries in the 6th house means you throw yourself into work, routines, and physical activity whenever things get emotionally complicated. Bad day? Clean the entire apartment. Heartbreak? Start a new fitness routine. Existential crisis? Pick up a side project.\n\nThe thing is, it works. You're genuinely productive and people admire your drive. But your chart sees what they don't — that a lot of this \"discipline\" is actually avoidance wearing a productivity outfit. You work hard not because you're passionate about the task, but because stopping means sitting with whatever you're running from.\n\nAries Mars doesn't do patience. It needs movement, action, something to fight or fix. In the 6th house, that fight becomes daily life itself. You optimize your routines because you can't optimize your emotions.",
      action: "Cancel one thing on your schedule this week. Replace it with nothing. Literally nothing.",
    },
    {
      planet: "Your Saturn (Capricorn in the 3rd House)",
      truth: "You were the responsible one too early, and you've never stopped.",
      explain: "Saturn in the 3rd house in Capricorn is the placement of the child who grew up too fast. Specifically, you grew up fast in communication and responsibility. Maybe you were the translator between fighting parents, the one who had to explain adult situations to younger siblings, or the kid who learned to read the room before they could read a book.\n\nCapricorn here means you took that early responsibility and turned it into a core identity. You became the reliable one. The one people come to with problems. The one who always has a plan.\n\nBut here's the truth: being the responsible one isn't a personality trait. It's a trauma response that became a skill. And the cost of maintaining it is that you never get to be the one who falls apart, who needs help, who doesn't have the answer.",
      action: "Tell someone you trust: \"I don't know what to do about this.\" Not for advice. Just to practice saying it.",
    },
    {
      planet: "Your Jupiter (Sagittarius in the 2nd House)",
      truth: "You have an incredible relationship with abundance — when you stop self-sabotaging.",
      explain: "Jupiter in Sagittarius in the 2nd house is a genuinely lucky money placement. You have an instinct for opportunity, a natural optimism about resources, and a belief that things will work out that actually helps them work out.\n\nBut here's the pattern: you earn well, and then you spend it on experiences, other people, or \"investments\" that are really just expensive ways to avoid having savings. Jupiter in the 2nd house can create a feast-or-famine cycle.\n\nThe Sagittarius influence makes you generous to a fault. You'll pick up the check, fund someone else's dream, or spend on travel before you fund your own security.",
      action: "Set up an automatic transfer to savings that you don't touch. Even small. Let yourself accumulate.",
    },
    {
      planet: "Your Mercury (Cancer in the 9th House)",
      truth: "You think in feelings first — and that makes you brilliant, not irrational.",
      explain: "Mercury in Cancer in the 9th house gives you a mind that operates through emotional intelligence before logic. You don't just think about ideas — you feel them. A philosophy either resonates in your body or it doesn't.\n\nThe 9th house placement means you're drawn to big questions — meaning, purpose, spirituality, justice. But Cancer Mercury approaches these questions through personal experience, not abstract theory.\n\nHere's what people get wrong about you: they think your emotional processing is a weakness. They've probably told you that you're \"too sensitive\" or that you need to \"think more rationally.\" Your chart says that's nonsense. Your emotional intelligence IS your intelligence.",
      action: "Before your next big decision, check: is this feeling mine, or am I absorbing someone else's anxiety about it?",
    },
    {
      planet: "Your Neptune (Aquarius in the 4th House)",
      truth: "Your idea of home has always been complicated — and that's not your fault.",
      explain: "Neptune in Aquarius in the 4th house creates a hazy, sometimes confusing relationship with the concept of home and family. The 4th house is where we feel safe, rooted, and emotionally held. Neptune here dissolves those foundations in subtle ways.\n\nYou might have grown up in a household where things looked fine from the outside but felt unstable underneath. Maybe a parent was emotionally unavailable, or the family dynamic shifted unpredictably, or you simply never felt like you fully belonged in your own home.\n\nAquarius here adds a layer of detachment. You learned to intellectualize your need for security instead of feeling it.",
      action: "Do one thing to make your current space feel more like yours. Something personal.",
    },
    {
      planet: "Your Pluto (Sagittarius in the 2nd House)",
      truth: "You've had at least one experience where everything you thought was stable fell apart.",
      explain: "Pluto in the 2nd house is about power struggles with material security and self-worth. At some point in your life — maybe in childhood, maybe in early adulthood — you experienced a significant loss or upheaval related to money, stability, or your sense of your own value.\n\nThat experience rewired something in you. On one hand, it gave you an incredible resilience with money and resources. You know how to survive with nothing because you've been close to nothing.\n\nBut Pluto also creates obsessive patterns. You might hoard resources, or you might compulsively give everything away. The pendulum swings between total control and total release.",
      action: "Name the moment that changed your relationship with security. Write it down. Not to process it — just to see it clearly.",
    },
    {
      planet: "Your North Node (Leo in the 10th House)",
      truth: "Your life purpose is to be seen — and that's exactly what terrifies you.",
      explain: "The North Node in Leo in the 10th house is one of the most visible purpose placements in astrology. Your chart is literally saying: you are meant to be in the spotlight. Not in an ego-driven way — in a way where your authentic self-expression becomes your contribution to the world.\n\nBut your South Node is in Aquarius in the 4th house, which means your comfort zone is the exact opposite: blending in, staying in the background, being \"part of the group\" rather than standing out.\n\nEvery time you dim your light to make someone else comfortable, every time you pass on an opportunity because you \"don't want the attention\" — that's your South Node pulling you backward.",
      action: "Post something, create something, say something publicly this week that is unmistakably you. Not curated, not safe. Just real.",
    },
  ],
  shareCard: {
    flexLine: "Your chart says you've been hiding in plain sight. Scorpio rising with a Gemini Moon — everything felt twice, admitted never.",
    line1: "Scorpio Rising × Gemini Moon",
    keyword: "THE INTENSIFIER",
    line2: "Feels everything. Explains nothing.",
    line3: "Until the chart did it for them.",
    quote: "The armor that protects you is also filtering out the people who could actually love you.",
  },
};

const SITUATIONSHIP_CHECK = {
  opener:
    "Babe, I'm going to be honest with you. I looked at your chart and within five minutes I could see exactly why you're in this. Not because there's something wrong with you — because your chart has a very specific pattern that makes undefined relationships feel comfortable even when they're destroying you slowly.",
  sections: [
    {
      title: "Why You Keep Choosing This",
      body: "Your Venus in Pisces in the 12th house is doing the heavy lifting here. This placement literally dissolves boundaries in love. You don't just fall for people — you merge with them. You lose where you end and they begin, and that dissolution feels like love to you because it's the most intense emotional experience you know.\n\nBut here's what your chart won't let me sugarcoat: a situationship is the perfect container for Venus in the 12th house because it never forces you to be fully real. You get the intensity, the late-night conversations, the \"almost\" of it all — without ever having to stand in front of someone and say \"this is what I need.\"\n\nYour Moon square Neptune makes this worse. You genuinely cannot always tell the difference between what's real and what you've imagined into existence. That text they sent at 2am? You read five layers of meaning into it. That time they almost said they loved you? You've replayed it so many times it's become a certainty in your head.\n\nYou're not delusional. You're operating with a chart that is wired for depth, and the crumbs this person gives you are just enough to activate that wiring. But crumbs are not a meal, and your chart is tired of starving.",
    },
    {
      title: "What They're Actually Doing",
      body: "I need to be careful here because I don't have their chart. But I can tell you what YOUR chart reveals about the dynamic.\n\nYour 7th house ruler is in a challenging aspect with Saturn, which means the partnerships you attract tend to involve someone who is emotionally unavailable or unable to commit. Not always because they're a bad person — sometimes because they genuinely don't have the capacity for what you need.\n\nHere's the pattern: they show up just enough to keep you hoping. They're warm when you pull away and distant when you lean in. They say things that sound like promises but aren't actually commitments. And every time you're about to walk away, something happens — a vulnerable moment, a midnight confession, a gesture that makes you think \"okay, THIS is the real them.\"\n\nYour chart says that IS the real them. All of it. The distance and the closeness. That inconsistency isn't a phase they're going through. It's the relationship.",
    },
    {
      title: "The Pattern Your Chart Keeps Repeating",
      body: "This isn't your first time here. Your South Node in Libra means you have a deep, almost karmic pattern of losing yourself in relationships. In past experiences you were the one who accommodated, who bent, who made yourself smaller to keep the peace.\n\nAnd here's the thing nobody talks about: you're GOOD at it. Libra South Node people are genuinely skilled at reading what someone else needs and becoming that. It's not manipulation — it's adaptation.\n\nBut your North Node is in Aries, and Aries says: stop earning love. Demand it. Not aggressively — fiercely. Fierce love says \"I am worth a clear answer\" and then waits for one without filling the silence with excuses.\n\nThe situationship exists because your Libra South Node is running the show. You'd rather have an undefined something than risk the confrontation of asking for what you actually want.",
    },
    {
      title: "What Happens If You Stay",
      body: "Saturn is about to conjunct your natal Venus. This transit happens once every 29 years, and it is the universe's way of auditing every relationship in your life. Anything that isn't built on a real foundation? Saturn will crush it. Not to punish you — to free you. But the crushing doesn't feel like freedom. It feels like loss.\n\nIf you stay in this situationship through this transit, Saturn will make the reality impossible to ignore. The inconsistency that you've been interpreting as complexity will start to feel like exactly what it is: avoidance. The mystery that drew you in will start to feel like emptiness.\n\nSaturn doesn't remove things gently. It removes them the way a surgeon removes something — precisely, necessarily, and with recovery time afterward. If you leave on your own terms before this transit peaks, the recovery is shorter.\n\nI'm not trying to scare you. I'm trying to save you three months of agonizing over something your chart already knows the answer to.",
    },
    {
      title: "What Walking Away Actually Looks Like For You",
      body: "Your chart says the hardest part of leaving isn't leaving. It's the silence afterward. Your Moon in the 8th house means you process endings like grief — not the clean kind, but the messy, 3am-crying-in-the-shower kind.\n\nHere's what I want you to know: the pain of leaving is finite. The pain of staying is not. Your chart has been in this loop before — the push-pull, the almost, the \"maybe next month.\" And every time, the loop takes a little more of your self-respect.\n\nYour Mars in Aries is your exit strategy. It's the part of you that is capable of clean breaks, direct action, and the kind of courage that doesn't look back. You've used it before in other areas of your life.\n\nThe truth your chart needs you to hear: you are not leaving because they are a bad person. You are leaving because you are becoming a person who doesn't accept undefined love.",
    },
  ],
  final_word:
    "Here's the verdict: your chart says you already know this needs to end. You've known for a while. The reading you ordered isn't because you're confused — it's because you wanted someone to say it out loud.\n\nSo I'm saying it: this situationship has taught you what you came here to learn. The lesson is complete. Staying is extra credit that nobody is giving you.\n\nGive yourself a timeline. Not a vague \"someday\" — a real date. Two weeks. Have the conversation or simply stop showing up. Your Mars in Aries can do this. Your Venus in Pisces will grieve it. And your North Node in Aries will thank you for the rest of your life.\n\nYou deserve a love that doesn't require a reading to decode. Remember that.",
};

const EX_LOVE = {
  opener:
    "I need to start with something that might be hard to hear. Your chart doesn't show this connection as finished — but it also doesn't show it as fixable. What it shows is something more complicated: a relationship that changed you permanently, whether or not the person ever comes back.",
  sections: [
    {
      title: "Why This One Hit Different",
      body: "Your Pluto in the 8th house was activated by this relationship. That's not a casual thing. Pluto in the 8th house means you don't do surface-level connections to begin with, but this person specifically triggered the kind of emotional depth that rewires your nervous system.\n\nYou didn't just love them. You recognized something in them — a wound, a pattern, a way of being in the world that mirrored something in you. That recognition felt like fate.\n\nBut here's what your chart reveals about 8th house Pluto relationships: they exist to transform you, not to stay. The intensity that drew you together is the same intensity that made it impossible to maintain.\n\nYour Venus opposite Neptune adds another layer. You idealized parts of this person that may not have been as real as you remember. You remember the 2am conversations and forget the 2pm silences.",
    },
    {
      title: "What Your Chart Says About Coming Back",
      body: "Your 7th house ruler is currently in a retrograde cycle that suggests old connections resurfacing. That's not specific to this person — it means the energy of past relationships is active in your chart right now.\n\nBut here's the distinction your chart makes: contact is not reconciliation. A text is not a commitment. Showing up again is not the same as showing up differently.\n\nThe Saturn square to your Venus that's active right now is a reality check transit. It's asking: if this person came back tomorrow, exactly as they were — not the version you've been imagining, the actual person with their actual limitations — would that be enough?\n\nThe honest answer to \"will they come back?\" is: they might. The honest answer to \"should you wait for that?\" is: absolutely not.",
    },
    {
      title: "The Pattern You Need To See",
      body: "Your chart has a Chiron-Venus aspect that I need to talk about. Chiron is the wound that doesn't fully heal — it becomes wisdom instead. When Chiron touches Venus, the wound is in love itself.\n\nYou love people who need saving. Not in the obvious, codependent way — in the subtle way. You're drawn to people who have a pain they can't quite reach, and some part of you believes that your love is the thing that could reach it.\n\nThis ex activated that wound perfectly. They had something broken that you could almost fix. Almost. And that \"almost\" is what keeps you holding on, because walking away feels like admitting that your love wasn't enough.\n\nBut here's the truth: your love WAS enough. It was always enough. The problem was never the quality of your love — it was that you were pouring it into a container that had a hole in the bottom.",
    },
    {
      title: "What Closure Actually Looks Like For You",
      body: "With your Moon in the 12th house, closure is an inside job. It doesn't come from external validation or explanation. It comes from the moment you stop needing the other person to confirm what you already know.\n\nThe closure you're actually looking for is permission to stop loving them. And babe, no one can give you that — not them, not me, not a reading. You give it to yourself by deciding that the chapter is closed, even when the feelings haven't caught up to the decision yet.\n\nYour Mars-Pluto aspect gives you the capacity for radical emotional amputation when you decide something is over. You've done it before. The difference with this relationship is that you haven't decided yet. You're still in the \"what if\" space.\n\nClosing the door doesn't mean forgetting. It doesn't mean the love wasn't real. It means the love completed what it came to do, and what it came to do was transform you, not stay.",
    },
    {
      title: "What Comes After Them",
      body: "Your North Node progression is moving into your 5th house over the next year, and that's a love placement I can't ignore.\n\nThe 5th house is joy. It's creativity, pleasure, romance — the fun kind, not the devastating kind. The kind of love where you laugh more than you cry. Where someone texts you back without games.\n\nAfter what you've been through with this Pluto-8th-house intensity, 5th house energy might feel unfamiliar. It might even feel \"boring\" at first, because you've been conditioned to equate intensity with depth and drama with meaning. Your chart says that conditioning is wrong.\n\nThe person your chart is pointing toward isn't a mirror of your trauma. They're a mirror of your joy. And you won't be ready to meet them if you're still standing at the door of the last relationship, holding it open.",
    },
  ],
  final_word:
    "That relationship happened for you, not to you. It wasn't a mistake, and it wasn't a failure. It was your Pluto doing exactly what Pluto does — burning away what isn't essential so that what is essential can finally breathe.\n\nYou don't need them to come back for this to mean something. It already meant everything it was supposed to mean. The love was real. The transformation was real. And the next version of your life — the one where you don't settle for almost — that's real too. It's waiting.\n\nStop looking backward. Your chart has already turned the page.",
};

export function getMockReading(mockId: string): {
  reading: Record<string, unknown>;
  birth_time: string;
  birth_place: string;
  product_type: string;
} | null {
  // Blind reading is tarot-based — no birth data needed
  if (mockId === "blind") {
    const reading: Record<string, unknown> = { ...BLIND_READING };
    reading.name = "Maya Rodriguez";
    return {
      reading,
      birth_time: "",
      birth_place: "",
      product_type: "blind-reading",
    };
  }

  const birth = MOCK_BIRTHS[mockId];
  if (!birth) return null;

  let reading: Record<string, unknown>;
  let product_type: string;

  switch (mockId) {
    case "brutal":
      reading = { ...BRUTALLY_HONEST };
      product_type = "brutally-honest-reading";
      break;
    case "situationship":
      reading = { ...SITUATIONSHIP_CHECK };
      product_type = "situationship-reality-check";
      break;
    case "exlove":
    case "willheback":
      reading = { ...EX_LOVE };
      product_type = "ex-love-reading";
      break;
    default:
      return null;
  }

  const chart = calculateChart(birth);
  reading.chart = chart;
  reading.meta = {
    name: birth.name,
    dob: birth.date,
    birth_time: birth.time,
    birth_place: birth.placeName,
    geo: { lat: birth.lat, lng: birth.lng, timezone: birth.timezone },
  };
  reading.name = birth.name;

  return {
    reading,
    birth_time: birth.time,
    birth_place: birth.placeName,
    product_type,
  };
}
