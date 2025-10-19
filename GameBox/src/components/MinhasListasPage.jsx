import React, { useState } from 'react';
import {
    ThemeProvider,
    Box,
    Container,
    Typography,
    Grid,
    Card,
    CardContent,
    CardActions,
    Button,
    TextField,
    AppBar,
    Toolbar,
    Link,
} from '@mui/material';
import { createTheme } from '@mui/material/styles';
import { Link as RouterLink } from 'react-router-dom';

// Tema customizado baseado no seu arquivo theme.js
const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#38bdf8', // Cor de destaque (azul)
        },
        background: {
            default: '#121829', // Cor de fundo do body
            paper: '#1F2937',    // Cor de fundo dos cards, header e footer
        },
        text: {
            primary: '#f9f9f9',
            secondary: '#9CA3AF',
        },
    },
    typography: {
        fontFamily: 'Montserrat, sans-serif',
        h1: { fontSize: '1.8rem', fontWeight: 700 },
        h3: { fontSize: '1.6rem', fontWeight: 700, marginBottom: '1rem' },
        h4: { fontSize: '1.4rem', fontWeight: 700, color: '#38bdf8' },
    },
});

// Dados iniciais das listas (do seu HTML)
const initialLists = [
    {
        id: 1,
        title: 'Melhores Indies de 2024',
        description: 'Uma lista com os jogos independentes que mais me surpreenderam este ano.',
        gamesCount: 3,
    },
    {
        id: 2,
        title: 'Para Jogar no Fim de Semana',
        description: 'Jogos que estão na minha lista de espera para os próximos dias de folga.',
        gamesCount: 5,
    },
    {
        id: 3,
        title: 'RPGs que Marcaram',
        description: 'Clássicos e modernos que me marcaram e me fizeram mergulhar em suas histórias.',
        gamesCount: 8,
    },
];

// Componente do Card de Lista
const ListCard = ({ list, onDelete }) => (
    <Grid item xs={12} sm={6} md={4}>
        <Card sx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            border: '1px solid #444',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 8px 15px rgba(0, 0, 0, 0.3)',
            }
        }}>
            <CardContent>
                <Typography variant="h4" component="h4" gutterBottom>
                    {list.title}
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ marginBottom: '1rem' }}>
                    {list.description}
                </Typography>
                <Typography variant="body2" color="text.primary">
                    {list.gamesCount} jogos na lista
                </Typography>
            </CardContent>
            <CardActions sx={{ justifyContent: 'flex-end', padding: '16px' }}>
                <Button 
                    size="small" 
                    variant="outlined" 
                    color="primary"
                    component={RouterLink} // Usa o RouterLink
                    to={`/minhas-listas/editar/${list.id}`} // Nova rota: /minhas-listas/editar/1
                >
                    Editar
                </Button>
                <Button size="small" variant="contained" color="error" onClick={() => onDelete(list.id)}>Excluir</Button>
            </CardActions>
        </Card>
    </Grid>
);


// Componente principal da página
const MinhasListasPage = () => {
    const [lists, setLists] = useState(initialLists);
    const [newListTitle, setNewListTitle] = useState('');
    const [newListDescription, setNewListDescription] = useState('');

    const handleCreateList = (event) => {
        event.preventDefault();
        if (!newListTitle) return; // Não cria lista sem título

        const newList = {
            id: Date.now(), // ID único baseado no tempo
            title: newListTitle,
            description: newListDescription,
            gamesCount: 0,
        };

        setLists([...lists, newList]);
        // Limpa o formulário
        setNewListTitle('');
        setNewListDescription('');
    };
    
    const handleDeleteList = (listId) => {
        setLists(lists.filter(list => list.id !== listId));
    };


    return (
        <ThemeProvider theme={darkTheme}>
            <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', color: 'text.primary' }}>
                {/* Header */}
                

                {/* Conteúdo Principal */}
                <Container component="main" sx={{ py: 4 }}>
                    <Grid container spacing={5}>
                        {/* Seção de Listas do Usuário */}
                        <Grid item xs={12} md={9}>
                            <Typography variant="h3">Minhas Listas</Typography>
                            <Grid container spacing={3}>
                                {lists.map((list) => (
                                    <ListCard key={list.id} list={list} onDelete={handleDeleteList} />
                                ))}
                            </Grid>
                        </Grid>

                        {/* Seção do Formulário de Criação */}
                        <Grid item xs={12} md={3}>
                            <Box sx={{ position: 'sticky', top: 20 }}>
                                <Box component="form" onSubmit={handleCreateList} sx={{
                                    backgroundColor: 'background.paper',
                                    padding: 3,
                                    borderRadius: 2,
                                    border: '1px solid #444',
                                }}>
                                    <Typography variant="h3">Criar Lista</Typography>
                                    <TextField
                                        label="Título da Lista"
                                        variant="outlined"
                                        fullWidth
                                        required
                                        value={newListTitle}
                                        onChange={(e) => setNewListTitle(e.target.value)}
                                        placeholder="Ex: Meus RPGs Favoritos"
                                        margin="normal"
                                    />
                                    <TextField
                                        label="Descrição"
                                        variant="outlined"
                                        fullWidth
                                        multiline
                                        rows={4}
                                        value={newListDescription}
                                        onChange={(e) => setNewListDescription(e.target.value)}
                                        placeholder="Uma breve descrição sobre a sua lista..."
                                        margin="normal"
                                    />
                                    <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
                                        Salvar Lista
                                    </Button>
                                </Box>
                            </Box>
                        </Grid>
                    </Grid>
                </Container>

            </Box>
        </ThemeProvider>
    );
};

export default MinhasListasPage;