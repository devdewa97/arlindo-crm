import React, { useState } from 'react'
import { Menu, Settings, LogOut } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store'

export default function Navbar({ toggleMobileMenu }) {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const [showDropdown, setShowDropdown] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="fixed top-0 right-0 left-0 lg:left-60 h-16 lg:h-20 bg-white border-b border-slate-200 shadow-sm z-40 px-4 sm:px-6 lg:px-8">
      <div className="h-full flex items-center justify-between gap-4 px-2 lg:px-0">
        {/* Mobile Hamburger */}
        <button
          className="lg:hidden flex items-center justify-center w-12 h-12 bg-white rounded-xl text-slate-600 hover:bg-slate-50 transition-all"
          onClick={toggleMobileMenu}
        >
          <Menu className="w-6 h-6" />
        </button>
        
        {/* Right: Notifications & User */}
        <div className="flex items-center gap-2 lg:gap-4 flex-shrink-0">
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-2 p-2 rounded-xl hover:bg-slate-100/50 transition-all hover:scale-105 shadow-sm hover:shadow-md"
            >
              <div className="w-9 h-9 lg:w-10 lg:h-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white font-semibold text-xs lg:text-sm shadow-sm">
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <span className="hidden lg:block text-xs lg:text-sm font-medium text-slate-900 truncate max-w-[120px]">
                {user?.name || 'User'}
              </span>
            </button>

            {/* Dropdown */}
            {showDropdown && (
              <>
                <div 
                  className="fixed inset-0 z-50" 
                  onClick={() => setShowDropdown(false)}
                />
                <div className="absolute right-0 top-full mt-2 w-64 bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in zoom-in duration-200">
                  <div className="px-4 py-3 border-b border-slate-100">
                    <p className="text-sm font-semibold text-slate-900 truncate">{user?.name || 'User'}</p>
                    <p className="text-xs text-slate-500 truncate">{user?.email || 'user@example.com'}</p>
                  </div>
                  <button
                    onClick={() => {
                      setShowDropdown(false)
                      navigate('/settings')
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-700 hover:bg-slate-50/50 transition-all"
                  >
                    <Settings className="w-4 h-4 flex-shrink-0" />
                    Pengaturan
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50/50 transition-all"
                  >
                    <LogOut className="w-4 h-4 flex-shrink-0" />
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
