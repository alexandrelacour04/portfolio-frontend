import React, {useEffect, useState} from 'react';
import {
    Timeline,
    TimelineItem,
    TimelineSeparator,
    TimelineConnector,
    TimelineContent,
    TimelineDot, TimelineOppositeContent
} from '@mui/lab';
import {
    Typography,
    Container,
    Box,
    CircularProgress,
    Alert,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Button
} from '@mui/material';
import Header from "../components/header.jsx";
import axios from 'axios';
import * as Icons from "@mui/icons-material";
import dayjs from "dayjs"; // Import dayjs for date formatting

const PortfolioTimeline = () => {
    const [events, setEvents] = useState([]); // Liste des événements
    const [loading, setLoading] = useState(true); // État de chargement
    const [error, setError] = useState(null); // État d'erreur
    const [open, setOpen] = useState(false); // État d'ouverture de la modale
    const [selectedEvent, setSelectedEvent] = useState(null); // Événement actuellement sélectionné

    // Charger les données depuis l'API
    useEffect(() => {
        const fetchTimelines = async () => {
            try {
                const response = await axios.get("http://localhost:8080/api/timelines");

                // Trier les événements par date (plus ancienne en premier)
                const sortedData = response.data.content.sort((a, b) => new Date(a.date) - new Date(b.date));

                setEvents(sortedData); // Stocker les données triées dans le state
            }
            catch (e) {
                setError("Erreur lors de la récupération des données de la timeline.");
            } finally {
                setLoading(false);
            }
        };
        fetchTimelines();
    }, []);

    // Fonction pour sélectionner une icône en fonction du type
    const getIconByType = (type) => {
        switch (type) {
            case 'EXPÉRIENCE':
                return <Icons.Work color="primary"/>;
            case 'STAGE':
                return <Icons.AssignmentInd color="secondary"/>;
            case 'ALTERNANCE':
                return <Icons.Business color="action"/>;
            case 'ENSEIGNEMENT':
                return <Icons.School color="warning"/>;
            case 'PERSO':
                return <Icons.HelpOutline color="info"/>;
            case 'AUTRE':
                return <Icons.Star color="disabled"/>;
            default:
                return <Icons.Event color="error"/>;
        }
    };

    // Ouvrir la modale avec l'événement sélectionné
    const handleOpen = (event) => {
        setSelectedEvent(event);
        setOpen(true);
    };

    // Fermer la modale
    const handleClose = () => {
        setOpen(false);
        setSelectedEvent(null);
    };

    if (loading) {
        return (
            <Container sx={{mt: 4, display: "flex", justifyContent: "center"}}>
                <CircularProgress/>
            </Container>
        );
    }

    if (error) {
        return (
            <Container sx={{mt: 4}}>
                <Alert severity="error">{error}</Alert>
            </Container>
        );
    }

    return (
        <>
            <title>Mon Portfolio - Timeline</title>
            {/* Header Section */}
            <Header/>

            <Container sx={{mt: 4, display: "flex", justifyContent: "center", alignItems: "flex-start", height: "100vh"}}>
                <Box sx={{display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center'}}>
                    <Typography variant="h4" color="text.primary" sx={{mb: 3}}>
                        Portfolio Timeline
                    </Typography>
                    {events.length === 0 ? (
                        <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 4}}>
                            <Icons.Construction color="action" style={{fontSize: 60}}/>
                            <Typography variant="h6" color="text.secondary" sx={{mt: 2}}>
                                En cours de travaux
                            </Typography>
                        </Box>
                    ) : (
                        <Timeline position="alternate" sx={{maxWidth: '800px', width: '100%'}}>
                            {events.map((event) => (
                                <TimelineItem key={event.id}>
                                    <TimelineOppositeContent color="text.secondary">
                                        {dayjs(event.date).format("DD/MM/YYYY")}
                                    </TimelineOppositeContent>
                                    <TimelineSeparator>
                                        <TimelineDot>
                                            {getIconByType(event.type)} {/* Affiche l'icône */}
                                        </TimelineDot>
                                        <TimelineConnector/>
                                    </TimelineSeparator>
                                    <TimelineContent>
                                        <Box
                                            sx={{
                                                mb: 2,
                                                padding: 2,
                                                borderRadius: 2,
                                                backgroundColor: '#f5f5f5',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                '&:hover': {
                                                    backgroundColor: '#e0e0e0',
                                                },
                                            }}
                                            onClick={() => handleOpen(event)} // Ouvrir la modale à clic
                                        >
                                            <Typography variant="h6" color="text.primary"
                                                        sx={{fontWeight: 'bold', wordBreak: 'break-word'}}>
                                                {event.titre}
                                            </Typography>
                                            <Typography variant="subtitle1" color="text.secondary"
                                                        sx={{mb: 1, wordBreak: 'break-word'}}>
                                                {event.sousTitre}
                                            </Typography>
                                        </Box>
                                    </TimelineContent>
                                </TimelineItem>
                            ))}
                        </Timeline>
                    )}
                </Box>
            </Container>

            {/* Modale pour afficher les détails */}
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>{selectedEvent?.titre || "Détails de l'événement"}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        <Typography variant="body2" color="text.secondary" sx={{mb: 1}}>
                            Sous-titre : {selectedEvent?.sousTitre}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{mt: 1}}>
                            Type : {selectedEvent?.type}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{mt: 1, mb: 2}}>
                            Date
                            : {selectedEvent?.date ? dayjs(selectedEvent.date).format("DD/MM/YYYY") : "Non définie"}
                        </Typography>
                        <Typography variant="body1" color="text.primary">
                            {selectedEvent?.description || "Aucune description disponible."}
                        </Typography>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Fermer
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default PortfolioTimeline;