const channelInput = document.getElementById('twitch-channel');
const saveBtn      = document.getElementById('save');
const clearBtn     = document.getElementById('clear');
const statusEl     = document.getElementById('status');
const card         = document.getElementById('channel-card');
const avatar       = document.getElementById('channel-avatar');
const channelName  = document.getElementById('channel-name');

function flash(msg, isError) {
  statusEl.style.color = isError ? '#f44' : '';
  statusEl.textContent = msg;
  setTimeout(() => { statusEl.textContent = ''; statusEl.style.color = ''; }, 2000);
}

function showCard(channel) {
  channelName.textContent = '#' + channel;
  avatar.removeAttribute('src');
  card.hidden = false;
  fetch(`https://decapi.me/twitch/avatar/${channel}`, { signal: AbortSignal.timeout(5000) })
    .then(r => r.ok ? r.text() : Promise.reject())
    .then(url => { avatar.src = url.trim(); })
    .catch(() => {});
}

function hideCard() {
  card.hidden = true;
  avatar.removeAttribute('src');
  channelInput.value = '';
}

browser.storage.local.get('twitchChannel').then(({ twitchChannel }) => {
  if (twitchChannel) { channelInput.value = twitchChannel; showCard(twitchChannel); }
}).catch(() => {});

saveBtn.addEventListener('click', () => {
  const channel = channelInput.value.trim().toLowerCase();
  if (channel && !/^[a-z0-9_]{1,25}$/.test(channel)) { flash('Invalid channel name.', true); return; }
  browser.storage.local.set({ twitchChannel: channel })
    .then(() => { flash('Saved.', false); if (channel) showCard(channel); else hideCard(); })
    .catch(() => flash('Save failed.', true));
});

clearBtn.addEventListener('click', () => {
  browser.storage.local.remove('twitchChannel')
    .then(() => { hideCard(); flash('Cleared.', false); })
    .catch(() => flash('Clear failed.', true));
});
