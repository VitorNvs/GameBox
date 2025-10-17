import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchGameById } from '../redux/gamesSlice';
import {
    Container, Box, Typography, Grid, Paper, TextField, Button, ToggleButtonGroup, ToggleButton, CircularProgress
} from '@mui/material';
import { ThumbDown, ThumbUp, Favorite } from '@mui/icons-material';

const CreateReviewPage = () => {
    const { gameId } = useParams(); // Pega o ID da URL
    const dispatch = useDispatch();

    const game = useSelector((state) => state.games.selectedGame);
    const status = useSelector((state) => state.games.selectedGameStatus);

    const [feedback, setFeedback] = React.useState('');

    useEffect(() => {
        // Busca os dados do jogo se o ID da URL for válido
        if (gameId) {
            dispatch(fetchGameById(gameId));
        }
    }, [gameId, dispatch]);

    const handleFeedback = (event, newFeedback) => {
        if (newFeedback !== null) {
            setFeedback(newFeedback);
        }
    };
    
    // Mostra um spinner enquanto carrega os dados do jogo
    if (status === 'loading' || !game) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}><CircularProgress /></Box>;
    }

    return (
        <Container maxWidth="md" sx={{ my: 4 }}>
            <Paper sx={{ p: 4 }}>
                {/* Título dinâmico */}
                <Typography variant="h4" component="h1" align="center" gutterBottom fontWeight="700">
                    {game.title}
                </Typography>
                <Box component="form">
                    <Grid container spacing={4} sx={{ mt: 2 }}>
                        <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
                            {/* Imagem dinâmica */}
                            <Box
                                component="img"
                                src={game.image}
                                alt={`Capa de ${game.title}`}
                                sx={{ width: '100%', maxWidth: 250, borderRadius: 2, mb: 2 }}
                            />
                            <ToggleButtonGroup
                                value={feedback}
                                exclusive
                                onChange={handleFeedback}
                                fullWidth
                            >
                                <ToggleButton value="dislike" sx={{ flexGrow: 1 }}>
                                    <ThumbDown />
                                </ToggleButton>
                                <ToggleButton value="like" sx={{ flexGrow: 1 }}>
                                    <ThumbUp />
                                </ToggleButton>
                                <ToggleButton value="love" sx={{ flexGrow: 1 }}>
                                    <Favorite />
                                </ToggleButton>
                            </ToggleButtonGroup>
                        </Grid>
                        <Grid item xs={12} md={8}>
                            <TextField
                                fullWidth
                                multiline
                                rows={15}
                                label="Sua Análise"
                                placeholder="Escreva sua análise aqui..."
                            />
                        </Grid>
                    </Grid>
                    <Button variant="contained" size="large" sx={{ mt: 4 }}>
                        Enviar Análise
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
};

export default CreateReviewPage;