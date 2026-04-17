import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const DEFAULT_ROWS = [
  ['Cultura Judia Iii 5', 'Cultura de JEWS'],
  ['Filosofia 5', 'Filosofia'],
  ['Quimica 5', 'Quimica'],
  ['Educacion Fisica 5', 'Edu fisica'],
  ['Historia', 'Sistemas operativos'],
  ['Estructura Y Funcionamiento De Sistemas', '-----'],
  ['Seminario De', 'Marketing'],
  ['Desarrollo De Aplicaciones', 'Desarrollo Apps'],
  ['Desarrollo De Proyectos', 'Proyecto'],
  ['Tecnologia De La Informaci', 'Startapp'],
  ['Educacion Judia', 'Educacion de JEWS'],
  ['Sistemas Embebidos', 'UX/UI'],
  ['Eduardo', 'YO']
];

function rowsToNameMap(rows) {
  return rows.reduce((nameMap, row) => {
    const original = row.original.trim();
    const replacement = row.replacement.trim();

    if (original && replacement) {
      nameMap[original] = replacement;
    }

    return nameMap;
  }, {});
}

function App() {
  const [rows, setRows] = useState(() =>
    DEFAULT_ROWS.map(([original, replacement], index) => ({
      id: crypto.randomUUID?.() || `${original}-${index}`,
      original,
      replacement
    }))
  );

  const nameMap = useMemo(() => rowsToNameMap(rows), [rows]);
  const jsonOutput = useMemo(() => JSON.stringify(nameMap, null, 2), [nameMap]);

  function updateRow(id, field, value) {
    setRows(currentRows =>
      currentRows.map(row => (row.id === id ? { ...row, [field]: value } : row))
    );
  }

  function addRow() {
    setRows(currentRows => [
      ...currentRows,
      {
        id: crypto.randomUUID?.() || `row-${Date.now()}`,
        original: '',
        replacement: ''
      }
    ]);
  }

  function removeRow(id) {
    setRows(currentRows => currentRows.filter(row => row.id !== id));
  }

  async function copyJson() {
    await navigator.clipboard.writeText(jsonOutput);
  }

  return (
    <main className="app">
      <section className="intro">
        <p className="eyebrow">Campus ORT utilities</p>
        <h1>Name map builder</h1>
        <p>
          Create replacement pairs for Campus subject names, then use the JSON in
          the extension.
        </p>
      </section>

      <section className="workspace" aria-label="Name map editor">
        <div className="editor">
          <div className="editorHeader">
            <span>Campus name</span>
            <span>Display as</span>
            <span></span>
          </div>

          <div className="rows">
            {rows.map(row => (
              <div className="row" key={row.id}>
                <input
                  value={row.original}
                  onChange={event => updateRow(row.id, 'original', event.target.value)}
                  placeholder="Name shown by Campus"
                />
                <input
                  value={row.replacement}
                  onChange={event => updateRow(row.id, 'replacement', event.target.value)}
                  placeholder="Replacement name"
                />
                <button
                  className="removeButton"
                  type="button"
                  onClick={() => removeRow(row.id)}
                  aria-label="Remove row"
                >
                  x
                </button>
              </div>
            ))}
          </div>

          <button className="addButton" type="button" onClick={addRow}>
            Add row
          </button>
        </div>

        <aside className="output" aria-label="Generated JSON">
          <div className="outputHeader">
            <h2>JSON</h2>
            <button type="button" onClick={copyJson}>Copy</button>
          </div>
          <pre>{jsonOutput}</pre>
        </aside>
      </section>
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);
