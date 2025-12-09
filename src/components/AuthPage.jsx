// src/components/AuthPage.jsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { register, login } from '../redux/authSlice';
import { 
    Container, Box, Typography, TextField, Button, Grid, 
    Link as MuiLink, Alert, CircularProgress 
} from '@mui/material';

function AuthPage() {
  const [isLoginView, setIsLoginView] = useState(true);

  const [formData, setFormData] = useState({
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error, isAuthenticated } = useSelector((state) => state.auth);
  const [localError, setLocalError] = useState('');

  
  
  useEffect(() => {
    if (isAuthenticated) navigate('/');
  }, [isAuthenticated, navigate]);
  
  
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const toggleView = () => {
    setIsLoginView(!isLoginView);
    setLocalError('');
    setFormData({
      username: '',
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setLocalError('');

    if (isLoginView) {
      dispatch(login({ username: formData.username, password: formData.password }));
      return;
    }

    // cadastro
    if (formData.password !== formData.confirmPassword) {
      setLocalError("As senhas não coincidem!");
      return;
    }

    // envia firstName e lastName para o backend!
    dispatch(
      register({
        username: formData.username,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
      })
    )
      .unwrap()
      .then(() => {
        alert("Cadastro realizado com sucesso! Faça login.");
        toggleView();
      })
      .catch(() => {});
  };

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

          {/* USERNAME — aparece em ambos */}
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

          {/* CAMPOS EXTRAS SÓ NO CADASTRO */}
          {!isLoginView && (
            <>
              <TextField
                margin="normal"
                required
                fullWidth
                id="firstName"
                label="Nome"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
              />

              <TextField
                margin="normal"
                required
                fullWidth
                id="lastName"
                label="Sobrenome"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
              />

              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </>
          )}

          {/* SENHA */}
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

          {/* CONFIRMAR SENHA — só no cadastro */}
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

          {/* ERROS */}
          {/*error && status !== 'loading' && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>*/}
          {localError && <Alert severity="error" sx={{ mt: 2 }}>{localError}</Alert>}

          {/* BOTÃO */}
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
