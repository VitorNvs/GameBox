// src/components/SearchGamesPage.jsx
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchGames } from '../redux/gamesSlice';
import { Link } from 'react-router-dom';
import {
    Container,
    Box,
    Typography,
    TextField,
    Button,
    Grid,
    Card,
    CardContent,
    CardMedia,
    CircularProgress
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import StarIcon from '@mui/icons-material/Star';

function SearchGamesPage() {
    const dispatch = useDispatch();
    const [searchTerm, setSearchTerm] = useState('');
    const games = useSelector((state) => state.games.items);
    const gameStatus = useSelector((state) => state.games.status);

    useEffect(() => {
        if (gameStatus === 'idle') {
            dispatch(fetchGames());
        }
    }, [gameStatus, dispatch]);

    const filteredGames = games.filter((game) =>
        game.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Container component="main" maxWidth="lg" sx={{ py: 4 }}>
            {/* Seção da Barra de Busca */}
            <Box sx={{ textAlign: 'center', mb: 6, py: 4, bgcolor: 'background.paper', borderRadius: 2 }}>
                <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
                    Encontre seu Próximo Jogo Favorito
                </Typography>
                <Box
                    component="form"
                    sx={{ mt: 3, display: 'flex', justifyContent: 'center', gap: 1, maxWidth: '600px', mx: 'auto' }}
                >
                    <TextField
                        fullWidth
                        variant="outlined"
                        placeholder="Digite o nome do jogo..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Button type="submit" variant="contained" size="large" startIcon={<SearchIcon />} onClick={(e) => e.preventDefault()}>
                        Buscar
                    </Button>
                </Box>
            </Box>

            {/* Seção de Resultados */}
            <Box component="section">
                <Typography variant="h4" component="h2" sx={{ borderLeft: '4px solid', borderColor: 'primary.main', pl: 2, mb: 4 }}>
                    Resultados
                </Typography>
                
                {gameStatus === 'loading' && <Box sx={{ display: 'flex', justifyContent: 'center' }}><CircularProgress /></Box>}

                {gameStatus === 'succeeded' && (
                    <Grid container spacing={4}>
                        {filteredGames.map((game) => (
                            <Grid item key={game.id} xs={12} sm={6} md={4} lg={3}>
                                <Card
                                    component={Link}
                                    to={`/games/${game.id}`}
                                    sx={{
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        textDecoration: 'none',
                                        transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                                        '&:hover': { transform: 'scale(1.05)', boxShadow: 6, zIndex: 1 }
                                    }}
                                >
                                    <CardMedia
                                        component="img"
                                        sx={{ height: 380 }} 
                                        image={game.image}
                                        alt={`Capa de ${game.title}`}
                                    />
                                    <CardContent sx={{ flexGrow: 1 }}>
                                        {/* A SOLUÇÃO DEFINITIVA ESTÁ AQUI */}
                                        <Typography
                                            gutterBottom
                                            variant="h6"
                                            component="h4"
                                            sx={{
                                                whiteSpace: 'nowrap',   // Impede que o texto quebre a linha
                                                overflow: 'hidden',       // Esconde o texto que "sobra"
                                                textOverflow: 'ellipsis' // Adiciona "..." no final do texto cortado
                                            }}
                                        >
                                            {game.title}
                                        </Typography>
                                        <Box sx={{ display: 'flex', alignItems: 'center', color: '#facc15' }}>
                                            <StarIcon sx={{ mr: 0.5 }} />
                                            <Typography variant="body1">{game.rating}</Typography>
                                        </Box>
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

export default SearchGamesPage;