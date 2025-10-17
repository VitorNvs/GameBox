// src/components/GameDetailPage.jsx
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchGameById } from '../redux/gamesSlice';
import { 
    Container, 
    Box, 
    Typography, 
    CircularProgress, 
    Chip, 
    Button, 
    Card, 
    CardContent, 
    Avatar 
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';

const renderRatingIcon = (icon) => {
    if (icon === 'heart') return <FavoriteIcon color="primary" />;
    if (icon === 'thumb-up') return <ThumbUpIcon color="primary" />;
    return null;
};

function GameDetailPage() {
    const { gameId } = useParams();
    const dispatch = useDispatch();

    const game = useSelector((state) => state.games.selectedGame);
    const status = useSelector((state) => state.games.selectedGameStatus);
    const error = useSelector((state) => state.games.error);

    useEffect(() => {
        if (gameId) {
            dispatch(fetchGameById(gameId));
        }
    }, [gameId, dispatch]);

    if (status === 'loading' || !game) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}><CircularProgress /></Box>;
    }

    if (status === 'failed') {
        return <Typography color="error">Erro ao carregar o jogo: {error}</Typography>;
    }

    return (
        <Container maxWidth="lg" sx={{ my: 4 }}>
            {/* AQUI ESTÁ A ESTRUTURA CORRIGIDA USANDO FLEXBOX */}
            <Box 
                sx={{ 
                    display: 'flex', 
                    // Em telas 'xs' (celular), a direção é coluna (um em cima do outro)
                    // Em telas 'sm' (tablet) e maiores, a direção é linha (lado a lado)
                    flexDirection: { xs: 'column', sm: 'row' }, 
                    gap: 4 
                }}
            >
                {/* Coluna da Imagem (ocupa 1/3 do espaço em telas maiores) */}
                <Box sx={{ width: { xs: '100%', sm: '33.33%' } }}>
                    <Box 
                        component="img" 
                        src={game.image} 
                        alt={`Capa de ${game.title}`} 
                        sx={{ 
                            width: '100%', 
                            borderRadius: 2,
                            height: { xs: 'auto', sm: 450 }, // Altura ajustada
                            objectFit: 'cover'
                        }} 
                    />
                </Box>
                
                {/* Coluna de Informações (ocupa 2/3 do espaço em telas maiores) */}
                <Box sx={{ width: { xs: '100%', sm: '66.67%' } }}>
                    <Typography variant="h3" component="h1" fontWeight="700">{game.title}</Typography>
                    <Box display="flex" gap={2} my={2}>
                        <Card variant="outlined"><CardContent sx={{ textAlign: 'center' }}><Typography variant="overline">NOTA</Typography><Typography variant="h5">{game.rating} / 10</Typography></CardContent></Card>
                        <Card variant="outlined"><CardContent sx={{ textAlign: 'center' }}><Typography variant="overline">PREÇO</Typography><Typography variant="h5">{game.price}</Typography></CardContent></Card>
                    </Box>
                    <Box my={2}>
                        <Typography variant="h6" gutterBottom>Gênero</Typography>
                        <Chip label={game.genre} color="primary" />
                    </Box>
                    <Box my={2}>
                        <Typography variant="h6" gutterBottom>Categorias</Typography>
                        {game.tags.map(tag => <Chip key={tag} label={tag} sx={{ mr: 1, mb: 1 }} />)}
                    </Box>
                    <Box my={2}>
                        <Typography variant="h5" gutterBottom>Descrição</Typography>
                        <Typography paragraph color="text.secondary">{game.description}</Typography>
                    </Box>
                    <Button variant="contained">Editar Jogo (Admin)</Button>
                </Box>
            </Box>

            {/* Seção de Avaliações (continua igual) */}
            <Box mt={6}>
                <Typography variant="h4" component="h2" fontWeight="700" gutterBottom>Avaliações de Usuários</Typography>
                {/* ... (o restante do código das reviews continua aqui, sem alterações) ... */}
            </Box>
        </Container>
    );
}

export default GameDetailPage;