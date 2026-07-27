import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store/auth'
import Layout from './components/Layout'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import EtudesPage from './pages/EtudesPage'
import EtudeDetailPage from './pages/EtudeDetailPage'
import FormBuilderPage from './pages/FormBuilderPage'
import FormPage from './pages/FormPage'
import PatientsPage from './pages/PatientsPage'
import ExportPage from './pages/ExportPage'
import AdminPage from './pages/AdminPage'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { token } = useAuthStore()
  if (!token) return <Navigate to="/login" />
  return <Layout>{children}</Layout>
}

export default function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Protected routes */}
      <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
      <Route path="/etudes" element={<ProtectedRoute><EtudesPage /></ProtectedRoute>} />
      <Route path="/etudes/:id" element={<ProtectedRoute><EtudeDetailPage /></ProtectedRoute>} />
      <Route path="/etudes/:id/builder" element={<ProtectedRoute><FormBuilderPage /></ProtectedRoute>} />
      <Route path="/etudes/:etudeId/fill/:patientId/:periode" element={<ProtectedRoute><FormPage /></ProtectedRoute>} />
      <Route path="/patients" element={<ProtectedRoute><PatientsPage /></ProtectedRoute>} />
      <Route path="/export" element={<ProtectedRoute><ExportPage /></ProtectedRoute>} />
      <Route path="/admin" element={<ProtectedRoute><AdminPage /></ProtectedRoute>} />
    </Routes>
  )
}
