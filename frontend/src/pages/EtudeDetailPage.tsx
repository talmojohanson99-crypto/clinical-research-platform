import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import api from '../api/client'

export default function EtudeDetailPage() {
  const { id } = useParams()
  const [etude, setEtude] = useState<any>(null)
  const [patients, setPatients] = useState<any[]>([])
  const [stats, setStats] = useState<any>(null)
  const [newNumero, setNewNumero] = useState('')

  useEffect(() => {
    loadEtude()
    loadPatients()
    loadStats()
  }, [id])

  const loadEtude = async () => {
    const res = await api.get(`/etudes/${id}/`)
    setEtude(res.data)
  }

  const loadPatients = async () => {
    const res = await api.get(`/etudes/${id}/patients/`)
    setPatients(res.data)
  }

  const loadStats = async () => {
    const res = await api.get(`/etudes/${id}/stats/`)
    setStats(res.data)
  }

  const addPatient = async () => {
    if (!newNumero) return
    await api.post(`/etudes/${id}/add_patient/`, { numero_id: newNumero })
    setNewNumero('')
    loadPatients()
    loadStats()
  }

  if (!etude) return <div className="p-6">Chargement...</div>

  return (
    <div className="p-6">
      <div className="mb-6">
        <Link to="/etudes" className="text-blue-600 hover:underline">← Retour aux études</Link>
      </div>

      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold">{etude.nom}</h1>
          <p className="text-gray-500">{etude.description}</p>
          <span className="inline-block mt-2 text-xs px-2 py-1 rounded-full bg-gray-100">
            {etude.domaine}
          </span>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm ${
          etude.statut === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
        }`}>
          {etude.statut}
        </span>
      </div>

      {/* Actions rapides */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <Link
          to={`/etudes/${id}/builder`}
          className="bg-purple-600 text-white rounded-xl p-4 text-center hover:bg-purple-700"
        >
          <div className="text-2xl mb-1">📝</div>
          <div className="font-medium">Form Builder</div>
        </Link>
        <Link
          to={`/export?etude=${id}`}
          className="bg-blue-600 text-white rounded-xl p-4 text-center hover:bg-blue-700"
        >
          <div className="text-2xl mb-1">📊</div>
          <div className="font-medium">Exporter</div>
        </Link>
        <button className="bg-gray-200 rounded-xl p-4 text-center hover:bg-gray-300">
          <div className="text-2xl mb-1">⚙️</div>
          <div className="font-medium">Paramètres</div>
        </button>
        <button className="bg-gray-200 rounded-xl p-4 text-center hover:bg-gray-300">
          <div className="text-2xl mb-1">📈</div>
          <div className="font-medium">Statistiques</div>
        </button>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow p-4">
            <div className="text-2xl font-bold text-blue-600">{stats.total_patients}</div>
            <div className="text-gray-500">Patients</div>
          </div>
          <div className="bg-white rounded-xl shadow p-4">
            <div className="text-2xl font-bold text-green-600">{stats.total_reponses}</div>
            <div className="text-gray-500">Réponses</div>
          </div>
          <div className="bg-white rounded-xl shadow p-4">
            <div className="text-2xl font-bold text-purple-600">
              {Object.keys(stats.par_periode).length}
            </div>
            <div className="text-gray-500">Périodes</div>
          </div>
        </div>
      )}

      {/* Ajouter un patient */}
      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Ajouter un patient</h2>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Numéro du patient (ex: P-01)"
            value={newNumero}
            onChange={(e) => setNewNumero(e.target.value)}
            className="border rounded-lg px-3 py-2 flex-1"
          />
          <button
            onClick={addPatient}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Ajouter
          </button>
        </div>
      </div>

      {/* Liste des patients */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Patients ({patients.length})</h2>
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2">Numéro</th>
              <th className="text-left py-2">Genre</th>
              <th className="text-left py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((p) => (
              <tr key={p.id} className="border-b">
                <td className="py-2">{p.numero_id}</td>
                <td className="py-2">{p.genre === '1' ? 'Masculin' : p.genre === '2' ? 'Féminin' : '-'}</td>
                <td className="py-2">
                  <Link
                    to={`/etudes/${id}/fill/${p.id}/T1`}
                    className="text-blue-600 hover:underline mr-4"
                  >
                    Remplir T1
                  </Link>
                  <Link
                    to={`/etudes/${id}/fill/${p.id}/T2`}
                    className="text-green-600 hover:underline"
                  >
                    Remplir T2
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
