import { createTheme } from '@mui/material/styles';

// Tema customizado baseado no estilo da HomePage
export const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#38bdf8', // Cor de destaque (azul)
        },
        background: {
            default: '#121829', // Cor de fundo do body
            paper: '#1F2937',    // Cor de fundo dos cards, header e footer
        },
        text: {
            primary: '#f9f9f9',
            secondary: '#9CA3AF',
        },
    },
    typography: {
        fontFamily: 'Montserrat, sans-serif',
        h1: { fontSize: '1.8rem', fontWeight: 700 },
        h4: { fontWeight: 700 },
        h6: { fontWeight: 'bold' },
    },
});