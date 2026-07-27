import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../api/client'

interface Question {
  id: string
  name: string
  type: string
  label_fr: string
  label_mg: string
  hint_fr: string
  required: boolean
  choices: { value: string; fr: string; mg: string }[]
  constraint: any
  relevant: any
}

interface Section {
  id: string
  title_fr: string
  questions: Question[]
}

export default function FormPage() {
  const { etudeId, patientId, periode } = useParams()
  const navigate = useNavigate()
  const [sections, setSections] = useState<Section[]>([])
  const [data, setData] = useState<Record<string, any>>({})
  const [currentSection, setCurrentSection] = useState(0)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadForm()
  }, [etudeId])

  const loadForm = async () => {
    const res = await api.get(`/etudes/${etudeId}/form/`)
    setSections(res.data)
  }

  const updateData = (name: string, value: any) => {
    setData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await api.post('/save-reponse/', {
        patient_id: patientId,
        etude_id: etudeId,
        periode,
        data,
      })
      navigate(`/etudes/${etudeId}`)
    } catch {
      alert('Erreur lors de la sauvegarde')
    }
    setSaving(false)
  }

  const isRelevant = (relevant: any): boolean => {
    if (!relevant || Object.keys(relevant).length === 0) return true
    if (relevant.eq) {
      const [name, value] = relevant.eq
      return String(data[name]) === String(value)
    }
    if (relevant.neq) {
      const [name, value] = relevant.neq
      return String(data[name]) !== String(value)
    }
    return true
  }

  const renderQuestion = (q: Question) => {
    if (!isRelevant(q.relevant)) return null

    switch (q.type) {
      case 'text':
        return (
          <input
            type="text"
            value={data[q.name] || ''}
            onChange={(e) => updateData(q.name, e.target.value)}
            className="w-full border rounded-lg px-3 py-2"
          />
        )
      case 'integer':
        return (
          <input
            type="number"
            value={data[q.name] || ''}
            onChange={(e) => updateData(q.name, parseInt(e.target.value) || '')}
            className="w-full border rounded-lg px-3 py-2"
            min={q.constraint?.min}
            max={q.constraint?.max}
          />
        )
      case 'decimal':
        return (
          <input
            type="number"
            step="0.01"
            value={data[q.name] || ''}
            onChange={(e) => updateData(q.name, parseFloat(e.target.value) || '')}
            className="w-full border rounded-lg px-3 py-2"
          />
        )
      case 'date':
        return (
          <input
            type="date"
            value={data[q.name] || ''}
            onChange={(e) => updateData(q.name, e.target.value)}
            className="w-full border rounded-lg px-3 py-2"
          />
        )
      case 'select_one':
        return (
          <select
            value={data[q.name] || ''}
            onChange={(e) => updateData(q.name, e.target.value)}
            className="w-full border rounded-lg px-3 py-2"
          >
            <option value="">-- Sélectionner --</option>
            {q.choices.map((c) => (
              <option key={c.value} value={c.value}>{c.fr}</option>
            ))}
          </select>
        )
      case 'select_multiple':
        const selected = Array.isArray(data[q.name]) ? data[q.name] : []
        return (
          <div className="space-y-2">
            {q.choices.map((c) => (
              <label key={c.value} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selected.includes(c.value)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      updateData(q.name, [...selected, c.value])
                    } else {
                      updateData(q.name, selected.filter((v: string) => v !== c.value))
                    }
                  }}
                />
                <span>{c.fr}</span>
              </label>
            ))}
          </div>
        )
      case 'note':
        return <p className="text-gray-600 italic">{q.label_fr}</p>
      default:
        return null
    }
  }

  if (sections.length === 0) return <div className="p-6">Chargement du formulaire...</div>

  const section = sections[currentSection]

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold">Période {periode}</h1>
        <span className="text-gray-500">
          Section {currentSection + 1} / {sections.length}
        </span>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
        <div
          className="bg-blue-600 h-2 rounded-full transition-all"
          style={{ width: `${((currentSection + 1) / sections.length) * 100}%` }}
        />
      </div>

      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">{section.title_fr}</h2>
        <div className="space-y-4">
          {section.questions.map((q) => (
            <div key={q.id}>
              {q.type !== 'note' && (
                <label className="block text-sm font-medium mb-1">
                  {q.label_fr}
                  {q.required && <span className="text-red-500 ml-1">*</span>}
                </label>
              )}
              {q.hint_fr && <p className="text-xs text-gray-400 mb-1">{q.hint_fr}</p>}
              {renderQuestion(q)}
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-between">
        <button
          onClick={() => setCurrentSection((s) => s - 1)}
          disabled={currentSection === 0}
          className="bg-gray-200 px-4 py-2 rounded-lg disabled:opacity-50"
        >
          ← Précédent
        </button>
        {currentSection < sections.length - 1 ? (
          <button
            onClick={() => setCurrentSection((s) => s + 1)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Suivant →
          </button>
        ) : (
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            {saving ? 'Sauvegarde...' : 'Sauvegarder'}
          </button>
        )}
      </div>
    </div>
  )
}
