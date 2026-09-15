import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const outDir = path.join(process.cwd(), 'public', 'assets', 'sounds');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

function generateWavBuffer(options) {
  const sampleRate = 44100;
  const duration = options.duration || 1.8;
  const numSamples = Math.floor(sampleRate * duration);
  const dataSize = numSamples * 2;
  const buffer = Buffer.alloc(44 + dataSize);

  // WAV Header
  buffer.write("RIFF", 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write("WAVE", 8);
  buffer.write("fmt ", 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);  // PCM
  buffer.writeUInt16LE(1, 22);  // Mono
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(sampleRate * 2, 28);
  buffer.writeUInt16LE(2, 32);
  buffer.writeUInt16LE(16, 34);
  buffer.write("data", 36);
  buffer.writeUInt32LE(dataSize, 40);

  const baseFreq = options.freq || 300;
  const endFreq = options.endFreq || baseFreq;
  const vibratoFreq = options.vibratoFreq || 0;
  const vibratoDepth = options.vibratoDepth || 0;
  const pulsePeriod = options.pulsePeriod || 0; // in seconds
  const pulseWidth = options.pulseWidth || 0.7; // fraction of period
  const noiseLevel = options.noiseLevel || 0;
  const harmonics = options.harmonics || [1, 0.3, 0.1];
  const vol = options.volume || 1.0;

  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    const progress = t / duration;

    // Envelope
    let env = 1.0;
    const attack = options.attack || 0.1;
    const release = options.release || 0.3;
    if (t < attack) {
      env = t / attack;
    } else if (t > duration - release) {
      env = Math.max(0, (duration - t) / release);
    }

    // Pulse gating
    let pulseGate = 1.0;
    if (pulsePeriod > 0) {
      const pulsePhase = (t % pulsePeriod) / pulsePeriod;
      pulseGate = pulsePhase <= pulseWidth ? 1.0 : 0.05;
    }

    // Frequency sweep
    const currentBaseFreq = baseFreq + (endFreq - baseFreq) * Math.sin(progress * Math.PI);

    // Vibrato
    const vibrato = vibratoFreq > 0 ? Math.sin(2 * Math.PI * vibratoFreq * t) * vibratoDepth : 0;
    const finalFreq = Math.max(20, currentBaseFreq + vibrato);

    // Signal generation (Harmonics + Noise)
    let sig = 0;
    harmonics.forEach((amp, hIdx) => {
      const hFreq = finalFreq * (hIdx + 1);
      sig += Math.sin(2 * Math.PI * hFreq * t) * amp;
    });

    if (noiseLevel > 0) {
      const whiteNoise = (Math.random() * 2 - 1) * noiseLevel;
      sig += whiteNoise;
    }

    const finalSample = sig * env * pulseGate * vol * 0.4;
    const intVal = Math.max(-32768, Math.min(32767, Math.floor(finalSample * 32767)));
    buffer.writeInt16LE(intVal, 44 + i * 2);
  }

  return buffer;
}

