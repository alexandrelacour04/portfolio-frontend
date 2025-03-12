import React, {StrictMode} from 'react'

import {BrowserRouter as Router, Navigate, Route, Routes} from 'react-router-dom'
import './index.css'
import Timeline from "./pages/timeline.jsx";

import HomePage from "./pages/home.jsx";
import AdminDashBoard from "./admin/pages/AdminDashBoard.jsx";

import Projets from "./pages/projets.jsx";




const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/timeline" element={<Timeline />} />
                <Route path="/admin" element={<AdminDashBoard />} />
                <Route path="/projets" element={<Projets />} />
                <Route path="/a-propos" element={<Apropos />} />
                {/* Redirige toutes les routes inconnues vers HomePage */}
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </Router>
    );
};

export default App;
