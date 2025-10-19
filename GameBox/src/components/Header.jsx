import React, { useState } from 'react';
import { 
    AppBar, 
    Toolbar, 
    Typography, 
    Button, 
    Box, 
    IconButton, 
    Drawer, 
    List, 
    ListItem, 
    ListItemButton, 
    ListItemText 
} from '@mui/material';
import { Link } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu'; // Ícone de Hambúrguer

const navItems = [
  { label: 'Início', path: '/' },
  { label: 'Jogos', path: '/jogos' },
  { label: 'Categorias', path: '/categories' },
  { label: 'Conquistas', path: '/conquistas' },
  { label: 'Minhas Listas', path: '/minhas-listas' },
];

function Header() {
  // Estado para controlar a abertura e fechamento do menu mobile (gaveta)
  const [mobileOpen, setMobileOpen] = useState(false);

  // Função para abrir/fechar o menu
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
        {/* Botão de Login dentro da gaveta */}
        <ListItem disablePadding>
            <ListItemButton component={Link} to="/login" sx={{ justifyContent: 'center' }}>
                <Button variant="contained" color="primary" fullWidth>
                    Login
                </Button>
            </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          {/* TÍTULO */}
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            GameBox
          </Typography>

          {/* MENU PARA DESKTOP */}
          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
            {navItems.map((item) => (
              <Button
                key={item.label}
                sx={{ color: 'text.primary' }}
                component={Link}
                to={item.path}
              >
                {item.label}
              </Button>
            ))}
            <Button
              variant="outlined"
              color="primary"
              component={Link}
              to="/login"
              sx={{ ml: 2 }}
            >
              Login
            </Button>
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
          ModalProps={{
            keepMounted: true, // Melhora a performance de abertura em mobile
          }}
          anchor="right" // Abre do lado direito
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