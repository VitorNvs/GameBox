// src/components/CreateReviewPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchGameById } from '../redux/gamesSlice';
import { unwrapResult } from '@reduxjs/toolkit'; // Importamos isso para lidar com o resultado

// NOVO: Vamos importar a ação de criar review (que faremos no Passo 3)
import { createReview } from '../redux/reviewsSlice'; 

import {
    Container, Box, Typography, Grid, Paper, TextField, Button, ToggleButtonGroup, ToggleButton, CircularProgress
} from '@mui/material';
import { ThumbDown, ThumbUp, Favorite } from '@mui/icons-material';

const CreateReviewPage = () => {
    const { gameId } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const game = useSelector((state) => state.games.selectedGame);
    const status = useSelector((state) => state.games.selectedGameStatus);

    const [feedback, setFeedback] = useState('');
    const [reviewText, setReviewText] = useState('');
    // NOVO: Estado de loading para o envio
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (gameId) {
            dispatch(fetchGameById(gameId));
        }
    }, [gameId, dispatch]);

    const handleFeedback = (event, newFeedback) => {
        if (newFeedback !== null) {
            setFeedback(newFeedback);
        }
    };
    
    // --- FUNÇÃO handleSubmit ATUALIZADA ---
    const handleSubmit = async (event) => {
        event.preventDefault(); 
        
        // Validação simples
        if (!feedback || !reviewText.trim()) {
            alert('Por favor, selecione uma nota (like/dislike/love) e escreva sua análise.');
            return;
        }

        const reviewData = {
            gameId: gameId,
            rating: feedback, 
            text: reviewText, 
            userId: 'ID_DO_USUARIO_LOGADO' // (Você precisará pegar isso do seu estado de auth)
        };

        setIsSubmitting(true); // Trava o botão
        try {
            // Dispara a ação de salvar (que faremos no Passo 3)
            const resultAction = await dispatch(createReview(reviewData));
            unwrapResult(resultAction); // Verifica se deu erro

            // Se deu certo:
            alert('Análise enviada com sucesso!');
            navigate(`/detalhes_jogo/${gameId}`); // Navega de volta

        } catch (err) {
    // Se deu errado:
    console.error('Falha ao salvar a análise:', err);
    // 'err' agora é a própria mensagem de erro (ex: "Network Error")
    alert(`Erro ao salvar: ${err}`);
        } finally {
            setIsSubmitting(false); // Libera o botão
        }
    };

    if (status === 'loading' || !game) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}><CircularProgress /></Box>;
    }

    return (
        <Container maxWidth="md" sx={{ my: 4 }}>
            <Paper sx={{ p: 4 }}>
                <Typography variant="h4" component="h1" align="center" gutterBottom fontWeight="700">
                    {game.title}
                </Typography>

                <Box component="form" onSubmit={handleSubmit}>
                    <Grid container spacing={4} sx={{ mt: 2 }}>
                        <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
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
                                value={reviewText}
                                onChange={(e) => setReviewText(e.target.value)}
                            />
                        </Grid>
                    </Grid>
                    
                    <Button 
                        type="submit" 
                        variant="contained" 
                        size="large" 
                        sx={{ mt: 4 }}
                        // NOVO: Desabilita o botão enquanto salva
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Enviando...' : 'Enviar Análise'}
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
};

export default CreateReviewPage;