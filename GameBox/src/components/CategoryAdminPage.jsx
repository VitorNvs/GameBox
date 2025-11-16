// src/components/AdminCategoriesPage.jsx
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
// Ação de CATEGORIAS (Você precisará criar este slice)
import { 
    fetchCategories, 
    addNewCategory, 
    deleteCategory, 
    updateCategory 
} from '../redux/CategorySlice'; 
import { 
    Container, Box, Typography, TextField, Button, Paper,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    CircularProgress, ButtonGroup, Grid
} from '@mui/material';

function AdminCategoriesPage() {
    const dispatch = useDispatch();
    // Ajuste o estado do seletor para 'categories'
    const categories = useSelector((state) => state.categories.items);
    const status = useSelector((state) => state.categories.status);
    
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState(null); // Guarda o _id da categoria
    
    // Ajuste os campos do formulário para Categoria
    const [formData, setFormData] = useState({
        title: '',
        description: '', 
        imagem: '',
        alt: '',
        color: '',
        id: ''
    });

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchCategories());
        }
    }, [status, dispatch]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData(prevData => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        
        if (isEditing) {
            // Envia o '_id' junto com os dados do formulário para atualização
            dispatch(updateCategory({ ...formData, _id: editingId }));
        } else {
            dispatch(addNewCategory(formData));
        }
        clearForm();
    };

    const handleDelete = (id) => {
        dispatch(deleteCategory(id));
    };

    const handleEditClick = (cat) => {
        setIsEditing(true);
        setEditingId(cat._id); 
        // Preenche o formulário com os dados da categoria selecionada
        setFormData({
            nome: cat.nome,
            descricao: cat.descricao,
        });
    };

    const clearForm = () => {
        setIsEditing(false);
        setEditingId(null);
        setFormData({ nome: '', descricao: '' });
    };

    if (status === 'loading') {
        return <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}><CircularProgress /></Box>;
    }

    return (
        <Container component="main" maxWidth="md" sx={{ my: 4 }}>
            <Paper sx={{ p: { xs: 2, md: 4 } }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    {isEditing ? 'Editar Categoria' : 'Adicionar Nova Categoria'}
                </Typography>
                
                <Box component="form" onSubmit={handleSubmit} noValidate>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            {/* Campo 'nome' (Título) */}
                            <TextField name="nome" label="Nome da Categoria" value={formData.nome} onChange={handleChange} required fullWidth />
                        </Grid>
                        <Grid item xs={12}>
                            {/* Campo 'descricao' (Descrição) */}
                            <TextField name="descricao" label="Descrição da Categoria" value={formData.descricao} onChange={handleChange} fullWidth multiline rows={3} />
                        </Grid>
                    </Grid>
                    
                    <ButtonGroup sx={{ mt: 3 }}>
                        <Button type="submit" variant="contained">
                            {isEditing ? 'Salvar Alterações' : 'Adicionar Categoria'}
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
                    Categorias Existentes
                </Typography>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Nome</TableCell>
                                <TableCell>Descrição</TableCell>
                                <TableCell align="right">Ações</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {/* Itera sobre a lista de categorias */}
                            {categories && categories.map((cat) => (
                                <TableRow key={cat._id}>
                                    <TableCell>{cat.nome}</TableCell>
                                    <TableCell>{cat.descricao}</TableCell>
                                    <TableCell align="right">
                                        <Button size="small" variant="outlined" sx={{ mr: 1 }} onClick={() => handleEditClick(cat)}>Editar</Button>
                                        <Button size="small" variant="outlined" color="error" onClick={() => handleDelete(cat._id)}>Remover</Button>
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

export default AdminCategoriesPage;