import {createTheme, ThemeProvider, responsiveFontSizes} from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import {blue, lightBlue} from '@mui/material/colors';

// Création du thème
let theme = createTheme({
    palette: {
        mode: 'dark', // Mode sombre
        primary: {
            main: blue[500], // Bleu principal
        },
        secondary: {
            main: lightBlue[500], // Bleu clair secondaire
        },
        background: {
            default: '#121212', // Noir profond
            paper: '#1e1e1e', // Noir légèrement plus clair pour les éléments de type "papier"
        },
        text: {
            primary: '#e0e0e0', // Texte principal gris clair
            secondary: '#b0bec5', // Texte secondaire bleu-gris clair
        },
    },
    typography: {
        fontFamily: `'Roboto', 'Helvetica', 'Arial', sans-serif`,
        h1: {
            fontSize: '3rem',
            fontWeight: 700,
            color: blue[400], // Accent bleu pour les titres
        },
        h2: {
            fontSize: '2.5rem',
            fontWeight: 600,
            color: blue[300],
        },
        h3: {
            fontSize: '2rem',
            fontWeight: 500,
            color: lightBlue[300],
        },
        body1: {
            fontSize: '1rem',
            lineHeight: 1.6,
        },
        body2: {
            fontSize: '0.875rem',
            lineHeight: 1.5,
        },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    textTransform: 'none', // Désactive la capitalisation automatique
                    fontWeight: 'bold',
                },
                containedPrimary: {
                    backgroundColor: blue[500],
                    color: '#fff',
                    '&:hover': {
                        backgroundColor: blue[700],
                    },
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    padding: '16px',
                    borderRadius: '12px',
                    backgroundColor: '#1e1e1e', // Fond des cartes noir légèrement plus clair
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)',
                },
            },
        },
    },
});

// Rendre la typographie réactive
theme = responsiveFontSizes(theme);

// HOC pour appliquer le thème
const AppThemeProvider = ({children}) => (
    <ThemeProvider theme={theme}>
        <CssBaseline/>
        {children}
    </ThemeProvider>
);

export default AppThemeProvider;