import * as XLSX from 'xlsx'
import jsPDF from 'jspdf'
import 'jspdf-autotable'

// Format date for display
const formatDate = (date) => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
}

// Status labels mapping
const statusLabels = {
  new: 'New',
  contacted: 'Contacted',
  follow_up: 'Follow Up',
  interested: 'Interested',
  registered: 'Registered',
  enrolled: 'Enrolled',
  lost: 'Lost'
}

const registrationLabels = {
  reguler: 'Reguler',
  beamsiswa_kip: 'Beasiswa KIP'
}

const classLabels = {
  pagi: 'Kelas Pagi',
  malam: 'Kelas Malam'
}

// Export leads to Excel
export const exportLeadsToExcel = (leads, filename = 'leads-export') => {
  // Transform data for Excel
  const data = leads.map((lead, index) => ({
    'No': index + 1,
    'Nama': lead.name,
    'WhatsApp': lead.phone,
    'Email': lead.email,
    'Sekolah': lead.school || '-',
    'Program': lead.program || '-',
    'Jenis Pendaftaran': registrationLabels[lead.registration_type] || lead.registration_type || '-',
    'Kelas': classLabels[lead.class_type] || lead.class_type || '-',
    'Status': statusLabels[lead.status] || lead.status || '-',
    'Sumber': lead.source || '-',
    'Priority': lead.priority || '-',
    'Catatan': lead.notes || '-',
    'Tgl Dibuat': formatDate(lead.created_at)
  }))

  // Create worksheet
  const ws = XLSX.utils.json_to_sheet(data)
  
  // Set column widths
  ws['!cols'] = [
    { wch: 5 },   // No
    { wch: 25 },  // Nama
    { wch: 15 },  // WhatsApp
    { wch: 25 },  // Email
    { wch: 20 },  // Sekolah
    { wch: 20 },  // Program
    { wch: 18 },  // Jenis Pendaftaran
    { wch: 12 },  // Kelas
    { wch: 12 },  // Status
    { wch: 15 },  // Sumber
    { wch: 10 },  // Priority
    { wch: 30 },  // Catatan
    { wch: 15 }   // Tgl Dibuat
  ]

  // Create workbook
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Leads')

  // Generate filename with date
  const dateStr = new Date().toISOString().split('T')[0]
  const fullFilename = `${filename}-${dateStr}.xlsx`

  // Download
  XLSX.writeFile(wb, fullFilename)
}

// Export leads to PDF
export const exportLeadsToPDF = (leads, filename = 'leads-export') => {
  const doc = new jsPDF()

  // Title
  doc.setFontSize(18)
  doc.text('STIE ARLINDO - Data Leads', 14, 22)
  
  doc.setFontSize(10)
  doc.text(`Tanggal Export: ${new Date().toLocaleDateString('id-ID')}`, 14, 30)
  doc.text(`Total Leads: ${leads.length}`, 14, 36)

  // Prepare table data
  const tableData = leads.map(lead => [
    lead.name,
    lead.phone || '-',
    lead.email || '-',
    lead.program || '-',
    registrationLabels[lead.registration_type] || lead.registration_type || '-',
    classLabels[lead.class_type] || lead.class_type || '-',
    statusLabels[lead.status] || lead.status || '-',
    lead.source || '-',
    formatDate(lead.created_at)
  ])

  // Generate table
  doc.autoTable({
    head: [['Nama', 'WhatsApp', 'Email', 'Program', 'Jenis Daftar', 'Kelas', 'Status', 'Sumber', 'Tgl Dibuat']],
    body: tableData,
    startY: 42,
    styles: {
      fontSize: 8,
      cellPadding: 2
    },
    headStyles: {
      fillColor: [94, 106, 210],
      textColor: 255,
      fontStyle: 'bold'
    },
    alternateRowStyles: {
      fillColor: [245, 247, 250]
    }
  })

  // Generate filename with date
  const dateStr = new Date().toISOString().split('T')[0]
  const fullFilename = `${filename}-${dateStr}.pdf`

  // Download
  doc.save(fullFilename)
}

