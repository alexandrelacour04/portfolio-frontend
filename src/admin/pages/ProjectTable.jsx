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
    Switch,
    FormControlLabel, Card, CardContent, CardActions, Chip,
} from "@mui/material";
import {DataGrid, GridToolbar} from "@mui/x-data-grid";
import axios from "axios";
import AddIcon from "@mui/icons-material/Add";
import {Autocomplete} from "@mui/lab";
import PropTypes from "prop-types";


const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const ProjectsPage = () => {
    const [projects, setProjects] = useState([]); // Liste des projets
    const [loading, setLoading] = useState(true); // État de chargement
    const [error, setError] = useState(null); // État d'erreur
    const [modalOpen, setModalOpen] = useState(false); // État pour la modal
    const [viewModalOpen, setViewModalOpen] = useState(false); // État pour la modal de vue
    const [selectedProject, setSelectedProject] = useState(null); // Projet sélectionné pour modification
    const [form, setForm] = useState({
        id: null,
        title: "",
        subtitle: "",
        description: "",
        technologies: "",
        status: "",
        type: "",
        startDate: "",
        endDate: "",
        coverImage: "",
        liveUrl: "",
        repositoryUrl: "",
        isPublic: true,
        client: "",
        tags: "",
    }); // Formulaire de création/mise à jour

    const statuses = ["En cours", "Terminé", "Archivé"]; // Liste des statuts possibles
    const types = ["Personnel", "Professionnel", "Open Source", "Autre"]; // Liste des types



    // Chargement des projets
    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/api/projects`);
                setProjects(response.data.content); // Adapter selon le retour de l'API
            } catch (e) {
                setError("Erreur lors de la récupération des données");
            } finally {
                setLoading(false);
            }
        };
        fetchProjects();
    }, []);

    // Gestion des colonnes de la DataGrid
    const columns = [
        {field: "id", headerName: "ID", flex: 1, headerAlign: "center", align: "center"},
        {field: "title", headerName: "Titre", flex: 1, headerAlign: "center", align: "center"},
        {field: "subtitle", headerName: "Sous-titre", flex: 1, headerAlign: "center", align: "center"},
        {field: "status", headerName: "Statut", flex: 1, headerAlign: "center", align: "center"},
        {field: "type", headerName: "Type", flex: 1, headerAlign: "center", align: "center"},
        {
            field: "isPublic",
            headerName: "Public",
            width: 120,
            headerAlign: "center",
            align: "center",
            renderCell: (params) => (
                <Typography color={params.value ? "green" : "red"} textAlign="center" width="100%">
                    {params.value ? "Oui" : "Non"}
                </Typography>
            ),
        },
        {
            field: "actions",
            headerName: "Actions",
            flex: 2,
            headerAlign: "center",
            align: "center",
            renderCell: (params) => (
                <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
                    <Button
                        variant="outlined"
                        color="primary"
                        size="small"
                        onClick={() => handleOpenModal(params.row)}
                    >
                        Modifier
                    </Button>
                    <Button
                        variant="outlined"
                        color="info"
                        size="small"
                        onClick={() => handleViewProject(params.row)}
                    >
                        Voir
                    </Button>
                    <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        onClick={() => handleDelete(params.row.id)}
                    >
                        Supprimer
                    </Button>
                </Box>
            ),
        },
    ];

    // Gestion des changements dans le formulaire
    const handleFormChange = (e) => {
        const {name, value, type, checked} = e.target;
        setForm({...form, [name]: type === "checkbox" ? checked : value});
    };

    // Ouvrir la modal principale avec un projet (ou un projet vide pour un ajout)
    const handleOpenModal = (project = null) => {
        if (project) {
            setForm({...project});
        } else {
            setForm({
                id: null,
                title: "",
                subtitle: "",
                description: "",
                technologies: "",
                status: "",
                type: "",
                startDate: "",
                endDate: "",
                coverImage: "",
                otherImages: "",
                liveUrl: "",
                repositoryUrl: "",
                isPublic: true,
                client: "",
                tags: "",
            });
        }
        setSelectedProject(project);
        setModalOpen(true);
    };

    // Ouvrir la modale pour voir un projet
    const handleViewProject = (project) => {
        setSelectedProject(project);
        setViewModalOpen(true);
    };

    // Fermer la modal principale
    const handleCloseModal = () => {
        setModalOpen(false);
        setSelectedProject(null);
    };

    const OtherImagesInput = ({ value, onChange }) => {
        const [inputValue, setInputValue] = useState(""); // Pour la gestion de la saisie
        const [images, setImages] = useState([]); // Liste des URLs (valeurs locales)

        // Synchronisation avec les nouvelles valeurs de la prop `value`
        useEffect(() => {
            if (value) {
                setImages(value.split("|").map((img) => img.trim())); // Met à jour `images` si `value` change
            }
        }, [value]);

        const handleChange = (event, newValue) => {
            // Met à jour l'état local avec les URLs sélectionnées
            setImages(newValue);

            // Transmet au parent la liste sous forme de chaîne séparée par des virgules
            if (onChange) {
                onChange(newValue.join(","));
            }
        };

        return (
            <Autocomplete
                multiple
                freeSolo
                options={[]} // Pas d'options fixes pour les images (modifiable si besoin)
                value={images} // Liste des URLs sélectionnées
                onChange={handleChange} // Gestion de la mise à jour des URLs
                inputValue={inputValue} // Saisie en cours
                onInputChange={(event, newInputValue) => {
                    setInputValue(newInputValue); // Met à jour la valeur de saisie
                }}
                renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                        <Chip
                            key={index}
                            variant="outlined"
                            label={option} // Affiche l'URL de l'image comme texte sur le Chip
                            {...getTagProps({ index })}
                        />
                    ))
                }
                renderInput={(params) => (
                    <TextField
                        {...params}
                        variant="outlined"
                        label="Autres images"
                        placeholder="Ajoutez des URLs d'images"
                    />
                )}
            />
        );
    };

    OtherImagesInput.propTypes = {
        value: PropTypes.string, // Liste d'images sous forme de chaîne (ex: "url1,url2,url3")
        onChange: PropTypes.func.isRequired, // Fonction appelée lors d'une mise à jour
    };


    // Fermer la modal de vue
    const handleCloseViewModal = () => {
        setViewModalOpen(false);
        setSelectedProject(null);
    };

    const TechnologiesInput = ({ value, onChange }) => {
        const [inputValue, setInputValue] = useState(""); // Pour la gestion de la saisie
        const [technologies, setTechnologies] = useState(
            value ? value.split(",").map((tech) => tech.trim()) : [] // Initialisation à partir de la chaîne séparée par des virgules
        );

        // Options fixes proposées (modifiable selon le contexte du projet)
        const fixedOptions = ["React", "JavaScript", "Node.js", "Python", "Java", "Docker", "Kubernetes"];

        const handleChange = (event, newValue) => {
            // Met à jour l'état local avec les technologies sélectionnées
            setTechnologies(newValue);

            // Transmet au parent la liste des technologies sous forme de chaîne séparée par des virgules
            if (onChange) {
                onChange(newValue.join(","));
            }
        };

        return (
            <Autocomplete
                multiple
                freeSolo
                options={fixedOptions} // Options fixes proposées
                value={technologies} // Liste des technologies sélectionnées
                onChange={handleChange} // Gestion de la mise à jour des technologies
                inputValue={inputValue} // Saisie en cours
                onInputChange={(event, newInputValue) => {
                    setInputValue(newInputValue); // Met à jour la valeur de saisie
                }}
                renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                        <Chip
                            key={index}
                            variant="outlined"
                            label={option}
                            {...getTagProps({ index })}
                        />
                    ))
                }
                renderInput={(params) => (
                    <TextField
                        {...params}
                        variant="outlined"
                        label="Technologies"
                        placeholder="Ajoutez des technologies"
                    />
                )}
            />
        );
    };

    TechnologiesInput.propTypes = {
        value: PropTypes.string, // Chaîne séparée par des virgules (ex : "React,Java")
        onChange: PropTypes.func.isRequired, // Fonction de callback appelée lorsqu'une mise à jour est effectuée
    };

    // Chargement des projets (refactor pour une meilleure réutilisation)
    const fetchProjects = async () => {
        try {
            setLoading(true); // Commence le chargement
            const response = await axios.get(`${API_BASE_URL}/api/projects`);
            setProjects(response.data.content); // Stocke les projets dans l'état
            setError(null); // Réinitialise les erreurs s'il n'y a pas eu de problème
        } catch (error) {
            console.error("Erreur lors de la récupération des données :", error);
            setError("Erreur lors de la récupération des données");
        } finally {
            setLoading(false); // Fin du chargement
        }
    };

    // Ajouter ou modifier un projet
    const handleSave = async () => {
        try {
            const formattedForm = {...form};

            if (selectedProject) {
                // Requête PUT pour mettre à jour un projet existant
                await axios.put(`${API_BASE_URL}/api/projects/${formattedForm.id}`, formattedForm);
            } else {
                // Requête POST pour ajouter un nouveau projet
                await axios.post(`${API_BASE_URL}/api/projects`, formattedForm);
            }

            setModalOpen(false);
            fetchProjects(); // Rechargez les projets après une mise à jour
        } catch (error) {
            setError("Erreur lors de l'enregistrement du projet");
            console.log(error);
        }
    };

    // Supprimer un projet
    const handleDelete = async (id) => {
        try {
            await axios.delete(`${API_BASE_URL}/api/projects/${id}`);
            setProjects((prev) => prev.filter((project) => project.id !== id));
        } catch (e) {
            setError("Erreur lors de la suppression du projet");
            console.log(e);
        }
    };

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Gestion des Projets
            </Typography>

            {loading ? (
                <CircularProgress/>
            ) : error ? (
                <Alert severity="error">{error}</Alert>
            ) : (
                <Box>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon/>}
                        onClick={() => handleOpenModal()}
                        sx={{mb: 2}}
                    >
                        Ajouter un projet
                    </Button>

                    <DataGrid
                        getRowHeight={() => 'auto'}
                        rowsPerPageOptions={[5, 10, 25, 50]}
                        checkboxSelection={false} // Désactivation des cases à cocher pour la sélection
                        disableSelectionOnClick={true} // Empêche la sélection des lignes au clic
                        keepNonExistentRowsSelected
                        columnWidthBuffer={30}
                        rows={projects}
                        columns={columns}
                        getRowId={(row) => row.id}
                        initialState={{
                            sorting: {
                                sortModel: [{field: 'date', sort: 'asc'}],
                            },
                        }}
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
                                alignItems: 'center',
                                justifyContent: 'center',
                            },
                            '& .MuiDataGrid-columnHeaderTitle': {
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            },
                        }}
                    />
                </Box>
            )}

            {/* Modal formulaire */}
            <Modal open={modalOpen} onClose={handleCloseModal}>
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: "90%",
                        maxWidth: 600,
                        maxHeight: "90vh",
                        bgcolor: "background.paper",
                        borderRadius: 2,
                        p: 4,
                        boxShadow: 24,
                        overflowY: "auto",
                    }}
                >
                    <Typography variant="h6" gutterBottom textAlign="center">
                        {selectedProject ? "Modifier le projet" : "Ajouter un projet"}
                    </Typography>

                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                name="title"
                                label="Titre"
                                value={form.title}
                                onChange={handleFormChange}
                                fullWidth
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                name="subtitle"
                                label="Sous-titre"
                                value={form.subtitle}
                                onChange={handleFormChange}
                                fullWidth
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                name="description"
                                label="Description"
                                value={form.description}
                                onChange={handleFormChange}
                                fullWidth
                                multiline
                                rows={3}
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TechnologiesInput
                                value={form.technologies} // Passer la chaîne existante des technologies
                                onChange={(newValue) =>
                                    setForm((prevForm) => ({
                                        ...prevForm,
                                        technologies: newValue, // Mettre à jour les technologies dans le formulaire
                                    }))
                                }
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                name="status"
                                label="Statut"
                                select
                                value={form.status}
                                onChange={handleFormChange}
                                fullWidth
                                variant="outlined"
                            >
                                {statuses.map((status) => (
                                    <MenuItem key={status} value={status}>
                                        {status}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                name="type"
                                label="Type"
                                select
                                value={form.type}
                                onChange={handleFormChange}
                                fullWidth
                                variant="outlined"
                            >
                                {types.map((type) => (
                                    <MenuItem key={type} value={type}>
                                        {type}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                name="startDate"
                                label="Date de début"
                                type="date"
                                value={form.startDate}
                                onChange={handleFormChange}
                                fullWidth
                                variant="outlined"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                name="endDate"
                                label="Date de fin"
                                type="date"
                                value={form.endDate}
                                onChange={handleFormChange}
                                fullWidth
                                variant="outlined"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                name="coverImage"
                                label="Image de couverture"
                                value={form.coverImage}
                                onChange={handleFormChange}
                                fullWidth
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <OtherImagesInput
                                value={form.otherImages} // Passer les URLs existantes (se référant au projet)
                                onChange={(newValue) =>
                                    setForm((prevForm) => ({
                                        ...prevForm,
                                        otherImages: newValue, // Mettre à jour les autres images dans le formulaire
                                    }))
                                }
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                name="liveUrl"
                                label="URL de mise en ligne"
                                value={form.liveUrl}
                                onChange={handleFormChange}
                                fullWidth
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                name="repositoryUrl"
                                label="URL du dépôt"
                                value={form.repositoryUrl}
                                onChange={handleFormChange}
                                fullWidth
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        name="isPublic"
                                        checked={form.isPublic}
                                        onChange={handleFormChange}
                                    />
                                }
                                label="Public"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                name="client"
                                label="Client"
                                value={form.client}
                                onChange={handleFormChange}
                                fullWidth
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                name="tags"
                                label="Tags"
                                value={form.tags}
                                onChange={handleFormChange}
                                fullWidth
                                multiline
                                variant="outlined"
                            />
                        </Grid>
                    </Grid>

                    <Button
                        onClick={handleSave}
                        variant="contained"
                        sx={{mt: 3, display: "block", width: "100%"}}
                    >
                        Enregistrer
                    </Button>
                </Box>
            </Modal>

            {/* Modal voir les infos */}
            <Modal open={viewModalOpen} onClose={handleCloseViewModal}>
                <Card
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: "90%",
                        maxWidth: 700,
                        maxHeight: "90vh",
                        bgcolor: "background.default",
                        borderRadius: 4,
                        p: 4,
                        boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.25)",
                        overflowY: "auto",
                    }}
                >
                    {selectedProject && (
                        <>
                            <CardContent>
                                <Typography
                                    variant="h4"
                                    color="primary"
                                    gutterBottom
                                    textAlign="center"
                                    sx={{mb: 3, fontWeight: "bold"}}
                                >
                                    🛠️ Détails du Projet
                                </Typography>

                                <Box
                                    component="div"
                                    sx={{
                                        border: "1px solid #e0e0e0",
                                        borderRadius: 2,
                                        p: 2,
                                        boxShadow: "inset 0px 0px 10px rgba(0, 0, 0, 0.1)",
                                        backgroundColor: "white",
                                    }}
                                >
                                    <Typography variant="subtitle1" sx={{mb: 1}}>
                                        <strong>Titre:</strong> {selectedProject.title}
                                    </Typography>
                                    <Typography variant="subtitle2" sx={{mb: 1, fontStyle: "italic"}}>
                                        <strong>Sous-titre:</strong> {selectedProject.subtitle}
                                    </Typography>
                                    <Typography variant="body1" sx={{mb: 2}}>
                                        <strong>Description:</strong> {selectedProject.description}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            mb: 1,
                                            p: 1,
                                            backgroundColor: "#f5f5f5",
                                            borderRadius: 1,
                                            fontWeight: "bold",
                                        }}
                                    >
                                        <strong>Technologies:</strong> {selectedProject.technologies}
                                    </Typography>
                                    <Typography variant="body2" sx={{mb: 1}}>
                                        <strong>Statut:</strong>{" "}
                                        <Box
                                            component="span"
                                            sx={{
                                                px: 1.5,
                                                py: 0.5,
                                                borderRadius: 2,
                                                backgroundColor:
                                                    selectedProject.status === "En cours"
                                                        ? "#ffeb3b"
                                                        : selectedProject.status === "Terminé"
                                                            ? "#4caf50"
                                                            : "#f44336",
                                                color: "white",
                                                fontWeight: "bold",
                                            }}
                                        >
                                            {selectedProject.status}
                                        </Box>
                                    </Typography>
                                    <Typography variant="body2" sx={{mb: 1}}>
                                        <strong>Type:</strong> {selectedProject.type}
                                    </Typography>
                                    <Typography variant="body2" sx={{mb: 1}}>
                                        <strong>Date de début:</strong> {selectedProject.startDate}
                                    </Typography>
                                    <Typography variant="body2" sx={{mb: 1}}>
                                        <strong>Date de fin:</strong> {selectedProject.endDate}
                                    </Typography>
                                    <Typography variant="body2" sx={{mb: 1}}>
                                        <strong>Client:</strong> {selectedProject.client}
                                    </Typography>
                                    <Typography variant="body2" sx={{mb: 1}}>
                                        <strong>Tags:</strong>{" "}
                                        <Box
                                            component="span"
                                            sx={{
                                                p: 1,
                                                border: "1px solid #90caf9",
                                                borderRadius: 1,
                                                color: "#1976d2",
                                                fontWeight: "bold",
                                            }}
                                        >
                                            {selectedProject.tags}
                                        </Box>
                                    </Typography>
                                    <Typography variant="body2" sx={{mb: 1}}>
                                        <strong>URL du dépôt:</strong>{" "}
                                        <a
                                            href={selectedProject.repositoryUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            style={{color: "#1976d2", textDecoration: "none"}}
                                        >
                                            {selectedProject.repositoryUrl}
                                        </a>
                                    </Typography>
                                    <Typography variant="body2" sx={{mb: 1}}>
                                        <strong>URL de mise en ligne:</strong>{" "}
                                        <a
                                            href={selectedProject.liveUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            style={{color: "#1976d2", textDecoration: "none"}}
                                        >
                                            {selectedProject.liveUrl}
                                        </a>
                                    </Typography>
                                    <Typography variant="body2">
                                        <strong>Public:</strong>{" "}
                                        <Box
                                            component="span"
                                            sx={{
                                                px: 1.5,
                                                py: 0.5,
                                                borderRadius: 2,
                                                backgroundColor: selectedProject.isPublic
                                                    ? "#4caf50"
                                                    : "#f44336",
                                                color: "white",
                                                fontWeight: "bold",
                                            }}
                                        >
                                            {selectedProject.isPublic ? "Oui" : "Non"}
                                        </Box>
                                    </Typography>
                                </Box>
                            </CardContent>
                            <CardActions
                                sx={{
                                    justifyContent: "center",
                                    mt: 3,
                                    gap: 2,
                                    paddingTop: 2,
                                    borderTop: "1px solid #e0e0e0",
                                }}
                            >
                                <Button
                                    onClick={handleCloseViewModal}
                                    variant="contained"
                                    color="success"
                                    size="large"
                                    sx={{
                                        textTransform: "none",
                                        paddingX: 5,
                                    }}
                                >
                                    Fermer
                                </Button>
                            </CardActions>
                        </>
                    )}
                </Card>
            </Modal>
        </Container>
    );
};

export default ProjectsPage;