'use client'

import React, { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Paper,
  Grid,
  LinearProgress,
} from '@mui/material'
import {
  Person,
  Folder,
  People,
  AttachMoney,
  CheckCircle,
  Schedule,
} from '@mui/icons-material'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts'
import { api } from '../../lib/api'
import { useAuth } from '../../lib/useAuth'

const CHART_COLORS = ['#16a34a', '#0d9488', '#d97706', '#2563eb', '#dc2626', '#7c3aed']

export default function DashboardPage() {
  const { isAdmin } = useAuth()
  const [loading, setLoading] = useState(true)
  const [employees, setEmployees] = useState([])
  const [projects, setProjects] = useState([])
  const [teams, setTeams] = useState([])
  const [billing, setBilling] = useState({ list: [] })

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true)
      try {
        const [empRes, projRes, teamRes, billRes] = await Promise.all([
          api.get('/api/employee'),
          api.get('/api/project'),
          api.get('/api/team'),
          api.get('/api/billing'),
        ])
        setEmployees(empRes.data?.employees || [])
        setProjects(projRes.data?.projects || [])
        setTeams(teamRes.data?.teams || [])
        setBilling({ list: billRes.data?.list || [], month: billRes.data?.month, year: billRes.data?.year })
      } catch (err) {
        console.log(err)
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [])

  // Calculate designation counts
  const designationCount = employees.reduce((acc, e) => {
    const d = e.designation || 'Other'
    acc[d] = (acc[d] || 0) + 1
    return acc
  }, {})
  
  const designationData = Object.entries(designationCount)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)

  // Calculate project status counts
  const statusCount = projects.reduce((acc, p) => {
    const s = p.status || 'active'
    acc[s] = (acc[s] || 0) + 1
    return acc
  }, {})
  
  const statusData = Object.entries(statusCount).map(([name, value]) => ({ 
    name: name.charAt(0).toUpperCase() + name.slice(1), 
    value 
  }))

  // Calculate billing stats
  const totalSalary = billing.list.reduce((sum, b) => sum + (b.salary || 0), 0)
  const confirmedCount = billing.list.filter((b) => b.managerConfirmed && b.employeeConfirmed).length
  const pendingCount = billing.list.length - confirmedCount

  // Get top salaries with full names
  const topSalaries = [...employees]
    .sort((a, b) => (b.salary || 0) - (a.salary || 0))
    .slice(0, 6)
    .map((e) => ({ 
      name: e.name || 'N/A', 
      shortName: e.name?.split(' ')[0] || 'N/A',
      salary: e.salary || 0 
    }))

  // Stat cards configuration
  const statCards = [
    { title: 'Total Employees', value: employees.length, icon: <Person />, color: '#16a34a' },
    { title: 'Active Projects', value: projects.length, icon: <Folder />, color: '#15803d' },
    { title: 'Teams', value: teams.length, icon: <People />, color: '#22c55e' },
    ...(isAdmin ? [{ title: 'Monthly Payroll', value: `Rs ${(totalSalary / 1000).toFixed(0)}K`, icon: <AttachMoney />, color: '#d97706' }] : []),
  ]

  const monthNames = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#111827', letterSpacing: '-0.02em', mb: 3 }}>
          Dashboard
        </Typography>
        <LinearProgress sx={{ borderRadius: 2, height: 6 }} />
      </Box>
    )
  }

  const CustomTooltip = ({ active, payload, label, formatter }) => {
    if (!active || !payload?.length) return null
    return (
      <Paper elevation={8} sx={{ p: 1.5, borderRadius: 2, border: '1px solid #e5e7eb', minWidth: 150 }}>
        <Typography sx={{ fontSize: '0.75rem', color: '#6b7280', textTransform: 'capitalize', mb: 0.5 }}>{label}</Typography>
        <Typography sx={{ fontSize: '0.9375rem', fontWeight: 700, color: '#111827' }}>
          {formatter ? formatter(payload[0]?.value) : payload[0]?.value}
        </Typography>
      </Paper>
    )
  }

  return (
    <Box sx={{ p: 3, width: '100%', maxWidth: '1800px', mx: 'auto' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#111827', letterSpacing: '-0.03em', fontSize: { xs: '1.5rem', md: '1.75rem' } }}>
            Dashboard
          </Typography>
          <Typography variant="body2" sx={{ color: '#6b7280', fontSize: '0.875rem', mt: 0.5 }}>
            Overview of your organization
          </Typography>
        </Box>
        {billing.month && billing.year && (
          <Box sx={{ bgcolor: '#f0fdf4', px: 2.5, py: 1, borderRadius: 2, border: '1px solid #bbf7d0' }}>
            <Typography variant="body2" sx={{ color: '#15803d', fontWeight: 600, fontSize: '0.875rem' }}>
              {monthNames[billing.month]} {billing.year}
            </Typography>
          </Box>
        )}
      </Box>

      {/* Stat Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {statCards.map((card) => (
          <Grid item xs={12} sm={6} md={3} key={card.title}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 3,
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                bgcolor: '#fff',
                border: '1px solid #e5e7eb',
                boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                transition: 'all 0.2s ease',
                '&:hover': { 
                  boxShadow: '0 4px 12px rgba(22,163,74,0.12)', 
                  borderColor: 'rgba(22,163,74,0.3)' 
                },
              }}
            >
              <Box sx={{ 
                width: 52, 
                height: 52, 
                borderRadius: 2, 
                bgcolor: `${card.color}15`, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                color: card.color 
              }}>
                {React.cloneElement(card.icon, { sx: { fontSize: 28 } })}
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography sx={{ color: '#6b7280', fontSize: '0.875rem', fontWeight: 500, mb: 0.5 }}>
                  {card.title}
                </Typography>
                <Typography sx={{ color: '#111827', fontWeight: 700, fontSize: '1.75rem', lineHeight: 1.2, letterSpacing: '-0.02em' }}>
                  {card.value}
                </Typography>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Charts Grid */}
      <Grid container spacing={3}>
        {/* Employees by Designation - Full Width Chart */}
        {/* <Grid item xs={12}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              height: 550,
              border: '1px solid #e5e7eb',
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1.25rem', mb: 2, color: '#111827' }}>
              Employees by Designation
            </Typography>
            <Box sx={{ flex: 1, minHeight: 0, width: '100%' }}>
              {designationData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart 
                    data={designationData} 
                    layout="vertical" 
                    margin={{ top: 20, right: 40, left: 180, bottom: 20 }}
                    barSize={30}
                  >
                    <defs>
                      <linearGradient id="barGradient" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#16a34a" stopOpacity={0.9} />
                        <stop offset="100%" stopColor="#22c55e" stopOpacity={1} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" horizontal={false} />
                    <XAxis 
                      type="number" 
                      tick={{ fontSize: 13, fill: '#4b5563', fontWeight: 500 }} 
                      axisLine={{ stroke: '#d1d5db' }}
                      tickLine={{ stroke: '#d1d5db' }}
                    />
                    <YAxis 
                      dataKey="name" 
                      type="category" 
                      width={170}
                      tick={{ fontSize: 14, fill: '#1f2937', fontWeight: 500 }} 
                      axisLine={{ stroke: '#d1d5db' }}
                      tickLine={{ stroke: '#d1d5db' }}
                      tickMargin={8}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(22,163,74,0.08)' }} />
                    <Bar dataKey="count" fill="url(#barGradient)" radius={[0, 8, 8, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                  <Typography sx={{ color: '#9ca3af', fontSize: '1.1rem' }}>No employee data yet</Typography>
                </Box>
              )}
            </Box>
          </Paper>
        </Grid> */}

        {/* Projects by Status */}
        {/* <Grid item xs={12} md={6}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              height: 500,
              border: '1px solid #e5e7eb',
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1.25rem', mb: 2, color: '#111827' }}>
              Projects by Status
            </Typography>
            <Box sx={{ flex: 1, minHeight: 0, width: '100%' }}>
              {statusData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="45%"
                      innerRadius={80}
                      outerRadius={140}
                      paddingAngle={4}
                      label={({ name, value, percent }) => 
                        `${name}: ${value} (${(percent * 100).toFixed(0)}%)`
                      }
                      labelLine={{ stroke: '#64748b', strokeWidth: 1.5, strokeDasharray: '' }}
                    >
                      {statusData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value) => [`${value} projects`, 'Count']}
                    />
                    <Legend 
                      verticalAlign="bottom" 
                      align="center"
                      wrapperStyle={{ 
                        paddingTop: 30,
                        fontSize: '14px',
                        fontWeight: 500
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                  <Typography sx={{ color: '#9ca3af', fontSize: '1.1rem' }}>No project data yet</Typography>
                </Box>
              )}
            </Box>
          </Paper>
        </Grid> */}

        {/* Admin Only Sections */}
        {isAdmin && (
          <>
            {/* Top Salaries */}
            <Grid item xs={12} md={6}>
              {/* <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  height: 500,
                  border: '1px solid #e5e7eb',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1.25rem', mb: 2, color: '#111827' }}>
                  Top Salaries
                </Typography>
                <Box sx={{ flex: 1, minHeight: 0, width: '100%' }}>
                  {topSalaries.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart 
                        data={topSalaries} 
                        layout="vertical" 
                        margin={{ top: 20, right: 40, left: 100, bottom: 20 }}
                        barSize={35}
                      >
                        <defs>
                          <linearGradient id="salaryGradient" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stopColor="#16a34a" stopOpacity={0.9} />
                            <stop offset="100%" stopColor="#22c55e" stopOpacity={1} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" horizontal={false} />
                        <XAxis 
                          type="number" 
                          tick={{ fontSize: 13, fill: '#4b5563', fontWeight: 500 }} 
                          tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}K`} 
                          axisLine={{ stroke: '#d1d5db' }}
                          tickLine={{ stroke: '#d1d5db' }}
                        />
                        <YAxis 
                          dataKey="name" 
                          type="category" 
                          width={90}
                          tick={{ fontSize: 14, fill: '#1f2937', fontWeight: 500 }} 
                          axisLine={{ stroke: '#d1d5db' }}
                          tickLine={{ stroke: '#d1d5db' }}
                          tickMargin={8}
                        />
                        <Tooltip 
                          content={<CustomTooltip formatter={(v) => `₹${Number(v)?.toLocaleString()}`} />}
                          cursor={{ fill: 'rgba(22,163,74,0.08)' }}
                        />
                        <Bar dataKey="salary" fill="url(#salaryGradient)" radius={[0, 8, 8, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                      <Typography sx={{ color: '#9ca3af', fontSize: '1.1rem' }}>No salary data yet</Typography>
                    </Box>
                  )}
                </Box>
              </Paper> */}
            </Grid>

            {/* Billing Status */}
            <Grid item xs={12}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  border: '1px solid #e5e7eb',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1.25rem', mb: 3, color: '#111827' }}>
                  Billing Status
                </Typography>
                
                <Grid container spacing={3}>
                  <Grid item xs={12} md={4}>
                    <Paper sx={{ 
                      p: 3, 
                      bgcolor: '#f0fdf4', 
                      border: '1px solid #bbf7d0', 
                      borderRadius: 2,
                      height: '100%'
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                        <CheckCircle sx={{ color: '#16a34a', fontSize: 32 }} />
                        <Typography variant="h6" sx={{ color: '#166534', fontWeight: 600 }}>Confirmed</Typography>
                      </Box>
                      <Typography variant="h2" sx={{ fontWeight: 700, color: '#15803d', fontSize: '3rem' }}>
                        {confirmedCount}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#166534', mt: 1 }}>
                        entries fully confirmed
                      </Typography>
                    </Paper>
                  </Grid>
                  
                  <Grid item xs={12} md={4}>
                    <Paper sx={{ 
                      p: 3, 
                      bgcolor: '#fffbeb', 
                      border: '1px solid #fde68a', 
                      borderRadius: 2,
                      height: '100%'
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                        <Schedule sx={{ color: '#d97706', fontSize: 32 }} />
                        <Typography variant="h6" sx={{ color: '#92400e', fontWeight: 600 }}>Pending</Typography>
                      </Box>
                      <Typography variant="h2" sx={{ fontWeight: 700, color: '#b45309', fontSize: '3rem' }}>
                        {pendingCount}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#92400e', mt: 1 }}>
                        entries pending confirmation
                      </Typography>
                    </Paper>
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <Paper sx={{ 
                      p: 3, 
                      bgcolor: '#f9fafb', 
                      border: '1px solid #e5e7eb', 
                      borderRadius: 2,
                      height: '100%'
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                        <AttachMoney sx={{ color: '#16a34a', fontSize: 32 }} />
                        <Typography variant="h6" sx={{ color: '#111827', fontWeight: 600 }}>Total Payroll</Typography>
                      </Box>
                      <Typography variant="h2" sx={{ fontWeight: 700, color: '#16a34a', fontSize: '2.5rem' }}>
                        ₹{totalSalary.toLocaleString()}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#6b7280', mt: 1 }}>
                        monthly total
                      </Typography>
                    </Paper>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          </>
        )}
      </Grid>
    </Box>
  )
}