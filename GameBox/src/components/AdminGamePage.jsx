import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchGameById, addNewGame } from '../redux/gamesSlice';
import {
    Container, Box, Typography, TextField, Button, Paper, Grid, CircularProgress
} from '@mui/material';

const AdminGamePage = () => {
    const { gameId } = useParams(); // Pega o ID da URL, se existir
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Determina se estamos em modo de edição ou adição
    const isEditMode = Boolean(gameId);

    // Estado local para controlar os campos do formulário
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        image: '',
        rating: '',
        price: '',
        genre: '',
        tags: '', // Usaremos uma string para o input, e converteremos para array ao enviar
    });

    // Busca os dados do Redux
    const gameToEdit = useSelector((state) => state.games.selectedGame);
    const status = useSelector((state) => state.games.selectedGameStatus);

    // Se estiver em modo de edição, busca os dados do jogo quando o componente carrega
    useEffect(() => {
        if (isEditMode) {
            dispatch(fetchGameById(gameId));
        }
    }, [gameId, dispatch, isEditMode]);

    // Preenche o formulário com os dados do jogo quando eles são carregados
    useEffect(() => {
        if (isEditMode && gameToEdit) {
            setFormData({
                title: gameToEdit.title,
                description: gameToEdit.description,
                image: gameToEdit.image,
                rating: gameToEdit.rating,
                price: gameToEdit.price,
                genre: gameToEdit.genre,
                tags: gameToEdit.tags.join(', '), // Converte o array de tags em string
            });
        }
    }, [isEditMode, gameToEdit]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const gameData = {
            ...formData,
            tags: formData.tags.split(',').map(tag => tag.trim()), // Converte a string de tags em array
        };

        if (isEditMode) {
            // Lógica de ATUALIZAÇÃO viria aqui (futuramente)
            alert(`Jogo "${gameData.title}" atualizado! (funcionalidade a ser implementada)`);
        } else {
            // Lógica de ADIÇÃO
            dispatch(addNewGame(gameData)).then(() => {
                alert(`Jogo "${gameData.title}" adicionado com sucesso!`);
                navigate('/jogos'); // Redireciona para a página de jogos
            });
        }
    };

    if (isEditMode && status === 'loading') {
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
                        <Button type="submit" variant="contained" color="primary">
                            {isEditMode ? 'Salvar Alterações' : 'Adicionar Jogo'}
                        </Button>
                        {isEditMode && <Button variant="outlined" color="error">Remover Jogo</Button>}
                    </Box>
                </Box>
            </Paper>
        </Container>
    );
};

export default AdminGamePage;