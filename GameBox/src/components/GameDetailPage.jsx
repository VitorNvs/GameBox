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

    const game = useSelector((state) => state.jogos.selectedGame);
    const status = useSelector((state) => state.jogos.selectedGameStatus);
    const error = useSelector((state) => state.jogos.error);

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
                        {game.tags?.map(tag => <Chip key={tag} label={tag} sx={{ mr: 1, mb: 1 }} />)}
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
                
                {/* --- CÓDIGO DAS AVALIAÇÕES ADICIONADO AQUI --- */}
                
                {/* Verifica se game.reviews existe E tem itens antes de mapear */}
                {game.reviews && game.reviews.length > 0 ? game.reviews.map(review => (
                    
                    // Renderiza cada review dentro de um Card bonitinho
                    <Card key={review.id} sx={{ mb: 2, bgcolor: 'background.paper' }}> 
                        <CardContent>
                            <Box display="flex" alignItems="center" mb={2}>
                                <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                                    {/* Usa a primeira letra do nome ou 'A' se não tiver nome */}
                                    {review.username ? review.username.charAt(0) : (review.userId ? review.userId.charAt(0) : 'A')}
                                </Avatar>
                                <Box sx={{ flexGrow: 1 }}>
                                    <Typography variant="h6">
                                        {/* Mostra o nome de usuário ou um padrão */}
                                        {review.username || 'Usuário Anônimo'}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        {/* Tenta formatar a data, se existir */}
                                        {review.createdAt ? new Date(review.createdAt).toLocaleDateString() : (review.date || '')}
                                    </Typography>
                                </Box>
                                
                                {/* Chama a função renderRatingIcon que já existe no seu arquivo */}
                                {renderRatingIcon(review.ratingIcon || review.rating)} 
                            </Box>
                            
                            <Typography paragraph color="text.secondary">
                                {review.text}
                            </Typography>
                        </CardContent>
                    </Card>

                )) : (
                    // Mensagem padrão se não houver reviews
                    <Typography sx={{ ml: 1, color: 'text.secondary', fontStyle: 'italic' }}>
                        Ainda não há avaliações para este jogo.
                    </Typography>
                )}
                {/* --- FIM DO CÓDIGO DAS AVALIAÇÕES --- */}
            </Box>
        </Container>
    );
}

export default GameDetailPage;