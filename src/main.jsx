import React, {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import {BrowserRouter as Router, Navigate, Route, Routes} from 'react-router-dom'
import './index.css'
import Timeline from "./pages/timeline.jsx";
import DefaultLayout from "./common/DefaultLayout.jsx";
import HomePage from "./pages/home.jsx";
import AdminDashBoard from "./admin/pages/AdminDashBoard.jsx";
import {UserProvider} from "./utils/UserContext.jsx";
import Projets from "./pages/projets.jsx";
import PageTitle from "./common/pageTitle.jsx";

const routes = [
    {path: "/", element: <HomePage/>, title: "Accueil"},
    {path: "/timeline", element: <Timeline/>, title: "Timeline"},
    {path: "/admin", element: <AdminDashBoard/>, title: "Admin Dashboard"},
    {path: "/projets", element: <Projets/>, title: "Projets" },
];

createRoot(document.getElementById('root')).render(
    <UserProvider>
        <StrictMode>
            <Router>
                <Routes>
                    {routes.map((route, index) => (
                        <Route
                            key={index}
                            path={route.path}
                            element={
                                <DefaultLayout>
                                    <PageTitle routes={routes}/>
                                    {route.element}
                                </DefaultLayout>
                            }
                        />
                    ))}
                    <Route path="*" element={<Navigate to="/"/>}/>
                </Routes>
            </Router>
        </StrictMode>
    </UserProvider>
)
