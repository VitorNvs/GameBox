import React, { useState } from 'react';
import { Container, Box, Typography, TextField, Button, Grid, Link as MuiLink } from '@mui/material';

function AuthPage() {
  // Estado para controlar se estamos na tela de Login ou Cadastro
  const [isLoginView, setIsLoginView] = useState(true);

  // Estados para os campos do formulário (unimos tudo em um objeto)
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  // Função para atualizar o estado do formulário
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Função para lidar com o envio do formulário
  const handleSubmit = (event) => {
    event.preventDefault();
    if (isLoginView) {
      // Lógica de Login
      alert(`LOGIN:\nUsuário: ${formData.username}\nSenha: ${formData.password}`);
    } else {
      // Lógica de Cadastro
      if (formData.password !== formData.confirmPassword) {
        alert("As senhas não coincidem!");
        return;
      }
      alert(`CADASTRO:\nUsuário: ${formData.username}\nEmail: ${formData.email}\nSenha: ${formData.password}`);
    }
  };

  // Função para alternar entre as telas
  const toggleView = () => {
    setIsLoginView(!isLoginView);
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          padding: 3,
          backgroundColor: 'var(--card-background)',
          borderRadius: '10px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h4" sx={{ color: 'var(--primary-color)', mb: 4 }}>
          {isLoginView ? 'Login' : 'Cadastro'}
        </Typography>
        
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
          {/* Campo de Nome de Usuário (comum para ambos) */}
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

          {/* Campo de Email (apenas para Cadastro) */}
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

          {/* Campo de Senha (comum para ambos) */}
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

          {/* Campo de Confirmar Senha (apenas para Cadastro) */}
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
            variant="contained"
            sx={{ mt: 3, mb: 2, backgroundColor: 'var(--primary-color)', color: 'var(--secondary-color)', fontWeight: 'bold' }}
          >
            {isLoginView ? 'Entrar' : 'Cadastrar'}
          </Button>

          {/* Link para alternar entre as telas */}
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