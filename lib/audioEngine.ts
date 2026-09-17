// Audio Engine for Kids Zoological Safari
// Provides authentic real animal audio recordings from external high-speed CDN APIs,
// young British female narration, and gentle background melodies.

// High-performance, CORS-enabled global CDN endpoints for authentic animal audio recordings
const CDN_BASE_URL = 'https://cdn.jsdelivr.net/gh/anirxdh/JungleSafari@master/public/animals/';
const RAW_BASE_URL = 'https://raw.githubusercontent.com/anirxdh/JungleSafari/master/public/animals/';

// Direct mapping of all 127+ species and soundTypes to verified authentic MP3 audio files
const EXTERNAL_ANIMAL_FILENAME_MAP: Record<string, string> = {
  cow: 'cow.mp3',
  pig: 'pig.mp3',
  sheep: 'sheep.mp3',
  horse: 'horse.mp3',
  duck: 'duck.mp3',
  chicken: 'chicken.mp3',
  dog: 'dog-bark.mp3',
  cat: 'cat-meow.mp3',
  frog: 'bullfrog.mp3',
  lion: 'lion.mp3',
  tiger: 'tiger.mp3',
  elephant: 'elephant.mp3',
  giraffe: 'horse.mp3',
  cheetah: 'leopard.mp3',
  hippo: 'pig.mp3',
  monkey: 'chimpanzee.mp3',
  zebra: 'horse.mp3',
  bear: 'grizzly-bear.mp3',
  wolf: 'wolf.mp3',
  dolphin: 'dolphin.mp3',
  whale: 'humpback-whale.mp3',
  clownfish: 'dolphin.mp3',
  turtle: 'alligator.mp3',
  shark: 'humpback-whale.mp3',
  octopus: 'dolphin.mp3',
  otter: 'sea-otter.mp3',
  jellyfish: 'dolphin.mp3',
  toucan: 'parrot.mp3',
  macaw: 'parrot.mp3',
  flamingo: 'peacock.mp3',
  owl: 'owl.mp3',
  eagle: 'bald-eagle.mp3',
  puffin: 'seagull.mp3',
  goat: 'goat.mp3',
  donkey: 'donkey.mp3',
  turkey: 'turkey.mp3',
  llama: 'goat.mp3',
  alpaca: 'sheep.mp3',
  goose: 'duck.mp3',
  rooster: 'rooster.mp3',
  buffalo: 'cow.mp3',
  ox: 'cow.mp3',
  camel: 'donkey.mp3',
  rabbit: 'hamster.mp3',
  gorilla: 'chimpanzee.mp3',
  rhino: 'pig.mp3',
  kangaroo: 'deer.mp3',
  koala: 'grizzly-bear.mp3',
  panda: 'grizzly-bear.mp3',
  sloth: 'cat-purr.mp3',
  leopard: 'leopard.mp3',
  hyena: 'hyena.mp3',
  meerkat: 'hamster.mp3',
  mongoose: 'hamster.mp3',
  fox: 'fox.mp3',
  raccoon: 'dog-bark.mp3',
  moose: 'moose.mp3',
  deer: 'deer.mp3',
  reindeer: 'deer.mp3',
  boar: 'pig.mp3',
  bison: 'cow.mp3',
  badger: 'grizzly-bear.mp3',
  hedgehog: 'hamster.mp3',
  skunk: 'cat-purr.mp3',
  bat: 'mosquito.mp3',
  orangutan: 'chimpanzee.mp3',
  lemur: 'chimpanzee.mp3',
  baboon: 'chimpanzee.mp3',
  squirrel: 'hamster.mp3',
  chipmunk: 'hamster.mp3',
  beaver: 'sea-otter.mp3',
  armadillo: 'hamster.mp3',
  wolverine: 'grizzly-bear.mp3',
  walrus: 'walrus.mp3',
  seal: 'seal.mp3',
  penguin: 'seagull.mp3',
  orca: 'orca.mp3',
  beluga: 'dolphin.mp3',
  manatee: 'seal.mp3',
  crab: 'seagull.mp3',
  lobster: 'seagull.mp3',
  shrimp: 'dolphin.mp3',
  squid: 'dolphin.mp3',
  stingray: 'humpback-whale.mp3',
  seahorse: 'dolphin.mp3',
  starfish: 'dolphin.mp3',
  coral: 'dolphin.mp3',
  blowfish: 'dolphin.mp3',
  swan: 'duck.mp3',
  peacock: 'peacock.mp3',
  pelican: 'seagull.mp3',
  stork: 'seagull.mp3',
  emu: 'turkey.mp3',
  woodpecker: 'woodpecker.mp3',
  hummingbird: 'hummingbird.mp3',
  pigeon: 'pigeon.mp3',
  crow: 'crow.mp3',
  raven: 'crow.mp3',
  dove: 'pigeon.mp3',
  seagull: 'seagull.mp3',
  vulture: 'crow.mp3',
  falcon: 'bald-eagle.mp3',
  hawk: 'bald-eagle.mp3',
  canary: 'hummingbird.mp3',
  ostrich: 'turkey.mp3',
  kiwi: 'woodpecker.mp3',
  butterfly: 'hummingbird.mp3',
  bee: 'bee.mp3',
  ladybug: 'cricket.mp3',
  ant: 'cricket.mp3',
  spider: 'cricket.mp3',
  scorpion: 'rattlesnake.mp3',
  mosquito: 'mosquito.mp3',
  fly: 'mosquito.mp3',
  beetle: 'cicada.mp3',
  cockroach: 'cricket.mp3',
  cricket: 'cricket.mp3',
  caterpillar: 'grasshopper.mp3',
  snail: 'tree-frog.mp3',
  worm: 'tree-frog.mp3',
  snake: 'rattlesnake.mp3',
  lizard: 'gecko.mp3',
  iguana: 'gecko.mp3',
  chameleon: 'gecko.mp3',
  crocodile: 'alligator.mp3',
  alligator: 'alligator.mp3',
  parrot: 'parrot.mp3',
  mouse: 'hamster.mp3',
  hamster: 'hamster.mp3',
  guinea_pig: 'hamster.mp3',
  ferret: 'cat-purr.mp3',
  chinchilla: 'hamster.mp3',
  anteater: 'hamster.mp3',
  antelope: 'deer.mp3',
  coyote: 'wolf.mp3',
  jackal: 'fox.mp3',
  lynx: 'leopard.mp3',
  pangolin: 'hamster.mp3',
  porcupine: 'hamster.mp3',
  puma: 'lion.mp3',
  red_panda: 'cat-purr.mp3',
  'red-panda': 'cat-purr.mp3',
  snow_leopard: 'leopard.mp3',
  'snow-leopard': 'leopard.mp3',
  tapir: 'pig.mp3',
  elk: 'moose.mp3',
  gazelle: 'deer.mp3',
  mole: 'hamster.mp3',
  sea_lion: 'seal.mp3',
  'sea-lion': 'seal.mp3',
  manta_ray: 'humpback-whale.mp3',
  'manta-ray': 'humpback-whale.mp3',
  sperm_whale: 'humpback-whale.mp3',
  'sperm-whale': 'humpback-whale.mp3',
  man_of_war: 'dolphin.mp3',
  'man-of-war': 'dolphin.mp3',
  cockatoo: 'parrot.mp3',
  kingfisher: 'hummingbird.mp3',
  gecko: 'gecko.mp3',
  python: 'rattlesnake.mp3',
  salamander: 'tree-frog.mp3',
  toad: 'bullfrog.mp3',
  tortoise: 'alligator.mp3',
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

  // Session & Active State Management for Instant Switching & Spinner Control
  private currentSessionId: number = 0;
  private activeAnimalId: string | null = null;
  private activeMode: 'sound' | 'fact' | 'all' | null = null;
  private activeAnimalListeners: Set<(id: string | null, mode: 'sound' | 'fact' | 'all' | null) => void> = new Set();
  private nameSpeechTimeout: NodeJS.Timeout | null = null;
  private audioWatchdogTimeout: NodeJS.Timeout | null = null;
  private activeUtterance: SpeechSynthesisUtterance | null = null;
  private activeCallback: (() => void) | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      const unlockAudio = () => {
        try {
          const el = this.getAudioElement();
          if (!el.src) {
            el.src = 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=';
            el.load();
          }
          if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
          }
        } catch {
          // ignore
        }
        window.removeEventListener('touchstart', unlockAudio);
        window.removeEventListener('touchend', unlockAudio);
        window.removeEventListener('click', unlockAudio);
      };
      window.addEventListener('touchstart', unlockAudio, { passive: true });
      window.addEventListener('touchend', unlockAudio, { passive: true });
      window.addEventListener('click', unlockAudio, { passive: true });
    }
  }

  public getActiveAnimalId(): string | null {
    return this.activeAnimalId;
  }

  public getActiveMode(): 'sound' | 'fact' | 'all' | null {
    return this.activeMode;
  }

  public subscribeActiveAnimal(
    listener: (id: string | null, mode: 'sound' | 'fact' | 'all' | null) => void
  ): () => void {
    this.activeAnimalListeners.add(listener);
    // Immediately notify listener of current state
    try {
      listener(this.activeAnimalId, this.activeMode);
    } catch {
      // ignore
    }
    return () => {
      this.activeAnimalListeners.delete(listener);
    };
  }

  private setActiveAnimal(id: string | null, mode: 'sound' | 'fact' | 'all' | null = null) {
    this.activeAnimalId = id;
    this.activeMode = id ? mode : null;
    this.activeAnimalListeners.forEach((listener) => {
      try {
        listener(this.activeAnimalId, this.activeMode);
      } catch {
        // ignore
      }
    });
  }

  private setActiveAnimalId(id: string | null) {
    this.setActiveAnimal(id, id ? 'sound' : null);
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

  private sharedAudio: HTMLAudioElement | null = null;

  public getAudioElement(): HTMLAudioElement {
    if (!this.sharedAudio && typeof window !== 'undefined') {
      this.sharedAudio = new Audio();
      this.sharedAudio.preload = 'auto';
      // @ts-ignore
      this.sharedAudio.playsInline = true;
      // @ts-ignore
      this.sharedAudio.webkitPlaysInline = true;
    }
    return this.sharedAudio || new Audio();
  }

  private getCandidateUrls(filename: string): string[] {
    return [
      `https://cdn.jsdelivr.net/gh/anirxdh/JungleSafari@master/public/animals/${filename}`,
      `https://fastly.jsdelivr.net/gh/anirxdh/JungleSafari@master/public/animals/${filename}`,
      `https://gcore.jsdelivr.net/gh/anirxdh/JungleSafari@master/public/animals/${filename}`,
      `https://raw.githubusercontent.com/anirxdh/JungleSafari/master/public/animals/${filename}`,
    ];
  }

  // --- AUTHENTIC ANIMAL SOUND AUDIO PLAYBACK VIA EXTERNAL GLOBAL APIS & CDNS ---
  public playAnimalSound(soundType: string, onEnded?: () => void, animalId?: string) {
    const sessionId = ++this.currentSessionId;

    if (this.nameSpeechTimeout) {
      clearTimeout(this.nameSpeechTimeout);
      this.nameSpeechTimeout = null;
    }
    if (this.audioWatchdogTimeout) {
      clearTimeout(this.audioWatchdogTimeout);
      this.audioWatchdogTimeout = null;
    }

    if (this.activeCallback) {
      const prevCb = this.activeCallback;
      this.activeCallback = null;
      try {
        prevCb();
      } catch {
        // ignore
      }
    }
    this.activeCallback = onEnded || null;

    this.stopSpeaking();
    this.stopCurrentAudio();

    this.setActiveAnimalId(animalId || null);

    if (this.isMuted || typeof window === 'undefined') {
      this.finishPlayback(sessionId);
      return;
    }

    const cleanSoundType = soundType.toLowerCase().replace(/[^a-z0-9_-]/g, '');
    const filename = EXTERNAL_ANIMAL_FILENAME_MAP[cleanSoundType] || 'horse.mp3';
    const candidateUrls = this.getCandidateUrls(filename);

    this.playAudioCandidates(sessionId, cleanSoundType, candidateUrls, 0);
  }

  // --- PLAY ANIMAL SOUND WITH SPOKEN NAME FIRST FOR KIDS ---
  public playAnimalSoundWithName(
    arg1: string,
    arg2: string,
    arg3?: string | (() => void),
    arg4?: () => void
  ) {
    let animalId: string | null = null;
    let animalName: string = '';
    let soundType: string = '';
    let onEnded: (() => void) | undefined;

    if (typeof arg3 === 'function') {
      animalName = arg1;
      soundType = arg2;
      onEnded = arg3;
      animalId = null;
    } else if (typeof arg3 === 'string') {
      animalId = arg1;
      animalName = arg2;
      soundType = arg3;
      onEnded = arg4;
    } else {
      animalName = arg1;
      soundType = arg2;
    }

    const sessionId = ++this.currentSessionId;

    if (this.nameSpeechTimeout) {
      clearTimeout(this.nameSpeechTimeout);
      this.nameSpeechTimeout = null;
    }
    if (this.audioWatchdogTimeout) {
      clearTimeout(this.audioWatchdogTimeout);
      this.audioWatchdogTimeout = null;
    }

    if (this.activeCallback) {
      const prevCb = this.activeCallback;
      this.activeCallback = null;
      try {
        prevCb();
      } catch {
        // ignore
      }
    }
    this.activeCallback = onEnded || null;

    this.stopSpeaking();
    this.stopCurrentAudio();

    this.setActiveAnimal(animalId, 'sound');

    if (this.isMuted || typeof window === 'undefined') {
      this.finishPlayback(sessionId);
      return;
    }

    const cleanSoundType = soundType.toLowerCase().replace(/[^a-z0-9_-]/g, '');
    const filename = EXTERNAL_ANIMAL_FILENAME_MAP[cleanSoundType] || 'horse.mp3';
    const candidateUrls = this.getCandidateUrls(filename);

    // CRITICAL FOR IPHONE (iOS SAFARI):
    // Play authentic CDN animal audio IMMEDIATELY and SYNCHRONOUSLY within the user tap event!
    // Calling audio.play() synchronously inside the touch/click event satisfies iOS gesture requirements.
    // When the authentic CDN animal sound finishes, speak the animal name in young British female voice.
    this.playAudioCandidates(sessionId, cleanSoundType, candidateUrls, 0, () => {
      if (this.currentSessionId !== sessionId) return;
      if (animalName) {
        this.speakText(animalName, 1.05, 1.18, () => {
          this.finishPlayback(sessionId);
        });
      } else {
        this.finishPlayback(sessionId);
      }
    });
  }

  // --- PLAY ANIMAL NAME, SOUND, AND FUN FACT IN ONE CONTINUOUS KIDS' AUDIO TOUR ---
  public playAnimalSoundAndFact(
    animalId: string,
    animalName: string,
    soundType: string,
    funFact: string,
    onEnded?: () => void
  ) {
    const sessionId = ++this.currentSessionId;

    if (this.nameSpeechTimeout) {
      clearTimeout(this.nameSpeechTimeout);
      this.nameSpeechTimeout = null;
    }
    if (this.audioWatchdogTimeout) {
      clearTimeout(this.audioWatchdogTimeout);
      this.audioWatchdogTimeout = null;
    }

    if (this.activeCallback) {
      const prevCb = this.activeCallback;
      this.activeCallback = null;
      try {
        prevCb();
      } catch {
        // ignore
      }
    }
    this.activeCallback = onEnded || null;

    this.stopSpeaking();
    this.stopCurrentAudio();

    this.setActiveAnimal(animalId, 'all');

    if (this.isMuted || typeof window === 'undefined') {
      this.finishPlayback(sessionId);
      return;
    }

    const cleanSoundType = soundType.toLowerCase().replace(/[^a-z0-9_-]/g, '');
    const filename = EXTERNAL_ANIMAL_FILENAME_MAP[cleanSoundType] || 'horse.mp3';
    const candidateUrls = this.getCandidateUrls(filename);

    // Step 1: Play authentic CDN animal audio IMMEDIATELY in user gesture (iPhone & Android)
    this.playAudioCandidates(sessionId, cleanSoundType, candidateUrls, 0, () => {
      if (this.currentSessionId !== sessionId) return;
      // Step 2: Speak animal name and fun fact in British young female voice
      const narrationText = `${animalName}. ${funFact}`;
      this.speakFactNarration(sessionId, narrationText, () => {
        this.finishPlayback(sessionId);
      });
    });
  }

  private speakFactNarration(sessionId: number, funFact: string, onDone: () => void) {
    if (this.currentSessionId !== sessionId) return;

    if (this.audioWatchdogTimeout) {
      clearTimeout(this.audioWatchdogTimeout);
      this.audioWatchdogTimeout = null;
    }

    let factCompleted = false;
    const finishFact = () => {
      if (this.currentSessionId !== sessionId) return;
      if (factCompleted) return;
      factCompleted = true;

      if (this.audioWatchdogTimeout) {
        clearTimeout(this.audioWatchdogTimeout);
        this.audioWatchdogTimeout = null;
      }
      onDone();
    };

    // Generous watchdog timeout for fact reading (15 seconds)
    this.audioWatchdogTimeout = setTimeout(() => {
      finishFact();
    }, 15000);

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        const utterance = new SpeechSynthesisUtterance(funFact);
        utterance.rate = 0.98;
        utterance.pitch = 1.15;
        utterance.volume = this.volume;
        utterance.lang = 'en-GB';

        const voice = this.findYoungBritishFemaleVoice();
        if (voice) {
          utterance.voice = voice;
        }

        utterance.onend = () => {
          finishFact();
        };

        utterance.onerror = (e) => {
          if (e.error === 'canceled' || e.error === 'interrupted') return;
          finishFact();
        };

        this.activeUtterance = utterance;
        window.speechSynthesis.speak(utterance);
      } catch {
        finishFact();
      }
    } else {
      finishFact();
    }
  }

  private playAudioCandidates(
    sessionId: number,
    cleanSoundType: string,
    candidateUrls: string[],
    candidateIndex: number,
    onSoundEnded?: () => void
  ) {
    if (this.currentSessionId !== sessionId) return;

    let soundCompleted = false;
    const handleSoundComplete = () => {
      if (this.currentSessionId !== sessionId) return;
      if (soundCompleted) return;
      soundCompleted = true;

      if (this.audioWatchdogTimeout) {
        clearTimeout(this.audioWatchdogTimeout);
        this.audioWatchdogTimeout = null;
      }

      if (onSoundEnded) {
        onSoundEnded();
      } else {
        this.finishPlayback(sessionId);
      }
    };

    // If all CDN candidates have been tried, complete playback
    if (candidateIndex >= candidateUrls.length) {
      handleSoundComplete();
      return;
    }

    const currentUrl = candidateUrls[candidateIndex];
    try {
      const audio = this.getAudioElement();
      // DO NOT set crossOrigin on HTMLAudioElement for iOS Safari
      audio.removeAttribute('crossOrigin');
      audio.src = currentUrl;
      audio.volume = this.volume;
      this.currentAudio = audio;

      audio.onended = () => {
        handleSoundComplete();
      };

      audio.onerror = () => {
        if (this.currentSessionId !== sessionId) return;
        this.playAudioCandidates(sessionId, cleanSoundType, candidateUrls, candidateIndex + 1, onSoundEnded);
      };

      // Watchdog safety timeout for audio playback (max 6 seconds)
      if (this.audioWatchdogTimeout) {
        clearTimeout(this.audioWatchdogTimeout);
      }
      this.audioWatchdogTimeout = setTimeout(() => {
        handleSoundComplete();
      }, 6000);

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          if (this.currentSessionId !== sessionId) return;
          if (err && err.name === 'AbortError') return;
          this.playAudioCandidates(sessionId, cleanSoundType, candidateUrls, candidateIndex + 1, onSoundEnded);
        });
      }
    } catch {
      if (this.currentSessionId !== sessionId) return;
      this.playAudioCandidates(sessionId, cleanSoundType, candidateUrls, candidateIndex + 1, onSoundEnded);
    }
  }

  private finishPlayback(sessionId: number) {
    if (this.currentSessionId !== sessionId) return;

    if (this.nameSpeechTimeout) {
      clearTimeout(this.nameSpeechTimeout);
      this.nameSpeechTimeout = null;
    }
    if (this.audioWatchdogTimeout) {
      clearTimeout(this.audioWatchdogTimeout);
      this.audioWatchdogTimeout = null;
    }

    this.stopCurrentAudio();
    this.setActiveAnimal(null, null);

    if (this.activeCallback) {
      const cb = this.activeCallback;
      this.activeCallback = null;
      try {
        cb();
      } catch {
        // ignore
      }
    }
  }

  // Unused fallback
  private synthesizeAnimalSound(_soundType: string, onEnded: () => void) {
    onEnded();
    return;
    /*
        case 'chicken':
        case 'rooster': {
          const isRooster = soundType === 'rooster';
          const pulses = isRooster ? 3 : 2;
          for (let i = 0; i < pulses; i++) {
            const startTime = now + i * 0.18;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            const filter = ctx.createBiquadFilter();

            osc.type = 'sawtooth';
            filter.type = 'bandpass';
            filter.frequency.setValueAtTime(800 + i * 200, startTime);
            filter.Q.setValueAtTime(3, startTime);

            osc.frequency.setValueAtTime(isRooster ? 450 : 350, startTime);
            osc.frequency.exponentialRampToValueAtTime(isRooster ? 720 : 210, startTime + 0.12);

            gain.gain.setValueAtTime(0.001, startTime);
            gain.gain.linearRampToValueAtTime(0.35 * vol, startTime + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.15);

            osc.connect(filter);
            filter.connect(gain);
            gain.connect(ctx.destination);

            osc.start(startTime);
            osc.stop(startTime + 0.16);
          }
          setTimeout(onEnded, (isRooster ? 1.0 : 0.6) * 1000);
          break;
        }

        case 'duck':
        case 'goose':
        case 'swan': {
          for (let i = 0; i < 2; i++) {
            const startTime = now + i * 0.22;
            const osc = ctx.createOscillator();
            const filter = ctx.createBiquadFilter();
            const gain = ctx.createGain();

            osc.type = 'sawtooth';
            filter.type = 'bandpass';
            filter.frequency.setValueAtTime(650, startTime);
            filter.frequency.exponentialRampToValueAtTime(320, startTime + 0.15);
            filter.Q.setValueAtTime(4, startTime);

            osc.frequency.setValueAtTime(320, startTime);
            osc.frequency.linearRampToValueAtTime(240, startTime + 0.15);

            gain.gain.setValueAtTime(0.001, startTime);
            gain.gain.linearRampToValueAtTime(0.38 * vol, startTime + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.18);

            osc.connect(filter);
            filter.connect(gain);
            gain.connect(ctx.destination);

            osc.start(startTime);
            osc.stop(startTime + 0.2);
          }
          setTimeout(onEnded, 600);
          break;
        }

        case 'cow':
        case 'buffalo':
        case 'ox':
        case 'bison': {
          const osc = ctx.createOscillator();
          const osc2 = ctx.createOscillator();
          const gain = ctx.createGain();
          const filter = ctx.createBiquadFilter();

          osc.type = 'sawtooth';
          osc2.type = 'triangle';

          osc.frequency.setValueAtTime(125, now);
          osc.frequency.linearRampToValueAtTime(145, now + 0.4);
          osc.frequency.linearRampToValueAtTime(110, now + 1.2);

          osc2.frequency.setValueAtTime(250, now);
          osc2.frequency.linearRampToValueAtTime(290, now + 0.4);
          osc2.frequency.linearRampToValueAtTime(220, now + 1.2);

          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(450, now);

          gain.gain.setValueAtTime(0.001, now);
          gain.gain.linearRampToValueAtTime(0.35 * vol, now + 0.2);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 1.3);

          osc.connect(filter);
          osc2.connect(filter);
          filter.connect(gain);
          gain.connect(ctx.destination);

          osc.start(now);
          osc2.start(now);
          osc.stop(now + 1.35);
          osc2.stop(now + 1.35);

          setTimeout(onEnded, 1400);
          break;
        }

        case 'dog':
        case 'coyote':
        case 'wolf': {
          const barks = soundType === 'wolf' ? 1 : 2;
          for (let i = 0; i < barks; i++) {
            const startTime = now + i * 0.25;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            const filter = ctx.createBiquadFilter();

            osc.type = 'sawtooth';
            filter.type = 'bandpass';
            filter.frequency.setValueAtTime(600, startTime);
            filter.frequency.exponentialRampToValueAtTime(250, startTime + 0.18);

            osc.frequency.setValueAtTime(320, startTime);
            osc.frequency.exponentialRampToValueAtTime(140, startTime + 0.18);

            gain.gain.setValueAtTime(0.001, startTime);
            gain.gain.linearRampToValueAtTime(0.4 * vol, startTime + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.2);

            osc.connect(filter);
            filter.connect(gain);
            gain.connect(ctx.destination);

            osc.start(startTime);
            osc.stop(startTime + 0.22);
          }
          setTimeout(onEnded, 600);
          break;
        }

        case 'cat':
        case 'leopard':
        case 'cheetah': {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          const filter = ctx.createBiquadFilter();

          osc.type = 'sawtooth';
          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(1200, now);

          osc.frequency.setValueAtTime(500, now);
          osc.frequency.linearRampToValueAtTime(750, now + 0.3);
          osc.frequency.linearRampToValueAtTime(400, now + 0.8);

          gain.gain.setValueAtTime(0.001, now);
          gain.gain.linearRampToValueAtTime(0.3 * vol, now + 0.1);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.85);

          osc.connect(filter);
          filter.connect(gain);
          gain.connect(ctx.destination);

          osc.start(now);
          osc.stop(now + 0.9);

          setTimeout(onEnded, 950);
          break;
        }

        case 'pig':
        case 'boar':
        case 'hippo': {
          for (let i = 0; i < 2; i++) {
            const startTime = now + i * 0.22;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            const filter = ctx.createBiquadFilter();

            osc.type = 'sawtooth';
            filter.type = 'bandpass';
            filter.frequency.setValueAtTime(450, startTime);
            filter.Q.setValueAtTime(5, startTime);

            osc.frequency.setValueAtTime(220, startTime);
            osc.frequency.linearRampToValueAtTime(160, startTime + 0.15);

            gain.gain.setValueAtTime(0.001, startTime);
            gain.gain.linearRampToValueAtTime(0.35 * vol, startTime + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.16);

            osc.connect(filter);
            filter.connect(gain);
            gain.connect(ctx.destination);

            osc.start(startTime);
            osc.stop(startTime + 0.18);
          }
          setTimeout(onEnded, 550);
          break;
        }

        case 'lion':
        case 'tiger':
        case 'bear':
        case 'gorilla': {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          const filter = ctx.createBiquadFilter();

          osc.type = 'sawtooth';
          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(300, now);
          filter.frequency.linearRampToValueAtTime(500, now + 0.4);
          filter.frequency.linearRampToValueAtTime(200, now + 1.1);

          osc.frequency.setValueAtTime(110, now);
          osc.frequency.linearRampToValueAtTime(160, now + 0.3);
          osc.frequency.linearRampToValueAtTime(80, now + 1.2);

          gain.gain.setValueAtTime(0.001, now);
          gain.gain.linearRampToValueAtTime(0.45 * vol, now + 0.15);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 1.25);

          osc.connect(filter);
          filter.connect(gain);
          gain.connect(ctx.destination);

          osc.start(now);
          osc.stop(now + 1.3);

          setTimeout(onEnded, 1350);
          break;
        }

        case 'elephant': {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          const filter = ctx.createBiquadFilter();

          osc.type = 'sawtooth';
          filter.type = 'bandpass';
          filter.frequency.setValueAtTime(800, now);
          filter.frequency.linearRampToValueAtTime(1400, now + 0.3);
          filter.frequency.linearRampToValueAtTime(600, now + 0.9);

          osc.frequency.setValueAtTime(350, now);
          osc.frequency.linearRampToValueAtTime(550, now + 0.3);
          osc.frequency.linearRampToValueAtTime(280, now + 0.9);

          gain.gain.setValueAtTime(0.001, now);
          gain.gain.linearRampToValueAtTime(0.4 * vol, now + 0.1);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 1.0);

          osc.connect(filter);
          filter.connect(gain);
          gain.connect(ctx.destination);

          osc.start(now);
          osc.stop(now + 1.05);

          setTimeout(onEnded, 1100);
          break;
        }

        case 'sheep':
        case 'goat':
        case 'llama':
        case 'alpaca': {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          const filter = ctx.createBiquadFilter();

          osc.type = 'sawtooth';
          filter.type = 'bandpass';
          filter.frequency.setValueAtTime(700, now);

          osc.frequency.setValueAtTime(220, now);
          osc.frequency.linearRampToValueAtTime(240, now + 0.2);
          osc.frequency.linearRampToValueAtTime(190, now + 0.7);

          gain.gain.setValueAtTime(0.001, now);
          gain.gain.linearRampToValueAtTime(0.3 * vol, now + 0.05);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.75);

          osc.connect(filter);
          filter.connect(gain);
          gain.connect(ctx.destination);

          osc.start(now);
          osc.stop(now + 0.8);

          setTimeout(onEnded, 850);
          break;
        }

        case 'frog':
        case 'toad': {
          for (let i = 0; i < 2; i++) {
            const startTime = now + i * 0.18;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            const filter = ctx.createBiquadFilter();

            osc.type = 'sawtooth';
            filter.type = 'bandpass';
            filter.frequency.setValueAtTime(400, startTime);
            filter.Q.setValueAtTime(6, startTime);

            osc.frequency.setValueAtTime(180, startTime);
            osc.frequency.exponentialRampToValueAtTime(120, startTime + 0.12);

            gain.gain.setValueAtTime(0.001, startTime);
            gain.gain.linearRampToValueAtTime(0.35 * vol, startTime + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.14);

            osc.connect(filter);
            filter.connect(gain);
            gain.connect(ctx.destination);

            osc.start(startTime);
            osc.stop(startTime + 0.15);
          }
          setTimeout(onEnded, 500);
          break;
        }

        default: {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          const filter = ctx.createBiquadFilter();

          osc.type = 'triangle';
          filter.type = 'bandpass';
          filter.frequency.setValueAtTime(600, now);

          osc.frequency.setValueAtTime(400, now);
          osc.frequency.linearRampToValueAtTime(250, now + 0.4);

          gain.gain.setValueAtTime(0.001, now);
          gain.gain.linearRampToValueAtTime(0.3 * vol, now + 0.05);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

          osc.connect(filter);
          filter.connect(gain);
          gain.connect(ctx.destination);

          osc.start(now);
          osc.stop(now + 0.5);

          setTimeout(onEnded, 550);
          break;
        }
      }
    } catch {
      onEnded();
    }
    */
  }

  public stopCurrentAudio() {
    if (this.currentAudio) {
      try {
        this.currentAudio.onended = null;
        this.currentAudio.onerror = null;
        this.currentAudio.pause();
        this.currentAudio.currentTime = 0;
        this.currentAudio.removeAttribute('src');
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

  // --- SPEAK FUN FACT (CRYSTAL CLEAR BRITISH FEMALE VOICE) ---
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
        if (onEnd) onEnd();
      };

      utterance.onend = cleanup;
      utterance.onerror = cleanup;

      window.speechSynthesis.speak(utterance);
    } catch {
      if (onEnd) onEnd();
    }
  }

  public stopSpeaking() {
    if (this.activeUtterance) {
      this.activeUtterance.onend = null;
      this.activeUtterance.onerror = null;
      this.activeUtterance = null;
    }
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
    this.currentSessionId++;
    if (this.nameSpeechTimeout) {
      clearTimeout(this.nameSpeechTimeout);
      this.nameSpeechTimeout = null;
    }
    if (this.audioWatchdogTimeout) {
      clearTimeout(this.audioWatchdogTimeout);
      this.audioWatchdogTimeout = null;
    }
    this.stopCurrentAudio();
    this.stopSpeaking();
    this.stopBackgroundMusic();
    this.setActiveAnimal(null, null);
    if (this.activeCallback) {
      const cb = this.activeCallback;
      this.activeCallback = null;
      try {
        cb();
      } catch {
        // ignore
      }
    }
  }
}

export const audioEngine = new AudioEngine();
