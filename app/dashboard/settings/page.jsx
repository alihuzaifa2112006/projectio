'use client'

import React, { useState, useEffect, useRef } from 'react'
import {
  Box,
  Typography,
  Paper,
  Switch,
  FormControlLabel,
  Button,
  TextField,
  Avatar,
  Divider,
} from '@mui/material'
import { Logout, Person } from '@mui/icons-material'
import { useRouter } from 'next/navigation'
import { useThemeMode } from '../../context/ThemeContext'
import { useProfile } from '../../context/ProfileContext'

export default function SettingsPage() {
  const router = useRouter()
  const { mode, toggleTheme } = useThemeMode()
  const { profile, setProfile, displayAvatar } = useProfile()
  const [name, setName] = useState('')
  const [lastSavedName, setLastSavedName] = useState('')
  const [avatarChanged, setAvatarChanged] = useState(false)
  const fileInputRef = useRef(null)

  useEffect(() => {
    const userStr = typeof window !== 'undefined' ? localStorage.getItem('user') : null
    const user = userStr ? JSON.parse(userStr) : null
    const initialName = profile.name || user?.name || ''
    setName(initialName)
    setLastSavedName(initialName)
  }, [profile.name])

  const hasChanges = name.trim() !== lastSavedName.trim() || avatarChanged

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/login')
  }

  const handleSaveProfile = () => {
    setProfile({ name: name.trim() })
    setLastSavedName(name.trim())
    setAvatarChanged(false)
  }

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0]
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = () => {
        setProfile({ avatar: reader.result })
        setAvatarChanged(true)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 600, color: '#111827', letterSpacing: '-0.02em', fontSize: '1.5rem', mb: 3 }}>
        Settings
      </Typography>

      <Paper sx={{ p: 2.5, borderRadius: 2, mb: 2.5, border: '1px solid #e5e7eb', boxShadow: 'none' }}>
        <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '0.9375rem', color: '#374151' }} gutterBottom>
          Theme
        </Typography>
        <FormControlLabel
          control={<Switch checked={mode === 'dark'} onChange={toggleTheme} color="primary" />}
          label={mode === 'dark' ? 'Dark Mode' : 'Light Mode'}
        />
      </Paper>

      <Paper sx={{ p: 3, borderRadius: 2, mb: 3, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
        <Typography variant="h6" gutterBottom>
          Profile Setup
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, flexWrap: 'wrap' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
            <Avatar
              src={displayAvatar()}
              sx={{ width: 80, height: 80, cursor: 'pointer', bgcolor: '#16a34a' }}
              onClick={() => fileInputRef.current?.click()}
            >
              {!displayAvatar() && <Person sx={{ fontSize: 40 }} />}
            </Avatar>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              hidden
              onChange={handleAvatarChange}
            />
            <Typography variant="caption" color="text.secondary">
              Click to change photo
            </Typography>
          </Box>
          <Box sx={{ flex: 1, minWidth: 200 }}>
            <TextField
              fullWidth
              label="Display Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              size="small"
              sx={{ mb: 2 }}
            />
            {hasChanges && (
              <Button variant="contained" onClick={handleSaveProfile}>
                Save Profile
              </Button>
            )}
          </Box>
        </Box>
      </Paper>

      <Paper sx={{ p: 2.5, borderRadius: 2, border: '1px solid #e5e7eb', boxShadow: 'none' }}>
        <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '0.9375rem', color: '#374151' }} gutterBottom>
          Account
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Button variant="outlined" color="error" startIcon={<Logout />} onClick={handleLogout}>
          Logout
        </Button>
      </Paper>
    </Box>
  )
}
