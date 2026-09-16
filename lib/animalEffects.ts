import confetti from 'canvas-confetti';

interface EffectConfig {
  emojis?: string[];
  colors: string[];
  particleCount?: number;
  spread?: number;
  gravity?: number;
  scalar?: number;
  ticks?: number;
  drift?: number;
  startVelocity?: number;
  specialEffect?: 'fountain' | 'snow' | 'bounce' | 'flutter' | 'spiral' | 'burst';
}

// Animal-specific visual profiles
const ANIMAL_EFFECT_MAP: Record<string, EffectConfig> = {
  // === Big Cats ===
  lion: {
    emojis: ['🦁', '🐾', '👑', '✨'],
    colors: ['#F59E0B', '#D97706', '#B45309', '#FBBF24', '#FEF08A'],
    spread: 80,
    scalar: 1.3,
    startVelocity: 35,
    specialEffect: 'burst',
  },
  tiger: {
    emojis: ['🐯', '🐾', '🔥', '⚡'],
    colors: ['#EA580C', '#C2410C', '#18181B', '#F97316', '#FBBF24'],
    spread: 85,
    scalar: 1.25,
    startVelocity: 38,
    specialEffect: 'burst',
  },
  cheetah: {
    emojis: ['🐆', '⚡', '💨', '✨'],
    colors: ['#EAB308', '#CA8A04', '#18181B', '#FEF08A'],
    spread: 90,
    scalar: 1.2,
    startVelocity: 45,
    specialEffect: 'burst',
  },
  leopard: {
    emojis: ['🐆', '🐾', '🌿', '✨'],
    colors: ['#D97706', '#B45309', '#18181B', '#FDE68A'],
    spread: 75,
    scalar: 1.2,
  },

  // === Safari & Jungle Giants ===
  elephant: {
    emojis: ['🐘', '💦', '💧', '🌿'],
    colors: ['#38BDF8', '#0284C7', '#64748B', '#10B981', '#E0F2FE'],
    spread: 70,
    gravity: 0.9,
    scalar: 1.35,
    startVelocity: 42,
    specialEffect: 'fountain',
  },
  giraffe: {
    emojis: ['🦒', '🍃', '🌿', '⭐'],
    colors: ['#F59E0B', '#D97706', '#84CC16', '#FEF08A', '#10B981'],
    spread: 65,
    gravity: 0.65,
    scalar: 1.3,
    startVelocity: 40,
    specialEffect: 'fountain',
  },
  zebra: {
    emojis: ['🦓', '⚡', '✨', '🐾'],
    colors: ['#000000', '#FFFFFF', '#94A3B8', '#E2E8F0', '#18181B'],
    spread: 80,
    scalar: 1.25,
    specialEffect: 'burst',
  },
  hippo: {
    emojis: ['🦛', '💦', '💧', '🌿'],
    colors: ['#0284C7', '#38BDF8', '#64748B', '#0EA5E9'],
    spread: 70,
    gravity: 1.1,
    scalar: 1.3,
  },
  rhino: {
    emojis: ['🦏', '🌿', '🪨', '⭐'],
    colors: ['#64748B', '#475569', '#10B981', '#94A3B8'],
    spread: 75,
    scalar: 1.25,
  },

  // === Primates ===
  chimp: {
    emojis: ['🐒', '🍌', '🌴', '⭐'],
    colors: ['#FBBF24', '#10B981', '#059669', '#F59E0B'],
    spread: 75,
    scalar: 1.3,
    specialEffect: 'bounce',
  },
  monkey: {
    emojis: ['🐒', '🍌', '🌴', '✨'],
    colors: ['#FBBF24', '#10B981', '#059669', '#F59E0B'],
    spread: 75,
    scalar: 1.3,
    specialEffect: 'bounce',
  },
  gorilla: {
    emojis: ['🦍', '🍌', '🌿', '💪'],
    colors: ['#18181B', '#3F3F46', '#10B981', '#FBBF24'],
    spread: 80,
    scalar: 1.35,
  },
  orangutan: {
    emojis: ['🦧', '🍌', '🌴', '🌺'],
    colors: ['#EA580C', '#C2410C', '#10B981', '#FDBA74'],
    spread: 75,
    scalar: 1.3,
  },
  lemur: {
    emojis: ['🐒', '🌴', '✨', '🍃'],
    colors: ['#F97316', '#64748B', '#10B981', '#FED7AA'],
    spread: 70,
    scalar: 1.25,
  },

  // === Unique Wild Mammals ===
  panda: {
    emojis: ['🐼', '🎋', '🍃', '✨'],
    colors: ['#10B981', '#047857', '#1E293B', '#F8FAFC', '#34D399'],
    spread: 70,
    gravity: 0.75,
    scalar: 1.35,
    specialEffect: 'flutter',
  },
  koala: {
    emojis: ['🐨', '🌿', '🍃', '☁️'],
    colors: ['#059669', '#34D399', '#94A3B8', '#64748B', '#A7F3D0'],
    spread: 60,
    gravity: 0.7,
    scalar: 1.3,
    specialEffect: 'flutter',
  },
  kangaroo: {
    emojis: ['🦘', '⭐', '✨', '🐾'],
    colors: ['#D97706', '#F59E0B', '#B45309', '#FDE68A'],
    spread: 70,
    gravity: 1.3,
    startVelocity: 42,
    scalar: 1.3,
    specialEffect: 'bounce',
  },
  sloth: {
    emojis: ['🦥', '🌺', '🍃', '🌸'],
    colors: ['#10B981', '#F472B6', '#34D399', '#FB7185', '#86EFAC'],
    spread: 50,
    gravity: 0.45,
    startVelocity: 18,
    ticks: 120,
    scalar: 1.3,
    specialEffect: 'flutter',
  },
  bear: {
    emojis: ['🐻', '🍯', '🍂', '🫐'],
    colors: ['#F59E0B', '#D97706', '#92400E', '#3B82F6', '#FEF3C7'],
    spread: 75,
    scalar: 1.3,
  },
  wolf: {
    emojis: ['🐺', '✨', '🌲', '❄️'],
    colors: ['#64748B', '#94A3B8', '#38BDF8', '#E2E8F0', '#F8FAFC'],
    spread: 75,
    scalar: 1.25,
  },
  fox: {
    emojis: ['🦊', '🔥', '🍂', '✨'],
    colors: ['#EA580C', '#F97316', '#D97706', '#FED7AA'],
    spread: 75,
    scalar: 1.25,
    specialEffect: 'burst',
  },
  rabbit: {
    emojis: ['🐰', '🥕', '🍀', '⭐'],
    colors: ['#F97316', '#10B981', '#FBBF24', '#F472B6', '#FFFFFF'],
    spread: 70,
    gravity: 1.25,
    scalar: 1.3,
    specialEffect: 'bounce',
  },
  hedgehog: {
    emojis: ['🦔', '🍄', '🍂', '⭐'],
    colors: ['#92400E', '#D97706', '#EF4444', '#FEF3C7'],
    spread: 65,
    scalar: 1.25,
  },
  squirrel: {
    emojis: ['🐿️', '🌰', '🍂', '✨'],
    colors: ['#D97706', '#B45309', '#92400E', '#FDE68A'],
    spread: 70,
    scalar: 1.25,
  },
  camel: {
    emojis: ['🐪', '☀️', '🏜️', '✨'],
    colors: ['#D97706', '#F59E0B', '#FBBF24', '#FEF08A'],
    spread: 70,
    scalar: 1.25,
  },
  'bactrian-camel': {
    emojis: ['🐫', '☀️', '🏜️', '✨'],
    colors: ['#D97706', '#F59E0B', '#FBBF24', '#FEF08A'],
    spread: 70,
    scalar: 1.25,
  },

  // === Ocean & Sea Wildlife ===
  dolphin: {
    emojis: ['🐬', '🫧', '🌊', '💦'],
    colors: ['#0284C7', '#0EA5E9', '#38BDF8', '#7DD3FC', '#E0F2FE'],
    spread: 75,
    gravity: 0.8,
    startVelocity: 38,
    scalar: 1.3,
    specialEffect: 'fountain',
  },
  'blue-whale': {
    emojis: ['🐋', '🫧', '🌊', '💦'],
    colors: ['#0369A1', '#0284C7', '#38BDF8', '#BAE6FD'],
    spread: 85,
    gravity: 0.85,
    startVelocity: 44,
    scalar: 1.4,
    specialEffect: 'fountain',
  },
  'humpback-whale': {
    emojis: ['🐋', '🫧', '🌊', '✨'],
    colors: ['#0369A1', '#0284C7', '#38BDF8', '#BAE6FD'],
    spread: 85,
    gravity: 0.85,
    startVelocity: 44,
    scalar: 1.4,
    specialEffect: 'fountain',
  },
  orca: {
    emojis: ['🐋', '🌊', '🫧', '⚡'],
    colors: ['#000000', '#FFFFFF', '#0284C7', '#38BDF8'],
    spread: 80,
    scalar: 1.35,
    specialEffect: 'fountain',
  },
  beluga: {
    emojis: ['🐳', '🫧', '❄️', '✨'],
    colors: ['#F8FAFC', '#E0F2FE', '#38BDF8', '#BAE6FD'],
    spread: 70,
    gravity: 0.75,
    scalar: 1.3,
    specialEffect: 'fountain',
  },
  narwhal: {
    emojis: ['🦄', '🫧', '❄️', '✨'],
    colors: ['#38BDF8', '#818CF8', '#C084FC', '#E0F2FE'],
    spread: 75,
    scalar: 1.3,
    specialEffect: 'fountain',
  },
  shark: {
    emojis: ['🦈', '🌊', '⚡', '🫧'],
    colors: ['#0284C7', '#475569', '#64748B', '#38BDF8'],
    spread: 80,
    scalar: 1.3,
    specialEffect: 'burst',
  },
  octopus: {
    emojis: ['🐙', '🫧', '💜', '🌊'],
    colors: ['#9333EA', '#A855F7', '#C084FC', '#38BDF8', '#F472B6'],
    spread: 80,
    gravity: 0.8,
    scalar: 1.3,
  },
  squid: {
    emojis: ['🦑', '🫧', '🌊', '✨'],
    colors: ['#EC4899', '#A855F7', '#38BDF8', '#F472B6'],
    spread: 75,
    scalar: 1.3,
  },
  'sea-turtle': {
    emojis: ['🐢', '🪸', '🫧', '🌿'],
    colors: ['#059669', '#10B981', '#38BDF8', '#34D399', '#0284C7'],
    spread: 70,
    gravity: 0.7,
    scalar: 1.3,
    specialEffect: 'flutter',
  },
  clownfish: {
    emojis: ['🐠', '🪸', '🫧', '✨'],
    colors: ['#EA580C', '#F97316', '#FFFFFF', '#38BDF8', '#FBBF24'],
    spread: 75,
    scalar: 1.3,
  },
  jellyfish: {
    emojis: ['🪼', '✨', '🫧', '💜'],
    colors: ['#C084FC', '#E879F9', '#38BDF8', '#F472B6', '#DDD6FE'],
    spread: 65,
    gravity: 0.5,
    ticks: 100,
    scalar: 1.35,
    specialEffect: 'flutter',
  },
  starfish: {
    emojis: ['⭐', '🪸', '🫧', '✨'],
    colors: ['#F97316', '#F59E0B', '#EC4899', '#38BDF8'],
    spread: 75,
    scalar: 1.3,
  },
  seahorse: {
    emojis: ['🐎', '🪸', '🫧', '✨'],
    colors: ['#F59E0B', '#EC4899', '#38BDF8', '#34D399'],
    spread: 65,
    gravity: 0.65,
    scalar: 1.3,
    specialEffect: 'flutter',
  },
  crab: {
    emojis: ['🦀', '🫧', '🏖️', '✨'],
    colors: ['#EF4444', '#F97316', '#FBBF24', '#38BDF8'],
    spread: 70,
    scalar: 1.25,
  },
  lobster: {
    emojis: ['🦞', '🫧', '🌊', '✨'],
    colors: ['#DC2626', '#EF4444', '#F97316', '#38BDF8'],
    spread: 70,
    scalar: 1.25,
  },
  penguin: {
    emojis: ['🐧', '❄️', '🧊', '🐟'],
    colors: ['#0284C7', '#38BDF8', '#18181B', '#FFFFFF', '#F59E0B'],
    spread: 70,
    gravity: 0.9,
    scalar: 1.3,
    specialEffect: 'snow',
  },
  seal: {
    emojis: ['🦭', '❄️', '🫧', '🐟'],
    colors: ['#64748B', '#38BDF8', '#E0F2FE', '#94A3B8'],
    spread: 70,
    scalar: 1.3,
    specialEffect: 'snow',
  },
  walrus: {
    emojis: ['🦭', '❄️', '🧊', '🌊'],
    colors: ['#78350F', '#92400E', '#38BDF8', '#CBD5E1'],
    spread: 70,
    scalar: 1.3,
    specialEffect: 'snow',
  },

  // === Birds & Winged Wildlife ===
  peacock: {
    emojis: ['🦚', '🪶', '💎', '✨'],
    colors: ['#047857', '#0284C7', '#7C3AED', '#10B981', '#38BDF8', '#F59E0B'],
    spread: 90,
    gravity: 0.7,
    scalar: 1.35,
    specialEffect: 'flutter',
  },
  flamingo: {
    emojis: ['🦩', '🪶', '🌸', '✨'],
    colors: ['#F43F5E', '#FB7185', '#FDA4AF', '#FFE4E6', '#38BDF8'],
    spread: 75,
    gravity: 0.65,
    scalar: 1.3,
    specialEffect: 'flutter',
  },
  toucan: {
    emojis: ['🦚', '🌴', '🌺', '✨'],
    colors: ['#F59E0B', '#EF4444', '#10B981', '#0284C7', '#18181B'],
    spread: 80,
    scalar: 1.3,
  },
  macaw: {
    emojis: ['🦜', '🪶', '🌺', '🌴'],
    colors: ['#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#EC4899'],
    spread: 85,
    gravity: 0.7,
    scalar: 1.3,
    specialEffect: 'flutter',
  },
  owl: {
    emojis: ['🦉', '🌙', '⭐', '✨'],
    colors: ['#D97706', '#92400E', '#6366F1', '#FDE68A', '#FEF3C7'],
    spread: 70,
    gravity: 0.7,
    scalar: 1.3,
  },
  eagle: {
    emojis: ['🦅', '🪶', '🏔️', '⭐'],
    colors: ['#92400E', '#B45309', '#F59E0B', '#F8FAFC'],
    spread: 80,
    gravity: 0.65,
    scalar: 1.3,
  },
  hummingbird: {
    emojis: ['🐦', '🌸', '🌺', '✨'],
    colors: ['#10B981', '#EC4899', '#8B5CF6', '#F59E0B', '#38BDF8'],
    spread: 80,
    gravity: 0.5,
    startVelocity: 30,
    scalar: 1.25,
    specialEffect: 'flutter',
  },
  swan: {
    emojis: ['🦢', '🪶', '💧', '✨'],
    colors: ['#F8FAFC', '#E2E8F0', '#38BDF8', '#F59E0B'],
    spread: 65,
    gravity: 0.6,
    scalar: 1.3,
    specialEffect: 'flutter',
  },
  puffin: {
    emojis: ['🐧', '🐟', '🌊', '✨'],
    colors: ['#18181B', '#FFFFFF', '#EA580C', '#38BDF8'],
    spread: 70,
    scalar: 1.3,
  },

  // === Farm Friends ===
  cow: {
    emojis: ['🐮', '🥛', '🍀', '🌾'],
    colors: ['#18181B', '#FFFFFF', '#10B981', '#FDE68A'],
    spread: 70,
    scalar: 1.3,
  },
  pig: {
    emojis: ['🐷', '💖', '🌸', '🍎'],
    colors: ['#F472B6', '#FB7185', '#FDA4AF', '#F43F5E'],
    spread: 70,
    scalar: 1.3,
    specialEffect: 'bounce',
  },
  sheep: {
    emojis: ['🐑', '☁️', '🍀', '✨'],
    colors: ['#F8FAFC', '#E2E8F0', '#10B981', '#CBD5E1'],
    spread: 65,
    gravity: 0.8,
    scalar: 1.3,
  },
  horse: {
    emojis: ['🐴', '🌟', '🌾', '🍀'],
    colors: ['#92400E', '#B45309', '#F59E0B', '#10B981'],
    spread: 75,
    scalar: 1.3,
    specialEffect: 'burst',
  },
  duck: {
    emojis: ['🦆', '💧', '🪶', '🌿'],
    colors: ['#059669', '#F59E0B', '#38BDF8', '#FEF08A'],
    spread: 70,
    scalar: 1.3,
  },
  chicken: {
    emojis: ['🐔', '🌾', '🐣', '⭐'],
    colors: ['#EF4444', '#F59E0B', '#FBBF24', '#FEF08A'],
    spread: 70,
    scalar: 1.25,
    specialEffect: 'bounce',
  },
  rooster: {
    emojis: ['🐓', '☀️', '🌾', '⭐'],
    colors: ['#DC2626', '#F59E0B', '#10B981', '#FBBF24'],
    spread: 75,
    scalar: 1.3,
  },
  dog: {
    emojis: ['🐶', '🦴', '🐾', '❤️'],
    colors: ['#D97706', '#F59E0B', '#EF4444', '#FDE68A'],
    spread: 75,
    scalar: 1.3,
    specialEffect: 'bounce',
  },
  cat: {
    emojis: ['🐱', '🧶', '🐾', '✨'],
    colors: ['#F97316', '#FB7185', '#818CF8', '#FED7AA'],
    spread: 70,
    scalar: 1.3,
  },
  frog: {
    emojis: ['🐸', '🪷', '💧', '🍃'],
    colors: ['#10B981', '#059669', '#34D399', '#38BDF8', '#86EFAC'],
    spread: 75,
    gravity: 1.35,
    startVelocity: 40,
    scalar: 1.35,
    specialEffect: 'bounce',
  },

  // === Bugs & Insects ===
  butterfly: {
    emojis: ['🦋', '🌸', '🌺', '✨'],
    colors: ['#EC4899', '#8B5CF6', '#3B82F6', '#F59E0B', '#10B981'],
    spread: 85,
    gravity: 0.45,
    ticks: 110,
    scalar: 1.35,
    specialEffect: 'flutter',
  },
  bee: {
    emojis: ['🐝', '🍯', '🌻', '✨'],
    colors: ['#F59E0B', '#FBBF24', '#18181B', '#FEF08A'],
    spread: 75,
    gravity: 0.7,
    scalar: 1.3,
    specialEffect: 'flutter',
  },
  ladybug: {
    emojis: ['🐞', '🍀', '🌸', '✨'],
    colors: ['#DC2626', '#EF4444', '#18181B', '#10B981'],
    spread: 70,
    scalar: 1.3,
  },
  dragonfly: {
    emojis: ['🪲', '💧', '✨', '🪷'],
    colors: ['#0284C7', '#10B981', '#8B5CF6', '#38BDF8'],
    spread: 75,
    gravity: 0.5,
    scalar: 1.3,
    specialEffect: 'flutter',
  },
  firefly: {
    emojis: ['✨', '🌟', '🌙', '💛'],
    colors: ['#FACC15', '#FEF08A', '#84CC16', '#F59E0B'],
    spread: 70,
    gravity: 0.4,
    ticks: 120,
    scalar: 1.35,
    specialEffect: 'flutter',
  },
};

