// src/components/HomePage.jsx
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchGames } from '../redux/gamesSlice';
import { fetchLists } from '../redux/listsSlice'; // NOVO: Importamos a ação de buscar listas
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

// REMOVIDO: Não precisamos mais da lista estática
// const userLists = [ ... ];

function HomePage() {
    const dispatch = useDispatch();

    // Seletores dos Jogos (já existia)
    const games = useSelector((state) => state.jogos.items);
    const gameStatus = useSelector((state) => state.jogos.status);
    
    // NOVO: Seletores das Listas (igual à MinhasListasPage)
    const lists = useSelector((state) => state.lists.items);
    const listStatus = useSelector((state) => state.lists.status);
    
    useEffect(() => {
        if (gameStatus === 'idle') {
            dispatch(fetchGames());
        }
        // NOVO: Busca as listas se elas ainda não foram buscadas
        if (listStatus === 'idle') {
            dispatch(fetchLists());
        }
    }, [gameStatus, listStatus, dispatch]); // NOVO: Adicionado listStatus às dependências

    // Filtra a lista completa de jogos (já existia)
    const popularGames = games.filter(game => game.listType === 'popular');
    const friendUpdates = games.filter(game => game.listType === 'friend-update');

    const getFeedbackIcon = (gameId) => {
        // Simulação simples de feedback
        // ATENÇÃO: Seus IDs de jogo são strings, usar parseInt para a lógica de par/ímpar
        if (parseInt(gameId) % 2 === 0) return <ThumbUpIcon fontSize="small" />;
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
                            <Grid item key={game._id} xs={12} sm={6} md={10}>
                                {/* CORREÇÃO: O link deve ir para /detalhes_jogo/ e não /jogos/ */}
                                <Card component={Link} to={`/jogos/${game._id}`} sx={{ textDecoration: 'none', height: '100%', display: 'flex', flexDirection: 'column', transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out', '&:hover': { transform: 'scale(1.05)', boxShadow: 6, zIndex: 1 }}}>
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

            {/* Seção Atualizações de Amigos */}
            {gameStatus === 'succeeded' && friendUpdates.length > 0 && (
                <Box component="section" sx={{ mb: 6 }}>
                    <Typography variant="h3" component="h3" sx={{ borderLeft: '4px solid', borderColor: 'primary.main', pl: 2, mb: 4 }}>
                        Atualizações de amigos
                    </Typography>
                    <Grid container spacing={3}>
                        {friendUpdates.map((game) => (
                            <Grid item key={game._id} xs={6} sm={4} md={2}>
                                <Card
                                    component={Link}
                                    // CORREÇÃO: O link deve ir para /detalhes_jogo/ e não /jogos/
                                    to={`/jogos/${game._id}`}
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
                                        <Box sx={{ color: 'primary.main', mt: 1 }}>{getFeedbackIcon(game._id)}</Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            )}

            {/* Seção Suas Listas (AGORA CONECTADA AO REDUX) */}
            <Box component="section">
                <Typography variant="h3" component="h3" sx={{ borderLeft: '4px solid', borderColor: 'primary.main', pl: 2, mb: 4 }}>
                   Suas listas
                </Typography>
                
                {/* NOVO: Lógica de Loading */}
                {listStatus === 'loading' && <Box sx={{ display: 'flex', justifyContent: 'center' }}><CircularProgress /></Box>}

                {/* NOVO: Lógica de Sucesso, agora mapeia as 'lists' do Redux */}
                {listStatus === 'succeeded' && (
                    <Grid container spacing={3}>
                        {/* MUDANÇA: 'userLists.map' virou 'lists.map' */}
                        {lists.map((list) => (
                            <Grid item key={list.id} xs={12} sm={4}>
                                <Card 
                                    component={Link}
                                    to={`/minhas-listas/editar/${list.id}`} // O link já estava correto
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        height: '100px',
                                        textDecoration: 'none',
                                        color: 'inherit',
                                        transition: 'transform 0.3s, box-shadow 0.3s',
                                        '&:hover': {
                                            transform: 'scale(1.05)',
                                            boxShadow: 6,
                                            zIndex: 1,
                                        }
                                    }}
                                >
                                    <CardContent>
                                        <Typography variant="h6">{list.title}</Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Box>
        </Container>
    );
}

export default HomePage;