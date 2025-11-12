// src/components/EditListPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchLists, updateListDetails, updateListGames } from '../redux/listsSlice';
import { fetchGames } from '../redux/gamesSlice'; 
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
    Divider,
    Link 
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';


function EditListPage() {
    const { listId } = useParams();
    const dispatch = useDispatch();

    // --- LÓGICA DE DADOS REAIS (Conectado ao Redux) ---
    const list = useSelector(state => 
        state.lists.items.find(l => l.id.toString() === listId.toString())
    );
    const listStatus = useSelector(state => state.lists.status);
    
    const allGames = useSelector(state => state.jogos.items);
    const gamesStatus = useSelector(state => state.jogos.status);
    
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    
    useEffect(() => {
        if (listStatus === 'idle') {
            dispatch(fetchLists());
        }
        if (gamesStatus === 'idle') {
            dispatch(fetchGames());
        }
    }, [listStatus, gamesStatus, dispatch]);

    useEffect(() => {
        if (list) {
            setTitle(list.title);
            setDescription(list.description);
        }
    }, [list]);

    // --- FUNÇÕES DE SALVAR REAIS ---

    const handleSaveListDetails = () => {
        dispatch(updateListDetails({ id: listId, title, description }))
            .unwrap()
            .then(() => alert('Detalhes salvos com sucesso!'))
            .catch(err => alert(`Erro ao salvar: ${err.message}`));
    };

    const handleRemoveGame = (gameIdToRemove) => {
        if (!list) return;
        const updatedGames = list.jogos.filter(game => game.id !== gameIdToRemove);
        dispatch(updateListGames({ listId, updatedGames }));
    };

    const handleAddGame = (gameToAdd) => {
        if (!list || (list.jogos && list.jogos.some(g => g.id === gameToAdd.id))) return;

        const gameInfo = {
            id: gameToAdd.id,
            title: gameToAdd.title,
            image: gameToAdd.image,
            genre: gameToAdd.genre,
            rating: gameToAdd.rating
        };

        const currentGames = list.jogos || [];
        const updatedGames = [...currentGames, gameInfo];
        dispatch(updateListGames({ listId, updatedGames }));
    };

    // --- LÓGICA DE RENDERIZAÇÃO ---

    const availableGames = allGames.filter(game => {
        if (!list || !list.jogos) return true;
        return !list.jogos.some(listGame => listGame.id === game.id);
    });

    if (listStatus === 'loading' || gamesStatus === 'loading') {
        return <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}><CircularProgress /></Box>;
    }

    if (listStatus === 'succeeded' && !list) {
        return <Container maxWidth="lg" sx={{ py: 6 }}><Alert severity="error">Lista com ID {listId} não encontrada.</Alert></Container>;
    }

    if (!list) {
         return <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}><CircularProgress /></Box>;
    }

    return (
        // ATENÇÃO: Mudei o maxWidth="lg" para "xl" para dar mais espaço geral
        <Container maxWidth="xl" sx={{ my: 4 }}> 
            <Typography variant="h3" component="h1" fontWeight="700" color="primary.main" gutterBottom>
                Editar Lista: {list.title}
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
                ID da Lista: {listId}
            </Typography>

            <Grid container spacing={4}>

                {/* --- MUDANÇA DRÁSTICA AQUI --- */}
                {/* Coluna 1 (Esquerda): Detalhes da Lista */}
                {/* Mudei de md={3} para md={2} para ficar BEM estreito */}
                <Grid item xs={12} md={2}>
                    <Card sx={{ bgcolor: 'background.paper', p: 3, position: 'sticky', top: 20 }}>
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
                </Grid>

                {/* --- MUDANÇA DRÁSTICA AQUI --- */}
                {/* Coluna 2 (Direita): Jogos Atuais e Adicionar Jogos */}
                {/* Mudei de md={9} para md={10} para ficar BEM largo */}
                <Grid item xs={12} md={10}>
                    
                    {/* Bloco 1: Jogos Atuais */}
                    <Box mb={5}>
                        <Typography variant="h5" fontWeight="bold" gutterBottom>
                            Jogos Atuais ({list.jogos?.length || 0})
                        </Typography>
                        <Grid container spacing={3}>
                            {/* Ajustei o grid interno para telas xl (muito grandes) para ter 4 colunas */}
                            {list.jogos?.map((game) => (
                                <Grid item key={game.id} xs={12} sm={6} md={4} lg={3}> 
                                    <Card sx={{ 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        bgcolor: 'background.paper' 
                                    }}>
                                        <Button 
                                            component={RouterLink}
                                            to={`jogos/${game.id}`} 
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
                                        
                                        <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, minWidth: 0 }}>
                                            <CardContent sx={{ flex: '1 0 auto', py: 1, '&:last-child': { pb: 1 } }}>
                                                <Typography component="div" variant="h6" noWrap>
                                                    <Link 
                                                        component={RouterLink} 
                                                        to={`/detalhes_jogo/${game.id}`} 
                                                        sx={{ textDecoration: 'none', color: 'inherit' }}
                                                    >
                                                        {game.title}
                                                    </Link>
                                                </Typography>
                                                <Typography variant="subtitle1" color="text.secondary" noWrap>
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
                    </Box>

                    <Divider sx={{ my: 4 }} />

                    {/* Bloco 2: Adicionar Jogos */}
                    <Box>
                        <Typography variant="h5" fontWeight="bold" gutterBottom>Adicionar Jogos</Typography>
                        
                        {availableGames.length > 0 ? (
                            availableGames.map(game => (
                                <Box key={game.id} sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1, p: 1, bgcolor: 'background.paper', borderRadius: 1 }}>
                                    <Typography sx={{ flexGrow: 1 }}>{game.title}</Typography>
                                    <Button size="small" variant="outlined" onClick={() => handleAddGame(game)}>
                                        Adicionar
                                    </Button>
                                </Box>
                            ))
                        ) : (
                            <Typography color="text.secondary">Todos os jogos já estão na sua lista.</Typography>
                        )}
                    </Box>

                </Grid>

            </Grid>
        </Container>
    );
}

export default EditListPage;