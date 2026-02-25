if (!window.StoolsLoaded) {
  window.StoolsLoaded = true;
  window.Stools = {
    greyLetters:       new Set(),
    yellowLetters:     {},
    greenLetters:      {},
    chatSuggestions:   new Map(),
    gameName:          null,
    twitchWs:          null,
    twitchChannel:     null,
    gameObserver:      null,
    _hiddenDisconnect: false,
    _pingTimer:        null,
    _debounce:         null,
  };
  window.Stools.resetGameState = function () {
    const S = window.Stools;
    S.greyLetters = new Set(); S.yellowLetters = {}; S.greenLetters = {};
  };
}
