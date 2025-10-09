import React, { useState } from 'react';
import { Container, Box, Typography, TextField, Button, Grid, Card, CardContent, CardMedia } from '@mui/material';
import { Link } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import StarIcon from '@mui/icons-material/Star';

// Dados mocados (substitua por uma chamada de API no futuro)
const searchResults = [
    { id: 1, title: 'Cyberpunk 2077', rating: '9.1', image: 'https://cdn1.epicgames.com/offer/77f2b98e2cef40c8a7437518bf420e47/EGS_Cyberpunk2077_CDPROJEKTRED_S2_03_1200x1600-b1847981214ac013383111fc457eb9c5' },
    { id: 2, title: 'The Witcher 3', rating: '9.8', image: 'https://cdn1.epicgames.com/offer/14ee004dadc142faaaece5a6270fb628/EGS_TheWitcher3WildHuntCompleteEdition_CDPROJEKTRED_S2_1200x1600-53a8fb2c0201cd8aea410f2a049aba3f' },
    { id: 3, title: 'Elden Ring', rating: '9.7', image: 'https://source.unsplash.com/400x550/?elden,ring,fantasy' },
    { id: 4, title: 'Red Dead Redemption 2', rating: '9.9', image: 'https://source.unsplash.com/400x550/?cowboy,western' },
    { id: 5, title: 'Hades', rating: '9.5', image: 'https://source.unsplash.com/400x550/?underworld,greek' },
    { id: 6, title: 'Stardew Valley', rating: '9.6', image: 'https://source.unsplash.com/400x550/?farm,pixel' },
];

function SearchGamesPage() {
    // Estado para controlar o valor do campo de busca
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = (event) => {
        event.preventDefault();
        // Futuramente, a lógica de busca será executada aqui
        alert(`Buscando por: ${searchTerm}`);
    };

    return (
        <Container component="main" maxWidth="lg" sx={{ py: 4 }}>
            {/* Seção da Barra de Busca */}
            <Box sx={{ textAlign: 'center', mb: 6 }}>
                <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
                    Encontre seu Próximo Jogo Favorito
                </Typography>
                <Box
                    component="form"
                    onSubmit={handleSearch}
                    sx={{
                        mt: 3,
                        display: 'flex',
                        justifyContent: 'center',
                        gap: 1,
                        maxWidth: '600px',
                        mx: 'auto'
                    }}
                >
                    <TextField
                        fullWidth
                        variant="outlined"
                        placeholder="Digite o nome do jogo..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        startIcon={<SearchIcon />}
                    >
                        Buscar
                    </Button>
                </Box>
            </Box>

            {/* Seção de Resultados */}
            <Box component="section">
                <Typography variant="h4" component="h2" gutterBottom sx={{ borderLeft: '4px solid', borderColor: 'primary.main', pl: 2, mb: 4 }}>
                    Resultados
                </Typography>
                <Grid container spacing={4}>
                    {searchResults.map((game) => (
                        <Grid item key={game.id} xs={12} sm={6} md={4} lg={3}>
                            <Card sx={{ height: '100%', textDecoration: 'none' }} component={Link} to={`/games/${game.id}`}>
                                <CardMedia
                                    component="img"
                                    height="380"
                                    image={game.image}
                                    alt={`Capa de ${game.title}`}
                                />
                                <CardContent>
                                    <Typography gutterBottom variant="h6" component="h4">
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
            </Box>
        </Container>
    );
}

export default SearchGamesPage;