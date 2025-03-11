import React from "react";
import { useLocation } from "react-router-dom";

const PageTitle = ({ routes }) => {
    const { pathname } = useLocation();

    React.useEffect(() => {
        // Validation pour éviter les erreurs
        if (!routes || !Array.isArray(routes)) {
            console.warn("La prop 'routes' n'est pas fournie ou n'est pas un tableau.");
            document.title = "Mon Portfolio"; // Titre par défaut
            return;
        }

        const currentRoute = routes.find(route => route.path === pathname);
        if (currentRoute) {
            document.title = `${currentRoute.title} - Mon Portfolio`;
        } else {
            document.title = "Mon Portfolio"; // Titre par défaut si aucune correspondance
        }
    }, [pathname, routes]);

    return null; // Composant qui n'affiche rien
};

export default PageTitle;