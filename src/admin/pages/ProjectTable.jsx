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
    FormControlLabel, Card, CardContent, CardActions,
} from "@mui/material";
import {DataGrid, GridToolbar} from "@mui/x-data-grid";
import axios from "axios";
import AddIcon from "@mui/icons-material/Add";

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
                const response = await axios.get("http://localhost:8080/api/projects");
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

    // Fermer la modal de vue
    const handleCloseViewModal = () => {
        setViewModalOpen(false);
        setSelectedProject(null);
    };

    // Ajouter ou modifier un projet
    const handleSave = async () => {
        try {
            const formattedForm = {...form};

            if (selectedProject) {
                // Requête PUT pour mettre à jour un projet existant
                await axios.put(`http://localhost:8080/api/projects/${formattedForm.id}`, formattedForm);
            } else {
                // Requête POST pour ajouter un nouveau projet
                await axios.post("http://localhost:8080/api/projects", formattedForm);
            }

            setModalOpen(false);
            fetchProjects(); // Rechargez les projets après une mise à jour
        } catch (error) {
            setError("Erreur lors de l'enregistrement du projet");
        }
    };

    // Supprimer un projet
    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:8080/api/projects/${id}`);
            setProjects((prev) => prev.filter((project) => project.id !== id));
        } catch (e) {
            setError("Erreur lors de la suppression du projet");
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
                        checkboxSelection
                        rowsPerPageOptions={[5, 10, 25, 50]}
                        disableSelectionOnClick={true}
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
                            <TextField
                                name="technologies"
                                label="Technologies"
                                value={form.technologies}
                                onChange={handleFormChange}
                                fullWidth
                                variant="outlined"
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