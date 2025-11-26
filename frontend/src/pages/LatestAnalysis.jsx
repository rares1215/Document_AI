import { useEffect, useState } from "react";
import api from "../api";
import LoadingScreen from "../components/LoadingScreen"

export const LatestAnalysis = () => {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getAnalysis = async () => {
    setError(null);
    setLoading(true);

    try {
      const res = await api.get("api/analysis/latest/");
      if (res.status === 200) {
        setAnalysis(res.data);
      }
    } catch {
      setError("No analysis available yet.");
      setAnalysis(null);
    }

    setLoading(false);
  };

  useEffect(() => {
    getAnalysis();
  }, []);

  // Loading UI
  if (loading) {
    return <LoadingScreen />;
  }

  // Error UI
  if (error || !analysis) {
    return (
      <div className="text-center mt-20 text-gray-600 font-semibold text-lg">
        {error || "No analysis found."}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-30 mb-10 p-6 bg-white shadow-lg rounded-xl border border-gray-200">

      {/* HEADER */}
      <div className="border-b pb-4 mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Latest Resume Analysis</h1>
        <p className="text-gray-500 text-sm mt-1">
          Created • {new Date(analysis.created_at).toLocaleString()}
        </p>
      </div>

      {/* SCORE */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Match Score</h2>

        <div className="w-full bg-gray-200 h-4 rounded-lg overflow-hidden">
          <div
            className="h-4 rounded-lg transition-all"
            style={{
              width: `${analysis.match_score}%`,
              background:
                analysis.match_score > 70
                  ? "#16a34a"
                  : analysis.match_score > 40
                  ? "#facc15"
                  : "#dc2626",
            }}
          ></div>
        </div>

        <p className="mt-2 font-semibold text-gray-900">
          {analysis.match_score} / 100
        </p>
      </div>

      {/* SKILLS */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-3">Extracted Skills</h2>

        <div className="flex flex-wrap gap-2">
          {analysis.skills?.length > 0 ? (
            analysis.skills.map((skill) => (
              <span
                key={skill}
                className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium"
              >
                {skill}
              </span>
            ))
          ) : (
            <p className="text-gray-500 italic">No skills detected.</p>
          )}
        </div>
      </div>

      {/* EXPERIENCE SUMMARY */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Experience Summary</h2>
        <p className="text-gray-700 leading-relaxed">
          {analysis.experience_summary}
        </p>
      </div>

      {/* SUGGESTIONS */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-3">Suggestions</h2>

        <ul className="list-disc list-inside space-y-2 text-gray-700">
          {Array.isArray(analysis.suggestions)
            ? analysis.suggestions.map((s, idx) => (
                <li key={idx} className="leading-relaxed">{s}</li>
              ))
            : <li className="italic text-gray-500">No suggestions available.</li>}
        </ul>
      </div>

      {/* BUTTONS */}
      <div className="flex gap-4 pt-4">
        <button
          onClick={getAnalysis}
          className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition"
        >
          Refresh
        </button>
      </div>
    </div>
  );
};

