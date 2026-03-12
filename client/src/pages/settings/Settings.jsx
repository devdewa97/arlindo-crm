import React, { useState } from 'react'
import { Save, User, CheckCircle2, Lock, Eye, EyeOff } from 'lucide-react'
import { useAuthStore } from '@/store'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { API_URL } from '@/lib/utils'

export default function Settings() {
  const { user, updateUser } = useAuthStore()
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  
  // Profile state
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: ''
  })
  
  // Password state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [passwordError, setPasswordError] = useState('')
  const [passwordSuccess, setPasswordSuccess] = useState(false)

  // Set initial profile data from user
  React.useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || ''
      })
    }
  }, [user])

  const handleProfileSave = async () => {
    setSaving(true)
    try {
      const token = useAuthStore.getState().token
      const res = await fetch(`${API_URL}/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(profileData)
      })
      
      if (res.ok) {
        updateUser(profileData)
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
      } else {
        const data = await res.json()
        alert(data.error || 'Gagal menyimpan profil')
      }
    } catch (err) {
      alert('Error menyimpan profil')
    }
    setSaving(false)
  }

  const handlePasswordChange = async () => {
    setPasswordError('')
    setPasswordSuccess(false)
    
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      setPasswordError('Semua field password harus diisi')
      return
    }
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('Password baru dan konfirmasi password tidak cocok')
      return
    }
    
    if (passwordData.newPassword.length < 6) {
      setPasswordError('Password minimal 6 karakter')
      return
    }
    
    setSaving(true)
    try {
      const token = useAuthStore.getState().token
      const res = await fetch(`${API_URL}/auth/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      })
      
      const data = await res.json()
      
      if (res.ok) {
        setPasswordSuccess(true)
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        })
        setTimeout(() => setPasswordSuccess(false), 3000)
      } else {
        setPasswordError(data.error || 'Gagal mengubah password')
      }
    } catch (err) {
      setPasswordError('Error mengubah password')
    }
    setSaving(false)
  }

  const handleSave = () => {
    handleProfileSave()
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Settings</h1>
        <p className="text-slate-500 mt-1">Kelola pengaturan akun dan preferensi</p>
      </div>

      {/* Profile Tab */}
      <div className="space-y-6 animate-fade-in">
        <Card>
          <div className="p-6 border-b border-slate-200">
            <h2 className="text-xl font-bold text-slate-800">Informasi Profile</h2>
            <p className="text-slate-500 mt-1">Update informasi personal Anda</p>
          </div>
          <div className="p-6 space-y-6">
            {/* Avatar Section - User Image */}
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-3xl font-bold">
                  {user?.name?.charAt(0) || 'U'}
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-800">{user?.name || 'User'}</h3>
                <p className="text-slate-500 capitalize">{user?.role || 'User'}</p>
                <p className="text-sm text-blue-600 mt-1">Profil Anda</p>
              </div>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label className="text-base font-medium text-slate-700">Nama Lengkap</Label>
                <Input 
                  value={profileData.name} 
                  onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                  placeholder="Nama lengkap Anda"
                  className="h-12 text-base"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-base font-medium text-slate-700">Username</Label>
                <Input value={user?.username || ''} disabled className="h-12 text-base bg-slate-50" />
              </div>
              <div className="space-y-2">
                <Label className="text-base font-medium text-slate-700">Email</Label>
                <Input 
                  type="email" 
                  value={profileData.email} 
                  onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                  placeholder="email@anda.com"
                  className="h-12 text-base"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-base font-medium text-slate-700">No. Telepon</Label>
                <Input 
                  value={profileData.phone} 
                  onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                  placeholder="+62xxx"
                  className="h-12 text-base"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-base font-medium text-slate-700">Role</Label>
                <Input value={user?.role || ''} disabled className="h-12 text-base bg-slate-50 capitalize" />
              </div>
            </div>
          </div>
        </Card>

        {/* Password Change */}
        <Card>
          <div className="p-6 border-b border-slate-200">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <Lock className="w-5 h-5" />
              Ubah Password
            </h2>
            <p className="text-slate-500 mt-1">Ganti password akun Anda</p>
          </div>
          <div className="p-6 space-y-4">
            <div className="space-y-2">
              <Label className="text-base font-medium text-slate-700">Password Saat Ini</Label>
              <div className="relative">
                <Input 
                  type={showPassword ? "text" : "password"}
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                  placeholder="Masukkan password saat ini"
                  className="h-12 text-base pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-base font-medium text-slate-700">Password Baru</Label>
              <Input 
                type={showPassword ? "text" : "password"}
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                placeholder="Masukkan password baru"
                className="h-12 text-base"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-base font-medium text-slate-700">Konfirmasi Password Baru</Label>
              <Input 
                type={showPassword ? "text" : "password"}
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                placeholder="Konfirmasi password baru"
                className="h-12 text-base"
              />
            </div>
            
            {passwordError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                {passwordError}
              </div>
            )}
            
            {passwordSuccess && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-600 text-sm flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                Password berhasil diubah!
              </div>
            )}
            
            <Button 
              onClick={handlePasswordChange}
              disabled={saving}
              variant="secondary"
              className="h-11"
            >
              {saving ? 'Menyimpan...' : 'Ubah Password'}
            </Button>
          </div>
        </Card>
      </div>

      {/* Save Button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {saved && (
            <span className="text-sm text-green-600 flex items-center gap-1 font-medium">
              <CheckCircle2 className="w-5 h-5" />
              Berhasil disimpan!
            </span>
          )}
        </div>
        <Button 
          onClick={handleSave}
          disabled={saving}
          className="bg-blue-600 hover:bg-blue-700 h-12 px-6 text-base font-semibold"
        >
          {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
        </Button>
      </div>
    </div>
  )
}

