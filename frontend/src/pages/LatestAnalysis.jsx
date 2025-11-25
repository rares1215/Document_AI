import { useEffect, useState } from "react";
import api from "../api";

export const LatestAnalysis = () => {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getAnalysis = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await api.get("api/analysis/latest/");
      if (res.status === 200) {
        setAnalysis(res.data);
      }
    } catch (err) {
      console.log(err);
      setError("No analysis available yet.");
      setAnalysis(null);
    }

    setLoading(false);
  };

  useEffect(() => {
    getAnalysis();
  }, []);

  return (
    <div className="w-full min-h-screen p-6 flex justify-center bg-gray-50">
      <div className="max-w-3xl w-full">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Latest Resume Analysis</h1>

        {/* Loading Spinner */}
        {loading && (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600"></div>
          </div>
        )}

        {/* Error Message */}
        {!loading && error && (
          <div className="text-center py-10">
            <p className="text-gray-600 text-lg">{error}</p>
          </div>
        )}

        {/* Analysis Card */}
        {!loading && analysis && (
          <div className="bg-white shadow-lg rounded-xl p-6 space-y-4 border border-gray-200">

            {/* Score */}
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800">Match Score</h2>
              <span className="text-2xl font-bold text-blue-600">{analysis.match_score}/100</span>
            </div>

            {/* Experience Summary */}
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-1">Experience Summary</h3>
              <p className="text-gray-600 leading-relaxed">{analysis.experience_summary}</p>
            </div>

            {/* Skills */}
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-1">Skills Detected</h3>
              <div className="flex flex-wrap gap-2">
                {analysis.skills?.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Suggestions */}
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-1">Suggestions</h3>
              <ul className="list-disc pl-6 text-gray-600 space-y-1">
                {analysis.suggestions?.map((s, idx) => (
                  <li key={idx}>{s}</li>
                ))}
              </ul>
            </div>

            {/* Refresh Button */}
            <button
              onClick={getAnalysis}
              className="w-full mt-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition"
            >
              Refresh Analysis
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
