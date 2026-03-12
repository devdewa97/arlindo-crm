import React, { useEffect, useState } from 'react'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import { Plus, Edit, Trash, Calendar, GripVertical, Clock, CheckCircle2, Circle } from 'lucide-react'
import { useTaskStore } from '@/store'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/Dialog'
import { Label } from '@/components/ui/Label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select'
import { formatDate } from '@/lib/utils'

const COLUMNS = [
  { id: 'todo', title: 'To Do', color: 'bg-slate-400', lightColor: 'bg-slate-50', textColor: 'text-slate-600' },
  { id: 'in_progress', title: 'Sedang Dikerjakan', color: 'bg-blue-500', lightColor: 'bg-blue-50', textColor: 'text-blue-600' },
  { id: 'done', title: 'Selesai', color: 'bg-green-500', lightColor: 'bg-green-50', textColor: 'text-green-600' },
]

const priorityOptions = [
  { value: 'low', label: 'Rendah' },
  { value: 'medium', label: 'Sedang' },
  { value: 'high', label: 'Tinggi' },
]

const priorityConfig = {
  low: { label: 'Rendah', color: 'bg-slate-100 text-slate-600 border-slate-200' },
  medium: { label: 'Sedang', color: 'bg-blue-50 text-blue-600 border-blue-200' },
  high: { label: 'Tinggi', color: 'bg-red-50 text-red-600 border-red-200' }
}

