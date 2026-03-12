import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Plus, Trash2, Edit, Trash, X, Download, Mail, Phone, User, MessageSquare, FileSpreadsheet, FileText } from 'lucide-react'
import { useLeadStore, useAuthStore } from '@/store'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/Dialog'
import { Label } from '@/components/ui/Label'
import { Checkbox } from '@/components/ui/Checkbox'
import { exportLeadsToExcel, exportLeadsToPDF } from '@/lib/exportUtils'

const statusOptions = [
  { value: 'new', label: 'New' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'follow_up', label: 'Follow Up' },
  { value: 'interested', label: 'Interested' },
  { value: 'registered', label: 'Registered' },
  { value: 'enrolled', label: 'Enrolled' },
  { value: 'lost', label: 'Lost' },
]

const registrationOptions = [
  { value: 'reguler', label: 'Reguler' },
  { value: 'beasiswa_kip', label: 'Beasiswa KIP' },
]

const classOptions = [
  { value: 'pagi', label: 'Kelas Pagi' },
  { value: 'malam', label: 'Kelas Malam' },
]

const sourceOptions = [
  'Instagram', 'Facebook', 'Twitter', 'Google Ads', 'Expo Pendidikan', 
  'School Visit', 'Referral', 'Offline', 'Website', 'Other'
]

