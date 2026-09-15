const title = 'Lion_roar.ogg';
const res = await fetch(`https://en.wikipedia.org/w/api.php?action=query&titles=File:${title}&prop=imageinfo&iiprop=url&format=json`);
const data = await res.json();
console.log(JSON.stringify(data, null, 2));
