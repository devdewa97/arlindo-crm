import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import { MessageCircle, MoreVertical, Plus, Calendar, Building, Phone, GripVertical } from 'lucide-react'
import { useLeadStore } from '@/store'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'

const COLUMNS = [
  { id: 'new', title: 'Baru', color: 'bg-blue-500', lightColor: 'bg-blue-50', textColor: 'text-blue-600' },
  { id: 'contacted', title: 'Dihubungi', color: 'bg-yellow-500', lightColor: 'bg-yellow-50', textColor: 'text-yellow-600' },
  { id: 'follow_up', title: 'Follow Up', color: 'bg-yellow-500', lightColor: 'bg-yellow-50', textColor: 'text-yellow-600' },
  { id: 'interested', title: 'Minat', color: 'bg-indigo-500', lightColor: 'bg-indigo-50', textColor: 'text-indigo-600' },
  { id: 'registered', title: 'Terdaftar', color: 'bg-green-500', lightColor: 'bg-green-50', textColor: 'text-green-600' },
  { id: 'enrolled', title: 'Daftar Ulang', color: 'bg-green-500', lightColor: 'bg-green-50', textColor: 'text-green-600' },
]

export default function Pipeline() {
  const navigate = useNavigate()
  const { leads, fetchLeads, updateLead } = useLeadStore()
  const [columns, setColumns] = useState({})

  useEffect(() => {
    fetchLeads()
  }, [])

  useEffect(() => {
    const grouped = {}
    COLUMNS.forEach(col => {
      grouped[col.id] = leads.filter(l => l.status === col.id)
    })
    setColumns(grouped)
  }, [leads])

  const handleDragEnd = async (result) => {
    if (!result.destination) return

    const { source, destination, draggableId } = result
    
    if (source.droppableId === destination.droppableId) return

    const lead = leads.find(l => l.id === parseInt(draggableId))
    if (lead) {
      await updateLead(lead.id, { ...lead, status: destination.droppableId })
      fetchLeads()
    }
  }

  return (
    <div className="p-6 h-[calc(100vh-4rem)] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Pipeline</h1>
          <p className="text-slate-500 mt-1">Drag and drop leads antar tahapan</p>
        </div>
        <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Tambah Lead
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
                    <span className={`w-3 h-3 rounded-full ${column.color}`}></span>
                    <span className="font-semibold text-slate-800 text-base">{column.title}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm px-3 py-1 rounded-lg ${column.lightColor} ${column.textColor} font-semibold`}>
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
                        {columns[column.id]?.map((lead, index) => (
                          <Draggable key={lead.id} draggableId={String(lead.id)} index={index}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`group bg-white border border-slate-200 rounded-xl p-4 cursor-pointer transition-all duration-200 ${
                                  snapshot.isDragging 
                                    ? 'shadow-lg ring-2 ring-blue-400 rotate-2 scale-105' 
                                    : 'hover:border-slate-300 hover:shadow-md'
                                }`}
                                onClick={() => navigate(`/leads/${lead.id}`)}
                              >
                                {/* Header */}
                                <div className="flex items-start justify-between mb-3">
                                  <div className="flex items-center gap-2">
                                    <GripVertical className="w-5 h-5 text-slate-300 cursor-grab" />
                                    <h4 className="font-semibold text-slate-800 text-base">{lead.name}</h4>
                                  </div>
                                </div>

                                {/* Program */}
                                {lead.program && (
                                  <p className="text-sm text-slate-600 mb-2 flex items-center gap-2">
                                    <Building className="w-4 h-4 text-slate-400" />
                                    {lead.program}
                                  </p>
                                )}

                                {/* School */}
                                {lead.school && (
                                  <p className="text-sm text-slate-500 mb-3 flex items-center gap-2">
                                    <span className="text-lg">🏫</span>
                                    {lead.school}
                                  </p>
                                )}

                                {/* Footer */}
                                <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100">
                                  {lead.next_follow_up && (
                                    <p className={`text-sm flex items-center gap-1.5 ${
                                      new Date(lead.next_follow_up) < new Date() ? 'text-red-500' : 'text-slate-500'
                                    }`}>
                                      <Calendar className="w-4 h-4" />
                                      {new Date(lead.next_follow_up).toLocaleDateString('id-ID', { 
                                        day: 'numeric', 
                                        month: 'short' 
                                      })}
                                    </p>
                                  )}
                                  {lead.phone && (
                                    <a 
                                      href={`https://wa.me/${lead.phone}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      onClick={(e) => e.stopPropagation()}
                                      className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium transition-colors"
                                    >
                                      <MessageCircle className="w-4 h-4" />
                                      WA
                                    </a>
                                  )}
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
    </div>
  )
}

