// src/components/Footer.jsx
import React from 'react';
import { Box, Typography, Container } from '@mui/material';

function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        // As cores vêm do tema, garantindo consistência
        backgroundColor: 'background.paper',
        color: 'text.secondary',
        borderTop: '1px solid #374151',
        py: 3, // Aumentando o padding vertical
        mt: 'auto',
        textAlign: 'center'
      }}
    >
      <Container maxWidth="lg">
        <Typography variant="body2">
          &copy; {new Date().getFullYear()} Gamebox. Todos os direitos reservados.
        </Typography>
      </Container>
    </Box>
  );
}

export default Footer;