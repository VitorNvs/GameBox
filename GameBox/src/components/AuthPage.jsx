// src/components/AuthPage.jsx
import React, { useState, useEffect } from 'react';
// --- MUDANÇAS ---
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { register, login } from '../redux/authSlice';
import { 
    Container, Box, Typography, TextField, Button, Grid, 
    Link as MuiLink, Alert, CircularProgress 
} from '@mui/material';
// --- FIM DAS MUDANÇAS ---

function AuthPage() {
  const [isLoginView, setIsLoginView] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  
  // --- MUDANÇAS ---
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error, isAuthenticated } = useSelector((state) => state.auth);
  const [localError, setLocalError] = useState('');

  // Se já estiver logado, vai para a Home
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);
  // --- FIM DAS MUDANÇAS ---

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  
  // --- MUDANÇA: toggleView agora limpa o formulário ---
  const toggleView = () => {
    setIsLoginView(!isLoginView);
    setLocalError('');
    // Limpa os dados do formulário ao trocar de aba
    setFormData({
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    });
  };
  // --- FIM DA MUDANÇA ---

  // --- MUDANÇA: handleSubmit agora usa Redux e redireciona ---
  const handleSubmit = (event) => {
    event.preventDefault();
    setLocalError(''); // Limpa erros locais

    if (isLoginView) {
      // Lógica de Login
      dispatch(login({ username: formData.username, password: formData.password }));
    } else {
      // Lógica de Cadastro
      if (formData.password !== formData.confirmPassword) {
        setLocalError("As senhas não coincidem!");
        return;
      }
      
      // A MÁGICA ACONTECE AQUI!
      dispatch(register({ username: formData.username, email: formData.email, password: formData.password }))
        .unwrap() // Permite usar o .then() para saber se deu certo
        .then(() => {
          // Se o cadastro deu certo:
          alert('Cadastro realizado com sucesso! Por favor, faça o login.');
          toggleView(); // Muda para a tela de login
        })
        .catch((err) => {
          // Se deu erro (ex: 'E-mail já cadastrado'), o 'authSlice' já cuida de mostrar o erro.
        });
    }
  };
  // --- FIM DA MUDANÇA ---

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          padding: 4, 
          backgroundColor: 'background.paper', 
          borderRadius: 2, 
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

          {/* Mostra erros do Redux ou erros locais */}
          {error && status !== 'loading' && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
          {localError && <Alert severity="error" sx={{ mt: 2 }}>{localError}</Alert>}

          <Button
            type="submit"
            fullWidth
            variant="contained" 
            sx={{ mt: 3, mb: 2, fontWeight: 'bold' }}
            disabled={status === 'loading'} 
          >
            {status === 'loading' ? <CircularProgress size={24} /> : (isLoginView ? 'Entrar' : 'Cadastrar')}
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