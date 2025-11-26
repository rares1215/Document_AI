// src/components/AnalysisComp.jsx
import { Link } from "react-router-dom";

export const AnalysisComp = ({ analysis }) => {
    return (
        <Link
            to={`/analysis/${analysis.id}`}
            className="block rounded-xl border border-gray-200 shadow-sm p-5 mb-4 hover:shadow-md transition bg-white"
        >
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-semibold text-gray-800">
                        Resume Analysis
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                        Created: {new Date(analysis.created_at).toLocaleString()}
                    </p>
                </div>

                <div className="bg-blue-600 text-white font-bold text-xl w-14 h-14 flex items-center justify-center rounded-full shadow-inner">
                    {analysis.match_score}
                </div>
            </div>
        </Link>
    );
};
