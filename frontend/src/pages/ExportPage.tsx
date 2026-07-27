import { useEffect, useState } from 'react'
import api from '../api/client'

export default function ExportPage() {
  const [etudes, setEtudes] = useState<any[]>([])
  const [selected, setSelected] = useState('')

  useEffect(() => {
    loadEtudes()
  }, [])

  const loadEtudes = async () => {
    const res = await api.get('/etudes/')
    setEtudes(res.data.results || res.data)
  }

  const downloadCSV = () => {
    if (!selected) return
    window.open(`/api/export/csv/${selected}/`, '_blank')
  }

  const downloadSPSS = () => {
    if (!selected) return
    window.open(`/api/export/spss/${selected}/`, '_blank')
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Exporter les données</h1>

      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Choisir une étude</h2>
        <select
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
          className="w-full border rounded-lg px-3 py-2 mb-6"
        >
          <option value="">-- Sélectionner une étude --</option>
          {etudes.map((e) => (
            <option key={e.id} value={e.id}>{e.nom}</option>
          ))}
        </select>

        <div className="flex gap-4">
          <button
            onClick={downloadCSV}
            disabled={!selected}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            📊 Exporter en CSV
          </button>
          <button
            onClick={downloadSPSS}
            disabled={!selected}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            📈 Exporter en SPSS (.sav)
          </button>
        </div>
      </div>
    </div>
  )
}
