import { useEffect, useState } from "react";
import api from "../api";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function ProtectedRoute({ children }) {
    const [isAuth, setIsAuth] = useState(null);

    const refreshToken = async () => {
        const refresh = localStorage.getItem(REFRESH_TOKEN);
        try {
            const res = await api.post("api/token/refresh/", { refresh });
            if (res.status === 200) {
                localStorage.setItem(ACCESS_TOKEN, res.data.access);
                setIsAuth(true);
            } else {
                setIsAuth(false);
            }
        } catch {
            setIsAuth(false);
        }
    };

    const validateAuth = async () => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        if (!token) return setIsAuth(false);

        try {
            const decoded = jwtDecode(token);
            const now = Date.now() / 1000;

            if (decoded.exp < now) {
                await refreshToken();
            } else {
                setIsAuth(true);
            }
        } catch {
            setIsAuth(false);
        }
    };

    useEffect(() => {
        Promise.resolve().then(() => validateAuth());
    }, []);

    if (isAuth === null) return <h1>Loading...</h1>;

    return isAuth ? children : <Navigate to="/login/" />;
}

export default ProtectedRoute;
