import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  Users, 
  UserPlus, 
  GraduationCap, 
  Flame, 
  ArrowRight, 
  Clock, 
  Activity,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  Calendar,
  CheckCircle2,
  XCircle,
  AlertCircle,
  UserCog,
  UsersRound
} from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'
import { useReportStore, useActivityStore, useLeadStore, useUserStore, useAuthStore } from '@/store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { formatDate, formatDateTime } from '@/lib/utils'

const COLORS = ['#5E6AD2', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#06B6D4', '#71717A']

const statusLabels = {
  new: 'New',
  contacted: 'Contacted',
  follow_up: 'Follow Up',
  interested: 'Interested',
  registered: 'Registered',
  enrolled: 'Enrolled',
  lost: 'Lost'
}

const statusConfig = {
  new: { color: 'bg-info/10 text-info border-info/20', icon: AlertCircle },
  contacted: { color: 'bg-warning/10 text-warning border-warning/20', icon: Clock },
  follow_up: { color: 'bg-warning/10 text-warning border-warning/20', icon: Clock },
  interested: { color: 'bg-primary/10 text-primary border-primary/20', icon: Flame },
  registered: { color: 'bg-success/10 text-success border-success/20', icon: CheckCircle2 },
  enrolled: { color: 'bg-success/10 text-success border-success/20', icon: GraduationCap },
  lost: { color: 'bg-danger/10 text-danger border-danger/20', icon: XCircle }
}

export default function Dashboard() {
  const { stats, fetchStats, isLoading } = useReportStore()
  const { activities, fetchActivities } = useActivityStore()
  const { leads, fetchLeads } = useLeadStore()
  const { staffStats, fetchStaffStats } = useUserStore()
  const { user: authUser } = useAuthStore()

  useEffect(() => {
    fetchStats()
    fetchActivities(10)
    fetchLeads()
    // Only fetch staff stats for admin/masteradmin
    if (authUser?.role === 'admin' || authUser?.role === 'masteradmin') {
      fetchStaffStats()
    }
  }, [authUser])

  const upcomingFollowUps = leads
    .filter(l => l.next_follow_up && l.status !== 'enrolled' && l.status !== 'lost')
    .sort((a, b) => new Date(a.next_follow_up) - new Date(b.next_follow_up))
    .slice(0, 5)

  const getStatusBadge = (status) => {
    const config = statusConfig[status] || statusConfig.new
    const Icon = config.icon
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg border ${config.color}`}>
        <Icon className="w-3 h-3" />
        {statusLabels[status] || status}
      </span>
    )
  }

  const getActionBadge = (action) => {
    const badges = {
      created: 'bg-success/10 text-success border-success/20',
      updated: 'bg-primary/10 text-primary border-primary/20',
      deleted: 'bg-danger/10 text-danger border-danger/20',
      status_changed: 'bg-secondary/10 text-secondary border-secondary/20',
      contacted_wa: 'bg-success/10 text-success border-success/20',
      follow_up_scheduled: 'bg-warning/10 text-warning border-warning/20'
    }
    return badges[action] || 'bg-surface-light text-text-secondary border-border'
  }

  if (isLoading && !stats) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
          <p className="text-sm text-text-muted">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  const statCards = [
    {
      title: 'Total Leads',
      value: stats?.totalLeads || 0,
      change: '+12%',
      trend: 'up',
      icon: Users,
      color: 'from-primary to-primary-light',
      bgColor: 'bg-primary/10'
    },
    {
      title: 'New Leads',
      value: stats?.newLeads || 0,
      change: '+8%',
      trend: 'up',
      icon: UserPlus,
      color: 'from-info to-info-light',
      bgColor: 'bg-info/10'
    },
    {
      title: 'Registered',
      value: stats?.registered || 0,
      change: '+24%',
      trend: 'up',
      icon: GraduationCap,
      color: 'from-success to-success-light',
      bgColor: 'bg-success/10'
    },
    {
      title: 'Hot Leads',
      value: stats?.hotLeads || 0,
      change: '-3%',
      trend: 'down',
      icon: Flame,
      color: 'from-danger to-danger-light',
      bgColor: 'bg-danger/10'
    }
  ]

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
          <p className="text-sm text-text-muted mt-1">Track your CRM performance and activities</p>
        </div>
        <div className="flex items-center gap-3">
          <select className="px-4 py-2 bg-surface border border-border rounded-xl text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30">
            <option>Last 7 days</option>
            <option>Last 30 days</option>
            <option>Last 90 days</option>
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <div 
            key={stat.title}
            className="group card card-hover p-5 animate-slide-up"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex items-start justify-between">
              <div className={`p-2.5 rounded-xl ${stat.bgColor}`}>
                <stat.icon className={`w-5 h-5 text-${stat.color.split(' ')[0].replace('from-', '')}`} />
              </div>
              <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium ${
                stat.trend === 'up' 
                  ? 'bg-success/10 text-success' 
                  : 'bg-danger/10 text-danger'
              }`}>
                {stat.trend === 'up' ? (
                  <TrendingUp className="w-3 h-3" />
                ) : (
                  <TrendingDown className="w-3 h-3" />
                )}
                {stat.change}
              </div>
            </div>
            <div className="mt-4">
              <p className="text-3xl font-bold text-foreground">{stat.value}</p>
              <p className="text-sm text-text-muted mt-1">{stat.title}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Staff Overview - Only show for admin/masteradmin */}
      {(authUser?.role === 'admin' || authUser?.role === 'masteradmin') && staffStats && (
        <div className="card animate-slide-up" style={{ animationDelay: '150ms' }}>
          <div className="p-5 border-b border-border">
            <div className="flex items-center gap-2">
              <UsersRound className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-foreground">Staff Performance Overview</h3>
            </div>
            <p className="text-sm text-text-muted mt-1">Leads created by each staff member</p>
          </div>
          <div className="p-5">
            {staffStats.staffUsers && staffStats.staffUsers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {staffStats.staffUsers.map((staff) => (
                  <div key={staff.id} className="flex items-center gap-3 p-3 bg-surface-light rounded-xl">
                    <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                      <UserCog className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{staff.name}</p>
                      <p className="text-sm text-text-muted">{staff.team}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary">{staff.leads_count}</p>
                      <p className="text-xs text-text-muted">leads</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <UserCog className="w-12 h-12 mx-auto mb-3 text-text-muted opacity-50" />
                <p className="text-text-muted">No staff members yet. Add staff users to track performance.</p>
              </div>
            )}
            
            {/* Team Summary */}
            {staffStats.leadsByTeam && staffStats.leadsByTeam.length > 0 && (
              <div className="mt-6 pt-6 border-t border-border">
                <h4 className="font-medium text-foreground mb-4">Leads by Team</h4>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={staffStats.leadsByTeam.map(t => ({ name: t.team || 'Unknown', leads: t.leads_count }))}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#27272A" vertical={false} />
                      <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#71717A' }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 12, fill: '#71717A' }} axisLine={false} tickLine={false} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#27272A', 
                          border: '1px solid #3F3F46',
                          borderRadius: '12px',
                          padding: '12px'
                        }}
                        labelStyle={{ color: '#FAFAFA' }}
                        itemStyle={{ color: '#A1A1AA' }}
                      />
                      <Bar dataKey="leads" fill="#5E6AD2" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Lead Status Distribution */}
        <div className="card p-6 animate-slide-up" style={{ animationDelay: '200ms' }}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-semibold text-foreground">Lead Status</h3>
              <p className="text-sm text-text-muted">Distribution by status</p>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats?.byStatus?.map(s => ({ name: statusLabels[s.status] || s.status, value: s.count })) || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272A" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#71717A' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#71717A' }} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#27272A', 
                    border: '1px solid #3F3F46',
                    borderRadius: '12px',
                    padding: '12px'
                  }}
                  labelStyle={{ color: '#FAFAFA' }}
                  itemStyle={{ color: '#A1A1AA' }}
                />
                <Bar dataKey="value" fill="#5E6AD2" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Lead Source Distribution */}
        <div className="card p-6 animate-slide-up" style={{ animationDelay: '250ms' }}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-semibold text-foreground">Lead Sources</h3>
              <p className="text-sm text-text-muted">Distribution by source</p>
            </div>
          </div>
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats?.bySource?.map(s => ({ name: s.source || 'Unknown', value: s.count })) || []}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {(stats?.bySource || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#27272A', 
                    border: '1px solid #3F3F46',
                    borderRadius: '12px',
                    padding: '12px'
                  }}
                  labelStyle={{ color: '#FAFAFA' }}
                  itemStyle={{ color: '#A1A1AA' }}
                />
                <Legend 
                  verticalAlign="bottom" 
                  height={36}
                  formatter={(value) => <span className="text-xs text-text-muted">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Follow Ups */}
        <div className="card animate-slide-up" style={{ animationDelay: '300ms' }}>
          <div className="p-5 border-b border-border flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-foreground">Upcoming Follow Ups</h3>
              <p className="text-sm text-text-muted">Scheduled follow ups</p>
            </div>
            <Link to="/leads" className="text-sm text-primary hover:text-primary-light flex items-center gap-1 transition-colors">
              View All <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="p-3">
            {upcomingFollowUps.length > 0 ? (
              <div className="space-y-2">
                {upcomingFollowUps.map((lead) => (
                  <Link 
                    key={lead.id} 
                    to={`/leads/${lead.id}`}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-surface-light transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-medium group-hover:bg-primary/20 transition-colors">
                        {lead.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{lead.name}</p>
                        <p className="text-sm text-text-muted">{lead.program}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {getStatusBadge(lead.status)}
                      <div className="text-right">
                        <p className={`text-sm font-medium ${new Date(lead.next_follow_up) < new Date() ? 'text-danger' : 'text-text-secondary'}`}>
                          {formatDate(lead.next_follow_up)}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Clock className="w-12 h-12 mx-auto mb-3 text-text-muted opacity-50" />
                <p className="text-text-muted">No upcoming follow ups</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Activities */}
        <div className="card animate-slide-up" style={{ animationDelay: '350ms' }}>
          <div className="p-5 border-b border-border flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-foreground">Recent Activities</h3>
              <p className="text-sm text-text-muted">Latest system activities</p>
            </div>
            <button className="text-sm text-primary hover:text-primary-light flex items-center gap-1 transition-colors">
              View All <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
          <div className="p-3">
            {activities.length > 0 ? (
              <div className="space-y-1">
                {activities.map((activity, index) => (
                  <div 
                    key={activity.id} 
                    className="flex items-start gap-4 p-3 rounded-xl hover:bg-surface-light transition-colors"
                  >
                    <div className="w-8 h-8 rounded-lg bg-surface-light flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Activity className="w-4 h-4 text-text-muted" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground">
                        <span className="font-medium">{activity.lead_name || 'System'}</span>
                        <span className="text-text-secondary"> — {activity.description}</span>
                      </p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className={`text-xs px-2 py-0.5 rounded-md border ${getActionBadge(activity.action)}`}>
                          {activity.action.replace('_', ' ')}
                        </span>
                        <span className="text-xs text-text-muted">by {activity.user_name}</span>
                        <span className="text-xs text-text-muted">•</span>
                        <span className="text-xs text-text-muted">
                          {formatDateTime(activity.created_at)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Activity className="w-12 h-12 mx-auto mb-3 text-text-muted opacity-50" />
                <p className="text-text-muted">No recent activities</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

