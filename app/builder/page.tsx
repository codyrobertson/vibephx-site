export default function BuilderPage() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-4">Builder Coming Soon</h1>
        <p className="text-gray-400">
          The VibePHX Builder is temporarily unavailable during maintenance.
        </p>
        <a 
          href="/" 
          className="inline-block mt-6 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-black font-semibold rounded-lg transition-colors"
        >
          Return Home
        </a>
      </div>
    </div>
  )
}