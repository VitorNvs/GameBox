import React from 'react';
import {
  Container,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Link,
} from '@mui/material';

// Importando os ícones que vamos usar
import FavoriteIcon from '@mui/icons-material/Favorite';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';

// Dados de exemplo para os cards
const popularGames = [
  { title: 'The Witcher 3: Wild Hunt', image: 'imgs/witcher3.jpg', rating: 45, icon: <FavoriteIcon sx={{ color: '#f44336' }} /> },
  { title: 'Nome do Jogo 2', image: 'https://via.placeholder.com/275x380?text=Jogo+2', rating: 30, icon: <ThumbUpIcon sx={{ color: '#4CAF50' }} /> },
  { title: 'Nome do Jogo 3', image: 'https://via.placeholder.com/275x380?text=Jogo+3', rating: 25, icon: <ThumbDownIcon sx={{ color: '#2196F3' }} /> },
  { title: 'Nome do Jogo 4', image: 'https://via.placeholder.com/275x380?text=Jogo+4', rating: 20, icon: <FavoriteIcon sx={{ color: '#f44336' }} /> },
  { title: 'Nome do Jogo 5', image: 'https://via.placeholder.com/275x380?text=Jogo+5', rating: 15, icon: <ThumbUpIcon sx={{ color: '#4CAF50' }} /> },
  { title: 'Nome do Jogo 6', image: 'https://via.placeholder.com/275x380?text=Jogo+6', rating: 10, icon: <FavoriteIcon sx={{ color: '#f44336' }} /> },
];

const friendUpdates = [
    { title: 'Nome do Jogo 1', image: 'https://via.placeholder.com/275x380?text=Jogo+1', icon: <ThumbUpIcon sx={{ color: '#4CAF50' }} /> },
    { title: 'Nome do Jogo 2', image: 'https://via.placeholder.com/275x380?text=Jogo+2', icon: <FavoriteIcon sx={{ color: '#f44336' }} /> },
    { title: 'Nome do Jogo 3', image: 'https://via.placeholder.com/275x380?text=Jogo+3', icon: <ThumbDownIcon sx={{ color: '#2196F3' }} /> },
];

const myLists = [
    { title: 'Favoritos' },
    { title: 'Jogando' },
    { title: 'Quero Jogar' },
];

// Componente da Página Principal
function HomePage() {
  return (
    <Box>
      {/* Seção Hero */}
      <Box
        sx={{
          py: { xs: 6, md: 10 },
          textAlign: 'center',
          position: 'relative',
          borderRadius: 2,
          overflow: 'hidden',
          m: 2,
          '&::before': { // Overlay escuro para melhor legibilidade
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            zIndex: 1,
          },
          // Adicione sua imagem de fundo aqui
          // backgroundImage: 'url(https://sua-imagem-de-fundo.jpg)',
          // backgroundSize: 'cover',
          // backgroundPosition: 'center',
        }}
      >
        <Container sx={{ position: 'relative', zIndex: 2 }}>
          <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
            Descubra, Avalie e Compartilhe sua Experiência de Jogo
          </Typography>
          <Typography variant="h6" color="text.secondary">
            O seu espaço para catalogar sua jornada gamer, criar listas e se conectar com outros jogadores.
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Seção Jogos Populares */}
        <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
          Jogos Populares
        </Typography>
        <Grid container spacing={3}>
          {popularGames.map((game, index) => (
            <Grid item key={index} xs={12} sm={4} md={3} lg={2}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', transition: 'transform 0.2s', '&:hover': { transform: 'scale(1.05)' } }}>
                <Link href="/detalhes_jogo"> {/* Substitua pelo Link do React Router se estiver usando */}
                  <CardMedia
                    component="img"
                    image={game.image}
                    alt={game.title}
                    sx={{ aspectRatio: '275/380' }}
                  />
                </Link>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" component="h3" sx={{fontSize: '1rem'}}>
                    {game.title}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    {game.icon}
                    <Typography variant="body2" sx={{ ml: 1 }}>
                      {game.rating}%
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Seção Atualizações de Amigos */}
        <Typography variant="h4" component="h2" gutterBottom sx={{ mt: 6, fontWeight: 'bold' }}>
          Atualizações de amigos
        </Typography>
        <Grid container spacing={3}>
            {friendUpdates.map((game, index) => (
                 <Grid item key={index} xs={12} sm={4} md={3} lg={2}>
                    <Card sx={{ height: '100%', transition: 'transform 0.2s', '&:hover': { transform: 'scale(1.05)' } }}>
                         <CardMedia
                            component="img"
                            image={game.image}
                            alt={game.title}
                            sx={{ aspectRatio: '275/380' }}
                          />
                        <CardContent>
                            <Typography variant="h6" component="h3" sx={{fontSize: '1rem'}}>{game.title}</Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                {game.icon}
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            ))}
        </Grid>

        {/* Seção Suas Listas */}
        <Typography variant="h4" component="h2" gutterBottom sx={{ mt: 6, fontWeight: 'bold' }}>
          Suas listas
        </Typography>
        <Grid container spacing={3}>
            {myLists.map((list, index) => (
                 <Grid item key={index} xs={12} sm={4} md={3} lg={2}>
                    <Card sx={{ height: 150, display: 'flex', justifyContent: 'center', alignItems: 'center', transition: 'transform 0.2s', '&:hover': { transform: 'scale(1.05)', backgroundColor: 'action.hover' }, cursor: 'pointer' }}>
                        <CardContent>
                            <Typography variant="h5" component="h3">{list.title}</Typography>
                        </CardContent>
                    </Card>
                 </Grid>
            ))}
        </Grid>
      </Container>
    </Box>
  );
}

export default HomePage;