// Category fallback configurations
const CATEGORY_FALLBACKS: Record<string, EffectConfig> = {
  farm: {
    emojis: ['🌾', '🍀', '⭐', '🐾'],
    colors: ['#10B981', '#F59E0B', '#FBBF24', '#059669'],
    spread: 70,
    scalar: 1.25,
  },
  wild: {
    emojis: ['🐾', '🌴', '🌿', '⭐'],
    colors: ['#F59E0B', '#D97706', '#10B981', '#B45309'],
    spread: 75,
    scalar: 1.25,
  },
  sea: {
    emojis: ['🫧', '🌊', '💧', '🐠'],
    colors: ['#0284C7', '#38BDF8', '#0EA5E9', '#7DD3FC'],
    spread: 75,
    gravity: 0.8,
    scalar: 1.25,
    specialEffect: 'fountain',
  },
  birds: {
    emojis: ['🪶', '✨', '🌸', '⭐'],
    colors: ['#F43F5E', '#3B82F6', '#10B981', '#F59E0B'],
    spread: 80,
    gravity: 0.65,
    scalar: 1.25,
    specialEffect: 'flutter',
  },
  bugs: {
    emojis: ['🌸', '🌺', '✨', '🍃'],
    colors: ['#EC4899', '#8B5CF6', '#10B981', '#F59E0B'],
    spread: 75,
    gravity: 0.5,
    scalar: 1.25,
    specialEffect: 'flutter',
  },
};

