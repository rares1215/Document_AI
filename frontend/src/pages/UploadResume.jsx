import { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import LoadingScreen from "../components/LoadingScreen";

export const UploadResume = () => {
    const [doc_file, setFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const UploadFile = async (e) => {
        e.preventDefault();

        if (!doc_file) return alert("Please select a PDF file first!");

        try {
            const formData = new FormData();
            formData.append("doc_file", doc_file);

            setIsLoading(true); // turn on loading

            const res = await api.post("api/resumes/", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            if (res.status === 200 || res.status === 201) {
                // mimic processing delay (API will actually process in background)
                setTimeout(() => {
                    navigate("/analysis/latest/");
                }, 2500);
            }
        } catch (err) {
            console.log(err);
            setIsLoading(false);
        }
    };

    if (isLoading) return <LoadingScreen />;

    return (
        <div className="max-w-xl mx-auto mt-20 p-6 bg-white shadow-lg rounded-xl">
            <h1 className="text-2xl font-bold mb-6 text-center">Upload Your Resume</h1>

            <form onSubmit={UploadFile} className="flex flex-col gap-4">
                <input
                    type="file"
                    accept="application/pdf"
                    className="border p-3 rounded-lg cursor-pointer"
                    onChange={(e) => setFile(e.target.files[0])}
                />

                <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg"
                >
                    Upload Resume
                </button>
            </form>
        </div>
    );
};
