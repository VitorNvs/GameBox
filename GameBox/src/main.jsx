// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// 1. IMPORTE AS FERRAMENTAS
import { Provider } from 'react-redux';
import { ThemeProvider } from '@mui/material/styles';
import { store } from './redux/store.js';
import { darkTheme } from './theme.js';
import { CssBaseline } from '@mui/material';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* 2. CONECTE O REDUX */}
    <Provider store={store}>
      {/* 3. CONECTE O TEMA */}
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </Provider>
  </React.StrictMode>,
);