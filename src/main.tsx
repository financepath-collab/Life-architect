import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Gracefully handle and suppress benign Vite/WebSocket connection failures in preview environments
if (typeof window !== 'undefined') {
  const isWebsocketError = (err: any): boolean => {
    if (!err) return false;
    const message = err.message || '';
    const stack = err.stack || '';
    return (
      message.includes('WebSocket') ||
      message.includes('websocket') ||
      message.includes('connection failed') ||
      message.includes('vite') ||
      stack.includes('vite') ||
      stack.includes('websocket')
    );
  };

  window.addEventListener('unhandledrejection', (event) => {
    if (isWebsocketError(event.reason)) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  });

  window.addEventListener('error', (event) => {
    if (isWebsocketError(event.error) || isWebsocketError(event.message)) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  });

  // Register PWA Service Worker for iOS / Android installability and offline caching
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then((reg) => {
          console.log('[PWA] Service Worker actif:', reg.scope);
        })
        .catch((err) => {
          console.warn('[PWA] Échec de l\'enregistrement du Service Worker:', err);
        });
    });
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

