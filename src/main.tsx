import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { t } from 'i18next';
import { Provider } from 'react-redux';
import { store } from './app/core/redux/index.ts';
import './i18n';

// Główny title strony
document.title = t('appName');

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
