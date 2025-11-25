import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

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

            if (res.status === 201 || res.status === 200) {
                setTimeout(() => {
                    navigate("/analysis/latest/");
                }, 1500); // small loading delay
            }
        } catch (err) {
            console.log(err);

            if (err.response?.data) {
                // extract readable error
                const serverError = err.response.data.doc_file;
                if (serverError) {
                    setError(serverError);
                } else {
                    setError("Something went wrong.");
                }
            } else {
                setError("Server unreachable.");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e) => {
        setDocFile(e.target.files[0]);
        setError(null); // clear error on new selection
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-lg">

                <h1 className="text-2xl font-bold mb-6 text-center">
                    Upload Your Resume
                </h1>

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
                        disabled={loading}
                        className={`w-full py-3 rounded-lg text-white font-semibold transition 
                        ${loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"}`}
                    >
                        {loading ? "Uploading..." : "Upload Resume"}
                    </button>
                </form>

                {/* Loading Spinner */}
                {loading && (
                    <div className="flex justify-center mt-4">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
                    </div>
                )}
            </div>
        </div>
    );
};
