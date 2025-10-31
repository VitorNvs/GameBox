// src/components/AdminAchievementsPage.jsx
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
// Garanta que o nome do arquivo aqui está em minúsculo: 'achievementsSlice'
import { fetchAchievements, addNewAchievement, deleteAchievement, updateAchievement } from '../redux/achievementsSlice';
import { 
    Container, Box, Typography, TextField, Button, Paper,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    CircularProgress, ButtonGroup
} from '@mui/material';

function AdminAchievementsPage() {
    const dispatch = useDispatch();
    const achievements = useSelector((state) => state.achievements.items);
    const status = useSelector((state) => state.achievements.status);
    
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        rule: '',
        icon: ''
    });

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchAchievements());
        }
    }, [status, dispatch]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData(prevData => ({ ...prevData, [name]: value }));
    };

    const resetForm = () => {
        setFormData({ title: '', description: '', rule: '', icon: '' });
        setIsEditing(false);
        setEditingId(null);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (isEditing) {
            dispatch(updateAchievement({ id: editingId, ...formData }));
        } else {
            dispatch(addNewAchievement(formData));
        }
        resetForm();
    };

    const handleEditClick = (achievement) => {
        setIsEditing(true);
        setEditingId(achievement.id);
        setFormData({
            title: achievement.title,
            description: achievement.description,
            rule: achievement.rule,
            icon: achievement.icon
        });
        window.scrollTo(0, 0); 
    };

    // --- AQUI ESTÁ A FUNÇÃO CORRIGIDA E COMPLETA ---
    const handleDelete = (id) => {
        // 1. Mostra o pop-up de confirmação
        if (window.confirm('Tem certeza que quer remover esta conquista?')) {
            // 2. Se o usuário clicar "OK", dispara a ação de deletar
            dispatch(deleteAchievement(id));
        }
    };
    // --- FIM DA CORREÇÃO ---

    return (
        <Container component="main" maxWidth="lg" sx={{ py: 4 }}>
            <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 700, textAlign: 'center', mb: 4 }}>
                Gerenciamento de Conquistas
            </Typography>

            {/* Formulário (agora dinâmico) */}
            <Paper sx={{ p: 3, mb: 4 }}>
                <Typography variant="h5" component="h3" gutterBottom>
                    {isEditing ? `Editando: ${formData.title}` : 'Adicionar Nova Conquista'}
                </Typography>
                <Box component="form" onSubmit={handleSubmit}>
                    <TextField fullWidth margin="normal" required id="ach-title" name="title" label="Título da Conquista" value={formData.title} onChange={handleChange} />
                    <TextField fullWidth margin="normal" required id="ach-description" name="description" label="Descrição" multiline rows={3} value={formData.description} onChange={handleChange} />
                    <TextField fullWidth margin="normal" id="ach-rule" name="rule" label="Regra da Conquista (para o sistema)" value={formData.rule} onChange={handleChange} />
                    <TextField fullWidth margin="normal" id="ach-icon" name="icon" label="URL do Ícone" value={formData.icon} onChange={handleChange} />
                    
                    <ButtonGroup sx={{ mt: 2 }} fullWidth>
                        <Button type="submit" variant="contained" disabled={status === 'loading'}>
                            {status === 'loading' ? 'Salvando...' : (isEditing ? 'Atualizar Conquista' : 'Salvar Conquista')}
                        </Button>
                        {isEditing && (
                            <Button variant="outlined" color="secondary" onClick={resetForm}>
                                Cancelar Edição
                            </Button>
                        )}
                    </ButtonGroup>
                </Box>
            </Paper>

            {/* Tabela de Conquistas Existentes */}
            <Paper sx={{ p: 3 }}>
                <Typography variant="h5" component="h3" gutterBottom>
                    Conquistas Existentes
                </Typography>
                <TableContainer>
                    {status === 'loading' && <CircularProgress sx={{ m: 'auto' }} />}
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
                            {achievements.map((ach) => (
                                <TableRow key={ach.id}>
                                    <TableCell><Box component="img" src={ach.icon} alt="ícone" sx={{ width: 40, height: 40 }} /></TableCell>
                                    <TableCell>{ach.title}</TableCell>
                                    <TableCell>{ach.description}</TableCell>
                                    <TableCell><code>{ach.rule}</code></TableCell>
                                    <TableCell align="right">
                                        <Button size="small" variant="outlined" sx={{ mr: 1 }} onClick={() => handleEditClick(ach)}>Editar</Button>
                                        {/* Este botão agora chama a função handleDelete correta */}
                                        <Button size="small" variant="outlined" color="error" onClick={() => handleDelete(ach.id)}>Remover</Button>
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