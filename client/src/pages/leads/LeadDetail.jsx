import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Edit, Trash, MessageCircle, Phone, Mail, MapPin, GraduationCap, Calendar, FileText, Building, Clock, CheckCircle2, AlertCircle } from 'lucide-react'
import { useLeadStore } from '@/store'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/Dialog'
import { Label } from '@/components/ui/Label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select'
import { Input } from '@/components/ui/Input'
import { formatDate, formatDateTime } from '@/lib/utils'

const statusOptions = [
  { value: 'new', label: 'New' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'follow_up', label: 'Follow Up' },
  { value: 'interested', label: 'Interested' },
  { value: 'registered', label: 'Registered' },
  { value: 'enrolled', label: 'Enrolled' },
  { value: 'lost', label: 'Lost' },
]

const priorityOptions = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'hot', label: 'Hot' },
]

const statusConfig = {
  new: { label: 'New', color: 'bg-info/10 text-info border-info/20' },
  contacted: { label: 'Contacted', color: 'bg-warning/10 text-warning border-warning/20' },
  follow_up: { label: 'Follow Up', color: 'bg-warning/10 text-warning border-warning/20' },
  interested: { label: 'Interested', color: 'bg-primary/10 text-primary border-primary/20' },
  registered: { label: 'Registered', color: 'bg-success/10 text-success border-success/20' },
  enrolled: { label: 'Enrolled', color: 'bg-success/10 text-success border-success/20' },
  lost: { label: 'Lost', color: 'bg-danger/10 text-danger border-danger/20' }
}

const priorityConfig = {
  low: { label: 'Low', color: 'bg-surface-light text-text-muted border-border' },
  medium: { label: 'Medium', color: 'bg-info/10 text-info border-info/20' },
  high: { label: 'High', color: 'bg-warning/10 text-warning border-warning/20' },
  hot: { label: 'Hot', color: 'bg-danger/10 text-danger border-danger/20' }
}

