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
import AchievementsPage from './components/AchievementsPage.jsx';
import AdminAchievementsPage from './components/AdminAchievementsPage.jsx';
import MinhasListasPage from './components/MinhasListasPage.jsx';
import CreateReviewPage from './components/CreateReviewPage.jsx';
import ReviewDetailPage from './components/ReviewDetailPage.jsx';
import AdminGamePage from './components/AdminGamePage.jsx';
import CategoryGamesPage from './components/CategoryGamesPage.jsx';
import EditListPage from './components/EditListPage.jsx';
import ProfilePage from './components/ProfilePage.jsx';
import AdminAddGamePage from './components/AdminAdGamePage.jsx';
import CategoryAdminPage from './components/CategoryAdminPage.jsx';

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
                <Route path="/categories" element={<CategoriesPage />} />
                <Route path="/jogos" element={<SearchGamesPage />} />
                <Route path="/jogos/:gameId" element={<GameDetailPage />} />
                <Route path="/conquistas" element={<AchievementsPage />} />
                <Route path="/admin/conquistas" element={<AdminAchievementsPage />} />
                <Route path="/review/:reviewId" element={<ReviewDetailPage />} />
                <Route path="/review/criar/:gameId" element={<CreateReviewPage />} />
                <Route path="/categories/:categoryName" element={<CategoryGamesPage />} />
                <Route path="/minhas-listas/editar/:listId" element={<EditListPage />} />
                <Route path="/perfil" element={<ProfilePage />} />
              {/* Adicione outras rotas aqui */}
              
              {/* Rotas de Administração */}
                <Route path="/admin/jogo/adicionar" element={<AdminAddGamePage />} />
                <Route path="/admin/jogo/:gameId" element={<AdminGamePage />} />
                <Route path="/minhas-listas" element={<MinhasListasPage />} />
                <Route path="/admin/categories/adicionar" element={<CategoryAdminPage />} />
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
