import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
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
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import LoginModal from './LoginModal.jsx';
import { ThemeContext } from '../theme/ThemeProvider';

function MyAppBar() {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [loginModalOpen, setLoginModalOpen] = useState(false);
    const { mode, toggleThemeMode } = useContext(ThemeContext);
    const navigate = useNavigate();

    console.log('MyAppBar rendu avec mode =', mode);

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
        if (user.role !== 'USER') {
            navigate('/admin');
        } else {
            alert('Accès refusé. Vous n’êtes pas autorisé.');
        }
    };

    const pages = [
        { name: 'Accueil', icon: <HomeIcon />, onClick: () => navigate('/') },
        { name: 'Timeline', icon: <TimelineIcon />, onClick: () => navigate('/timeline') },
        { name: 'À propos', icon: <InfoIcon />, onClick: () => navigate('/a-propos') },
        { name: 'Projets', icon: <WorkIcon />, onClick: () => navigate('/projets') },
        { name: 'Contact', icon: <ContactsIcon />, onClick: () => navigate('/contact') },
        { name: 'Admin', icon: <AdminPanelSettingsIcon />, onClick: handleAdminClick },
    ];

    return (
        <>
            <AppBar
                position="sticky"
                sx={{
                    bgcolor: 'primary.main', // Utilise la palette du thème
                    margin: 0,
                    padding: 0,
                    top: 0,
                    left: 0,
                    width: '100%',
                    boxShadow: 'none',
                }}
            >
                <Toolbar sx={{ padding: 0, minHeight: '64px' }}>
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
                        sx={{ flexGrow: 1, fontWeight: 'bold', color: 'text.primary' }}
                    >
                        Alexandre LACOUR
                    </Typography>

                    <IconButton
                        edge="end"
                        color="inherit"
                        onClick={() => {
                            console.log('Bouton thème cliqué');
                            toggleThemeMode();
                        }}
                        aria-label="toggle theme"
                        title={mode === 'light' ? 'Passer au mode sombre' : 'Passer au mode clair'}
                    >
                        {mode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
                    </IconButton>

                    <Drawer
                        anchor="left"
                        open={drawerOpen}
                        onClose={toggleDrawer(false)}
                        slotProps={{
                            paper: {
                                sx: {
                                    '&::-webkit-scrollbar': { display: 'none' },
                                    msOverflowStyle: 'none',
                                    scrollbarWidth: 'none',
                                },
                            },
                        }}
                    >
                        <Box
                            component="nav"
                            sx={{
                                width: 250,
                                bgcolor: 'background.paper', // Utilise le thème
                                height: '100%',
                                color: 'text.primary', // Utilise le thème
                            }}
                            aria-label="Navigation menu"
                            onKeyDown={toggleDrawer(false)}
                        >
                            <Typography
                                variant="h6"
                                sx={{
                                    textAlign: 'center',
                                    padding: 2,
                                    fontWeight: 'bold',
                                    bgcolor: 'primary.main', // Utilise le thème
                                    color: 'text.contrastText', // Contraste pour le texte
                                }}
                            >
                                Navigation
                            </Typography>
                            <Divider />
                            <List>
                                {pages.map((page, index) => (
                                    <ListItem key={index} disablePadding>
                                        <ListItemButton onClick={page.onClick}>
                                            <ListItemIcon sx={{ color: 'text.primary' }}>
                                                {page.icon}
                                            </ListItemIcon>
                                            <ListItemText primary={page.name} />
                                        </ListItemButton>
                                    </ListItem>
                                ))}
                            </List>
                        </Box>
                    </Drawer>
                </Toolbar>
            </AppBar>

            <LoginModal
                open={loginModalOpen}
                onClose={() => setLoginModalOpen(false)}
                onSuccess={handleLoginSuccess}
            />
        </>
    );
}

export default MyAppBar;