import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Box, Modal, Typography, TextField, Button, Alert } from '@mui/material';
import axios from 'axios';
import { useUser } from './../utils/UserContext'; // Import du contexte utilisateur

const LoginModal = ({ open, onClose, onSuccess }) => {
    const { saveUser } = useUser(); // Utiliser la fonction pour sauvegarder les informations utilisateur
    const [credentials, setCredentials] = useState({ identifier: '', password: '' });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setCredentials({ ...credentials, [name]: value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            // Appeler l'API pour récupérer les utilisateurs
            const response = await axios.get('http://localhost:8080/api/users');
            const users = response.data;

            // Trouver un utilisateur correspondant à l'identifiant et au mot de passe
            const matchedUser = users.find(
                (user) =>
                    (user.username === credentials.identifier || user.email === credentials.identifier) &&
                    user.password === credentials.password
            );

            if (matchedUser) {
                saveUser(matchedUser); // Enregistrer les informations utilisateur (sans l'ID)
                onSuccess(matchedUser); // Informer l'application que la connexion a réussi
                onClose(); // Fermer la modale
            } else {
                setError('Identifiant ou mot de passe incorrect.');
            }
        } catch (err) {
            console.error(err);
            setError("Erreur lors de la communication avec le serveur.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 400,
                    bgcolor: 'background.paper',
                    borderRadius: 2,
                    boxShadow: 24,
                    p: 4,
                }}
            >
                <Typography variant="h6" component="h2" sx={{ mb: 2, textAlign: 'center' }}>
                    Connexion
                </Typography>
                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Email ou Nom d'utilisateur"
                        name="identifier"
                        value={credentials.identifier}
                        onChange={handleInputChange}
                        fullWidth
                        required
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        label="Mot de passe"
                        name="password"
                        type="password"
                        value={credentials.password}
                        onChange={handleInputChange}
                        fullWidth
                        required
                        sx={{ mb: 2 }}
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        disabled={isLoading}
                    >
                        {isLoading ? 'Connexion...' : 'Se connecter'}
                    </Button>
                </form>
            </Box>
        </Modal>
    );
};

LoginModal.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSuccess: PropTypes.func.isRequired,
};

export default LoginModal;