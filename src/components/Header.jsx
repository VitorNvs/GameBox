// src/components/Header.jsx
import React, { useState } from 'react';
// --- MUDANÇAS ---
import { useSelector } from 'react-redux'; // Não precisamos mais do useDispatch ou logout aqui
import { Link } from 'react-router-dom';
// --- FIM DAS MUDANÇAS ---
import { 
    AppBar, Toolbar, Typography, Button, Box, IconButton, 
    Drawer, List, ListItem, ListItemButton, ListItemText 
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

const navItems = [
  { label: 'Início', path: '/' },
  { label: 'Jogos', path: '/jogos' },
  { label: 'Categorias', path: '/categories' },
  { label: 'Conquistas', path: '/conquistas' },
  { label: 'Minhas Listas', path: '/minhas-listas' },
];

function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  
  // --- MUDANÇA ---
  // Busca apenas o estado de autenticação
  const { isAuthenticated } = useSelector((state) => state.auth);
  // --- FIM DA MUDANÇA ---

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  // Conteúdo do menu que aparecerá na gaveta lateral
  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center', width: 250 }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        GameBox
      </Typography>
      <List>
        {navItems.map((item) => (
          <ListItem key={item.label} disablePadding>
            <ListItemButton component={Link} to={item.path}>
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
        {/* --- MUDANÇA: Lógica de Login/Perfil no Drawer --- */}
        <ListItem disablePadding>
          {isAuthenticated ? (
            <ListItemButton component={Link} to="/perfil" sx={{ justifyContent: 'center' }}>
                <Button variant="contained" color="primary" fullWidth>
                    Meu Perfil
                </Button>
            </ListItemButton>
          ) : (
            <ListItemButton component={Link} to="/login" sx={{ justifyContent: 'center' }}>
                <Button variant="contained" color="primary" fullWidth>
                    Login
                </Button>
            </ListItemButton>
          )}
        </ListItem>
        {/* --- FIM DA MUDANÇA --- */}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            GameBox
          </Typography>

          {/* MENU PARA DESKTOP */}
          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
            {navItems.map((item) => (
              <Button key={item.label} sx={{ color: 'text.primary' }} component={Link} to={item.path}>
                {item.label}
              </Button>
            ))}
            
            {/* --- MUDANÇA: Lógica de Login/Perfil no Desktop --- */}
            {isAuthenticated ? (
              // Se estiver logado, mostra o botão "Perfil"
              <Button variant="outlined" color="primary" component={Link} to="/perfil" sx={{ ml: 2 }}>
                Perfil
              </Button>
            ) : (
              // Se não, mostra o botão "Login"
              <Button variant="outlined" color="primary" component={Link} to="/login" sx={{ ml: 2 }}>
                Login
              </Button>
            )}
            {/* --- FIM DA MUDANÇA --- */}
          </Box>

          {/* ÍCONE DE HAMBÚRGUER PARA MOBILE */}
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* GAVETA (DRAWER) DO MENU MOBILE */}
      <nav>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          anchor="right" 
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 250 },
          }}
        >
          {drawer}
        </Drawer>
      </nav>
    </>
  );
}

export default Header;