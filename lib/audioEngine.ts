// Audio Engine for Kids Zoological Safari
// Provides authentic animal audio recordings, young British female narration, and gentle background melodies.

const ANIMAL_AUDIO_MAP: Record<string, string> = {
  goat: 'https://actions.google.com/sounds/v1/animals/sheep_bleat.ogg',
  donkey: 'https://actions.google.com/sounds/v1/animals/horse_whinny.ogg',
  llama: 'https://actions.google.com/sounds/v1/animals/sheep_bleat.ogg',
  alpaca: 'https://actions.google.com/sounds/v1/animals/sheep_bleat.ogg',
  goose: 'https://actions.google.com/sounds/v1/animals/duck_quack.ogg',
  buffalo: 'https://actions.google.com/sounds/v1/animals/cow_moo.ogg',
  ox: 'https://actions.google.com/sounds/v1/animals/cow_moo.ogg',
  camel: 'https://actions.google.com/sounds/v1/animals/horse_whinny.ogg',
  gorilla: 'https://upload.wikimedia.org/wikipedia/commons/a/a2/Chimpanzee_pant-hoot.ogg',
  rhino: 'https://actions.google.com/sounds/v1/animals/pig_grunt.ogg',
  koala: 'https://actions.google.com/sounds/v1/animals/bear_growl.ogg',
  panda: 'https://actions.google.com/sounds/v1/animals/bear_growl.ogg',
  sloth: 'https://actions.google.com/sounds/v1/animals/cat_purr.ogg',
  leopard: 'https://actions.google.com/sounds/v1/animals/lion_roar.ogg',
  hyena: 'https://actions.google.com/sounds/v1/animals/distant_dog_barking.ogg',
  fox: 'https://actions.google.com/sounds/v1/animals/wolf_howl.ogg',
  raccoon: 'https://actions.google.com/sounds/v1/animals/mouse_squeak.ogg',
  moose: 'https://actions.google.com/sounds/v1/animals/cow_moo.ogg',
  deer: 'https://actions.google.com/sounds/v1/animals/cow_moo.ogg',
  reindeer: 'https://actions.google.com/sounds/v1/animals/cow_moo.ogg',
  boar: 'https://actions.google.com/sounds/v1/animals/pig_grunt.ogg',
  bison: 'https://actions.google.com/sounds/v1/animals/cow_moo.ogg',
  wolverine: 'https://actions.google.com/sounds/v1/animals/bear_growl.ogg',
  orca: 'https://actions.google.com/sounds/v1/animals/dolphin_call.ogg',
  beluga: 'https://actions.google.com/sounds/v1/animals/dolphin_call.ogg',
  penguin: 'https://actions.google.com/sounds/v1/animals/duck_quack.ogg',
  crow: 'https://actions.google.com/sounds/v1/animals/crow_cawing.ogg',
  raven: 'https://actions.google.com/sounds/v1/animals/crow_cawing.ogg',
  fly: 'https://actions.google.com/sounds/v1/animals/fly_buzzing.ogg',
  bee: 'https://actions.google.com/sounds/v1/animals/bee_buzzing.ogg',
  mosquito: 'https://actions.google.com/sounds/v1/animals/fly_buzzing.ogg',
  cricket: 'https://actions.google.com/sounds/v1/animals/cricket_chirping.ogg',
  snake: 'https://actions.google.com/sounds/v1/animals/snake_hiss.ogg',
  frog: 'https://actions.google.com/sounds/v1/animals/frog_croak.ogg',
  monkey: 'https://upload.wikimedia.org/wikipedia/commons/a/a2/Chimpanzee_pant-hoot.ogg',
  bat: 'https://actions.google.com/sounds/v1/animals/mouse_squeak.ogg',

  cow: 'https://actions.google.com/sounds/v1/animals/cow_moo.ogg',
  pig: 'https://actions.google.com/sounds/v1/animals/pig_grunt.ogg',
  sheep: 'https://actions.google.com/sounds/v1/animals/sheep_bleat.ogg',
  horse: 'https://actions.google.com/sounds/v1/animals/horse_whinny.ogg',
  duck: 'https://actions.google.com/sounds/v1/animals/duck_quack.ogg',
  chicken: 'https://actions.google.com/sounds/v1/animals/rooster_crowing.ogg',
  rooster: 'https://actions.google.com/sounds/v1/animals/rooster_crowing.ogg',
  dog: 'https://actions.google.com/sounds/v1/animals/distant_dog_barking.ogg',
  cat: 'https://actions.google.com/sounds/v1/animals/cat_purr.ogg',
  lion: 'https://actions.google.com/sounds/v1/animals/lion_roar.ogg',
  tiger: 'https://upload.wikimedia.org/wikipedia/commons/e/ec/Panthera_leo_roar.ogg',
  elephant: 'https://actions.google.com/sounds/v1/animals/elephant_trumpet.ogg',
  giraffe: 'https://actions.google.com/sounds/v1/animals/horse_whinny.ogg',
  cheetah: 'https://actions.google.com/sounds/v1/animals/cat_purr.ogg',
  hippo: 'https://actions.google.com/sounds/v1/animals/pig_grunt.ogg',
  chimpanzee: 'https://upload.wikimedia.org/wikipedia/commons/a/a2/Chimpanzee_pant-hoot.ogg',
  zebra: 'https://actions.google.com/sounds/v1/animals/horse_whinny.ogg',
  bear: 'https://actions.google.com/sounds/v1/animals/bear_growl.ogg',
  wolf: 'https://actions.google.com/sounds/v1/animals/wolf_howl.ogg',
  dolphin: 'https://actions.google.com/sounds/v1/animals/dolphin_call.ogg',
  whale: 'https://upload.wikimedia.org/wikipedia/commons/1/1a/Humpbackwhale_singing.ogg',
  clownfish: 'https://actions.google.com/sounds/v1/water/water_bubbles.ogg',
  turtle: 'https://actions.google.com/sounds/v1/water/lapping_water.ogg',
  shark: 'https://actions.google.com/sounds/v1/water/ocean_wave.ogg',
  octopus: 'https://actions.google.com/sounds/v1/water/water_drop.ogg',
  otter: 'https://actions.google.com/sounds/v1/animals/cat_purr.ogg',
  jellyfish: 'https://actions.google.com/sounds/v1/water/underwater_ambience.ogg',
  toucan: 'https://actions.google.com/sounds/v1/animals/bird_call.ogg',
  macaw: 'https://actions.google.com/sounds/v1/animals/bird_chirp.ogg',
  flamingo: 'https://actions.google.com/sounds/v1/animals/duck_quack.ogg',
  owl: 'https://actions.google.com/sounds/v1/animals/owl_hoot.ogg',
  eagle: 'https://upload.wikimedia.org/wikipedia/commons/2/23/Barn_owl_call.ogg',
  puffin: 'https://actions.google.com/sounds/v1/animals/duck_quack.ogg',
};

