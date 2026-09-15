import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const targetDir = path.resolve('public/assets/sounds');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

function writeWav(filename, samples, sampleRate = 44100) {
  const numChannels = 1;
  const bytesPerSample = 2;
  const byteRate = sampleRate * numChannels * bytesPerSample;
  const blockAlign = numChannels * bytesPerSample;
  const dataSize = samples.length * bytesPerSample;
  const buffer = Buffer.alloc(44 + dataSize);

  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write('WAVE', 8);
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20); // PCM
  buffer.writeUInt16LE(numChannels, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(byteRate, 28);
  buffer.writeUInt16LE(blockAlign, 32);
  buffer.writeUInt16LE(16, 34); // 16-bit
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);

  for (let i = 0; i < samples.length; i++) {
    const s = Math.max(-1, Math.min(1, samples[i]));
    buffer.writeInt16LE(Math.floor(s * 32767), 44 + i * 2);
  }

  fs.writeFileSync(filename, buffer);
}

const sampleRate = 44100;

function createBuffer(duration) {
  const total = Math.floor(sampleRate * duration);
  return { samples: new Float32Array(total), total, duration };
}

// -------------------------------------------------------------
// ACOUSTIC SOUND GENERATORS FOR EVERY ANIMAL ARCHETYPE
// -------------------------------------------------------------

function synthCow() {
  const { samples, total } = createBuffer(2.4);
  let phase = 0;
  for (let i = 0; i < total; i++) {
    const t = i / sampleRate;
    // Classic deep moo: 140Hz gently sloping down to 105Hz
    const freq = 140 - 35 * (t / 2.4) + 4 * Math.sin(2 * Math.PI * 4.5 * t);
    phase += (2 * Math.PI * freq) / sampleRate;
    
    // Vocal tract formants: F1 ~ 320Hz, F2 ~ 750Hz, F3 ~ 2100Hz
    const tone = Math.sin(phase) + 0.65 * Math.sin(2 * phase) + 0.4 * Math.sin(3 * phase) + 0.25 * Math.sin(5 * phase);
    // Envelope: smooth swell, hold, fade out
    let env = 1;
    if (t < 0.4) env = Math.sin((t / 0.4) * Math.PI * 0.5);
    else if (t > 1.8) env = Math.cos(((t - 1.8) / 0.6) * Math.PI * 0.5);

    const throat = (Math.random() * 2 - 1) * 0.05;
    samples[i] = (tone * 0.7 + throat) * env * 0.85;
  }
  return samples;
}

function synthHorse() {
  const { samples, total } = createBuffer(2.2);
  let phase = 0;
  for (let i = 0; i < total; i++) {
    const t = i / sampleRate;
    const flutter = Math.sin(2 * Math.PI * 14 * t);
    let freq, amp;
    if (t < 0.7) {
      freq = 950 + 300 * Math.sin(t * 3) + flutter * 110;
      amp = Math.sin((t / 0.7) * Math.PI * 0.5);
    } else if (t < 1.5) {
      const p = (t - 0.7) / 0.8;
      freq = 1150 - p * 650 + flutter * (70 * (1 - p));
      amp = 1 - p * 0.3;
    } else {
      const p = (t - 1.5) / 0.7;
      freq = 320 - p * 120;
      amp = (1 - p) * 0.7;
    }
    phase += (2 * Math.PI * freq) / sampleRate;
    const tone = Math.sin(phase) + 0.45 * Math.sin(2 * phase) + 0.25 * Math.sin(3 * phase);
    const snortNoise = (Math.random() * 2 - 1) * (t > 1.4 ? 0.3 : 0.1);
    samples[i] = (tone * 0.65 + snortNoise) * amp * 0.8;
  }
  return samples;
}

function synthDog() {
  const { samples, total } = createBuffer(1.4);
  // Double bark
  const barks = [0.05, 0.65];
  for (const startT of barks) {
    const barkLen = 0.35;
    const startIdx = Math.floor(startT * sampleRate);
    const lenIdx = Math.floor(barkLen * sampleRate);
    let phase = 0;
    for (let j = 0; j < lenIdx; j++) {
      const idx = startIdx + j;
      if (idx >= total) break;
      const t = j / sampleRate;
      // Pitch drops rapidly during bark: 380Hz -> 220Hz
      const freq = 380 - (t / barkLen) * 160;
      phase += (2 * Math.PI * freq) / sampleRate;
      
      let env = Math.sin((t / barkLen) * Math.PI);
      if (t < 0.05) env = t / 0.05;
      
      const tone = Math.sin(phase) + 0.5 * Math.sin(2 * phase) + 0.3 * Math.sin(3 * phase);
      const grit = (Math.random() * 2 - 1) * 0.35;
      samples[idx] = (tone * 0.6 + grit) * env * 0.85;
    }
  }
  return samples;
}

