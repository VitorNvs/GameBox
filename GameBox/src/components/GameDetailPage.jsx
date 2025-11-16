// src/components/GameDetailPage.jsx
import React, { useEffect, useState } from 'react';
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
    Avatar,
    Popper
} from '@mui/material';

import FavoriteIcon from '@mui/icons-material/Favorite';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';

import MiniProfile from './MiniProfile'; // <= usa o teu novo componente

const renderRatingIcon = (icon) => {
    if (!icon) return null;

    if (icon === 'love' || icon === 'heart') return <FavoriteIcon color="error" />;
    if (icon === 'like' || icon === 'thumb-up') return <ThumbUpIcon color="primary" />;
    if (icon === 'dislike' || icon === 'thumb-down') return <ThumbDownIcon color="action" />;

    return null;
};

function GameDetailPage() {
    const { gameId } = useParams();
    const dispatch = useDispatch();

    const game = useSelector((state) => state.jogos.selectedGame);
    const status = useSelector((state) => state.jogos.selectedGameStatus);
    const error = useSelector((state) => state.jogos.error);

    // ---- Estados globais do hover ----
    const [anchorEl, setAnchorEl] = useState(null);
    const [hoverUser, setHoverUser] = useState(null);
    const [open, setOpen] = useState(false);

    let enterTimer;
    let leaveTimer;

   const handleEnter = (event, user) => {
    clearTimeout(leaveTimer);

    enterTimer = setTimeout(() => {
        setHoverUser(user);
        setAnchorEl(event.currentTarget);
        setOpen(true);
    }, 120);
};
        const handleLeave = () => {
            clearTimeout(enterTimer);

            leaveTimer = setTimeout(() => {
                setOpen(false);
            }, 120);
        };

    useEffect(() => {
        if (gameId) {
            dispatch(fetchGameById(gameId));
        }
    }, [gameId, dispatch]);

    if (status === 'loading' || !game) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (status === 'failed') {
        return <Typography color="error">Erro ao carregar o jogo: {error}</Typography>;
    }

    return (
        <Container maxWidth="lg" sx={{ my: 4 }}>

            {/* INFO DO JOGO */}
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 4 }}>
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
                    <Typography variant="h3" fontWeight="700">{game.title}</Typography>

                    <Box display="flex" gap={2} my={2}>
                        <Card variant="outlined">
                            <CardContent sx={{ textAlign: 'center' }}>
                                <Typography variant="overline">NOTA</Typography>
                                <Typography variant="h5">{game.rating} / 10</Typography>
                            </CardContent>
                        </Card>

                        <Card variant="outlined">
                            <CardContent sx={{ textAlign: 'center' }}>
                                <Typography variant="overline">PREÇO</Typography>
                                <Typography variant="h5">{game.price}</Typography>
                            </CardContent>
                        </Card>
                    </Box>

                    <Box my={2}>
                        <Typography variant="h6" gutterBottom>Gênero</Typography>
                        <Chip label={game.genre} color="primary" />
                    </Box>

                    <Box my={2}>
                        <Typography variant="h6" gutterBottom>Categorias</Typography>
                        {game.tags?.map(tag => (
                            <Chip key={tag} label={tag} sx={{ mr: 1, mb: 1 }} />
                        ))}
                    </Box>

                    <Box my={2}>
                        <Typography variant="h5" gutterBottom>Descrição</Typography>
                        <Typography paragraph color="text.secondary">{game.description}</Typography>
                    </Box>

                    <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
                        <Button variant="contained" component={Link} to={`/review/criar/${gameId}`}>
                            Escrever Análise
                        </Button>
                        <Button variant="outlined" component={Link} to={`/admin/jogo/${gameId}`}>
                            Editar Jogo (Admin)
                        </Button>
                    </Box>
                </Box>
            </Box>

            {/* AVALIAÇÕES */}
            <Box mt={6}>
                <Typography variant="h4" fontWeight="700" gutterBottom>
                    Avaliações de Usuários
                </Typography>

                {game.reviews && game.reviews.length > 0 ? (
                    game.reviews.map((review) => (
                        <Card key={review._id} sx={{ mb: 2 }}>
                            <CardContent>

                                <Box display="flex" alignItems="center" mb={2}>

                                    {/* AVATAR */}
                                    <Avatar
                                        src={review.userId?.avatar}
                                        sx={{ mr: 2, width: 48, height: 48, cursor: "pointer" }}
                                        onMouseEnter={(e) => handleEnter(e, review.userId)}
                                        onMouseLeave={handleLeave}
                                    >
                                        {!review.userId?.avatar && review.userId?.username?.charAt(0)}
                                    </Avatar>

                                    <Box
                                        sx={{ flexGrow: 1 }}
                                        onMouseEnter={(e) => handleEnter(e, review.userId)}
                                        onMouseLeave={handleLeave}
                                    >
                                        <Typography variant="h6" sx={{ cursor: 'pointer' }}>
                                            {review.userId?.username}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {new Date(review.createdAt).toLocaleDateString()}
                                        </Typography>
                                    </Box>

                                    {renderRatingIcon(review.ratingIcon || review.rating)}
                                </Box>

                                <Typography paragraph color="text.secondary">
                                    {review.text}
                                </Typography>

                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <Typography sx={{ ml: 1, color: 'text.secondary', fontStyle: 'italic' }}>
                        Ainda não há avaliações para este jogo.
                    </Typography>
                )}
            </Box>

            {/* MINI PERFIL POPPER */}
            <Popper
    open={open}
    anchorEl={anchorEl}
    placement="top"
    sx={{ zIndex: 9999 }}
    modifiers={[
        {
            name: "offset",
            options: {
                offset: [0, 12],  // sobe um pouco acima do avatar
            },
        },
        {
            name: "preventOverflow",
            options: {
                padding: 8,
                boundary: "viewport",
            },
        },
    ]}
>
    <Box sx={{ pointerEvents: "none" }}>
        <MiniProfile user={hoverUser} />
    </Box>
</Popper>


        </Container>
    );
}

export default GameDetailPage;
