import type { PhaseCategory } from "./moon-phase";

export const PHASE_PERSONALITIES: Record<PhaseCategory, string> = {
  new: "The night you were born, the sky held its breath. No moon... just darkness and the kind of silence that comes right before everything changes. That’s you. The one who feels the beginning of things before anyone else even notices the world is about to turn. You don’t wait for permission or proof. You trust what hasn’t happened yet more than what already has, and that reckless, beautiful faith keeps being right.",

  "waxing-crescent":
    "There was barely any light the night you arrived... just a thin, brave curve against all that dark. And maybe that’s why you’ve never needed the whole picture before you say yes. You leap before the net appears. Not because you don’t feel the fear, but because something deeper in you knows that the leap itself is the answer. You carry hope like it’s the most radical thing you own. And it is.",

  "first-quarter":
    "Half light, half shadow... that was the moon the night you came into this world. And you’ve been standing at crossroads ever since. Not frozen. Never frozen. You’re the one who actually chooses. When you love someone, you don’t keep one foot out the door. When you believe in something, you put your whole chest behind it. The people who stay close to you? They’ll never find anyone braver.",

  "waxing-gibbous":
    "The moon was almost full when you were born, so close to complete, but not quite there. Still reaching. And that reaching is the most beautiful thing about you. You notice the crack no one else sees and stay up late to fix it, not for credit, but for the rightness of it. You make everything around you better just by paying attention. The people who truly know you understand that your love lives in the details.",

  full: "Every inch of the moon was lit the night you were born. Nothing hidden. Nothing held back. And you’ve been living at that volume ever since... joy so loud it fills a room, heartbreak so deep it echoes for days. You feel everything, and you refuse to turn it down. The people who truly see you will tell you that being loved by you is the most alive they’ve ever felt.",

  "waning-gibbous":
    "The moon was still bright when you arrived, full enough to light the whole sky, but already beginning to soften. You’re the one who’s been through something and can’t help but leave the door open for the person behind you. You give without keeping a ledger. You love without keeping score. The people in your life don’t always say it, but you’re the reason they believed they could try.",

  "third-quarter":
    "Half the moon was lit when you were born, and half was already letting go. That’s the tension you carry, knowing when something is done, even when everyone around you is still holding on. You feel the endings before they arrive. Not because you’re a pessimist, but because you’ve always been honest enough to look at what’s true, even when the truth is uncomfortable. The people who love you? They envy that bravery.",

  "waning-crescent":
    "The moon was almost gone when you were born... just a whisper of light before the sky went dark again. You’ve always been quieter than most, but the quiet isn’t empty. It’s full. You carry a knowing that has nothing to do with your age. People tell you their secrets without understanding why. You sense the shifts before they happen, the things that need to be released. That’s not sadness... that’s the oldest kind of wisdom there is.",
};

