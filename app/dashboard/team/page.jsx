'use client'

import React, { useEffect, useState } from 'react'
import {
  Box,
  Typography,
  Button,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Checkbox,
  ListItemText,
} from '@mui/material'
import { Search } from '@mui/icons-material'
import { api } from '../../../lib/api'
import { useAuth } from '../../../lib/useAuth'
import CustomDataGrid from '../../components/CustomDataGrid'
import ConfirmDialog from '../../components/ConfirmDialog'

const INITIAL_FORM = { name: '', assignedWork: '', employees: [] }

export default function TeamPage() {
  const { isAdmin } = useAuth()
  const [allTeams, setAllTeams] = useState([])
  const [allEmployees, setAllEmployees] = useState([])
  const [search, setSearch] = useState('')
  const [openDialog, setOpenDialog] = useState(false)
  const [formData, setFormData] = useState(INITIAL_FORM)
  const [editingId, setEditingId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [openConfirm, setOpenConfirm] = useState(false)
  const [deleteId, setDeleteId] = useState(null)
  const [gridLoading, setGridLoading] = useState(true)

  const fetchTeams = () => {
    setGridLoading(true)
    api.get('/api/team').then((res) => setAllTeams(res.data.teams || [])).catch((err) => console.log(err)).finally(() => setGridLoading(false))
  }

  const fetchEmployees = () => {
    api.get('/api/employee').then((res) => setAllEmployees(res.data.employees || [])).catch((err) => console.log(err))
  }

  useEffect(() => {
    fetchTeams()
    fetchEmployees()
  }, [])

  const handleSave = async () => {
    if (!formData.name?.trim()) {
      setError('Team name is required')
      return
    }
    setLoading(true)
    setError('')
    try {
      const payload = { name: formData.name, assignedWork: formData.assignedWork, employees: formData.employees }
      if (editingId) {
        const res = await api.put('/api/team', { id: editingId, ...payload })
        if (res.status === 200) {
          setOpenDialog(false)
          setFormData(INITIAL_FORM)
          setEditingId(null)
          fetchTeams()
        }
      } else {
        const res = await api.post('/api/team', payload)
        if (res.status === 201) {
          setOpenDialog(false)
          setFormData(INITIAL_FORM)
          fetchTeams()
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save team')
    } finally {
      setLoading(false)
    }
  }

  const handleConfirmDelete = async () => {
    if (!deleteId) return
    setLoading(true)
    try {
      const res = await api.delete('/api/team', { data: { id: deleteId } })
      if (res.status === 200) {
        setOpenConfirm(false)
        setDeleteId(null)
        fetchTeams()
      }
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (id) => {
    const team = allTeams.find((t) => t._id === id)
    if (team) {
      setFormData({
        name: team.name,
        assignedWork: team.assignedWork || '',
        employees: (team.employees || []).map((e) => String(typeof e === 'object' ? e._id : e)),
      })
      setEditingId(id)
      setError('')
      setOpenDialog(true)
    }
  }

  const TEAM_COLUMNS = [
    { field: 'name', headerName: 'Team Name', sortable: true },
    { field: 'assignedWork', headerName: 'Assigned Work', sortable: true },
    { field: 'employeeCount', headerName: 'Employees', sortable: false, render: (_, row) => (row.employees || []).length },
    ...(isAdmin ? [{
      field: 'action',
      headerName: 'Action',
      sortable: false,
      render: (_, row) => (
        <Box sx={{ display: 'flex', gap: 1 }}>
        <Button variant="contained" color="primary" size="small" sx={{ textTransform: 'uppercase', borderRadius: 1, minWidth: 70 }} onClick={() => handleEdit(row._id)}>Edit</Button>
        <Button variant="contained" color="error" size="small" sx={{ textTransform: 'uppercase', borderRadius: 1, minWidth: 70 }} onClick={() => { setDeleteId(row._id); setOpenConfirm(true) }}>Delete</Button>
        </Box>
      ),
    }] : []),
  ]

  const rows = allTeams

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 1 }}>
        <Typography variant="h4" sx={{ fontWeight: 600, color: '#111827', letterSpacing: '-0.02em', fontSize: '1.5rem' }}>
          Team
        </Typography>
        {isAdmin && <Button variant="contained" color="primary" size="small" sx={{ textTransform: 'uppercase', borderRadius: 1.5, fontWeight: 600, fontSize: '0.75rem' }} onClick={() => { setEditingId(null); setFormData(INITIAL_FORM); setError(''); setOpenDialog(true) }}>Add Team</Button>}
      </Box>

      <Typography variant="body2" sx={{ color: '#6b7280', mb: 2, fontSize: '0.8125rem' }}>
        Create teams and assign employees with their work
      </Typography>

      <TextField
        fullWidth
        placeholder="Search by team name or assigned work..."
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

      <CustomDataGrid
        columns={TEAM_COLUMNS}
        rows={rows}
        searchFilter={search}
        pageSizeOptions={[5, 10, 25, 50]}
        defaultPageSize={8}
        emptyMessage="No teams found"
        loading={gridLoading}
      />

      <Dialog open={openDialog} onClose={() => { if (!loading) { setOpenDialog(false); setError(''); setEditingId(null) } }} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 2, border: '1px solid #e5e7eb' } }}>
        <DialogTitle>{editingId ? 'Edit Team' : 'Add Team'}</DialogTitle>
        <DialogContent>
          {error && <Typography color="error" sx={{ mb: 1 }}>{error}</Typography>}
          <TextField label="Team Name" fullWidth margin="normal" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
          <TextField label="Assigned Work" fullWidth margin="normal" multiline rows={2} value={formData.assignedWork} onChange={(e) => setFormData({ ...formData, assignedWork: e.target.value })} placeholder="Describe the work assigned to this team" />
          <FormControl fullWidth margin="normal">
            <InputLabel>Employees</InputLabel>
            <Select
              multiple
              value={formData.employees.map(String)}
              label="Employees"
              onChange={(e) => setFormData({ ...formData, employees: e.target.value })}
              MenuProps={{
                disableScrollLock: true,
                PaperProps: { sx: { maxHeight: 280 } },
              }}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((id) => {
                    const emp = allEmployees.find((e) => String(e._id) === String(id))
                    return <Chip key={id} label={emp?.name || id} size="small" />
                  })}
                </Box>
              )}
            >
              {allEmployees.map((emp) => (
                <MenuItem key={emp._id} value={String(emp._id)}>
                  <Checkbox checked={formData.employees.map(String).includes(String(emp._id))} size="small" sx={{ mr: 1 }} />
                  <ListItemText primary={`${emp.name} (${emp.designation})`} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} disabled={loading}>Cancel</Button>
          <Button variant="contained" onClick={handleSave} disabled={loading}>{loading ? 'Saving...' : 'Save'}</Button>
        </DialogActions>
      </Dialog>

      <ConfirmDialog
        open={openConfirm}
        onClose={() => { if (!loading) { setOpenConfirm(false); setDeleteId(null) } }}
        onConfirm={handleConfirmDelete}
        title="Delete Team"
        message="Are you sure you want to delete this team?"
        confirmText="Delete"
        cancelText="Cancel"
        loading={loading}
        confirmColor="error"
      />
    </Box>
  )
}
