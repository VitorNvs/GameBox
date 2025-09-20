import React from 'react';
import { Box, Typography, Container } from '@mui/material';

function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: '#333',
        color: 'white',
        py: 2,
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