// Export stats/report to Excel
export const exportStatsToExcel = (stats, filename = 'reports-export') => {
  const data = []
  
  // Summary section
  data.push({ 'Metric': 'Total Leads', 'Value': stats.totalLeads || 0 })
  data.push({ 'Metric': 'New Leads', 'Value': stats.newLeads || 0 })
  data.push({ 'Metric': 'Registered', 'Value': stats.registered || 0 })
  data.push({ 'Metric': 'Enrolled', 'Value': stats.enrolled || 0 })
  data.push({ 'Metric': 'Hot Leads', 'Value': stats.hotLeads || 0 })
  data.push({ 'Metric': 'Lost Leads', 'Value': stats.lostLeads || 0 })
  data.push({ 'Metric': 'Conversion Rate (%)', 'Value': stats.conversionRate || 0 })
  data.push({ 'Metric': 'Lost Rate (%)', 'Value': stats.lostRate || 0 })
  data.push({})

  // Status breakdown
  data.push({ 'Metric': 'LEADS BY STATUS', 'Value': '' })
  if (stats.byStatus) {
    stats.byStatus.forEach(item => {
      data.push({ 'Metric': statusLabels[item.status] || item.status, 'Value': item.count })
    })
  }
  data.push({})

  // Source breakdown
  data.push({ 'Metric': 'LEADS BY SOURCE', 'Value': '' })
  if (stats.bySource) {
    stats.bySource.forEach(item => {
      data.push({ 'Metric': item.source || 'Unknown', 'Value': item.count })
    })
  }
  data.push({})

  // Program breakdown
  data.push({ 'Metric': 'LEADS BY PROGRAM', 'Value': '' })
  if (stats.byProgram) {
    stats.byProgram.forEach(item => {
      data.push({ 'Metric': item.program || 'Unknown', 'Value': item.count })
    })
  }

  // Create worksheet
  const ws = XLSX.utils.json_to_sheet(data)
  ws['!cols'] = [{ wch: 25 }, { wch: 15 }]

  // Create workbook
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Reports')

  // Generate filename with date
  const dateStr = new Date().toISOString().split('T')[0]
  const fullFilename = `${filename}-${dateStr}.xlsx`

  // Download
  XLSX.writeFile(wb, fullFilename)
}

// Export stats/report to PDF
export const exportStatsToPDF = (stats, filename = 'reports-export') => {
  const doc = new jsPDF()

  // Title
  doc.setFontSize(18)
  doc.text('STIE ARLINDO - Laporan CRM', 14, 22)
  
  doc.setFontSize(10)
  doc.text(`Tanggal Export: ${new Date().toLocaleDateString('id-ID')}`, 14, 30)

  let yPos = 40

  // Summary section
  doc.setFontSize(14)
  doc.text('Ringkasan', 14, yPos)
  yPos += 8

  doc.setFontSize(10)
  const summaryData = [
    ['Total Leads', stats.totalLeads || 0],
    ['New Leads', stats.newLeads || 0],
    ['Registered', stats.registered || 0],
    ['Enrolled', stats.enrolled || 0],
    ['Hot Leads', stats.hotLeads || 0],
    ['Lost Leads', stats.lostLeads || 0],
    ['Conversion Rate', `${stats.conversionRate || 0}%`],
    ['Lost Rate', `${stats.lostRate || 0}%`]
  ]

  doc.autoTable({
    head: [['Metric', 'Value']],
    body: summaryData,
    startY: yPos,
    styles: { fontSize: 10 },
    headStyles: { fillColor: [94, 106, 210] }
  })

  yPos = doc.lastAutoTable.finalY + 15

  // Status breakdown
  if (stats.byStatus && stats.byStatus.length > 0) {
    doc.setFontSize(14)
    doc.text('Leads by Status', 14, yPos)
    yPos += 8

    const statusData = stats.byStatus.map(item => [
      statusLabels[item.status] || item.status,
      item.count
    ])

    doc.autoTable({
      head: [['Status', 'Jumlah']],
      body: statusData,
      startY: yPos,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [94, 106, 210] }
    })

    yPos = doc.lastAutoTable.finalY + 15
  }

  // Source breakdown
  if (stats.bySource && stats.bySource.length > 0) {
    doc.setFontSize(14)
    doc.text('Leads by Source', 14, yPos)
    yPos += 8

    const sourceData = stats.bySource.map(item => [
      item.source || 'Unknown',
      item.count
    ])

    doc.autoTable({
      head: [['Source', 'Jumlah']],
      body: sourceData,
      startY: yPos,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [94, 106, 210] }
    })

    yPos = doc.lastAutoTable.finalY + 15
  }

  // Program breakdown
  if (stats.byProgram && stats.byProgram.length > 0) {
    doc.setFontSize(14)
    doc.text('Leads by Program', 14, yPos)
    yPos += 8

    const programData = stats.byProgram.map(item => [
      item.program || 'Unknown',
      item.count
    ])

    doc.autoTable({
      head: [['Program', 'Jumlah']],
      body: programData,
      startY: yPos,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [94, 106, 210] }
    })
  }

  // Generate filename with date
  const dateStr = new Date().toISOString().split('T')[0]
  const fullFilename = `${filename}-${dateStr}.pdf`

  // Download
  doc.save(fullFilename)
}

