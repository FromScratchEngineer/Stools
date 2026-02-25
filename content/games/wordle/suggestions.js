(function () {
  const S = window.Stools;
  if (!S) return;

  const MAX = 200;

  S.addChatWord = function (raw) {
    const word = raw.toUpperCase().replace(/[^A-Z]/g, '');
    if (word.length !== 5 || S.chatSuggestions.has(word)) return;
    if (S.chatSuggestions.size >= MAX) {
      for (const [k, v] of S.chatSuggestions) { if (!v.tried) { S.chatSuggestions.delete(k); break; } }
      if (S.chatSuggestions.size >= MAX) return;
    }
    S.chatSuggestions.set(word, { tried: false });
    S.renderSuggestions();
  };

  S.renderSuggestions = function () {
    const list = document.getElementById('stools-list');
    const empty = document.getElementById('stools-empty');
    if (!list) return;
    const priority = [], valid = [], tried = [];
    for (const [word, { tried: t }] of S.chatSuggestions) {
      if (t) tried.push(word);
      else if (S.isWordValid(word)) (S.hasKnownLetters(word) ? priority : valid).push(word);
    }
    list.innerHTML = '';
    if (empty) empty.style.display = (priority.length + valid.length + tried.length) ? 'none' : 'block';
    const item = (word, t, p) => {
      const d = Object.assign(document.createElement('div'), {
        textContent: word,
        className: 'stools-item' + (t ? ' tried' : p ? ' priority' : ''),
      });
      if (!t) d.addEventListener('click', () => S.typeIntoGame(word));
      return d;
    };
    [...priority.map(w => item(w, false, true)), ...valid.map(w => item(w, false, false)), ...tried.map(w => item(w, true, false))]
      .forEach(el => list.appendChild(el));
  };
})();
