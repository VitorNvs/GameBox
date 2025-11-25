// src/components/CategoryGamesPage.jsx

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
    Container, 
    Box, 
    Typography, 
    Grid, 
    Card, 
    CardContent, 
    CardMedia, 
    CircularProgress, 
    Alert 
} from '@mui/material';

// Simulação de endpoint para buscar jogos por categoria
// O endpoint real dependerá da sua API (ex: http://localhost:3001/games?genre=Aventura)
const API_URL = 'http://localhost:8000/jogos';

function CategoryGamesPage() {
    // 1. Obtém o parâmetro 'categoryName' da URL
    const { categoryName } = useParams();
    
    // 2. Estados
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // 3. Hook para buscar jogos quando o componente for montado ou 'categoryName' mudar
    useEffect(() => {
        const fetchGamesByCategory = async () => {
            setLoading(true); // Inicia o loading

            try {
                // Constrói a URL de busca: Filtra jogos pelo campo 'genre'
                // Certifique-se de que sua API suporta este filtro!
                const searchUrl = `${API_URL}?genre=${categoryName}`; 
                
                const response = await fetch(searchUrl);
                
                if (!response.ok) {
                    throw new Error(`Erro de rede ou servidor. Status: ${response.status}`);
                }
                
                const data = await response.json();
                setGames(data);
                setError(null);
            } catch (err) {
                console.error(`Falha ao buscar jogos para ${categoryName}:`, err);
                setError(`Não foi possível carregar os jogos de ${categoryName}. Verifique a API.`);
            } finally {
                setLoading(false);
            }
        };

        if (categoryName) {
            fetchGamesByCategory();
        }
    }, [categoryName]);

    // 4. Renderização Condicional (Loading, Erro, Vazio)

    const categoryTitle = categoryName ? decodeURIComponent(categoryName).replace(/%20/g, ' ') : 'Categoria';

    if (loading) {
        return (
            <Container maxWidth="lg" sx={{ py: 6, textAlign: 'center' }}>
                <CircularProgress color="primary" />
                <Typography variant="h6" sx={{ mt: 2 }}>Carregando jogos de {categoryTitle}...</Typography>
            </Container>
        );
    }

    if (error) {
        return (
            <Container maxWidth="lg" sx={{ py: 6 }}>
                <Alert severity="error">{error}</Alert>
            </Container>
        );
    }

    // 5. Renderização Padrão

    return (
        <>
            {/* Seção do Banner - Adapta o estilo do CategoriesPage.jsx */}
            <Box 
                sx={{ 
                    bgcolor: 'background.paper', 
                    py: 6, 
                    textAlign: 'center',
                    borderBottom: '1px solid #374151'
                }}
            >
                <Container maxWidth="md">
                    <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 700, color: 'primary.main' }}>
                        Jogos na Categoria: {categoryTitle}
                    </Typography>
                    <Typography variant="h6" color="text.secondary">
                        {games.length} jogos encontrados.
                    </Typography>
                </Container>
            </Box>

            {/* Grid de Jogos */}
            <Container component="main" maxWidth="lg" sx={{ py: 6 }}>
                {games.length === 0 ? (
                    <Alert severity="info">Nenhum jogo encontrado nesta categoria.</Alert>
                ) : (
                    <Grid container spacing={4}>
                        {games.map((game) => (
                            <Grid item key={game._id} xs={12} sm={6} md={3}>
                                {/* Card do Jogo com Link para GameDetailPage.jsx */}
                                <Card 
                                    component={Link} // Transforma o Card em um link
                                    to={`/jogos/${game._id}`} // Redireciona para o GameDetailPage
                                    sx={{ 
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        transition: 'transform 0.3s',
                                        textDecoration: 'none', // Remove sublinhado do link
                                        color: 'inherit',
                                        '&:hover': {
                                            transform: 'scale(1.05)', 
                                            boxShadow: 6,
                                        }
                                    }}
                                >
                                    <CardMedia
                                        component="img"
                                        height="200"
                                        image={game.image}
                                        alt={`Capa de ${game.title}`}
                                        sx={{ objectFit: 'cover' }}
                                    />
                                    <CardContent sx={{ flexGrow: 1 }}>
                                        <Typography gutterBottom variant="h6" component="h2" fontWeight="bold">
                                            {game.title}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Nota: {game.rating} / 10
                                        </Typography>
                                        <Typography variant="body1" color="primary.main" sx={{ mt: 1 }}>
                                            {game.price}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Container>
        </>
    );
}

export default CategoryGamesPage;