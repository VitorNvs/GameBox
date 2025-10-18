import React, { useState } from 'react';
import { 
    Container, 
    Box, 
    Typography, 
    TextField, 
    Button,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow
} from '@mui/material';

// Dados mocados que viriam do seu db.json no futuro
const existingAchievements = [
    { id: 1, icon: 'https://img.icons8.com/emoji/48/trophy-emoji.png', title: 'Pioneiro', description: 'Fazer a sua primeira análise de um jogo.', rule: 'reviews_count >= 1' },
    { id: 2, icon: 'https://img.icons8.com/emoji/48/writing-hand-emoji.png', title: 'Crítico Ativo', description: 'Escrever 10 análises de jogos.', rule: 'reviews_count >= 10' },
    { id: 3, icon: 'https://img.icons8.com/emoji/48/star-emoji.png', title: 'Formador de Opinião', description: 'Sua análise recebeu 20 curtidas.', rule: 'review_likes_count >= 20' }
];


function AdminAchievementsPage() {
    // Estado para controlar os campos do formulário
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        rule: '',
        icon: ''
    });

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData(prevData => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        alert(`Conquista Salva!\nTítulo: ${formData.title}`);
        setFormData({ title: '', description: '', rule: '', icon: '' }); // Limpa o formulário
    };

    return (
        <Container component="main" maxWidth="lg" sx={{ py: 4 }}>
            <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 700, textAlign: 'center', mb: 4 }}>
                Gerenciamento de Conquistas
            </Typography>

            {/* Formulário de Adição */}
            <Paper sx={{ p: 3, mb: 4 }}>
                <Typography variant="h5" component="h3" gutterBottom>
                    Adicionar Nova Conquista
                </Typography>
                <Box component="form" onSubmit={handleSubmit}>
                    <TextField fullWidth margin="normal" required id="ach-title" name="title" label="Título da Conquista" placeholder="Ex: Pioneiro" value={formData.title} onChange={handleChange} />
                    <TextField fullWidth margin="normal" required id="ach-description" name="description" label="Descrição" placeholder="Ex: Fazer a sua primeira análise de um jogo." multiline rows={3} value={formData.description} onChange={handleChange} />
                    <TextField fullWidth margin="normal" id="ach-rule" name="rule" label="Regra da Conquista (para o sistema)" placeholder="Ex: reviews_count >= 10" value={formData.rule} onChange={handleChange} />
                    <TextField fullWidth margin="normal" id="ach-icon" name="icon" label="URL do Ícone" placeholder="https://..." value={formData.icon} onChange={handleChange} />
                    <Button type="submit" variant="contained" sx={{ mt: 2 }}>
                        Salvar Conquista
                    </Button>
                </Box>
            </Paper>

            {/* Tabela de Conquistas Existentes */}
            <Paper sx={{ p: 3 }}>
                <Typography variant="h5" component="h3" gutterBottom>
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
                            {existingAchievements.map((ach) => (
                                <TableRow key={ach.id}>
                                    <TableCell><Box component="img" src={ach.icon} alt="ícone" sx={{ width: 40, height: 40 }} /></TableCell>
                                    <TableCell>{ach.title}</TableCell>
                                    <TableCell>{ach.description}</TableCell>
                                    <TableCell><code>{ach.rule}</code></TableCell>
                                    <TableCell align="right">
                                        <Button size="small" variant="outlined" sx={{ mr: 1 }}>Editar</Button>
                                        <Button size="small" variant="outlined" color="error">Remover</Button>
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