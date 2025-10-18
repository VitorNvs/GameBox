import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Box, CssBaseline, ThemeProvider } from '@mui/material'; // Importe o ThemeProvider
import { darkTheme } from './theme'; // Importe nosso tema customizado

import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import AuthPage from "./components/AuthPage.jsx"; 
import HomePage from './components/HomePage.jsx';
import CategoriesPage from './components/CategoriesPage.jsx';
import SearchGamesPage from './components/SearchGamesPage.jsx';
<<<<<<< HEAD
=======
import GameDetailPage from './components/GameDetailPage.jsx';
import MinhasListasPage from './components/MinhasListasPage.jsx';
import CreateReviewPage from './components/CreateReviewPage.jsx';
import ReviewDetailPage from './components/ReviewDetailPage.jsx';
import AdminGamePage from './components/AdminGamePage.jsx';
>>>>>>> 97f3367c5fb45da436bb38ac1be3205c8865c75e

function App() {
  return (
    // O ThemeProvider envolve toda a aplicação
    <ThemeProvider theme={darkTheme}> 
      <Router>
        <CssBaseline /> {/* Garante que o fundo e as fontes do tema sejam aplicados */}
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'background.default' }}>
          <Header />
          {/* Removido o padding (py: 3) daqui para que cada página controle seu próprio espaçamento */}
          <Box component="main" sx={{ flexGrow: 1 }}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<AuthPage />} />
                <Route path="/categorias" element={<CategoriesPage />} />
                <Route path="/jogos" element={<SearchGamesPage />} />
<<<<<<< HEAD
                {/* Adicione outras rotas aqui */}
=======
                <Route path="/games/:gameId" element={<GameDetailPage />} />
                <Route path="/minhas-listas" element={<MinhasListasPage />} />
                <Route path="/review/:reviewId" element={<ReviewDetailPage />} />
                <Route path="/review/criar/:gameId" element={<CreateReviewPage />} />
              {/* Adicione outras rotas aqui */}
              
              {/* Rotas de Administração */}
                <Route path="/admin/jogo/adicionar" element={<AdminGamePage />} /> {/* ROTA PARA ADICIONAR */}
                <Route path="/admin/jogo/:gameId" element={<AdminGamePage />} />
>>>>>>> 97f3367c5fb45da436bb38ac1be3205c8865c75e
              </Routes>
          </Box>
          <Footer />
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
