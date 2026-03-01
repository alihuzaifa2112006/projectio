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
import ExpandableDataGrid from '../../components/ExpandableDataGrid'
import ConfirmDialog from '../../components/ConfirmDialog'

const INITIAL_FORM = { name: '', description: '', status: 'active', employees: [] }

export default function ProjectsPage() {
  const { isAdmin } = useAuth()
  const [allProjects, setAllProjects] = useState([])
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

  const fetchProjects = () => {
    setGridLoading(true)
    api.get('/project').then((res) => setAllProjects(res.data.projects || [])).catch((err) => console.log(err)).finally(() => setGridLoading(false))
  }

  const fetchEmployees = () => {
    api.get('/employee').then((res) => setAllEmployees(res.data.employees || [])).catch((err) => console.log(err))
  }

  useEffect(() => {
    fetchProjects()
    fetchEmployees()
  }, [])

  const handleSave = async () => {
    if (!formData.name?.trim()) {
      setError('Project name is required')
      return
    }
    setLoading(true)
    setError('')
    try {
      const payload = { name: formData.name, description: formData.description, status: formData.status, employees: formData.employees }
      if (editingId) {
        const res = await api.put('/project', { id: editingId, ...payload })
        if (res.status === 200) {
          setOpenDialog(false)
          setFormData(INITIAL_FORM)
          setEditingId(null)
          fetchProjects()
        }
      } else {
        const res = await api.post('/project', payload)
        if (res.status === 201) {
          setOpenDialog(false)
          setFormData(INITIAL_FORM)
          fetchProjects()
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save project')
    } finally {
      setLoading(false)
    }
  }

  const handleConfirmDelete = async () => {
    if (!deleteId) return
    setLoading(true)
    try {
      const res = await api.delete('/project', { data: { id: deleteId } })
      if (res.status === 200) {
        setOpenConfirm(false)
        setDeleteId(null)
        fetchProjects()
      }
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (id) => {
    const proj = allProjects.find((p) => p._id === id)
    if (proj) {
      setFormData({
        name: proj.name,
        description: proj.description || '',
        status: proj.status || 'active',
        employees: (proj.employees || []).map((e) => String(typeof e === 'object' ? e._id : e)),
      })
      setEditingId(id)
      setError('')
      setOpenDialog(true)
    }
  }

  const renderDetail = (row) => {
    const employees = row.employees || []
    const count = employees.length
    return (
      <Box>
        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
          Assigned Employees ({count})
        </Typography>
        {count > 0 ? (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {employees.map((emp) => (
              <Chip
                key={emp._id || emp}
                label={typeof emp === 'object' ? `${emp.name} (${emp.designation})` : emp}
                size="small"
                variant="outlined"
              />
            ))}
          </Box>
        ) : (
          <Typography variant="body2" color="text.secondary">
            No employees assigned to this project.
          </Typography>
        )}
      </Box>
    )
  }

  const PROJECT_COLUMNS = [
    { field: 'name', headerName: 'Project Name', sortable: true },
    { field: 'description', headerName: 'Description', sortable: true },
    { field: 'status', headerName: 'Status', sortable: true, render: (val) => <Chip label={val || 'active'} size="small" color={val === 'active' ? 'success' : val === 'completed' ? 'default' : 'warning'} /> },
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

  const rows = allProjects

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 1 }}>
        <Typography variant="h4" sx={{ fontWeight: 600, color: '#111827', letterSpacing: '-0.02em', fontSize: '1.5rem' }}>
          Projects
        </Typography>
        {isAdmin && <Button variant="contained" color="primary" size="small" sx={{ textTransform: 'uppercase', borderRadius: 1.5, fontWeight: 600, fontSize: '0.75rem' }} onClick={() => { setEditingId(null); setFormData(INITIAL_FORM); setError(''); setOpenDialog(true) }}>Add Project</Button>}
      </Box>

      <Typography variant="body2" sx={{ color: '#6b7280', mb: 2, fontSize: '0.8125rem' }}>
        Expand a row to see assigned employees
      </Typography>

      <TextField
        fullWidth
        placeholder="Search by project name, description or status..."
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

      <ExpandableDataGrid
        columns={PROJECT_COLUMNS}
        rows={rows}
        searchFilter={search}
        pageSizeOptions={[5, 10, 25, 50]}
        defaultPageSize={8}
        emptyMessage="No projects found"
        loading={gridLoading}
        renderDetail={renderDetail}
        getDetailKey={(row) => row._id}
      />

      <Dialog open={openDialog} onClose={() => { if (!loading) { setOpenDialog(false); setError(''); setEditingId(null) } }} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 2, border: '1px solid #e5e7eb' } }}>
        <DialogTitle>{editingId ? 'Edit Project' : 'Add Project'}</DialogTitle>
        <DialogContent>
          {error && <Typography color="error" sx={{ mb: 1 }}>{error}</Typography>}
          <TextField label="Project Name" fullWidth margin="normal" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
          <TextField label="Description" fullWidth margin="normal" multiline rows={2} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
          <FormControl fullWidth margin="normal">
            <InputLabel>Status</InputLabel>
            <Select value={formData.status} label="Status" onChange={(e) => setFormData({ ...formData, status: e.target.value })} MenuProps={{ disableScrollLock: true }}>
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
              <MenuItem value="on-hold">On Hold</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel>Assign Employees</InputLabel>
            <Select
              multiple
              value={formData.employees.map(String)}
              label="Assign Employees"
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
        title="Delete Project"
        message="Are you sure you want to delete this project?"
        confirmText="Delete"
        cancelText="Cancel"
        loading={loading}
        confirmColor="error"
      />
    </Box>
  )
}
