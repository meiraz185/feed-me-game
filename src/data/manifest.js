// Centralized asset manifest. All image/sound paths are built from Vite's BASE_URL so the
// game works both in dev (served at "/") and on GitHub Pages (served at "/feed-me-game/").
const BASE = import.meta.env.BASE_URL;

export const CHAR_KEYS = ['frog', 'strawberry', 'watermelon', 'cookie', 'chocolate', 'pizza', 'burger'];
export const FOOD_KEYS = ['strawberry', 'watermelon', 'cookie', 'chocolate', 'pizza', 'burger'];
export const SOUND_KEYS = ['pop', 'crunch', 'boing', 'plop', 'win'];
export const SOUND_VOLUME = { pop: 0.55, crunch: 0.55, boing: 0.45, plop: 0.55, win: 0.65 };
export const BURGER_FRAME_COUNT = 12;

export const ASSET_MANIFEST = {
  characters: Object.fromEntries(CHAR_KEYS.map((k) => [k, `${BASE}images/${k}.png`])),
  foods: Object.fromEntries(FOOD_KEYS.map((k) => [k, `${BASE}images/food-${k}.png`])),
  burgerFrames: Array.from(
    { length: BURGER_FRAME_COUNT },
    (_, i) => `${BASE}images/burger-happy-${String(i + 1).padStart(2, '0')}.png`
  ),
  sounds: Object.fromEntries(SOUND_KEYS.map((k) => [k, `${BASE}sounds/${k}.mp3`])),
};

// Configurable mouth hitbox per character — percentages of the character's rendered image box.
// Tune these against the real artwork, since mouth position differs per image.
export const MOUTH_HITBOX = {
  frog: { xPct: 50, yPct: 58, wPct: 38, hPct: 30 },
  strawberry: { xPct: 50, yPct: 54, wPct: 30, hPct: 24 },
  watermelon: { xPct: 50, yPct: 54, wPct: 30, hPct: 22 },
  cookie: { xPct: 50, yPct: 54, wPct: 30, hPct: 22 },
  chocolate: { xPct: 50, yPct: 54, wPct: 30, hPct: 22 },
  pizza: { xPct: 50, yPct: 54, wPct: 32, hPct: 22 },
  burger: { xPct: 50, yPct: 54, wPct: 32, hPct: 22 },
};

// Speech-bubble nudge (px) applied on top of the base top:2%/left:2% anchor — shifts the
// bubble up and further left so it clears each character's eyes. Tune per character once
// the real artwork is loaded, since face height/width differs per illustration.
// The burger has no entry here on purpose — it never shows a speech bubble.
export const BUBBLE_OFFSET = {
  frog: { upPx: 24, leftPx: 20 },
  strawberry: { upPx: 24, leftPx: 20 },
  watermelon: { upPx: 24, leftPx: 20 },
  cookie: { upPx: 24, leftPx: 20 },
  chocolate: { upPx: 24, leftPx: 20 },
  pizza: { upPx: 24, leftPx: 20 },
};

export const DIALOGUE = {
  frog: 'אני רעב!',
  strawberry: 'יאמי! מה עוד?',
  watermelon: 'יש מקום לעוד!',
  cookie: 'משהו מתוק?',
  chocolate: 'עוד ביס אחד...',
  pizza: 'אני עדיין רעב!',
  burger: 'סוף סוף שבעתי!',
};

export const MUTE_KEY = 'feedme_muted';
export function getInitialMuted() {
  try {
    return localStorage.getItem(MUTE_KEY) === '1';
  } catch (e) {
    return false;
  }
}

export const TIMING = { chew: 250, transform: 650, nextFood: 1100, resume: 1500 };
export const CELEB_TIMING = { swap: 200, jump1: 500, jump2: 1400, settle: 2300, message: 2600, replay: 3100 };

export const CONFETTI_COLORS = ['#FF9433', '#FFC24B', '#FF8FB3', '#5FD1C9', '#7FD99A', '#B48CE0', '#7FB8E0'];
