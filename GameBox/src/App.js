import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header'; // Verifique se o caminho está correto

// Importações do Material-UI
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Cria um tema básico (pode ser customizado depois)
const darkTheme = createTheme({
  palette: {
    mode: 'dark', // Isso ajuda a manter a consistência com o estilo do seu Header
    primary: {
      main: '#FFD700', // Exemplo de cor primária (dourado)
    },
  },
});

function App() {
  return (
    // O ThemeProvider aplica o tema e a responsividade para todos os componentes filhos
    <ThemeProvider theme={darkTheme}>
      {/* CssBaseline reseta o CSS para um padrão consistente */}
      <CssBaseline />
      <Router>
        <Header />
        {/*
          Aqui você pode definir o resto das suas rotas e páginas.
          Exemplo:
          <Routes>
            <Route path="/" element={<div>Página Inicial</div>} />
            <Route path="/jogos" element={<div>Página de Jogos</div>} />
          </Routes>
        */}
      </Router>
    </ThemeProvider>
  );
}

export default App;