export default function LoadingScreen({ message = "Processing your resume..." }) {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-lg font-medium text-gray-700">{message}</p>
        </div>
    );
}