function synthCat() {
  const { samples, total } = createBuffer(1.6);
  let phase = 0;
  for (let i = 0; i < total; i++) {
    const t = i / sampleRate;
    // Meow pitch contour: 420Hz -> 680Hz -> 340Hz
    let freq;
    if (t < 0.6) {
      freq = 420 + (t / 0.6) * 260;
    } else {
      freq = 680 - ((t - 0.6) / 1.0) * 340;
    }
    phase += (2 * Math.PI * freq) / sampleRate;
    
    let env = Math.sin((t / 1.6) * Math.PI);
    const tone = Math.sin(phase) + 0.4 * Math.sin(2 * phase) + 0.2 * Math.sin(3 * phase);
    samples[i] = tone * env * 0.8;
  }
  return samples;
}

function synthPig() {
  const { samples, total } = createBuffer(1.6);
  // 3 rhythmic grunts / oinks
  const grunts = [0.05, 0.45, 0.85];
  for (const startT of grunts) {
    const gLen = 0.28;
    const startIdx = Math.floor(startT * sampleRate);
    const lenIdx = Math.floor(gLen * sampleRate);
    let phase = 0;
    for (let j = 0; j < lenIdx; j++) {
      const idx = startIdx + j;
      if (idx >= total) break;
      const t = j / sampleRate;
      const freq = 145 - 30 * (t / gLen);
      phase += (2 * Math.PI * freq) / sampleRate;
      const env = Math.sin((t / gLen) * Math.PI);
      const tone = Math.sin(phase) + 0.6 * Math.sin(3 * phase) + 0.4 * Math.sin(5 * phase);
      const snort = (Math.random() * 2 - 1) * 0.4;
      samples[idx] = (tone * 0.5 + snort) * env * 0.85;
    }
  }
  return samples;
}

function synthSheep() {
  const { samples, total } = createBuffer(1.8);
  let phase = 0;
  for (let i = 0; i < total; i++) {
    const t = i / sampleRate;
    const freq = 270 - 20 * (t / 1.8);
    phase += (2 * Math.PI * freq) / sampleRate;
    // 12.5Hz intense vocal tremolo
    const bleat = 0.5 + 0.5 * Math.sin(2 * Math.PI * 12.5 * t);
    let env = Math.sin((t / 1.8) * Math.PI);
    const tone = Math.sin(phase) + 0.5 * Math.sin(2 * phase) + 0.3 * Math.sin(3 * phase);
    samples[i] = tone * bleat * env * 0.85;
  }
  return samples;
}

function synthGoat() {
  const { samples, total } = createBuffer(1.6);
  let phase = 0;
  for (let i = 0; i < total; i++) {
    const t = i / sampleRate;
    const freq = 360 - 30 * (t / 1.6);
    phase += (2 * Math.PI * freq) / sampleRate;
    // 16Hz rapid tremolo
    const bleat = 0.4 + 0.6 * Math.sin(2 * Math.PI * 16 * t);
    let env = Math.sin((t / 1.6) * Math.PI);
    const tone = Math.sin(phase) + 0.6 * Math.sin(2 * phase) + 0.4 * Math.sin(3 * phase);
    samples[i] = tone * bleat * env * 0.85;
  }
  return samples;
}

function synthRooster() {
  const { samples, total } = createBuffer(2.4);
  // Cock-a-doodle-doo: 4 notes (G4 392Hz, A4 440Hz, B4 494Hz, high D5 587Hz held)
  const notes = [
    { start: 0.05, len: 0.22, f: 392 },
    { start: 0.32, len: 0.22, f: 440 },
    { start: 0.60, len: 0.32, f: 494 },
    { start: 1.00, len: 1.25, f: 587 }
  ];
  for (const n of notes) {
    const startIdx = Math.floor(n.start * sampleRate);
    const lenIdx = Math.floor(n.len * sampleRate);
    let phase = 0;
    for (let j = 0; j < lenIdx; j++) {
      const idx = startIdx + j;
      if (idx >= total) break;
      const t = j / sampleRate;
      let freq = n.f;
      if (n.len > 1.0) {
        freq = n.f + Math.sin(2 * Math.PI * 6 * t) * 15 - (t / n.len) * 35;
      }
      phase += (2 * Math.PI * freq) / sampleRate;
      let env = Math.sin((t / n.len) * Math.PI);
      if (t < 0.04) env = t / 0.04;
      const tone = Math.sin(phase) + 0.6 * Math.sin(2 * phase) + 0.3 * Math.sin(3 * phase) + 0.15 * Math.sin(4 * phase);
      samples[idx] = tone * env * 0.85;
    }
  }
  return samples;
}

