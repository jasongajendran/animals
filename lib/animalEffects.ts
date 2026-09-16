// Event dispatcher and data definitions for crystal-clear, HD animal celebration animations

export interface AnimalCelebrationData {
  id: string;
  name: string;
  emoji: string;
  category: string;
  tagline: string;
  themeColor: string;
  accentBg: string;
  floatingItems: string[]; // Large, high-visibility emojis
  animationType: 'splash' | 'banana_hop' | 'predator_burst' | 'feather_drift' | 'snow_fall' | 'leaf_flutter' | 'bubble_float' | 'spring_bounce' | 'meadow_bloom';
  origin: { x: number; y: number }; // Screen coordinate in percentage (0 to 1)
}

type CelebrationListener = (data: AnimalCelebrationData) => void;
const listeners: Set<CelebrationListener> = new Set();

export function subscribeCelebration(listener: CelebrationListener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

interface ThemeConfig {
  tagline: string;
  themeColor: string;
  accentBg: string;
  floatingItems: string[];
  animationType: AnimalCelebrationData['animationType'];
}

// Specific, tailored profiles for animals
const ANIMAL_PROFILES: Record<string, ThemeConfig> = {
  // === Big Cats & Apex Predators ===
  lion: {
    tagline: 'King of the Jungle!',
    themeColor: '#D97706',
    accentBg: 'from-amber-500 to-yellow-600',
    floatingItems: ['🦁', '👑', '🐾', '🔥', '✨', '🐾'],
    animationType: 'predator_burst',
  },
  tiger: {
    tagline: 'Fierce Tiger Stripes!',
    themeColor: '#EA580C',
    accentBg: 'from-orange-500 to-amber-600',
    floatingItems: ['🐯', '🔥', '🐾', '⚡', '✨', '🐾'],
    animationType: 'predator_burst',
  },
  cheetah: {
    tagline: 'Super Speed Dash!',
    themeColor: '#CA8A04',
    accentBg: 'from-yellow-500 to-orange-500',
    floatingItems: ['🐆', '⚡', '💨', '✨', '🐾', '⚡'],
    animationType: 'predator_burst',
  },
  leopard: {
    tagline: 'Spotted Forest Stalker!',
    themeColor: '#D97706',
    accentBg: 'from-amber-600 to-yellow-600',
    floatingItems: ['🐆', '🐾', '🌿', '✨', '🐾', '⭐'],
    animationType: 'predator_burst',
  },
  jaguar: {
    tagline: 'Rainforest Champion!',
    themeColor: '#B45309',
    accentBg: 'from-amber-700 to-emerald-600',
    floatingItems: ['🐆', '🐾', '🌿', '💧', '✨'],
    animationType: 'predator_burst',
  },
  wolf: {
    tagline: 'Moonlight Howl!',
    themeColor: '#475569',
    accentBg: 'from-slate-600 to-indigo-700',
    floatingItems: ['🐺', '🌙', '⭐', '❄️', '🌲', '✨'],
    animationType: 'predator_burst',
  },

  // === Safari Giants ===
  elephant: {
    tagline: 'Trunk Water Splash!',
    themeColor: '#0284C7',
    accentBg: 'from-sky-500 to-blue-600',
    floatingItems: ['🐘', '💦', '💧', '🌊', '💦', '💧'],
    animationType: 'splash',
  },
  giraffe: {
    tagline: 'Treetop Leaves Reach!',
    themeColor: '#D97706',
    accentBg: 'from-amber-500 to-emerald-500',
    floatingItems: ['🦒', '🍃', '🌿', '⭐', '🍃', '✨'],
    animationType: 'leaf_flutter',
  },
  hippo: {
    tagline: 'River Water Splash!',
    themeColor: '#0369A1',
    accentBg: 'from-cyan-600 to-blue-700',
    floatingItems: ['🦛', '💦', '💧', '🌊', '🫧', '💧'],
    animationType: 'splash',
  },
  rhino: {
    tagline: 'Mighty Horn Power!',
    themeColor: '#475569',
    accentBg: 'from-slate-600 to-zinc-700',
    floatingItems: ['🦏', '🪨', '⭐', '💨', '🌿', '⭐'],
    animationType: 'predator_burst',
  },
  zebra: {
    tagline: 'Dazzling Stripes Sprint!',
    themeColor: '#18181B',
    accentBg: 'from-slate-800 to-neutral-900',
    floatingItems: ['🦓', '⚡', '✨', '🐾', '⭐', '✨'],
    animationType: 'predator_burst',
  },

  // === Primates ===
  chimp: {
    tagline: 'Playful Banana Bounce!',
    themeColor: '#D97706',
    accentBg: 'from-amber-500 to-yellow-500',
    floatingItems: ['🐒', '🍌', '🌴', '⭐', '🍌', '🍌'],
    animationType: 'banana_hop',
  },
  monkey: {
    tagline: 'Jungle Banana Swing!',
    themeColor: '#D97706',
    accentBg: 'from-amber-500 to-emerald-500',
    floatingItems: ['🐒', '🍌', '🌴', '✨', '🍌', '🍌'],
    animationType: 'banana_hop',
  },
  gorilla: {
    tagline: 'Mighty Jungle Power!',
    themeColor: '#18181B',
    accentBg: 'from-zinc-800 to-emerald-800',
    floatingItems: ['🦍', '🍌', '🌿', '💪', '🍌', '🌴'],
    animationType: 'banana_hop',
  },
  orangutan: {
    tagline: 'Treetop Gentle Swing!',
    themeColor: '#EA580C',
    accentBg: 'from-orange-500 to-emerald-600',
    floatingItems: ['🦧', '🍌', '🌴', '🌺', '🍌', '🍃'],
    animationType: 'banana_hop',
  },
  lemur: {
    tagline: 'Ringtail Leaper!',
    themeColor: '#EA580C',
    accentBg: 'from-orange-500 to-amber-500',
    floatingItems: ['🐒', '🌴', '✨', '🍌', '🍃', '⭐'],
    animationType: 'banana_hop',
  },

  // === Gentle Wonders ===
  panda: {
    tagline: 'Crunchy Bamboo Feast!',
    themeColor: '#059669',
    accentBg: 'from-emerald-600 to-teal-700',
    floatingItems: ['🐼', '🎋', '🍃', '✨', '🎋', '🍃'],
    animationType: 'leaf_flutter',
  },
  koala: {
    tagline: 'Eucalyptus Hug!',
    themeColor: '#059669',
    accentBg: 'from-emerald-500 to-slate-500',
    floatingItems: ['🐨', '🌿', '🍃', '☁️', '🌿', '✨'],
    animationType: 'leaf_flutter',
  },
  sloth: {
    tagline: 'Calm & Slow Relax!',
    themeColor: '#059669',
    accentBg: 'from-emerald-500 to-pink-500',
    floatingItems: ['🦥', '🌺', '🍃', '🌸', '✨', '🍃'],
    animationType: 'leaf_flutter',
  },
  kangaroo: {
    tagline: 'Outback Mega Hop!',
    themeColor: '#D97706',
    accentBg: 'from-amber-600 to-orange-600',
    floatingItems: ['🦘', '⭐', '✨', '🐾', '⭐', '🦘'],
    animationType: 'spring_bounce',
  },
  rabbit: {
    tagline: 'Bunny Hop & Carrots!',
    themeColor: '#EA580C',
    accentBg: 'from-orange-500 to-pink-500',
    floatingItems: ['🐰', '🥕', '🍀', '⭐', '🥕', '🌸'],
    animationType: 'spring_bounce',
  },
  frog: {
    tagline: 'Lilypad Super Leap!',
    themeColor: '#059669',
    accentBg: 'from-emerald-500 to-cyan-500',
    floatingItems: ['🐸', '🪷', '💧', '🍃', '💧', '🪷'],
    animationType: 'spring_bounce',
  },

  // === Ocean & Sea Wildlife ===
  dolphin: {
    tagline: 'High Ocean Splash!',
    themeColor: '#0284C7',
    accentBg: 'from-sky-500 to-blue-600',
    floatingItems: ['🐬', '🫧', '🌊', '💦', '🫧', '✨'],
    animationType: 'splash',
  },
  'blue-whale': {
    tagline: 'Deep Ocean Spout Splash!',
    themeColor: '#0369A1',
    accentBg: 'from-sky-600 to-indigo-700',
    floatingItems: ['🐋', '🫧', '🌊', '💦', '🫧', '💧'],
    animationType: 'splash',
  },
  'humpback-whale': {
    tagline: 'Spectacular Whale Breach!',
    themeColor: '#0369A1',
    accentBg: 'from-sky-600 to-blue-800',
    floatingItems: ['🐋', '🫧', '🌊', '💦', '✨', '🫧'],
    animationType: 'splash',
  },
  orca: {
    tagline: 'Ocean Wave Rider!',
    themeColor: '#0284C7',
    accentBg: 'from-slate-900 to-sky-600',
    floatingItems: ['🐋', '🌊', '🫧', '⚡', '🌊', '🫧'],
    animationType: 'splash',
  },
  beluga: {
    tagline: 'Cheerful Whale Melody!',
    themeColor: '#0284C7',
    accentBg: 'from-sky-400 to-blue-500',
    floatingItems: ['🐳', '🫧', '❄️', '✨', '🫧', '💧'],
    animationType: 'bubble_float',
  },
  narwhal: {
    tagline: 'Unicorn of the Sea!',
    themeColor: '#7C3AED',
    accentBg: 'from-purple-500 to-sky-500',
    floatingItems: ['🦄', '🫧', '❄️', '✨', '💎', '🫧'],
    animationType: 'bubble_float',
  },
  shark: {
    tagline: 'Swift Ocean Hunter!',
    themeColor: '#0284C7',
    accentBg: 'from-slate-700 to-sky-600',
    floatingItems: ['🦈', '🌊', '⚡', '🫧', '🌊', '⚡'],
    animationType: 'splash',
  },
  octopus: {
    tagline: 'Coral Reef Explorer!',
    themeColor: '#9333EA',
    accentBg: 'from-purple-600 to-pink-600',
    floatingItems: ['🐙', '🫧', '💜', '🪸', '🫧', '✨'],
    animationType: 'bubble_float',
  },
  squid: {
    tagline: 'Glowing Deep Sea Glider!',
    themeColor: '#DB2777',
    accentBg: 'from-pink-600 to-purple-600',
    floatingItems: ['🦑', '🫧', '🌊', '✨', '🫧', '💎'],
    animationType: 'bubble_float',
  },
  'sea-turtle': {
    tagline: 'Coral Reef Glider!',
    themeColor: '#059669',
    accentBg: 'from-emerald-500 to-teal-600',
    floatingItems: ['🐢', '🪸', '🫧', '🌿', '🫧', '🌊'],
    animationType: 'bubble_float',
  },
  clownfish: {
    tagline: 'Anemone Reef Swimmer!',
    themeColor: '#EA580C',
    accentBg: 'from-orange-500 to-amber-500',
    floatingItems: ['🐠', '🪸', '🫧', '✨', '🐠', '🫧'],
    animationType: 'bubble_float',
  },
  jellyfish: {
    tagline: 'Glowing Ocean Sparkle!',
    themeColor: '#C084FC',
    accentBg: 'from-purple-400 to-pink-400',
    floatingItems: ['🪼', '✨', '🫧', '💜', '💎', '🫧'],
    animationType: 'bubble_float',
  },
  seahorse: {
    tagline: 'Gentle Reef Swimmer!',
    themeColor: '#F59E0B',
    accentBg: 'from-amber-400 to-pink-500',
    floatingItems: ['🐎', '🪸', '🫧', '✨', '🫧', '⭐'],
    animationType: 'bubble_float',
  },
  starfish: {
    tagline: 'Golden Star of the Sea!',
    themeColor: '#F97316',
    accentBg: 'from-orange-500 to-pink-500',
    floatingItems: ['⭐', '🪸', '🫧', '✨', '⭐', '🫧'],
    animationType: 'bubble_float',
  },
  crab: {
    tagline: 'Beach Snip-Snap Crawl!',
    themeColor: '#DC2626',
    accentBg: 'from-red-500 to-amber-500',
    floatingItems: ['🦀', '🫧', '🏖️', '✨', '🦀', '⭐'],
    animationType: 'spring_bounce',
  },
  lobster: {
    tagline: 'Ocean Claw Wave!',
    themeColor: '#DC2626',
    accentBg: 'from-red-600 to-orange-600',
    floatingItems: ['🦞', '🫧', '🌊', '✨', '🦞', '🫧'],
    animationType: 'bubble_float',
  },
  penguin: {
    tagline: 'Arctic Belly Slide!',
    themeColor: '#0284C7',
    accentBg: 'from-sky-500 to-slate-800',
    floatingItems: ['🐧', '❄️', '🧊', '🐟', '❄️', '⭐'],
    animationType: 'snow_fall',
  },
  seal: {
    tagline: 'Flipper Clap & Splash!',
    themeColor: '#0284C7',
    accentBg: 'from-sky-500 to-cyan-600',
    floatingItems: ['🦭', '❄️', '🫧', '🐟', '💦', '🫧'],
    animationType: 'snow_fall',
  },
  walrus: {
    tagline: 'Arctic Ice Glider!',
    themeColor: '#78350F',
    accentBg: 'from-amber-800 to-sky-600',
    floatingItems: ['🦭', '❄️', '🧊', '🌊', '❄️', '⭐'],
    animationType: 'snow_fall',
  },

  // === Birds ===
  peacock: {
    tagline: 'Emerald Fan Feathers!',
    themeColor: '#047857',
    accentBg: 'from-emerald-600 via-sky-600 to-purple-600',
    floatingItems: ['🦚', '🪶', '💎', '✨', '🪶', '🌸'],
    animationType: 'feather_drift',
  },
  flamingo: {
    tagline: 'Pink Lagoon Dance!',
    themeColor: '#E11D48',
    accentBg: 'from-rose-500 to-pink-500',
    floatingItems: ['🦩', '🪶', '🌸', '✨', '🪶', '💖'],
    animationType: 'feather_drift',
  },
  toucan: {
    tagline: 'Rainbow Beak Call!',
    themeColor: '#D97706',
    accentBg: 'from-amber-500 to-red-500',
    floatingItems: ['🦚', '🌴', '🌺', '✨', '🪶', '⭐'],
    animationType: 'feather_drift',
  },
  macaw: {
    tagline: 'Brilliant Tropical Flight!',
    themeColor: '#DC2626',
    accentBg: 'from-red-500 via-amber-500 to-blue-500',
    floatingItems: ['🦜', '🪶', '🌺', '🌴', '🪶', '✨'],
    animationType: 'feather_drift',
  },
  hummingbird: {
    tagline: 'Fast Flower Hover!',
    themeColor: '#059669',
    accentBg: 'from-emerald-500 via-pink-500 to-purple-500',
    floatingItems: ['🐦', '🌸', '🌺', '✨', '🌸', '💎'],
    animationType: 'feather_drift',
  },
  owl: {
    tagline: 'Wise Night Watch!',
    themeColor: '#4F46E5',
    accentBg: 'from-indigo-600 to-amber-700',
    floatingItems: ['🦉', '🌙', '⭐', '✨', '🪶', '🌲'],
    animationType: 'feather_drift',
  },
  eagle: {
    tagline: 'Soaring Sky Monarch!',
    themeColor: '#B45309',
    accentBg: 'from-amber-700 to-sky-600',
    floatingItems: ['🦅', '🪶', '🏔️', '⭐', '🪶', '✨'],
    animationType: 'feather_drift',
  },
  swan: {
    tagline: 'Graceful Lake Glide!',
    themeColor: '#0284C7',
    accentBg: 'from-sky-400 to-slate-300',
    floatingItems: ['🦢', '🪶', '💧', '✨', '🪶', '🪷'],
    animationType: 'feather_drift',
  },

  // === Farm Friends ===
  cow: {
    tagline: 'Fresh Meadow Moo!',
    themeColor: '#059669',
    accentBg: 'from-emerald-500 to-amber-500',
    floatingItems: ['🐮', '🥛', '🍀', '🌾', '🍀', '🥛'],
    animationType: 'meadow_bloom',
  },
  pig: {
    tagline: 'Joyful Oink Splash!',
    themeColor: '#DB2777',
    accentBg: 'from-pink-500 to-rose-500',
    floatingItems: ['🐷', '💖', '🌸', '🍎', '🐷', '✨'],
    animationType: 'spring_bounce',
  },
  sheep: {
    tagline: 'Soft Wool Clouds!',
    themeColor: '#059669',
    accentBg: 'from-emerald-500 to-slate-400',
    floatingItems: ['🐑', '☁️', '🍀', '✨', '☁️', '🌾'],
    animationType: 'meadow_bloom',
  },
  horse: {
    tagline: 'Galloping Meadow Hero!',
    themeColor: '#92400E',
    accentBg: 'from-amber-700 to-emerald-600',
    floatingItems: ['🐴', '🌟', '🌾', '🍀', '🐴', '✨'],
    animationType: 'predator_burst',
  },
  duck: {
    tagline: 'Pond Quack & Splash!',
    themeColor: '#059669',
    accentBg: 'from-emerald-600 to-sky-500',
    floatingItems: ['🦆', '💧', '🪶', '🌿', '💧', '🦆'],
    animationType: 'splash',
  },
  chicken: {
    tagline: 'Farmyard Cluck!',
    themeColor: '#DC2626',
    accentBg: 'from-red-500 to-amber-500',
    floatingItems: ['🐔', '🌾', '🐣', '⭐', '🌾', '🥚'],
    animationType: 'spring_bounce',
  },
  rooster: {
    tagline: 'Morning Sunrise Crow!',
    themeColor: '#DC2626',
    accentBg: 'from-red-600 to-amber-500',
    floatingItems: ['🐓', '☀️', '🌾', '⭐', '🐓', '✨'],
    animationType: 'predator_burst',
  },
  dog: {
    tagline: 'Happy Tail Wag & Bark!',
    themeColor: '#D97706',
    accentBg: 'from-amber-500 to-rose-500',
    floatingItems: ['🐶', '🦴', '🐾', '❤️', '🐾', '⭐'],
    animationType: 'spring_bounce',
  },
  cat: {
    tagline: 'Purring Cozy Yarn Play!',
    themeColor: '#EA580C',
    accentBg: 'from-orange-500 to-purple-500',
    floatingItems: ['🐱', '🧶', '🐾', '✨', '🐾', '💖'],
    animationType: 'feather_drift',
  },

  // === Bugs ===
  butterfly: {
    tagline: 'Fluttering Garden Wings!',
    themeColor: '#9333EA',
    accentBg: 'from-purple-500 to-pink-500',
    floatingItems: ['🦋', '🌸', '🌺', '✨', '🦋', '🌸'],
    animationType: 'feather_drift',
  },
  bee: {
    tagline: 'Busy Honey Buzz!',
    themeColor: '#D97706',
    accentBg: 'from-amber-500 to-yellow-500',
    floatingItems: ['🐝', '🍯', '🌻', '✨', '🍯', '🐝'],
    animationType: 'feather_drift',
  },
  ladybug: {
    tagline: 'Lucky Garden Friend!',
    themeColor: '#DC2626',
    accentBg: 'from-red-600 to-emerald-600',
    floatingItems: ['🐞', '🍀', '🌸', '✨', '🐞', '🍀'],
    animationType: 'meadow_bloom',
  },

  // === 25 Additional Wildlife Profiles ===
  anteater: {
    tagline: 'Giant Ant Eater!',
    themeColor: '#92400E',
    accentBg: 'from-amber-700 to-amber-900',
    floatingItems: ['🐾', '🐜', '🍃', '✨', '🐜', '🐾'],
    animationType: 'predator_burst',
  },
  antelope: {
    tagline: 'Swift Savanna Leap!',
    themeColor: '#D97706',
    accentBg: 'from-amber-600 to-yellow-600',
    floatingItems: ['🦌', '💨', '⚡', '✨', '🐾', '⭐'],
    animationType: 'spring_bounce',
  },
  coyote: {
    tagline: 'Desert Moonlight Call!',
    themeColor: '#C2410C',
    accentBg: 'from-amber-700 to-orange-700',
    floatingItems: ['🐺', '🌙', '🌵', '⭐', '✨', '🐾'],
    animationType: 'predator_burst',
  },
  jackal: {
    tagline: 'Golden Savanna Scout!',
    themeColor: '#D97706',
    accentBg: 'from-amber-600 to-yellow-600',
    floatingItems: ['🐺', '🐾', '⭐', '🌾', '✨', '🐾'],
    animationType: 'predator_burst',
  },
  lynx: {
    tagline: 'Snowy Tufted Prowler!',
    themeColor: '#0284C7',
    accentBg: 'from-slate-600 to-cyan-600',
    floatingItems: ['🐾', '❄️', '🌲', '⭐', '✨', '🐾'],
    animationType: 'snow_fall',
  },
  pangolin: {
    tagline: 'Armored Pinecone Curl!',
    themeColor: '#B45309',
    accentBg: 'from-amber-800 to-yellow-700',
    floatingItems: ['🪖', '🍃', '✨', '⭐', '🐾', '✨'],
    animationType: 'leaf_flutter',
  },
  porcupine: {
    tagline: 'Bristling Quill Shield!',
    themeColor: '#9A3412',
    accentBg: 'from-amber-900 to-orange-800',
    floatingItems: ['🦔', '🌲', '⭐', '✨', '🍃', '⭐'],
    animationType: 'predator_burst',
  },
  puma: {
    tagline: 'Mountain Ridge Stalker!',
    themeColor: '#EA580C',
    accentBg: 'from-amber-700 to-orange-600',
    floatingItems: ['🐾', '🏔️', '⚡', '⭐', '✨', '🐾'],
    animationType: 'predator_burst',
  },
  'red-panda': {
    tagline: 'Playful Tree Acrobats!',
    themeColor: '#DC2626',
    accentBg: 'from-red-600 to-orange-500',
    floatingItems: ['🐼', '🎋', '🍃', '✨', '🌸', '🎋'],
    animationType: 'banana_hop',
  },
  'snow-leopard': {
    tagline: 'Ghost of the Mountains!',
    themeColor: '#0EA5E9',
    accentBg: 'from-cyan-700 to-slate-700',
    floatingItems: ['🐆', '❄️', '🏔️', '✨', '🐾', '❄️'],
    animationType: 'snow_fall',
  },
  tapir: {
    tagline: 'Jungle Snout Explorer!',
    themeColor: '#047857',
    accentBg: 'from-emerald-700 to-slate-700',
    floatingItems: ['🐾', '🌿', '💧', '🍃', '✨', '💧'],
    animationType: 'leaf_flutter',
  },
  elk: {
    tagline: 'Grand Mountain Antlers!',
    themeColor: '#78350F',
    accentBg: 'from-amber-800 to-emerald-700',
    floatingItems: ['🦌', '🌲', '🏔️', '⭐', '✨', '🦌'],
    animationType: 'predator_burst',
  },
  gazelle: {
    tagline: 'Graceful Plains Sprint!',
    themeColor: '#CA8A04',
    accentBg: 'from-amber-500 to-yellow-500',
    floatingItems: ['🦌', '💨', '🌾', '⭐', '✨', '🐾'],
    animationType: 'spring_bounce',
  },
  mole: {
    tagline: 'Underground Tunnel Master!',
    themeColor: '#475569',
    accentBg: 'from-slate-700 to-amber-900',
    floatingItems: ['🐾', '🪨', '⭐', '✨', '🐾', '🪨'],
    animationType: 'meadow_bloom',
  },
  'sea-lion': {
    tagline: 'Playful Wave Somersault!',
    themeColor: '#0284C7',
    accentBg: 'from-sky-500 to-teal-600',
    floatingItems: ['🦭', '🌊', '🫧', '🐟', '💦', '🫧'],
    animationType: 'splash',
  },
  'manta-ray': {
    tagline: 'Majestic Ocean Glider!',
    themeColor: '#0369A1',
    accentBg: 'from-sky-700 to-indigo-800',
    floatingItems: ['🫧', '🌊', '✨', '💎', '🫧', '🌊'],
    animationType: 'bubble_float',
  },
  'sperm-whale': {
    tagline: 'Deep Sea Titan Dive!',
    themeColor: '#1E293B',
    accentBg: 'from-blue-700 to-slate-900',
    floatingItems: ['🐋', '🌊', '🫧', '⚓', '💦', '🫧'],
    animationType: 'splash',
  },
  'man-of-war': {
    tagline: 'Glowing Ocean Drifter!',
    themeColor: '#7C3AED',
    accentBg: 'from-purple-600 to-sky-600',
    floatingItems: ['🪼', '✨', '🫧', '💜', '💎', '🫧'],
    animationType: 'bubble_float',
  },
  cockatoo: {
    tagline: 'Crest Feather Dance!',
    themeColor: '#F59E0B',
    accentBg: 'from-amber-400 to-pink-500',
    floatingItems: ['🦜', '🪶', '🌺', '✨', '⭐', '🪶'],
    animationType: 'feather_drift',
  },
  kingfisher: {
    tagline: 'Sparkling River Dart!',
    themeColor: '#0284C7',
    accentBg: 'from-cyan-500 to-blue-600',
    floatingItems: ['🐦', '💧', '🐟', '✨', '🪶', '💧'],
    animationType: 'feather_drift',
  },
  gecko: {
    tagline: 'Wall-Climbing Wonder!',
    themeColor: '#65A30D',
    accentBg: 'from-lime-600 to-emerald-600',
    floatingItems: ['🦎', '🍃', '⭐', '✨', '🌸', '🍃'],
    animationType: 'spring_bounce',
  },
  python: {
    tagline: 'Emerald Jungle Coils!',
    themeColor: '#059669',
    accentBg: 'from-emerald-600 to-teal-700',
    floatingItems: ['🐍', '🌿', '✨', '🌴', '🍃', '⭐'],
    animationType: 'leaf_flutter',
  },
  salamander: {
    tagline: 'Fire Pattern Glow!',
    themeColor: '#EA580C',
    accentBg: 'from-orange-600 to-amber-500',
    floatingItems: ['🦎', '🔥', '💧', '✨', '🍃', '⭐'],
    animationType: 'meadow_bloom',
  },
  toad: {
    tagline: 'Mossy Meadow Croak!',
    themeColor: '#047857',
    accentBg: 'from-emerald-700 to-amber-700',
    floatingItems: ['🐸', '🪷', '💧', '🍃', '✨', '🪷'],
    animationType: 'spring_bounce',
  },
  tortoise: {
    tagline: 'Wise Hundred-Year Walk!',
    themeColor: '#065F46',
    accentBg: 'from-emerald-800 to-amber-800',
    floatingItems: ['🐢', '🌿', '🍃', '⭐', '✨', '🍃'],
    animationType: 'leaf_flutter',
  },
};

// Generic fallback by category
const CATEGORY_FALLBACKS: Record<string, ThemeConfig> = {
  farm: {
    tagline: 'Country Farm Friend!',
    themeColor: '#059669',
    accentBg: 'from-emerald-500 to-amber-500',
    floatingItems: ['🌾', '🍀', '⭐', '🐾', '🌾', '🍀'],
    animationType: 'meadow_bloom',
  },
  wild: {
    tagline: 'Wild Adventure!',
    themeColor: '#D97706',
    accentBg: 'from-amber-500 to-emerald-600',
    floatingItems: ['🐾', '🌴', '🌿', '⭐', '✨', '🐾'],
    animationType: 'predator_burst',
  },
  sea: {
    tagline: 'Ocean Wonder!',
    themeColor: '#0284C7',
    accentBg: 'from-sky-500 to-blue-600',
    floatingItems: ['🫧', '🌊', '💧', '🐠', '🫧', '🪸'],
    animationType: 'bubble_float',
  },
  birds: {
    tagline: 'Feathered Friend!',
    themeColor: '#E11D48',
    accentBg: 'from-rose-500 to-sky-500',
    floatingItems: ['🪶', '✨', '🌸', '⭐', '🪶', '🌺'],
    animationType: 'feather_drift',
  },
  bugs: {
    tagline: 'Garden Explorer!',
    themeColor: '#9333EA',
    accentBg: 'from-purple-500 to-pink-500',
    floatingItems: ['🌸', '🌺', '✨', '🍃', '⭐', '🌸'],
    animationType: 'feather_drift',
  },
};

/**
 * Triggers a completely unique, personalized visual animation with large, crisp, distinct HD elements
 */
export function playAnimalCelebration(
  animal: { id: string; category?: string; name?: string; emoji?: string },
  originCoord?: { x: number; y: number }
) {
  if (typeof window === 'undefined') return;

  const origin = originCoord || { x: 0.5, y: 0.5 };

  const config: ThemeConfig =
    ANIMAL_PROFILES[animal.id] ||
    (animal.category ? CATEGORY_FALLBACKS[animal.category] : null) || {
      tagline: `Hello, ${animal.name || 'Friend'}!`,
      themeColor: '#D97706',
      accentBg: 'from-amber-500 to-orange-500',
      floatingItems: [animal.emoji || '⭐', '✨', '🐾', '⭐', '✨', '🎉'],
      animationType: 'spring_bounce',
    };

  const payload: AnimalCelebrationData = {
    id: animal.id,
    name: animal.name || 'Animal',
    emoji: animal.emoji || '🐾',
    category: animal.category || 'wild',
    tagline: config.tagline,
    themeColor: config.themeColor,
    accentBg: config.accentBg,
    floatingItems: config.floatingItems,
    animationType: config.animationType,
    origin,
  };

  listeners.forEach((listener) => {
    try {
      listener(payload);
    } catch (e) {
      console.error(e);
    }
  });
}
