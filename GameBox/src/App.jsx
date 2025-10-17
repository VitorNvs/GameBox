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
import GameDetailPage from './components/GameDetailPage.jsx';

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
                <Route path="/games/:gameId" element={<GameDetailPage />} />
                {/* Adicione outras rotas aqui */}
              </Routes>
          </Box>
          <Footer />
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;