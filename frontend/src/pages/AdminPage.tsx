import { useEffect, useState } from 'react'
import api from '../api/client'

export default function AdminPage() {
  const [users, setUsers] = useState<any[]>([])
  const [showCreate, setShowCreate] = useState(false)
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    role: 'viewer',
  })

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    const res = await api.get('/auth/users/')
    setUsers(res.data.results || res.data)
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    await api.post('/auth/users/', form)
    setForm({ username: '', email: '', password: '', first_name: '', last_name: '', role: 'viewer' })
    setShowCreate(false)
    loadUsers()
  }

  const ROLE_COLORS: Record<string, string> = {
    admin: 'bg-red-100 text-red-700',
    researcher: 'bg-blue-100 text-blue-700',
    enumerator: 'bg-green-100 text-green-700',
    viewer: 'bg-gray-100 text-gray-700',
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Administration</h1>
        <button
          onClick={() => setShowCreate(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          + Nouvel utilisateur
        </button>
      </div>

      {showCreate && (
        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Créer un utilisateur</h2>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Prénom"
                value={form.first_name}
                onChange={(e) => setForm({ ...form, first_name: e.target.value })}
                className="border rounded-lg px-3 py-2"
              />
              <input
                type="text"
                placeholder="Nom"
                value={form.last_name}
                onChange={(e) => setForm({ ...form, last_name: e.target.value })}
                className="border rounded-lg px-3 py-2"
              />
            </div>
            <input
              type="text"
              placeholder="Nom d'utilisateur"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              className="w-full border rounded-lg px-3 py-2"
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full border rounded-lg px-3 py-2"
              required
            />
            <input
              type="password"
              placeholder="Mot de passe"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full border rounded-lg px-3 py-2"
              required
            />
            <select
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              className="w-full border rounded-lg px-3 py-2"
            >
              <option value="viewer">Consultation</option>
              <option value="enumerator">Enquêteur</option>
              <option value="researcher">Chercheur</option>
              <option value="admin">Administrateur</option>
            </select>
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

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="text-left py-3 px-4">Utilisateur</th>
              <th className="text-left py-3 px-4">Email</th>
              <th className="text-left py-3 px-4">Rôle</th>
              <th className="text-left py-3 px-4">Actif</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-t hover:bg-gray-50">
                <td className="py-3 px-4">
                  <div className="font-medium">{u.username}</div>
                  <div className="text-sm text-gray-500">{u.first_name} {u.last_name}</div>
                </td>
                <td className="py-3 px-4">{u.email}</td>
                <td className="py-3 px-4">
                  <span className={`text-xs px-2 py-1 rounded-full ${ROLE_COLORS[u.role]}`}>
                    {u.role}
                  </span>
                </td>
                <td className="py-3 px-4">
                  {u.is_active ? '✅' : '❌'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
