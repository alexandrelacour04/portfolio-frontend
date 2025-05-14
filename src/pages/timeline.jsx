import React, {useEffect, useState} from 'react';
import {
    Timeline,
    TimelineItem,
    TimelineSeparator,
    TimelineConnector,
    TimelineContent,
    TimelineDot, TimelineOppositeContent
} from '@mui/lab';
import {useTheme} from '@mui/material/styles';
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
import dayjs from "dayjs";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const PortfolioTimeline = () => {
    const theme = useTheme();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [open, setOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);

    useEffect(() => {
        const fetchTimelines = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/api/timelines`);
                const sortedData = response.data.content.sort((a, b) => new Date(a.date) - new Date(b.date));
                setEvents(sortedData);
            } catch (e) {
                setError("Erreur lors de la récupération des données de la timeline.");
                console.log(e)
            } finally {
                setLoading(false);
            }
        };
        fetchTimelines();
    }, []);

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

    const handleOpen = (event) => {
        setSelectedEvent(event);
        setOpen(true);
    };

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
        <Box
            sx={{
                width: "100%",
                minHeight: "100vh",
                backgroundColor: theme.palette.background.default,
                color: theme.palette.text.primary,
            }}
        >
            <Header/>
            <Container>
                <Typography variant="h4" sx={{mb: 3, textAlign: "center", paddingTop: 4, paddingBottom: 2, fontWeight: 'bold'}}>
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
                    <Timeline position="alternate" sx={{maxWidth: '800px', mx: "auto"}}>
                        {events.map((event) => (
                            <TimelineItem key={event.id}>
                                <TimelineOppositeContent color="text.secondary">
                                    {dayjs(event.date).format("DD/MM/YYYY")}
                                </TimelineOppositeContent>
                                <TimelineSeparator>
                                    <TimelineDot>
                                        {getIconByType(event.type)}
                                    </TimelineDot>
                                    <TimelineConnector/>
                                </TimelineSeparator>
                                <TimelineContent>
                                    <Box
                                        sx={{
                                            mb: 2,
                                            padding: 2,
                                            borderRadius: 2,
                                            backgroundColor: theme.palette.background.paper,
                                            cursor: 'pointer',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            boxShadow: 1,
                                            '&:hover': {
                                                backgroundColor: theme.palette.action.hover,
                                            },
                                        }}
                                        onClick={() => handleOpen(event)}
                                    >
                                        <Typography variant="h6" sx={{fontWeight: 'bold', wordBreak: 'break-word'}}>
                                            {event.titre}
                                        </Typography>
                                        <Typography variant="subtitle1" sx={{mb: 1, wordBreak: 'break-word'}}>
                                            {event.sousTitre}
                                        </Typography>
                                    </Box>
                                </TimelineContent>
                            </TimelineItem>
                        ))}
                    </Timeline>
                )}
            </Container>

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
        </Box>
    );
};

export default PortfolioTimeline;