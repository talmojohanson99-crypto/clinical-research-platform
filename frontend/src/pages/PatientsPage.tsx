import { useEffect, useState } from 'react'
import api from '../api/client'

export default function PatientsPage() {
  const [patients, setPatients] = useState<any[]>([])
  const [search, setSearch] = useState('')

  useEffect(() => {
    loadPatients()
  }, [])

  const loadPatients = async () => {
    const res = await api.get('/patients/', { params: { search } })
    setPatients(res.data.results || res.data)
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Patients</h1>

      <div className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="Rechercher par numéro..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-lg px-3 py-2 flex-1"
        />
        <button onClick={loadPatients} className="bg-blue-600 text-white px-4 py-2 rounded-lg">
          Rechercher
        </button>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="text-left py-3 px-4">Numéro</th>
              <th className="text-left py-3 px-4">Genre</th>
              <th className="text-left py-3 px-4">Date naissance</th>
              <th className="text-left py-3 px-4">Études</th>
              <th className="text-left py-3 px-4">Créé le</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((p) => (
              <tr key={p.id} className="border-t hover:bg-gray-50">
                <td className="py-3 px-4 font-medium">{p.numero_id}</td>
                <td className="py-3 px-4">{p.genre === '1' ? 'M' : p.genre === '2' ? 'F' : '-'}</td>
                <td className="py-3 px-4">{p.date_naissance || '-'}</td>
                <td className="py-3 px-4">{p.etudes_count}</td>
                <td className="py-3 px-4 text-sm text-gray-500">
                  {new Date(p.created_at).toLocaleDateString('fr-FR')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
