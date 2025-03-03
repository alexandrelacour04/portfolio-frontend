import React, { createContext, useState, useContext } from 'react';
import PropTypes from 'prop-types';

// Création du contexte utilisateur
const UserContext = createContext();

// Hook personnalisé pour accéder facilement au contexte utilisateur
export const useUser = () => useContext(UserContext);

// Le fournisseur de contexte pour encapsuler l'application et partager l'état utilisateur
export const UserProvider = ({ children }) => {
    // Charger les données utilisateur (sans ID) depuis le localStorage
    const [user, setUser] = useState(() => {
        const userFromStorage = localStorage.getItem("user");
        return userFromStorage ? JSON.parse(userFromStorage) : null;
    });

    // Filtrer les données utilisateur pour exclure l'ID
    const saveUser = (userData) => {
        const filteredUser = { ...userData };
        delete filteredUser.id; // Supprimer l'ID de l'objet avant de sauvegarder

        setUser(filteredUser); // Garder les données utilisateur en mémoire
        localStorage.setItem("user", JSON.stringify(filteredUser)); // Sauvegarder dans le localStorage
    };

    const clearUser = () => {
        setUser(null); // Retirer l'utilisateur de l'état
        localStorage.removeItem("user"); // Supprimer du stockage local
    };

    return (
        <UserContext.Provider value={{ user, saveUser, clearUser }}>
            {children}
        </UserContext.Provider>
    );
};

UserProvider.propTypes = {
    children: PropTypes.node.isRequired,
};