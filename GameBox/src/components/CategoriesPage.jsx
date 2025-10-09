import React from 'react';
import { Container, Box, Typography, Grid, Card, CardContent, CardMedia } from '@mui/material';

// Dados das categorias para renderização dinâmica
// (Substitua as imagens 'placeholder' pelas suas imagens reais)
const categories = [
    {
        title: 'Survival Horror',
        description: 'Prepare-se para o medo e a tensão em jogos que testam sua capacidade de sobrevivência.',
        image: 'https://source.unsplash.com/400x400/?horror,zombie',
        alt: 'Ícone de Survival Horror'
    },
    {
        title: 'Ação',
        description: 'Pura adrenalina, combate frenético e missões emocionantes esperam por você.',
        image: 'https://source.unsplash.com/400x400/?action,battle',
        alt: 'Ícone de Ação'
    },
    {
        title: 'MOBA',
        description: 'Estratégia em equipe para destruir a base inimiga.',
        image: 'https://source.unsplash.com/400x400/?esports,arena',
        alt: 'Ícone de MOBA'
    },
    {
        title: 'RPG',
        description: 'Crie seu herói, explore mundos vastos e viva uma história épica.',
        image: 'https://source.unsplash.com/400x400/?fantasy,dragon',
        alt: 'Ícone de RPG'
    },
    {
        title: 'Visual Novel',
        description: 'Viva uma história interativa através de texto, imagens e música.',
        image: 'https://source.unsplash.com/400x400/?anime,book',
        alt: 'Ícone de Visual Novel'
    }
];

function CategoriesPage() {
  return (
    <>
      {/* Seção do Banner */}
      <Box 
        sx={{ 
            bgcolor: 'background.paper', 
            py: 6, 
            textAlign: 'center',
            borderBottom: '1px solid #374151'
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 700, color: 'primary.main' }}>
            Explore as Categorias de Jogos
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Encontre seus gêneros favoritos e descubra novos jogos para sua jornada.
          </Typography>
        </Container>
      </Box>

      {/* Conteúdo Principal com o Grid de Categorias */}
      <Container component="main" maxWidth="lg" sx={{ py: 6 }}>
        <Grid container spacing={4}>
          {categories.map((category) => (
            <Grid item key={category.title} xs={12} sm={6} md={4}>
              <Card sx={{ 
                  textAlign: 'center', 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-start'
                }}
              >
                <CardMedia
                  component="img"
                  image={category.image}
                  alt={category.alt}
                  sx={{ 
                      width: 140, 
                      height: 140, 
                      borderRadius: '50%', 
                      margin: '2rem auto 1rem' 
                    }}
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="h3" sx={{ fontWeight: 'bold' }}>
                    {category.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {category.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </>
  );
}

export default CategoriesPage;