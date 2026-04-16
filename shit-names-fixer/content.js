const DEFAULT_NAME_MAP = {
  "Cultura Judia Iii 5": "Cultura de JEWS",
  "Filosofia 5": "Filosofia",
  "Quimica 5": "Quimica",
  "Educacion Fisica 5": "Edu fisica",
  "Historia": "Sistemas operativos",
  "Estructura Y Funcionamiento De Sistemas": "-----",
  "Seminario De": "Marketing",
  "Desarrollo De Aplicaciones": "Desarrollo Apps",
  "Desarrollo De Proyectos": "Proyecto",
  "Tecnologia De La Informaci": "Startapp",
  "Educacion Judia": "Educacion de JEWS",
  "Sistemas Embebidos": "UX/UI",
  "Eduardo": "YO"
};

let nameMap = DEFAULT_NAME_MAP;

function getSavedNameMap() {
  return new Promise(resolve => {
    chrome.storage.local.get({ nameMap: DEFAULT_NAME_MAP }, result => {
      resolve(result.nameMap || DEFAULT_NAME_MAP);
    });
  });
}

function renameWithMap() {
  const spans = document.querySelectorAll('.contenidoConURLVisualizado a span');

  spans.forEach(span => {
    if (!span.dataset.originalName) {
      span.dataset.originalName = span.textContent;
    }

    const originalName = span.dataset.originalName;

    for (const [oldName, newName] of Object.entries(nameMap)) {
      if (originalName.includes(oldName)) {
        if (span.textContent !== newName) {
          span.textContent = newName;
        }
        return;
      }
    }

    if (span.textContent !== originalName) {
      span.textContent = originalName;
    }
  });
}

async function start() {
  nameMap = await getSavedNameMap();

  renameWithMap();
  setTimeout(renameWithMap, 1000);

  const observer = new MutationObserver(renameWithMap);
  observer.observe(document.body, { childList: true, subtree: true });
}

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type !== 'NAME_MAP_UPDATED') {
    return false;
  }

  nameMap = message.nameMap || DEFAULT_NAME_MAP;
  renameWithMap();
  sendResponse({ ok: true });
  return false;
});

start();
