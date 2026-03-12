import React, { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store'
import Sidebar from './components/layout/Sidebar'
import Navbar from './components/layout/Navbar'

// Pages
import Login from './pages/auth/Login'
import Dashboard from './pages/dashboard/Dashboard'
import Leads from './pages/leads/Leads'
import LeadDetail from './pages/leads/LeadDetail'
import Pipeline from './pages/pipeline/Pipeline'
import Tasks from './pages/tasks/Tasks'
import Reports from './pages/reports/Reports'
import Documents from './pages/documents/Documents'
import Users from './pages/users/Users'
import Settings from './pages/settings/Settings'
import PRD from './pages/prd/PRD'

// Protected Route Component
function ProtectedRoute({ children }) {
  const { token } = useAuthStore()
  
  if (!token) {
    return <Navigate to="/login" replace />
  }
  
  return children
}

// Footer Component
function Footer() {
  return (
    <footer className="py-4 px-6 border-t border-slate-200 bg-white">
      <div className="flex items-center justify-center">
        <p className="text-sm text-slate-500">
© 2026 Gusti Dewa Anggading | Arlindo Digital CRM V2.0
        </p>
      </div>
    </footer>
  )
}

// Layout Component
function Layout() {
  const [showNewLeadModal, setShowNewLeadModal] = useState(false)

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content Area */}
      <div className="lg:pl-72">
        {/* Navbar */}
        <Navbar onNewLead={() => setShowNewLeadModal(true)} />
        
        {/* Page Content */}
        <main className="pt-16 min-h-[calc(100vh-4rem)]">
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/leads" element={<Leads onNewLead={() => setShowNewLeadModal(true)} />} />
            <Route path="/leads/:id" element={<LeadDetail />} />
            <Route path="/pipeline" element={<Pipeline />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/documents" element={<Documents />} />
            <Route path="/users" element={<Users />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/prd" element={<PRD />} />
          </Routes>
        </main>
        
        {/* Footer */}
        <Footer />
      </div>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        
        {/* Protected Routes */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        />
        
        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

