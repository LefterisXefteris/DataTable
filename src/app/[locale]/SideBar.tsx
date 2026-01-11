export default function Sidebar() {
  return (
    <div className="flex">
      {/* Sidebar Container */}
      <aside className="fixed top-0 left-0 flex h-screen w-64 flex-col bg-gray-900 text-white">

        {/* Brand/Logo Section */}
        <div className="border-b border-gray-800 p-6 text-2xl font-bold">
          My App
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 space-y-2 px-4 py-6">
          <a href="#" className="block rounded bg-blue-600 px-4 py-2 transition hover:bg-blue-700">
            Dashboard
          </a>
          <a href="#" className="block rounded px-4 py-2 transition hover:bg-gray-800">
            Analytics
          </a>
          <a href="#" className="block rounded px-4 py-2 transition hover:bg-gray-800">
            Reports
          </a>
          <a href="#" className="block rounded px-4 py-2 transition hover:bg-gray-800">
            Settings
          </a>
        </nav>

        {/* Bottom Profile/Footer Section */}
        <div className="border-t border-gray-800 p-4">
          <button className="flex w-full items-center rounded px-4 py-2 transition hover:bg-red-600">
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content (Offset by Sidebar width using ml-64) */}
      <main className="ml-64 min-h-screen w-full bg-gray-50 p-10">
        <h1 className="text-2xl font-semibold text-gray-800">Page Content</h1>
        <p className="mt-4 text-gray-600">
          The main content area starts after the 64-unit (16rem) wide sidebar.
        </p>
      </main>
    </div>
  );
}
