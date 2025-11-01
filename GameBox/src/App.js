import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header'; // Verifique se o caminho está correto

// Importações do Material-UI
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// NOVO: Importe suas páginas. 
// (Atenção: ajuste o caminho './pages/...' para onde seus arquivos realmente estão!)
import HomePage from './pages/HomePage'; // Você precisa ter um componente para a página inicial
import ReviewDetailPage from './pages/ReviewDetailPage'; // A página que mostra os comentários
import CreateReviewPage from './pages/CreateReviewPage';
import GameDetailPage from './components/GameDetailPage.jsx'; 
import AdminGamePage from './components/AdminGamePage.jsx';
import EditListPage from './components/EditListPage.jsx'; 
import MinhasListasPage from './components/MinhasListasPage.jsx';

// Cria um tema básico (pode ser customizado depois)
const darkTheme = createTheme({
  palette: {
    mode: 'dark', 
    primary: {
      main: '#FFD700', 
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Router>
        <Header />
        
        {/* NOVO: Bloco de rotas descomentado e preenchido */}
        <Routes>
          {/* Rota para a Página Inicial */}
          <Route path="/" element={<HomePage />} /> 

          {/* Rota para a página que mostra a review e os comentários */}
          {/* O :gameId faz com que ela aceite qualquer ID de jogo */}

          {/* Rota para a página de criar a review */}
          <Route path="/criar-review/:gameId" element={<CreateReviewPage />} />
          <Route path="/detalhes_jogo/:gameId" element={<GameDetailPage />} />
          <Route path="/review/:reviewId" element={<ReviewDetailPage />} />
          <Route path="/minhas-listas" element={<MinhasListasPage />} />
          <Route path="/minhas-listas/editar/:listId" element={<EditListPage />} />
          <Route path="/admin/jogo/:gameId" element={<AdminGamePage />} />

          {/* Adicione suas outras rotas aqui (login, perfil, etc.) */}
        </Routes>
        
      </Router>
    </ThemeProvider>
  );
}

export default App;