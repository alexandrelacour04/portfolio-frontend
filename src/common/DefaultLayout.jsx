import React from 'react';
import {Box} from '@mui/material';

const DefaultLayout = ({children}) => {
    return (
        <Box
            sx={{
                minHeight: '100vh',
                width: '100vw',
                backgroundColor: (theme) => theme.palette.background.default, // Utilise le thème
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'space-between',
            }}
        >
            {children}
        </Box>
    );
};

export default DefaultLayout;