export default function Tasks() {
  const { tasks, fetchTasks, createTask, updateTask, deleteTask } = useTaskStore()
  const [columns, setColumns] = useState({})
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [formData, setFormData] = useState({
    title: '', description: '', priority: 'medium', status: 'todo', due_date: ''
  })

  useEffect(() => {
    fetchTasks()
  }, [])

  useEffect(() => {
    const grouped = {}
    COLUMNS.forEach(col => {
      grouped[col.id] = tasks.filter(t => t.status === col.id)
    })
    setColumns(grouped)
  }, [tasks])

  const handleDragEnd = async (result) => {
    if (!result.destination) return

    const { source, destination, draggableId } = result
    
    if (source.droppableId === destination.droppableId) return

    const task = tasks.find(t => t.id === parseInt(draggableId))
    if (task) {
      await updateTask(task.id, { ...task, status: destination.droppableId })
      fetchTasks()
    }
  }

  const handleSubmit = async () => {
    if (editingTask) {
      await updateTask(editingTask.id, formData)
    } else {
      await createTask(formData)
    }
    setIsModalOpen(false)
    setEditingTask(null)
    setFormData({ title: '', description: '', priority: 'medium', status: 'todo', due_date: '' })
    fetchTasks()
  }

  const handleEdit = (task) => {
    setEditingTask(task)
    setFormData({ ...task })
    setIsModalOpen(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus task ini?')) {
      await deleteTask(id)
      fetchTasks()
    }
  }

  const getPriorityBadge = (priority) => {
    const config = priorityConfig[priority] || priorityConfig.medium
    return (
      <span className={`inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-lg border ${config.color}`}>
        {config.label}
      </span>
    )
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'done':
        return <CheckCircle2 className="w-5 h-5 text-green-500" />
      case 'in_progress':
        return <Clock className="w-5 h-5 text-blue-500" />
      default:
        return <Circle className="w-5 h-5 text-slate-400" />
    }
  }

  return (
    <div className="p-6 h-[calc(100vh-4rem)] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Tasks</h1>
          <p className="text-slate-500 mt-1">Kelola tugas dengan Kanban board</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-5 h-5 mr-2" />
          Tambah Task
        </Button>
      </div>

      {/* Kanban Board - Larger Columns */}
      <div className="flex-1 overflow-hidden">
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="flex gap-5 h-full overflow-x-auto pb-4">
            {COLUMNS.map(column => (
              <div key={column.id} className="flex-shrink-0 w-80 flex flex-col">
                {/* Column Header - Larger */}
                <div className="flex items-center justify-between px-4 py-3 mb-3 bg-white rounded-xl border border-slate-200 shadow-sm">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(column.id)}
                    <span className="font-semibold text-slate-800 text-base">{column.title}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className-3 py-={`text-sm px1 rounded-lg ${column.lightColor} ${column.textColor} font-semibold`}>
                      {columns[column.id]?.length || 0}
                    </span>
                  </div>
                </div>

                {/* Droppable Area - Larger */}
                <div className="flex-1 overflow-y-auto">
                  <Droppable droppableId={column.id}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`space-y-3 min-h-[200px] rounded-xl p-3 transition-all ${
                          snapshot.isDraggingOver 
                            ? `${column.lightColor} border-2 border-dashed ${column.textColor}/30` 
                            : 'bg-slate-100/50'
                        }`}
                      >
                        {columns[column.id]?.map((task, index) => (
                          <Draggable key={task.id} draggableId={String(task.id)} index={index}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`group bg-white border border-slate-200 rounded-xl p-4 transition-all duration-200 ${
                                  snapshot.isDragging 
                                    ? 'shadow-lg ring-2 ring-blue-400 rotate-2 scale-105' 
                                    : 'hover:border-slate-300 hover:shadow-md'
                                }`}
                              >
                                {/* Task Header */}
                                <div className="flex items-start justify-between mb-3">
                                  <div className="flex items-center gap-2">
                                    <GripVertical className="w-5 h-5 text-slate-300 cursor-grab" />
                                    <h4 className="font-semibold text-slate-800 text-base">{task.title}</h4>
                                  </div>
                                </div>

                                {/* Description */}
                                {task.description && (
                                  <p className="text-sm text-slate-500 mb-4 line-clamp-2 ml-7">{task.description}</p>
                                )}

                                {/* Footer */}
                                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                                  {getPriorityBadge(task.priority)}
                                  {task.due_date && (
                                    <span className={`text-sm flex items-center gap-1.5 ${
                                      new Date(task.due_date) < new Date() ? 'text-red-500' : 'text-slate-500'
                                    }`}>
                                      <Calendar className="w-4 h-4" />
                                      {formatDate(task.due_date)}
                                    </span>
                                  )}
                                </div>

                                {/* Action Buttons - Always visible */}
                                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-100">
                                  <button 
                                    onClick={() => handleEdit(task)} 
                                    className="flex-1 flex items-center justify-center gap-2 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg text-sm font-medium transition-colors"
                                  >
                                    <Edit className="w-4 h-4" />
                                    Edit
                                  </button>
                                  <button 
                                    onClick={() => handleDelete(task.id)} 
                                    className="flex-1 flex items-center justify-center gap-2 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-sm font-medium transition-colors"
                                  >
                                    <Trash className="w-4 h-4" />
                                    Hapus
                                  </button>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
              </div>
            ))}
          </div>
        </DragDropContext>
      </div>

      {/* Add/Edit Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingTask ? 'Edit Task' : 'Tambah Task Baru'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Judul *</Label>
              <Input 
                value={formData.title} 
                onChange={(e) => setFormData({...formData, title: e.target.value})} 
                placeholder="Judul task" 
              />
            </div>
            <div className="space-y-2">
              <Label>Deskripsi</Label>
              <textarea 
                className="input min-h-[80px]" 
                value={formData.description} 
                onChange={(e) => setFormData({...formData, description: e.target.value})} 
                placeholder="Deskripsi task..."
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Prioritas</Label>
                <Select value={formData.priority} onValueChange={(v) => setFormData({...formData, priority: v})}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {priorityOptions.map(p => <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={formData.status} onValueChange={(v) => setFormData({...formData, status: v})}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {COLUMNS.map(c => <SelectItem key={c.id} value={c.id}>{c.title}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Tanggal Jatuh Tempo</Label>
              <Input 
                type="date" 
                value={formData.due_date} 
                onChange={(e) => setFormData({...formData, due_date: e.target.value})} 
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Batal</Button>
            <Button onClick={handleSubmit}>{editingTask ? 'Simpan' : 'Tambah'} Task</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