const statusConfig = {
  new: { label: 'New', color: 'bg-blue-100 text-blue-700 border-blue-200' },
  contacted: { label: 'Contacted', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
  follow_up: { label: 'Follow Up', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
  interested: { label: 'Interested', color: 'bg-indigo-100 text-indigo-700 border-indigo-200' },
  registered: { label: 'Registered', color: 'bg-green-100 text-green-700 border-green-200' },
  enrolled: { label: 'Enrolled', color: 'bg-green-100 text-green-700 border-green-200' },
  lost: { label: 'Lost', color: 'bg-red-100 text-red-700 border-red-200' }
}

export default function Leads({ onNewLead }) {
  const navigate = useNavigate()
  const { leads, fetchLeads, createLead, updateLead, deleteLead, bulkDelete, isLoading, error } = useLeadStore()
  
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sourceFilter, setSourceFilter] = useState('all')
  const [registrationFilter, setRegistrationFilter] = useState('all')
  const [classFilter, setClassFilter] = useState('all')
  const [selectedIds, setSelectedIds] = useState([])
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [currentLead, setCurrentLead] = useState(null)
  const [editingStatusId, setEditingStatusId] = useState(null)
  const [showExportMenu, setShowExportMenu] = useState(false)
  const [formData, setFormData] = useState({
    name: '', phone: '', email: '', school: '', program: '', 
    source: '', status: 'new', notes: '', registration_type: 'reguler', class_type: 'pagi'
  })

  // Export handlers
  const handleExportExcel = () => {
    exportLeadsToExcel(filteredLeads)
    setShowExportMenu(false)
  }

  const handleExportPDF = () => {
    exportLeadsToPDF(filteredLeads)
    setShowExportMenu(false)
  }

  useEffect(() => {
    fetchLeads()
  }, [])

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.name.toLowerCase().includes(search.toLowerCase()) ||
      lead.email?.toLowerCase().includes(search.toLowerCase()) ||
      lead.phone?.includes(search)
    const matchesStatus = statusFilter === 'all' || !statusFilter || lead.status === statusFilter
    const matchesSource = sourceFilter === 'all' || !sourceFilter || lead.source === sourceFilter
    const matchesRegistration = registrationFilter === 'all' || !registrationFilter || lead.registration_type === registrationFilter
    const matchesClass = classFilter === 'all' || !classFilter || lead.class_type === classFilter
    return matchesSearch && matchesStatus && matchesSource && matchesRegistration && matchesClass
  })

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(filteredLeads.map(l => l.id))
    } else {
      setSelectedIds([])
    }
  }

  const handleSelectOne = (id) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }

  const handleAddLead = async () => {
    const success = await createLead(formData)
    if (success) {
      setIsAddModalOpen(false)
      setFormData({ name: '', phone: '', email: '', school: '', program: '', 
        source: '', status: 'new', notes: '', registration_type: 'reguler', class_type: 'pagi' })
      fetchLeads()
    }
  }

  const handleEditClick = (lead) => {
    setCurrentLead(lead)
    setFormData({
      name: lead.name || '',
      phone: lead.phone || '',
      email: lead.email || '',
      school: lead.school || '',
      program: lead.program || '',
      source: lead.source || '',
      status: lead.status || 'new',
      notes: lead.notes || '',
      registration_type: lead.registration_type || 'reguler',
      class_type: lead.class_type || 'pagi'
    })
    setIsEditModalOpen(true)
  }

  const handleUpdateLead = async () => {
    if (!currentLead || !currentLead.id) return
    const success = await updateLead(currentLead.id, formData)
    if (success) {
      setIsEditModalOpen(false)
      setCurrentLead(null)
      fetchLeads()
    }
  }

  const handleDeleteLead = async (id) => {
    if (window.confirm('Are you sure you want to delete this lead?')) {
      await deleteLead(id)
      fetchLeads()
    }
  }

  const handleBulkDelete = async () => {
    if (window.confirm(`Are you sure you want to delete ${selectedIds.length} leads?`)) {
      await bulkDelete(selectedIds)
      setSelectedIds([])
      fetchLeads()
    }
  }

  // Quick status change
  const handleStatusChange = async (leadId, newStatus) => {
    const success = await updateLead(leadId, { status: newStatus })
    setEditingStatusId(null)
    if (success) {
      fetchLeads()
    }
  }

  const getUniqueSources = () => {
    const sources = [...new Set(leads.map(l => l.source).filter(Boolean))]
    return sources.map(s => ({ value: s, label: s }))
  }

  // Function to generate WhatsApp link with greeting
  const getWhatsAppLink = (lead) => {
    const phone = lead.phone?.replace(/[^0-9]/g, '') || ''
    const greeting = `Halo ${lead.name}, Terima kasih sudah menghubungi STIE ARLINDO! 👋%0A%0APerkenalkan, saya dari tim admissions STIE ARLINDO.%0A%0APerlu informasi lebih lanjut tentang program studi yang anda minati?`
    return `https://wa.me/${phone}?text=${greeting}`
  }

  const handleWA = (lead) => {
    const url = getWhatsAppLink(lead)
    window.open(url, '_blank')
  }

  const getStatusBadge = (status) => {
    const config = statusConfig[status] || statusConfig.new
    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg border ${config.color}`}>
        {config.label}
      </span>
    )
  }

  const getRegistrationBadge = (type) => {
    const labels = {
      reguler: 'Reguler',
      beamsiswa_kip: 'Beasiswa KIP'
    }
    return labels[type] || type
  }

  const getClassBadge = (type) => {
    const labels = {
      pagi: 'Kelas Pagi',
      malam: 'Kelas Malam'
    }
    return labels[type] || type
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Leads</h1>
          <p className="text-slate-500 mt-1">Kelola data calon mahasiswa</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Export Dropdown */}
          <div className="relative">
            <Button 
              variant="secondary" 
              size="sm"
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="flex items-center"
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            {showExportMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-200 py-1 z-50">
                <button
                  onClick={handleExportExcel}
                  className="w-full px-4 py-2.5 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                >
                  <FileSpreadsheet className="w-4 h-4 text-green-600" />
                  Export Excel
                </button>
                <button
                  onClick={handleExportPDF}
                  className="w-full px-4 py-2.5 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                >
                  <FileText className="w-4 h-4 text-red-600" />
                  Export PDF
                </button>
              </div>
            )}
          </div>
          <Button onClick={() => setIsAddModalOpen(true)} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Tambah Lead
          </Button>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center">
              <X className="w-4 h-4 text-red-600" />
            </div>
            <div>
              <p className="font-medium text-red-700">{error}</p>
              <p className="text-sm text-red-500">Pastikan server berjalan di port 5000</p>
            </div>
          </div>
          <Button variant="secondary" size="sm" onClick={() => fetchLeads()}>
            Coba Lagi
          </Button>
        </div>
      )}

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input
              placeholder="Cari berdasarkan nama, email, atau telepon..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 h-11"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-40 h-11">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Status</SelectItem>
              {statusOptions.map(opt => (
                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={sourceFilter} onValueChange={setSourceFilter}>
            <SelectTrigger className="w-full md:w-40 h-11">
              <SelectValue placeholder="Sumber" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Sumber</SelectItem>
              {getUniqueSources().map(opt => (
                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={registrationFilter} onValueChange={setRegistrationFilter}>
            <SelectTrigger className="w-full md:w-40 h-11">
              <SelectValue placeholder="Jenis Daftar" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua</SelectItem>
              {registrationOptions.map(opt => (
                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={classFilter} onValueChange={setClassFilter}>
            <SelectTrigger className="w-full md:w-40 h-11">
              <SelectValue placeholder="Kelas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Kelas</SelectItem>
              {classOptions.map(opt => (
                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Bulk Actions */}
      {selectedIds.length > 0 && (
        <div className="flex items-center gap-4 p-4 bg-blue-50 border border-blue-100 rounded-xl">
          <span className="text-sm font-semibold text-blue-700">{selectedIds.length} dipilih</span>
          <Button variant="destructive" size="sm" onClick={handleBulkDelete}>
            <Trash2 className="w-4 h-4 mr-1" />
            Hapus
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setSelectedIds([])}>
            Batal
          </Button>
        </div>
      )}

      {/* Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="w-12 px-4 py-4 text-left">
                  <Checkbox
                    checked={selectedIds.length === filteredLeads.length && filteredLeads.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                </th>
                <th className="px-4 py-4 text-left text-sm font-semibold text-slate-600">Nama</th>
                <th className="px-4 py-4 text-left text-sm font-semibold text-slate-600">Kontak</th>
                <th className="px-4 py-4 text-left text-sm font-semibold text-slate-600">Sekolah</th>
                <th className="px-4 py-4 text-left text-sm font-semibold text-slate-600">Program</th>
                <th className="px-4 py-4 text-left text-sm font-semibold text-slate-600">Jenis Daftar</th>
                <th className="px-4 py-4 text-left text-sm font-semibold text-slate-600">Kelas</th>
                <th className="px-4 py-4 text-left text-sm font-semibold text-slate-600">Status</th>
                <th className="px-4 py-4 text-left text-sm font-semibold text-slate-600">WhatsApp</th>
                <th className="w-24 px-4 py-4 text-left text-sm font-semibold text-slate-600">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={10} className="text-center py-12">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                      <p className="text-slate-500">Memuat data...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={10} className="text-center py-12">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center">
                        <User className="w-8 h-8 text-slate-400" />
                      </div>
                      <p className="text-slate-500">Belum ada data leads</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredLeads.map(lead => (
                  <tr 
                    key={lead.id} 
                    className="border-b border-slate-100 hover:bg-slate-50"
                  >
                    <td className="px-4 py-4">
                      <Checkbox
                        checked={selectedIds.includes(lead.id)}
                        onCheckedChange={() => handleSelectOne(lead.id)}
                      />
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
                          {lead.name.charAt(0)}
                        </div>
                        <span className="font-semibold text-slate-800">{lead.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-col gap-1">
                        <a 
                          href={`tel:${lead.phone}`}
                          className="text-sm text-slate-600 hover:text-blue-600 flex items-center gap-1.5"
                        >
                          <Phone className="w-4 h-4" />
                          {lead.phone}
                        </a>
                        {lead.email && (
                          <a 
                            href={`mailto:${lead.email}`}
                            className="text-xs text-slate-500 hover:text-blue-600 flex items-center gap-1.5"
                          >
                            <Mail className="w-3.5 h-3.5" />
                            {lead.email}
                          </a>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-slate-600">{lead.school}</td>
                    <td className="px-4 py-4 text-slate-600">{lead.program}</td>
                    <td className="px-4 py-4">
                      <span className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-lg bg-purple-100 text-purple-700">
                        {getRegistrationBadge(lead.registration_type)}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-lg bg-indigo-100 text-indigo-700">
                        {getClassBadge(lead.class_type)}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      {editingStatusId === lead.id ? (
                        <Select 
                          value={lead.status} 
                          onValueChange={(value) => handleStatusChange(lead.id, value)}
                        >
                          <SelectTrigger className="w-36 h-9">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {statusOptions.map(opt => (
                              <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <div className="flex items-center gap-2">
                          {getStatusBadge(lead.status)}
                          <button 
                            onClick={() => setEditingStatusId(lead.id)}
                            className="p-1 hover:bg-slate-100 rounded"
                            title="Ubah Status"
                          >
                            <Edit className="w-3.5 h-3.5 text-slate-400" />
                          </button>
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      {lead.phone && (
                        <button
                          onClick={() => handleWA(lead)}
                          className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-[15px] font-medium text-sm transition-colors"
                        >
                          <MessageSquare className="w-4 h-4" />
                          WhatsApp
                        </button>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1">
                        <Button 
                          variant="ghost" 
                          size="icon-sm"
                          onClick={() => handleEditClick(lead)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon-sm"
                          onClick={() => handleDeleteLead(lead.id)}
                          className="hover:text-red-600"
                        >
                          <Trash className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Info */}
        {filteredLeads.length > 0 && (
          <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between">
            <p className="text-sm text-slate-500">
              Menampilkan {filteredLeads.length} dari {leads.length} leads
            </p>
          </div>
        )}
      </Card>

      {/* Add Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Tambah Lead Baru</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label>Nama *</Label>
              <Input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="Nama lengkap" />
            </div>
            <div className="space-y-2">
              <Label>WhatsApp</Label>
              <Input value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} placeholder="628xxx" />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} placeholder="email@example.com" />
            </div>
            <div className="space-y-2">
              <Label>Sekolah</Label>
              <Input value={formData.school} onChange={(e) => setFormData({...formData, school: e.target.value})} placeholder="Nama sekolah" />
            </div>
            <div className="space-y-2">
              <Label>Program Interest</Label>
              <Input value={formData.program} onChange={(e) => setFormData({...formData, program: e.target.value})} placeholder="Program" />
            </div>
            <div className="space-y-2">
              <Label>Sumber</Label>
              <Select value={formData.source} onValueChange={(v) => setFormData({...formData, source: v})}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih sumber" />
                </SelectTrigger>
                <SelectContent>
                  {sourceOptions.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Jenis Pendaftaran</Label>
              <Select value={formData.registration_type} onValueChange={(v) => setFormData({...formData, registration_type: v})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {registrationOptions.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Kelas</Label>
              <Select value={formData.class_type} onValueChange={(v) => setFormData({...formData, class_type: v})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {classOptions.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={formData.status} onValueChange={(v) => setFormData({...formData, status: v})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 col-span-2">
              <Label>Catatan</Label>
              <textarea 
                className="input min-h-[80px]" 
                value={formData.notes} 
                onChange={(e) => setFormData({...formData, notes: e.target.value})} 
                placeholder="Catatan tambahan..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setIsAddModalOpen(false)}>Batal</Button>
            <Button onClick={handleAddLead}>Tambah Lead</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Lead</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label>Nama *</Label>
              <Input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>WhatsApp</Label>
              <Input value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>Sekolah</Label>
              <Input value={formData.school} onChange={(e) => setFormData({...formData, school: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>Program Interest</Label>
              <Input value={formData.program} onChange={(e) => setFormData({...formData, program: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>Sumber</Label>
              <Select value={formData.source} onValueChange={(v) => setFormData({...formData, source: v})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {sourceOptions.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Jenis Pendaftaran</Label>
              <Select value={formData.registration_type} onValueChange={(v) => setFormData({...formData, registration_type: v})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {registrationOptions.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Kelas</Label>
              <Select value={formData.class_type} onValueChange={(v) => setFormData({...formData, class_type: v})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {classOptions.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={formData.status} onValueChange={(v) => setFormData({...formData, status: v})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {statusOptions.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 col-span-2">
              <Label>Catatan</Label>
              <textarea 
                className="input min-h-[80px]" 
                value={formData.notes} 
                onChange={(e) => setFormData({...formData, notes: e.target.value})} 
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={() => { setIsEditModalOpen(false); setCurrentLead(null); }}>Batal</Button>
            <Button onClick={handleUpdateLead}>Simpan Perubahan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