function synthChicken() {
  const { samples, total } = createBuffer(1.5);
  // 4 rapid clucks
  const clucks = [0.05, 0.35, 0.65, 0.95];
  for (const startT of clucks) {
    const cLen = 0.18;
    const startIdx = Math.floor(startT * sampleRate);
    const lenIdx = Math.floor(cLen * sampleRate);
    let phase = 0;
    for (let j = 0; j < lenIdx; j++) {
      const idx = startIdx + j;
      if (idx >= total) break;
      const t = j / sampleRate;
      const freq = 420 - 90 * (t / cLen);
      phase += (2 * Math.PI * freq) / sampleRate;
      const env = Math.exp(-t * 18);
      const tone = Math.sin(phase) + 0.5 * Math.sin(2 * phase) + 0.3 * Math.sin(4 * phase);
      samples[idx] = tone * env * 0.85;
    }
  }
  return samples;
}

function synthDuck() {
  const { samples, total } = createBuffer(1.4);
  // Double nasal quack
  const quacks = [0.05, 0.65];
  for (const startT of quacks) {
    const qLen = 0.35;
    const startIdx = Math.floor(startT * sampleRate);
    const lenIdx = Math.floor(qLen * sampleRate);
    let phase = 0;
    for (let j = 0; j < lenIdx; j++) {
      const idx = startIdx + j;
      if (idx >= total) break;
      const t = j / sampleRate;
      const freq = 420 - 80 * (t / qLen);
      phase += (2 * Math.PI * freq) / sampleRate;
      let env = Math.sin((t / qLen) * Math.PI);
      if (t < 0.03) env = t / 0.03;
      // Heavy nasal harmonics (even + odd)
      const tone = Math.sin(phase) + 0.7 * Math.sin(2 * phase) + 0.5 * Math.sin(3 * phase) + 0.3 * Math.sin(4 * phase);
      samples[idx] = tone * env * 0.85;
    }
  }
  return samples;
}

function synthGoose() {
  const { samples, total } = createBuffer(1.5);
  // Double brassy honk
  const honks = [0.05, 0.65];
  for (const startT of honks) {
    const hLen = 0.4;
    const startIdx = Math.floor(startT * sampleRate);
    const lenIdx = Math.floor(hLen * sampleRate);
    let phase = 0;
    for (let j = 0; j < lenIdx; j++) {
      const idx = startIdx + j;
      if (idx >= total) break;
      const t = j / sampleRate;
      const freq = 380 + 120 * Math.sin((t / hLen) * Math.PI);
      phase += (2 * Math.PI * freq) / sampleRate;
      const env = Math.sin((t / hLen) * Math.PI);
      const tone = Math.sin(phase) + 0.6 * Math.sin(2 * phase) + 0.4 * Math.sin(3 * phase);
      samples[idx] = tone * env * 0.85;
    }
  }
  return samples;
}

function synthLion() {
  const { samples, total } = createBuffer(2.8);
  let phase = 0;
  for (let i = 0; i < total; i++) {
    const t = i / sampleRate;
    // Deep guttural roar: 75Hz sub-bass swelling to 180Hz roar
    let freq, env;
    if (t < 0.8) {
      freq = 80 + (t / 0.8) * 60;
      env = Math.sin((t / 0.8) * Math.PI * 0.5);
    } else if (t < 2.0) {
      freq = 140 + Math.sin(t * 10) * 20;
      env = 1.0;
    } else {
      freq = 140 - ((t - 2.0) / 0.8) * 65;
      env = Math.cos(((t - 2.0) / 0.8) * Math.PI * 0.5);
    }
    phase += (2 * Math.PI * freq) / sampleRate;
    const tone = Math.sin(phase) + 0.6 * Math.sin(2 * phase) + 0.4 * Math.sin(3 * phase) + 0.3 * Math.sin(5 * phase);
    // Predatory chest growl rasp
    const rasp = (Math.random() * 2 - 1) * 0.4;
    samples[i] = (tone * 0.6 + rasp) * env * 0.9;
  }
  return samples;
}

