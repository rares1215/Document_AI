export const Home = () => {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Hero Section */}
            <section className="flex-1 flex flex-col items-center justify-center text-center px-6 py-20">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
                    AI-Powered Resume Analyzer
                </h1>

                <p className="text-lg md:text-xl text-gray-600 max-w-2xl mb-10">
                    Upload your resume and instantly receive an AI-generated evaluation:
                    extracted skills, experience summary, match score, and actionable suggestions
                    to make your resume stand out.
                </p>

                <div className="flex gap-4">
                    <a
                        href="/register"
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg text-lg hover:bg-blue-700 transition"
                    >
                        Get Started
                    </a>

                    <a
                        href="/login"
                        className="px-6 py-3 border border-blue-600 text-blue-600 rounded-lg text-lg hover:bg-blue-50 transition"
                    >
                        Login
                    </a>
                </div>
            </section>

            {/* Features Section */}
            <section className="bg-white py-16 px-6">
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
                    Why Use Our Analyzer?
                </h2>

                <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
                    <div className="p-6 bg-gray-100 rounded-xl shadow-sm">
                        <h3 className="text-xl font-semibold mb-3">AI-Powered Insights</h3>
                        <p className="text-gray-600">
                            Get detailed feedback extracted from your resume using modern LLM technology.
                        </p>
                    </div>

                    <div className="p-6 bg-gray-100 rounded-xl shadow-sm">
                        <h3 className="text-xl font-semibold mb-3">Resume Scoring</h3>
                        <p className="text-gray-600">
                            Your resume receives a match score based on industry-standard expectations.
                        </p>
                    </div>

                    <div className="p-6 bg-gray-100 rounded-xl shadow-sm">
                        <h3 className="text-xl font-semibold mb-3">Actionable Suggestions</h3>
                        <p className="text-gray-600">
                            Clear, personalized recommendations to help you improve your resume.
                        </p>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-6 text-center text-gray-500 text-sm">
                © {new Date().getFullYear()} Resume Analyzer · All rights reserved.
            </footer>
        </div>
    );
};