/**
 * Triggers a completely unique, personalized visual animation effect for each animal
 */
export function playAnimalCelebration(
  animal: { id: string; category?: string; name?: string; emoji?: string },
  originCoord?: { x: number; y: number }
) {
  if (typeof window === 'undefined') return;

  const origin = originCoord || { x: 0.5, y: 0.55 };

  // Find exact animal config or category fallback
  const config: EffectConfig =
    ANIMAL_EFFECT_MAP[animal.id] ||
    (animal.category ? CATEGORY_FALLBACKS[animal.category] : null) || {
      emojis: [animal.emoji || '⭐', '✨', '🐾'],
      colors: ['#F59E0B', '#10B981', '#3B82F6', '#EC4899'],
      spread: 70,
      scalar: 1.2,
    };

  // Extract shapes from emojis safely using canvas-confetti shapeFromText
  let shapes: any[] = ['circle', 'square'];
  if (config.emojis && config.emojis.length > 0 && typeof confetti.shapeFromText === 'function') {
    try {
      shapes = config.emojis.map((em) => confetti.shapeFromText({ text: em, scalar: config.scalar || 1.3 }));
    } catch {
      shapes = ['circle', 'square'];
    }
  }

  // Handle special physics behaviors
  if (config.specialEffect === 'fountain') {
    // Upward eruption (ocean geyser / tall giraffe acacia reach / elephant trunk spray)
    confetti({
      particleCount: config.particleCount || 28,
      angle: 90,
      spread: config.spread || 50,
      origin,
      colors: config.colors,
      shapes,
      scalar: config.scalar || 1.3,
      gravity: config.gravity || 0.85,
      startVelocity: config.startVelocity || 42,
      ticks: config.ticks || 80,
    });
  } else if (config.specialEffect === 'snow') {
    // Gentle polar snowfall & icy shimmer
    confetti({
      particleCount: config.particleCount || 26,
      angle: 90,
      spread: config.spread || 120,
      origin: { x: origin.x, y: Math.max(0.1, origin.y - 0.2) },
      colors: config.colors,
      shapes,
      scalar: config.scalar || 1.25,
      gravity: 0.55,
      drift: 0.2,
      startVelocity: 18,
      ticks: 100,
    });
  } else if (config.specialEffect === 'bounce') {
    // Double springy hops (kangaroo, rabbit, frog, chimps)
    confetti({
      particleCount: 18,
      angle: 75,
      spread: 55,
      origin: { x: Math.max(0.2, origin.x - 0.08), y: origin.y },
      colors: config.colors,
      shapes,
      scalar: config.scalar || 1.3,
      gravity: config.gravity || 1.3,
      startVelocity: config.startVelocity || 36,
    });
    setTimeout(() => {
      confetti({
        particleCount: 18,
        angle: 105,
        spread: 55,
        origin: { x: Math.min(0.8, origin.x + 0.08), y: origin.y },
        colors: config.colors,
        shapes,
        scalar: config.scalar || 1.3,
        gravity: config.gravity || 1.3,
        startVelocity: config.startVelocity || 36,
      });
    }, 120);
  } else if (config.specialEffect === 'flutter') {
    // Gentle drifting flutter (butterflies, feathers, peacock, sloth, panda bamboo)
    confetti({
      particleCount: config.particleCount || 24,
      spread: config.spread || 80,
      origin,
      colors: config.colors,
      shapes,
      scalar: config.scalar || 1.3,
      gravity: config.gravity || 0.5,
      drift: 0.15,
      startVelocity: config.startVelocity || 22,
      ticks: config.ticks || 100,
    });
  } else if (config.specialEffect === 'burst') {
    // High-energy predator or speed streak burst
    confetti({
      particleCount: config.particleCount || 32,
      spread: config.spread || 90,
      origin,
      colors: config.colors,
      shapes,
      scalar: config.scalar || 1.3,
      gravity: 1.1,
      startVelocity: config.startVelocity || 38,
      ticks: 60,
    });
  } else {
    // Standard themed animal celebration
    confetti({
      particleCount: config.particleCount || 26,
      spread: config.spread || 70,
      origin,
      colors: config.colors,
      shapes,
      scalar: config.scalar || 1.25,
      gravity: config.gravity || 1.0,
      startVelocity: config.startVelocity || 30,
      ticks: config.ticks || 70,
    });
  }
}
