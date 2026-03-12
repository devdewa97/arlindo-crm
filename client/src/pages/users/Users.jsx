import React, { useEffect, useState } from 'react'
import { Plus, Edit, Trash, Mail, Phone, Search, Shield, MoreVertical, UserCheck, UserX } from 'lucide-react'
import { useUserStore, useAuthStore } from '@/store'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/Dialog'
import { Label } from '@/components/ui/Label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select'
import { Avatar, AvatarFallback } from '@/components/ui/Avatar'
import { formatDate, getInitials } from '@/lib/utils'

const roleOptions = [
  { value: 'masteradmin', label: 'Master Admin' },
  { value: 'admin', label: 'Admin' },
  { value: 'staff', label: 'Staff' },
]

const teamOptions = [
  { value: 'Tim A', label: 'Tim A' },
  { value: 'Tim B', label: 'Tim B' },
  { value: 'Tim C', label: 'Tim C' },
  { value: 'Tim D', label: 'Tim D' },
]

const roleConfig = {
  masteradmin: { label: 'Master Admin', color: 'bg-purple-100 text-purple-700 border-purple-200', icon: Shield },
  admin: { label: 'Admin', color: 'bg-red-100 text-red-700 border-red-200', icon: Shield },
  staff: { label: 'Staff', color: 'bg-blue-100 text-blue-700 border-blue-200', icon: UserCheck },
  // Default fallback for unknown/missing roles
  unknown: { label: 'Unknown', color: 'bg-gray-100 text-gray-700 border-gray-200', icon: Shield },
}

// Default role config to use when role is undefined or not found
const defaultRoleConfig = { label: 'Unknown', color: 'bg-gray-100 text-gray-700 border-gray-200', icon: Shield }

