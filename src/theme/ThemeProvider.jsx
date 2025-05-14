import React, {useState, useMemo} from 'react';
import {createTheme, ThemeProvider, responsiveFontSizes} from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import {blue, lightBlue} from '@mui/material/colors';
import PropTypes from 'prop-types';
import MyAppBar from '../components/header';

const AppThemeProvider = ({children}) => {
    const [mode, setMode] = useState('light');

    const toggleThemeMode = () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
    };

    const theme = useMemo(() => {
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
                            display: "flex",
                            flexDirection: "column",
                            margin: 0,
                            padding: 0,
                            minHeight: "100vh",
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
                MuiContainer: {
                    styleOverrides: {
                        root: {
                            maxWidth: '100%',
                            paddingLeft: 0,
                            paddingRight: 0,
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
                        }
                    }
                },
                MuiTableCell: {
                    styleOverrides: {
                        root: {
                            borderBottom: `1px solid ${mode === 'light'
                                ? 'rgba(0, 0, 0, 0.12)'
                                : 'rgba(224, 224, 224, 0.2)'}`
                        }
                    }
                },
                MuiTextField: {
                    styleOverrides: {
                        root: {
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                    borderColor: mode === 'light'
                                        ? 'rgba(0, 0, 0, 0.23)'
                                        : 'rgba(224, 224, 224, 0.3)',
                                },
                                '&:hover fieldset': {
                                    borderColor: blue[400],
                                },
                            },
                        }
                    }
                }
            }
        });

        return responsiveFontSizes(baseTheme);
    }, [mode]);

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline/>
            <MyAppBar mode={mode} toggleThemeMode={toggleThemeMode}/>
            {children}
        </ThemeProvider>
    );
};

AppThemeProvider.propTypes = {
    children: PropTypes.node.isRequired
};

export default AppThemeProvider;