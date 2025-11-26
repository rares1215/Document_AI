import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import LoadingScreen from "../components/LoadingScreen";

export const UploadResume = () => {
    const [docFile, setDocFile] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const UploadFile = async (e) => {
        e.preventDefault();
        setError(null);

        if (!docFile) {
            setError("Please select a PDF file.");
            return;
        }

        setLoading(true);

        try {
            const formData = new FormData();
            formData.append("doc_file", docFile);

            const res = await api.post("api/resumes/", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            if (res.status === 200 || res.status === 201) {
                setTimeout(() => navigate("/analysis/latest"), 1500);
            }
        } catch (err) {
            console.log(err);

            if (err.response?.data) {
                const serverError = err.response.data.doc_file;
                if (serverError) {
                    setError(serverError);
                } else {
                    setError("Something went wrong.");
                }
            } else {
                setError("Server unreachable.");
            }

            setLoading(false); // IMPORTANT: doar în caz de eroare
        }
    };

    const handleFileChange = (e) => {
        setDocFile(e.target.files[0]);
        setError(null);
    };

    if (loading) {
        return <LoadingScreen message="Processing your resume..." />;
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-lg">

                <h1 className="text-2xl font-bold mb-6 text-center">
                    Upload Your Resume
                </h1>
                <p className="mb-6 text-gray-400">Please Note that the resume should be written in english</p>

                <form onSubmit={UploadFile}>
                    {/* File Input */}
                    <input
                        type="file"
                        accept="application/pdf"
                        onChange={handleFileChange}
                        className="border rounded-lg p-3 w-full mb-4 cursor-pointer"
                    />

                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-sm">
                            {Array.isArray(error) ? error.join(", ") : error}
                        </div>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full py-3 rounded-lg text-white font-semibold bg-blue-600 hover:bg-blue-700 transition"
                    >
                        Upload Resume
                    </button>
                </form>

            </div>
        </div>
    );
};
