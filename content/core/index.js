(function () {
  const S = window.Stools;
  if (!S) return;

  browser.runtime.onMessage.addListener(({ command, channel }) => {
    if      (command === 'toggle-panel')      document.getElementById('stools-overlay') ? S.removeBox() : S.startGame(S.gameName);
    else if (command === 'show-panel')        S.startGame(S.gameName);
    else if (command === 'hide-panel')        S.removeBox();
    else if (command === 'connect-twitch')    { if (channel) S.connectTwitch(channel); }
    else if (command === 'disconnect-twitch') S.disconnectTwitch();
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      S.gameObserver?.disconnect();
      if (S.twitchWs) { S._hiddenDisconnect = true; S.twitchWs.close(); S.twitchWs = null; }
    } else {
      const hasPanel = Boolean(document.getElementById('stools-overlay'));
      if (S.gameName && !hasPanel) S.startGame(S.gameName);
      else if (hasPanel) { S.watchGameState?.(); if (S.twitchChannel) S.connectTwitch(S.twitchChannel); }
    }
  });
})();
