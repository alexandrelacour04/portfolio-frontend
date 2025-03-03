import {useEffect} from "react";
import {useNavigate} from "react-router-dom";

const ConfirmExitPage = () => {
    const navigate = useNavigate();
    useEffect(() => {
        navigate("/"); // Redirige vers la racine "/"
    }, [navigate]);
};

export default ConfirmExitPage;