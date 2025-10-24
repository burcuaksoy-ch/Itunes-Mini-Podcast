const qEl = document.getElementById('q');
const cEl = document.getElementById('country');
const lEl = document.getElementById('limit');
const btn = document.getElementById('btn');
const list = document.getElementById('list');
const statusEl = document.getElementById('status');


async function search() {
  const q = qEl.value.trim();
  const country = cEl.value;
  const limit = +lEl.value;

   if (!qEl.value){
        Swal.fire({
        title: 'Ooops!',
        text: 'Input field must be fill.',
        icon: 'success',
        confirmButtonText: 'Cool'
      });
    }

  btn.disabled = true;
  statusEl.hidden = false;
  statusEl.textContent = 'Searching…';
  list.hidden = true;
  list.innerHTML = '';

  try {
    const url = new URL('https://itunes.apple.com/search');
    url.searchParams.set('term', q);
    url.searchParams.set('media', 'podcast');
    url.searchParams.set('entity', 'podcast');
    url.searchParams.set('country', country);
    url.searchParams.set('limit', String(limit));

    const res = await fetch(url.toString());
    if (!res.ok) throw new Error('Network error: ' + res.status);
    const data = await res.json();

    if (!data.results?.length) {
      statusEl.innerHTML = 'No results. Try a different keyword or country.';
      list.hidden = true;
      statusEl.hidden = false;
      return;
    }

    const frag = document.createDocumentFragment();
    data.results.forEach((p) => {
      const card = document.createElement('article');
      card.className = 'card';

      const img = document.createElement('img');
      img.className = 'thumb';
      img.alt = p.collectionName || 'Podcast cover';
      img.src = p.artworkUrl600 || p.artworkUrl100 || '';
      card.appendChild(img);

      const meta = document.createElement('div');
      meta.className = 'meta';

      const title = document.createElement('div');
      title.className = 'title';
      title.textContent = p.collectionName;
      meta.appendChild(title);

      const author = document.createElement('div');
      author.className = 'author';
      author.textContent = p.artistName;
      meta.appendChild(author);

      const tags = document.createElement('div');
      tags.className = 'tags';
      const tag1 = document.createElement('span');
      tag1.className = 'tag';
      tag1.textContent = p.primaryGenreName || 'Podcast';
      const tag2 = document.createElement('span');
      tag2.className = 'tag';
      tag2.textContent = (p.country || cEl.value).toUpperCase();
      tags.appendChild(tag1);
      tags.appendChild(tag2);
      meta.appendChild(tags);

      const links = document.createElement('div');
      links.className = 'links';

      const a1 = document.createElement('a');
      a1.href = p.collectionViewUrl;
      a1.target = '_blank';
      a1.rel = 'noreferrer';
      a1.textContent = 'Open in Apple Podcasts';
      links.appendChild(a1);

      meta.appendChild(links);
      card.appendChild(meta);
      frag.appendChild(card);
    });

    list.innerHTML = '';
    list.appendChild(frag);
    list.hidden = false;
    statusEl.hidden = true;
  } catch (err) {
    console.error(err);
    statusEl.className = 'error';
    statusEl.textContent = 'Something went wrong. Try again.';
    list.hidden = true;
    statusEl.hidden = false;
  } finally {
    btn.disabled = false;
  }
}

btn.addEventListener('click', search);
qEl.addEventListener('keydown', (e) => { if (e.key === 'Enter') search(); });

