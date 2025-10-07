// src/components/HomePage.jsx
import React from 'react';

// Importações do Material-UI
import {
    Box,
    Card,
    CardContent,
    CardMedia,
    Container,
    CssBaseline,
    Grid,
    Typography
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

// Importações de Ícones do Material-UI
import FavoriteIcon from '@mui/icons-material/Favorite';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';

// --- DADOS MOCKADOS (Substitua pela sua API ou fonte de dados) ---
const popularGames = [
    { title: 'The Witcher 3: Wild Hunt', image: 'imgs/witcher3.jpg', rating: '45%' },
    { title: 'Resident Evil 4 Remake', image: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2050650/header.jpg?t=1736385712', rating: '98%' },
    { title: 'The Last of Us Part 2', image: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2531310/header.jpg?t=1750959180', rating: '95%' },
];

const friendUpdates = [
    { title: 'Hollow Knight: Silksong', image: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1030300/7983574d464e6559ac7e24275727f73a8bcca1f3/header.jpg?t=1756994410', feedback: 'up' },
    { title: 'Grand Theft Auto V', image: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/3240220/header.jpg?t=1753974947', feedback: 'up' },
    { title: 'Resident Evil Village', image: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1196590/header.jpg?t=1741142800', feedback: 'up' },
    { title: 'Counter-Strike 2', image: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/730/header.jpg?t=1749053861', feedback: 'down' },
    { title: 'The Last of Us Parte 1', image: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1888930/header.jpg?t=1750959031', feedback: 'up' },
    { title: 'Shadow of the Tomb Raider', image: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/750920/header.jpg?t=1729014037', feedback: 'up' },
    { title: 'Life is Strange', image: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/319630/header.jpg?t=1724158918', feedback: 'up' },
    { title: 'Resident Evil 3', image: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/952060/header.jpg?t=1728438347', feedback: 'down' },
];

const userLists = [
    { title: 'Favoritos' },
    { title: 'Jogando' },
    { title: 'Quero Jogar' },
];

// --- TEMA CUSTOMIZADO BASEADO NO SEU CSS ---
const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#38bdf8', // Cor de destaque (azul)
        },
        background: {
            default: '#121829', // Cor de fundo do body
            paper: '#1F2937',    // Cor de fundo dos cards e header
        },
        text: {
            primary: '#f9f9f9',
            secondary: '#9CA3AF',
        },
    },
    typography: {
        fontFamily: 'Montserrat, sans-serif',
        h3: { fontSize: '1.75rem', marginBottom: '1.5rem' },
    },
});

function HomePage() {

    const getFeedbackIcon = (feedback) => {
        if (feedback === 'up') return <ThumbUpIcon fontSize="small" />;
        if (feedback === 'down') return <ThumbDownIcon fontSize="small" />;
        return null;
    };


    return (
        <ThemeProvider theme={darkTheme}>
            <CssBaseline /> {/* Reseta o CSS e aplica o fundo do tema */}

            {/* Conteúdo Principal */}
            <Container component="main" maxWidth="lg" sx={{ py: 4 }}>
                
                {/* Seção Jogos Populares */}
                <Box component="section" sx={{ mb: 6 }}>
                    <Typography variant="h3" component="h3" sx={{ borderLeft: '4px solid #38bdf8', pl: 2 }}>
                        Jogos Populares
                    </Typography>
                    <Grid container spacing={4}>
                        {popularGames.map((game, index) => (
                            <Grid item key={index} xs={12} sm={6} md={4}>
                                <Card>
                                    <CardMedia
                                        component="img"
                                        height="160"
                                        image={game.image}
                                        alt={`Capa de ${game.title}`}
                                    />
                                    <CardContent>
                                        <Typography gutterBottom variant="h6" component="h4" sx={{ fontSize: '1.25rem' }}>
                                            {game.title}
                                        </Typography>
                                        <Box sx={{ display: 'flex', alignItems: 'center', color: '#facc15' }}>
                                            <FavoriteIcon sx={{ mr: 1, color: 'primary.main' }} />
                                            <Typography variant="body1">{game.rating}</Typography>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Box>

                {/* Seção Atualizações de Amigos */}
                <Box component="section" sx={{ mb: 6 }}>
                    <Typography variant="h3" component="h3" sx={{ borderLeft: '4px solid #38bdf8', pl: 2 }}>
                        Atualizações de amigos
                    </Typography>
                    <Grid container spacing={3}>
                        {friendUpdates.map((game, index) => (
                            <Grid item key={index} xs={6} sm={4} md={2}>
                                <Card>
                                    <CardMedia
                                        component="img"
                                        height="100"
                                        image={game.image}
                                        alt={`Capa de ${game.title}`}
                                    />
                                    <CardContent sx={{ p: 1.5 }}>
                                        <Typography variant="body2" component="h4" noWrap>
                                            {game.title}
                                        </Typography>
                                        <Box sx={{ color: 'primary.main', mt: 1 }}>
                                            {getFeedbackIcon(game.feedback)}
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
                
                 {/* Seção Suas Listas */}
                <Box component="section">
                    <Typography variant="h3" component="h3" sx={{ borderLeft: '4px solid #38bdf8', pl: 2 }}>
                       Suas listas
                    </Typography>
                    <Grid container spacing={3}>
                        {userLists.map((list, index) => (
                           <Grid item key={index} xs={12} sm={4}>
                               <Card sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100px'}}>
                                   <CardContent>
                                       <Typography variant="h6">{list.title}</Typography>
                                   </CardContent>
                               </Card>
                           </Grid>
                        ))}
                    </Grid>
                </Box>

            </Container>

            {/* Footer */}
            <Box component="footer" sx={{ textAlign: 'center', py: 3, mt: 2, borderTop: '1px solid #374151' }}>
                <Typography variant="body2" color="text.secondary">
                    &copy; {new Date().getFullYear()} Gamebox. Todos os direitos reservados.
                </Typography>
            </Box>
        </ThemeProvider>
    );
}

export default HomePage;