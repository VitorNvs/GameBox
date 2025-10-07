// src/components/AuthPage.jsx
import React, { useState } from 'react';
import { Container, Box, Typography, TextField, Button, Grid, Link as MuiLink } from '@mui/material';

function AuthPage() {
  const [isLoginView, setIsLoginView] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (isLoginView) {
      alert(`LOGIN:\nUsuário: ${formData.username}\nSenha: ${formData.password}`);
    } else {
      if (formData.password !== formData.confirmPassword) {
        alert("As senhas não coincidem!");
        return;
      }
      alert(`CADASTRO:\nUsuário: ${formData.username}\nEmail: ${formData.email}\nSenha: ${formData.password}`);
    }
  };

  const toggleView = () => setIsLoginView(!isLoginView);

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          padding: 4, // Aumentando o padding
          backgroundColor: 'background.paper', // Cor do tema
          borderRadius: 2, // Bordas mais sutis
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h4" sx={{ color: 'primary.main', mb: 3 }}>
          {isLoginView ? 'Login' : 'Cadastro'}
        </Typography>
        
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Nome de Usuário"
            name="username"
            autoComplete="username"
            autoFocus
            value={formData.username}
            onChange={handleChange}
          />

          {!isLoginView && (
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email"
              name="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
            />
          )}

          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Senha"
            type="password"
            id="password"
            autoComplete={isLoginView ? "current-password" : "new-password"}
            value={formData.password}
            onChange={handleChange}
          />

          {!isLoginView && (
            <TextField
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="Confirmar Senha"
              type="password"

              id="confirmPassword"
              autoComplete="new-password"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          )}

          <Button
            type="submit"
            fullWidth
            variant="contained" // variant="contained" usa a cor primária do tema por padrão
            sx={{ mt: 3, mb: 2, fontWeight: 'bold' }}
          >
            {isLoginView ? 'Entrar' : 'Cadastrar'}
          </Button>

          <Grid container justifyContent="flex-end">
            <Grid item>
              <MuiLink component="button" variant="body2" onClick={toggleView}>
                {isLoginView ? "Não tem uma conta? Cadastre-se" : "Já tem uma conta? Faça login"}
              </MuiLink>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}

export default AuthPage;