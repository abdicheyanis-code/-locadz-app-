
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Enregistrement du Service Worker pour l'optimisation mobile/PC
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then(registration => {
      console.log('LOCADZ PWA Active:', registration.scope);
    }).catch(err => {
      console.log('PWA Register Fail:', err);
    });
  });
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
