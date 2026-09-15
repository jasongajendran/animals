import fs from 'fs';

const audioFilePath = 'lib/audioEngine.ts';
let code = fs.readFileSync(audioFilePath, 'utf8');

// I am rewriting ANIMAL_AUDIO_MAP to use the downloaded /assets/sounds/*.ogg
// We'll update the playAnimalSound logic to fallback properly too.

const playAnimalSoundRegex = /public playAnimalSound\([\s\S]*?public stopCurrentAudio/m;
const newPlayAnimalSound = `public playAnimalSound(soundType: string, onEnded?: () => void) {
    if (this.isMuted) {
      if (onEnded) onEnded();
      return;
    }

    this.stopSpeaking();
    this.stopCurrentAudio();

    // Try to find the local audio file first
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
fs.writeFileSync(audioFilePath, code);
