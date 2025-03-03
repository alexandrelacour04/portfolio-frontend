import React, {useState} from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import ListItemIcon from '@mui/material/ListItemIcon';
import HomeIcon from '@mui/icons-material/Home';
import InfoIcon from '@mui/icons-material/Info';
import WorkIcon from '@mui/icons-material/Work';
import TimelineIcon from '@mui/icons-material/Timeline';
import ContactsIcon from '@mui/icons-material/Contacts';
import LoginModal from "./LoginModal.jsx";

function MyAppBar() {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [loginModalOpen, setLoginModalOpen] = useState(false); // Déclaration avec useState

    const toggleDrawer = (open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setDrawerOpen(open);
    };

    const handleAdminClick = () => {
        setLoginModalOpen(true);
    };

    const handleLoginSuccess = (user) => {
        console.log('Utilisateur connecté :', user);
        // Exemple : Vérification si l'utilisateur est admin
        if (user.role === 'ADMIN') {
            // Rediriger vers la page admin
            window.location.href = '/admin';
        } else {
            alert('Accès refusé. Vous n\'êtes pas autorisé.');
        }
    };

    const pages = [
        { name: 'Accueil', icon: <HomeIcon />, onClick: () => window.location.href = '/' },
        { name: 'Timeline', icon: <TimelineIcon />, onClick: () => window.location.href = '/timeline' },
        { name: 'À propos', icon: <InfoIcon />, onClick: () => window.location.href = '/a-propos' },
        { name: 'Projets', icon: <WorkIcon />, onClick: () => window.location.href = '/projets' },
        { name: 'Contact', icon: <ContactsIcon />, onClick: () => window.location.href = '/contact' },
        { name: 'Admin', icon: <ContactsIcon />, onClick: handleAdminClick },
    ];

    return (
        <>
            <AppBar position="static" sx={{ backgroundColor: '#1976d2' }}>
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{ mr: 2 }}
                        onClick={toggleDrawer(true)}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography
                        variant="h6"
                        component="div"
                        sx={{ flexGrow: 1, fontWeight: 'bold' }}
                    >
                        Mon Application
                    </Typography>
                    <Drawer
                        anchor="left"
                        open={drawerOpen}
                        onClose={toggleDrawer(false)}
                        PaperProps={{
                            sx: {
                                '&::-webkit-scrollbar': {display: 'none'},
                                msOverflowStyle: 'none', // For Internet Explorer and Edge
                                scrollbarWidth: 'none', // For Firefox
                            }
                        }}
                    >
                        <Box
                            sx={{
                                width: 250,
                                backgroundColor: (theme) => theme.palette.background.paper,
                                height: '100%',
                            }}
                            role="presentation"
                            onKeyDown={toggleDrawer(false)}
                        >
                            <Typography
                                variant="h6"
                                sx={{
                                    textAlign: 'center',
                                    padding: 2,
                                    fontWeight: 'bold',
                                    backgroundColor: (theme) => theme.palette.primary.main,
                                    color: '#ffffff',
                                }}
                            >
                                Navigation
                            </Typography>
                            <Divider />
                            <List>
                                {pages.map((page, index) => (
                                    <ListItem key={index} disablePadding>
                                        <ListItemButton onClick={page.onClick}>
                                            <ListItemIcon>{page.icon}</ListItemIcon>
                                            <ListItemText primary={page.name} />
                                        </ListItemButton>
                                    </ListItem>
                                ))}
                            </List>
                        </Box>
                    </Drawer>
                </Toolbar>
            </AppBar>

            {/* Modale de connexion */}
            <LoginModal
                open={loginModalOpen}
                onClose={() => setLoginModalOpen(false)}
                onSuccess={handleLoginSuccess}
            />
        </>
    );
}

export default MyAppBar;