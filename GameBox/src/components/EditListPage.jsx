// src/components/EditListPage.jsx

import React, { useState, useEffect } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { 
    Container, 
    Box, 
    Typography, 
    CircularProgress, 
    Alert,
    Grid,
    Card,
    CardContent,
    CardMedia,
    Button,
    TextField,
    Divider
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';

// --- SIMULAÇÃO DE DADOS (Substituir por chamadas de API reais) ---

// Mock de Jogos dentro das Listas
const mockLists = [
    {
        id: '1',
        title: 'Melhores Indies de 2024',
        description: 'Uma lista com os jogos independentes que mais me surpreenderam este ano.',
        games: [
            { id: 'g1', title: 'Hollow Knight', image: 'https://via.placeholder.com/150/38bdf8/ffffff?text=HK', rating: 9.5, genre: 'Metroidvania' },
            { id: 'g2', title: 'Celeste', image: 'https://via.placeholder.com/150/38bdf8/ffffff?text=CST', rating: 9.8, genre: 'Platformer' },
            { id: 'g3', title: 'Stardew Valley', image: 'https://via.placeholder.com/150/38bdf8/ffffff?text=SDV', rating: 9.2, genre: 'Simulation' },
        ],
    },
    {
        id: '2',
        title: 'Para Jogar no Fim de Semana',
        description: 'Jogos na minha lista de espera.',
        games: [
            { id: 'g4', title: 'Disco Elysium', image: 'https://via.placeholder.com/150/1F2937/ffffff?text=DE', rating: 9.9, genre: 'RPG' },
            { id: 'g5', title: 'Hades', image: 'https://via.placeholder.com/150/1F2937/ffffff?text=HD', rating: 9.7, genre: 'Roguelike' },
        ],
    },
];

// Mock de Jogos que podem ser adicionados (simula resultados de busca)
const mockGameSearch = [
    { id: 'g6', title: 'The Witness', image: 'https://via.placeholder.com/150/9CA3AF/ffffff?text=TW', rating: 8.9, genre: 'Puzzle' },
    { id: 'g7', title: 'Portal 2', image: 'https://via.placeholder.com/150/9CA3AF/ffffff?text=P2', rating: 9.6, genre: 'Puzzle' },
];

// --- COMPONENTE PRINCIPAL ---

function EditListPage() {
    const { listId } = useParams();
    
    const [list, setList] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    
    // Simulação de busca da lista por ID
    useEffect(() => {
        setLoading(true);
        const fetchedList = mockLists.find(l => l.id === listId);
        
        if (fetchedList) {
            setList(fetchedList);
            setTitle(fetchedList.title);
            setDescription(fetchedList.description);
            setError(null);
        } else {
            setError(`Lista com ID ${listId} não encontrada.`);
        }
        setLoading(false);
    }, [listId]);

    const handleSaveListDetails = () => {
        // Lógica para salvar Título e Descrição na API
        alert(`Detalhes da lista "${title}" salvos!`);
    };

    const handleRemoveGame = (gameIdToRemove) => {
        if (!list) return;
        const updatedGames = list.games.filter(game => game.id !== gameIdToRemove);
        setList({ ...list, games: updatedGames });
        // Lógica para remover o jogo da API...
    };

    const handleAddGame = (gameToAdd) => {
        if (!list || list.games.some(g => g.id === gameToAdd.id)) return;
        setList({ ...list, games: [...list.games, gameToAdd] });
        // Lógica para adicionar o jogo na API...
    };

    if (loading) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}><CircularProgress /></Box>;
    }

    if (error) {
        return <Container maxWidth="lg" sx={{ py: 6 }}><Alert severity="error">{error}</Alert></Container>;
    }

    return (
        <Container maxWidth="lg" sx={{ my: 4 }}>
            <Typography variant="h3" component="h1" fontWeight="700" color="primary.main" gutterBottom>
                Editar Lista: {list.title}
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
                ID da Lista: {listId}
            </Typography>

            <Grid container spacing={4}>
                {/* Coluna 1: Edição de Detalhes e Adicionar Jogos */}
                <Grid item xs={12} md={4}>
                    <Card sx={{ bgcolor: 'background.paper', p: 3 }}>
                        <Typography variant="h5" fontWeight="bold" gutterBottom>Detalhes da Lista</Typography>
                        <TextField
                            label="Título da Lista"
                            variant="outlined"
                            fullWidth
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            margin="normal"
                        />
                        <TextField
                            label="Descrição"
                            variant="outlined"
                            fullWidth
                            multiline
                            rows={4}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            margin="normal"
                        />
                        <Button 
                            variant="contained" 
                            color="primary" 
                            startIcon={<SaveIcon />} 
                            onClick={handleSaveListDetails}
                            fullWidth
                            sx={{ mt: 2 }}
                        >
                            Salvar Detalhes
                        </Button>
                    </Card>

                    {/* Simulação de Busca/Adição de Jogos */}
                    <Box mt={4}>
                        <Typography variant="h5" fontWeight="bold" gutterBottom>Adicionar Jogos</Typography>
                        <Alert severity="info" sx={{ mb: 2 }}>
                            Simulação de resultados de busca de jogos para adicionar.
                        </Alert>
                        {mockGameSearch.map(game => (
                            <Box key={game.id} sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1, p: 1, bgcolor: 'background.paper', borderRadius: 1 }}>
                                <Typography sx={{ flexGrow: 1 }}>{game.title}</Typography>
                                <Button size="small" variant="outlined" onClick={() => handleAddGame(game)}>
                                    Adicionar
                                </Button>
                            </Box>
                        ))}
                    </Box>

                </Grid>

                {/* Coluna 2: Jogos Atuais na Lista */}
                <Grid item xs={12} md={8}>
                    <Typography variant="h5" fontWeight="bold" gutterBottom>
                        Jogos Atuais ({list.games.length})
                    </Typography>
                    <Grid container spacing={3}>
                        {list.games.map((game) => (
                            <Grid item key={game.id} xs={12} sm={6} md={6}>
                                <Card sx={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    bgcolor: 'background.paper' 
                                }}>
                                    {/* Link para a página de detalhes do jogo */}
                                    <Button 
                                        component={RouterLink}
                                        to={`/jogos/${game.id}`}
                                        sx={{ 
                                            p: 0, 
                                            textTransform: 'none', 
                                            color: 'inherit',
                                            '&:hover': { bgcolor: 'transparent' }
                                        }}
                                    >
                                        <CardMedia
                                            component="img"
                                            sx={{ width: 100, height: 100, objectFit: 'cover' }}
                                            image={game.image}
                                            alt={game.title}
                                        />
                                    </Button>
                                    
                                    <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                                        <CardContent sx={{ flex: '1 0 auto', py: 1, '&:last-child': { pb: 1 } }}>
                                            <Typography component="div" variant="h6">
                                                {game.title}
                                            </Typography>
                                            <Typography variant="subtitle1" color="text.secondary">
                                                {game.genre} | Nota: {game.rating}
                                            </Typography>
                                        </CardContent>
                                    </Box>
                                    <Button 
                                        size="small" 
                                        color="error" 
                                        onClick={() => handleRemoveGame(game.id)}
                                        sx={{ height: 100, borderRadius: 0 }}
                                    >
                                        <DeleteIcon />
                                    </Button>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Grid>
            </Grid>
        </Container>
    );
}

export default EditListPage;