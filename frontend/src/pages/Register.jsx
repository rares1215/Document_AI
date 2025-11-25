import { useState } from "react";
import api from "../api";
import { Link, useNavigate } from "react-router-dom";


export const Register = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");

  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const configRegister = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const res = await api.post("api/register/", {
        email,
        username,
        password,
        password2,
      });

      if (res.status === 201 || res.status === 200) {
        setSuccess(true);
        navigate("/login/");
        setEmail("");
        setUsername("");
        setPassword("");
        setPassword2("");
      }
    } catch (err) {
      const data = err.response?.data;
      let msg = "Registration failed.";

      if (data) {
        msg = Object.values(data)[0];
      }

      setError(msg);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-gray-900 p-8 rounded-xl shadow-xl border border-gray-800">
        <h2 className="text-3xl font-bold text-white text-center mb-6">
          Create Account
        </h2>

        <p className="text-gray-400 text-center mb-8 text-sm">
          Upload your resume and get AI-powered feedback.
        </p>

        {error && (
          <div className="mb-4 p-3 rounded bg-red-900/40 border border-red-700 text-red-300 text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 rounded bg-green-900/40 border border-green-700 text-green-300 text-sm">
            Your account has been created. You can now log in.
          </div>
        )}

        <form onSubmit={configRegister} className="space-y-5" autoComplete="off">
          {/* Email */}
          <div>
            <label className="text-sm text-gray-300">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Username */}
          <div>
            <label className="text-sm text-gray-300">Username</label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Password */}
          <div>
            <label className="text-sm text-gray-300">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Confirm password */}
          <div>
            <label className="text-sm text-gray-300">Confirm Password</label>
            <input
              type="password"
              required
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
              className="mt-1 w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition"
          >
            Register
          </button>
        </form>

        <p className="text-gray-400 text-sm text-center mt-6">
          Already have an account?{" "}
          <Link to="/login/" className="text-blue-400 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};
