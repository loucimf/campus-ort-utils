(function () {
  const utils = window.campusOrtUtils;
  const originalNameAttribute = 'originalName';
  let nameMap = utils.DEFAULT_NAME_MAP;

  function getSavedNameMap() {
    return new Promise(resolve => {
      chrome.storage.local.get({ nameMap: utils.DEFAULT_NAME_MAP }, result => {
        resolve(result.nameMap || utils.DEFAULT_NAME_MAP);
      });
    });
  }

  function setNameMap(nextNameMap) {
    nameMap = nextNameMap || utils.DEFAULT_NAME_MAP;
  }

  function renameWithMap() {
    const spans = document.querySelectorAll('.contenidoConURLVisualizado a span');

    spans.forEach(span => {
      if (!span.dataset[originalNameAttribute]) {
        span.dataset[originalNameAttribute] = span.textContent;
      }

      const originalName = span.dataset[originalNameAttribute];
      const replacement = Object.entries(nameMap).find(([oldName]) => originalName.includes(oldName));
      const nextText = replacement ? replacement[1] : originalName;

      if (span.textContent !== nextText) {
        span.textContent = nextText;
      }
    });
  }

  utils.getSavedNameMap = getSavedNameMap;
  utils.renameWithMap = renameWithMap;
  utils.setNameMap = setNameMap;
})();