export const SOULMATE_INTERPRETATIONS: Record<PhaseCategory, string> = {
  new: "Your Soulmate Moon is a New Moon, a sky with no light at all. And here’s what that means: everything about your love is still becoming. You haven’t peaked. You haven’t hit the best part yet. You’re standing together in the beautiful dark, and the most extraordinary chapter of your story hasn’t even been written.",

  "waxing-crescent":
    "Your Soulmate Moon is a Waxing Crescent, the thinnest, bravest curve of light. Your love has the energy of something still learning to believe in itself. There’s a tenderness in how you hold what you’re building... carefully, hopefully, like you both know it’s real but you’re still catching your breath from finding it.",

  "first-quarter":
    "Your Soulmate Moon is a First Quarter, perfectly split between light and dark. Your love lives in the tension of two people who don’t agree on everything and chose each other anyway. You met at a crossroads. You keep meeting there. And every time, you choose each other again.",

  "waxing-gibbous":
    "Your Soulmate Moon is a Waxing Gibbous, almost full, almost there, still reaching. There’s a momentum between you that most couples never find. You don’t just love each other, you make each other more. And the most beautiful part? You’re not finished yet.",

  full: "Your Soulmate Moon is a Full Moon, completely, blazingly lit. Nothing hidden between you. Nothing held back. Your love has an intensity that some people will never understand. You see each other fully, the easy parts and the impossible ones, and you stayed. Not because it was simple. Because it was true.",

  "waning-gibbous":
    "Your Soulmate Moon is a Waning Gibbous, still bright, but softening into something gentler. You’ve stopped needing to prove anything. The keeping score is over. The auditions ended a long time ago. What’s left is this warm, steady thing that doesn’t need to be loud to be powerful. People feel it when they’re around you two, even if they can’t name it.",

  "third-quarter":
    "Your Soulmate Moon is a Last Quarter, half light, half shadow, perfectly balanced. You’ve been through something together that changed you both. Your love isn’t the fairy-tale kind... it’s the kind that survived a real question and came back with a real answer. You don’t need the storybook version. You have something more honest.",

  "waning-crescent":
    "Your Soulmate Moon is a Waning Crescent, the last thin light before everything begins again. There’s a deep, quiet knowing between you that most people spend their whole lives searching for. You don’t need to explain yourselves to each other. You never did. That kind of understanding is rarer than almost anything in this world.",
};

export const ZODIAC_PERSONALITIES: Record<string, string> = {
  Aries:
    "You move through the world like you were the first one here, and in a way, you always are. First to feel, first to leap, first to love so fiercely it surprises even you. There’s a fire in you that doesn’t know how to be small. The people brave enough to stand close to it know they’ve found something extraordinary.",

  Taurus:
    "You love the way old trees grow... slowly, deeply, in a way that can’t be shaken. People underestimate you because you’re quiet about what you feel. But the ones who’ve been loved by you? They know. You don’t leave. You don’t flinch. You make the people closest to you feel safe enough to finally stop pretending.",

  Gemini:
    "Your mind is a cathedral with every door open. You want to know everything, not because you’re restless, but because the world keeps being interesting and you refuse to stop noticing. People call you complicated. You’re not. You’re paying attention to more of the world than most people let themselves see.",

  Cancer:
    "You feel the room before you read it. You know when someone’s breaking before they say a word. You carry other people’s pain like it’s your own, and sometimes you forget to carry your own at all. The people who truly know you understand they’ve been given something rare, someone who loves without conditions and without looking for the exit.",

  Leo: "You light up every room you enter, not because you need to, but because your heart doesn’t know how to be dim. You love with your whole body, show up with your whole self, and you have this gift for making ordinary moments feel like the most important thing that ever happened.",

  Virgo:
    "You notice what nobody else catches, the thing that’s off by one degree, the detail that would have wrecked everything if you hadn’t fixed it at midnight. You show love through what you do, never what you say. The people who understand that? They know they’re the luckiest ones in any room.",

  Libra:
    "You want the world to be more beautiful than it is, and not in a shallow way. In the way that means you believe people could be kinder, things could be fairer, love could be more thoughtful. You hold other people’s peace on your shoulders, sometimes at the cost of your own. That’s not weakness. That’s the bravest kind of generosity.",

  Scorpio:
    "You don’t do surfaces. When you love someone, you know them, the version they show the world and the version they hide from everyone, including themselves. That kind of intimacy terrifies most people. Not you. You’d rather have one conversation that cracks you both open than a lifetime of comfortable silence.",

  Sagittarius:
    "You need the sky to be bigger than the ceiling. You’re the one who asks the question nobody else will touch, then laughs when the answer is more complicated than expected. You carry lightness into heavy rooms and faith into impossible situations, and somewhere deep down, you never stop believing something extraordinary is about to happen.",

  Capricorn:
    "You build things that outlast you, not because you’re cold, but because you’ve seen what happens when the foundation cracks. You take your time. You show people who you are through decades, not declarations. The ones who wait long enough to see it find something so solid, so real, they wonder how they ever lived without it.",

  Aquarius:
    "You see the world from an angle most people can’t find, and you stopped apologizing for it years ago. You care about humanity so deeply that the person next to you sometimes wonders if they have to compete with the whole world. But when you turn that focus on one person, when you choose someone... there’s nothing in the universe quite like being seen by you.",

  Pisces:
    "You feel the world at a frequency most people can’t hear. Music moves through you. Moods pass through you. Someone’s sadness across a crowded room finds you before you know their name. You love in a way that makes people feel, maybe for the first time, that they’ve been fully understood. That’s both your gift and your weight, and you carry both with more grace than you give yourself credit for.",
};

