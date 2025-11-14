// src/components/ProfilePage.jsx
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../redux/authSlice'; 
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
import api from '../api';

function ProfilePage() {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const { user, isAuthenticated } = useSelector((state) => state.auth);
    const [reviews, setReviews] = useState([]);

    // Redireciona se não estiver autenticado
    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
        }
    }, [isAuthenticated, navigate]);

    // Busca as reviews do usuário
   useEffect(() => {
    if (isAuthenticated) {
        api.get('/perfil')
            .then((res) => {
                setReviews(res.data.reviews);
            })
            .catch((err) => console.error('Erro ao carregar perfil:', err));
    }
}, [isAuthenticated]);


    // Logout
    const handleLogout = () => {
        dispatch(logout());
        navigate('/');
    };

    if (!user) {
        return <Typography>Carregando...</Typography>;
    }

    return (
        <Box>
            {/* Imagem de capa */}
            <Box sx={{ height: '300px', mb: -10 }}>
                <img
                    src="https://via.placeholder.com/1200x300?text=Capa+do+Perfil"
                    alt="Capa do perfil"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
            </Box>

            <Container maxWidth="lg">

                {/* Header do perfil */}
                <Paper
                    sx={{
                        p: 3,
                        display: 'flex',
                        flexDirection: { xs: 'column', sm: 'row' },
                        alignItems: 'center',
                    }}
                >
                    <Avatar
                        src="https://via.placeholder.com/150x150?text=Avatar"
                        alt="Foto de perfil"
                        sx={{ width: 150, height: 150, border: '4px solid #121829' }}
                    />
                    <Box sx={{ flexGrow: 1, ml: { sm: 3 }, textAlign: { xs: 'center', sm: 'left' } }}>
                        <Typography variant="h3" fontWeight={700}>
                            {user.username}
                        </Typography>
                        <Typography color="text.secondary">
                            @{user.username.toLowerCase()}
                        </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', gap: 2, mt: { xs: 2, sm: 0 } }}>
                        <Box textAlign="center">
                            <Typography variant="h5">{reviews.length}</Typography>
                            <Typography>Avaliações</Typography>
                        </Box>
                        <Box textAlign="center">
                            <Typography variant="h5">0</Typography>
                            <Typography>Seguidores</Typography>
                        </Box>
                        <Box textAlign="center">
                            <Typography variant="h5">0</Typography>
                            <Typography>Seguindo</Typography>
                        </Box>
                    </Box>
                </Paper>

                {/* Área inferior */}
                <Grid container spacing={4} sx={{ mt: 2 }}>

                    {/* Lista de jogos avaliados */}
                    <Grid item xs={12} md={8}>
                        <Typography variant="h4" gutterBottom>Jogos Avaliados</Typography>

                        <Grid container spacing={2}>
                            
                            {/* Mapeamento das reviews */}
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
                                                    {review.rating === 'love' && <FaHeart />}
                                                    {review.rating === 'like' && <FaThumbsUp />}
                                                    {review.rating === 'dislike' && '👎'}{" "}
                                                    {review.rating || 'sem nota'}
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                ))
                            ) : (
                                <Typography sx={{ ml: 2 }}>
                                    Você ainda não fez nenhuma análise.
                                </Typography>
                            )}

                        </Grid>
                    </Grid>

                    {/* Botão de logout */}
                    <Grid item xs={12} md={4}>
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