export default function LeadDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { currentLead, fetchLead, updateLead, deleteLead, isLoading } = useLeadStore()
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [formData, setFormData] = useState({})

  useEffect(() => {
    fetchLead(id)
  }, [id])

  useEffect(() => {
    if (currentLead) {
      setFormData({ ...currentLead })
    }
  }, [currentLead])

  const handleUpdate = async () => {
    await updateLead(id, formData)
    setIsEditModalOpen(false)
    fetchLead(id)
  }

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this lead?')) {
      await deleteLead(id)
      navigate('/leads')
    }
  }

  const getStatusBadge = (status) => {
    const config = statusConfig[status] || statusConfig.new
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg border ${config.color}`}>
        {config.label}
      </span>
    )
  }

  const getPriorityBadge = (priority) => {
    const config = priorityConfig[priority] || priorityConfig.medium
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg border ${config.color}`}>
        {config.label} Priority
      </span>
    )
  }

  if (isLoading || !currentLead) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
          <p className="text-sm text-text-muted">Loading lead details...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/leads')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-semibold text-foreground">{currentLead.name}</h1>
            <p className="text-sm text-text-muted">Lead Details</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {currentLead.phone && (
            <a href={`https://wa.me/${currentLead.phone}`} target="_blank" rel="noopener noreferrer">
              <Button className="bg-success hover:bg-success-light">
                <MessageCircle className="w-4 h-4 mr-2" />
                WhatsApp
              </Button>
            </a>
          )}
          <Button variant="secondary" onClick={() => setIsEditModalOpen(true)}>
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            <Trash className="w-4 h-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      {/* Status & Priority */}
      <div className="flex items-center gap-3">
        {getStatusBadge(currentLead.status)}
        {getPriorityBadge(currentLead.priority)}
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Personal Info */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <FileText className="w-4 h-4 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground">Personal Information</h3>
          </div>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-xl font-bold">
              {currentLead.name?.charAt(0)}
            </div>
            <div>
              <p className="font-medium text-foreground">{currentLead.name}</p>
              <p className="text-sm text-text-muted">Lead</p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-surface-light rounded-xl">
              <Phone className="w-4 h-4 text-text-muted" />
              <span className="text-sm text-foreground">{currentLead.phone || '-'}</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-surface-light rounded-xl">
              <Mail className="w-4 h-4 text-text-muted" />
              <span className="text-sm text-foreground">{currentLead.email || '-'}</span>
            </div>
          </div>
        </Card>

        {/* Education Info */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center">
              <GraduationCap className="w-4 h-4 text-success" />
            </div>
            <h3 className="font-semibold text-foreground">Education Information</h3>
          </div>
          <div className="space-y-4">
            <div className="p-4 bg-surface-light rounded-xl">
              <p className="text-xs text-text-muted mb-1">School</p>
              <p className="font-medium text-foreground">{currentLead.school || '-'}</p>
            </div>
            <div className="p-4 bg-surface-light rounded-xl">
              <p className="text-xs text-text-muted mb-1">Program Interest</p>
              <p className="font-medium text-foreground">{currentLead.program || '-'}</p>
            </div>
          </div>
        </Card>

        {/* Lead Source & Dates */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center">
              <Building className="w-4 h-4 text-secondary" />
            </div>
            <h3 className="font-semibold text-foreground">Lead Details</h3>
          </div>
          <div className="space-y-4">
            <div className="p-4 bg-surface-light rounded-xl">
              <p className="text-xs text-text-muted mb-1">Source</p>
              <p className="font-medium text-foreground">{currentLead.source || '-'}</p>
            </div>
            <div className="p-4 bg-surface-light rounded-xl">
              <p className="text-xs text-text-muted mb-1">Created</p>
              <p className="font-medium text-foreground">{formatDateTime(currentLead.created_at)}</p>
            </div>
            {currentLead.next_follow_up && (
              <div className={`p-4 rounded-xl ${new Date(currentLead.next_follow_up) < new Date() ? 'bg-danger/10' : 'bg-warning/10'}`}>
                <p className="text-xs text-text-muted mb-1">Next Follow Up</p>
                <p className={`font-medium ${new Date(currentLead.next_follow_up) < new Date() ? 'text-danger' : 'text-foreground'}`}>
                  {formatDate(currentLead.next_follow_up)}
                </p>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Notes */}
      {currentLead.notes && (
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-warning/10 flex items-center justify-center">
              <FileText className="w-4 h-4 text-warning" />
            </div>
            <h3 className="font-semibold text-foreground">Notes</h3>
          </div>
          <p className="text-text-secondary whitespace-pre-wrap leading-relaxed">{currentLead.notes}</p>
        </Card>
      )}

      {/* Follow Up History */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-info/10 flex items-center justify-center">
            <Clock className="w-4 h-4 text-info" />
          </div>
          <h3 className="font-semibold text-foreground">Follow Up History</h3>
        </div>
        {currentLead.followUps && currentLead.followUps.length > 0 ? (
          <div className="space-y-3">
            {currentLead.followUps.map((fu, index) => (
              <div 
                key={fu.id} 
                className="flex items-start gap-4 p-4 bg-surface-light rounded-xl animate-slide-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  {fu.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-success" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-warning" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-medium text-foreground">{formatDate(fu.follow_up_date)}</p>
                    {fu.completed && (
                      <span className="inline-flex items-center px-2 py-0.5 bg-success/10 text-success text-xs font-medium rounded-md border border-success/20">
                        Completed
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-text-muted">{fu.notes || 'No notes'}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="w-12 h-12 rounded-xl bg-surface-light flex items-center justify-center mx-auto mb-3">
              <Clock className="w-6 h-6 text-text-muted" />
            </div>
            <p className="text-text-muted">No follow up history</p>
          </div>
        )}
      </Card>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Lead</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label>Name *</Label>
              <Input value={formData.name || ''} onChange={(e) => setFormData({...formData, name: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>WhatsApp</Label>
              <Input value={formData.phone || ''} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input value={formData.email || ''} onChange={(e) => setFormData({...formData, email: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>School</Label>
              <Input value={formData.school || ''} onChange={(e) => setFormData({...formData, school: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>Program Interest</Label>
              <Input value={formData.program || ''} onChange={(e) => setFormData({...formData, program: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>Source</Label>
              <Input value={formData.source || ''} onChange={(e) => setFormData({...formData, source: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={formData.status || ''} onValueChange={(v) => setFormData({...formData, status: v})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {statusOptions.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Priority</Label>
              <Select value={formData.priority || ''} onValueChange={(v) => setFormData({...formData, priority: v})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {priorityOptions.map(p => <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 col-span-2">
              <Label>Next Follow Up</Label>
              <Input type="date" value={formData.next_follow_up || ''} onChange={(e) => setFormData({...formData, next_follow_up: e.target.value})} />
            </div>
            <div className="space-y-2 col-span-2">
              <Label>Notes</Label>
              <textarea 
                className="input min-h-[80px]" 
                value={formData.notes || ''} 
                onChange={(e) => setFormData({...formData, notes: e.target.value})} 
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
            <Button onClick={handleUpdate}>Update Lead</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
