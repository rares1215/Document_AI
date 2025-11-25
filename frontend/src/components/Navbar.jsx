import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const isLoggedIn = !!localStorage.getItem(ACCESS_TOKEN);

  const logout = () => {
    localStorage.removeItem(ACCESS_TOKEN);
    localStorage.removeItem(REFRESH_TOKEN);
    navigate("/login/");
  };

  return (
    <nav className="bg-black shadow-md fixed w-full top-0 left-0 z-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-blue-600">
            ResumeAI
          </Link>

          {/* Desktop menu */}
          <div className="hidden md:flex space-x-6 items-center">

            <Link
              to="/"
              className="text-gray-600 hover:text-blue-600 transition"
            >
              Home
            </Link>

            {isLoggedIn && (
              <>
                <Link
                  to="/upload_file/"
                  className="text-gray-600 hover:text-blue-600 transition"
                >
                  Upload Resume
                </Link>

                <Link
                  to="/analysis/"
                  className="text-gray-600 hover:text-blue-600 transition"
                >
                  My Analyses
                </Link>
              </>
            )}

            {!isLoggedIn ? (
              <>
                <Link
                  to="/login/"
                  className="text-gray-600 hover:text-blue-600 transition"
                >
                  Login
                </Link>
                <Link
                  to="/register/"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Register
                </Link>
              </>
            ) : (
              <button
                onClick={logout}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
              >
                Logout
              </button>
            )}
          </div>

          {/* Mobile button */}
          <button
            className="md:hidden focus:outline-none"
            onClick={() => setIsOpen(!isOpen)}
          >
            <svg
              className="w-7 h-7 text-gray-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth="2"
            >
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16m0 6H4" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-md">
          <div className="px-4 pt-2 pb-4 space-y-2">

            <Link
              to="/"
              onClick={() => setIsOpen(false)}
              className="block text-gray-700 py-2 hover:text-blue-600"
            >
              Home
            </Link>

            {isLoggedIn && (
              <>
                <Link
                  to="/upload/"
                  onClick={() => setIsOpen(false)}
                  className="block text-gray-700 py-2 hover:text-blue-600"
                >
                  Upload Resume
                </Link>

                <Link
                  to="/analysis/"
                  onClick={() => setIsOpen(false)}
                  className="block text-gray-700 py-2 hover:text-blue-600"
                >
                  My Analyses
                </Link>
              </>
            )}

            {!isLoggedIn ? (
              <>
                <Link
                  to="/login/"
                  onClick={() => setIsOpen(false)}
                  className="block text-gray-700 py-2 hover:text-blue-600"
                >
                  Login
                </Link>

                <Link
                  to="/register/"
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-center"
                >
                  Register
                </Link>
              </>
            ) : (
              <button
                onClick={() => {
                  logout();
                  setIsOpen(false);
                }}
                className="w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Logout
              </button>
            )}

          </div>
        </div>
      )}
    </nav>
  );
};
