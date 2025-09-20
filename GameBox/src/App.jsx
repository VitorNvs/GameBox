import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Box, CssBaseline } from '@mui/material';

// --- Imports Corrigidos ---
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
// 1. Caminho corrigido para a nova página de autenticação
import AuthPage from "./components/AuthPage.jsx"; 

// Futuramente, você importaria suas outras páginas aqui
// import HomePage from './pages/HomePage/HomePage';

function App() {
  return (
    <Router>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Header />
        <Box component="main" sx={{ flexGrow: 1, py: 3 }}>
            {/* O Roteador decide qual página renderizar aqui dentro */}
            <Routes>
              {/* --- Rotas Atualizadas --- */}

              {/* 2. Rota padrão adicionada para a página inicial */}
              <Route path="/" element={<AuthPage />} />

              {/* Rota para /login, que também mostra a mesma página */}
              <Route path="/login" element={<AuthPage />} />

              {/* Adicione outras rotas aqui no futuro */}
              {/* Ex: <Route path="/jogos" element={<GamesPage />} /> */}
            </Routes>
        </Box>
        <Footer />
      </Box>
    </Router>
  );
}

export default App;