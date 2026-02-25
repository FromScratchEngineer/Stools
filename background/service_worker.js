// Icon click always toggles the in-page panel on supported game pages.
browser.action.onClicked.addListener(tab => {
  browser.tabs.sendMessage(tab.id, { command: "toggle-panel" }).catch(() => {});
});
