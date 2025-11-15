// src/components/MyListsPage.jsx
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom'; // 1. IMPORTAMOS O LINK
import { fetchLists, createList, deleteList } from '../redux/listsSlice'; // 2. REMOVEMOS O 'updateListDetails' DAQUI
import { 
    Container, Box, Typography, Grid, Card, CardContent, 
    TextField, Button, Paper, CircularProgress
} from '@mui/material';

function MyListsPage() {
    const [newListTitle, setNewListTitle] = useState('');
    const [newListDescription, setNewListDescription] = useState('');
    const dispatch = useDispatch();
    const lists = useSelector((state) => state.lists.items);
    const status = useSelector(state => state.lists.status);
    const listsError = useSelector(state => state.lists.error);

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchLists());
        }
    }, [status, dispatch]);

    // 3. REMOVEMOS OS ESTADOS 'isEditing' e 'editingId'
    const [formData, setFormData] = useState({ title: '', description: '' });

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData(prevData => ({ ...prevData, [name]: value }));
    };

    const resetForm = () => {
        setFormData({ title: '', description: '' });
    };

    // 4. handleSubmit agora só CRIA listas
    const handleSubmit = (event) => {
        event.preventDefault();
        dispatch(createList(formData));
        resetForm();
    };

    const handleDeleteList = async (listId) => {
            if (window.confirm('Tem certeza que deseja excluir esta lista? Esta ação é irreversível.')) {
                try {
                    // Chama o thunk de exclusão
                    await dispatch(deleteList(listId)).unwrap(); 
                    alert('Lista excluída com sucesso!');
                } catch (error) {
                    console.error("Erro ao deletar a lista:", error);
                    alert(`Falha ao excluir a lista. Erro: ${error}`);
                }
            }
    };

    return (
        <Container component="main" maxWidth="lg" sx={{ py: 4 }}>
            <Grid container spacing={4}>
                {/* Coluna da Esquerda: Listas Existentes */}
                <Grid item xs={12} md={7}>
                    <Typography variant="h4" component="h3" gutterBottom sx={{ fontWeight: 'bold' }}>
                        Minhas Listas
                    </Typography>
                    
                    {status === 'loading' && <CircularProgress sx={{ display: 'block', m: 'auto' }} />}

                    <Grid container spacing={3}>
                        {lists.map((list) => (
                            <Grid item xs={12} key={list.id}>
                                <Card sx={{ transition: 'transform 0.3s', '&:hover': { transform: 'translateY(-5px)' } }}>
                                    <CardContent>
                                        <Typography variant="h5" color="primary" sx={{ fontWeight: 'bold' }}>
                                            {list.title}
                                        </Typography>
                                        <Typography variant="body1" color="text.secondary" paragraph>
                                            {list.description}
                                        </Typography>
                                        <Typography variant="caption" display="block" color="text.primary" sx={{ mb: 2 }}>
                                            {list.gamesCount || 0} jogos na lista
                                        </Typography>
                                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                                            {/* 5. BOTÃO "EDITAR" AGORA É UM LINK! */}
                                            <Button 
                                                variant="outlined" 
                                                size="small" 
                                                component={Link} 
                                                to={`/minhas-listas/editar/${list.id}`}
                                            >
                                                Editar
                                            </Button>
                                            {/* corrigido: chama handleDeleteList */}
                                            <Button variant="outlined" size="small" color="error" onClick={() => handleDeleteList(list.id)}>Excluir</Button>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Grid>

                {/* Coluna da Direita: Formulário de Criação (agora só para criar) */}
                <Grid item xs={12} md={5}>
                    <Paper sx={{ p: 3, bgcolor: 'background.paper', position: 'sticky', top: '20px' }}>
                        <Typography variant="h4" component="h3" gutterBottom sx={{ fontWeight: 'bold' }}>
                            Criar Lista de Jogos
                        </Typography>
                        <Box component="form" onSubmit={handleSubmit}>
                            <TextField fullWidth margin="normal" required name="title" label="Título da Lista" value={formData.title} onChange={handleChange} />
                            <TextField fullWidth margin="normal" name="description" label="Descrição" multiline rows={4} value={formData.description} onChange={handleChange} />
                            <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }} disabled={status === 'loading'}>
                                Salvar Lista
                            </Button>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
}

export default MyListsPage;