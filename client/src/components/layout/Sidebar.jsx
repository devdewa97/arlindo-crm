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

export default function Sidebar({ isMobileMenuOpen, toggleMobileMenu }) {
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
          <span className="font-bold text-slate-800 text-lg">Arlindo CRM</span>
        </div>
        <button 
          onClick={toggleMobileMenu}
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
          onClick={toggleMobileMenu}
            className={({ isActive }) =>
`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-blue-50 text-blue-700 shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800'
              }`
            }
          >
            <item.icon className="w-6 h-6 flex-shrink-0" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* PRD Button */}
      <div className="px-4 py-2">
        <button 
          onClick={() => { navigate('/prd'); toggleMobileMenu(); }}
className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-purple-700 bg-purple-50 hover:bg-purple-100 transition-colors"
        >
          <FileText className="w-6 h-6" />
          <span>PRD</span>
        </button>
      </div>

      {/* User Section */}
      <div className="p-4 border-t border-slate-100">
        <div className="flex items-center gap-3 px-4 py-3 mb-3 bg-slate-50 rounded-xl">
          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white font-bold text-lg">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-800 truncate">{user?.name || 'User'}</p>
            <p className="text-sm text-slate-500 capitalize">{user?.role || 'User'}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut className="w-6 h-6" />
          <span>Keluar</span>
        </button>
      </div>
    </>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="
        hidden lg:flex flex-col fixed left-0 top-0 h-screen bg-white z-40
        w-60
      ">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/20 z-40"
          onClick={toggleMobileMenu}
        />
      )}

      {/* Mobile Sidebar */}
      {isMobileMenuOpen && (
        <aside className="
          lg:hidden fixed left-0 top-0 h-screen bg-white z-50 w-80
          flex flex-col transition-transform duration-300 ease-in-out transform translate-x-0
        ">
          <SidebarContent />
        </aside>
      )}
    </>
  )
}

