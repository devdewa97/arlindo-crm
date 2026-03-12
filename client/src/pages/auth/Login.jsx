import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { GraduationCap, Eye, EyeOff, Loader2, Users, MessageSquare, BarChart3, FileText, Bell, CheckCircle, TrendingUp } from 'lucide-react'
import { useAuthStore } from '@/store'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const { login, isLoading, error } = useAuthStore()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    const success = await login(username, password)
    if (success) {
      navigate('/dashboard')
    }
  }

  const features = [
    { icon: Users, title: 'Lead Management', desc: 'Kelola data calon mahasiswa' },
    { icon: MessageSquare, title: 'WhatsApp Integration', desc: 'Kirim pesan otomatis ke WA' },
    { icon: BarChart3, title: 'Analytics & Reports', desc: 'Laporan lengkap & akurat' },
    { icon: FileText, title: 'Document Center', desc: 'Simpan dokumen terpusat' },
    { icon: Bell, title: 'Auto Reminder', desc: 'Pengingat follow-up otomatis' },
    { icon: TrendingUp, title: 'Pipeline Tracking', desc: 'Pantau konversi sales' },
  ]

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-[55%] relative overflow-hidden">
        {/* Animated Gradient Background */}
        <div className="absolute inset-0 animated-gradient"></div>
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/90 via-indigo-600/80 to-sky-500/90"></div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-12 text-white">
          {/* Logo */}
          <div className="flex items-center gap-4 flex-shrink-0">
            <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <GraduationCap className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Arlindo CRM</h1>
              <p className="text-sm text-white/70">Campus Marketing</p>
            </div>
          </div>

          {/* Main Content */}
          <div className="py-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm mb-6">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
              <span>Software CRM #1 untuk Campus</span>
            </div>

            {/* Main Headline - Montserrat Black */}
            <div className="mb-8">
              <h2 className="text-6xl font-black mb-4 leading-tight" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                Kelola Lead, Follow-Up Otomatis,<br/>
                <span className="text-white drop-shadow-lg">dan Tingkatkan Konversi Mahasiswa</span>
              </h2>
              <p className="text-xl text-white/90 leading-relaxed max-w-lg">
                Tingkatkan efektivitas tim marketing hingga 10x dengan sistem CRM yang dirancang khusus untuk pengelolaan lead calon mahasiswa, otomatisasi komunikasi WhatsApp, dan analitik konversi.
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3 p-4 bg-white/10 backdrop-blur-sm rounded-xl hover:bg-white/20 transition-all cursor-pointer">
                  <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">{feature.title}</p>
                    <p className="text-xs text-white/70">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="flex-shrink-0">
            <p className="text-sm text-white/60">© 2026 Arlindo CRM • Created by Gusti Dewa Anggading</p>
            <p className="text-xs text-white/40 mt-1">Version V2.0 • Support: mail.sidewa@gmail.com</p>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-[45%] flex items-center justify-center p-8 bg-slate-50">
        <div className="w-full max-w-md animate-fade-in-up">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg">
              <GraduationCap className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">Arlindo CRM</h1>
              <p className="text-sm text-slate-500">Campus Marketing</p>
            </div>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-2xl shadow-card-md p-8 border border-slate-100">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Selamat Datang! 👋</h2>
              <p className="text-slate-500">Masuk ke dashboard CRM Anda</p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Username */}
              <div className="space-y-2">
                <Label htmlFor="username" className="text-slate-700 font-medium">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Masukkan username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="h-12 text-base"
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-700 font-medium">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Masukkan password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-12 pr-10 text-base"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-slate-600 font-medium">Ingat saya</span>
                </label>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-base font-bold"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Memuat...
                  </>
                ) : (
                  '🚀 MASUK SEKARANG'
                )}
              </Button>
            </form>
          </div>

          {/* Email Contact Below */}
          <div className="text-center mt-8">
            <p className="text-sm text-slate-500 mb-3">Butuh bantuan?</p>
            <a 
              href="mailto:mail.sidewa@gmail.com"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
            >
              Hubungi Kami
            </a>
          </div>

          {/* Footer */}
          <p className="text-center text-sm text-slate-400 mt-6">
© 2026 Gusti Dewa Anggading | V2.0
          </p>
        </div>
      </div>
    </div>
  )
}