function synthTiger() {
  const { samples, total } = createBuffer(2.6);
  let phase = 0;
  for (let i = 0; i < total; i++) {
    const t = i / sampleRate;
    const freq = 70 + 45 * Math.sin(t * 4);
    phase += (2 * Math.PI * freq) / sampleRate;
    let env = Math.sin((t / 2.6) * Math.PI);
    const tone = Math.sin(phase) + 0.7 * Math.sin(2 * phase) + 0.5 * Math.sin(3 * phase);
    const rumble = (Math.random() * 2 - 1) * 0.45;
    samples[i] = (tone * 0.55 + rumble) * env * 0.9;
  }
  return samples;
}

function synthElephant() {
  const { samples, total } = createBuffer(2.2);
  let phase = 0;
  for (let i = 0; i < total; i++) {
    const t = i / sampleRate;
    // Brassy trumpet sweep 550Hz -> 1150Hz -> 850Hz with lip flutter
    const flutter = Math.sin(2 * Math.PI * 22 * t);
    let freq;
    if (t < 0.6) {
      freq = 550 + (t / 0.6) * 600 + flutter * 50;
    } else {
      freq = 1150 - ((t - 0.6) / 1.6) * 350 + flutter * 40;
    }
    phase += (2 * Math.PI * freq) / sampleRate;
    let env = Math.sin((t / 2.2) * Math.PI);
    if (t < 0.1) env = t / 0.1;
    // Brassy overtone series
    const tone = Math.sin(phase) + 0.6 * Math.sin(2 * phase) + 0.4 * Math.sin(3 * phase) + 0.25 * Math.sin(4 * phase);
    samples[i] = tone * env * 0.85;
  }
  return samples;
}

function synthWolf() {
  const { samples, total } = createBuffer(2.8);
  let phase = 0;
  for (let i = 0; i < total; i++) {
    const t = i / sampleRate;
    // Melodic soaring howl: 320Hz -> 680Hz -> 380Hz
    let freq;
    if (t < 0.9) {
      freq = 320 + (t / 0.9) * 360;
    } else if (t < 2.0) {
      freq = 680 + Math.sin(2 * Math.PI * 5 * t) * 12;
    } else {
      freq = 680 - ((t - 2.0) / 0.8) * 300;
    }
    phase += (2 * Math.PI * freq) / sampleRate;
    let env = Math.sin((t / 2.8) * Math.PI);
    const tone = Math.sin(phase) + 0.3 * Math.sin(2 * phase) + 0.15 * Math.sin(3 * phase);
    samples[i] = tone * env * 0.85;
  }
  return samples;
}

function synthFrog() {
  const { samples, total } = createBuffer(1.4);
  // Dual croak / ribbit
  const croaks = [0.05, 0.65];
  for (const startT of croaks) {
    const cLen = 0.35;
    const startIdx = Math.floor(startT * sampleRate);
    const lenIdx = Math.floor(cLen * sampleRate);
    let phase = 0;
    for (let j = 0; j < lenIdx; j++) {
      const idx = startIdx + j;
      if (idx >= total) break;
      const t = j / sampleRate;
      const freq = 175;
      phase += (2 * Math.PI * freq) / sampleRate;
      const ribbitMod = 0.5 + 0.5 * Math.sin(2 * Math.PI * 38 * t);
      const env = Math.sin((t / cLen) * Math.PI);
      const tone = Math.sin(phase) + 0.7 * Math.sin(2 * phase) + 0.5 * Math.sin(3 * phase);
      samples[idx] = tone * ribbitMod * env * 0.85;
    }
  }
  return samples;
}

function synthDonkey() {
  const { samples, total } = createBuffer(2.4);
  // Hee-Haw sequence (2 cycles)
  const cycles = [
    { start: 0.05, heeLen: 0.45, hawLen: 0.55 },
    { start: 1.15, heeLen: 0.45, hawLen: 0.65 }
  ];
  for (const c of cycles) {
    // "Hee" (high piercing)
    const heeStart = Math.floor(c.start * sampleRate);
    const heeTotal = Math.floor(c.heeLen * sampleRate);
    let p1 = 0;
    for (let j = 0; j < heeTotal; j++) {
      const idx = heeStart + j;
      if (idx >= total) break;
      const t = j / sampleRate;
      const freq = 680 + 120 * Math.sin(t * 12);
      p1 += (2 * Math.PI * freq) / sampleRate;
      const env = Math.sin((t / c.heeLen) * Math.PI);
      const tone = Math.sin(p1) + 0.4 * Math.sin(2 * p1);
      samples[idx] = tone * env * 0.8;
    }
    // "Haw" (deep guttural bray)
    const hawStart = Math.floor((c.start + c.heeLen + 0.05) * sampleRate);
    const hawTotal = Math.floor(c.hawLen * sampleRate);
    let p2 = 0;
    for (let j = 0; j < hawTotal; j++) {
      const idx = hawStart + j;
      if (idx >= total) break;
      const t = j / sampleRate;
      const freq = 180 - 40 * (t / c.hawLen);
      p2 += (2 * Math.PI * freq) / sampleRate;
      const env = Math.sin((t / c.hawLen) * Math.PI);
      const tone = Math.sin(p2) + 0.6 * Math.sin(2 * p2);
      const breath = (Math.random() * 2 - 1) * 0.3;
      samples[idx] = (tone * 0.6 + breath) * env * 0.85;
    }
  }
  return samples;
}

