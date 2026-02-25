(function () {
  const S = window.Stools;
  if (!S) return;

  const asTile = t  => ({ letter: (t.getAttribute('letter') || '').toUpperCase(), state: t.getAttribute('evaluation') });
  const asElem = el => ({ letter: el.textContent.trim().toUpperCase(), state: el.getAttribute('data-state') });

  const EXTRACTORS = [
    { q: () => [...document.querySelectorAll('game-tile[evaluation]')], m: asTile },
    { q: () => { const a = document.querySelector('game-app'); return a?.shadowRoot ? [...a.shadowRoot.querySelectorAll('game-tile[evaluation]')] : []; }, m: asTile },
    { q: () => [...document.querySelectorAll('[data-testid="tile"][data-state]')].filter(e => e.getAttribute('data-state') !== 'empty'), m: asElem },
    { q: () => [...document.querySelectorAll('[data-state="correct"],[data-state="present"],[data-state="absent"]')].filter(e => e.tagName !== 'BUTTON'), m: asElem },
  ];

  function extractRows() {
    for (const { q, m } of EXTRACTORS) {
      const els = q();
      if (!els.length) continue;
      const rows = [];
      for (let i = 0; i + 5 <= els.length; i += 5) rows.push(els.slice(i, i + 5).map(m));
      return rows;
    }
    return [];
  }

  function readState() {
    S.resetGameState();
    for (const row of extractRows()) {
      const seen = {};
      for (const { letter, state } of row) if (letter && state) (seen[letter] = seen[letter] || new Set()).add(state);
      for (let i = 0; i < row.length; i++) {
        const { letter, state } = row[i];
        if (!letter || !state) continue;
        if (state === 'correct') { S.greenLetters[i] = letter; }
        else if (state === 'present') { const a = S.yellowLetters[letter] || (S.yellowLetters[letter] = []); if (!a.includes(i)) a.push(i); }
        else if (state === 'absent' && !seen[letter].has('correct') && !seen[letter].has('present')) S.greyLetters.add(letter);
      }
      const word = row.map(t => t.letter).join('');
      if (word.length === 5 && S.chatSuggestions.has(word)) S.chatSuggestions.set(word, { tried: true });
    }
    S.renderSuggestions();
  }
  S.watchGameState = function () {
    S.gameObserver?.disconnect();
    readState();
    S.gameObserver = new MutationObserver(() => { clearTimeout(S._debounce); S._debounce = setTimeout(readState, 300); });
    S.gameObserver.observe(document.body, { subtree: true, attributes: true, attributeFilter: ['evaluation', 'data-state', 'letter'] });
  };
})();
