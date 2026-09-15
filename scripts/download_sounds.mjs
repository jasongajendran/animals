import fs from 'fs';
import path from 'path';

const animals = [
  'cow', 'pig', 'sheep', 'horse', 'duck', 'chicken', 'rooster', 'dog', 'cat', 'frog',
  'lion', 'tiger', 'elephant', 'giraffe', 'cheetah', 'hippo', 'monkey', 'chimpanzee',
  'zebra', 'bear', 'wolf', 'dolphin', 'whale', 'clownfish', 'turtle', 'shark', 'octopus',
  'otter', 'jellyfish', 'toucan', 'macaw', 'flamingo', 'owl', 'eagle', 'puffin',
  'goat', 'donkey', 'llama', 'alpaca', 'goose', 'buffalo', 'ox', 'camel', 'gorilla',
  'rhino', 'koala', 'panda', 'sloth', 'leopard', 'hyena', 'fox', 'raccoon', 'moose',
  'deer', 'reindeer', 'boar', 'bison', 'wolverine', 'orca', 'beluga', 'penguin',
  'crow', 'raven', 'fly', 'bee', 'mosquito', 'cricket', 'snake', 'bat'
];

const targetDir = path.resolve('public/assets/sounds');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

async function fetchWikiAudioUrl(query) {
  const searchUrl = "https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch=" + encodeURIComponent(query) + "&srnamespace=6&format=json";
  const searchRes = await fetch(searchUrl, {
    headers: { 'User-Agent': 'AnimalSoundApp/1.0 (info@animalsoundapp.org)' }
  });
  const searchData = await searchRes.json();
  const searchResults = searchData?.query?.search || [];
  
  let bestTitle = null;
  for (const res of searchResults) {
    if (res.title.toLowerCase().endsWith('.ogg') || res.title.toLowerCase().endsWith('.mp3') || res.title.toLowerCase().endsWith('.wav')) {
      bestTitle = res.title;
      break;
    }
  }

  if (!bestTitle) return null;

  const res = await fetch("https://commons.wikimedia.org/w/api.php?action=query&titles=" + encodeURIComponent(bestTitle) + "&prop=imageinfo&iiprop=url&format=json", {
    headers: { 'User-Agent': 'AnimalSoundApp/1.0 (info@animalsoundapp.org)' }
  });
  const data = await res.json();
  const pages = data?.query?.pages;
  if (!pages) return null;
  const url = pages[Object.keys(pages)[0]]?.imageinfo?.[0]?.url;
  return url;
}

async function downloadFile(url, destPath) {
  const res = await fetch(url, {
    headers: { 'User-Agent': 'AnimalSoundApp/1.0 (info@animalsoundapp.org)' }
  });
  if (!res.ok) throw new Error("Failed to download");
  const arrayBuffer = await res.arrayBuffer();
  fs.writeFileSync(destPath, Buffer.from(arrayBuffer));
}

async function run() {
  for (const animal of animals) {
    const destFile = path.join(targetDir, animal + ".ogg");
    if (!fs.existsSync(destFile) || fs.statSync(destFile).size < 1000) {
      const queries = [
        animal + " sound filetype:audio",
        animal + " filetype:audio"
      ];
      
      let url = null;
      for (const query of queries) {
        url = await fetchWikiAudioUrl(query);
        if (url) break;
      }
      
      if (url) {
        try {
          console.log("[" + animal + "] Downloading...");
          await downloadFile(url, destFile);
        } catch (e) {
          console.error("[" + animal + "] Download failed.");
        }
      } else {
        console.log("[" + animal + "] No audio found");
      }
      
      // Delay so we don't get 429
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }
  console.log("Audio download finished.");
}

run();