// Fallback onomatopoeic speech vocalizations when audio element is restricted
class AudioEngine {
  private isMuted: boolean = false;
  private volume: number = 0.85;
  private currentAudio: HTMLAudioElement | null = null;
  private bgOscillators: OscillatorNode[] = [];
  private bgGainNode: GainNode | null = null;
  private bgMusicInterval: NodeJS.Timeout | null = null;
  private ctx: AudioContext | null = null;

  constructor() {
    // Lazy initialized on first user interaction
  }

  private initContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        this.ctx = new AudioCtxClass();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (muted) {
      this.stopAllAudio();
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.currentAudio) {
      this.currentAudio.volume = this.volume;
    }
  }

  public getVolume(): number {
    return this.volume;
  }

  // --- UI INTERACTION SOUNDS ---
  public playPopSound(freq: number = 440) {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const now = ctx.currentTime;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.5, now + 0.08);

      gain.gain.setValueAtTime(0.2 * this.volume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.11);
    } catch {
      // Audio context error recovery
    }
  }

  public playSparkleSound() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    try {
      const freqs = [523.25, 659.25, 783.99, 1046.5, 1318.51];
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const now = ctx.currentTime + idx * 0.05;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0.12 * this.volume, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.2);
      });
    } catch {
      // Audio context error recovery
    }
  }

  public playCheerFanfare() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    try {
      const notes = [261.63, 329.63, 392.0, 523.25, 659.25, 783.99, 1046.5];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const now = ctx.currentTime + idx * 0.07;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0.15 * this.volume, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.32);
      });
    } catch {
      // Audio context error recovery
    }
  }

  // --- AUTHENTIC ANIMAL SOUND PLAYBACK ---
  public playAnimalSound(soundType: string, onEnded?: () => void) {
    if (this.isMuted) {
      if (onEnded) onEnded();
      return;
    }

    this.stopSpeaking();
    this.stopCurrentAudio();

    // Map unknown soundTypes to generic categories or default silent if not found
    let audioUrl = ANIMAL_AUDIO_MAP[soundType.toLowerCase()];
    
    // Auto-map some categories if missing
    if (!audioUrl) {
      const birds = ['canary', 'parrot', 'toucan', 'macaw', 'flamingo', 'stork', 'pelican', 'peacock', 'swan', 'puffin', 'eagle', 'owl', 'ostrich', 'emu', 'kiwi', 'woodpecker', 'hummingbird', 'pigeon', 'crow', 'raven', 'dove', 'seagull', 'vulture', 'falcon', 'hawk', 'turkey'];
      const bugs = ['butterfly', 'bee', 'ladybug', 'ant', 'spider', 'scorpion', 'mosquito', 'fly', 'beetle', 'cockroach', 'cricket', 'caterpillar', 'snail', 'worm'];
      const smallAnimals = ['mouse', 'rat', 'hamster', 'guinea_pig', 'ferret', 'chinchilla', 'squirrel', 'chipmunk', 'hedgehog', 'skunk', 'badger', 'rabbit', 'meerkat', 'mongoose'];
      const sea = ['dolphin', 'whale', 'orca', 'beluga', 'walrus', 'seal', 'penguin', 'manatee', 'crab', 'lobster', 'shrimp', 'squid', 'stingray', 'seahorse', 'starfish', 'coral', 'blowfish'];
      const reptiles = ['snake', 'turtle', 'lizard', 'iguana', 'chameleon', 'crocodile', 'alligator'];
      
      if (birds.includes(soundType)) audioUrl = 'https://actions.google.com/sounds/v1/animals/bird_call.ogg';
      else if (bugs.includes(soundType)) audioUrl = 'https://actions.google.com/sounds/v1/animals/cricket_chirping.ogg';
      else if (smallAnimals.includes(soundType)) audioUrl = 'https://actions.google.com/sounds/v1/animals/mouse_squeak.ogg';
      else if (sea.includes(soundType)) audioUrl = 'https://actions.google.com/sounds/v1/water/water_bubbles.ogg';
      else if (reptiles.includes(soundType)) audioUrl = 'https://actions.google.com/sounds/v1/animals/snake_hiss.ogg';
      else audioUrl = 'https://actions.google.com/sounds/v1/animals/distant_dog_barking.ogg'; // Generic fallback for large mammals
    }

    if (audioUrl && typeof window !== 'undefined') {
      try {
        const audio = new Audio(audioUrl);
        audio.volume = this.volume;
        this.currentAudio = audio;

        audio.onended = () => {
          this.currentAudio = null;
          if (onEnded) onEnded();
        };

        audio.onerror = () => {
          this.currentAudio = null;
          if (onEnded) onEnded();
        };

        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            if (onEnded) onEnded();
          });
        }
        return;
      } catch {
        if (onEnded) onEnded();
        return;
      }
    } else {
      if (onEnded) onEnded();
    }
  }

  public stopCurrentAudio() {
    if (this.currentAudio) {
      try {
        this.currentAudio.pause();
        this.currentAudio.currentTime = 0;
      } catch {
        // ignore
      }
      this.currentAudio = null;
    }
  }

  // --- GENTLE BACKGROUND PENTATONIC CHIMES ---
  public startBackgroundMusic() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    this.stopBackgroundMusic();

    try {
      const chords = [
        [261.63, 329.63, 392.0], // C major
        [293.66, 369.99, 440.0], // D / G major
        [261.63, 329.63, 523.25], // C octave
      ];

      let chordIndex = 0;

      const playChord = () => {
        if (this.isMuted || !this.ctx) return;
        const currentChord = chords[chordIndex % chords.length];
        chordIndex++;

        currentChord.forEach((freq, idx) => {
          try {
            const osc = this.ctx!.createOscillator();
            const gain = this.ctx!.createGain();
            const now = this.ctx!.currentTime + idx * 0.12;

            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now);

            // Very gentle, ambient background volume
            gain.gain.setValueAtTime(0.001, now);
            gain.gain.linearRampToValueAtTime(0.035 * this.volume, now + 0.4);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.8);

            osc.connect(gain);
            gain.connect(this.ctx!.destination);

            osc.start(now);
            osc.stop(now + 1.9);
          } catch {
            // ignore
          }
        });
      };

      playChord();
      this.bgMusicInterval = setInterval(playChord, 1600);
    } catch {
      // ignore
    }
  }

  public stopBackgroundMusic() {
    if (this.bgMusicInterval) {
      clearInterval(this.bgMusicInterval);
      this.bgMusicInterval = null;
    }
    this.bgOscillators.forEach((osc) => {
      try {
        osc.stop();
        osc.disconnect();
      } catch {
        // ignore
      }
    });
    this.bgOscillators = [];
  }

  // --- YOUNG BRITISH FEMALE SPEECH SYNTHESIS ---
  private findYoungBritishFemaleVoice(): SpeechSynthesisVoice | null {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;
    const voices = window.speechSynthesis.getVoices();
    if (!voices || voices.length === 0) return null;

    // 1. UK English Female voices
    const ukFemale = voices.find(
      (v) =>
        (v.lang === 'en-GB' || v.lang.startsWith('en-GB') || v.lang === 'en_GB') &&
        (v.name.toLowerCase().includes('female') ||
          v.name.toLowerCase().includes('libby') ||
          v.name.toLowerCase().includes('sonia') ||
          v.name.toLowerCase().includes('serena') ||
          v.name.toLowerCase().includes('mia') ||
          v.name.toLowerCase().includes('olivia') ||
          v.name.toLowerCase().includes('emma') ||
          v.name.toLowerCase().includes('amy') ||
          v.name.toLowerCase().includes('victoria'))
    );
    if (ukFemale) return ukFemale;

    // 2. Any en-GB voice
    const anyUK = voices.find((v) => v.lang === 'en-GB' || v.lang.startsWith('en-GB') || v.lang === 'en_GB');
    if (anyUK) return anyUK;

    // 3. Female English voice
    const femaleEnglish = voices.find(
      (v) =>
        v.lang.startsWith('en') &&
        (v.name.toLowerCase().includes('female') ||
          v.name.toLowerCase().includes('samantha') ||
          v.name.toLowerCase().includes('karen') ||
          v.name.toLowerCase().includes('zira') ||
          v.name.toLowerCase().includes('susan') ||
          v.name.toLowerCase().includes('victoria'))
    );
    if (femaleEnglish) return femaleEnglish;

    // 4. Any English voice
    const anyEnglish = voices.find((v) => v.lang.startsWith('en'));
    return anyEnglish || voices[0] || null;
  }

  public speakText(text: string, rate: number = 0.95, pitch: number = 1.25, onEnded?: () => void) {
    if (this.isMuted) {
      if (onEnded) onEnded();
      return;
    }
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      if (onEnded) onEnded();
      return;
    }

    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = rate;
      utterance.pitch = pitch;
      utterance.volume = this.volume;
      utterance.lang = 'en-GB';

      const voice = this.findYoungBritishFemaleVoice();
      if (voice) {
        utterance.voice = voice;
      }

      utterance.onend = () => {
        if (onEnded) onEnded();
      };
      utterance.onerror = () => {
        if (onEnded) onEnded();
      };

      window.speechSynthesis.speak(utterance);
    } catch {
      if (onEnded) onEnded();
    }
  }

  // --- SPEAK FUN FACT WITH SOFT BACKGROUND MUSIC ---
  public speakFunFact(
    text: string,
    onStart?: () => void,
    onEnd?: () => void
  ) {
    if (this.isMuted) {
      if (onStart) onStart();
      if (onEnd) setTimeout(onEnd, 1500);
      return;
    }
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      if (onStart) onStart();
      if (onEnd) setTimeout(onEnd, 1500);
      return;
    }

    try {
      this.stopSpeaking();
      this.stopCurrentAudio();
      this.startBackgroundMusic();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.92;
      utterance.pitch = 1.25;
      utterance.volume = this.volume;
      utterance.lang = 'en-GB';

      const voice = this.findYoungBritishFemaleVoice();
      if (voice) {
        utterance.voice = voice;
      }

      utterance.onstart = () => {
        if (onStart) onStart();
      };

      const cleanup = () => {
        this.stopBackgroundMusic();
        if (onEnd) onEnd();
      };

      utterance.onend = cleanup;
      utterance.onerror = cleanup;

      window.speechSynthesis.speak(utterance);
    } catch {
      this.stopBackgroundMusic();
      if (onEnd) onEnd();
    }
  }

  public stopSpeaking() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {
        // ignore
      }
    }
    this.stopBackgroundMusic();
  }

  public stopAllAudio() {
    this.stopCurrentAudio();
    this.stopSpeaking();
    this.stopBackgroundMusic();
  }
}

export const audioEngine = new AudioEngine();
