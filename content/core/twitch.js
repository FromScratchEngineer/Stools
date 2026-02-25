(function () {
  const S = window.Stools;
  if (!S) return;

  S.connectTwitch = function (channel) {
    S.twitchChannel = channel.toLowerCase();
    if (S.twitchWs) S.twitchWs.close();
    clearTimeout(S._pingTimer);
    const reset = () => { clearTimeout(S._pingTimer); S._pingTimer = setTimeout(() => S.twitchWs?.close(), 90000); };
    S.twitchWs = new WebSocket('wss://irc-ws.chat.twitch.tv:443');
    S.twitchWs.onopen = () => {
      S.twitchWs.send('CAP REQ :twitch.tv/tags twitch.tv/commands');
      S.twitchWs.send(`NICK justinfan${Math.floor(Math.random() * 99999)}`);
      S.twitchWs.send(`JOIN #${S.twitchChannel}`);
      S.setStatus(`● #${S.twitchChannel}`);
      reset();
    };
    S.twitchWs.onmessage = (e) => {
      reset();
      for (const line of e.data.split('\r\n')) {
        if (line.startsWith('PING')) { S.twitchWs.send('PONG :tmi.twitch.tv'); continue; }
        const m = line.match(/PRIVMSG #[^ ]+ :(.+)/);
        if (m) {
          const text = m[1].trim();
          S.onChatMessage?.(text);
          if (!/\s/.test(text)) S.addChatWord?.(text);
        }
      }
    };
    S.twitchWs.onclose = () => { clearTimeout(S._pingTimer); if (S._hiddenDisconnect) { S._hiddenDisconnect = false; return; } S.setStatus(''); };
    S.twitchWs.onerror = () => S.setStatus('Connection failed');
  };

  S.disconnectTwitch = () => { S.twitchChannel = null; clearTimeout(S._pingTimer); S.twitchWs?.close(); S.twitchWs = null; S.setStatus(''); };
})();
