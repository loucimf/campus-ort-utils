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

const nameMapElement = document.getElementById('nameMap');
const statusElement = document.getElementById('status');
const addRowButton = document.getElementById('addRow');
const resetButton = document.getElementById('reset');
const saveButton = document.getElementById('save');

function createRow(oldName = '', newName = '') {
  const row = document.createElement('div');
  row.className = 'row';

  const oldNameInput = document.createElement('input');
  oldNameInput.className = 'old-name';
  oldNameInput.placeholder = 'Campus name';
  oldNameInput.value = oldName;

  const newNameInput = document.createElement('input');
  newNameInput.className = 'new-name';
  newNameInput.placeholder = 'Display as';
  newNameInput.value = newName;

  const removeButton = document.createElement('button');
  removeButton.className = 'danger';
  removeButton.type = 'button';
  removeButton.textContent = 'x';
  removeButton.title = 'Remove row';
  removeButton.addEventListener('click', () => {
    row.remove();
  });

  row.append(oldNameInput, newNameInput, removeButton);
  return row;
}

function renderNameMap(nameMap) {
  nameMapElement.replaceChildren();

  Object.entries(nameMap).forEach(([oldName, newName]) => {
    nameMapElement.append(createRow(oldName, newName));
  });
}

function collectNameMap() {
  const nextNameMap = {};
  const rows = nameMapElement.querySelectorAll('.row');

  rows.forEach(row => {
    const oldName = row.querySelector('.old-name').value.trim();
    const newName = row.querySelector('.new-name').value.trim();

    if (oldName && newName) {
      nextNameMap[oldName] = newName;
    }
  });

  return nextNameMap;
}

function setStatus(message) {
  statusElement.textContent = message;

  if (message) {
    setTimeout(() => {
      statusElement.textContent = '';
    }, 2000);
  }
}

async function notifyActiveTab(nameMap) {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  if (!tab || !tab.id || !tab.url || !tab.url.startsWith('https://campus.ort.edu.ar/')) {
    return;
  }

  try {
    await chrome.tabs.sendMessage(tab.id, {
      type: 'NAME_MAP_UPDATED',
      nameMap
    });
  } catch (_error) {
    // The content script may not be available until the page is reloaded.
  }
}

function loadNameMap() {
  chrome.storage.local.get({ nameMap: DEFAULT_NAME_MAP }, result => {
    renderNameMap(result.nameMap || DEFAULT_NAME_MAP);
  });
}

addRowButton.addEventListener('click', () => {
  nameMapElement.append(createRow());
});

resetButton.addEventListener('click', () => {
  renderNameMap(DEFAULT_NAME_MAP);
  setStatus('Defaults restored. Save to apply.');
});

saveButton.addEventListener('click', async () => {
  const nameMap = collectNameMap();

  await chrome.storage.local.set({ nameMap });
  await notifyActiveTab(nameMap);
  setStatus('Saved.');
});

loadNameMap();
