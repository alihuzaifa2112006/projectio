'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Paper,
  InputAdornment,
  IconButton,
} from '@mui/material'
import { Person, Email, Phone, Lock, Visibility, VisibilityOff } from '@mui/icons-material'
import api from '../../lib/api'

const SIDEBAR_DARK = '#14532d'
const ACCENT_GREEN = '#16a34a'
const PRIMARY_GREEN = '#16a34a'
const PRIMARY_GREEN_HOVER = '#15803d'
const LIGHT_BG = '#f8fafc'

const inputSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: 2,
    bgcolor: '#f9fafb',
    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: ACCENT_GREEN },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: ACCENT_GREEN, borderWidth: 2 },
  },
  '& .MuiInputLabel-root.Mui-focused': { color: ACCENT_GREEN },
}

export default function RegisterPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    number: '',
    password: '',
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const res = await api.post('/auth/register', {
        ...formData,
        role: 'admin',
      })
      if (res.data?.token) {
        localStorage.setItem('token', res.data.token)
        localStorage.setItem('user', JSON.stringify(res.data.user))
        window.dispatchEvent(new CustomEvent('user-logged-in'))
        router.push('/dashboard')
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed')
    }
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: LIGHT_BG, display: 'flex', alignItems: 'center', justifyContent: 'center', py: 4 }}>
      <Container maxWidth="sm">
        <Paper
          elevation={0}
          sx={{
            p: 4,
            borderRadius: 4,
            width: '100%',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            border: '1px solid rgba(0,0,0,0.06)',
          }}
        >
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Typography variant="h4" sx={{ fontWeight: 700, color: SIDEBAR_DARK, mb: 0.5 }}>
              Projectio
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#1f2937', mt: 1 }}>
              Manager Register
            </Typography>
            <Typography variant="body2" sx={{ color: '#6b7280', mt: 1 }}>
              Register as a Manager to handle projects
            </Typography>
          </Box>

          {error && (
            <Typography sx={{ mb: 2, textAlign: 'center', color: '#dc2626', fontSize: '0.875rem' }}>
              {error}
            </Typography>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Full Name"
              name="name"
              margin="normal"
              required
              value={formData.name}
              onChange={handleChange}
              sx={inputSx}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start"><Person sx={{ color: SIDEBAR_DARK, fontSize: 20 }} /></InputAdornment>
                ),
              }}
            />
            <TextField
              fullWidth
              label="Email Address"
              name="email"
              type="email"
              margin="normal"
              required
              value={formData.email}
              onChange={handleChange}
              sx={inputSx}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start"><Email sx={{ color: SIDEBAR_DARK, fontSize: 20 }} /></InputAdornment>
                ),
              }}
            />
            <TextField
              fullWidth
              label="Phone Number"
              name="number"
              margin="normal"
              required
              value={formData.number}
              onChange={handleChange}
              sx={inputSx}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start"><Phone sx={{ color: SIDEBAR_DARK, fontSize: 20 }} /></InputAdornment>
                ),
              }}
            />
            <TextField
              fullWidth
              label="Password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              margin="normal"
              required
              value={formData.password}
              onChange={handleChange}
              sx={inputSx}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start"><Lock sx={{ color: SIDEBAR_DARK, fontSize: 20 }} /></InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" sx={{ color: '#6b7280' }}>
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button
              fullWidth
              type="submit"
              variant="contained"
              size="large"
              sx={{
                mt: 4,
                py: 1.75,
                fontWeight: 600,
                fontSize: '1rem',
                borderRadius: 2,
                bgcolor: PRIMARY_GREEN,
                textTransform: 'uppercase',
                boxShadow: 'none',
                '&:hover': { bgcolor: PRIMARY_GREEN_HOVER },
              }}
            >
              Register Now
            </Button>
          </form>

          <Typography variant="body2" align="center" sx={{ mt: 3, color: '#6b7280' }}>
            Already have an account?{' '}
            <Link href="/login" style={{ color: ACCENT_GREEN, fontWeight: 600, textDecoration: 'none' }}>
              Login here
            </Link>
          </Typography>
        </Paper>
      </Container>
    </Box>
  )
}