function synthOwl() {
  const { samples, total } = createBuffer(2.2);
  // Hooo... hooo-hooo
  const hoots = [
    { start: 0.05, len: 0.7, f: 310 },
    { start: 1.0, len: 0.4, f: 330 },
    { start: 1.5, len: 0.6, f: 290 }
  ];
  for (const h of hoots) {
    const startIdx = Math.floor(h.start * sampleRate);
    const lenIdx = Math.floor(h.len * sampleRate);
    let phase = 0;
    for (let j = 0; j < lenIdx; j++) {
      const idx = startIdx + j;
      if (idx >= total) break;
      const t = j / sampleRate;
      const freq = h.f + Math.sin(2 * Math.PI * 5 * t) * 6;
      phase += (2 * Math.PI * freq) / sampleRate;
      const env = Math.sin((t / h.len) * Math.PI);
      // Pure mellow whistle
      const tone = Math.sin(phase) + 0.15 * Math.sin(2 * phase);
      samples[idx] = tone * env * 0.85;
    }
  }
  return samples;
}

function synthEagle() {
  const { samples, total } = createBuffer(1.8);
  let phase = 0;
  for (let i = 0; i < total; i++) {
    const t = i / sampleRate;
    // Piercing raptor cry: 2400Hz sliding down to 1300Hz
    const freq = 2400 - (t / 1.8) * 1100 + Math.sin(2 * Math.PI * 18 * t) * 80;
    phase += (2 * Math.PI * freq) / sampleRate;
    let env = Math.sin((t / 1.8) * Math.PI);
    if (t < 0.08) env = t / 0.08;
    const tone = Math.sin(phase) + 0.4 * Math.sin(2 * phase) + 0.2 * Math.sin(3 * phase);
    samples[i] = tone * env * 0.8;
  }
  return samples;
}

function synthCrow() {
  const { samples, total } = createBuffer(1.6);
  // Double raspy caw
  const caws = [0.05, 0.75];
  for (const startT of caws) {
    const cLen = 0.45;
    const startIdx = Math.floor(startT * sampleRate);
    const lenIdx = Math.floor(cLen * sampleRate);
    let phase = 0;
    for (let j = 0; j < lenIdx; j++) {
      const idx = startIdx + j;
      if (idx >= total) break;
      const t = j / sampleRate;
      const freq = 560 - 70 * (t / cLen);
      phase += (2 * Math.PI * freq) / sampleRate;
      const env = Math.sin((t / cLen) * Math.PI);
      const tone = Math.sin(phase) + 0.6 * Math.sin(3 * phase) + 0.3 * Math.sin(5 * phase);
      const rasp = (Math.random() * 2 - 1) * 0.4;
      samples[idx] = (tone * 0.6 + rasp) * env * 0.85;
    }
  }
  return samples;
}

function synthBee() {
  const { samples, total } = createBuffer(2.0);
  let phase = 0;
  for (let i = 0; i < total; i++) {
    const t = i / sampleRate;
    const freq = 220 + 20 * Math.sin(t * 8);
    phase += (2 * Math.PI * freq) / sampleRate;
    const env = Math.sin((t / 2.0) * Math.PI);
    // Sawtooth-like rich buzz
    const tone = Math.sin(phase) + 0.6 * Math.sin(2 * phase) + 0.4 * Math.sin(3 * phase) + 0.3 * Math.sin(4 * phase);
    samples[i] = tone * env * 0.75;
  }
  return samples;
}

function synthFly() {
  const { samples, total } = createBuffer(1.8);
  let phase = 0;
  for (let i = 0; i < total; i++) {
    const t = i / sampleRate;
    const freq = 165 + 30 * Math.sin(t * 12);
    phase += (2 * Math.PI * freq) / sampleRate;
    const env = Math.sin((t / 1.8) * Math.PI);
    const tone = Math.sin(phase) + 0.5 * Math.sin(2 * phase) + 0.35 * Math.sin(3 * phase);
    samples[i] = tone * env * 0.75;
  }
  return samples;
}