export const ELEMENT_COMPATIBILITY: Record<string, string> = {
  "Fire + Fire":
    "Two fire signs together is a love that never learned how to whisper. You challenge each other, inspire each other, and yes, you burn each other sometimes. But you’d choose the fire over the cold every single time. Other couples watch you and wonder where all that energy comes from. The secret is you don’t dim each other down. You never have.",

  "Fire + Earth":
    "On paper, you shouldn’t work. One of you runs toward the edge, the other builds the ground beneath it. But that’s exactly why this works... you teach each other the one thing you each needed most. Patience from one side. Courage from the other. And between you, a love that has both spark and foundation.",

  "Fire + Air":
    "You are the couple that feeds its own flame. One of you brings the spark, the other fans it into something no one else could have imagined. Your conversations go on for hours. Your ideas get wilder together. You make each other think and feel at the same time, and that combination is rarer than either of you realize.",

  "Fire + Water":
    "You speak different emotional languages, and that’s exactly the deal. One of you lives in the gut and the fire, the other in the heart and the deep water. You’ll frustrate each other... that’s not a question. But you’ll show each other parts of the world neither would have found alone. And you already have.",

  "Earth + Earth":
    "Two earth signs together is a quiet, immovable power. You don’t need the grand gestures. You show love through showing up, not once, not when it’s convenient, but every single day. Other couples wonder how you make it look easy. It’s not easy. You’re both just willing to do the work, and too stubborn to stop.",

  "Earth + Air":
    "You don’t always speak the same language, one of you thinks in roots and the other in wind. But that’s where the growth lives. In the gap between how you each see the world, you stretch each other. You make each other more flexible, more curious, more whole than either would have been alone.",

  "Earth + Water":
    "Yours is one of the most natural pairings the stars can make. One of you builds the vessel, the other fills it with depth. There’s a tenderness between you that doesn’t need to announce itself... it just exists. You nurture each other without trying, like it’s the most obvious thing in the world.",

  "Air + Air":
    "Two air signs is a love that lives in the mind first and the heart second, but the heart always catches up. You talk about everything. You debate without bruising. There’s a lightness between you that keeps the relationship breathing, even on the days the world tries to press down.",

  "Air + Water":
    "One of you processes the world through words, the other through waves. You’ll speak different languages in the same sentence, and then one of you will say the exact thing the other didn’t know they needed to hear. That’s the gift. The gap between how you think is exactly where the magic lives.",

  "Water + Water":
    "Two water signs together is an ocean. You feel each other before you speak. You absorb each other’s moods, finish each other’s fears, hold each other through storms you never have to explain. Your love is deep and intuitive and sometimes overwhelming, and neither of you would trade it for anything easier.",
};

export const UPSELL_A = `Your moons found each other. But what would your stars say?

Your zodiac signs hold a deeper layer, one that goes beyond the moon’s pull. Your birth charts carry compatibility patterns and cosmic tensions that most couples never discover.

Explore your Astrology Compatibility → bluntchart.com`;

export const UPSELL_B = `This is your cosmic snapshot, but every snapshot has more to reveal.

The planets were in exact positions the moment you were both born. Your Venus. Your Mars. The houses that shape how you love, how you fight, how you grow together. A full compatibility reading goes deeper into that dance, the one your charts have been doing since before you met.

Coming soon from BluntChart.`;
