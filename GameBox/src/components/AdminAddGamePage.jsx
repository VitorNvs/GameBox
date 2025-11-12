// src/components/AdminAddGamePage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addNewGame } from '../redux/gamesSlice'; 
import { 
    Container, Box, Typography, TextField, Button, Paper
} from '@mui/material';

function AdminAddGamePage() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // --- MUDANÇA AQUI ---
    const [formData, setFormData] = useState({
        title: '', description: '', price: '', genre: '', image: '', tags: [], rating: ''
    });
    // --- FIM DA MUDANÇA ---

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
        dispatch(addNewGame(formData))
            .unwrap()
            .then(() => {
                alert('Novo jogo adicionado com sucesso!');
                navigate('/jogos');
            })
            .catch((err) => {
                alert('Erro ao adicionar o jogo: ' + err.message);
            });
    };

    return (
        <Container component="main" maxWidth="md" sx={{ py: 4 }}>
            <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 700, textAlign: 'center', mb: 4 }}>
                Adicionar Novo Jogo
            </Typography>
            <Paper sx={{ p: 3, mb: 4 }}>
                <Typography variant="h5" component="h3" gutterBottom>
                    Preencha os dados do novo jogo
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
                    <Button type="submit" variant="contained" sx={{ mt: 2 }} fullWidth>
                        Adicionar Jogo ao Banco de Dados
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
}

export default AdminAddGamePage;