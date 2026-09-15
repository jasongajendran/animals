import fs from 'fs';

const audioFilePath = 'lib/audioEngine.ts';
let code = fs.readFileSync(audioFilePath, 'utf8');

const playAnimalSoundRegex = /public playAnimalSound\([\s\S]*?public stopCurrentAudio/m;
const newPlayAnimalSound = `public playAnimalSound(soundType: string, onEnded?: () => void) {
    if (this.isMuted) {
      if (onEnded) onEnded();
      return;
    }

    this.stopSpeaking();
    this.stopCurrentAudio();

    // Map unknown soundTypes to generic categories or default silent if not found
    let audioUrl = '/assets/sounds/' + soundType.toLowerCase() + '.ogg';

    if (typeof window !== 'undefined') {
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
          // Fallback to a generic sound based on category
          const birds = ['canary', 'parrot', 'toucan', 'macaw', 'flamingo', 'stork', 'pelican', 'peacock', 'swan', 'puffin', 'eagle', 'owl', 'ostrich', 'emu', 'kiwi', 'woodpecker', 'hummingbird', 'pigeon', 'crow', 'raven', 'dove', 'seagull', 'vulture', 'falcon', 'hawk', 'turkey'];
          const bugs = ['butterfly', 'bee', 'ladybug', 'ant', 'spider', 'scorpion', 'mosquito', 'fly', 'beetle', 'cockroach', 'cricket', 'caterpillar', 'snail', 'worm'];
          const sea = ['dolphin', 'whale', 'orca', 'beluga', 'walrus', 'seal', 'penguin', 'manatee', 'crab', 'lobster', 'shrimp', 'squid', 'stingray', 'seahorse', 'starfish', 'coral', 'blowfish'];
          const reptiles = ['snake', 'turtle', 'lizard', 'iguana', 'chameleon', 'crocodile', 'alligator'];

          let fallbackUrl = '/assets/sounds/cow.ogg'; // general fallback
          if (birds.includes(soundType)) fallbackUrl = '/assets/sounds/duck.ogg';
          else if (bugs.includes(soundType)) fallbackUrl = '/assets/sounds/bee.ogg';
          else if (sea.includes(soundType)) fallbackUrl = '/assets/sounds/dolphin.ogg';
          else if (reptiles.includes(soundType)) fallbackUrl = '/assets/sounds/snake.ogg';

          const fbAudio = new Audio(fallbackUrl);
          fbAudio.volume = this.volume;
          this.currentAudio = fbAudio;
          fbAudio.onended = () => { this.currentAudio = null; if (onEnded) onEnded(); };
          fbAudio.onerror = () => { this.currentAudio = null; if (onEnded) onEnded(); };
          
          const playPromise = fbAudio.play();
          if (playPromise !== undefined) {
            playPromise.catch(() => { if (onEnded) onEnded(); });
          }
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

  public stopCurrentAudio`;

code = code.replace(playAnimalSoundRegex, newPlayAnimalSound);
fs.writeFileSync(audioFilePath, code);
