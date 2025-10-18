// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { store } from './redux/store'; // Importe a store
import { Provider } from 'react-redux'; // Importe o Provider

// Importe seu arquivo de estilos globais AQUI
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}> {/* Envolva o App com o Provider */}
    <App />
    </Provider>
  </React.StrictMode>,
);