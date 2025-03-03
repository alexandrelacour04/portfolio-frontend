import {createTheme, responsiveFontSizes} from '@mui/material/styles';

const persoTheme = (mode) =>
    responsiveFontSizes(
        createTheme({
            palette: {
                mode,
                ...(mode === 'light'
                    ? {
                        // Couleurs pour le mode clair
                        primary: {main: '#1976d2', contrastText: '#ffffff'},
                        secondary: {main: '#ff9800', contrastText: '#000000'},
                        error: {main: '#d32f2f'},
                        warning: {main: '#ffa726'},
                        info: {main: '#29b6f6'},
                        success: {main: '#66bb6a'},
                        background: {
                            default: '#f4f6f8',
                            paper: '#ffffff',
                        },
                        text: {
                            primary: '#000000',
                            secondary: '#555555',
                            disabled: 'rgba(0, 0, 0, 0.38)',
                        },
                        divider: 'rgba(0, 0, 0, 0.12)',
                    }
                    : {
                        // Couleurs pour le mode sombre
                        primary: {main: '#bb86fc', contrastText: '#000000'},
                        secondary: {main: '#03dac6', contrastText: '#000000'},
                        error: {main: '#cf6679'},
                        warning: {main: '#ffab40'},
                        info: {main: '#4fc3f7'},
                        success: {main: '#81c784'},
                        background: {
                            default: '#121212',
                            paper: '#1e1e1e',
                        },
                        text: {
                            primary: '#ffffff',
                            secondary: '#aaaaaa',
                            disabled: 'rgba(255, 255, 255, 0.5)',
                        },
                        divider: 'rgba(255, 255, 255, 0.12)',
                    }),
            },
            typography: {
                fontFamily: '"Roboto", "Arial", sans-serif',
                h1: {fontSize: '2.5rem', fontWeight: 500},
                h2: {fontSize: '2rem', fontWeight: 500},
                h3: {fontSize: '1.75rem', fontWeight: 500},
                h4: {fontSize: '1.5rem', fontWeight: 500},
                h5: {fontSize: '1.25rem', fontWeight: 500},
                h6: {fontSize: '1rem', fontWeight: 500},
                body1: {fontSize: '1rem'},
                body2: {fontSize: '0.875rem'},
                button: {fontWeight: 700, textTransform: 'none'},
                caption: {fontSize: '0.75rem'},
                overline: {fontSize: '0.75rem', textTransform: 'uppercase'},
            },
            components: {
                // Personnalisation de l'AppBar
                MuiAppBar: {
                    styleOverrides: {
                        root: {
                            backgroundColor: mode === 'light' ? '#1976d2' : '#333333',
                            color: mode === 'light' ? '#ffffff' : '#ffffff',
                        },
                    },
                },
                // Personnalisation du Drawer
                MuiDrawer: {
                    styleOverrides: {
                        paper: {
                            backgroundColor: mode === 'light' ? '#ffffff' : '#1e1e1e',
                            color: mode === 'light' ? '#000000' : '#ffffff',
                        },
                    },
                },
                // Personnalisation des boutons
                MuiButton: {
                    styleOverrides: {
                        root: {
                            borderRadius: 8,
                            textTransform: 'none',
                        },
                    },
                },
                // Personnalisation des champs de texte
                MuiTextField: {
                    styleOverrides: {
                        root: {
                            '& .MuiInputBase-root': {
                                backgroundColor: mode === 'light' ? '#ffffff' : '#2c2c2c',
                                borderRadius: 4,
                            },
                        },
                    },
                },
                // Personnalisation des cartes
                MuiCard: {
                    styleOverrides: {
                        root: {
                            backgroundColor: mode === 'light' ? '#ffffff' : '#1e1e1e',
                            color: mode === 'light' ? '#000000' : '#ffffff',
                            borderRadius: 12,
                        },
                    },
                },
                // Personnalisation des diviseurs
                MuiDivider: {
                    styleOverrides: {
                        root: {
                            backgroundColor: mode === 'light' ? 'rgba(0, 0, 0, 0.12)' : 'rgba(255, 255, 255, 0.12)',
                        },
                    },
                },
                // Personnalisation des listes
                MuiList: {
                    styleOverrides: {
                        root: {
                            backgroundColor: mode === 'light' ? '#ffffff' : '#1e1e1e',
                        },
                    },
                },
            },
        })
    );

export default persoTheme;