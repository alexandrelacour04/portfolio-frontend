import React, {useState, useEffect} from 'react';
import {
    Box,
    Card,
    CardActions,
    CardContent,
    CardMedia,
    Button,
    Typography,
    CircularProgress,
    Container,
    Grid,
    Alert,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from '@mui/material';
import Header from "../components/header.jsx";
import axios from 'axios';
import dayjs from 'dayjs'; // Pour le formatage des dates

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const ProjectsPage = () => {
    const [projects, setProjects] = useState([]); // Liste des projets
    const [loading, setLoading] = useState(true); // État de chargement
    const [error, setError] = useState(null); // État d'erreur
    const [open, setOpen] = useState(false); // État d'ouverture de la modale
    const [selectedProject, setSelectedProject] = useState(null); // Projet actuellement sélectionné

    // Charger les projets depuis l'API
    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/api/projects`);
                setProjects(response.data.content); // Stocker les projets dans le state
            } catch (e) {
                setError("Erreur lors de la récupération des projets.");
            } finally {
                setLoading(false);
            }
        };
        fetchProjects();
    }, []);

    // Ouvrir la modale pour afficher les détails d'un projet
    const handleOpen = (project) => {
        setSelectedProject(project);
        setOpen(true);
    };

    // Fermer la modale
    const handleClose = () => {
        setOpen(false);
        setSelectedProject(null);
    };

    if (loading) {
        return (
            <Container
                sx={{
                    mt: 4,
                    pb: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'flex-start', // Align content to the top
                    minHeight: '100vh',
                    textAlign: 'center'
                }}
            >
                <CircularProgress/>
            </Container>
        );
    }

    if (error) {
        return (
            <Container
                sx={{
                    mt: 4,
                    pb: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'flex-start', // Align content to the top
                    minHeight: '100vh',
                    textAlign: 'center'
                }}
            >
                <Alert severity="error">{error}</Alert>
            </Container>
        );
    }

    return (
        <>
            <title>Mes Projets</title>
            <Header/>
            <Container
                sx={{
                    mt: 4,
                    pb: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'flex-start', // Align content to the top
                    minHeight: '100vh',
                    textAlign: 'center'
                }}
            >
                <Box sx={{maxWidth: 800}}>
                    <Typography variant="h2" gutterBottom fontWeight="bold">
                        Mes Projets
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{mb: 4}}>
                        Découvrez les projets sur lesquels j'ai travaillé. Vous y trouverez des informations détaillées,
                        ainsi que des liens vers leurs dépôts GitHub ou leurs sites en ligne.
                    </Typography>
                </Box>
                {projects.length === 0 ? (
                    <Box sx={{display: 'flex', justifyContent: 'center', mt: 4}}>
                        <Typography variant="h6" color="text.secondary">
                            Aucun projet trouvé.
                        </Typography>
                    </Box>
                ) : (
                    <Grid container spacing={4} justifyContent="center">
                        {projects.map((project) => (
                            <Grid item xs={12} sm={6} md={4} key={project.id}>
                                <Card sx={{boxShadow: 3, borderRadius: 4}}>
                                    <CardContent sx={{textAlign: 'center'}}>
                                        <Typography gutterBottom variant="h6" component="div" fontWeight="bold">
                                            {project.title}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {project.subtitle}
                                        </Typography>
                                    </CardContent>
                                    <CardActions sx={{justifyContent: 'center'}}>
                                        <Button
                                            size="small"
                                            variant="contained"
                                            color="primary"
                                            onClick={() => handleOpen(project)}
                                            sx={{textTransform: 'none'}}
                                        >
                                            Voir Détails
                                        </Button>
                                    </CardActions>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Container>

            {/* Dialog pour afficher les détails du projet */}
            <Dialog open={open} onClose={handleClose}>
                {selectedProject && (
                    <>
                        <DialogTitle sx={{textAlign: 'center', fontWeight: 'bold'}}>
                            {selectedProject.title}
                        </DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                <Typography variant="subtitle1" gutterBottom>
                                    {selectedProject.subtitle}
                                </Typography>
                                <Typography variant="body2" gutterBottom>
                                    {selectedProject.description || "Aucune description disponible."}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Tags : {selectedProject.tags || "Aucun"}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                    Technologies : {selectedProject.technologies || "Non spécifiées"}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Statut : {selectedProject.status || "Indéfini"}
                                </Typography>
                                {selectedProject.startDate && (
                                    <Typography variant="body2" color="text.secondary">
                                        Début : {dayjs(selectedProject.startDate).format("DD MMM YYYY")}
                                    </Typography>
                                )}
                                {selectedProject.endDate && (
                                    <Typography variant="body2" color="text.secondary">
                                        Fin : {dayjs(selectedProject.endDate).format("DD MMM YYYY")}
                                    </Typography>
                                )}
                            </DialogContentText>
                            <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 2}}>
                                {selectedProject.liveUrl && (
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        href={selectedProject.liveUrl}
                                        target="_blank"
                                        sx={{mb: 2, textTransform: 'none'}}
                                    >
                                        Voir le site en ligne
                                    </Button>
                                )}
                                {selectedProject.repositoryUrl && (
                                    <Button
                                        variant="outlined"
                                        color="secondary"
                                        href={selectedProject.repositoryUrl}
                                        target="_blank"
                                        sx={{textTransform: 'none'}}
                                    >
                                        Voir le dépôt
                                    </Button>
                                )}
                            </Box>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleClose} color="primary">
                                Fermer
                            </Button>
                        </DialogActions>
                    </>
                )}
            </Dialog>
        </>
    );
};

export default ProjectsPage;