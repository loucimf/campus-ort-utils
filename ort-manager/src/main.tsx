import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

function App() {
  return (
    <main className="app">
      <section className="panel">
        <p className="eyebrow">Campus ORT utilities</p>
        <h1>ORT Manager</h1>
        <p className="summary">
          Build tools for Campus workflows from one React and TypeScript app.
        </p>
      </section>
    </main>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
