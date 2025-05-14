import React from 'react';
import ReactDOM from 'react-dom/client';
import {BrowserRouter as Router, Navigate, Route, Routes} from 'react-router-dom';
import {UserProvider} from './utils/UserContext.jsx';
import {CssBaseline, ThemeProvider, createTheme} from "@mui/material";
import './index.css';
import Timeline from './pages/timeline.jsx';
import HomePage from './pages/home.jsx';
import AdminDashBoard from './admin/pages/AdminDashBoard.jsx';
import Projets from './pages/projets.jsx';

const theme = createTheme({
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    margin: 0,
                    padding: 0,
                    backgroundColor: "#f4f4f4",
                },
            },
        },
    },
});

const App = () => {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline/>
            <UserProvider>
                <Router>
                    <Routes>
                        <Route path="/" element={<HomePage/>}/>
                        <Route path="/timeline" element={<Timeline/>}/>
                        <Route path="/admin" element={<AdminDashBoard/>}/>
                        <Route path="/projets" element={<Projets/>}/>
                        <Route path="*" element={<Navigate to="/"/>}/>
                    </Routes>
                </Router>
            </UserProvider>
        </ThemeProvider>
    );
};

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <App/>
    </React.StrictMode>
);