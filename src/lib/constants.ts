import type { Memory, TimelineEvent, FlowerData, ConstellationData } from '@/types';

/* ═══════════════════════════════════════════════════════
   Color Palette
   ═══════════════════════════════════════════════════════ */
export const COLORS = {
  ivory: '#FFF8F0',
  champagne: '#F5E6D3',
  cream: '#FAF0E6',
  beige: '#F0E4D7',
  blush: '#F2D5D0',
  peach: '#EDCFC4',
  rose: '#E8C4C4',
  warmWhite: '#FFFDF9',
  darkAmbient: '#0A0908',
  darkWarm: '#1A1614',
  darkSoft: '#2A2420',
  goldAccent: '#D4A574',
  goldLight: '#E8C9A0',
} as const;

/* ═══════════════════════════════════════════════════════
   Passcode
   ═══════════════════════════════════════════════════════ */
export const PASSCODE = '1409';

/* ═══════════════════════════════════════════════════════
   Memories
   ═══════════════════════════════════════════════════════ */
export const MEMORIES: Memory[] = [
  {
    id: 1,
    date: 'January 2019',
    title: 'The First Hello',
    description: 'The day the universe conspired to place you right where my story needed you most. Nothing would ever be ordinary again.',
    color: COLORS.blush,
  },
  {
    id: 2,
    date: 'Summer 2020',
    title: 'Dancing in the Rain',
    description: 'When the world stood still, we found our own music. That afternoon taught me that joy is not a destination — it\'s the person standing next to you.',
    color: COLORS.peach,
  },
  {
    id: 3,
    date: 'March 2021',
    title: 'Midnight Conversations',
    description: 'Three AM never felt so alive. We traded secrets like they were precious gifts, and every word you spoke became a piece of home.',
    color: COLORS.rose,
  },
  {
    id: 4,
    date: 'October 2022',
    title: 'The Golden Hour',
    description: 'Sunlight draped over us like a warm embrace. You laughed at something small, and I realized that this — this exact moment — was everything.',
    color: COLORS.champagne,
  },
  {
    id: 5,
    date: 'July 2023',
    title: 'A Quiet Promise',
    description: 'No grand gestures. No fireworks. Just your hand in mine and the quiet understanding that some bonds are woven from stardust.',
    color: COLORS.blush,
  },
  {
    id: 6,
    date: 'Today',
    title: 'This Moment',
    description: 'Right here, right now — every memory led us to this. And I would walk every path again, just to arrive at you.',
    color: COLORS.goldAccent,
  },
];

/* ═══════════════════════════════════════════════════════
   Timeline Events
   ═══════════════════════════════════════════════════════ */
export const TIMELINE_EVENTS: TimelineEvent[] = [
  { year: 2019, title: 'The Beginning', note: 'When the first chapter of our story was written in invisible ink' },
  { year: 2020, title: 'Growing Together', note: 'Through every storm, we discovered that the strongest roots grow in the rain' },
  { year: 2021, title: 'New Adventures', note: 'Discovering the world through your eyes made everything brand new' },
  { year: 2022, title: 'Brighter Days', note: 'Every sunrise painted in warmer colors than the last' },
  { year: 2023, title: 'Deeper Roots', note: 'Building something that time itself would envy' },
  { year: 2024, title: 'This Moment', note: 'Right here, right now — this is everything we ever needed' },
];

/* ═══════════════════════════════════════════════════════
   Letter Content
   ═══════════════════════════════════════════════════════ */
export const LETTER_CONTENT = {
  date: 'September 14',
  greeting: 'To the one who made this universe worth living in,',
  paragraphs: [
    'There are things I carry with me that words have never quite been able to hold. But today, on the day the world was gifted with you, I want to try. Because you deserve to know — truly know — what your existence means to the people who love you.',
    'You have this way of making ordinary moments feel sacred. A morning cup of tea becomes a ritual. A shared silence becomes a conversation deeper than any words. You don\'t just exist in people\'s lives — you transform them, quietly, gently, the way light transforms a room without ever announcing itself.',
    'I\'ve watched you carry the weight of the world with a grace that makes it look effortless, even when I know it isn\'t. I\'ve seen you choose kindness when the world chose chaos. I\'ve seen you love so openly that it made me brave enough to do the same.',
    'So today, I don\'t just celebrate your birthday. I celebrate every version of you — the one who laughs too loudly, the one who cries during movies, the one who stays up too late thinking about tomorrow, the one who shows up even when it\'s hard. Every single version of you is a masterpiece.',
  ],
  closing: 'With all the love this universe can hold,',
  signature: 'Someone who will always choose you',
};

/* ═══════════════════════════════════════════════════════
   Story Messages
   ═══════════════════════════════════════════════════════ */
export const STORY_MESSAGES = [
  'In every small moment, you were the meaning I didn\'t know I was searching for',
  'The world is more beautiful because you exist in it',
  'This is not just a birthday. This is a celebration of everything you are.',
];

/* ═══════════════════════════════════════════════════════
   Flower Garden Data
   ═══════════════════════════════════════════════════════ */
export const GARDEN_FLOWERS: FlowerData[] = [
  { id: 1, x: 10, y: 30, size: 1.2, color: COLORS.rose, message: 'You make the world bloom', petalCount: 6, delay: 0 },
  { id: 2, x: 25, y: 60, size: 0.9, color: COLORS.blush, message: 'Every moment with you is a gift', petalCount: 5, delay: 0.2 },
  { id: 3, x: 40, y: 25, size: 1.1, color: COLORS.peach, message: 'Your light reaches further than you know', petalCount: 7, delay: 0.4 },
  { id: 4, x: 55, y: 55, size: 1.0, color: COLORS.champagne, message: 'You are the warmth in every season', petalCount: 6, delay: 0.6 },
  { id: 5, x: 70, y: 35, size: 1.3, color: COLORS.rose, message: 'Some souls are gardens — yours is infinite', petalCount: 8, delay: 0.8 },
  { id: 6, x: 85, y: 50, size: 0.8, color: COLORS.blush, message: 'Growing, always growing, always beautiful', petalCount: 5, delay: 1.0 },
  { id: 7, x: 50, y: 75, size: 1.0, color: COLORS.peach, message: 'A flower doesn\'t compete — it just blooms', petalCount: 6, delay: 1.2 },
  { id: 8, x: 30, y: 45, size: 1.1, color: COLORS.rose, message: 'Rooted in love, reaching for light', petalCount: 7, delay: 0.3 },
];

/* ═══════════════════════════════════════════════════════
   Constellation Wishes
   ═══════════════════════════════════════════════════════ */
export const CONSTELLATIONS: ConstellationData[] = [
  {
    id: 1,
    stars: [0, 1, 2, 3, 4],
    wish: 'May your days be filled with the kind of joy that makes time stand still',
    name: 'The Heart',
  },
  {
    id: 2,
    stars: [5, 6, 7, 8],
    wish: 'May you always find light, even in the darkest skies',
    name: 'The Star',
  },
  {
    id: 3,
    stars: [9, 10, 11, 12, 13],
    wish: 'May every dream you carry find its way home to you',
    name: 'The Dream',
  },
];
