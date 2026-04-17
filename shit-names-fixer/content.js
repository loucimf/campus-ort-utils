const utils = window.campusOrtUtils;

async function start() {
  utils.setNameMap(await utils.getSavedNameMap());

  applyCampusChanges();
  setTimeout(applyCampusChanges, 1000);

  const observer = new MutationObserver(applyCampusChanges);
  observer.observe(document.body, { childList: true, subtree: true });
}

function applyCampusChanges() {
  utils.renameWithMap();
  utils.appendManagerLink();
}

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type !== 'NAME_MAP_UPDATED') {
    return false;
  }

  utils.setNameMap(message.nameMap);
  utils.renameWithMap();
  sendResponse({ ok: true });
  return false;
});

start();
