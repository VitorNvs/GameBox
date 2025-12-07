// src/components/MyListsPage.jsx
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchLists, createList, deleteList } from '../redux/listsSlice';
import {
  Container, Box, Typography, Grid, Card, CardContent,
  TextField, Button, Paper, CircularProgress
} from '@mui/material';

function MyListsPage() {
  const dispatch = useDispatch();
  const lists = useSelector((state) => state.lists.items);
  const status = useSelector(state => state.lists.status);

  useEffect(() => {
    if (status === 'idle') dispatch(fetchLists());
  }, [status, dispatch]);

  const [formData, setFormData] = useState({ title: '', description: '', jogos: [] });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const resetForm = () => setFormData({ title: '', description: '', jogos: [] });

  const handleSubmit = (e) => {
    e.preventDefault();
    // createList expects jogos array; for basic creation we send empty array
    dispatch(createList({ title: formData.title, description: formData.description, jogos: [] }));
    resetForm();
  };

  const handleDeleteList = async (listId) => {
    if (!window.confirm('Tem certeza que deseja excluir esta lista?')) return;
    try {
      await dispatch(deleteList(listId)).unwrap();
      alert('Lista excluída com sucesso!');
    } catch (err) {
      console.error(err);
      alert('Erro ao excluir a lista.');
    }
  };

  return (
    <Container component="main" maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={4}>
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
                    <Typography variant="caption">
                    {list.gamesCount ?? (list.games?.length ?? 0)} jogos na lista
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                      <Button
                        variant="outlined"
                        size="small"
                        component={Link}
                        to={`/minhas-listas/editar/${list.id}`}
                      >
                        Editar
                      </Button>
                      <Button variant="outlined" size="small" color="error" onClick={() => handleDeleteList(list.id)}>
                        Excluir
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>

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