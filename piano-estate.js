(function () {
  const container = document.getElementById('piano-estate-list');
  const ENDPOINT = 'https://sgd2awp.portaleargo.it/sgd2awp/all/SG17925';

  fetch(ENDPOINT)
    .then(r => {
      console.log('[Piano Estate] fetch status:', r.status);
      return r.json();
    })
    .then(data => {
      const items = data.items || [];
      console.log('[Piano Estate] avvisi totali nel feed:', items.length);

      const filtrati = items.filter(item => {
        const testo = ((item.titolo || '') + ' ' + (item.descrizione || ''));
        return /piano\s+estate/i.test(testo);
      });

      filtrati.sort((a, b) => (b.lastModifiedAt || 0) - (a.lastModifiedAt || 0));

      console.log('[Piano Estate] avvisi corrispondenti:', filtrati.length);

      container.innerHTML = '';

      if (filtrati.length === 0) {
        container.innerHTML = '<p>Nessun avviso Piano Estate al momento.</p>';
        return;
      }

      const ul = document.createElement('ul');
      ul.className = 'piano-estate-list';

      filtrati.forEach(item => {
        const li = document.createElement('li');
        li.className = 'piano-estate-item';

        const data = item.lastModifiedAt
          ? new Date(item.lastModifiedAt).toLocaleDateString('it-IT')
          : '';

        let filesHtml = '';
        if (Array.isArray(item.files) && item.files.length > 0) {
          filesHtml = '<ul class="piano-estate-files">' +
            item.files.map(f =>
              `<li><a href="${f.url}" target="_blank" rel="noopener">${f.filename}</a></li>`
            ).join('') +
            '</ul>';
        }

        li.innerHTML = `
          <div class="piano-estate-titolo">${item.titolo || item.descrizione}</div>
          <div class="piano-estate-data">${data}</div>
          ${filesHtml}
        `;

        ul.appendChild(li);
      });

      container.appendChild(ul);
    })
    .catch(err => {
      console.error('[Piano Estate] fetch fallito:', err);
      container.innerHTML = '<p>Impossibile caricare gli avvisi al momento.</p>';
    });
})();
