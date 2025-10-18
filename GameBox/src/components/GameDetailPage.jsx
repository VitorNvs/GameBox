// src/components/GameDetailPage.jsx
import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
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
            <Box 
                sx={{ 
                    display: 'flex', 
                    flexDirection: { xs: 'column', sm: 'row' }, 
                    gap: 4 
                }}
            >
                <Box sx={{ width: { xs: '100%', sm: '33.33%' } }}>
                    <Box 
                        component="img" 
                        src={game.image} 
                        alt={`Capa de ${game.title}`} 
                        sx={{ 
                            width: '100%', 
                            borderRadius: 2,
                            height: { xs: 'auto', sm: 450 },
                            objectFit: 'cover'
                        }} 
                    />
                </Box>
                
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
                    
                    {/* BOTÕES DE AÇÃO ATUALIZADOS */}
                    <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
                        <Button
                            variant="contained"
                            component={Link}
                            to={`/review/criar/${gameId}`}
                        >
                            Escrever Análise
                        </Button>
                        <Button
                            variant="outlined"
                            component={Link}
                            to={`/admin/jogo/${gameId}`}
                        >
                            Editar Jogo (Admin)
                        </Button>
                    </Box>
                </Box>
            </Box>

            {/* Seção de Avaliações */}
            <Box mt={6}>
                <Typography variant="h4" component="h2" fontWeight="700" gutterBottom>Avaliações de Usuários</Typography>
                {/* O código das reviews continua aqui... */}
            </Box>
        </Container>
    );
}

export default GameDetailPage;