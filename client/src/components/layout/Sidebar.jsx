import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Users, 
  Kanban, 
  CheckSquare, 
  BarChart3, 
  FileText, 
  Settings, 
  LogOut,
  GraduationCap,
  Menu,
  X,
  ChevronLeft,
  FileText as DocsIcon,
  UserCog
} from 'lucide-react'
import { useAuthStore } from '@/store'

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: UserCog, label: 'Users', path: '/users', roles: ['admin', 'masteradmin'] },
  { icon: Users, label: 'Leads', path: '/leads' },
  { icon: Kanban, label: 'Pipeline', path: '/pipeline' },
  { icon: CheckSquare, label: 'Tasks', path: '/tasks' },
  { icon: BarChart3, label: 'Reports', path: '/reports' },
  { icon: DocsIcon, label: 'Documents', path: '/documents' },
  { icon: Settings, label: 'Settings', path: '/settings', roles: ['admin', 'masteradmin'] },
]

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  // Filter menu items based on user role
  const filteredMenuItems = menuItems.filter(item => {
    if (!item.roles) return true
    return user && item.roles.includes(user.role)
  })

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="h-20 flex items-center justify-between px-5 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          {!isCollapsed && (
            <span className="font-bold text-slate-800 text-xl">Arlindo CRM</span>
          )}
        </div>
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden lg:flex items-center justify-center w-9 h-9 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <ChevronLeft className={`w-5 h-5 transition-transform ${isCollapsed ? 'rotate-180' : ''}`} />
        </button>
        <button 
          onClick={() => setIsMobileOpen(false)}
          className="lg:hidden flex items-center justify-center w-9 h-9 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Menu */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {filteredMenuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={() => setIsMobileOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3.5 rounded-xl text-base font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-blue-50 text-blue-700 shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800'
              } ${isCollapsed ? 'justify-center' : ''}`
            }
          >
            <item.icon className="w-6 h-6 flex-shrink-0" />
            {!isCollapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* PRD Button */}
      {!isCollapsed && (
        <div className="px-4 py-2">
          <button 
            onClick={() => { navigate('/prd'); setIsMobileOpen(false); }}
            className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-base font-medium text-purple-700 bg-purple-50 hover:bg-purple-100 transition-colors"
          >
            <FileText className="w-6 h-6" />
            <span>PRD</span>
          </button>
        </div>
      )}

      {/* User Section */}
      <div className="p-4 border-t border-slate-100">
        {!isCollapsed && (
          <div className="flex items-center gap-3 px-4 py-3 mb-3 bg-slate-50 rounded-xl">
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white font-bold text-lg">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-base font-semibold text-slate-800 truncate">{user?.name || 'User'}</p>
              <p className="text-sm text-slate-500 capitalize">{user?.role || 'User'}</p>
            </div>
          </div>
        )}
        <button
          onClick={handleLogout}
          className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-base font-medium text-red-600 hover:bg-red-50 transition-colors ${isCollapsed ? 'justify-center' : ''}`}
        >
          <LogOut className="w-6 h-6" />
          {!isCollapsed && <span>Keluar</span>}
        </button>
      </div>
    </>
  )

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 flex items-center justify-center w-12 h-12 bg-white rounded-xl shadow-md border border-slate-200 text-slate-600"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Desktop Sidebar */}
      <aside className={`
        hidden lg:flex flex-col fixed left-0 top-0 h-screen bg-white border-r border-slate-200 z-40
        transition-all duration-300 ${isCollapsed ? 'w-24' : 'w-72'}
      `}>
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isMobileOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/20 z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside className={`
        lg:hidden fixed left-0 top-0 h-screen bg-white border-r border-slate-200 z-50
        transition-transform duration-300 ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
        w-80 flex flex-col
      `}>
        <SidebarContent />
      </aside>
    </>
  )
}

