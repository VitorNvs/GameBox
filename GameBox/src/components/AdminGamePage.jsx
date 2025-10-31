import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { unwrapResult } from '@reduxjs/toolkit'; // NOVO: Para tratar erros
import { 
    fetchGameById, 
    addNewGame, 
    updateGame,  // NOVO: Importamos a ação de atualizar
    deleteGame   // NOVO: Importamos a ação de deletar
} from '../redux/gamesSlice';
import {
    Container, Box, Typography, TextField, Button, Paper, Grid, CircularProgress
} from '@mui/material';

const AdminGamePage = () => {
    const { gameId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const isEditMode = Boolean(gameId);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        image: '',
        rating: '',
        price: '',
        genre: '',
        tags: '', 
    });

    // NOVO: Estado para feedback de "carregando"
    const [isSubmitting, setIsSubmitting] = useState(false);

    const gameToEdit = useSelector((state) => state.games.selectedGame);
    // NOVO: Pegamos o status geral, não apenas o 'selectedGameStatus'
    const status = useSelector((state) => state.games.status);
    const selectedGameStatus = useSelector((state) => state.games.selectedGameStatus);

    useEffect(() => {
        if (isEditMode) {
            dispatch(fetchGameById(gameId));
        }
    }, [gameId, dispatch, isEditMode]);

    useEffect(() => {
        // Preenche o formulário se o jogo for carregado no modo de edição
        if (isEditMode && gameToEdit && gameToEdit.id === gameId) {
            setFormData({
                title: gameToEdit.title || '',
                description: gameToEdit.description || '',
                image: gameToEdit.image || '',
                rating: gameToEdit.rating || '',
                price: gameToEdit.price || '',
                genre: gameToEdit.genre || '',
                tags: (gameToEdit.tags || []).join(', '), // Converte o array em string
            });
        }
    }, [isEditMode, gameToEdit, gameId]); // Adicionado gameId para re-preencher se o ID mudar

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // --- NOVO: Lógica do handleSubmit atualizada ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        const gameData = {
            ...formData,
            // Converte a string de tags em array, filtrando itens vazios
            tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag), 
        };

        try {
            if (isEditMode) {
                // Lógica de ATUALIZAÇÃO
                await dispatch(updateGame({ id: gameId, ...gameData })).unwrap();
                alert(`Jogo "${gameData.title}" atualizado!`);
                navigate(`/detalhes_jogo/${gameId}`); // Volta para a página de detalhes do jogo
            } else {
                // Lógica de ADIÇÃO
                const resultAction = await dispatch(addNewGame(gameData)).unwrap();
                alert(`Jogo "${resultAction.title}" adicionado com sucesso!`);
                navigate('/'); // Volta para a Home
            }
        } catch (err) {
            console.error('Falha ao salvar o jogo:', err);
            alert(`Erro ao salvar: ${err.message || err}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    // --- NOVO: Lógica para o botão de Deletar ---
    const handleDelete = async () => {
        // Pede confirmação
        if (!window.confirm(`Tem certeza que deseja remover o jogo "${formData.title}"? Esta ação não pode ser desfeita.`)) {
            return;
        }

        setIsSubmitting(true);
        try {
            await dispatch(deleteGame(gameId)).unwrap();
            alert('Jogo removido com sucesso!');
            navigate('/'); // Volta para a Home após deletar
        } catch (err) {
            console.error('Falha ao remover o jogo:', err);
            alert(`Erro ao remover: ${err.message || err}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isEditMode && selectedGameStatus === 'loading') {
        return <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}><CircularProgress /></Box>;
    }

    return (
        <Container maxWidth="md" sx={{ my: 4 }}>
            <Paper sx={{ p: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom fontWeight="700">
                    {isEditMode ? 'Editar Jogo' : 'Adicionar Novo Jogo'}
                </Typography>
                
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}><TextField name="title" label="Título do Jogo" value={formData.title} onChange={handleChange} fullWidth required /></Grid>
                        <Grid item xs={12}><TextField name="description" label="Descrição" value={formData.description} onChange={handleChange} fullWidth multiline rows={4} /></Grid>
                        <Grid item xs={12}><TextField name="image" label="URL da Imagem de Capa" value={formData.image} onChange={handleChange} fullWidth /></Grid>
                        <Grid item xs={6}><TextField name="rating" label="Nota (0.0 a 10.0)" value={formData.rating} onChange={handleChange} fullWidth /></Grid>
                        <Grid item xs={6}><TextField name="price" label="Preço" value={formData.price} onChange={handleChange} fullWidth /></Grid>
                        <Grid item xs={12}><TextField name="genre" label="Gênero" value={formData.genre} onChange={handleChange} fullWidth /></Grid>
                        <Grid item xs={12}><TextField name="tags" label="Categorias (separadas por vírgula)" value={formData.tags} onChange={handleChange} fullWidth /></Grid>
                    </Grid>
                    <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
                        
                        {/* NOVO: Botão de Salvar/Adicionar atualizado */}
                        <Button 
                            type="submit" 
                            variant="contained" 
                            color="primary"
                            disabled={isSubmitting || status === 'loading'} // Desabilita se estiver salvando
                        >
                            {isSubmitting ? 'Salvando...' : (isEditMode ? 'Salvar Alterações' : 'Adicionar Jogo')}
                        </Button>
                        
                        {/* NOVO: Botão de Remover atualizado */}
                        {isEditMode && (
                            <Button 
                                variant="outlined" 
                                color="error" 
                                onClick={handleDelete} // Conecta a função de deletar
                                disabled={isSubmitting || status === 'loading'} // Desabilita se estiver salvando
                            >
                                Remover Jogo
                            </Button>
                        )}
                    </Box>
                </Box>
            </Paper>
        </Container>
    );
};

export default AdminGamePage;