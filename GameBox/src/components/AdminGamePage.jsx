// src/components/AdminGamePage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
// 1. Importa do gamesSlice!
import { fetchGameById, updateGame } from '../redux/gamesSlice'; 
import { 
    Container, Box, Typography, TextField, Button, Paper,
    CircularProgress 
} from '@mui/material';

function AdminGamePage() {
    const { gameId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // 2. Busca o jogo selecionado e o status do Redux
    const game = useSelector((state) => state.games.selectedGame);
    const status = useSelector((state) => state.games.selectedGameStatus);

    // 3. Estado local para o formulário
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        genre: '',
        image: '',
        tags: [] // Tags como um array
    });

    // 4. Busca os dados do jogo quando a página carrega
    useEffect(() => {
        if (gameId) {
            dispatch(fetchGameById(gameId));
        }
    }, [gameId, dispatch]);

    // 5. Preenche o formulário quando os dados do jogo chegam do Redux
    useEffect(() => {
        if (game) {
            setFormData({
                title: game.title || '',
                description: game.description || '',
                price: game.price || '',
                genre: game.genre || '',
                image: game.image || '',
                tags: game.tags || [] // Garante que 'tags' seja um array
            });
        }
    }, [game]); // Depende do 'game' do Redux

    // 6. Funções para atualizar o estado do formulário
    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData(prevData => ({ ...prevData, [name]: value }));
    };

    const handleTagsChange = (event) => {
        // Converte a string "tag1, tag2" em um array ["tag1", "tag2"]
        const tagsArray = event.target.value.split(',').map(tag => tag.trim());
        setFormData(prevData => ({ ...prevData, tags: tagsArray }));
    };

    // 7. Função de Salvar (Atualizar)
    const handleSubmit = (event) => {
        event.preventDefault();
        // Envia os dados atualizados para o Redux (que manda pro server.js)
        dispatch(updateGame({ id: gameId, ...formData }));
        alert('Jogo atualizado com sucesso!');
        navigate(`/jogos/${gameId}`); // Volta para a página de detalhes
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
                    <TextField fullWidth margin="normal" required id="game-title" name="title" label="Título do Jogo" value={formData.title} onChange={handleChange} />
                    <TextField fullWidth margin="normal" required id="game-desc" name="description" label="Descrição" multiline rows={4} value={formData.description} onChange={handleChange} />
                    <TextField fullWidth margin="normal" id="game-price" name="price" label="Preço" placeholder="R$ 199,90" value={formData.price} onChange={handleChange} />
                    <TextField fullWidth margin="normal" id="game-genre" name="genre" label="Gênero" placeholder="Ação-Aventura" value={formData.genre} onChange={handleChange} />
                    <TextField fullWidth margin="normal" id="game-image" name="image" label="URL da Imagem da Capa" value={formData.image} onChange={handleChange} />
                    <TextField 
                        fullWidth 
                        margin="normal" 
                        id="game-tags" 
                        name="tags" 
                        label="Tags (separadas por vírgula)" 
                        placeholder="Ação, Terror, Furtividade"
                        value={formData.tags.join(', ')} // Converte o array em string para exibir
                        onChange={handleTagsChange} 
                    />
                    
                    <Button type="submit" variant="contained" sx={{ mt: 2 }} fullWidth>
                        Salvar Alterações
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
}

export default AdminGamePage; // <-- O export está correto!