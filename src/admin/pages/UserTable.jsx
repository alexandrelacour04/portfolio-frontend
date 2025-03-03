import React, { useEffect, useState } from "react";
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
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import AddIcon from "@mui/icons-material/Add";
import axios from "axios";

const UsersPage = () => {
    const [users, setUsers] = useState([]); // Liste des utilisateurs
    const [loading, setLoading] = useState(true); // État de chargement
    const [error, setError] = useState(null); // État d'erreur
    const [modalOpen, setModalOpen] = useState(false); // État pour la modal
    const [selectedUser, setSelectedUser] = useState(null); // Utilisateur sélectionné pour modification
    const [form, setForm] = useState({
        id: "",
        username: "",
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        role: "USER",
        active: true,
    }); // Formulaire de création/mise à jour

    // Charger les utilisateurs depuis l'API
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get("http://localhost:8080/api/users");
                setUsers(response.data); // Assurez-vous que l'API retourne un tableau
            } catch (e) {
                setError("Erreur lors de la récupération des données");
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    // Gestion des colonnes de la DataGrid (paramètres principaux des colonnes)
    const columns = [
        {field: "id", headerName: "ID", flex: 1, headerAlign: "center", align: "center"},
        {field: "username", headerName: "Username", flex: 1, headerAlign: "center", align: "center"},
        {field: "firstName", headerName: "Prénom", flex: 1, headerAlign: "center", align: "center"},
        {field: "lastName", headerName: "Nom", flex: 1, headerAlign: "center", align: "center"},
        {field: "email", headerName: "Email", flex: 1.5, headerAlign: "center", align: "center"},
        {field: "role", headerName: "Rôle", width: 120, headerAlign: "center", align: "center"},
        {
            field: "active",
            headerName: "Actif",
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
                <Box
                    display="flex"
                    flexDirection="column"
                    justifyContent="center"
                    alignItems="center"
                    width="100%"
                >
                    <Button
                        variant="outlined"
                        color="primary"
                        size="small"
                        onClick={() => handleOpenModal(params.row)}
                        sx={{mt: 1, mb: 1}}
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

    // Gestion des changements dans le formulaire
    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    // Ouvrir la modal pour ajouter/modifier un utilisateur
    const handleOpenModal = (user = null) => {
        if (user) {
            setForm(user);
        } else {
            setForm({
                id: "",
                username: "",
                firstName: "",
                lastName: "",
                email: "",
                password: "",
                role: "USER",
                active: true,
            });
        }
        setSelectedUser(user);
        setModalOpen(true);
    };

    // Fermer la modal
    const handleCloseModal = () => {
        setModalOpen(false);
        setSelectedUser(null);
    };

    // Ajouter ou modifier un utilisateur
    const handleSave = async () => {
        try {
            const url = selectedUser
                ? `http://localhost:8080/api/users/${form.id}` // Modification
                : "http://localhost:8080/api/users"; // Création

            const method = selectedUser ? "put" : "post";

            const response = await axios[method](url, form);

            if (selectedUser) {
                // Mettre à jour localement l'utilisateur existant
                setUsers((prev) =>
                    prev.map((user) => (user.id === form.id ? response.data : user))
                );
            } else {
                // Ajouter un nouvel utilisateur
                setUsers((prev) => [...prev, response.data]);
            }

            handleCloseModal();
        } catch (err) {
            console.error("Erreur lors de la sauvegarde :", err);
            setError("Une erreur s'est produite pendant l'enregistrement.");
        }
    };

    // Supprimer un utilisateur
    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:8080/api/users/${id}`);
            setUsers((prev) => prev.filter((user) => user.id !== id)); // Mise à jour locale après suppression
        } catch (e) {
            console.error("Erreur lors de la suppression :", e);
            setError("Une erreur s'est produite pendant la suppression.");
        }
    };

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Gestion des Utilisateurs
            </Typography>

            {error && <Alert severity="error">{error}</Alert>}

            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleOpenModal}
                >
                    Créer un Compte
                </Button>
            </Box>

            {loading ? (
                <CircularProgress />
            ) : (
                <Box sx={{ height: 600, width: "100%" }}>
                    <DataGrid
                        rows={users}
                        columns={columns}
                        pageSize={10}
                        rowsPerPageOptions={[5, 10, 25, 50]}
                        checkboxSelection
                        disableSelectionOnClick
                        getRowHeight={() => 'auto'}
                        keepNonExistentRowsSelected
                        columnWidthBuffer={30}
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

            <Modal open={modalOpen} onClose={handleCloseModal}>
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        bgcolor: "background.paper",
                        boxShadow: 24,
                        p: 4,
                        width: 400,
                    }}
                >
                    <Typography variant="h6" gutterBottom>
                        {selectedUser ? "Modifier l'Utilisateur" : "Ajouter un Utilisateur"}
                    </Typography>

                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Nom d'utilisateur"
                                name="username"
                                value={form.username}
                                onChange={handleFormChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Prénom"
                                name="firstName"
                                value={form.firstName}
                                onChange={handleFormChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Nom"
                                name="lastName"
                                value={form.lastName}
                                onChange={handleFormChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Email"
                                name="email"
                                value={form.email}
                                onChange={handleFormChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Mot de passe"
                                type="password"
                                name="password"
                                value={form.password}
                                onChange={handleFormChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Rôle"
                                name="role"
                                value={form.role}
                                onChange={handleFormChange}
                            />
                        </Grid>
                    </Grid>

                    <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
                        <Button onClick={handleCloseModal} color="secondary">
                            Annuler
                        </Button>
                        <Button onClick={handleSave} variant="contained" color="primary">
                            Enregistrer
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </Container>
    );
};

export default UsersPage;