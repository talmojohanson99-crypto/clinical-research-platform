import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/client'

interface Etude {
  id: string
  nom: string
  description: string
  statut: string
  nb_patients: number
  nb_reponses: number
  created_at: string
}

const STATUT_COLORS: Record<string, string> = {
  draft: 'bg-gray-100 text-gray-700',
  active: 'bg-green-100 text-green-700',
  paused: 'bg-yellow-100 text-yellow-700',
  completed: 'bg-blue-100 text-blue-700',
}

export default function EtudesPage() {
  const [etudes, setEtudes] = useState<Etude[]>([])
  const [showCreate, setShowCreate] = useState(false)
  const [form, setForm] = useState({ nom: '', description: '' })

  useEffect(() => {
    loadEtudes()
  }, [])

  const loadEtudes = async () => {
    const res = await api.get('/etudes/')
    setEtudes(res.data.results || res.data)
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    await api.post('/etudes/', { ...form, statut: 'draft', periodes: [], scoring_rules: { auto: [] } })
    setForm({ nom: '', description: '' })
    setShowCreate(false)
    loadEtudes()
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Études</h1>
        <button
          onClick={() => setShowCreate(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          + Nouvelle étude
        </button>
      </div>

      {showCreate && (
        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Créer une étude</h2>
          <form onSubmit={handleCreate} className="space-y-4">
            <input
              type="text"
              placeholder="Nom de l'étude"
              value={form.nom}
              onChange={(e) => setForm({ ...form, nom: e.target.value })}
              className="w-full border rounded-lg px-3 py-2"
              required
            />
            <textarea
              placeholder="Description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full border rounded-lg px-3 py-2"
              rows={3}
            />
            <div className="flex gap-2">
              <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded-lg">
                Créer
              </button>
              <button type="button" onClick={() => setShowCreate(false)} className="bg-gray-200 px-4 py-2 rounded-lg">
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {etudes.map((e) => (
          <Link
            key={e.id}
            to={`/etudes/${e.id}`}
            className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition"
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold text-lg">{e.nom}</h3>
              <span className={`text-xs px-2 py-1 rounded-full ${STATUT_COLORS[e.statut]}`}>
                {e.statut}
              </span>
            </div>
            <p className="text-gray-500 text-sm mb-4 line-clamp-2">{e.description}</p>
            <div className="flex gap-4 text-sm text-gray-600">
              <span>{e.nb_patients} patients</span>
              <span>{e.nb_reponses} réponses</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
