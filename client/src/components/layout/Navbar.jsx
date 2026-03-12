import React, { useState } from 'react'
import { Search, Bell, Plus, User, Settings, LogOut, GraduationCap } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store'

export default function Navbar({ onNewLead }) {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const [showDropdown, setShowDropdown] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="fixed top-0 right-0 left-0 lg:left-64 h-16 bg-white border-b border-slate-200 z-30 px-4 lg:px-6">
      <div className="h-full flex items-center justify-between gap-4">
        {/* Search */}
        <div className="flex-1 max-w-md hidden md:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Cari leads, tasks, atau dokumen..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 lg:gap-3">
          {/* Notifications */}
          <button className="relative flex items-center justify-center w-9 h-9 rounded-xl text-slate-500 hover:bg-slate-100 transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 transition-colors"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white font-semibold text-sm">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <span className="hidden lg:block text-sm font-medium text-slate-700">
                {user?.name || 'User'}
              </span>
            </button>

            {/* Dropdown */}
            {showDropdown && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setShowDropdown(false)}
                />
                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-200 py-2 z-50 animate-fade-in-up">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-sm font-medium text-slate-800">{user?.name || 'User'}</p>
                    <p className="text-xs text-slate-500">{user?.email || 'user@example.com'}</p>
                  </div>
                  <button
                    onClick={() => {
                      setShowDropdown(false)
                      navigate('/settings')
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 transition-colors"
                  >
                    <Settings className="w-4 h-4" />
                    Pengaturan
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Keluar
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

