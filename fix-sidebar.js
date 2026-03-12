const fs = require('fs');
const content = `import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Users, 
  Kanban, 
  CheckSquare, 
  BarChart3, 
  FolderOpen, 
  UserCog, 
  Settings,
  LogOut,
  GraduationCap,
  ChevronRight
} from 'lucide-react'
import { useAuthStore } from '@/store'
import { cn } from '@/lib/utils'

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: Users, label: 'Leads', path: '/leads' },
  { icon: Kanban, label: 'Pipeline', path: '/pipeline' },
  { icon: CheckSquare, label: 'Tasks', path: '/tasks' },
  { icon: BarChart3, label: 'Reports', path: '/reports' },
  { icon: FolderOpen, label: 'Documents', path: '/documents' },
  { icon: UserCog, label: 'Users', path: '/users', adminOnly: true },
]

const bottomNavItems = [
  { icon: Settings, label: 'Settings', path: '/settings' },
]

export default function Sidebar() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const filteredNavItems = navItems.filter(item => {
    if (item.adminOnly && user?.role !== 'admin') return false
    return true
  })

  return (
    <div className="fixed left-0 top-0 h-screen w-72 bg-gradient-to-b from-background to-background-light flex flex-col border-r border-border/30">
      <div className="p-6 border-b border-border/30">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary via-primary-light to-secondary flex items-center justify-center shadow-glow animate-float">
            <GraduationCap className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-white font-bold text-lg tracking-tight">Arlindo CRM</h1>
            <p className="text-text-muted text-xs">Campus Marketing</p>
          </div>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {filteredNavItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-4 py-3.5 rounded-xl text-text-muted hover:text-white hover:bg-surface-light transition-all duration-300 group relative overflow-hidden",
                isActive && "bg-gradient-to-r from-primary to-primary-light text-white shadow-glow"
              )
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full shadow-glow" />
                )}
                <item.icon className={cn(
                  "w-5 h-5 transition-transform duration-300",
                  isActive ? "text-white" : "text-text-muted group-hover:text-white group-hover:scale-110"
                )} />
                <span className={cn(
                  "font-medium transition-all duration-300",
                  isActive ? "text-white" : "text-text-muted group-hover:text-white group-hover:translate-x-1"
                )}>
                  {item.label}
                </span>
                {isActive && (
                  <ChevronRight className="w-4 h-4 ml-auto text-white/70 animate-slide-in" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-border/30 space-y-1">
        {bottomNavItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-4 py-3.5 rounded-xl text-text-muted hover:text-white hover:bg-surface-light transition-all duration-300 group",
                isActive && "bg-gradient-to-r from-primary to-primary-light text-white shadow-glow"
              )
            }
          >
            <item.icon className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}
        
        <div className="flex items-center gap-3 px-4 py-3.5 mt-2 bg-surface-light/50 rounded-xl">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-secondary to-accent flex items-center justify-center text-white font-medium shadow-lg">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-medium truncate">{user?.name || 'User'}</p>
            <p className="text-text-muted text-xs truncate capitalize">{user?.role || 'User'}</p>
          </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-text-muted hover:text-red-400 hover:bg-red-500/10 transition-all duration-300 w-full group"
        >
          <LogOut className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
          <span className="font-medium group-hover:translate-x-1 transition-transform duration-300">Logout</span>
        </button>
      </div>
  )
}
`;
fs.writeFileSync('client/src/components/layout/Sidebar.jsx', content);
console.log('Sidebar.jsx fixed successfully!');
