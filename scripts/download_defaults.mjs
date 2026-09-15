import fs from 'fs';
import path from 'path';

const targetDir = path.resolve('public/assets/sounds');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

const fallbacks = [
  { name: 'bee', query: 'bee buzzing filetype:audio' },
  { name: 'dolphin', query: 'dolphin filetype:audio' },
  { name: 'snake', query: 'snake hiss filetype:audio' }
];

async function run() {
  for (const f of fallbacks) {
    if (fs.existsSync(path.join(targetDir, f.name + '.ogg')) && fs.statSync(path.join(targetDir, f.name + '.ogg')).size > 1000) continue;

    const searchUrl = "https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch=" + encodeURIComponent(f.query) + "&srnamespace=6&format=json";
    const searchRes = await fetch(searchUrl, {
      headers: { 'User-Agent': 'AnimalSoundApp/1.0 (info@animalsoundapp.org)' }
    });
    const searchData = await searchRes.json();
    const searchResults = searchData?.query?.search || [];
    
    let bestTitle = null;
    for (const res of searchResults) {
      if (res.title.toLowerCase().endsWith('.ogg') || res.title.toLowerCase().endsWith('.mp3')) {
        bestTitle = res.title;
        break;
      }
    }

    if (bestTitle) {
      const res = await fetch("https://commons.wikimedia.org/w/api.php?action=query&titles=" + encodeURIComponent(bestTitle) + "&prop=imageinfo&iiprop=url&format=json", {
        headers: { 'User-Agent': 'AnimalSoundApp/1.0 (info@animalsoundapp.org)' }
      });
      const data = await res.json();
      const pages = data?.query?.pages;
      if (pages) {
        const url = pages[Object.keys(pages)[0]]?.imageinfo?.[0]?.url;
        if (url) {
          const dlRes = await fetch(url, { headers: { 'User-Agent': 'AnimalSoundApp/1.0' }});
          const arrayBuffer = await dlRes.arrayBuffer();
          fs.writeFileSync(path.join(targetDir, f.name + '.ogg'), Buffer.from(arrayBuffer));
          console.log('Downloaded fallback:', f.name);
        }
      }
    }
  }
}
run();
