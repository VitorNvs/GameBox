// src/components/ProfilePage.jsx
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../redux/authSlice'; // Importa a ação de logout
import { 
    Container,
    Box, 
    Typography, 
    Button, 
    Avatar, 
    Paper,
    Grid,
    Card,
    CardContent,
    CardMedia
} from '@mui/material';
import { FaHeart, FaThumbsUp } from 'react-icons/fa';
import { useState } from 'react';
import api from '../api';

function ProfilePage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    // Busca o usuário e o status de autenticação do Redux
    const { user, isAuthenticated } = useSelector((state) => state.auth);
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
  if (isAuthenticated) {
    api.get('/reviews/me')
      .then((res) => setReviews(res.data))
      .catch((err) => console.error('Erro ao carregar reviews:', err));
  }
}, [isAuthenticated]);

    // Efeito de "Rota Protegida": Se não estiver logado, chuta para a página de login
    useEffect(() => {
  if (isAuthenticated) {
    api.get('/reviews/me')
      .then((res) => {
        console.log('reviews recebidas:', res.data);
        setReviews(res.data);
      })
      .catch((err) => console.error('Erro ao carregar reviews:', err));
  }
}, [isAuthenticated]);


    // Função de Logout
    const handleLogout = () => {
        dispatch(logout());
        navigate('/'); // Volta para a Home após o logout
    };

    // Se o usuário ainda não carregou (ou foi chutado), mostra um loading
    if (!user) {
        return <Typography>Carregando...</Typography>;
    }

    return (
        <Box>
            {/* Imagem de Capa (mockada como no HTML) */}
            <Box sx={{ height: '300px', bgcolor: 'background.paper', mb: -10 }}>
                <img 
                    src="https://via.placeholder.com/1200x300?text=Capa+do+Perfil" 
                    alt="Capa do perfil" 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
            </Box>

            <Container maxWidth="lg" sx={{ position: 'relative' }}>
                {/* Informações Principais do Perfil */}
                <Paper 
                    sx={{ 
                        p: 3, 
                        display: 'flex', 
                        flexDirection: { xs: 'column', sm: 'row' },
                        alignItems: 'center',
                        bgcolor: 'background.paper' 
                    }}
                >
                    <Avatar 
                        src="https://via.placeholder.com/150x150?text=Avatar" 
                        alt="Foto de perfil"
                        sx={{ width: 150, height: 150, border: '4px solid #121829' }}
                    />
                    <Box sx={{ flexGrow: 1, ml: { sm: 3 }, textAlign: { xs: 'center', sm: 'left' } }}>
                        <Typography variant="h3" component="h1" fontWeight="700">
                            {user.username}
                        </Typography>
                        <Typography color="text.secondary">@{user.username.toLowerCase()}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 2, mt: { xs: 2, sm: 0 } }}>
                        {/* Stats (mockados como no HTML, pois o server.js não os tem) */}
                        <Box textAlign="center"><Typography variant="h5">0</Typography><Typography>Avaliações</Typography></Box>
                        <Box textAlign="center"><Typography variant="h5">0</Typography><Typography>Seguidores</Typography></Box>
                        <Box textAlign="center"><Typography variant="h5">0</Typography><Typography>Seguindo</Typography></Box>
                    </Box>
                </Paper>

                {/* Seções Inferiores (Jogos, Conquistas) */}
                <Grid container spacing={4} sx={{ mt: 2 }}>
                    <Grid item xs={12} md={8}>
                        <Typography variant="h4" gutterBottom>Jogos Avaliados </Typography>
                        <Grid container spacing={2}>
                            {/* Card de Jogo Mockado 1 */}
                            <Grid item xs={6} sm={4}>
                                <Card>
                                    <CardMedia component="img" height="190" image="https://via.placeholder.com/150x200?text=Capa+Jogo+A" alt="Jogo A" />
                                    <CardContent>
                                        <Typography variant="h6">Nome do Jogo A</Typography>
                                        <Typography color="primary.main"><FaThumbsUp /> Gostei</Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                             {/* Card de Jogo Mockado 2 */}
                             {reviews.length > 0 ? (
                                reviews.map((review) => (
                                    <Grid item xs={6} sm={4} key={review._id}>
                                    <Card>
                                        <CardMedia
                                        component="img"
                                        height="190"
                                        image={review.gameId?.image || 'https://via.placeholder.com/150x200?text=Sem+Imagem'}
                                        alt={review.gameId?.title || 'Jogo'}
                                        />
                                        <CardContent>
                                        <Typography variant="h6">
                                            {review.gameId?.title || 'Jogo Desconhecido'}
                                        </Typography>
                                        <Typography color="primary.main">
                                            {review.rating === 'love' && <FaHeart />}{" "}
                                            {review.rating === 'like' && <FaThumbsUp />}{" "}
                                            {review.rating === 'dislike' && '👎'}{" "}
                                            {review.rating || 'sem nota'}
                                        </Typography>
                                        </CardContent>
                                    </Card>
                                    </Grid>
                                ))
                                ) : (
                                <Typography sx={{ ml: 2 }}>você ainda não fez nenhuma análise.</Typography>
                                )}
                        </Grid>
                    </Grid>

                    <Grid item xs={12} md={4}>
                        {/* O BOTÃO SAIR AGORA ESTÁ AQUI! */}
                        <Paper sx={{ p: 2 }}>
                            <Button 
                                variant="contained" 
                                color="error" 
                                fullWidth
                                onClick={handleLogout}
                            >
                                Sair da Conta
                            </Button>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}

export default ProfilePage;