// 127 Animal Acoustic Specs
const animalProfiles = {
  // Farm & Equines
  horse: { freq: 450, endFreq: 750, vibratoFreq: 12, vibratoDepth: 60, duration: 2.2, attack: 0.1, release: 0.4, harmonics: [1, 0.4, 0.2] },
  donkey: { freq: 280, endFreq: 480, vibratoFreq: 4, vibratoDepth: 80, pulsePeriod: 0.6, pulseWidth: 0.8, duration: 2.4, harmonics: [1, 0.5, 0.3] },
  zebra: { freq: 380, endFreq: 600, vibratoFreq: 9, vibratoDepth: 50, duration: 2.0, harmonics: [1, 0.4] },
  cow: { freq: 130, endFreq: 150, vibratoFreq: 1.5, vibratoDepth: 10, duration: 2.4, attack: 0.2, release: 0.5, harmonics: [1, 0.6, 0.3, 0.15], volume: 1.2 },
  bull: { freq: 100, endFreq: 120, vibratoFreq: 1, vibratoDepth: 8, duration: 2.5, attack: 0.2, release: 0.5, harmonics: [1, 0.7, 0.4] },
  ox: { freq: 110, endFreq: 130, vibratoFreq: 1.2, vibratoDepth: 8, duration: 2.4, attack: 0.2, release: 0.5, harmonics: [1, 0.6, 0.3] },
  buffalo: { freq: 95, endFreq: 115, vibratoFreq: 1, vibratoDepth: 8, duration: 2.5, attack: 0.2, release: 0.5, harmonics: [1, 0.7, 0.4] },
  bison: { freq: 90, endFreq: 110, vibratoFreq: 1, vibratoDepth: 8, duration: 2.5, attack: 0.2, release: 0.5, harmonics: [1, 0.7, 0.4] },
  camel: { freq: 140, endFreq: 180, vibratoFreq: 3, vibratoDepth: 20, duration: 2.3, harmonics: [1, 0.5, 0.2] },
  llama: { freq: 320, endFreq: 360, vibratoFreq: 5, vibratoDepth: 15, duration: 1.5, harmonics: [1, 0.3] },
  alpaca: { freq: 340, endFreq: 380, vibratoFreq: 5, vibratoDepth: 15, duration: 1.5, harmonics: [1, 0.3] },
  pig: { freq: 150, endFreq: 220, vibratoFreq: 15, vibratoDepth: 40, noiseLevel: 0.2, duration: 1.6, harmonics: [1, 0.4] },
  boar: { freq: 110, endFreq: 160, vibratoFreq: 12, vibratoDepth: 35, noiseLevel: 0.3, duration: 1.8, harmonics: [1, 0.5] },
  sheep: { freq: 280, endFreq: 340, vibratoFreq: 14, vibratoDepth: 45, duration: 1.8, attack: 0.1, release: 0.3, harmonics: [1, 0.5, 0.2] },
  goat: { freq: 310, endFreq: 380, vibratoFreq: 16, vibratoDepth: 55, duration: 1.7, attack: 0.1, release: 0.3, harmonics: [1, 0.5, 0.2] },
  giraffe: { freq: 110, endFreq: 130, vibratoFreq: 2, vibratoDepth: 10, duration: 2.0, harmonics: [1, 0.3] },

  // Canines & Felines
  dog: { freq: 380, endFreq: 520, pulsePeriod: 0.4, pulseWidth: 0.4, duration: 1.4, attack: 0.05, release: 0.15, harmonics: [1, 0.5, 0.2], volume: 1.1 },
  fox: { freq: 650, endFreq: 850, vibratoFreq: 10, vibratoDepth: 60, duration: 1.5, harmonics: [1, 0.3] },
  wolf: { freq: 350, endFreq: 600, vibratoFreq: 0.5, vibratoDepth: 20, duration: 2.8, attack: 0.3, release: 0.6, harmonics: [1, 0.4, 0.2] },
  hyena: { freq: 550, endFreq: 800, vibratoFreq: 12, vibratoDepth: 80, pulsePeriod: 0.3, pulseWidth: 0.6, duration: 1.8, harmonics: [1, 0.4] },
  cat: { freq: 450, endFreq: 650, vibratoFreq: 4, vibratoDepth: 25, duration: 1.6, attack: 0.1, release: 0.3, harmonics: [1, 0.4, 0.15] },
  lion: { freq: 85, endFreq: 140, vibratoFreq: 3, vibratoDepth: 15, noiseLevel: 0.15, duration: 2.8, attack: 0.2, release: 0.6, harmonics: [1, 0.7, 0.4, 0.2], volume: 1.3 },
  tiger: { freq: 95, endFreq: 150, vibratoFreq: 3.5, vibratoDepth: 18, noiseLevel: 0.15, duration: 2.7, attack: 0.2, release: 0.5, harmonics: [1, 0.6, 0.3] },
  leopard: { freq: 110, endFreq: 170, vibratoFreq: 4, vibratoDepth: 20, noiseLevel: 0.1, duration: 2.4, harmonics: [1, 0.5, 0.25] },
  cheetah: { freq: 680, endFreq: 820, vibratoFreq: 8, vibratoDepth: 40, duration: 1.5, harmonics: [1, 0.3] },

  // Birds
  duck: { freq: 580, endFreq: 420, pulsePeriod: 0.35, pulseWidth: 0.5, duration: 1.4, attack: 0.05, release: 0.15, harmonics: [1, 0.6, 0.3] },
  goose: { freq: 420, endFreq: 520, vibratoFreq: 6, vibratoDepth: 40, duration: 1.6, harmonics: [1, 0.5, 0.2] },
  rooster: { freq: 450, endFreq: 750, duration: 2.4, attack: 0.1, release: 0.5, harmonics: [1, 0.6, 0.35] },
  chicken: { freq: 620, endFreq: 500, pulsePeriod: 0.25, pulseWidth: 0.5, duration: 1.5, harmonics: [1, 0.4] },
  owl: { freq: 320, endFreq: 260, duration: 2.2, attack: 0.3, release: 0.5, harmonics: [1, 0.2] },
  eagle: { freq: 1800, endFreq: 1200, duration: 1.8, attack: 0.05, release: 0.3, harmonics: [1, 0.3] },
  hawk: { freq: 1900, endFreq: 1300, duration: 1.7, attack: 0.05, release: 0.3, harmonics: [1, 0.3] },
  falcon: { freq: 2000, endFreq: 1400, duration: 1.6, attack: 0.05, release: 0.3, harmonics: [1, 0.3] },
  vulture: { freq: 1200, endFreq: 800, duration: 1.8, harmonics: [1, 0.3] },
  crow: { freq: 420, endFreq: 350, pulsePeriod: 0.4, pulseWidth: 0.6, duration: 1.8, harmonics: [1, 0.5] },
  raven: { freq: 380, endFreq: 310, pulsePeriod: 0.4, pulseWidth: 0.6, duration: 1.8, harmonics: [1, 0.5] },
  canary: { freq: 2200, endFreq: 3000, vibratoFreq: 15, vibratoDepth: 300, duration: 1.8, harmonics: [1, 0.2] },
  parrot: { freq: 1400, endFreq: 1800, vibratoFreq: 10, vibratoDepth: 200, duration: 1.6, harmonics: [1, 0.3] },
  macaw: { freq: 1300, endFreq: 1700, vibratoFreq: 10, vibratoDepth: 200, duration: 1.6, harmonics: [1, 0.3] },
  toucan: { freq: 950, endFreq: 1300, vibratoFreq: 9, vibratoDepth: 150, duration: 1.5, harmonics: [1, 0.3] },
  peacock: { freq: 800, endFreq: 1200, vibratoFreq: 4, vibratoDepth: 100, duration: 2.0, harmonics: [1, 0.4] },
  flamingo: { freq: 500, endFreq: 650, vibratoFreq: 6, vibratoDepth: 50, duration: 1.6, harmonics: [1, 0.3] },
  swan: { freq: 480, endFreq: 600, vibratoFreq: 5, vibratoDepth: 40, duration: 1.8, harmonics: [1, 0.3] },
  stork: { freq: 800, pulsePeriod: 0.08, pulseWidth: 0.3, duration: 1.5, harmonics: [1, 0.2] },
  pelican: { freq: 380, endFreq: 480, duration: 1.7, harmonics: [1, 0.3] },
  puffin: { freq: 420, endFreq: 510, duration: 1.5, harmonics: [1, 0.3] },
  penguin: { freq: 460, endFreq: 600, vibratoFreq: 7, vibratoDepth: 60, duration: 1.7, harmonics: [1, 0.4] },
  woodpecker: { freq: 1200, pulsePeriod: 0.07, pulseWidth: 0.3, duration: 1.4, harmonics: [1, 0.2] },
  hummingbird: { freq: 2600, endFreq: 2800, vibratoFreq: 25, vibratoDepth: 100, duration: 1.5, harmonics: [1, 0.1] },
  pigeon: { freq: 280, endFreq: 250, vibratoFreq: 3, vibratoDepth: 15, duration: 1.8, harmonics: [1, 0.2] },
  dove: { freq: 300, endFreq: 270, vibratoFreq: 3, vibratoDepth: 15, duration: 1.8, harmonics: [1, 0.2] },
  seagull: { freq: 1100, endFreq: 800, duration: 1.6, harmonics: [1, 0.3] },
  turkey: { freq: 350, endFreq: 550, vibratoFreq: 20, vibratoDepth: 100, duration: 1.7, harmonics: [1, 0.4] },
  emu: { freq: 80, endFreq: 90, duration: 2.0, harmonics: [1, 0.5] },
  ostrich: { freq: 90, endFreq: 105, duration: 2.0, harmonics: [1, 0.5] },

  // Primates & Wild Mammals
  monkey: { freq: 750, endFreq: 1100, vibratoFreq: 8, vibratoDepth: 150, duration: 2.2, harmonics: [1, 0.3] },
  chimpanzee: { freq: 650, endFreq: 1050, vibratoFreq: 6, vibratoDepth: 200, duration: 2.4, harmonics: [1, 0.4] },
  gorilla: { freq: 110, endFreq: 140, vibratoFreq: 4, vibratoDepth: 20, duration: 2.3, harmonics: [1, 0.6] },
  orangutan: { freq: 140, endFreq: 180, vibratoFreq: 3, vibratoDepth: 30, duration: 2.3, harmonics: [1, 0.5] },
  baboon: { freq: 500, endFreq: 750, vibratoFreq: 7, vibratoDepth: 100, duration: 2.0, harmonics: [1, 0.4] },
  lemur: { freq: 850, endFreq: 1100, vibratoFreq: 9, vibratoDepth: 120, duration: 1.8, harmonics: [1, 0.3] },
  bear: { freq: 90, endFreq: 110, vibratoFreq: 2, vibratoDepth: 10, noiseLevel: 0.1, duration: 2.2, harmonics: [1, 0.6] },
  polar_bear: { freq: 85, endFreq: 105, vibratoFreq: 2, vibratoDepth: 10, noiseLevel: 0.1, duration: 2.2, harmonics: [1, 0.6] },
  elephant: { freq: 380, endFreq: 630, vibratoFreq: 2, vibratoDepth: 80, duration: 2.2, attack: 0.1, release: 0.4, harmonics: [1, 0.5, 0.3], volume: 1.3 },
  rhino: { freq: 100, endFreq: 130, vibratoFreq: 5, vibratoDepth: 20, duration: 2.0, harmonics: [1, 0.5] },
  hippo: { freq: 85, endFreq: 110, vibratoFreq: 3, vibratoDepth: 15, duration: 2.2, harmonics: [1, 0.6] },
  kangaroo: { freq: 220, endFreq: 260, duration: 1.5, harmonics: [1, 0.3] },
  koala: { freq: 130, endFreq: 160, duration: 1.8, harmonics: [1, 0.4] },
  sloth: { freq: 400, endFreq: 450, duration: 1.8, harmonics: [1, 0.2] },
  panda: { freq: 350, endFreq: 410, duration: 1.6, harmonics: [1, 0.3] },
  meerkat: { freq: 1200, endFreq: 1500, vibratoFreq: 10, vibratoDepth: 100, duration: 1.4, harmonics: [1, 0.2] },
  mongoose: { freq: 1100, endFreq: 1400, vibratoFreq: 10, vibratoDepth: 100, duration: 1.4, harmonics: [1, 0.2] },

  // Small Mammals
  mouse: { freq: 3200, endFreq: 3600, vibratoFreq: 12, vibratoDepth: 200, duration: 1.4, harmonics: [1, 0.1] },
  rat: { freq: 2800, endFreq: 3200, vibratoFreq: 12, vibratoDepth: 200, duration: 1.4, harmonics: [1, 0.1] },
  squirrel: { freq: 2400, endFreq: 2900, vibratoFreq: 10, vibratoDepth: 250, duration: 1.4, harmonics: [1, 0.2] },
  chipmunk: { freq: 2600, endFreq: 3100, vibratoFreq: 10, vibratoDepth: 250, duration: 1.4, harmonics: [1, 0.2] },
  rabbit: { freq: 1500, endFreq: 1700, duration: 1.2, harmonics: [1, 0.2] },
  hamster: { freq: 3000, endFreq: 3400, duration: 1.3, harmonics: [1, 0.1] },
  guinea_pig: { freq: 2200, endFreq: 2800, vibratoFreq: 8, vibratoDepth: 200, duration: 1.5, harmonics: [1, 0.2] },
  chinchilla: { freq: 2400, endFreq: 2800, duration: 1.4, harmonics: [1, 0.2] },
  ferret: { freq: 1600, endFreq: 1900, duration: 1.4, harmonics: [1, 0.2] },
  hedgehog: { freq: 1800, endFreq: 2000, duration: 1.4, harmonics: [1, 0.2] },
  badger: { freq: 180, endFreq: 220, duration: 1.6, harmonics: [1, 0.4] },
  beaver: { freq: 220, endFreq: 270, duration: 1.6, harmonics: [1, 0.3] },
  raccoon: { freq: 900, endFreq: 1200, vibratoFreq: 8, vibratoDepth: 100, duration: 1.5, harmonics: [1, 0.3] },
  skunk: { freq: 700, endFreq: 900, duration: 1.5, harmonics: [1, 0.3] },
  armadillo: { freq: 400, endFreq: 480, duration: 1.4, harmonics: [1, 0.2] },
  bat: { freq: 4200, endFreq: 5000, vibratoFreq: 15, vibratoDepth: 400, duration: 1.4, harmonics: [1, 0.1] },

  // Marine & Amphibians
  dolphin: { freq: 4500, endFreq: 7000, vibratoFreq: 4, vibratoDepth: 1200, duration: 2.0, harmonics: [1, 0.2], volume: 1.2 },
  whale: { freq: 180, endFreq: 240, vibratoFreq: 0.5, vibratoDepth: 30, duration: 3.0, attack: 0.4, release: 0.6, harmonics: [1, 0.5, 0.2] },
  orca: { freq: 800, endFreq: 1200, vibratoFreq: 1.5, vibratoDepth: 200, duration: 2.5, harmonics: [1, 0.4] },
  beluga: { freq: 1200, endFreq: 1800, vibratoFreq: 2, vibratoDepth: 300, duration: 2.2, harmonics: [1, 0.3] },
  seal: { freq: 280, endFreq: 350, vibratoFreq: 5, vibratoDepth: 40, duration: 1.8, harmonics: [1, 0.4] },
  walrus: { freq: 140, endFreq: 180, duration: 2.2, harmonics: [1, 0.5] },
  otter: { freq: 1800, endFreq: 2200, duration: 1.5, harmonics: [1, 0.2] },
  manatee: { freq: 350, endFreq: 400, duration: 2.0, harmonics: [1, 0.3] },
  clownfish: { freq: 600, endFreq: 700, duration: 1.2, harmonics: [1, 0.2] },
  shark: { freq: 80, endFreq: 95, duration: 2.2, harmonics: [1, 0.5] },
  octopus: { freq: 450, endFreq: 530, duration: 1.5, harmonics: [1, 0.3] },
  jellyfish: { freq: 700, endFreq: 750, duration: 1.6, harmonics: [1, 0.2] },
  crab: { freq: 1400, pulsePeriod: 0.06, pulseWidth: 0.3, duration: 1.2, harmonics: [1, 0.1] },
  lobster: { freq: 1200, pulsePeriod: 0.06, pulseWidth: 0.3, duration: 1.2, harmonics: [1, 0.1] },
  shrimp: { freq: 2200, pulsePeriod: 0.05, pulseWidth: 0.3, duration: 1.0, harmonics: [1, 0.1] },
  squid: { freq: 520, endFreq: 590, duration: 1.4, harmonics: [1, 0.3] },
  stingray: { freq: 120, endFreq: 140, duration: 2.0, harmonics: [1, 0.4] },
  seahorse: { freq: 1600, endFreq: 1800, duration: 1.2, harmonics: [1, 0.2] },
  starfish: { freq: 380, endFreq: 420, duration: 1.5, harmonics: [1, 0.2] },
  coral: { freq: 420, endFreq: 450, duration: 1.5, harmonics: [1, 0.2] },
  blowfish: { freq: 250, endFreq: 310, duration: 1.5, harmonics: [1, 0.3] },
  turtle: { freq: 160, endFreq: 185, duration: 1.8, harmonics: [1, 0.4] },

  // Reptiles, Insects & Others
  frog: { freq: 250, endFreq: 300, pulsePeriod: 0.3, pulseWidth: 0.5, duration: 1.4, harmonics: [1, 0.5, 0.2] },
  snake: { freq: 3200, noiseLevel: 0.3, duration: 1.8, harmonics: [0.2] },
  crocodile: { freq: 80, endFreq: 100, noiseLevel: 0.1, duration: 2.2, harmonics: [1, 0.5] },
  alligator: { freq: 75, endFreq: 95, noiseLevel: 0.1, duration: 2.2, harmonics: [1, 0.5] },
  lizard: { freq: 2200, noiseLevel: 0.2, duration: 1.2, harmonics: [0.3] },
  iguana: { freq: 2000, noiseLevel: 0.2, duration: 1.2, harmonics: [0.3] },
  chameleon: { freq: 2400, noiseLevel: 0.2, duration: 1.2, harmonics: [0.3] },
  bee: { freq: 220, vibratoFreq: 1, vibratoDepth: 5, duration: 2.0, harmonics: [1, 0.5, 0.25] },
  fly: { freq: 180, vibratoFreq: 1, vibratoDepth: 5, duration: 1.8, harmonics: [1, 0.5, 0.25] },
  beetle: { freq: 160, vibratoFreq: 1, vibratoDepth: 5, duration: 1.6, harmonics: [1, 0.4] },
  cricket: { freq: 4200, pulsePeriod: 0.1, pulseWidth: 0.3, duration: 2.0, harmonics: [1, 0.2] },
  butterfly: { freq: 1200, endFreq: 1300, duration: 1.5, harmonics: [1, 0.1] },
  caterpillar: { freq: 800, endFreq: 850, duration: 1.4, harmonics: [1, 0.1] },
  ladybug: { freq: 1500, duration: 1.2, harmonics: [1, 0.1] },
  scorpion: { freq: 2800, duration: 1.2, harmonics: [1, 0.1] },
  spider: { freq: 2600, duration: 1.2, harmonics: [1, 0.1] },
  snail: { freq: 350, duration: 1.4, harmonics: [1, 0.1] },
  worm: { freq: 300, duration: 1.4, harmonics: [1, 0.1] },
  wolverine: { freq: 120, endFreq: 150, duration: 2.0, harmonics: [1, 0.4] },
  kiwi: { freq: 1400, endFreq: 1700, duration: 1.5, harmonics: [1, 0.3] }
};

const total = Object.keys(animalProfiles).length;
console.log(`Generating bio-acoustic audio for ${total} animals...`);

let count = 0;
for (const [animal, opts] of Object.entries(animalProfiles)) {
  const mp3Path = path.join(outDir, `${animal}.mp3`);
  const oggPath = path.join(outDir, `${animal}.ogg`);
  const wavPath = path.join(outDir, `${animal}.wav`);

  try {
    const wavBuffer = generateWavBuffer(opts);
    fs.writeFileSync(wavPath, wavBuffer);

    // Convert to MP3
    execSync(`ffmpeg -y -i "${wavPath}" -c:a libmp3lame -q:a 4 "${mp3Path}" 2>/dev/null`);

    // Convert to OGG
    execSync(`ffmpeg -y -i "${wavPath}" -c:a libvorbis -q:a 4 "${oggPath}" 2>/dev/null`);

    fs.unlinkSync(wavPath);
    count++;
  } catch (err) {
    console.error(`Failed ${animal}:`, err.message);
  }
}

console.log(`Success! Generated both MP3 and OGG audio files for ${count} animals!`);
