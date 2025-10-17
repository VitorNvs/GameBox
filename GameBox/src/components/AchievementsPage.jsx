import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Box, Typography, Button, Grid, Card, CardContent, CardMedia } from '@mui/material';

// Dados das conquistas para renderização dinâmica
const achievementsData = [
    {
        icon: '/imagens_conquistas/joinha.png',
        title: 'Pioneiro',
        description: 'Fazer a sua primeira análise de um jogo.',
    },
    {
        icon: '/imagens_conquistas/medalha.png',
        title: 'Crítico Ativo',
        description: 'Escrever 10 análises de jogos.',
    },
    {
        icon: '/imagens_conquistas/coracao.png',
        title: 'Formador de Opinião',
        description: 'Sua análise recebeu 20 curtidas.',
    },
    {
        icon: '/imagens_conquistas/olhos.png',
        title: 'Explorador de Gêneros',
        description: 'Analisar jogos de 5 gêneros diferentes.',
    },
    {
        icon: '/imagens_conquistas/lapis.png',
        title: 'Imparável',
        description: 'Publicar uma análise por dia durante 7 dias seguidos.',
    },
    {
        icon: '/imagens_conquistas/lapis_papel.png',
        title: 'Mestre das Análises',
        description: 'Escrever 50 análises de jogos.',
    },
];

function AchievementsPage() {
  return (
    <Container component="main" maxWidth="lg" sx={{ py: 4 }}>
        {/* Cabeçalho da Página de Conquistas */}
        <Box 
            sx={{ 
                textAlign: 'center', 
                mb: 6, 
                py: 4, 
                bgcolor: 'background.paper', 
                borderRadius: 2 
            }}
        >
            <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
                Nossas Conquistas
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ maxWidth: '600px', mx: 'auto' }}>
                Desbloqueie conquistas exclusivas ao participar da nossa comunidade, avaliar jogos e compartilhar suas opiniões!
            </Typography>
            <Button variant="contained" sx={{ mt: 3 }}
            component={Link}
            to="/admin/conquistas" >
                Gerenciar Conquistas
            </Button>
        </Box>

        {/* Grade de Conquistas */}
        <Grid container spacing={4}>
            {achievementsData.map((achievement) => (
                <Grid item key={achievement.title} xs={12} sm={6} md={4}>
                    <Card sx={{ 
                        textAlign: 'center', 
                        height: '100%',
                        p: 2
                    }}>
                        <CardMedia
                            component="img"
                            image={achievement.icon}
                            alt={`Ícone de ${achievement.title}`}
                            sx={{ 
                                width: 80, 
                                height: 80, 
                                margin: '0 auto 1rem' 
                            }}
                        />
                        <CardContent>
                            <Typography gutterBottom variant="h5" component="h4" sx={{ fontWeight: 'bold' }}>
                                {achievement.title}
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                                {achievement.description}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            ))}
        </Grid>
    </Container>
  );
}

export default AchievementsPage;