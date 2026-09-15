import fs from 'fs';

const audioFilePath = 'lib/audioEngine.ts';
let code = fs.readFileSync(audioFilePath, 'utf8');

// 1. Remove ANIMAL_VOICE_SOUNDS
code = code.replace(/const ANIMAL_VOICE_SOUNDS: Record<string, string> = \{[\s\S]*?\};\n\n/, '');

// 2. Remove speakAnimalVocalization method
code = code.replace(/  private speakAnimalVocalization\([\s\S]*?\}\n/, '');

// 3. Update playAnimalSound to not use fallback
const playAnimalSoundRegex = /public playAnimalSound\([\s\S]*?public stopCurrentAudio/m;
const newPlayAnimalSound = `public playAnimalSound(soundType: string, onEnded?: () => void) {
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

  public stopCurrentAudio`;

code = code.replace(playAnimalSoundRegex, newPlayAnimalSound);

// 4. Update the AUDIO_MAP with more generic specific ones. Let's add some missing ones.
const additionalAudio = `  goat: 'https://actions.google.com/sounds/v1/animals/sheep_bleat.ogg',
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
`;

code = code.replace(/const ANIMAL_AUDIO_MAP: Record<string, string> = \{/, `const ANIMAL_AUDIO_MAP: Record<string, string> = {\n${additionalAudio}`);

fs.writeFileSync(audioFilePath, code);
console.log('Successfully updated audioEngine.ts');
