import React, { useEffect } from 'react';
import { Container, Box, Typography, Grid, Card, CardContent, Button, CircularProgress } from '@mui/material';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchAchievements } from '../redux/AchievementsSlice'; // Importa a ação do Redux

// A lista estática de 'achievements' foi REMOVIDA

const AchievementsPage = () => {
    const dispatch = useDispatch();

    // Busca os dados dinâmicos e o status do estado do Redux
    const achievements = useSelector((state) => state.achievements.items);
    const status = useSelector((state) => state.achievements.status);

    // Dispara a busca pelos dados quando o componente é montado
    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchAchievements());
        }
    }, [status, dispatch]);

    return (
        <Container maxWidth="lg" sx={{ my: 4 }}>
            <Box sx={{ textAlign: 'center', mb: 5 }}>
                <Typography variant="h3" component="h1" gutterBottom fontWeight="700">
                    Nossas Conquistas
                </Typography>
                <Typography variant="h6" color="text.secondary" sx={{ maxWidth: '600px', mx: 'auto' }}>
                    Desbloqueie conquistas exclusivas ao participar da nossa comunidade, avaliar jogos e compartilhar suas opiniões!
                </Typography>
                <Button component={Link} to="/admin/conquistas" variant="contained" sx={{ mt: 3 }}>
                    Gerenciar Conquistas
                </Button>
            </Box>

            {/* Adiciona um indicador de carregamento */}
            {status === 'loading' ? (
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <CircularProgress />
                </Box>
            ) : (
                <Grid container spacing={4}>
                    {/* Mapeia os dados vindos do Redux (achievements) */}
                    {achievements.map((ach) => (
                        <Grid item xs={12} sm={6} md={4} key={ach.id}>
                            <Card sx={{ textAlign: 'center', p: 3, height: '100%' }}>
                                <Box
                                    component="img"
                                    src={ach.icon} // Usa o 'ach.icon' do banco de dados
                                    alt={`Ícone de ${ach.title}`}
                                    sx={{ 
                                        width: 100, 
                                        height: 100, 
                                        mb: 2, 
                                        borderRadius: '50%', 
                                        border: '3px solid', 
                                        borderColor: 'primary.main',
                                        objectFit: 'cover' // Garante que a imagem se ajuste
                                    }}
                                />
                                <CardContent>
                                    <Typography variant="h5" component="h2" fontWeight="bold">
                                        {ach.title} 
                                    </Typography>
                                    <Typography color="text.secondary">
                                        {ach.description}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Container>
    );
};

export default AchievementsPage;