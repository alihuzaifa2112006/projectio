'use client'

import React, { useEffect, useState } from 'react'
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  LinearProgress,
} from '@mui/material'
import { Search } from '@mui/icons-material'
import { api } from '../../../lib/api'
import { useAuth } from '../../../lib/useAuth'

export default function BillingPage() {
  const { isAdmin, userId } = useAuth()
  const [list, setList] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [month, setMonth] = useState('')
  const [year, setYear] = useState('')

  const fetchBilling = () => {
    setLoading(true)
    api.get('/billing').then((res) => { setList(res.data.list || []); setMonth(res.data.month); setYear(res.data.year) }).catch((err) => console.log(err)).finally(() => setLoading(false))
  }

  useEffect(() => fetchBilling(), [])

  const handleManagerConfirm = async (employeeId, checked) => {
    try {
      await api.put('/billing', { employeeId, managerConfirmed: checked })
      setList((prev) => prev.map((r) => (r._id === employeeId ? { ...r, managerConfirmed: checked } : r)))
    } catch (err) {
      console.log(err)
    }
  }

  const handleEmployeeConfirm = async (employeeId, checked) => {
    try {
      await api.put('/billing', { employeeId, employeeConfirmed: checked })
      setList((prev) => prev.map((r) => (r._id === employeeId ? { ...r, employeeConfirmed: checked } : r)))
    } catch (err) {
      console.log(err)
    }
  }

  const filteredList = search.trim()
    ? list.filter((r) => r.name?.toLowerCase().includes(search.toLowerCase()))
    : list

  const monthNames = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 1 }}>
        <Typography variant="h4" sx={{ fontWeight: 600, color: '#111827', letterSpacing: '-0.02em', fontSize: '1.5rem' }}>
          Billing
        </Typography>
        {month && year && (
          <Typography variant="body2" sx={{ color: '#6b7280', fontSize: '0.8125rem' }}>
            {monthNames[month]} {year}
          </Typography>
        )}
      </Box>

      <Typography variant="body2" sx={{ color: '#6b7280', mb: 2, fontSize: '0.8125rem' }}>
        Manager confirms salary approval. Employee confirms salary received.
      </Typography>

      <TextField
        fullWidth
        placeholder="Search by employee name..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        size="small"
        sx={{ mb: 2.5, '& .MuiOutlinedInput-root': { borderRadius: 1.5, bgcolor: '#ffffff', border: '1px solid #e5e7eb', fontSize: '0.875rem' } }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search color="action" />
            </InputAdornment>
          ),
        }}
      />

      <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
        {loading && <LinearProgress />}
        <TableContainer sx={{ minHeight: 400, maxHeight: 500, overflow: 'auto' }}>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow
                sx={{
                  bgcolor: '#14532d',
                  '& .MuiTableCell-root': {
                    position: 'sticky',
                    top: 0,
                    zIndex: 2,
                    bgcolor: '#14532d',
                    color: 'white',
                    fontWeight: 600,
                    fontSize: '0.8rem',
                    py: 1.5,
                  },
                }}
              >
                <TableCell>Employee Name</TableCell>
                <TableCell>Salary</TableCell>
                {isAdmin && <TableCell align="center">Manager Confirmed</TableCell>}
                <TableCell align="center">Employee Received</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredList.length > 0 ? (
                filteredList.map((row) => (
                  <TableRow key={row._id} sx={{ '&:nth-of-type(even)': { bgcolor: 'grey.50' }, '&:hover': { bgcolor: 'action.hover' } }}>
                    <TableCell sx={{ py: 1.25 }}>{row.name}</TableCell>
                    <TableCell sx={{ py: 1.25 }}>{row.salary?.toLocaleString()}</TableCell>
                    {isAdmin && (
                      <TableCell align="center" sx={{ py: 1.25 }}>
                        <Checkbox
                          checked={row.managerConfirmed}
                          onChange={(e) => handleManagerConfirm(row._id, e.target.checked)}
                          color="primary"
                          size="small"
                        />
                      </TableCell>
                    )}
                    <TableCell align="center" sx={{ py: 1.25 }}>
                      <Checkbox
                        checked={row.employeeConfirmed}
                        onChange={(e) => handleEmployeeConfirm(row._id, e.target.checked)}
                        color="success"
                        size="small"
                        disabled={(!isAdmin && String(row._id) !== String(userId)) || (!isAdmin && !row.managerConfirmed)}
                      />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={isAdmin ? 4 : 3} align="center" sx={{ py: 6 }}>
                    <Typography color="text.secondary">{loading ? 'Loading...' : 'No employees found'}</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  )
}
