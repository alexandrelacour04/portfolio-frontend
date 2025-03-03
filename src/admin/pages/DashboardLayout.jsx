import React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import { createTheme } from '@mui/material/styles';
import DashboardIcon from '@mui/icons-material/Dashboard';
import DatasetIcon from '@mui/icons-material/Dataset';
import SettingsIcon from '@mui/icons-material/Settings';
import PersonIcon from '@mui/icons-material/Person';
import TableChartIcon from '@mui/icons-material/TableChart';
import { AppProvider } from '@toolpad/core/AppProvider';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { useDemoRouter } from '@toolpad/core/internal';
import Exit from "./Exit.jsx";
import DashBoardPage from "./DashBoardPage.jsx";
import TimelineTable from "./TimelineTable.jsx";
import UserProfile from "./UserProfile.jsx";
import UserTable from "./UserTable.jsx";
import IconSelector from "../component/IconSelector.jsx";
import ProjectTable from "./ProjectTable.jsx";

const NAVIGATION = [
    {
        kind: 'header',
        title: 'Général',
    },
    {
        segment: 'dashboard',
        title: 'Tableau de Bord',
        icon: <DashboardIcon />,
    },
    {
        segment: 'tables',
        title: 'Gestion des tables',
        icon: <TableChartIcon/>,
        type: 'header',
        children: [
            {
                segment: 'timeline',
                title: 'Timeline',
                icon: <DatasetIcon />,
            },
            {
                segment: 'project',
                title: 'Project',
                icon: <DatasetIcon />,
            },
            {
                segment: 'projet',
                title: 'Utilisateur',
                icon: <DatasetIcon />,
            },
        ],
    },
    {
        kind: 'divider',
    },
    {
        kind: 'header',
        title: 'Paramètres',
    },
    {
        segment: 'profil',
        title: 'Profil',
        icon: <PersonIcon />,
    },
    {
        segment: 'parametre',
        title: 'Paramètre',
        icon: <SettingsIcon />,
    },
    {
        type: 'button',
        segment: 'quit',
        title: 'Déconnexion',
        icon: <ExitToAppIcon />,
    },
];

const routes = {
    //Route classique
    '/dashboard': DashBoardPage,
    '/profil': UserProfile,
    '/quit' : Exit,
    // '/parametre': IconSelector,
    


    //route du segment table
    '/tables/user': UserTable,
    '/tables/timeline': TimelineTable,
    '/tables/project': ProjectTable,
    // '/tables/message': MessagePage, // Autre exemple
};


const persoTheme = createTheme({
    colorSchemes: { light: true },
    breakpoints: {
        values: {
            xs: 0,
            sm: 600,
            md: 600,
            lg: 1200,
            xl: 1536,
        },
    },
});

// Dummy page content
function DemoPageContent({ pathname }) {
    const PageComponent = routes[pathname] || (() => <div>Page non trouvée pour : {pathname} </div>);


    return (
        <Box
            sx={{
                py: 4,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
            }}
        >
            <PageComponent />
        </Box>
    );
}


DemoPageContent.propTypes = {
    pathname: PropTypes.string.isRequired,
};

const DashboardLayoutBasic = (props) => {
    const { window } = props;
    const router = useDemoRouter('/dashboard'); // Hook de navigation du dashboard
    const demoWindow = window?.();

    return (
        <AppProvider
            navigation={NAVIGATION}
            router={router}
            theme={persoTheme}
            window={demoWindow}
            branding={{
                logo: <></>,
                title: 'PANNEL ADMIN',
            }}
        >
            <DashboardLayout>
                <DemoPageContent pathname={router.pathname} />
            </DashboardLayout>
        </AppProvider>
    );
};


DashboardLayoutBasic.propTypes = {
    window: PropTypes.func,
};

export default DashboardLayoutBasic;
