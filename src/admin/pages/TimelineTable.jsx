import React, {useEffect, useState} from "react";
import {
    Box,
    Button,
    Container,
    Typography,
    CircularProgress,
    Alert,
    Modal,
    TextField,
    Grid,
    MenuItem,
} from "@mui/material";
import {DataGrid, GridToolbar} from "@mui/x-data-grid";
import axios from "axios";
import IconSelector from "./../component/IconSelector"; // Importer IconSelector
import * as Icons from "@mui/icons-material"; // Permet d'afficher les icônes
import dayjs from "dayjs"; // Importation de dayjs pour la gestion des dates

const TimelinesPage = () => {
    const [timelines, setTimelines] = useState([]); // Liste des timelines
    const [loading, setLoading] = useState(true); // État de chargement
    const [error, setError] = useState(null); // État d'erreur
    const [modalOpen, setModalOpen] = useState(false); // État pour la modal
    const [iconModalOpen, setIconModalOpen] = useState(false); // État pour la modale IconSelector
    const [selectedTimeline, setSelectedTimeline] = useState(null); // Timeline sélectionnée pour modification
    const [form, setForm] = useState({
        id: "",
        titre: "",
        sousTitre: "",
        type: "",
        date: "",
        description: "",
    }); // Formulaire de création/mise à jour

    const types = ["EXPÉRIENCE", "STAGE", "ALTERNANCE", "ENSEIGNEMENT", "PERSO", "AUTRE"]; // Liste des types disponibles

    // Chargement des timelines
    useEffect(() => {
        const fetchTimelines = async () => {
            try {
                const response = await axios.get("http://localhost:8080/api/timelines");
                const formattedTimelines = response.data.content.map((timeline) => ({
                    ...timeline,
                    date: dayjs(timeline.date).format("DD/MM/YYYY"), // Formater la date
                }));
                setTimelines(formattedTimelines); // Assurez-vous que "content" correspond à la structure de l'API
            } catch (e) {
                setError("Erreur lors de la récupération des données");
            } finally {
                setLoading(false);
            }
        };
        fetchTimelines();
    }, []);

    // Gestion des changements du formulaire
    const handleFormChange = (e) => {
        setForm({...form, [e.target.name]: e.target.value});
    };

    // Ouvrir la modal principale
    const handleOpenModal = (timeline = null) => {
        if (timeline) {
            setForm({
                ...timeline,
                date: dayjs(timeline.date, "DD/MM/YYYY").format("YYYY-MM-DD"), // Convertir pour affichage dans le champ input
            }); // Pré-remplir le formulaire si modification
        } else {
            setForm({
                id: "",
                titre: "",
                sousTitre: "",
                type: "",
                date: "",
                description: "",
            }); // Initialiser un nouveau formulaire
        }
        setSelectedTimeline(timeline);
        setModalOpen(true);
    };

    // Fermer la modal principale
    const handleCloseModal = () => {
        setModalOpen(false);
        setSelectedTimeline(null);
    };

    // Ouvrir la modale IconSelector
    const handleOpenIconModal = () => {
        setIconModalOpen(true);
    };

    // Fermer la modale IconSelector
    const handleCloseIconModal = () => {
        setIconModalOpen(false);
    };

    // Gérer la sélection d'une icône
    const handleIconSelect = (iconName) => {
        setForm({...form, customIcone: iconName}); // Mettre à jour l'icône dans le formulaire
        handleCloseIconModal(); // Fermer la modal IconSelector
    };

    // Ajouter/modifier une timeline
    const handleSave = async () => {
        try {
            const url = selectedTimeline
                ? `http://localhost:8080/api/timelines/${form.id}` // Modification
                : "http://localhost:8080/api/timelines"; // Création

            const method = selectedTimeline ? "put" : "post";

            // Convertir en format "YYYY-MM-DD"
            const formattedForm = {
                ...form,
                date: form.date.includes("T") ? form.date.split("T")[0] : form.date, // Assure que seule la date est conservée
            };

            const response = await axios[method](url, formattedForm);
            const newTimeline = {
                ...response.data,
                date: dayjs(response.data.date).format("DD/MM/YYYY"), // Formater la date après sauvegarde
            };

            if (selectedTimeline) {
                // Mettre à jour localement la timeline modifiée
                setTimelines((prev) =>
                    prev.map((timeline) =>
                        timeline.id === form.id ? newTimeline : timeline
                    )
                );
            } else {
                // Ajouter un élément localement
                setTimelines((prev) => [...prev, newTimeline]);
            }

            handleCloseModal();
        } catch (err) {
            console.error("Erreur lors de la sauvegarde :", err);
            setError("Une erreur s'est produite pendant l'enregistrement.");
        }
    };

    // Rendre une icône à partir de son nom
    const renderIcon = (iconName) => {
        const IconComponent = Icons[iconName];
        return IconComponent ? React.createElement(IconComponent, {fontSize: "large"}) : null;
    };

    // Supprimer une timeline
    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:8080/api/timelines/${id}`);
            // Supprimer localement la timeline
            setTimelines((prev) => prev.filter((timeline) => timeline.id !== id));
        } catch (err) {
            console.error("Erreur pendant la suppression :", err);
            setError("Une erreur s'est produite.");
        }
    };

    // Colonnes avec actions pour modifier et supprimer
    const columns = [
        {field: "id", headerName: "ID", align: "center", headerAlign: "center"},
        {field: "titre", headerName: "Titre", flex: 1, align: "center", headerAlign: "center"},
        {field: "sousTitre", headerName: "Sous-titre", flex: 1, align: "center", headerAlign: "center"},
        {field: "type", headerName: "Type", flex: 0.8, align: "center", headerAlign: "center"},
        {field: "date", headerName: "Date", flex: 1, align: "center", headerAlign: "center"},
        {
            field: "description",
            headerName: "Description",
            flex: 2,
            renderCell: (params) => (
                <Box
                    sx={{
                        maxHeight: "7em", // Hauteur max (~5 lignes)
                        overflowY: "auto", // Barre de défilement verticale si contenu dépasse
                        wordWrap: "break-word", // Coupe les mots si nécessaire
                        lineHeight: "1.4em", // Hauteur de ligne (1.4em)
                        display: "-webkit-box", // Nécessaire pour line-clamp
                        WebkitLineClamp: 5, // Limite à 5 lignes
                        WebkitBoxOrient: "vertical", // Orientation pour clamp
                        textOverflow: "ellipsis",
                    }}
                >
                    {params.row.description}
                </Box>
            ),

            headerAlign: "center",
        },
        {
            field: "actions",
            headerName: "Actions",
            flex: 2, // Largeur fixe mais ajustable
            align: "center",
            headerAlign: "center",
            renderCell: (params) => (
                <Box
                    display="flex"
                    flexDirection="column" // Empile verticalement les boutons
                    justifyContent="center"
                    alignItems="center"
                    width="100%"
                >
                    <Button
                        variant="outlined"
                        color="primary"
                        size="small"
                        onClick={() => handleOpenModal(params.row)}
                        sx={{mt: 1, mb: 1}} // Ajoute un espace en haut et en bas du bouton
                    >
                        Modifier
                    </Button>
                    <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        onClick={() => handleDelete(params.row.id)}
                        sx={{mb: 1}}
                    >
                        Supprimer
                    </Button>
                </Box>
            ),
        }
    ];

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Gestion des Timelines
            </Typography>

            {/* Bouton pour ajouter une nouvelle timeline */}
            <Button
                variant="contained"
                color="primary"
                onClick={() => handleOpenModal()}
                sx={{mb: 2}}
            >
                Ajouter une timeline
            </Button>

            {loading ? (
                <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    height="60vh"
                >
                    <CircularProgress/>
                </Box>
            ) : error ? (
                <Alert severity="error">{error}</Alert>
            ) : (
                <Box sx={{height: "70vh", mt: 3}}>
                    <DataGrid
                        getRowHeight={() => 'auto'}
                        checkboxSelection
                        rowsPerPageOptions={[5, 10, 25, 50]}
                        disableSelectionOnClick={true} // Désactiver la sélection via clic sur la ligne
                        keepNonExistentRowsSelected
                        columnWidthBuffer={30}
                        rows={timelines}
                        columns={columns}


                        initialState={{
                            sorting: {
                                sortModel: [{field: 'date', sort: 'asc'}], // Trie par défaut sur la colonne "date" (ordre croissant)
                            },
                        }}
                        getRowId={(row) => row.id}
                        slots={{
                            toolbar: GridToolbar,
                        }}
                        slotProps={{
                            toolbar: {
                                showQuickFilter: true,
                            },
                        }}
                        sx={{
                            '& .MuiDataGrid-cell': {
                                display: 'flex',
                                alignItems: 'center', // Centre verticalement
                                justifyContent: 'center', // Centre horizontalement
                            },
                            '& .MuiDataGrid-columnHeaderTitle': {
                                display: 'flex',
                                alignItems: 'center', // Centre verticalement l'en-tête
                                justifyContent: 'center', // Centre horizontalement l'en-tête
                            },
                        }}

                    />
                </Box>
            )}

            {/* Modal pour créer/modifier une timeline */}
            <Modal open={modalOpen} onClose={handleCloseModal}>
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: 400,
                        bgcolor: "background.paper",
                        boxShadow: 24,
                        p: 4,
                        borderRadius: 2,
                    }}
                >
                    <Typography variant="h5" gutterBottom>
                        {selectedTimeline ? "Modifier Timeline" : "Créer une Timeline"}
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                label="Titre"
                                name="titre"
                                value={form.titre}
                                onChange={handleFormChange}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Sous-titre"
                                name="sousTitre"
                                value={form.sousTitre}
                                onChange={handleFormChange}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                select
                                label="Type"
                                name="type"
                                value={form.type}
                                onChange={handleFormChange}
                                fullWidth
                            >
                                {types.map((type) => (
                                    <MenuItem key={type} value={type}>
                                        {type}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Date"
                                name="date"
                                type="date"
                                value={form.date}
                                onChange={handleFormChange}
                                InputLabelProps={{shrink: true}}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Description"
                                name="description"
                                value={form.description}
                                onChange={handleFormChange}
                                fullWidth
                                multiline
                                rows={4}
                            />
                        </Grid>
                    </Grid>
                    <Grid>
                        {/*                        /!* Bouton pour ouvrir IconSelector *!/*/}
                        {/*<Button*/}
                        {/*    variant="outlined"*/}
                        {/*    sx={{ marginBottom: 2 }}*/}
                        {/*    onClick={handleOpenIconModal}*/}
                        {/*>*/}
                        {/*    {form.customIcone ? "Modifier l'icône" : "Ajouter une icône"}*/}
                        {/*</Button>*/}
                        {form.customIcone && (
                            <Box sx={{marginBottom: 2}}>
                                {renderIcon(form.customIcone)}
                            </Box>
                        )}
                    </Grid>
                    <Box mt={2} display="flex" justifyContent="flex-end">
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleSave}
                            sx={{mr: 2}}
                        >
                            Enregistrer
                        </Button>
                        <Button variant="outlined" onClick={handleCloseModal}>
                            Annuler
                        </Button>
                    </Box>
                </Box>
            </Modal>

            {/*/!* Modal IconSelector *!/*/}
            {/*<IconSelector*/}
            {/*    open={iconModalOpen}*/}
            {/*    onClose={handleCloseIconModal}*/}
            {/*    onIconSelect={handleIconSelect}*/}
            {/*/>*/}
        </Container>
    );
};

export default TimelinesPage;