import fs from 'fs';
import path from 'path';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const ANIMAL_PAGES = [
  { id: 'cow', wiki: 'Holstein_Friesian_cattle' },
  { id: 'pig', wiki: 'Domestic_pig' },
  { id: 'sheep', wiki: 'Sheep' },
  { id: 'horse', wiki: 'Horse' },
  { id: 'duck', wiki: 'Mallard' },
  { id: 'chicken', wiki: 'Chicken' },
  { id: 'dog', wiki: 'Golden_Retriever' },
  { id: 'cat', wiki: 'Tabby_cat' },
  { id: 'frog', wiki: 'Agalychnis_callidryas' }, // Red-eyed tree frog
  { id: 'lion', wiki: 'Lion' },
  { id: 'tiger', wiki: 'Tiger' },
  { id: 'elephant', wiki: 'African_bush_elephant' },
  { id: 'giraffe', wiki: 'Giraffe' },
  { id: 'cheetah', wiki: 'Cheetah' },
  { id: 'hippo', wiki: 'Hippopotamus' },
  { id: 'chimp', wiki: 'Chimpanzee' },
  { id: 'zebra', wiki: 'Plains_zebra' },
  { id: 'bear', wiki: 'Brown_bear' },
  { id: 'wolf', wiki: 'Wolf' },
  { id: 'dolphin', wiki: 'Common_bottlenose_dolphin' },
  { id: 'blue-whale', wiki: 'Blue_whale' },
  { id: 'clownfish', wiki: 'Amphiprion_ocellaris' },
  { id: 'sea-turtle', wiki: 'Green_sea_turtle' },
  { id: 'shark', wiki: 'Great_white_shark' },
  { id: 'octopus', wiki: 'Common_octopus' },
  { id: 'sea-otter', wiki: 'Sea_otter' },
  { id: 'jellyfish', wiki: 'Chrysaora_fuscescens' }, // Pacific sea nettle
  { id: 'toucan', wiki: 'Toco_toucan' },
  { id: 'macaw', wiki: 'Scarlet_macaw' },
  { id: 'flamingo', wiki: 'American_flamingo' },
  { id: 'owl', wiki: 'Great_horned_owl' },
  { id: 'eagle', wiki: 'Bald_eagle' },
  { id: 'puffin', wiki: 'Atlantic_puffin' },
];

const targetDir = path.resolve('public/assets/animals');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

async function fetchWikiImage(pageTitle) {
  const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(pageTitle)}`;
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'AnimalSoundApp/1.0 (https://github.com/example/animalsoundapp; info@animalsoundapp.org) node-fetch/3.0',
    },
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch wiki summary for ${pageTitle}: ${res.status}`);
  }
  const data = await res.json();
  const imageUrl = data.originalimage?.source || data.thumbnail?.source;
  if (!imageUrl) {
    throw new Error(`No image found in wiki summary for ${pageTitle}`);
  }
  return { imageUrl, title: data.title, desc: data.description };
}

async function downloadFile(url, destPath) {
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'AnimalSoundApp/1.0 (https://github.com/example/animalsoundapp; info@animalsoundapp.org) node-fetch/3.0',
    },
  });
  if (!res.ok) {
    throw new Error(`Failed to download ${url}: ${res.status}`);
  }
  const arrayBuffer = await res.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  // Check that it is a real image (starts with standard JPEG/PNG bytes)
  const isJpeg = buffer[0] === 0xff && buffer[1] === 0xd8;
  const isPng = buffer[0] === 0x89 && buffer[1] === 0x50;
  const isWebp = buffer.slice(8, 12).toString('ascii') === 'WEBP';
  if (!isJpeg && !isPng && !isWebp) {
    throw new Error(`Downloaded content is not a valid image. First bytes: ${buffer.slice(0, 20).toString()}`);
  }
  fs.writeFileSync(destPath, buffer);
  return buffer.length;
}

async function run() {
  console.log(`Checking and downloading verified wildlife photographs for ${ANIMAL_PAGES.length} animals...`);
  for (const item of ANIMAL_PAGES) {
    const destFile = path.join(targetDir, `${item.id}.jpg`);
    if (fs.existsSync(destFile) && fs.statSync(destFile).size > 10000) {
      console.log(`[ALREADY EXISTS] ${item.id} (${fs.statSync(destFile).size} bytes)`);
      continue;
    }
    try {
      await sleep(1500); // 1.5s delay to be polite and avoid 429
      const { imageUrl, title } = await fetchWikiImage(item.wiki);
      await sleep(1000);
      const bytes = await downloadFile(imageUrl, destFile);
      console.log(`[OK] ${item.id} (${title}) -> ${bytes} bytes from ${imageUrl}`);
    } catch (err) {
      console.error(`[ERROR] ${item.id}:`, err.message);
    }
  }
  console.log('All downloads process finished.');
}

run();
