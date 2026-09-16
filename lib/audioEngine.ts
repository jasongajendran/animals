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
    // Lazy initialized on first user interaction
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

    const candidateUrls: string[] = [
      `${CDN_BASE_URL}${filename}`,
      `${RAW_BASE_URL}${filename}`,
    ];

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
    const candidateUrls: string[] = [
      `${CDN_BASE_URL}${filename}`,
      `${RAW_BASE_URL}${filename}`,
    ];

    let audioTriggered = false;
    const triggerAudio = () => {
      if (this.currentSessionId !== sessionId) return;
      if (audioTriggered) return;
      audioTriggered = true;

      if (this.nameSpeechTimeout) {
        clearTimeout(this.nameSpeechTimeout);
        this.nameSpeechTimeout = null;
      }
      this.playAudioCandidates(sessionId, cleanSoundType, candidateUrls, 0);
    };

    // Safety timeout: proceed to sound if speech takes > 1.2s or hangs
    this.nameSpeechTimeout = setTimeout(triggerAudio, 1200);

    if ('speechSynthesis' in window) {
      try {
        const utterance = new SpeechSynthesisUtterance(animalName);
        utterance.rate = 1.1;
        utterance.pitch = 1.18;
        utterance.volume = this.volume;
        utterance.lang = 'en-GB';

        const voice = this.findYoungBritishFemaleVoice();
        if (voice) {
          utterance.voice = voice;
        }

        utterance.onend = () => {
          if (this.currentSessionId !== sessionId) return;
          triggerAudio();
        };

        utterance.onerror = (e) => {
          if (this.currentSessionId !== sessionId) return;
          // If cancelled due to an animal switch, do NOT trigger old audio
          if (e.error === 'canceled' || e.error === 'interrupted') return;
          triggerAudio();
        };

        this.activeUtterance = utterance;
        window.speechSynthesis.speak(utterance);
      } catch {
        triggerAudio();
      }
    } else {
      triggerAudio();
    }
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
    const candidateUrls: string[] = [
      `${CDN_BASE_URL}${filename}`,
      `${RAW_BASE_URL}${filename}`,
    ];

    let audioTriggered = false;
    const triggerAudio = () => {
      if (this.currentSessionId !== sessionId) return;
      if (audioTriggered) return;
      audioTriggered = true;

      if (this.nameSpeechTimeout) {
        clearTimeout(this.nameSpeechTimeout);
        this.nameSpeechTimeout = null;
      }

      // Step 2: Play animal sound, then trigger Step 3: Speak fun fact
      this.playAudioCandidates(sessionId, cleanSoundType, candidateUrls, 0, () => {
        if (this.currentSessionId !== sessionId) return;
        this.speakFactNarration(sessionId, funFact, () => {
          this.finishPlayback(sessionId);
        });
      });
    };

    // Step 1: Speak animal name
    this.nameSpeechTimeout = setTimeout(triggerAudio, 1200);

    if ('speechSynthesis' in window) {
      try {
        const utterance = new SpeechSynthesisUtterance(animalName);
        utterance.rate = 1.05;
        utterance.pitch = 1.18;
        utterance.volume = this.volume;
        utterance.lang = 'en-GB';

        const voice = this.findYoungBritishFemaleVoice();
        if (voice) {
          utterance.voice = voice;
        }

        utterance.onend = () => {
          if (this.currentSessionId !== sessionId) return;
          triggerAudio();
        };

        utterance.onerror = (e) => {
          if (this.currentSessionId !== sessionId) return;
          if (e.error === 'canceled' || e.error === 'interrupted') return;
          triggerAudio();
        };

        this.activeUtterance = utterance;
        window.speechSynthesis.speak(utterance);
      } catch {
        triggerAudio();
      }
    } else {
      triggerAudio();
    }
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

    if (candidateIndex >= candidateUrls.length) {
      this.speakOnomatopoeia(cleanSoundType, handleSoundComplete);
      return;
    }

    const currentUrl = candidateUrls[candidateIndex];
    try {
      const audio = new Audio(currentUrl);
      audio.volume = this.volume;
      this.currentAudio = audio;

      audio.onended = () => {
        handleSoundComplete();
      };

      audio.onerror = () => {
        if (this.currentSessionId !== sessionId) return;
        if (soundCompleted) return;
        soundCompleted = true;
        if (this.audioWatchdogTimeout) {
          clearTimeout(this.audioWatchdogTimeout);
          this.audioWatchdogTimeout = null;
        }
        this.playAudioCandidates(sessionId, cleanSoundType, candidateUrls, candidateIndex + 1, onSoundEnded);
      };

      // Watchdog safety timeout for audio playback (max 5 seconds)
      if (this.audioWatchdogTimeout) {
        clearTimeout(this.audioWatchdogTimeout);
      }
      this.audioWatchdogTimeout = setTimeout(() => {
        handleSoundComplete();
      }, 5000);

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          if (this.currentSessionId !== sessionId) return;
          if (err && err.name === 'AbortError') return;
          if (soundCompleted) return;
          soundCompleted = true;
          if (this.audioWatchdogTimeout) {
            clearTimeout(this.audioWatchdogTimeout);
            this.audioWatchdogTimeout = null;
          }
          this.playAudioCandidates(sessionId, cleanSoundType, candidateUrls, candidateIndex + 1, onSoundEnded);
        });
      }
    } catch {
      if (this.currentSessionId !== sessionId) return;
      if (soundCompleted) return;
      soundCompleted = true;
      if (this.audioWatchdogTimeout) {
        clearTimeout(this.audioWatchdogTimeout);
        this.audioWatchdogTimeout = null;
      }
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

  // --- BRITISH FEMALE ONOMATOPOEIA FALLBACK ---
  private speakOnomatopoeia(soundType: string, onEnded?: () => void) {
    const soundSounds: Record<string, string> = {
      cow: 'Moo!',
      horse: 'Neigh!',
      donkey: 'Hee-haw!',
      sheep: 'Baa!',
      goat: 'Maa!',
      pig: 'Oink oink!',
      dog: 'Woof woof!',
      cat: 'Meow!',
      duck: 'Quack quack!',
      rooster: 'Cock-a-doodle-doo!',
      lion: 'Roar!',
      tiger: 'Roar!',
      elephant: 'Trumpet call!',
      wolf: 'Awoo!',
      frog: 'Ribbit ribbit!',
      bee: 'Buzzz!',
      owl: 'Hoot hoot!',
      snake: 'Hisssss!'
    };

    const text = soundSounds[soundType] || `${soundType} sound!`;
    this.speakText(text, 1.0, 1.25, onEnded);
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
