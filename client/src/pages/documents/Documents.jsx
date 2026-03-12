import React, { useEffect, useState } from 'react'
import { Plus, Trash, ExternalLink, Download, Eye, FileText, Image, File, Folder, Search, Filter } from 'lucide-react'
import { useDocumentStore } from '@/store'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/Dialog'
import { Label } from '@/components/ui/Label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select'
import { formatDate } from '@/lib/utils'

const categories = ['All', 'Proposal', 'Brochure', 'Template', 'Contract', 'Report']

const categoryConfig = {
  Proposal: { color: 'bg-info/10 text-info border-info/20', icon: '📄' },
  Brochure: { color: 'bg-success/10 text-success border-success/20', icon: '📰' },
  Template: { color: 'bg-primary/10 text-primary border-primary/20', icon: '📋' },
  Contract: { color: 'bg-warning/10 text-warning border-warning/20', icon: '📝' },
  Report: { color: 'bg-secondary/10 text-secondary border-secondary/20', icon: '📊' },
}

export default function Documents() {
  const { documents, fetchDocuments, uploadDocument, deleteDocument, isLoading } = useDocumentStore()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [search, setSearch] = useState('')
  const [formData, setFormData] = useState({
    title: '', category: '', description: '', drive_link: ''
  })
  const [file, setFile] = useState(null)

  useEffect(() => {
    fetchDocuments()
  }, [])

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.title?.toLowerCase().includes(search.toLowerCase()) ||
      doc.description?.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || doc.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleSubmit = async () => {
    const data = new FormData()
    data.append('title', formData.title)
    data.append('category', formData.category)
    data.append('description', formData.description)
    data.append('drive_link', formData.drive_link)
    if (file) {
      data.append('file', file)
    }
    
    await uploadDocument(data)
    setIsModalOpen(false)
    setFormData({ title: '', category: '', description: '', drive_link: '' })
    setFile(null)
    fetchDocuments()
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      await deleteDocument(id)
      fetchDocuments()
    }
  }

  const getCategoryBadge = (category) => {
    const config = categoryConfig[category] || categoryConfig.Proposal
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg border ${config.color}`}>
        <span>{config.icon}</span>
        {category}
      </span>
    )
  }

  const getFileIcon = (filename) => {
    if (!filename) return <File className="w-6 h-6 text-text-muted" />
    const ext = filename.split('.').pop().toLowerCase()
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) {
      return <Image className="w-6 h-6 text-success" />
    }
    if (ext === 'pdf') {
      return <FileText className="w-6 h-6 text-danger" />
    }
    return <File className="w-6 h-6 text-text-muted" />
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Documents</h1>
          <p className="text-sm text-text-muted mt-1">Manage your marketing documents</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Upload Document
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <Input
              placeholder="Search documents..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(cat => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Documents Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center gap-3">
            <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
            <p className="text-sm text-text-muted">Loading documents...</p>
          </div>
        </div>
      ) : filteredDocuments.length === 0 ? (
        <div className="card p-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-surface-light flex items-center justify-center mx-auto mb-4">
            <Folder className="w-8 h-8 text-text-muted" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">No documents found</h3>
          <p className="text-text-muted mb-6">Upload your first document to get started</p>
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Upload Document
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredDocuments.map((doc, index) => (
            <div 
              key={doc.id} 
              className="card p-4 hover:border-border-light transition-all duration-200 animate-slide-up"
              style={{ animationDelay: `${index * 30}ms` }}
            >
              {/* Card Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="w-12 h-12 rounded-xl bg-surface-light flex items-center justify-center">
                  {getFileIcon(doc.file_path)}
                </div>
                <div className="flex items-center gap-1">
                  {getCategoryBadge(doc.category)}
                </div>
              </div>
              
              {/* Content */}
              <h3 className="font-semibold text-foreground mb-1 line-clamp-1">{doc.title}</h3>
              <p className="text-sm text-text-muted mb-3 line-clamp-2">{doc.description || 'No description'}</p>
              
              {/* Meta */}
              <div className="text-xs text-text-muted mb-4">
                {doc.created_by_name && <span>by {doc.created_by_name}</span>}
                {doc.created_at && <span> • {formatDate(doc.created_at)}</span>}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 pt-3 border-t border-border">
                {doc.drive_link && (
                  <a href={doc.drive_link} target="_blank" rel="noopener noreferrer" className="flex-1">
                    <Button variant="secondary" size="sm" className="w-full">
                      <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
                      Drive
                    </Button>
                  </a>
                )}
                {doc.file_path && (
                  <a href={doc.file_path} target="_blank" rel="noopener noreferrer" className="flex-1">
                    <Button variant="secondary" size="sm" className="w-full">
                      <Eye className="w-3.5 h-3.5 mr-1.5" />
                      View
                    </Button>
                  </a>
                )}
                <Button 
                  variant="ghost" 
                  size="icon-sm"
                  onClick={() => handleDelete(doc.id)}
                  className="hover:bg-danger/10"
                >
                  <Trash className="w-4 h-4 text-danger" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Upload Document</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Title *</Label>
              <Input 
                value={formData.title} 
                onChange={(e) => setFormData({...formData, title: e.target.value})} 
                placeholder="Document title" 
              />
            </div>
            <div className="space-y-2">
              <Label>Category *</Label>
              <Select value={formData.category} onValueChange={(v) => setFormData({...formData, category: v})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.filter(c => c !== 'All').map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <textarea 
                className="input min-h-[80px]" 
                value={formData.description} 
                onChange={(e) => setFormData({...formData, description: e.target.value})} 
                placeholder="Document description..."
              />
            </div>
            <div className="space-y-2">
              <Label>File</Label>
              <Input 
                type="file" 
                onChange={(e) => setFile(e.target.files[0])} 
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              />
            </div>
            <div className="space-y-2">
              <Label>Google Drive Link</Label>
              <Input 
                value={formData.drive_link} 
                onChange={(e) => setFormData({...formData, drive_link: e.target.value})} 
                placeholder="https://drive.google.com/..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit}>Upload</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
