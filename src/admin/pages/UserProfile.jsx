import React from 'react';
import {useUser} from './../../utils/UserContext';
import {
    Avatar,
    Badge,
    Button,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    Chip,
    Container,
    Divider,
    Grid,
    Stack,
    Tooltip,
    Typography
} from '@mui/material';
import {useNavigate} from "react-router-dom";

/**
 * Génère une couleur hexadécimale à partir du prénom et du nom de l'utilisateur.
 * @param {string} firstName - Prénom de l'utilisateur.
 * @param {string} lastName - Nom de l'utilisateur.
 * @returns {string} - Couleur hexadécimale (#RRGGBB).
 */
const generateColorFromName = (firstName, lastName) => {
    const fullName = (firstName + lastName).toUpperCase(); // Concatène le prénom et le nom
    let hash = 0;

    // Calcule un hash à partir des caractères du nom complet
    for (let i = 0; i < fullName.length; i++) {
        hash = fullName.charCodeAt(i) + ((hash << 5) - hash);
    }

    // Convertit le hash en une couleur hexadécimale
    let color = "#";
    for (let i = 0; i < 3; i++) {
        const value = (hash >> (i * 8)) & 0xFF; // Extraire trois octets
        color += (`00${value.toString(16)}`).substr(-2); // Convertir en hex
    }

    return color;
};


const UserProfile = () => {
    const {user} = useUser(); // Accès aux données utilisateur via le contexte
    const navigate = useNavigate(); // Moved useNavigate to the top so it's not called inside a callback.

    if (!user) {
        return (
            <Container maxWidth="sm" sx={{mt: 6}}>
                <Card
                    sx={{
                        textAlign: 'center',
                        borderRadius: 3,
                        backgroundColor: (theme) => theme.palette.background.default,
                        boxShadow: 3,
                    }}
                >
                    <CardContent sx={{p: 4}}>
                        <Typography variant="h6" color="error" sx={{fontWeight: 'bold'}}>
                            Aucun utilisateur connecté.
                        </Typography>
                    </CardContent>
                </Card>
            </Container>
        );
    }

    // Générer la couleur unique basée sur le prénom et le nom si aucune image n'est trouvée
    const avatarBackgroundColor = user.imagePath
        ? 'transparent'
        : generateColorFromName(user.firstName, user.lastName);

    return (
        <Container maxWidth="md" sx={{mt: 6}}>
            <Card
                sx={{
                    borderRadius: 4,
                    backgroundColor: (theme) => theme.palette.background.paper,
                    boxShadow: 5,
                }}
            >
                <CardHeader
                    avatar={
                        <Badge
                            overlap="circular"
                            badgeContent={
                                <Chip
                                    label={user.active ? 'Actif' : 'Inactif'}
                                    color={user.active ? 'success' : 'error'}
                                    size="small"
                                    sx={{fontWeight: 'bold'}}
                                />
                            }
                            anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}
                        >
                            <Avatar
                                src={user.imagePath || null} // Affiche l'image si elle existe
                                alt={`${user.firstName} ${user.lastName}`}
                                sx={{
                                    width: 100,
                                    height: 100,
                                    bgcolor: avatarBackgroundColor, // Couleur générée dynamiquement
                                    fontSize: 40,
                                    fontWeight: 'bold',
                                }}
                            >
                                {/* Initiales si aucune image */}
                                {(!user.imagePath && `${user.firstName[0]}${user.lastName[0]}`) || ''}
                            </Avatar>
                        </Badge>
                    }
                    title={
                        <Typography variant="h5" sx={{fontWeight: 'bold', color: 'text.primary'}}>
                            {user.firstName} {user.lastName}
                        </Typography>
                    }
                    subheader={
                        <Typography variant="subtitle1" sx={{color: 'text.secondary'}}>
                            {user.role === 'ADMIN' ? 'ADMINISTRATEUR' : 'Utilisateur standard'}
                        </Typography>
                    }
                />
                <CardContent sx={{px: 5, pb: 5}}>
                    <Divider sx={{my: 2}}/>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="body2" fontWeight="bold" color="text.secondary">
                                Email :
                            </Typography>
                            <Typography variant="body1">{user.email}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="body2" fontWeight="bold" color="text.secondary">
                                Nom d&#39;utilisateur :
                            </Typography>
                            <Typography variant="body1">{user.username}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="body2" fontWeight="bold" color="text.secondary">
                                Rôle :
                            </Typography>
                            <Typography variant="body1">{user.role}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="body2" fontWeight="bold" color="text.secondary">
                                Profil Statut :
                            </Typography>
                            <Chip
                                label={user.active ? 'Actif' : 'Inactif'}
                                color={user.active ? 'success' : 'error'}
                                size="small"
                                sx={{fontWeight: 'bold'}}
                            />
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </Container>
    );
};

export default UserProfile;