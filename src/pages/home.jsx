import React from 'react';
import {Box, Button, Container, Typography, Grid, Paper} from '@mui/material';
import {useTheme} from '@mui/material/styles';
import Header from '../components/header.jsx';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faGithub, faLinkedin, faTwitter} from '@fortawesome/free-brands-svg-icons';

const HomePage = () => {
    const theme = useTheme();

    return (
        <Box
            sx={{
                minHeight: '100vh',
                width: '100%',
                backgroundColor: theme.palette.background.default,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'space-between',
                overflowX: 'hidden',
            }}
        >
            <title>Mon Portfolio - Accueil</title>

            {/* Header Section */}
            <Header/>

            <Container
                maxWidth="100%"
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    flexGrow: 1,
                    marginTop: 4,
                }}
            >
                <Typography
                    variant="h2"
                    gutterBottom
                    sx={{
                        fontWeight: 'bold',
                        color: theme.palette.primary.main,
                        textTransform: 'uppercase',
                        letterSpacing: 2,
                    }}
                >
                    Bienvenue sur mon portfolio
                </Typography>
                <Typography
                    variant="h6"
                    sx={{
                        color: theme.palette.text.secondary,
                        marginBottom: 4,
                        maxWidth: '80%',
                        fontSize: '1.2rem',
                        lineHeight: 1.8,
                    }}
                >
                    Bonjour, je m'appelle [Votre Nom], développeur expert en solutions innovantes !
                    Spécialisé dans la conception d'applications web modernes et performantes,
                    je combine design captivant et technologies avancées pour transformer vos idées en réalité.
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    sx={{
                        marginTop: 3,
                        padding: '15px 30px',
                        fontSize: '1.2rem',
                        fontWeight: 'bold',
                        textTransform: 'uppercase',
                        letterSpacing: 1,
                    }}
                >
                    Découvrir mes projets
                </Button>
            </Container>

            <Grid
                container
                spacing={4}
                justifyContent="center"
                sx={{
                    maxWidth: '100%',
                    padding: theme.spacing(6),
                }}
            >
                <Grid item xs={12} md={4}>
                    <Paper
                        elevation={5}
                        sx={{
                            padding: theme.spacing(5),
                            textAlign: 'center',
                            backgroundColor: theme.palette.background.paper,
                            boxShadow: `0 10px 20px ${theme.palette.primary.light}`,
                            transition: 'transform 0.3s ease-in-out',
                            '&:hover': {
                                transform: 'scale(1.05)',
                            },
                        }}
                    >
                        <Typography
                            variant="h5"
                            gutterBottom
                            sx={{
                                fontWeight: 'bold',
                                color: theme.palette.primary.dark,
                                letterSpacing: 1,
                            }}
                        >
                            Compétences Techniques
                        </Typography>
                        <Typography variant="body1" sx={{fontSize: '1rem', lineHeight: 1.6}}>
                            Expertise en React, Node.js, TypeScript, Java, Spring Boot, DevOps et autres
                            technologies indispensables à la réussite de vos projets.
                        </Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Paper
                        elevation={5}
                        sx={{
                            padding: theme.spacing(5),
                            textAlign: 'center',
                            backgroundColor: theme.palette.background.paper,
                            boxShadow: `0 10px 20px ${theme.palette.primary.light}`,
                            transition: 'transform 0.3s ease-in-out',
                            '&:hover': {
                                transform: 'scale(1.05)',
                            },
                        }}
                    >
                        <Typography
                            variant="h5"
                            gutterBottom
                            sx={{
                                fontWeight: 'bold',
                                color: theme.palette.primary.dark,
                                letterSpacing: 1,
                            }}
                        >
                            Projets Innovants
                        </Typography>
                        <Typography variant="body1" sx={{fontSize: '1rem', lineHeight: 1.6}}>
                            Un portfolio diversifié de projets créatifs, alliant performance, innovation
                            et design de qualité. Découvrez des solutions concrètes pour des enjeux complexes.
                        </Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Paper
                        elevation={5}
                        sx={{
                            padding: theme.spacing(5),
                            textAlign: 'center',
                            backgroundColor: theme.palette.background.paper,
                            boxShadow: `0 10px 20px ${theme.palette.primary.light}`,
                            transition: 'transform 0.3s ease-in-out',
                            '&:hover': {
                                transform: 'scale(1.05)',
                            }
                        }}
                    >
                        <Typography
                            variant="h5"
                            gutterBottom
                            sx={{
                                fontWeight: 'bold',
                                color: theme.palette.primary.dark,
                                letterSpacing: 1,
                            }}
                        >
                            Collaboration & Partenariats
                        </Typography>
                        <Typography variant="body1" sx={{fontSize: '1rem', lineHeight: 1.6}}>
                            Des méthodes de travail flexibles et collaboratives pour garantir un environnement
                            propice à votre succès. Contactez-moi pour débuter une belle aventure digitale.
                        </Typography>
                    </Paper>
                </Grid>
            </Grid>

            {/* Footer */}
            <Box
                component="footer"
                sx={{
                    width: '100%',
                    padding: 4,
                    backgroundColor: theme.palette.primary.main,
                    color: theme.palette.primary.contrastText,
                    textAlign: 'center',
                }}
            >
                <Typography variant="h6" sx={{marginBottom: 2, fontWeight: 'bold'}}>
                    Connectons-nous !
                </Typography>
                <Typography variant="body2" sx={{marginBottom: 3}}>
                    © 2023 Mon Portfolio. Tous droits réservés.
                </Typography>
                <Box>
                    <Button
                        variant="outlined"
                        color="inherit"
                        startIcon={<FontAwesomeIcon icon={faGithub}/>}
                        sx={{marginRight: 2}}
                        href="https://github.com/votreprofil"
                        target="_blank"
                    >
                        GitHub
                    </Button>
                    <Button
                        variant="outlined"
                        color="inherit"
                        startIcon={<FontAwesomeIcon icon={faLinkedin}/>}
                        sx={{marginRight: 2}}
                        href="https://linkedin.com/in/votreprofil"
                        target="_blank"
                    >
                        LinkedIn
                    </Button>
                    <Button
                        variant="outlined"
                        color="inherit"
                        startIcon={<FontAwesomeIcon icon={faTwitter}/>}
                        href="https://twitter.com/votreprofil"
                        target="_blank"
                    >
                        Twitter
                    </Button>
                </Box>
            </Box>
        </Box>
    );
};

export default HomePage;