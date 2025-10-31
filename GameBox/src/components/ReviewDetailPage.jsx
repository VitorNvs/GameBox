import React from 'react';

import {

    Container, Box, Typography, Grid, Paper, TextField, Button, Avatar, Card, CardContent, Divider,

} from '@mui/material';

import { Favorite, ThumbDown, ThumbUp } from '@mui/icons-material';



const ReviewDetailPage = () => {

  return (

    <Container maxWidth="md" sx={{ my: 4 }}>

      <Paper sx={{ p: 4 }}>

        <Typography variant="h4" component="h1" align="center" gutterBottom fontWeight="700">

          The Witcher 3: Wild Hunt

        </Typography>



        <Grid container spacing={4} sx={{ my: 2 }}>

          <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>

            <Box component="img" src="/imgs/witcher3.jpg" sx={{ width: '100%', maxWidth: 250, borderRadius: 2 }} />

            <Typography variant="subtitle1" color="text.secondary" sx={{ mt: 1 }}>

              Análise de **NomeDoUsuário**

            </Typography>

          </Grid>

          <Grid item xs={12} md={8}>

            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>

              <Button variant="outlined" disabled><ThumbDown /></Button>

              <Button variant="outlined" disabled><ThumbUp /></Button>

              <Button variant="contained"><Favorite /></Button>

            </Box>

            <Typography paragraph color="text.secondary">

              The Witcher 3: Wild Hunt é, sem dúvida, um dos maiores RPGs de todos os tempos...

            </Typography>

          </Grid>

        </Grid>



        <Divider sx={{ my: 4 }} />



        <Box>

          <Typography variant="h5" component="h2" gutterBottom fontWeight="bold">Comentários</Typography>

          <Box component="form" sx={{ mb: 3 }}>

            <TextField fullWidth multiline rows={3} label="Adicione um comentário" />

            <Button variant="contained" sx={{ mt: 1 }}>Comentar</Button>

          </Box>

          <Card variant="outlined" sx={{ mb: 2 }}>

            <CardContent>

              <Typography variant="subtitle2" component="p" fontWeight="bold">OutroUsuário</Typography>

              <Typography variant="body2" color="text.secondary">

                Concordo plenamente! A história é incrível e a trilha sonora é de arrepiar.

              </Typography>

            </CardContent>

          </Card>

        </Box>

      </Paper>

    </Container>

  );

};



export default ReviewDetailPage;