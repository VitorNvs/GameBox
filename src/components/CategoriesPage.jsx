import React, { useState, useEffect } from 'react';
import { Container, Box, Typography, Grid, Card, CardContent, CardMedia, CircularProgress, Alert, Button } from '@mui/material'; // Importação do Button
import { Link } from 'react-router-dom';
import SettingsIcon from '@mui/icons-material/Settings'; // Ícone para o botão

// URL do seu JSON Server ou endpoint de API
// (Ajuste a porta/caminho conforme sua configuração)
const API_URL = 'http://localhost:8000/categories'; 

function CategoriesPage() {
  // 1. Estado para armazenar os dados das categorias
  const [categories, setCategories] = useState([]);
  // 2. Estado para gerenciar o loading
  const [loading, setLoading] = useState(true);
  // 3. Estado para gerenciar erros de requisição
  const [error, setError] = useState(null);

  // Hook para carregar os dados quando o componente for montado
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(API_URL);
        
        // Verifica se a resposta foi bem-sucedida (status 200-299)
        if (!response.ok) {
          throw new Error(`Erro de rede ou servidor. Status: ${response.status}`);
        }
        
        const data = await response.json();
        setCategories(data);
        setError(null); // Limpa qualquer erro anterior
      } catch (err) {
        console.error("Falha ao buscar categorias:", err);
        setError("Não foi possível carregar as categorias. Verifique a API.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []); // O array vazio [] garante que o useEffect rode apenas na montagem

  // --- Renderização Condicional ---

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 6, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>Carregando categorias...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (categories.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 6, textAlign: 'center' }}>
        <Alert severity="info">Nenhuma categoria encontrada.</Alert>
      </Container>
    );
  }

  // --- Renderização Padrão (Seção do Banner e Grid) ---

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

          {/* NOVO: Botão para a Página de Admin */}
          <Box sx={{ mt: 3 }}> 
            <Button
              component={Link}
              to="/admin/categories/adicionar" // Ajuste o caminho conforme a rota de admin
              variant="contained"
              color="secondary" // Usando 'secondary' para destacar a função administrativa
              startIcon={<SettingsIcon />}
            >
              Gerenciar Categorias
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Conteúdo Principal com o Grid de Categorias */}
<Container component="main" maxWidth="lg" sx={{ py: 6 }}>
    <Grid container spacing={4}>
        {categories.map((category) => (
            <Grid item key={category.id || category.title} xs={12} sm={6} md={4}>
                <Link to={`/categories/${category.title}`} style={{ textDecoration: 'none' }}>
                <Card 
                    sx={{ 
                        position: 'relative', 
                        textAlign: 'center', 
                        height: 240,  
                        width: 240,         
                        overflow: 'hidden',   
                        display: 'flex',
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        cursor: 'pointer',
                        borderRadius: '0% 10%' ,
                        transition: 'transform 0.3s ease-in-out',
                        '&:hover': {
                            transform: 'scale(1.03)', 
                        }
                    }}
                >
                    
                    {/* CardMedia (A Imagem) */}
                    <CardMedia
                        component="img"
                        image={category.image}
                        alt={category.alt}
                        sx={{ 
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%', 
                            height: '100%', 
                            objectFit: 'cover',
                            zIndex: 1, 
                        }}
                    />

                    {/* Overlay (Gradiente Escuro) para Legibilidade */}
                    <Box
                        sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            background: 'linear-gradient(to top, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0.2) 50%, rgba(0, 0, 0, 0.5) 100%)',
                            zIndex: 2, 
                        }}
                    />

                    {/* CardContent (O Texto) */}
                    <CardContent 
                        sx={{
                            position: 'relative', 
                            zIndex: 3,            
                            color: 'white',       
                            textShadow: '0 0 5px black', 
                            padding: 3
                        }}
                    >
                        <Typography variant="h5" component="h3" sx={{ fontWeight: 'bold' }}>
                            {category.title}
                        </Typography>
                    </CardContent>
                </Card>
              </Link>
            </Grid>
        ))}
    </Grid>
</Container>
    </>
  );
}

export default CategoriesPage;