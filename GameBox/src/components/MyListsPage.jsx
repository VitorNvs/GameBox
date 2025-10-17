import React, { useState } from 'react';
import { 
    Container, 
    Box, 
    Typography, 
    Grid, 
    Card, 
    CardContent, 
    TextField, 
    Button,
    Paper // Usaremos o Paper para criar o container do formulário
} from '@mui/material';

// Dados mocados para as listas existentes
const userListsData = [
    {
        title: 'Melhores Indies de 2024',
        description: 'Uma lista com os jogos independentes que mais me surpreenderam este ano.',
        gamesCount: '3 jogos na lista'
    },
    {
        title: 'Para Jogar no Fim de Semana',
        description: 'Jogos que estão na minha lista de espera para os próximos dias de folga.',
        gamesCount: '5 jogos na lista'
    },
    {
        title: 'RPGs que Marcaram',
        description: 'Clássicos e modernos que me marcaram e me fizeram mergulhar em suas histórias.',
        gamesCount: '8 jogos na lista'
    }
];

function MyListsPage() {
    // Estado para controlar os campos do formulário
    const [formData, setFormData] = useState({
        title: '',
        description: ''
    });

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        // No futuro, aqui você enviará os dados para o Redux/API
        alert(`Lista Salva!\nTítulo: ${formData.title}\nDescrição: ${formData.description}`);
        // Limpa o formulário após o envio
        setFormData({ title: '', description: '' });
    };

    return (
        <Container component="main" maxWidth="lg" sx={{ py: 4 }}>
            <Grid container spacing={4}>
                {/* Coluna da Esquerda: Listas Existentes */}
                <Grid item xs={12} md={7}>
                    <Typography variant="h4" component="h3" gutterBottom sx={{ fontWeight: 'bold' }}>
                        Minhas Listas
                    </Typography>
                    <Grid container spacing={3}>
                        {userListsData.map((list) => (
                            <Grid item xs={12} key={list.title}>
                                <Card sx={{ transition: 'transform 0.3s', '&:hover': { transform: 'translateY(-5px)' } }}>
                                    <CardContent>
                                        <Typography variant="h5" color="primary" sx={{ fontWeight: 'bold' }}>
                                            {list.title}
                                        </Typography>
                                        <Typography variant="body1" color="text.secondary" paragraph>
                                            {list.description}
                                        </Typography>
                                        <Typography variant="caption" display="block" color="text.primary" sx={{ mb: 2 }}>
                                            {list.gamesCount}
                                        </Typography>
                                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                                            <Button variant="outlined" size="small">Editar</Button>
                                            <Button variant="outlined" size="small" color="error">Excluir</Button>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Grid>

                {/* Coluna da Direita: Formulário de Criação */}
                <Grid item xs={12} md={5}>
                    <Paper sx={{ p: 3, bgcolor: 'background.paper' }}>
                        <Typography variant="h4" component="h3" gutterBottom sx={{ fontWeight: 'bold' }}>
                            Criar Lista de Jogos
                        </Typography>
                        <Box component="form" onSubmit={handleSubmit}>
                            <TextField
                                fullWidth
                                margin="normal"
                                required
                                id="list-title"
                                name="title"
                                label="Título da Lista"
                                placeholder="Ex: Meus RPGs Favoritos"
                                value={formData.title}
                                onChange={handleChange}
                            />
                            <TextField
                                fullWidth
                                margin="normal"
                                id="list-description"
                                name="description"
                                label="Descrição"
                                placeholder="Uma breve descrição sobre a sua lista..."
                                multiline
                                rows={4}
                                value={formData.description}
                                onChange={handleChange}
                            />
                            <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
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