import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';

const navItems = [
  { label: 'Início', path: '/' },
  { label: 'Jogos', path: '/jogos' },
  { label: 'Categorias', path: '/categorias' },
  { label: 'Conquistas', path: '/conquistas' },
  { label: 'Minhas Listas', path: '/listas' },
];

function Header() {
  return (
    <AppBar position="static" sx={{ backgroundColor: '#222' }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
          GameBox
        </Typography>

        <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
          {navItems.map((item) => (
            <Button
              key={item.label}
              sx={{ color: '#fff' }}
              component={Link}
              to={item.path}
            >
              {item.label}
            </Button>
          ))}
          <Button
            variant="contained"
            color="primary"
            component={Link}
            to="/login"
            sx={{ ml: 2 }}
          >
            Login
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Header;