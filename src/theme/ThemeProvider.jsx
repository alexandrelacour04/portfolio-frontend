import React, { createContext, useState, useMemo, useEffect } from 'react';
import { createTheme, ThemeProvider, responsiveFontSizes } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { blue, lightBlue } from '@mui/material/colors';
import PropTypes from 'prop-types';
import MyAppBar from '../components/header';
import { Box, Typography } from '@mui/material';

export const ThemeContext = createContext({
    mode: 'light',
    toggleThemeMode: () => {},
});

const AppThemeProvider = ({ children }) => {
    const [mode, setMode] = useState(() => localStorage.getItem('themeMode') || 'light');

    useEffect(() => {
        localStorage.setItem('themeMode', mode);
    }, [mode]);

    const toggleThemeMode = () => {
        setMode((prevMode) => {
            const newMode = prevMode === 'light' ? 'dark' : 'light';
            console.log('toggleThemeMode: Nouveau mode =', newMode);
            return newMode;
        });
    };

    const theme = useMemo(() => {
        console.log('Création du thème pour mode =', mode);
        let baseTheme = createTheme({
            palette: {
                mode,
                primary: {
                    main: blue[500],
                },
                secondary: {
                    main: lightBlue[500],
                },
                background: {
                    default: mode === 'light' ? '#ffffff' : '#121212',
                    paper: mode === 'light' ? '#f9f9f9' : '#1e1e1e',
                },
                text: {
                    primary: mode === 'light' ? '#213547' : '#e0e0e0',
                    secondary: mode === 'light' ? '#607d8b' : '#b0bec5',
                },
            },
            components: {
                MuiCssBaseline: {
                    styleOverrides: {
                        body: {
                            backgroundColor: mode === 'light' ? '#ffffff' : '#121212',
                            color: mode === 'light' ? '#213547' : '#e0e0e0',
                            display: 'flex',
                            flexDirection: 'column',
                            margin: 0,
                            padding: 0,
                            minHeight: '100vh',
                            width: '100%',
                            overflowX: 'hidden',
                        },
                        html: {
                            width: '100%',
                            height: '100%',
                        },
                        '#root': {
                            width: '100%',
                            height: '100%',
                        },
                    },
                },
                MuiAppBar: {
                    styleOverrides: {
                        root: {
                            width: '100%',
                            margin: 0,
                            padding: 0,
                            position: 'sticky',
                            top: 0,
                            zIndex: 1100,
                        },
                    },
                },
                MuiButton: {
                    styleOverrides: {
                        root: {
                            borderRadius: 8,
                            textTransform: 'none',
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
                            backgroundColor: mode === 'light' ? '#ffffff' : '#1e1e1e',
                            boxShadow: mode === 'light'
                                ? '0 4px 20px rgba(0, 0, 0, 0.1)'
                                : '0 4px 20px rgba(0, 0, 0, 0.4)',
                        },
                    },
                },
                MuiPaper: {
                    styleOverrides: {
                        root: {
                            backgroundColor: mode === 'light' ? '#ffffff' : '#1e1e1e',
                            padding: '16px',
                        },
                    },
                },
            },
        });

        console.log('Thème créé:', baseTheme.palette);
        return responsiveFontSizes(baseTheme);
    }, [mode]);

    return (
        <ThemeContext.Provider value={{ mode, toggleThemeMode }}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <MyAppBar />
                <Box sx={{ p: 2, bgcolor: 'background.default', color: 'text.primary' }}>
                    <Typography variant="body2">Mode actuel: {mode}</Typography>
                </Box>
                {children}
            </ThemeProvider>
        </ThemeContext.Provider>
    );
};

AppThemeProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export default AppThemeProvider;