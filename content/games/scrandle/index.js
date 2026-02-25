(function () {
  const S = window.Stools;
  if (!S) return;

  const DURATION = 1400;
  const VOTES = [/\b(left|1|first|1st)\b/i, /\b(right|2|second|2nd)\b/i];
  const cards = () => [...document.querySelectorAll('.scran[role="button"]')];

  function showFloater(card, text) {
    if (window.getComputedStyle(card).position === 'static') card.style.position = 'relative';
    const f = Object.assign(document.createElement('div'), {
      className: 'stools-floater',
      textContent: text.length > 28 ? text.slice(0, 25) + '\u2026' : text,
    });
    f.style.setProperty('--offset-x', Math.random());
    f.style.setProperty('--offset-y', Math.random());
    card.appendChild(f);
    setTimeout(() => f.remove(), DURATION);
  }

  S.onChatMessage = (text) => {
    const c = cards(), v = VOTES.findIndex(r => r.test(text));
    if (c[v]) showFloater(c[v], text);
  };

  S.createBox = function () {
    if (document.getElementById('stools-overlay')) return;
    const emote = Object.assign(document.createElement('img'), { src: S.randomEmoteSrc(), className: 'stools-emote' });
    const ov = Object.assign(S.mk('div', 'stools-overlay'), { className: 'stools-tab' });
    ov.append(emote, S.mk('div', 'stools-status'));
    document.body.appendChild(ov);
    browser.storage.local.get('twitchChannel').then(({ twitchChannel }) => {
      if (twitchChannel) S.connectTwitch(twitchChannel);
    }).catch(() => {});
  };

  S.watchGameState = () => {};
  S.startGame('SCRANDLE');
})();
