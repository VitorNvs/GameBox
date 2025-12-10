// src/components/AdminAchievementsPage.jsx
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
// Importa a nova ação
import { fetchAchievements, addNewAchievement, deleteAchievement, updateAchievement } from '../redux/AchievementsSlice';
import { 
    Container, Box, Typography, TextField, Button, Paper,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    CircularProgress, ButtonGroup, Grid
} from '@mui/material';

import { verifyAdminUser } from '../api';

function AdminAchievementsPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const achievements = useSelector((state) => state.achievements.items);
    const status = useSelector((state) => state.achievements.status);

    const user = useSelector((state) => state.auth.user);
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);

    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState(null); // Vai guardar o _id
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        rule: '',
        icon: ''
    });

    // Sai da página se não estiver logado e não for admin
    useEffect(() => {
        const handleRedirect = (user) => {
            if(!isAuthenticated){
                return "/login";
            }
            if(!verifyAdminUser(user)){
                return "/";
            }
        }
        const page = handleRedirect(user);
        navigate(page);

    }, [isAuthenticated]);

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchAchievements());
        }
    }, [status, dispatch]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData(prevData => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        
        if (isEditing) {
            // Envia o '_id' junto com os dados do formulário
            dispatch(updateAchievement({ ...formData, _id: editingId }));
        } else {
            dispatch(addNewAchievement(formData));
        }
        clearForm();
    };

    const handleDelete = (id) => {
        // 'id' aqui é o '_id' que passamos do botão
        dispatch(deleteAchievement(id));
    };

    const handleEditClick = (ach) => {
        setIsEditing(true);
        // --- CORREÇÃO 1: Guardar '_id' ---
        setEditingId(ach._id); 
        setFormData({
            title: ach.title,
            description: ach.description,
            rule: ach.rule,
            icon: ach.icon
        });
    };

    const clearForm = () => {
        setIsEditing(false);
        setEditingId(null);
        setFormData({ title: '', description: '', rule: '', icon: '' });
    };

    if (status === 'loading') {
        return <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}><CircularProgress /></Box>;
    }

    //Não carrega se não for admin
    if(!verifyAdminUser(user)){
        return
    }

    return (
        <Container component="main" maxWidth="md" sx={{ my: 4 }}>
            <Paper sx={{ p: { xs: 2, md: 4 } }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    {isEditing ? 'Editar Conquista' : 'Adicionar Nova Conquista'}
                </Typography>
                
                <Box component="form" onSubmit={handleSubmit} noValidate>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField name="title" label="Título" value={formData.title} onChange={handleChange} required fullWidth />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField name="icon" label="URL do Ícone" value={formData.icon} onChange={handleChange} fullWidth />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField name="description" label="Descrição" value={formData.description} onChange={handleChange} required fullWidth />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField name="rule" label="Regra (ex: reviews_count >= 1)" value={formData.rule} onChange={handleChange} fullWidth />
                        </Grid>
                    </Grid>
                    
                    <ButtonGroup sx={{ mt: 3 }}>
                        <Button type="submit" variant="contained">
                            {isEditing ? 'Salvar Alterações' : 'Adicionar Conquista'}
                        </Button>
                        {isEditing && (
                            <Button variant="outlined" onClick={clearForm}>
                                Cancelar Edição
                            </Button>
                        )}
                    </ButtonGroup>
                </Box>
            </Paper>

            <Paper sx={{ p: { xs: 2, md: 4 }, mt: 4 }}>
                <Typography variant="h5" component="h2" gutterBottom>
                    Conquistas Existentes
                </Typography>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Ícone</TableCell>
                                <TableCell>Título</TableCell>
                                <TableCell>Descrição</TableCell>
                                <TableCell>Regra</TableCell>
                                <TableCell align="right">Ações</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {/* Verifica se 'achievements' existe antes de mapear */}
                            {achievements && achievements.map((ach) => (
                                // --- CORREÇÃO 2: Usar '_id' para a key ---
                                <TableRow key={ach._id}>
                                    <TableCell><Box component="img" src={ach.icon} alt="ícone" sx={{ width: 40, height: 40, objectFit: 'cover' }} /></TableCell>
                                    <TableCell>{ach.title}</TableCell>
                                    <TableCell>{ach.description}</TableCell>
                                    <TableCell><code>{ach.rule}</code></TableCell>
                                    <TableCell align="right">
                                        <Button size="small" variant="outlined" sx={{ mr: 1 }} onClick={() => handleEditClick(ach)}>Editar</Button>
                                        {/* --- CORREÇÃO 3: Usar '_id' para apagar --- */}
                                        <Button size="small" variant="outlined" color="error" onClick={() => handleDelete(ach._id)}>Remover</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </Container>
    );
}

export default AdminAchievementsPage;