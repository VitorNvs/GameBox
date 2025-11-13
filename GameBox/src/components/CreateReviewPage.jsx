// src/components/CreateReviewPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchGameById } from '../redux/gamesSlice';
import { unwrapResult } from '@reduxjs/toolkit';
import { createReview } from '../redux/reviewsSlice'; 

import {
  Container,
  Box,
  Typography,
  Grid,
  Paper,
  TextField,
  Button,
  ToggleButtonGroup,
  ToggleButton,
  CircularProgress
} from '@mui/material';
import { ThumbDown, ThumbUp, Favorite } from '@mui/icons-material';

const CreateReviewPage = () => {
  const { gameId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const game = useSelector((state) => state.jogos.selectedGame);
  const status = useSelector((state) => state.jogos.selectedGameStatus);

  const [feedback, setFeedback] = useState('');
  const [reviewText, setReviewText] = useState('');
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

  // --- FUNÇÃO handleSubmit CORRIGIDA ---
  const handleSubmit = async (e) => {
    e.preventDefault();

    const reviewData = {
      gameId,
      rating: feedback,
      text: reviewText,
      userId: 'ID_DO_USUARIO_LOGADO' // depois substitui pelo user real
    };

    setIsSubmitting(true);
    try {
      const resultAction = await dispatch(createReview(reviewData));
      unwrapResult(resultAction);

      // se salvar com sucesso → volta pra página do jogo
      navigate(`/jogos/${gameId}`, { replace: true });

    } catch (err) {
      console.error('Falha ao salvar a análise:', err);
      alert(`Erro ao salvar: ${err.message || err}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status === 'loading' || !game) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ my: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography
          variant="h4"
          component="h1"
          align="center"
          gutterBottom
          fontWeight="700"
        >
          {game.title}
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={4} sx={{ mt: 2 }}>
            <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
              <Box
                component="img"
                src={game.image}
                alt={`Capa de ${game.title}`}
                sx={{
                  width: '100%',
                  maxWidth: 250,
                  borderRadius: 2,
                  mb: 2
                }}
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