export default function Users() {
  const { user: authUser } = useAuthStore()
  const { users, fetchUsers, createUser, updateUser, deleteUser, isLoading } = useUserStore()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [search, setSearch] = useState('')
  const [formData, setFormData] = useState({
    username: '', name: '', email: '', phone: '', role: 'staff', team: '', password: ''
  })

  useEffect(() => {
    if (authUser?.role === 'admin' || authUser?.role === 'masteradmin') {
      fetchUsers()
    }
  }, [authUser])

  // Check if user can access this page
  const canAccess = authUser?.role === 'admin' || authUser?.role === 'masteradmin'
  const isMasterAdmin = authUser?.role === 'masteradmin'

  // Get role options based on current user role
  const getAvailableRoles = () => {
    if (isMasterAdmin) {
      return roleOptions
    }
    // Admin can only create staff
    return roleOptions.filter(r => r.value === 'staff')
  }

  const filteredUsers = users.filter(u => 
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.username?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  )

  const handleSubmit = async () => {
    // Validate required fields
    if (!formData.username || !formData.name || (!editingUser && !formData.password)) {
      alert('Please fill in all required fields')
      return
    }

    // If role is staff, team is required
    if (formData.role === 'staff' && !formData.team) {
      alert('Please select a team for Staff role')
      return
    }

    if (editingUser) {
      const data = { ...formData }
      if (!data.password) delete data.password
      await updateUser(editingUser.id, data)
    } else {
      // Create new user
      const success = await createUser(formData)
      if (!success) {
        alert('Failed to create user. Username may already exist.')
        return
      }
    }
    setIsModalOpen(false)
    setEditingUser(null)
    setFormData({ username: '', name: '', email: '', phone: '', role: 'staff', team: '', password: '' })
    fetchUsers()
  }

  const handleEdit = (user) => {
    setEditingUser(user)
    setFormData({ 
      username: user.username, 
      name: user.name, 
      email: user.email || '', 
      phone: user.phone || '', 
      role: user.role, 
      team: user.team || '',
      password: '' 
    })
    setIsModalOpen(true)
  }

  const handleDelete = async (id) => {
    const userToDelete = users.find(u => u.id === id)
    
    if (userToDelete?.role === 'masteradmin' && !isMasterAdmin) {
      alert('Cannot delete Master Admin')
      return
    }
    
    if (window.confirm('Are you sure you want to delete this user?')) {
      await deleteUser(id)
      fetchUsers()
    }
  }

  const handleAddNew = () => {
    setEditingUser(null)
    setFormData({ username: '', name: '', email: '', phone: '', role: 'staff', team: '', password: '' })
    setIsModalOpen(true)
  }

  const handleRoleChange = (role) => {
    setFormData({...formData, role, team: role === 'staff' ? formData.team : ''})
  }

  const getRoleBadge = (role, team) => {
    // Defensive coding: Handle undefined/null role with optional chaining and default
    const safeRole = role || 'unknown'
    const config = roleConfig[safeRole] || defaultRoleConfig
    const Icon = config?.icon || Shield
    
    return (
      <div className="flex flex-col gap-1">
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg border ${config?.color || defaultRoleConfig.color}`}>
          <Icon className="w-3.5 h-3.5" />
          {config?.label || defaultRoleConfig.label}
        </span>
        {team && (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-medium rounded-md bg-gray-100 text-gray-600">
            {team}
          </span>
        )}
      </div>
    )
  }

  if (!canAccess) {
    return (
      <div className="p-6 flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-danger/10 flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-danger" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">Access Denied</h3>
          <p className="text-text-muted">You don't have permission to view this page.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Users</h1>
          <p className="text-sm text-text-muted mt-1">Manage team members and permissions</p>
        </div>
        <Button onClick={handleAddNew}>
          <Plus className="w-4 h-4 mr-2" />
          Add User
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <Input
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </Card>

      {/* Users Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Role / Team</th>
                <th>Joined</th>
                <th className="w-20">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="text-center py-12">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                      <p className="text-sm text-text-muted">Loading users...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-surface-light flex items-center justify-center">
                        <UserX className="w-6 h-6 text-text-muted" />
                      </div>
                      <p className="text-text-muted">No users found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u, index) => (
                  <tr 
                    key={u.id} 
                    className="group animate-slide-up"
                    style={{ animationDelay: `${index * 30}ms` }}
                  >
                    <td>
                      <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10">
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {getInitials(u.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-foreground">{u.name}</p>
                          <p className="text-xs text-text-muted">@{u.username}</p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-2 text-sm text-text-secondary">
                        <Mail className="w-4 h-4 text-text-muted" />
                        {u.email || '-'}
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-2 text-sm text-text-secondary">
                        <Phone className="w-4 h-4 text-text-muted" />
                        {u.phone || '-'}
                      </div>
                    </td>
                    <td>{getRoleBadge(u.role, u.team)}</td>
                    <td className="text-sm text-text-muted">{formatDate(u.created_at)}</td>
                    <td>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button 
                          variant="ghost" 
                          size="icon-sm"
                          onClick={() => handleEdit(u)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        {u.id !== authUser?.id && (
                          <Button 
                            variant="ghost" 
                            size="icon-sm"
                            onClick={() => handleDelete(u.id)}
                            className="hover:bg-danger/10"
                          >
                            <Trash className="w-4 h-4 text-danger" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Table Footer */}
        {filteredUsers.length > 0 && (
          <div className="px-6 py-4 border-t border-border flex items-center justify-between">
            <p className="text-sm text-text-muted">
              Showing {filteredUsers.length} of {users.length} users
            </p>
          </div>
        )}
      </Card>

      {/* Add/Edit Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingUser ? 'Edit User' : 'Add New User'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Username *</Label>
              <Input 
                value={formData.username} 
                onChange={(e) => setFormData({...formData, username: e.target.value})} 
                placeholder="Username"
                disabled={editingUser}
              />
            </div>
            <div className="space-y-2">
              <Label>Password {editingUser ? '(leave blank to keep)' : '*'}</Label>
              <Input 
                type="password"
                value={formData.password} 
                onChange={(e) => setFormData({...formData, password: e.target.value})} 
                placeholder="Password"
              />
            </div>
            <div className="space-y-2">
              <Label>Full Name *</Label>
              <Input 
                value={formData.name} 
                onChange={(e) => setFormData({...formData, name: e.target.value})} 
                placeholder="Full name"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Email</Label>
                <Input 
                  type="email"
                  value={formData.email} 
                  onChange={(e) => setFormData({...formData, email: e.target.value})} 
                  placeholder="email@example.com"
                />
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input 
                  value={formData.phone} 
                  onChange={(e) => setFormData({...formData, phone: e.target.value})} 
                  placeholder="+62xxx"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <Select value={formData.role} onValueChange={handleRoleChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {getAvailableRoles().map(r => <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            
            {/* Team selection - only show for Staff role */}
            {formData.role === 'staff' && (
              <div className="space-y-2">
                <Label>Tim/Team *</Label>
                <Select value={formData.team} onValueChange={(v) => setFormData({...formData, team: v})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih Tim" />
                  </SelectTrigger>
                  <SelectContent>
                    {teamOptions.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit}>{editingUser ? 'Update' : 'Add'} User</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

