import { useEffect, useState } from "react";
import api from "../api";
import { AnalysisComp } from "../components/Analysis_comp";
import { LoadingSpinner } from "../components/LoadingSpinner";

export const History = () => {
    const [analyses, setAnalyses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const getAnalyses = async () => {
        setError(null);
        try {
            const res = await api.get("api/analysis/");
            setAnalyses(res.data);
        } catch (err) {
            setError("Could not fetch analyses.");
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getAnalyses();
    }, []);

    if (loading)
        return (
            <LoadingSpinner />
        );

    return (
        <div className="max-w-3xl mx-auto mt-30 px-4">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">
                Your Resume Analysis History
            </h1>

            {error && (
                <p className="text-red-500 text-center mb-4">{error}</p>
            )}

            {analyses.length === 0 ? (
                <p className="text-gray-600 text-center">
                    You don’t have any resume analyses yet.
                </p>
            ) : (
                analyses.map((analysis) => (
                    <AnalysisComp analysis={analysis} key={analysis.id} />
                ))
            )}
        </div>
    );
};
