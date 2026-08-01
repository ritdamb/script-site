(function () {
  const container = document.getElementById('pnrr-list');
  const ENDPOINT = 'https://sgd2awp.portaleargo.it/sgd2awp/all/SG17925';

  const MESI = ['GEN', 'FEB', 'MAR', 'APR', 'MAG', 'GIU', 'LUG', 'AGO', 'SET', 'OTT', 'NOV', 'DIC'];

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str || '';
    return div.innerHTML;
  }

  fetch(ENDPOINT)
    .then(r => {
      console.log('[PNRR 215 ART. 2] fetch status:', r.status);
      return r.json();
    })
    .then(data => {
      const items = data.items || [];
      console.log('[PNRR 215 ART. 2] avvisi totali nel feed:', items.length);

      const filtrati = items.filter(item => {
        const testo = ((item.titolo || '') + ' ' + (item.descrizione || ''));
        return /PNRR/i.test(testo) && /\bDM\s+215\b/i.test(testo) && /\bART\.?\s*2\b/i.test(testo);
      });

      filtrati.sort((a, b) => (b.lastModifiedAt || 0) - (a.lastModifiedAt || 0));

      console.log('[PNRR 215 ART. 2] avvisi corrispondenti:', filtrati.length);

      container.innerHTML = '';

      if (filtrati.length === 0) {
        container.innerHTML = '<p>Nessun avviso Piano Estate al momento.</p>';
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
              '<li class="single-file-gecodoc"><a href="' + f.url +
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
      console.error('[PNRR 215 ART. 2] fetch fallito:', err);
      container.innerHTML = '<p>Impossibile caricare gli avvisi al momento.</p>';
    });
})();
