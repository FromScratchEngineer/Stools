(function () {
  const S = window.Stools;
  if (!S) return;

  S.isWordValid = function (word) {
    for (const l of S.greyLetters) if (word.includes(l)) return false;
    for (const [pos, l] of Object.entries(S.greenLetters)) if (word[pos] !== l) return false;
    for (const [l, bad] of Object.entries(S.yellowLetters)) {
      if (!word.includes(l) || bad.some(p => word[p] === l)) return false;
    }
    return true;
  };

  S.hasKnownLetters = (word) =>
    Object.values(S.greenLetters).some(l => word.includes(l)) ||
    Object.keys(S.yellowLetters).some(l => word.includes(l));
})();
