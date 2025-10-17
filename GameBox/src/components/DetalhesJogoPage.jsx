import React from 'react';
import {
    ThemeProvider,
    Box,
    Container,
    Typography,
    Grid,
    Card,
    CardMedia,
    CardContent,
    Button,
    Chip,
    Avatar,
    Paper,
    Link,
    Icon,
} from '@mui/material';
// Importe seu tema customizado
import { darkTheme } from '../theme';

// Ícones do Material UI
import FavoriteIcon from '@mui/icons-material/Favorite';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';

// --- DADOS MOCKADOS ---
const gameData = {
    title: 'The Witcher 3: Wild Hunt',
    coverImage: 'imgs/witcher3.jpg',
    rating: '9.3 / 10',
    price: 'R$ 79,99',
    genre: 'RPG de Ação',
    categories: ['Mundo Aberto', 'Medieval', 'Terceira Pessoa'],
    description: 'You are Geralt of Rivia, mercenary monster slayer. Before you stands a war-torn, monster-infested continent you can explore...',
};

const reviewsData = [
    {
        id: 1,
        username: 'Alice',
        avatar: 'A',
        icon: FavoriteIcon,
        tooltip: 'Amei',
        text: 'Que jogo incrível! A imersão nele é algo de outro mundo. As missões são cativantes...',
        date: 'Postado em 14 de setembro de 2025',
    },
    {
        id: 2,
        username: 'Bruno',
        avatar: 'B',
        icon: ThumbUpIcon,
        tooltip: 'Gostei',
        text: 'O jogo é muito bom, com uma história principal excelente. No entanto, encontrei alguns bugs...',
        date: 'Postado em 12 de setembro de 2025',
    },
    {
        id: 3,
        username: 'Carla',
        avatar: 'C',
        icon: FavoriteIcon,
        tooltip: 'Amei',
        text: 'Visualmente deslumbrante e com uma trama que te prende do início ao fim...',
        date: 'Postado em 10 de setembro de 2025',
    },
];

// --- COMPONENTES ---

// Componente para o Card de Avaliação
const ReviewCard = ({ review }) => (
    <Link href="#" underline="none" sx={{ display: 'block', width: '100%' }}>
        <Card sx={{
            mb: 2,
            backgroundColor: 'background.paper',
            transition: 'transform 0.3s',
            '&:hover': { transform: 'scale(1.02)' }
        }}>
            <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                    <Avatar sx={{ bgcolor: '#E0E0E0', color: '#333', mr: 2 }}>
                        {review.avatar}
                    </Avatar>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        {review.username}
                    </Typography>
                    <Icon 
                        component={review.icon} 
                        titleAccess={review.tooltip}
                        sx={{ color: '#ff6b6b', fontSize: '1.5rem' }} 
                    />
                </Box>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                    {review.text}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'right' }}>
                    {review.date}
                </Typography>
            </CardContent>
        </Card>
    </Link>
);

// Componente Principal da Página
const DetalhesJogoPage = () => {
    return (
        <ThemeProvider theme={darkTheme}>
            <Box sx={{ bgcolor: 'background.default', color: 'text.primary', minHeight: '100vh' }}>
                <Container component="main" sx={{ py: 4 }}>
                    {/* Seção de Detalhes do Jogo */}
                    <Paper sx={{ p: { xs: 2, md: 4 }, backgroundColor: 'background.paper', mb: 5 }}>
                        <Grid container spacing={4}>
                            <Grid item xs={12} md={4}>
                                <CardMedia
                                    component="img"
                                    image={gameData.coverImage}
                                    alt={`Capa do jogo ${gameData.title}`}
                                    sx={{ borderRadius: 1, width: '100%', height: 'auto' }}
                                />
                            </Grid>
                            <Grid item xs={12} md={8}>
                                <Typography variant="h1" component="h1" gutterBottom>
                                    {gameData.title}
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 2, my: 3, flexWrap: 'wrap' }}>
                                    <Box sx={{ border: '1px solid #444', p: 2, borderRadius: 1, textAlign: 'center', minWidth: 120 }}>
                                        <Typography variant="button" display="block" color="text.secondary">
                                            NOTA
                                        </Typography>
                                        <Typography variant="h5" sx={{ fontWeight: 700 }}>
                                            {gameData.rating}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ border: '1px solid #444', p: 2, borderRadius: 1, textAlign: 'center', minWidth: 120 }}>
                                        <Typography variant="button" display="block" color="text.secondary">
                                            PREÇO
                                        </Typography>
                                        <Typography variant="h5" sx={{ fontWeight: 700 }}>
                                            {gameData.price}
                                        </Typography>
                                    </Box>
                                </Box>
                                <Box sx={{ my: 3 }}>
                                    <Typography variant="h6" component="h4">
                                        Gênero
                                    </Typography>
                                    <Chip label={gameData.genre} color="primary" sx={{ mt: 1 }} />
                                </Box>
                                <Box sx={{ my: 3 }}>
                                    <Typography variant="h6" component="h4">
                                        Categorias
                                    </Typography>
                                    <Box sx={{ display: 'flex', gap: 1, mt: 1, flexWrap: 'wrap' }}>
                                        {gameData.categories.map((cat) => (
                                            <Chip key={cat} label={cat} variant="outlined" />
                                        ))}
                                    </Box>
                                </Box>
                                <Box sx={{ my: 3 }}>
                                    <Typography variant="h6" component="h3">
                                        Descrição
                                    </Typography>
                                    <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                                        {gameData.description}
                                    </Typography>
                                </Box>
                                <Button variant="contained" color="primary" href="#" sx={{ mt: 2 }}>
                                    Editar Jogo (Admin)
                                </Button>
                            </Grid>
                        </Grid>
                    </Paper>

                    {/* Seção de Avaliações */}
                    <Box>
                        <Typography variant="h4" component="h2" gutterBottom>
                            Avaliações de Usuários
                        </Typography>
                        <Box>
                            {reviewsData.map((review) => (
                                <ReviewCard key={review.id} review={review} />
                            ))}
                        </Box>
                    </Box>
                </Container>
            </Box>
        </ThemeProvider>
    );
};

export default DetalhesJogoPage;