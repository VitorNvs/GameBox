// src/components/AdminGamePage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchGameById, updateGame, deleteGame } from '../redux/gamesSlice'; 
import { 
    Container, Box, Typography, TextField, Button, Paper,
    CircularProgress 
} from '@mui/material';

function AdminGamePage() {
    const { gameId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const game = useSelector((state) => state.jogos.selectedGame);
    const status = useSelector((state) => state.jogos.selectedGameStatus);

    // --- MUDANÇA AQUI ---
    const [formData, setFormData] = useState({
        title: '', description: '', price: '', genre: '', image: '', tags: [], rating: ''
    });
    // --- FIM DA MUDANÇA ---

    useEffect(() => {
        if (gameId) {
            dispatch(fetchGameById(gameId));
        }
    }, [gameId, dispatch]);

    useEffect(() => {
        if (game) {
            setFormData({
                title: game.title || '',
                description: game.description || '',
                price: game.price || '',
                genre: game.genre || '',
                image: game.image || '',
                tags: game.tags || [],
                rating: game.rating || ''
            });
        }
    }, [game]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData(prevData => ({ ...prevData, [name]: value }));
    };

    const handleTagsChange = (event) => {
        const tagsArray = event.target.value.split(',').map(tag => tag.trim());
        setFormData(prevData => ({ ...prevData, tags: tagsArray }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        dispatch(updateGame({ id: gameId, ...formData }))
            .unwrap()
            .then(() => {
                alert('Jogo atualizado com sucesso!');
                navigate(`/jogos/${gameId}`); 
            })
            .catch(err => alert('Erro ao atualizar: ' + err.message));
    };

    const handleDelete = () => {
        if (window.confirm('Tem certeza que quer excluir este jogo PERMANENTEMENTE?')) {
            dispatch(deleteGame(gameId))
                .unwrap()
                .then(() => {
                    alert('Jogo excluído com sucesso!');
                    navigate('/jogos');
                })
                .catch(err => alert('Erro ao excluir: ' + err.message));
        }
    };

    if (status === 'loading' || !game) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}><CircularProgress /></Box>;
    }

    return (
        <Container component="main" maxWidth="md" sx={{ py: 4 }}>
            <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 700, textAlign: 'center', mb: 4 }}>
                Editar Jogo
            </Typography>
            <Paper sx={{ p: 3, mb: 4 }}>
                <Typography variant="h5" component="h3" gutterBottom>
                    {formData.title}
                </Typography>
                <Box component="form" onSubmit={handleSubmit}>
                    <TextField fullWidth margin="normal" required name="title" label="Título do Jogo" value={formData.title} onChange={handleChange} />
                    <TextField fullWidth margin="normal" required name="description" label="Descrição" multiline rows={4} value={formData.description} onChange={handleChange} />
                    <TextField fullWidth margin="normal" name="price" label="Preço" placeholder="R$ 199,90" value={formData.price} onChange={handleChange} />
                    
                    {/* --- MUDANÇA AQUI --- */}
                    <TextField fullWidth margin="normal" name="rating" label="Nota (Rating)" placeholder="Ex: 9.5" value={formData.rating} onChange={handleChange} />
                    {/* --- FIM DA MUDANÇA --- */}

                    <TextField fullWidth margin="normal" name="genre" label="Gênero" placeholder="Ação-Aventura" value={formData.genre} onChange={handleChange} />
                    <TextField fullWidth margin="normal" name="image" label="URL da Imagem da Capa" value={formData.image} onChange={handleChange} />
                    <TextField 
                        fullWidth 
                        margin="normal" 
                        name="tags" 
                        label="Tags (separadas por vírgula)" 
                        placeholder="Ação, Terror, Furtividade"
                        value={formData.tags.join(', ')} 
                        onChange={handleTagsChange} 
                    />
                    <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                        <Button type="submit" variant="contained" fullWidth>
                            Salvar Alterações
                        </Button>
                        <Button variant="outlined" color="error" fullWidth onClick={handleDelete}>
                            Excluir Jogo
                        </Button>
                    </Box>
                </Box>
            </Paper>
        </Container>
    );
}

export default AdminGamePage; // <-- O export está correto!