import { useState } from "react"
import { useNavigate } from "react-router-dom";
import api from "../api";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import { Link } from "react-router-dom";

export const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const configLogin = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const res = await api.post("api/token/", { username, password });
            if (res.status === 200) {
                localStorage.setItem(ACCESS_TOKEN, res.data.access);
                localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
                navigate("/");
            }
        } catch (err) {
            setError("Invalid username or password.");
            console.log(err);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-950 px-4">
            <form
                onSubmit={configLogin}
                className="w-full max-w-md bg-gray-900 p-8 rounded-xl shadow-lg border border-gray-800"
                autoComplete="off"
            >
                <h1 className="text-3xl font-bold text-center mb-6 text-white">
                    Login
                </h1>

                {error && (
                    <p className="text-red-500 text-sm mb-4 text-center">
                        {error}
                    </p>
                )}

                {/* Username */}
                <div className="mb-4">
                    <label className="block text-gray-300 mb-1">Username</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-200 focus:outline-none focus:border-blue-500"
                        placeholder="Enter your username"
                        required
                    />
                </div>

                {/* Password */}
                <div className="mb-6">
                    <label className="block text-gray-300 mb-1">Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-200 focus:outline-none focus:border-blue-500"
                        placeholder="Enter your password"
                        required
                    />
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-all font-semibold"
                >
                    Login
                </button>

                <p className="text-gray-400 text-center text-sm mt-4">
                    Don't have an account?{" "}
                <Link to="/register/" className="text-blue-400 hover:underline">
                    Register
                </Link>
                </p>
            </form>
        </div>
    );
};
