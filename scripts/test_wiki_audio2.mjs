const query = 'Lion filetype:audio';
const searchRes = await fetch(`https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&srnamespace=6&format=json`);
const searchData = await searchRes.json();
const first = searchData.query.search[0];
if (first) {
  const title = first.title;
  const res = await fetch(`https://commons.wikimedia.org/w/api.php?action=query&titles=${encodeURIComponent(title)}&prop=imageinfo&iiprop=url&format=json`);
  const data = await res.json();
  const pages = data.query.pages;
  const url = pages[Object.keys(pages)[0]].imageinfo[0].url;
  console.log('Found URL:', url);
} else {
  console.log('Not found');
}
