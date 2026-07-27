import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/auth'

const NAV_ITEMS = [
  { path: '/dashboard', label: 'Dashboard', icon: '🏠' },
  { path: '/etudes', label: 'Études', icon: '📋' },
  { path: '/patients', label: 'Patients', icon: '👥' },
  { path: '/export', label: 'Exports', icon: '📊' },
]

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuthStore()
  const location = useLocation()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-64 bg-white shadow-lg">
        <div className="p-4 border-b">
          <h1 className="text-lg font-bold text-purple-700">e-Collect</h1>
        </div>
        <nav className="p-4">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg mb-2 ${
                location.pathname === item.path
                  ? 'bg-purple-50 text-purple-700'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
          {user?.role === 'admin' && (
            <Link
              to="/admin"
              className={`flex items-center gap-3 px-3 py-2 rounded-lg mb-2 ${
                location.pathname === '/admin'
                  ? 'bg-orange-50 text-orange-700'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <span>⚙️</span>
              <span>Administration</span>
            </Link>
          )}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
          <div className="text-sm text-gray-500 mb-2">
            {user?.first_name || user?.username}
            <span className="ml-2 text-xs bg-gray-100 px-2 py-1 rounded">{user?.role}</span>
          </div>
          <button
            onClick={handleLogout}
            className="w-full text-left text-red-600 hover:text-red-700 text-sm"
          >
            Déconnexion
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="ml-64 min-h-screen">
        {children}
      </div>
    </div>
  )
}