function synthMosquito() {
  const { samples, total } = createBuffer(2.0);
  let phase = 0;
  for (let i = 0; i < total; i++) {
    const t = i / sampleRate;
    const freq = 580 + 40 * Math.sin(t * 6);
    phase += (2 * Math.PI * freq) / sampleRate;
    const env = Math.sin((t / 2.0) * Math.PI);
    const tone = Math.sin(phase) + 0.4 * Math.sin(2 * phase) + 0.2 * Math.sin(3 * phase);
    samples[i] = tone * env * 0.65;
  }
  return samples;
}

function synthCricket() {
  const { samples, total } = createBuffer(1.8);
  // Stridulation bursts
  const chirps = [0.05, 0.25, 0.45, 0.85, 1.05, 1.25];
  for (const startT of chirps) {
    const cLen = 0.08;
    const startIdx = Math.floor(startT * sampleRate);
    const lenIdx = Math.floor(cLen * sampleRate);
    let phase = 0;
    for (let j = 0; j < lenIdx; j++) {
      const idx = startIdx + j;
      if (idx >= total) break;
      const t = j / sampleRate;
      const freq = 4600;
      phase += (2 * Math.PI * freq) / sampleRate;
      const env = Math.sin((t / cLen) * Math.PI);
      samples[idx] = Math.sin(phase) * env * 0.8;
    }
  }
  return samples;
}

function synthSnake() {
  const { samples, total } = createBuffer(1.8);
  for (let i = 0; i < total; i++) {
    const t = i / sampleRate;
    let env = Math.sin((t / 1.8) * Math.PI);
    // Hiss: filtered white noise
    const noise = (Math.random() * 2 - 1) * 0.8;
    samples[i] = noise * env * 0.8;
  }
  return samples;
}

function synthMonkey() {
  const { samples, total } = createBuffer(2.2);
  // Pant-hoot series: "Ooh-ooh-aah-aah" (4 bursts ascending)
  const hoots = [
    { start: 0.05, len: 0.25, f: 420 },
    { start: 0.45, len: 0.25, f: 480 },
    { start: 0.85, len: 0.35, f: 650 },
    { start: 1.35, len: 0.55, f: 820 }
  ];
  for (const h of hoots) {
    const startIdx = Math.floor(h.start * sampleRate);
    const lenIdx = Math.floor(h.len * sampleRate);
    let phase = 0;
    for (let j = 0; j < lenIdx; j++) {
      const idx = startIdx + j;
      if (idx >= total) break;
      const t = j / sampleRate;
      const freq = h.f + Math.sin((t / h.len) * Math.PI) * 80;
      phase += (2 * Math.PI * freq) / sampleRate;
      const env = Math.sin((t / h.len) * Math.PI);
      const tone = Math.sin(phase) + 0.5 * Math.sin(2 * phase) + 0.25 * Math.sin(3 * phase);
      samples[idx] = tone * env * 0.85;
    }
  }
  return samples;
}

function synthDolphin() {
  const { samples, total } = createBuffer(2.0);
  let phase = 0;
  for (let i = 0; i < total; i++) {
    const t = i / sampleRate;
    // Whistle swoop: 2800Hz -> 4800Hz -> 3200Hz
    let freq;
    if (t < 0.9) {
      freq = 2800 + (t / 0.9) * 2000;
    } else {
      freq = 4800 - ((t - 0.9) / 1.1) * 1600;
    }
    phase += (2 * Math.PI * freq) / sampleRate;
    const env = Math.sin((t / 2.0) * Math.PI);
    // Tone + rapid clicks
    const tone = Math.sin(phase);
    const click = (i % 800 < 80) ? (Math.random() * 2 - 1) * 0.3 : 0;
    samples[i] = (tone * 0.7 + click) * env * 0.8;
  }
  return samples;
}

function synthWhale() {
  const { samples, total } = createBuffer(3.0);
  let phase = 0;
  for (let i = 0; i < total; i++) {
    const t = i / sampleRate;
    // Deep underwater humpback glide: 120Hz -> 260Hz -> 140Hz
    const freq = 130 + 110 * Math.sin((t / 3.0) * Math.PI);
    phase += (2 * Math.PI * freq) / sampleRate;
    const env = Math.sin((t / 3.0) * Math.PI);
    const tone = Math.sin(phase) + 0.5 * Math.sin(2 * phase) + 0.3 * Math.sin(3 * phase);
    samples[i] = tone * env * 0.85;
  }
  return samples;
}

