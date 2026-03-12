import React, { useState } from 'react'
import { Copy, Check, FileText, Users, MessageSquare, BarChart3, FileCheck, Bell, Kanban, Mail, Phone, Calendar, TrendingUp, Shield, Database, Zap, Globe, Lock, RefreshCw, Download, Plus, Search, Filter, ChevronRight, Star, Target, Award, Rocket } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Label } from '@/components/ui/Label'

export default function PRD() {
  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState('design')

  const prdText = `📋 PRODUCT REQUIREMENT DOCUMENT (PRD)
=====================================

🎓 ARLINDO DIGITAL CRM - STIE ARLINDO
Versi: V2.0 (Versi Terbaru)
Dibuat oleh: Gusti Dewa Anggading
Email: mail.sidewa@gmail.com
=====================================

📌 DESKRIPSI PRODUK
Arlindo Digital CRM V2.0 adalah sistem CRM (Customer Relationship Management) 
khusus untuk pemasaran kampus STIE ARLINDO. Sistem ini dirancang untuk membantu 
tim marketing dalam mengelola database calon mahasiswa, melacak follow-up, 
dan meningkatkan konversi enrollment secara efektif dan terstruktur.

Sistem ini merupakan pengembangan dari versi sebelumnya dengan fitur-fitur 
yang lebih lengkap dan performa yang lebih optimal.

=====================================

🎯 FITUR UTAMA V2.0

1. DASHBOARD
   - Ringkasan statistik leads (total, baru, terdaftar, hot leads)
   - Grafik distribusi status leads (Bar Chart)
   - Grafik sumber leads (Pie Chart)
   - Daftar follow-up yang akan datang
   - Aktivitas terbaru sistem
   - Staff Performance Overview (untuk admin)
   - Filter periode waktu (7, 30, 90 hari)

2. LEADS MANAGEMENT
   - Tambah, edit, hapus data leads
   - Filter berdasarkan status, sumber, jenis pendaftaran, kelas
   - Pencarian data leads (nama, email, telepon)
   - Bulk delete untuk multiple leads
   - Quick status change (dropdown inline)
   - Tombol WhatsApp dengan pesan otomatis
   - Ekspor data leads ke Excel dan PDF
   - Kolom tambahan: Jenis Pendaftaran, Kelas

3. PIPELINE (Kanban Board)
   - Visualisasi pipeline berdasarkan status (6 kolom)
   - Drag & drop leads antar status
   - Tracking konversi dari lead ke enrollment
   - Kolom: Baru, Dihubungi, Follow Up, Minat, Terdaftar, Daftar Ulang

4. TASK MANAGEMENT
   - Buat dan kelola tugas (Kanban Board)
   - Prioritas tugas (low, medium, high)
   - Status tugas (To Do, Sedang Dikerjakan, Selesai)
   - Due date tugas
   - Drag & drop antar kolom

5. REPORTS & ANALYTICS
   - Statistik lengkap leads
   - Conversion rate analysis
   - Lead by status, source, program
   - Visualisasi data dengan grafik (Bar, Pie)
   - Ekspor laporan ke PDF dan Excel

6. DOCUMENTS
   - Upload dokumen (brosur, panduan, dll)
   - Kategori dokumen
   - Drive link integration
   - Manajemen dokumen terpusat

7. SETTINGS
   - Profile management
   - Notification settings
   - Security settings

8. USER MANAGEMENT (Admin)
   - Tambah user baru
   - Edit informasi user
   - Hapus user
   - Role management (admin, masteradmin, user)

9. AUTHENTICATION
   - Login system dengan JWT
   - Password hashing dengan bcrypt
   - Session management
   - Demo account: Dewa / Dewa123

=====================================

🔄 FLOW DAN CARA KERJA

1. PENAMBAHAN LEADS BARU
   - Marketing menambahkan data lead melalui menu Leads
   - Data yang diperlukan: Nama, No. WA, Email, Sekolah, Program
   - Lead akan muncul di dalam sistem dengan status "Baru"

2. FOLLOW-UP PROSES
   - Sistem menampilkan jadwal follow-up di dashboard
   - Tim marketing menghubungi lead melalui WhatsApp
   - Status lead diupdate (Baru → Dihubungi → Follow Up → Minat → Terdaftar → Daftar Ulang)

3. WHATSAPP INTEGRATION
   - Klik tombol WhatsApp di tabel leads atau pipeline
   - Otomatis membuka WhatsApp dengan pesan sapaan
   - Pesan: "Halo [Nama], Terima kasih sudah menghubungi STIE ARLINDO! 👋"

4. PIPELINE MANAGEMENT
   - Leads bergerak melalui pipeline dengan drag & drop
   - Dari Baru → Dihubungi → Follow Up → Minat → Terdaftar → Daftar Ulang
   - Tracking konversi terlihat di dashboard

5. TASK MANAGEMENT
   - Buat task baru dengan prioritas dan deadline
   - Pindahkan task antar kolom dengan drag & drop
   - Update status task sesuai progres

6. REPORTING
   - Lihat laporan lengkap di menu Reports
   - Analisis sumber leads terbaik
   - Tracking conversion rate
   - Ekspor laporan ke PDF/Excel

=====================================

📊 USER ROLES

1. MASTER ADMIN
   - Akses penuh ke semua fitur
   - Kelola semua user termasuk admin
   - Kelola settings sistem
   - View all reports dan staff performance

2. ADMIN
   - Akses penuh ke semua fitur
   - Kelola user
   - Kelola settings sistem
   - View all reports

3. USER (Marketing)
   - Kelola leads
   - Kelola tasks
   - View dashboard dan reports
   - Upload documents

=====================================

🔧 TEKNOLOGI YANG DIGUNAKAN

FRONTEND:
- React 18 + Vite
- Tailwind CSS
- Shadcn UI Components
- Recharts (Charts)
- Lucide React (Icons)
- Hello Pangea DnD (Drag & Drop)
- React Router DOM
- Zustand (State Management)

BACKEND:
- Node.js
- Express.js
- SQLite (better-sqlite3)
- JWT (jsonwebtoken)
- bcryptjs
- Multer (File Upload)

DATABASE:
- SQLite

=====================================

📱 FITUR KHUSUS V2.0

1. WhatsApp Integration
   - Pesan otomatis dengan nama lead
   - Langsung terbuka di WhatsApp Web/App

2. Auto Reminder
   - Pengingat follow-up otomatis
   - Tampilan di dashboard

3. Responsive Design
   - Dapat diakses di desktop dan mobile

4. Dark/Light Theme Ready
   - Tampilan yang nyaman untuk mata

5. Drag & Drop
   - Pipeline management dengan drag & drop
   - Task management dengan drag & drop

6. Export Data
   - Export leads ke Excel dan PDF
   - Export laporan ke Excel dan PDF

7. Staff Performance Tracking
   - Overview performa staff marketing
   - Leads by team visualization

=====================================

🚀 CARA MENJALANKAN APLIKASI

1. Install dependencies:
   cd client && npm install
   cd ../server && npm install

2. Jalankan server:
   cd server && node server.js

3. Jalankan client:
   cd client && npm run dev

4. Buka browser:
   http://localhost:5173

5. Login dengan akun demo:
   Username: Dewa
   Password: Dewa123

=====================================

📞 KONTAK PENGEMBANG

Jika ada pertanyaan atau ingin mengembangkan fitur baru,
silakan hubungi:

Gusti Dewa Anggading
Email: mail.sidewa@gmail.com

=====================================

© 2026 Arlindo Digital CRM - Digilabs Kreasi Nusantara
Version: V2.0
Last Updated: 2026

=====================================`;

  const handleCopy = () => {
    navigator.clipboard.writeText(prdText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 text-white">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="px-3 py-1 bg-blue-500/20 text-blue-300 text-sm font-medium rounded-full">V2.0</span>
              <span className="px-3 py-1 bg-green-500/20 text-green-300 text-sm font-medium rounded-full flex items-center gap-1">
                <Zap className="w-3 h-3" /> Latest Version
              </span>
            </div>
            <h1 className="text-4xl font-bold mb-2">Product Requirement Document</h1>
            <p className="text-slate-300 text-lg">Arlindo Digital CRM V2.0 - Campus Marketing System</p>
          </div>
          <div className="hidden md:block">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Rocket className="w-12 h-12 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Creator Info */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-6 bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-100">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
              G
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-800">Dibuat oleh Gusti Dewa Anggading</h3>
              <p className="text-slate-600">Arlindo Digital CRM Version V2.0</p>
              <p className="text-blue-600 font-medium">Email: mail.sidewa@gmail.com</p>
            </div>
          </div>
        </Card>
        <Card className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-green-100">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg">
              <Target className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-800">Tujuan Sistem</h3>
              <p className="text-slate-600">Mengelola database calon mahasiswa</p>
              <p className="text-green-600 font-medium">Meningkatkan konversi enrollment</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Tab Buttons */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setActiveTab('design')}
          className={`px-6 py-3 rounded-xl font-medium transition-all ${
            activeTab === 'design' 
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' 
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <FileText className="w-5 h-5 inline-block mr-2" />
          Desain PRD
        </button>
        <button
          onClick={() => setActiveTab('text')}
          className={`px-6 py-3 rounded-xl font-medium transition-all ${
            activeTab === 'text' 
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' 
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <Copy className="w-5 h-5 inline-block mr-2" />
          Teks PRD
        </button>
      </div>

      {/* Design Version */}
      {activeTab === 'design' && (
        <div className="space-y-6 animate-fade-in">
          {/* Deskripsi Produk */}
          <Card className="p-6 border-l-4 border-l-blue-500">
            <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-3">
              <span className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                📌
              </span>
              Deskripsi Produk
            </h2>
            <p className="text-slate-600 leading-relaxed text-lg">
              <strong>Arlindo Digital CRM V2.0</strong> adalah sistem CRM (Customer Relationship Management) 
              khusus untuk pemasaran kampus <strong>STIE ARLINDO</strong>. Sistem ini merupakan pengembangan 
              dari versi sebelumnya dengan fitur-fitur yang lebih lengkap dan performa yang lebih optimal.
              Dirancang untuk membantu tim marketing dalam mengelola database calon mahasiswa, melacak follow-up, 
              dan meningkatkan konversi enrollment secara efektif dan terstruktur.
            </p>
          </Card>

          {/* Fitur Utama */}
          <Card className="p-6 border-l-4 border-l-green-500">
            <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
              <span className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                🎯
              </span>
              Fitur Utama V2.0
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { icon: BarChart3, title: 'Dashboard', desc: 'Ringkasan statistik & grafik real-time dengan Staff Performance Overview', color: 'bg-blue-100 text-blue-600' },
                { icon: Users, title: 'Leads Management', desc: 'Kelola data calon mahasiswa lengkap dengan filter, search, bulk actions, dan export', color: 'bg-purple-100 text-purple-600' },
                { icon: Kanban, title: 'Pipeline', desc: 'Visualisasi sales pipeline dengan drag & drop antar 6 tahapan', color: 'bg-indigo-100 text-indigo-600' },
                { icon: Check, title: 'Task Management', desc: 'Kelola tugas tim marketing dengan Kanban board dan prioritas', color: 'bg-orange-100 text-orange-600' },
                { icon: TrendingUp, title: 'Reports', desc: 'Laporan & analytics lengkap dengan visualisasi dan export', color: 'bg-green-100 text-green-600' },
                { icon: FileCheck, title: 'Documents', desc: 'Pusat dokumen kampus dengan upload dan Google Drive integration', color: 'bg-yellow-100 text-yellow-600' },
                { icon: Bell, title: 'Notifications', desc: 'Pengingat otomatis untuk follow-up dan task deadline', color: 'bg-red-100 text-red-600' },
                { icon: MessageSquare, title: 'WhatsApp Integration', desc: 'Kirim pesan WA otomatis dengan satu klik', color: 'bg-green-100 text-green-600' },
                { icon: Shield, title: 'User Management', desc: 'Kelola user dengan role (Master Admin, Admin, User)', color: 'bg-slate-100 text-slate-600' },
                { icon: Lock, title: 'Authentication', desc: 'Sistem login aman dengan JWT dan password encryption', color: 'bg-cyan-100 text-cyan-600' },
                { icon: Download, title: 'Export Data', desc: 'Export data ke Excel dan PDF dengan format profesional', color: 'bg-teal-100 text-teal-600' },
                { icon: Zap, title: 'Responsive Design', desc: 'Tampilan optimal di desktop dan mobile device', color: 'bg-pink-100 text-pink-600' },
              ].map((feature, index) => (
                <div key={index} className="flex items-start gap-4 p-5 bg-slate-50 rounded-xl hover:shadow-lg transition-shadow">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${feature.color}`}>
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-lg">{feature.title}</h3>
                    <p className="text-sm text-slate-500 mt-1">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Flow Cara Kerja */}
          <Card className="p-6 border-l-4 border-l-yellow-500">
            <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
              <span className="w-10 h-10 rounded-xl bg-yellow-100 flex items-center justify-center">
                🔄
              </span>
              Flow & Cara Kerja
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                { step: '1', title: 'Penambahan Leads Baru', desc: 'Marketing menambahkan data lead melalui menu Leads dengan data lengkap (Nama, WA, Email, Sekolah, Program, Jenis Daftar, Kelas)', icon: Plus },
                { step: '2', title: 'Follow-Up Proses', desc: 'Sistem menampilkan jadwal follow-up di dashboard, tim marketing menghubungi lead', icon: Phone },
                { step: '3', title: 'WhatsApp Integration', desc: 'Klik tombol WhatsApp untuk pesan otomatis yang langsung membuka WA Web/App', icon: MessageSquare },
                { step: '4', title: 'Pipeline Management', desc: 'Leads bergerak melalui pipeline (Baru → Dihubungi → Follow Up → Minat → Terdaftar → Daftar Ulang)', icon: Kanban },
                { step: '5', title: 'Task Management', desc: 'Buat dan kelola tugas dengan drag & drop antar kolom (To Do → In Progress → Done)', icon: Check },
                { step: '6', title: 'Reporting', desc: 'Lihat laporan lengkap dengan visualisasi dan export ke PDF/Excel', icon: TrendingUp },
              ].map((item, index) => (
                <div key={index} className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl">
                  <div className="w-12 h-12 rounded-xl bg-yellow-100 flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="w-6 h-6 rounded-full bg-yellow-500 text-white flex items-center justify-center text-sm font-bold">
                        {item.step}
                      </span>
                      <h3 className="font-bold text-slate-800">{item.title}</h3>
                    </div>
                    <p className="text-sm text-slate-500 ml-8">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* User Roles */}
          <Card className="p-6 border-l-4 border-l-purple-500">
            <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
              <span className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                👥
              </span>
              User Roles & Permissions
            </h2>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-5 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200">
                <div className="w-12 h-12 rounded-xl bg-purple-500 flex items-center justify-center mb-4">
                  <Star className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-purple-700 text-lg">Master Admin</h3>
                <ul className="mt-3 text-sm text-purple-600 space-y-2">
                  <li className="flex items-center gap-2"><ChevronRight className="w-4 h-4" />Akses penuh ke semua fitur</li>
                  <li className="flex items-center gap-2"><ChevronRight className="w-4 h-4" />Kelola semua user termasuk admin</li>
                  <li className="flex items-center gap-2"><ChevronRight className="w-4 h-4" />Kelola settings sistem</li>
                  <li className="flex items-center gap-2"><ChevronRight className="w-4 h-4" />View all reports</li>
                  <li className="flex items-center gap-2"><ChevronRight className="w-4 h-4" />Staff performance tracking</li>
                </ul>
              </div>
              <div className="p-5 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                <div className="w-12 h-12 rounded-xl bg-blue-500 flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-blue-700 text-lg">Admin</h3>
                <ul className="mt-3 text-sm text-blue-600 space-y-2">
                  <li className="flex items-center gap-2"><ChevronRight className="w-4 h-4" />Akses penuh ke semua fitur</li>
                  <li className="flex items-center gap-2"><ChevronRight className="w-4 h-4" />Kelola user</li>
                  <li className="flex items-center gap-2"><ChevronRight className="w-4 h-4" />Kelola settings sistem</li>
                  <li className="flex items-center gap-2"><ChevronRight className="w-4 h-4" />View all reports</li>
                  <li className="flex items-center gap-2"><ChevronRight className="w-4 h-4" />Staff performance tracking</li>
                </ul>
              </div>
              <div className="p-5 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200">
                <div className="w-12 h-12 rounded-xl bg-green-500 flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-green-700 text-lg">User (Marketing)</h3>
                <ul className="mt-3 text-sm text-green-600 space-y-2">
                  <li className="flex items-center gap-2"><ChevronRight className="w-4 h-4" />Kelola leads sendiri</li>
                  <li className="flex items-center gap-2"><ChevronRight className="w-4 h-4" />Kelola tasks</li>
                  <li className="flex items-center gap-2"><ChevronRight className="w-4 h-4" />View dashboard</li>
                  <li className="flex items-center gap-2"><ChevronRight className="w-4 h-4" />View reports</li>
                  <li className="flex items-center gap-2"><ChevronRight className="w-4 h-4" />Upload documents</li>
                </ul>
              </div>
            </div>
          </Card>

          {/* Teknologi */}
          <Card className="p-6 border-l-4 border-l-indigo-500">
            <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
              <span className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
                🔧
              </span>
              Teknologi yang Digunakan
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
                  <Globe className="w-5 h-5 text-blue-500" />Frontend
                </h3>
                <div className="flex flex-wrap gap-2">
                  {['React 18 + Vite', 'Tailwind CSS', 'Shadcn UI', 'Recharts', 'Lucide React', 'Hello Pangea DnD', 'React Router', 'Zustand'].map((tech, index) => (
                    <span key={index} className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-semibold border border-blue-200">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
                  <Database className="w-5 h-5 text-green-500" />Backend
                </h3>
                <div className="flex flex-wrap gap-2">
                  {['Node.js', 'Express.js', 'SQLite', 'JWT', 'bcryptjs', 'Multer'].map((tech, index) => (
                    <span key={index} className="px-4 py-2 bg-green-50 text-green-700 rounded-lg text-sm font-semibold border border-green-200">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          {/* Contact Developer */}
          <Card className="p-8 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-slate-700">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="text-center md:text-left max-w-xl">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 rounded-full text-blue-400 text-sm font-medium mb-4">
                  <MessageSquare className="w-4 h-4" />
                  Hubungi Pengembang
                </div>
                <h3 className="text-3xl font-bold text-white mb-3">Gusti Dewa Anggading</h3>
                <p className="text-slate-300 text-lg leading-relaxed">
                  Punya pertanyaan tentang sistem ini? Ingin mengembangkan fitur baru atau membutuhkan dukungan teknis? 
                  Jangan ragu untuk menghubungi kami. Kami siap membantu Anda mengoptimalkan sistem CRM kampus Anda.
                </p>
              </div>
              <div className="flex flex-col gap-4 w-full md:w-auto">
                <a 
                  href="mailto:mail.sidewa@gmail.com"
                  className="flex items-center gap-4 px-6 py-4 bg-white/10 hover:bg-white/20 rounded-2xl text-white transition-all hover:scale-105 hover:shadow-lg"
                >
                  <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                    <Mail className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Email</p>
                    <span className="font-semibold">mail.sidewa@gmail.com</span>
                  </div>
                </a>
                <a 
                  href="https://wa.me/6281234567890"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 px-6 py-4 bg-green-500/20 hover:bg-green-500/30 rounded-2xl text-white transition-all hover:scale-105 hover:shadow-lg"
                >
                  <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
                    <MessageSquare className="w-6 h-6 text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm text-green-400/80">WhatsApp</p>
                    <span className="font-semibold">Chat via WhatsApp</span>
                  </div>
                </a>
              </div>
            </div>
          </Card>

          {/* Version Info */}
          <div className="flex items-center justify-center gap-4 py-6">
            <div className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium">
              <Award className="w-4 h-4" />
              Arlindo Digital CRM V2.0
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-600 rounded-full text-sm font-medium">
              <RefreshCw className="w-4 h-4" />
              Last Updated: 2026
            </div>
          </div>
        </div>
      )}

      {/* Text Version */}
      {activeTab === 'text' && (
        <Card className="p-6 animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-slate-800">Teks PRD (Siap Copy)</h2>
            <Button onClick={handleCopy} className="bg-blue-600 hover:bg-blue-700">
              {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
              {copied ? 'Tersalin!' : 'Copy'}
            </Button>
          </div>
          <pre className="bg-slate-800 text-slate-100 p-6 rounded-xl overflow-x-auto text-sm whitespace-pre-wrap font-mono max-h-[600px] overflow-y-auto">
            {prdText}
          </pre>
        </Card>
      )}
    </div>
  )
}

