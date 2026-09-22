(function () {
  const CONTAINER_ID = 'albo-sindacale-list';
  const NOME_CATEGORIA = 'albo sindacale';
  const ENDPOINT = 'https://sgd2awp.portaleargo.it/sgd2awp/all/SG17925';
  const LOG = '[Albo Sindacale]';

  const container = document.getElementById(CONTAINER_ID);
  if (!container) {
    console.error(LOG, 'contenitore #' + CONTAINER_ID + ' non trovato');
    return;
  }

  const MESI = ['GEN', 'FEB', 'MAR', 'APR', 'MAG', 'GIU', 'LUG', 'AGO', 'SET', 'OTT', 'NOV', 'DIC'];

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str || '';
    return div.innerHTML;
  }

  fetch(ENDPOINT)
    .then(r => {
      console.log(LOG, 'fetch status:', r.status);
      return r.json();
    })
    .then(data => {
      const items = data.items || [];
      const categorie = data.categorie || [];

      // Trova la chiave della categoria "Albo sindacale" dal suo nome
      const cat = categorie.find(c =>
        (c.descrizione || '').trim().toLowerCase() === NOME_CATEGORIA
      );

      container.innerHTML = '';

      if (!cat) {
        console.warn(LOG, 'categoria non trovata nel feed. Categorie disponibili:',
          categorie.map(c => c.descrizione));
        container.innerHTML = '<p>Nessun avviso in Albo Sindacale al momento.</p>';
        return;
      }

      const filtrati = items
        .filter(item => Array.isArray(item.categorie) && item.categorie.includes(cat.key))
        .sort((a, b) => (b.lastModifiedAt || 0) - (a.lastModifiedAt || 0));

      console.log(LOG, 'avvisi totali:', items.length, '- in Albo sindacale:', filtrati.length);

      if (filtrati.length === 0) {
        container.innerHTML = '<p>Nessun avviso in Albo Sindacale al momento.</p>';
        return;
      }

      filtrati.forEach(item => {
        const d = item.lastModifiedAt ? new Date(item.lastModifiedAt) : null;
        const anno = d ? d.getFullYear() : '';
        const giorno = d ? String(d.getDate()).padStart(2, '0') : '';
        const mese = d ? MESI[d.getMonth()] : '';

        const nDocumenti = Array.isArray(item.files) ? item.files.length : 0;

        let filesHtml = '';
        if (nDocumenti > 0) {
          filesHtml = '<ul class="list-file-gecodoc">' +
            item.files.map(f =>
              '<li class="single-file-gecodoc"><a href="' + escapeHtml(f.url) +
              '" title="' + escapeHtml(f.title || '') + '" target="_blank" rel="noopener">' +
              escapeHtml(f.filename) + '</a></li>'
            ).join('') +
            '</ul>';
        }

        const titolo = escapeHtml(item.titolo || item.descrizione);
        const descrizione = escapeHtml(item.descrizione || item.titolo);

        const html =
          '<article class="presentation-card-link gecodoc-argo documenti-personale card card-bg card-article card-article-greendark cursorhand" data-focus-mouse="false">' +
            '<div class="card-body">' +
              '<div class="date"><span class="year">' + anno + '</span><span class="day">' + giorno + '</span><span class="month">' + mese + '</span></div>' +
              '<div class="card-article-content">' +
                '<div class="div-titolo"><h3 class="titolo">' + titolo + '</h3></div>' +
                '<p class="descrizione">' + descrizione + '</p>' +
                '<small class="h6 text-greendark">N. documenti: ' + nDocumenti + '</small>' +
                filesHtml +
              '</div>' +
            '</div>' +
          '</article>';

        container.insertAdjacentHTML('beforeend', html);
      });
    })
    .catch(err => {
      console.error(LOG, 'fetch fallito:', err);
      container.innerHTML = '<p>Impossibile caricare gli avvisi al momento.</p>';
    });
})();