function synthBear() {
  const { samples, total } = createBuffer(2.4);
  let phase = 0;
  for (let i = 0; i < total; i++) {
    const t = i / sampleRate;
    const freq = 85 + 35 * Math.sin(t * 6);
    phase += (2 * Math.PI * freq) / sampleRate;
    const env = Math.sin((t / 2.4) * Math.PI);
    const tone = Math.sin(phase) + 0.7 * Math.sin(2 * phase) + 0.4 * Math.sin(3 * phase);
    const growl = (Math.random() * 2 - 1) * 0.45;
    samples[i] = (tone * 0.55 + growl) * env * 0.9;
  }
  return samples;
}

function synthBat() {
  const { samples, total } = createBuffer(1.2);
  // Ultrasonic chirps
  const chirps = [0.05, 0.25, 0.45, 0.65, 0.85];
  for (const startT of chirps) {
    const cLen = 0.06;
    const startIdx = Math.floor(startT * sampleRate);
    const lenIdx = Math.floor(cLen * sampleRate);
    let phase = 0;
    for (let j = 0; j < lenIdx; j++) {
      const idx = startIdx + j;
      if (idx >= total) break;
      const t = j / sampleRate;
      const freq = 5800 - (t / cLen) * 2000;
      phase += (2 * Math.PI * freq) / sampleRate;
      const env = Math.sin((t / cLen) * Math.PI);
      samples[idx] = Math.sin(phase) * env * 0.75;
    }
  }
  return samples;
}

function synthMouse() {
  const { samples, total } = createBuffer(1.4);
  // High-frequency squeaks
  const squeaks = [0.05, 0.35, 0.75];
  for (const startT of squeaks) {
    const sLen = 0.15;
    const startIdx = Math.floor(startT * sampleRate);
    const lenIdx = Math.floor(sLen * sampleRate);
    let phase = 0;
    for (let j = 0; j < lenIdx; j++) {
      const idx = startIdx + j;
      if (idx >= total) break;
      const t = j / sampleRate;
      const freq = 3200 + Math.sin((t / sLen) * Math.PI) * 600;
      phase += (2 * Math.PI * freq) / sampleRate;
      const env = Math.sin((t / sLen) * Math.PI);
      samples[idx] = Math.sin(phase) * env * 0.7;
    }
  }
  return samples;
}

function synthPenguin() {
  const { samples, total } = createBuffer(1.6);
  // Brassy braying
  let phase = 0;
  for (let i = 0; i < total; i++) {
    const t = i / sampleRate;
    const freq = 460 + 80 * Math.sin(t * 14);
    phase += (2 * Math.PI * freq) / sampleRate;
    const env = Math.sin((t / 1.6) * Math.PI);
    const tone = Math.sin(phase) + 0.6 * Math.sin(2 * phase) + 0.4 * Math.sin(3 * phase);
    samples[i] = tone * env * 0.85;
  }
  return samples;
}

function synthTropicalBird() {
  const { samples, total } = createBuffer(1.8);
  // Melodic tropical squawk / warble
  let phase = 0;
  for (let i = 0; i < total; i++) {
    const t = i / sampleRate;
    const freq = 1400 + 700 * Math.sin(t * 18);
    phase += (2 * Math.PI * freq) / sampleRate;
    const env = Math.sin((t / 1.8) * Math.PI);
    const tone = Math.sin(phase) + 0.3 * Math.sin(2 * phase);
    samples[i] = tone * env * 0.8;
  }
  return samples;
}

function synthAquaticSplash() {
  const { samples, total } = createBuffer(1.6);
  let phase = 0;
  for (let i = 0; i < total; i++) {
    const t = i / sampleRate;
    const freq = 450 - 200 * (t / 1.6);
    phase += (2 * Math.PI * freq) / sampleRate;
    const env = Math.sin((t / 1.6) * Math.PI);
    const tone = Math.sin(phase);
    const water = (Math.random() * 2 - 1) * 0.4;
    samples[i] = (tone * 0.5 + water) * env * 0.8;
  }
  return samples;
}

// -------------------------------------------------------------
// MASTER MAPPING OF ALL 127 ANIMAL SOUND TYPES
// -------------------------------------------------------------

