(function () {
  const S = window.Stools;
  if (!S) return;

  S.mk = (tag, id) => { const el = document.createElement(tag); if (id) el.id = id; return el; };
  S.randomEmoteSrc = () => browser.runtime.getURL(`assets/emotes/${Math.floor(Math.random() * 5) + 1}.gif`);

  S.typeIntoGame = function (word) {
    for (let i = 0; i < 5; i++) document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Backspace', bubbles: true, cancelable: true }));
    for (const ch of word) document.dispatchEvent(new KeyboardEvent('keydown', { key: ch.toLowerCase(), bubbles: true, cancelable: true }));
    S.chatSuggestions.set(word, { tried: true });
    S.renderSuggestions();
  };

  S.createBox = function () {
    if (document.getElementById('stools-overlay')) return;
    S.chatSuggestions.clear();
    S.resetGameState();
    const emote = Object.assign(S.mk('img'), { src: S.randomEmoteSrc(), className: 'stools-emote' });
    const title = S.mk('div', 'stools-title'); title.append(emote, S.gameName || 'STOOLS');
    const label = Object.assign(S.mk('div', 'stools-label'), { textContent: 'Chat suggestions' });
    const empty = Object.assign(S.mk('div', 'stools-empty'), { textContent: 'Waiting for chat\u2026' });
    const ov = S.mk('div', 'stools-overlay');
    ov.append(title, S.mk('div', 'stools-status'), label, empty, S.mk('div', 'stools-list'));
    document.body.appendChild(ov);
    browser.storage.local.get('twitchChannel').then(({ twitchChannel }) => {
      if (twitchChannel) S.connectTwitch(twitchChannel);
    }).catch(() => {});
  };

  S.startGame = (name) => { S.gameName = name; if (!document.hidden) { S.createBox(); S.watchGameState?.(); } };
  S.removeBox = () => { clearTimeout(S._debounce); S.gameObserver?.disconnect(); S.gameObserver = null; document.getElementById('stools-overlay')?.remove(); };
  S.setStatus = (text) => { const el = document.getElementById('stools-status'); if (el) el.textContent = text; };
})();
