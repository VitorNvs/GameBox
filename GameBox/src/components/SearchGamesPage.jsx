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
    CircularProgress,
    Paper,
    List,
    ListItemButton,
    ListItemText
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import StarIcon from '@mui/icons-material/Star';
import AddIcon from '@mui/icons-material/Add'; // Ícone de Adicionar

const categories = [
    'Todos', 'Ação', 'Ação-Aventura', 'Estratégia', 'Indie',
    'Metroidvania', 'RPG', 'RPG de Ação', 'Survival Horror',
    'Terror'
];

function SearchGamesPage() {
    const dispatch = useDispatch();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('Todos');

    const games = useSelector((state) => state.jogos.items);
    const gameStatus = useSelector((state) => state.jogos.status);

    useEffect(() => {
        if (gameStatus === 'idle') {
            dispatch(fetchGames());
        }
    }, [gameStatus, dispatch]);

    const filteredGames = games
        .filter((game) => {
            if (selectedCategory === 'Todos') return true;
            return game.genre && game.genre === selectedCategory;
        })
        .filter((game) => {
            return game.title && game.title.toLowerCase().includes(searchTerm.toLowerCase());
        });

    return (
        <Container component="main" maxWidth="lg" sx={{ py: 4 }}>
            <Box sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                gap: 4
            }}>
                {/* COLUNA DA BARRA LATERAL (FILTROS) */}
                <Box sx={{
                    width: { xs: '100%', sm: '25%' },
                    position: 'sticky',
                    top: '20px',
                    height: 'fit-content'
                }}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            Categorias
                        </Typography>
                        <List component="nav">
                            {categories.map((category) => (
                                <ListItemButton
                                    key={category}
                                    selected={selectedCategory === category}
                                    onClick={() => setSelectedCategory(category)}
                                >
                                    <ListItemText primary={category} />
                                </ListItemButton>
                            ))}
                        </List>
                    </Paper>
                </Box>

                {/* COLUNA DO CONTEÚDO PRINCIPAL (BUSCA E RESULTADOS) */}
                <Box sx={{
                    width: { xs: '100%', sm: '75%' }
                }}>
                    {/* Seção da Barra de Busca */}
                    <Box sx={{ textAlign: 'center', mb: 6, py: 4, bgcolor: 'background.paper', borderRadius: 2 }}>
                        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
                            Encontre seu Próximo Jogo Favorito
                        </Typography>
                        <Box
                            component="form"
                            sx={{ mt: 3, display: 'flex', justifyContent: 'center', gap: 1, maxWidth: '600px', mx: 'auto' }}
                        >
                            <TextField fullWidth variant="outlined" placeholder="Digite o nome do jogo..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                            <Button type="submit" variant="contained" size="large" startIcon={<SearchIcon />} onClick={(e) => e.preventDefault()}>
                                Buscar
                            </Button>
                        </Box>
                    </Box>

                    {/* Seção de Resultados */}
                    <Box component="section">
                        {/* TÍTULO E BOTÃO NA MESMA LINHA */}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                            <Typography variant="h4" component="h2" sx={{ borderLeft: '4px solid', borderColor: 'primary.main', pl: 2 }}>
                                Resultados
                            </Typography>
                            <Button
                                variant="contained"
                                component={Link}
                                to="/admin/jogo/adicionar"
                                startIcon={<AddIcon />}
                            >
                                Adicionar Novo Jogo
                            </Button>
                        </Box>

                        {gameStatus === 'loading' && <Box sx={{ display: 'flex', justifyContent: 'center' }}><CircularProgress /></Box>}

                        {gameStatus === 'succeeded' && (
                            <Grid container spacing={4}>
                                {filteredGames.length > 0 ? filteredGames.map((game) => (
                                    game && game._id ? (
                                        <Grid item key={game._id} xs={12} sm={6} md={4}>
                                            <Card
                                            component={Link}
                                            to={`/jogos/${game._id}`}
                                            sx={{
                                                textDecoration: 'none',
                                                borderRadius: 2,
                                                overflow: 'hidden',
                                                transition: 'transform 0.25s ease-in-out',
                                                '&:hover': { transform: 'scale(1.05)' },
                                            }}
                                            >
                                            <Box
                                                sx={{
                                                position: 'relative',
                                                width: '100%',
                                                maxWidth: 220,
                                                marginX: 'auto',
                                                height: 220,
                                                overflow: 'hidden',
                                                }}
                                            >
                                                <CardMedia
                                                component="img"
                                                image={game.image}
                                                alt={`Capa de ${game.title || 'Jogo sem título'}`}
                                                sx={{
                                                    position: 'absolute',
                                                    top: 0,
                                                    left: 0,
                                                    width: '100%',
                                                    height: '100%',
                                                    objectFit: 'cover',
                                                }}
                                                />
                                            </Box>

                                            <CardContent sx={{ p: 2 }}>
                                                <Typography
                                                gutterBottom
                                                variant="h6"
                                                component="h4"
                                                sx={{
                                                    whiteSpace: 'nowrap',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                }}
                                                >
                                                {game.title || 'Jogo sem título'}
                                                </Typography>

                                                <Box sx={{ display: 'flex', alignItems: 'center', color: '#facc15' }}>
                                                <StarIcon sx={{ mr: 0.5 }} />
                                                <Typography variant="body1">{game.rating || 'N/A'}</Typography>
                                                </Box>
                                            </CardContent>
                                            </Card>

                                                
                                        </Grid>
                                    ) : null
                                )) : (
                                    <Typography sx={{ ml: 2, width: '100%' }}>Nenhum jogo encontrado com esses filtros.</Typography>
                                )}
                            </Grid>
                        )}
                    </Box>
                </Box>
            </Box>
        </Container>
    );
}

export default SearchGamesPage;
