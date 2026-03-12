import React, { useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, LineChart, Line } from 'recharts'
import { Download, FileText, TrendingUp, TrendingDown, Users, Percent, Flame, XCircle, CheckCircle2, FileSpreadsheet } from 'lucide-react'
import { useReportStore } from '@/store'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { exportStatsToExcel, exportStatsToPDF } from '@/lib/exportUtils'

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

const statCards = [
  { key: 'totalLeads', label: 'Total Leads', icon: Users, color: 'from-primary to-primary-light', bgColor: 'bg-primary/10' },
  { key: 'conversionRate', label: 'Conversion Rate', icon: Percent, color: 'from-success to-success-light', bgColor: 'bg-success/10', suffix: '%' },
  { key: 'hotLeads', label: 'Hot Leads', icon: Flame, color: 'from-danger to-danger-light', bgColor: 'bg-danger/10' },
  { key: 'lostRate', label: 'Lost Rate', icon: XCircle, color: 'from-warning to-warning-light', bgColor: 'bg-warning/10', suffix: '%' },
]

export default function Reports() {
  const { stats, fetchStats, isLoading } = useReportStore()

  useEffect(() => {
    fetchStats()
  }, [])

  // Export handlers
  const handleExportExcel = () => {
    if (stats) {
      exportStatsToExcel(stats)
    }
  }

  const handleExportPDF = () => {
    if (stats) {
      exportStatsToPDF(stats)
    }
  }

  if (isLoading || !stats) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
          <p className="text-sm text-text-muted">Loading reports...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Reports</h1>
          <p className="text-sm text-text-muted mt-1">Analytics and performance metrics</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="secondary" size="sm" onClick={handleExportPDF}>
            <FileText className="w-4 h-4 mr-2" />
            Export PDF
          </Button>
          <Button variant="secondary" size="sm" onClick={handleExportExcel}>
            <Download className="w-4 h-4 mr-2" />
            Export Excel
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <div 
            key={stat.key} 
            className="card p-5 animate-slide-up"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex items-start justify-between">
              <div className={`p-2.5 rounded-xl ${stat.bgColor}`}>
                <stat.icon className={`w-5 h-5 text-${stat.color.split(' ')[0].replace('from-', '')}`} />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-3xl font-bold text-foreground">
                {stat.key === 'conversionRate' || stat.key === 'lostRate' 
                  ? stats[stat.key] 
                  : stats.totalLeads || 0}
                {stat.suffix || ''}
              </p>
              <p className="text-sm text-text-muted mt-1">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Lead Status Funnel */}
        <div className="card p-6 animate-slide-up" style={{ animationDelay: '200ms' }}>
          <div className="mb-6">
            <h3 className="font-semibold text-foreground">Lead Status Distribution</h3>
            <p className="text-sm text-text-muted">Leads by status</p>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={stats.byStatus?.map(s => ({ name: statusLabels[s.status] || s.status, value: s.count })) || []} 
                layout="vertical"
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#27272A" horizontal={true} vertical={false} />
                <XAxis type="number" tick={{ fontSize: 11, fill: '#71717A' }} axisLine={false} tickLine={false} />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  tick={{ fontSize: 11, fill: '#A1A1AA' }} 
                  width={90} 
                  axisLine={false} 
                  tickLine={false} 
                />
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
                <Bar dataKey="value" fill="#5E6AD2" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Lead Sources Pie Chart */}
        <div className="card p-6 animate-slide-up" style={{ animationDelay: '250ms' }}>
          <div className="mb-6">
            <h3 className="font-semibold text-foreground">Lead Sources</h3>
            <p className="text-sm text-text-muted">Distribution by source</p>
          </div>
          <div className="h-72 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.bySource?.map(s => ({ name: s.source || 'Unknown', value: s.count })) || []}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={90}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {(stats.bySource || []).map((entry, index) => (
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

      {/* Program Interest Chart */}
      <div className="card p-6 animate-slide-up" style={{ animationDelay: '300ms' }}>
        <div className="mb-6">
          <h3 className="font-semibold text-foreground">Program Interest</h3>
          <p className="text-sm text-text-muted">Most popular programs</p>
        </div>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stats.byProgram?.map(s => ({ name: s.program || 'Unknown', value: s.count })) || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272A" vertical={false} />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 11, fill: '#71717A' }} 
                axisLine={false} 
                tickLine={false} 
              />
              <YAxis 
                tick={{ fontSize: 11, fill: '#71717A' }} 
                axisLine={false} 
                tickLine={false} 
              />
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
              <Bar dataKey="value" fill="#10B981" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-slide-up" style={{ animationDelay: '350ms' }}>
        <div className="card p-4 text-center">
          <div className="w-10 h-10 rounded-xl bg-info/10 flex items-center justify-center mx-auto mb-3">
            <Users className="w-5 h-5 text-info" />
          </div>
          <p className="text-2xl font-bold text-foreground">{stats.newLeads || 0}</p>
          <p className="text-sm text-text-muted">New Leads</p>
        </div>
        <div className="card p-4 text-center">
          <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center mx-auto mb-3">
            <CheckCircle2 className="w-5 h-5 text-success" />
          </div>
          <p className="text-2xl font-bold text-foreground">{stats.registered || 0}</p>
          <p className="text-sm text-text-muted">Registered</p>
        </div>
        <div className="card p-4 text-center">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
            <TrendingUp className="w-5 h-5 text-primary" />
          </div>
          <p className="text-2xl font-bold text-foreground">{stats.enrolled || 0}</p>
          <p className="text-sm text-text-muted">Enrolled</p>
        </div>
        <div className="card p-4 text-center">
          <div className="w-10 h-10 rounded-xl bg-danger/10 flex items-center justify-center mx-auto mb-3">
            <XCircle className="w-5 h-5 text-danger" />
          </div>
          <p className="text-2xl font-bold text-foreground">{stats.lostLeads || 0}</p>
          <p className="text-sm text-text-muted">Lost</p>
        </div>
      </div>
    </div>
  )
}
