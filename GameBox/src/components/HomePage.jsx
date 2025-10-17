// src/components/HomePage.jsx
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchGames } from '../redux/gamesSlice';
import { Link } from 'react-router-dom';
import {
    Box,
    Card,
    CardContent,
    CardMedia,
    Container,
    Grid,
    Typography,
    CircularProgress
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';

// Dados locais para a seção de listas, pois ela é estática
const userLists = [
    { title: 'Favoritos' },
    { title: 'Jogando' },
    { title: 'Quero Jogar' },
];

function HomePage() {
    const dispatch = useDispatch();
    const games = useSelector((state) => state.games.items);
    const gameStatus = useSelector((state) => state.games.status);
    
    useEffect(() => {
        if (gameStatus === 'idle') {
            dispatch(fetchGames());
        }
    }, [gameStatus, dispatch]);

    // Filtra a lista completa de jogos em duas listas separadas
    const popularGames = games.filter(game => game.listType === 'popular');
    const friendUpdates = games.filter(game => game.listType === 'friend-update');

    const getFeedbackIcon = (gameId) => {
        // Simulação simples de feedback
        if (gameId % 2 === 0) return <ThumbUpIcon fontSize="small" />;
        return <ThumbDownIcon fontSize="small" />;
    };

    return (
        <Container component="main" maxWidth="lg" sx={{ py: 4 }}>
            {/* Seção Jogos Populares */}
            <Box component="section" sx={{ mb: 6 }}>
                <Typography variant="h3" component="h3" sx={{ borderLeft: '4px solid', borderColor: 'primary.main', pl: 2, mb: 4 }}>
                    Jogos Populares
                </Typography>
                
                {gameStatus === 'loading' && <Box sx={{ display: 'flex', justifyContent: 'center' }}><CircularProgress /></Box>}

                {gameStatus === 'succeeded' && (
                    <Grid container spacing={4}>
                        {popularGames.map((game) => (
                            <Grid item key={game.id} xs={12} sm={6} md={10}>
                                <Card component={Link} to={`/games/${game.id}`} sx={{ textDecoration: 'none', height: '100%', display: 'flex', flexDirection: 'column', transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out', '&:hover': { transform: 'scale(1.05)', boxShadow: 6, zIndex: 1 }}}>
                                    <CardMedia component="img" height="200" image={game.image} alt={`Capa de ${game.title}`} />
                                    <CardContent sx={{ flexGrow: 1 }}>
                                        <Typography gutterBottom variant="h6" component="h4" sx={{ fontSize: '1.25rem' }}>{game.title}</Typography>
                                        <Box sx={{ display: 'flex', alignItems: 'center', color: '#facc15' }}>
                                            <FavoriteIcon sx={{ mr: 1, color: 'primary.main' }} />
                                            <Typography variant="body1">{game.rating} / 10</Typography>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Box>

            {/* Seção Atualizações de Amigos (AGORA CORRIGIDA!) */}
            {gameStatus === 'succeeded' && friendUpdates.length > 0 && (
                <Box component="section" sx={{ mb: 6 }}>
                    <Typography variant="h3" component="h3" sx={{ borderLeft: '4px solid', borderColor: 'primary.main', pl: 2, mb: 4 }}>
                        Atualizações de amigos
                    </Typography>
                    <Grid container spacing={3}>
                        {friendUpdates.map((game) => (
                            <Grid item key={game.id} xs={6} sm={4} md={2}>
                                <Card
                                    component={Link}
                                    to={`/games/${game.id}`}
                                    sx={{
                                        textDecoration: 'none',
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                                        '&:hover': {
                                            transform: 'scale(1.05)',
                                            boxShadow: 6,
                                            zIndex: 1,
                                        },
                                    }}
                                >
                                    <CardMedia component="img" height="140" image={game.image} alt={`Capa de ${game.title}`} />
                                    <CardContent sx={{ p: 1.5, flexGrow: 1 }}>
                                        <Typography variant="body2" component="h4" noWrap>{game.title}</Typography>
                                        <Box sx={{ color: 'primary.main', mt: 1 }}>{getFeedbackIcon(game.id)}</Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            )}

            {/* Seção Suas Listas */}
            <Box component="section">
                <Typography variant="h3" component="h3" sx={{ borderLeft: '4px solid', borderColor: 'primary.main', pl: 2, mb: 4 }}>
                   Suas listas
                </Typography>
                <Grid container spacing={3}>
                    {userLists.map((list, index) => (
                       <Grid item key={index} xs={12} sm={4}>
                           <Card sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100px'}}>
                               <CardContent>
                                   <Typography variant="h6">{list.title}</Typography>
                               </CardContent>
                           </Card>
                       </Grid>
                    ))}
                </Grid>
            </Box>
        </Container>
    );
}

export default HomePage;