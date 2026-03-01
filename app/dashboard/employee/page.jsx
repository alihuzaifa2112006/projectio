'use client'

import React, { useEffect, useState } from 'react'
import { Box, Typography, Button, TextField, InputAdornment, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material'
import { Search } from '@mui/icons-material'
import { api } from '../../../lib/api'
import { useAuth } from '../../../lib/useAuth'
import CustomDataGrid from '../../components/CustomDataGrid'
import ConfirmDialog from '../../components/ConfirmDialog'

const INITIAL_FORM = { name: '', designation: '', salary: '', email: '', phone: '', password: '' }

export default function EmployeePage() {
  const { isAdmin } = useAuth()
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



  const EMPLOYEE_COLUMNS = [
    { field: 'name', headerName: 'Name', sortable: true },
    { field: 'designation', headerName: 'Designation', sortable: true },
    { field: 'salary', headerName: 'Salary', sortable: true },
    { field: 'email', headerName: 'Email', sortable: true },
    { field: 'phone', headerName: 'Phone', sortable: true },
    ...(isAdmin ? [{ field: 'action', headerName: 'Action', sortable: false, render: (_, row) => (
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Button variant="contained" color="primary" size="small" sx={{ textTransform: 'uppercase', borderRadius: 1 }} onClick={() => handleEdit(row._id)}>Edit</Button>
        <Button variant="contained" color="error" size="small" sx={{ textTransform: 'uppercase', borderRadius: 1 }} onClick={() => { setDeleteId(row._id); setOpenConfirm(true) }}>Delete</Button>
      </Box>
    ) }] : []),
  ]

  const fetchEmployees = () => {
    setGridLoading(true)
    api.get('/employee')
      .then((res) => setAllEmployees(res.data.employees || []))
      .catch((err) => console.log(err))
      .finally(() => setGridLoading(false))
  }

  useEffect(() => fetchEmployees(), [])

  const handleSave = async () => {
    const needsPassword = !editingId
    if (!formData.name || !formData.designation || !formData.salary || !formData.email || !formData.phone || (needsPassword && !formData.password)) {
      setError(needsPassword ? 'All fields are required' : 'Name, designation, salary, email and phone are required')
      return
    }
    setLoading(true)
    setError('')
    try {
      if (editingId) {
        const payload = { id: editingId, name: formData.name, designation: formData.designation, salary: formData.salary, email: formData.email, phone: formData.phone }
        if (formData.password) payload.password = formData.password
        const res = await api.put('/employee', payload)
        if (res.status === 200) {
          setOpenDialog(false)
          setFormData(INITIAL_FORM)
          setEditingId(null)
          fetchEmployees()
        }
      } else {
        const res = await api.post('/employee', formData)
        if (res.status === 201) {
          setOpenDialog(false)
          setFormData(INITIAL_FORM)
          fetchEmployees()
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save employee')
    } finally {
      setLoading(false)
    }
  }


  const handleConfirmDelete = async () => {
    if (!deleteId) return
    setLoading(true)
    try {
      const res = await api.delete('/employee', { data: { id: deleteId } })
      if (res.status === 200) {
        setOpenConfirm(false)
        setDeleteId(null)
        fetchEmployees()
      }
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }
  const handleEdit = (id) => {
    const emp = allEmployees.find((e) => e._id === id)
    if (emp) {
      setFormData({ name: emp.name, designation: emp.designation, salary: emp.salary, email: emp.email, phone: emp.phone, password: '' })
      setEditingId(id)
      setError('')
      setOpenDialog(true)
    }
  }



  


  const rows = allEmployees

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 1 }}>
        <Typography variant="h4" sx={{ fontWeight: 600, color: '#111827', letterSpacing: '-0.02em', fontSize: '1.5rem' }}>
          Employee
        </Typography>
        {isAdmin && <Button variant="contained" color="primary" size="small" sx={{ textTransform: 'uppercase', borderRadius: 1.5, fontWeight: 600, fontSize: '0.75rem' }} onClick={() => { setEditingId(null); setFormData(INITIAL_FORM); setError(''); setOpenDialog(true) }}>Add Employee</Button>}
      </Box>

      <Typography variant="body2" sx={{ color: '#6b7280', mb: 2, fontSize: '0.8125rem' }}>
        Only Admin Can Add Or Remove Employee
      </Typography>

      <TextField
        fullWidth
        placeholder="Search by name, designation, email or phone..."
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
        columns={EMPLOYEE_COLUMNS}
        rows={rows}
        searchFilter={search}
        pageSizeOptions={[5, 10, 25, 50]}
        defaultPageSize={8}
        emptyMessage="No employees found"
        loading={gridLoading}
      />

      <Dialog
        open={openDialog}
        onClose={() => { if (!loading) { setOpenDialog(false); setError(''); setEditingId(null) } }}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 2, border: '1px solid #e5e7eb' } }}
      >
        <DialogTitle>{editingId ? 'Edit Employee' : 'Add Employee'}</DialogTitle>
        <DialogContent>
          {error && <Typography color="error" sx={{ mb: 1 }}>{error}</Typography>}
          <TextField label="Name" fullWidth margin="normal" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
          <TextField label="Designation" fullWidth margin="normal" value={formData.designation} onChange={(e) => setFormData({ ...formData, designation: e.target.value })} required />
          <TextField label="Salary" type="number" fullWidth margin="normal" value={formData.salary} onChange={(e) => setFormData({ ...formData, salary: e.target.value })} required />
          <TextField label="Email" type="email" fullWidth margin="normal" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
          <TextField label="Phone" fullWidth margin="normal" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} required />
          <TextField label="Password" type="password" fullWidth margin="normal" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} placeholder={editingId ? 'Leave blank to keep current' : ''} required={!editingId} />
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
        title="Delete Employee"
        message="Are you sure you want to delete this employee?"
        confirmText="Delete"
        cancelText="Cancel"
        loading={loading}
        confirmColor="error"
      />
    </Box>
  )
}
