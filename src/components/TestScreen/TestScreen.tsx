export function TestScreen() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-purple-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-md text-center">
        <h1 className="text-3xl font-bold text-blue-900 mb-4">
          🏰 Skyland Guardians
        </h1>
        <p className="text-blue-700 mb-6">
          Legacy Guardians - Wealth Adventure Game
        </p>
        <div className="bg-blue-100 p-4 rounded-lg">
          <p className="text-sm text-blue-800">
            ✅ React + TypeScript + Tailwind CSS working properly!
          </p>
          <p className="text-sm text-blue-600 mt-2">
            App successfully loaded and running
          </p>
        </div>
        <div className="mt-6 space-y-2">
          <div className="bg-green-100 text-green-800 p-2 rounded text-sm">
            🟢 Server Running: localhost:5176
          </div>
          <div className="bg-yellow-100 text-yellow-800 p-2 rounded text-sm">
            🟡 Next: Load main UI components
          </div>
        </div>
      </div>
    </div>
  );
}