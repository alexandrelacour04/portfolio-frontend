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
    Chip,
    IconButton
} from '@mui/material';
import Header from "../components/header.jsx";
import axios from 'axios';
import dayjs from 'dayjs';
import PageTitle from "../common/pageTitle.jsx";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const ProjectsPage = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [open, setOpen] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/api/projects`);
                setProjects(response.data.content);
            } catch (e) {
                setError("Erreur lors de la récupération des projets.");
            } finally {
                setLoading(false);
            }
        };
        fetchProjects();
    }, []);

    const handleOpen = (project) => {
        setSelectedProject(project);
        setCurrentImageIndex(0);
        setOpen(true);
    };

    const PrevArrow = ({onClick}) => {
        return (
            <IconButton
                sx={{
                    position: "absolute",
                    left: 0,
                    top: "50%",
                    transform: "translate(0, -50%)",
                    zIndex: 10,
                    marginLeft: 2,
                    color: "lightgray",
                }}
                onClick={(e) => {
                    e.stopPropagation();
                    onClick();
                    if (currentImageIndex > 0) {
                        setCurrentImageIndex(prev => prev - 1);
                    }
                }}
            >
                <ArrowBackIosIcon/>
            </IconButton>
        );
    };

    const NextArrow = ({onClick}) => {
        return (
            <IconButton
                sx={{
                    position: "absolute",
                    right: 0,
                    top: "50%",
                    transform: "translate(0, -50%)",
                    zIndex: 10,
                    marginRight: 2,
                    color: "lightgray",
                }}
                onClick={(e) => {
                    e.stopPropagation();
                    onClick();
                    if (selectedProject?.otherImages &&
                        currentImageIndex < selectedProject.otherImages.split('|£|').length - 1) {
                        setCurrentImageIndex(prev => prev + 1);
                    }
                }}
            >
                <ArrowForwardIosIcon/>
            </IconButton>
        );
    };

    const sliderSettings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        prevArrow: <PrevArrow/>,
        nextArrow: <NextArrow/>,
        beforeChange: (current, next) => setCurrentImageIndex(next)
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedProject(null);
        setCurrentImageIndex(0);
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
                    justifyContent: 'flex-start',
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
                    justifyContent: 'flex-start',
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
            <PageTitle title="Projets"/>
            <title>Mes Projets</title>
            <Header/>
            <Container
                sx={{
                    mt: 4,
                    pb: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
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
                                <Card
                                    sx={{boxShadow: 3, borderRadius: 4, cursor: 'pointer'}}
                                    onClick={() => handleOpen(project)}
                                >
                                    {project.coverImage && (
                                        <CardMedia
                                            component="img"
                                            height="140"
                                            image={project.coverImage}
                                            alt={project.title}
                                            sx={{objectFit: "cover"}}
                                        />
                                    )}
                                    <CardContent sx={{textAlign: 'center'}}>
                                        <Typography gutterBottom variant="h6" component="div" fontWeight="bold">
                                            {project.title}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {project.subtitle}
                                        </Typography>

                                        <Box
                                            sx={{
                                                display: 'flex',
                                                flexWrap: 'wrap',
                                                gap: 1,
                                                justifyContent: 'center',
                                                mt: 2,
                                            }}
                                        >
                                            {project.technologies && project.technologies.trim() !== "" &&
                                                project.technologies.split(',')
                                                    .map((tech, index) => (
                                                        <Chip
                                                            key={index}
                                                            label={tech.trim()}
                                                            sx={{
                                                                backgroundColor: `#${((tech.trim().charCodeAt(0) * 123456) % 0xFFFFFF)
                                                                    .toString(16)
                                                                    .padStart(6, "0")}`,
                                                                color: 'white',
                                                                fontWeight: 'bold',
                                                                textTransform: 'capitalize',
                                                                px: 2,
                                                            }}
                                                        />
                                                    ))}
                                        </Box>
                                    </CardContent>
                                    <CardActions sx={{justifyContent: 'center'}}/>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Container>

            <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
                {selectedProject && (
                    <>
                        <Box sx={{maxWidth: "100%", overflow: "hidden", position: "relative"}}>
                            {selectedProject?.otherImages ? (
                                <Slider
                                    {...sliderSettings}
                                    appendDots={(dots) => (
                                        <Box
                                            sx={{
                                                bottom: -30,
                                                display: "flex",
                                                justifyContent: "center",
                                                gap: 1,
                                                position: "absolute",
                                                width: "100%",
                                            }}
                                        >
                                            {dots}
                                        </Box>
                                    )}
                                    dotStyle={{width: 10, height: 10, backgroundColor: "gray", borderRadius: "50%"}}
                                >
                                    {selectedProject.otherImages.split('|£|').map((imageUrl, index) => (
                                        <Box key={index} sx={{textAlign: "center", position: "relative"}}>
                                            <CardMedia
                                                component="img"
                                                height="300"
                                                image={imageUrl.trim()}
                                                alt={`Image ${index}`}
                                                sx={{
                                                    objectFit: "cover",
                                                    width: "100%",
                                                }}
                                            />
                                            <Typography
                                                variant="caption"
                                                sx={{
                                                    position: "absolute",
                                                    bottom: 10,
                                                    right: 10,
                                                    backgroundColor: "rgba(0,0,0,0.7)",
                                                    color: "white",
                                                    padding: "4px 8px",
                                                    borderRadius: "4px"
                                                }}
                                            >
                                                {`${index + 1} / ${selectedProject.otherImages.split('|£|').length}`}
                                            </Typography>
                                        </Box>
                                    ))}
                                </Slider>
                            ) : (
                                selectedProject?.coverImage && (
                                    <CardMedia
                                        component="img"
                                        height="300"
                                        image={selectedProject.coverImage}
                                        alt={selectedProject.title}
                                        sx={{
                                            objectFit: "cover",
                                            width: "100%",
                                        }}
                                    />
                                )
                            )}
                        </Box>
                        <DialogTitle
                            sx={{
                                textAlign: 'center',
                                fontWeight: 'bold',
                                fontSize: '2rem',
                                color: 'primary.main',
                            }}
                        >
                            {selectedProject.title}
                        </DialogTitle>
                        <DialogContent sx={{overflowX: 'hidden'}}>
                            <DialogContentText>
                                <Typography variant="h6" gutterBottom sx={{fontWeight: 'bold', mb: 2}}>
                                    {selectedProject.subtitle}
                                </Typography>
                                <Typography variant="body1" gutterBottom sx={{lineHeight: 1.8}}>
                                    {selectedProject.description || "Aucune description disponible."}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{mt: 2, mb: 2}}>
                                    <strong>Tags :</strong> {selectedProject.tags || "Aucun"}
                                </Typography>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexWrap: 'wrap',
                                        justifyContent: 'flex-start',
                                    }}
                                >
                                    {(selectedProject.technologies || "Non spécifiées")
                                        .split(',')
                                        .map((tech, index) => {
                                            const colorHash = `#${((tech.trim().charCodeAt(0) * 123450) % 0xFFFFFF)
                                                .toString(16)
                                                .padStart(6, "0")}`;
                                            return (
                                                <Typography
                                                    key={index}
                                                    variant="body2"
                                                    color="text.primary"
                                                    sx={{
                                                        backgroundColor: colorHash,
                                                        px: 2,
                                                        py: 0.8,
                                                        borderRadius: 20,
                                                        display: 'inline-block',
                                                        mx: 0.8,
                                                        my: 0.8,
                                                        fontWeight: 'bold',
                                                        textAlign: 'center',
                                                        fontSize: '0.875rem',
                                                    }}
                                                >
                                                    {tech.trim()}
                                                </Typography>
                                            );
                                        })}
                                </Box>
                                <Box sx={{display: 'flex', alignItems: 'center', gap: 2, mt: 2}}>
                                    <Typography variant="body2" sx={{fontWeight: 'bold'}}>Statut :</Typography>
                                    {selectedProject.status ? (
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                px: 2,
                                                py: 1,
                                                borderRadius: 12,
                                                display: 'inline-block',
                                                fontWeight: 'bold',
                                                textAlign: 'center',
                                                backgroundColor:
                                                    selectedProject.status === "En cours"
                                                        ? "deepskyblue"
                                                        : selectedProject.status === "Terminé"
                                                            ? "green"
                                                            : selectedProject.status === "Archivé"
                                                                ? "gray"
                                                                : "lightgray",
                                                color: "white",
                                                fontSize: '0.9rem',
                                            }}
                                        >
                                            {selectedProject.status}
                                        </Typography>
                                    ) : (
                                        <Typography variant="body2" color="text.secondary">Indéfini</Typography>
                                    )}
                                </Box>
                                <Box sx={{mt: 3}}>
                                    {selectedProject.startDate && (
                                        <Typography variant="body2" color="text.secondary" sx={{mb: 1}}>
                                            <strong>Début
                                                :</strong> {dayjs(selectedProject.startDate).format("DD MMM YYYY")}
                                        </Typography>
                                    )}
                                    {selectedProject.endDate && (
                                        <Typography variant="body2" color="text.secondary">
                                            <strong>Fin
                                                :</strong> {dayjs(selectedProject.endDate).format("DD MMM YYYY")}
                                        </Typography>
                                    )}
                                </Box>
                            </DialogContentText>
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    mt: 3,
                                    gap: 2,
                                }}
                            >
                                {selectedProject.liveUrl && (
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        href={selectedProject.liveUrl}
                                        target="_blank"
                                        sx={{
                                            width: '80%',
                                            py: 1,
                                            fontSize: '1rem',
                                            textTransform: 'none',
                                        }}
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
                                        sx={{
                                            width: '80%',
                                            py: 1,
                                            fontSize: '1rem',
                                            textTransform: 'none',
                                        }}
                                    >
                                        Voir le dépôt
                                    </Button>
                                )}
                            </Box>
                        </DialogContent>
                        <DialogActions sx={{justifyContent: 'center', py: 2}}>
                            <Button
                                onClick={handleClose}
                                color="primary"
                                variant="contained"
                                sx={{px: 4, py: 1, fontSize: '1rem', textTransform: 'none'}}
                            >
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