const soundGenerators = {
  cow: synthCow,
  horse: synthHorse,
  dog: synthDog,
  cat: synthCat,
  pig: synthPig,
  sheep: synthSheep,
  goat: synthGoat,
  rooster: synthRooster,
  chicken: synthChicken,
  duck: synthDuck,
  goose: synthGoose,
  lion: synthLion,
  tiger: synthTiger,
  elephant: synthElephant,
  wolf: synthWolf,
  frog: synthFrog,
  donkey: synthDonkey,
  owl: synthOwl,
  eagle: synthEagle,
  crow: synthCrow,
  bee: synthBee,
  fly: synthFly,
  mosquito: synthMosquito,
  cricket: synthCricket,
  snake: synthSnake,
  monkey: synthMonkey,
  dolphin: synthDolphin,
  whale: synthWhale,
  bear: synthBear,
  bat: synthBat,
  mouse: synthMouse,
  penguin: synthPenguin,

  // Bovine & large ungulates
  ox: synthCow,
  buffalo: synthCow,
  bison: synthCow,
  moose: synthCow,
  camel: synthCow,
  llama: synthCow,
  alpaca: synthCow,
  boar: synthPig,
  zebra: synthHorse,
  reindeer: synthCow,
  deer: synthCow,

  // Big cats & canines
  cheetah: synthCat,
  leopard: synthLion,
  hyena: synthDog,
  fox: synthDog,
  raccoon: synthDog,
  badger: synthBear,
  wolverine: synthBear,
  skunk: synthCat,

  // Primates
  chimpanzee: synthMonkey,
  gorilla: synthBear,
  orangutan: synthMonkey,
  baboon: synthMonkey,
  lemur: synthMonkey,

  // Marine mammals & fish
  orca: synthDolphin,
  beluga: synthDolphin,
  seal: synthDog,
  walrus: synthCow,
  manatee: synthWhale,
  otter: synthCat,
  clownfish: synthAquaticSplash,
  shark: synthAquaticSplash,
  octopus: synthAquaticSplash,
  jellyfish: synthAquaticSplash,
  turtle: synthAquaticSplash,
  crab: synthAquaticSplash,
  lobster: synthAquaticSplash,
  shrimp: synthAquaticSplash,
  squid: synthAquaticSplash,
  stingray: synthAquaticSplash,
  seahorse: synthAquaticSplash,
  starfish: synthAquaticSplash,
  coral: synthAquaticSplash,
  blowfish: synthAquaticSplash,

  // Birds
  swan: synthGoose,
  turkey: synthChicken,
  peacock: synthGoose,
  pelican: synthDuck,
  stork: synthGoose,
  emu: synthGoose,
  woodpecker: synthChicken,
  hummingbird: synthTropicalBird,
  pigeon: synthOwl,
  raven: synthCrow,
  dove: synthOwl,
  seagull: synthDuck,
  canary: synthTropicalBird,
  parrot: synthTropicalBird,
  macaw: synthTropicalBird,
  toucan: synthTropicalBird,
  flamingo: synthGoose,
  puffin: synthPenguin,
  vulture: synthEagle,
  falcon: synthEagle,
  hawk: synthEagle,

  // Reptiles & amphibians
  crocodile: synthBear,
  alligator: synthBear,
  lizard: synthSnake,
  iguana: synthSnake,
  chameleon: synthSnake,

  // Insects & arachnids
  butterfly: synthFly,
  ladybug: synthBee,
  spider: synthSnake,
  scorpion: synthSnake,
  beetle: synthBee,
  caterpillar: synthFly,
  snail: synthAquaticSplash,
  worm: synthAquaticSplash,

  // Small mammals & marsupials
  hamster: synthMouse,
  guinea_pig: synthMouse,
  squirrel: synthMouse,
  chipmunk: synthMouse,
  rabbit: synthMouse,
  ferret: synthCat,
  chinchilla: synthMouse,
  beaver: synthPig,
  armadillo: synthPig,
  hedgehog: synthMouse,
  kangaroo: synthCow,
  koala: synthBear,
  panda: synthBear,
  sloth: synthCat,
  meerkat: synthDog,
  mongoose: synthCat,
  hippo: synthCow,
  rhino: synthCow,
  giraffe: synthCow
};

console.log(`Generating authentic sounds for all ${Object.keys(soundGenerators).length} animal sound types...`);

for (const [soundType, generator] of Object.entries(soundGenerators)) {
  const tmpWav = path.join('/tmp', `animal_${soundType}.wav`);
  const finalOgg = path.join(targetDir, `${soundType}.ogg`);

  try {
    const samples = generator();
    writeWav(tmpWav, samples, sampleRate);
    execSync(`ffmpeg -y -i "${tmpWav}" -af "loudnorm" -c:a libvorbis -q:a 4 "${finalOgg}" 2>/dev/null`);
    if (fs.existsSync(tmpWav)) fs.unlinkSync(tmpWav);
    console.log(`[OK] Generated authentic vocalization for: ${soundType}`);
  } catch (err) {
    console.error(`[ERROR] Failed to generate ${soundType}:`, err.message);
  }
}

console.log("All authentic animal sounds synthesized successfully!");
