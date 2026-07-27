import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/client'
import { useAuthStore } from '../store/auth'

export default function DashboardPage() {
  const { user, loadUser } = useAuthStore()
  const [stats, setStats] = useState({ etudes: 0, patients: 0, reponses: 0 })

  useEffect(() => {
    loadUser()
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      const [etudes, patients, reponses] = await Promise.all([
        api.get('/etudes/'),
        api.get('/patients/'),
        api.get('/reponses/'),
      ])
      setStats({
        etudes: etudes.data.count || etudes.data.length,
        patients: patients.data.count || patients.data.length,
        reponses: reponses.data.count || reponses.data.length,
      })
    } catch {}
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Tableau de bord</h1>
      {user && (
        <p className="text-gray-600 mb-6">
          Bienvenue, <span className="font-semibold">{user.first_name || user.username}</span>
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow p-6">
          <div className="text-3xl font-bold text-blue-600">{stats.etudes}</div>
          <div className="text-gray-500">Études</div>
        </div>
        <div className="bg-white rounded-xl shadow p-6">
          <div className="text-3xl font-bold text-green-600">{stats.patients}</div>
          <div className="text-gray-500">Patients</div>
        </div>
        <div className="bg-white rounded-xl shadow p-6">
          <div className="text-3xl font-bold text-purple-600">{stats.reponses}</div>
          <div className="text-gray-500">Réponses</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link to="/etudes" className="bg-blue-600 text-white rounded-xl p-6 hover:bg-blue-700">
          <div className="text-xl font-semibold">Mes études</div>
          <div className="text-blue-200">Gérer et consulter les études</div>
        </Link>
        <Link to="/patients" className="bg-green-600 text-white rounded-xl p-6 hover:bg-green-700">
          <div className="text-xl font-semibold">Patients</div>
          <div className="text-green-200">Gérer la base de patients</div>
        </Link>
        <Link to="/export" className="bg-purple-600 text-white rounded-xl p-6 hover:bg-purple-700">
          <div className="text-xl font-semibold">Exports</div>
          <div className="text-purple-200">Exporter en CSV et SPSS</div>
        </Link>
        {user?.role === 'admin' && (
          <Link to="/admin" className="bg-orange-600 text-white rounded-xl p-6 hover:bg-orange-700">
            <div className="text-xl font-semibold">Administration</div>
            <div className="text-orange-200">Gérer les utilisateurs</div>
          </Link>
        )}
      </div>
    </div>
  )
}
