import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import api from '../api/client'

interface Question {
  id?: string
  name: string
  type: string
  label_fr: string
  label_mg: string
  hint_fr: string
  required: boolean
  choices: { value: string; fr: string; mg: string }[]
  constraint: any
  relevant: any
  spss_name: string
  spss_label: string
  order: number
}

interface Section {
  id?: string
  code: string
  title_fr: string
  title_mg: string
  order: number
  questions: Question[]
}

const QUESTION_TYPES = [
  { value: 'text', label: 'Texte libre' },
  { value: 'integer', label: 'Nombre entier' },
  { value: 'decimal', label: 'Nombre décimal' },
  { value: 'date', label: 'Date' },
  { value: 'select_one', label: 'Choix unique' },
  { value: 'select_multiple', label: 'Choix multiple' },
  { value: 'likert', label: 'Échelle Likert' },
  { value: 'note', label: 'Note / Information' },
]

export default function FormBuilderPage() {
  const { id } = useParams()
  const [etude, setEtude] = useState<any>(null)
  const [sections, setSections] = useState<Section[]>([])
  const [currentSection, setCurrentSection] = useState(0)
  const [showAddQuestion, setShowAddQuestion] = useState(false)
  const [newQuestion, setNewQuestion] = useState<Partial<Question>>({
    type: 'text',
    required: false,
    choices: [],
  })

  useEffect(() => {
    loadForm()
  }, [id])

  const loadForm = async () => {
    const res = await api.get(`/etudes/${id}/form_builder/`)
    setEtude(res.data.etude)
    setSections(res.data.sections || [])
  }

  const addSection = async () => {
    const code = `section_${sections.length + 1}`
    await api.post('/sections/', {
      etude: id,
      code,
      title_fr: `Section ${sections.length + 1}`,
      title_mg: `Sokajy ${sections.length + 1}`,
      order: sections.length,
    })
    loadForm()
  }

  const addQuestion = async () => {
    if (!newQuestion.name || !newQuestion.label_fr) return
    const section = sections[currentSection]
    if (!section?.id) return

    await api.post('/questions/', {
      ...newQuestion,
      section: section.id,
      order: section.questions.length,
    })
    setNewQuestion({ type: 'text', required: false, choices: [] })
    setShowAddQuestion(false)
    loadForm()
  }

  const deleteQuestion = async (questionId: string) => {
    if (!confirm('Supprimer cette question ?')) return
    await api.delete(`/questions/${questionId}/`)
    loadForm()
  }

  const deleteSection = async (sectionId: string) => {
    if (!confirm('Supprimer cette section et toutes ses questions ?')) return
    await api.delete(`/sections/${sectionId}/`)
    loadForm()
  }

  if (!etude) return <div className="p-6">Chargement...</div>

  return (
    <div className="p-6">
      <div className="mb-6">
        <Link to={`/etudes/${id}`} className="text-blue-600 hover:underline">← Retour à l'étude</Link>
        <h1 className="text-2xl font-bold mt-2">Form Builder — {etude.nom}</h1>
      </div>

      <div className="flex gap-6">
        {/* Sidebar - Sections */}
        <div className="w-64 bg-white rounded-xl shadow p-4">
          <h2 className="font-semibold mb-4">Sections</h2>
          <div className="space-y-2">
            {sections.map((s, i) => (
              <button
                key={s.id || i}
                onClick={() => setCurrentSection(i)}
                className={`w-full text-left px-3 py-2 rounded ${
                  currentSection === i ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'
                }`}
              >
                <div className="font-medium text-sm">{s.title_fr}</div>
                <div className="text-xs text-gray-500">{s.questions?.length || 0} questions</div>
              </button>
            ))}
          </div>
          <button
            onClick={addSection}
            className="w-full mt-4 bg-gray-200 text-gray-700 px-3 py-2 rounded hover:bg-gray-300"
          >
            + Ajouter une section
          </button>
        </div>

        {/* Main - Questions */}
        <div className="flex-1">
          {sections[currentSection] && (
            <div className="bg-white rounded-xl shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">
                  {sections[currentSection].title_fr}
                </h2>
                <button
                  onClick={() => setShowAddQuestion(true)}
                  className="bg-blue-600 text-white px-3 py-1 rounded text-sm"
                >
                  + Question
                </button>
              </div>

              {/* Liste des questions */}
              <div className="space-y-3">
                {(sections[currentSection].questions || []).map((q, i) => (
                  <div key={q.id || i} className="border rounded-lg p-3 flex justify-between items-start">
                    <div>
                      <div className="font-medium">{q.label_fr}</div>
                      <div className="text-sm text-gray-500">
                        {q.name} • {q.type}
                        {q.required && <span className="text-red-500 ml-2">*</span>}
                      </div>
                      {q.choices && q.choices.length > 0 && (
                        <div className="text-xs text-gray-400 mt-1">
                          {q.choices.length} choix : {q.choices.map(c => c.fr).join(', ')}
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => deleteQuestion(q.id!)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      Supprimer
                    </button>
                  </div>
                ))}
              </div>

              {/* Formulaire d'ajout */}
              {showAddQuestion && (
                <div className="mt-4 border-t pt-4">
                  <h3 className="font-medium mb-3">Nouvelle question</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Clé technique (ex: genre)"
                      value={newQuestion.name || ''}
                      onChange={(e) => setNewQuestion({ ...newQuestion, name: e.target.value })}
                      className="border rounded px-3 py-2"
                    />
                    <select
                      value={newQuestion.type || 'text'}
                      onChange={(e) => setNewQuestion({ ...newQuestion, type: e.target.value })}
                      className="border rounded px-3 py-2"
                    >
                      {QUESTION_TYPES.map(t => (
                        <option key={t.value} value={t.value}>{t.label}</option>
                      ))}
                    </select>
                    <input
                      type="text"
                      placeholder="Label français"
                      value={newQuestion.label_fr || ''}
                      onChange={(e) => setNewQuestion({ ...newQuestion, label_fr: e.target.value })}
                      className="border rounded px-3 py-2 col-span-2"
                    />
                    <input
                      type="text"
                      placeholder="Label malgache"
                      value={newQuestion.label_mg || ''}
                      onChange={(e) => setNewQuestion({ ...newQuestion, label_mg: e.target.value })}
                      className="border rounded px-3 py-2 col-span-2"
                    />
                    {(newQuestion.type === 'select_one' || newQuestion.type === 'select_multiple') && (
                      <div className="col-span-2">
                        <label className="block text-sm mb-1">Choix (un par ligne: valeur,label)</label>
                        <textarea
                          placeholder="1,Masculin&#10;2,Féminin"
                          onChange={(e) => {
                            const lines = e.target.value.split('\n').filter(l => l.trim())
                            const choices = lines.map((line, i) => {
                              const [value, fr] = line.split(',')
                              return { value: value?.trim() || String(i + 1), fr: fr?.trim() || value?.trim() || '', mg: '' }
                            })
                            setNewQuestion({ ...newQuestion, choices })
                          }}
                          className="border rounded px-3 py-2 w-full"
                          rows={4}
                        />
                      </div>
                    )}
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={newQuestion.required || false}
                        onChange={(e) => setNewQuestion({ ...newQuestion, required: e.target.checked })}
                      />
                      <span>Obligatoire</span>
                    </label>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <button onClick={addQuestion} className="bg-green-600 text-white px-4 py-2 rounded">
                      Ajouter
                    </button>
                    <button onClick={() => setShowAddQuestion(false)} className="bg-gray-200 px-4 py-2 rounded">
                      Annuler
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
