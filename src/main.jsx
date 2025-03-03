import React, {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import {BrowserRouter, Navigate, Route, Routes} from 'react-router-dom'
import './index.css'
import Timeline from "./pages/timeline.jsx";
import DefaultLayout from "./common/DefaultLayout.jsx";
import HomePage from "./pages/home.jsx";
import AdminDashBoard from "./admin/pages/AdminDashBoard.jsx";
import {UserProvider} from "./utils/UserContext.jsx";

createRoot(document.getElementById('root')).render(
    <UserProvider>
        <StrictMode>
            <BrowserRouter>
                <Routes>
                    <Route
                        path="/"
                        element={
                            <DefaultLayout> {/* Appliquer le layout */}
                                <HomePage/>
                            </DefaultLayout>
                        }
                    />
                    {/* Page d'accueil */}
                    <Route
                        path="/timeline"
                        element={
                            <DefaultLayout> {/* Appliquer le layout */}
                                <Timeline/>
                            </DefaultLayout>
                        }
                    />
                    <Route
                        path="/admin"
                        element={
                            <DefaultLayout>
                                <AdminDashBoard/>
                            </DefaultLayout>
                        }
                    />
                    <Route path="*" element={<Navigate to="/"/>}/>
                </Routes>
            </BrowserRouter>
        </StrictMode>
    </UserProvider>
)
