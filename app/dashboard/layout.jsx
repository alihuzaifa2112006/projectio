'use client'

import React, { useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Avatar } from '@mui/material'
import { DashboardOutlined, PersonOutlined, FolderOutlined, GroupsOutlined, ReceiptLongOutlined, SettingsOutlined, Person } from '@mui/icons-material'
import { useProfile } from '../context/ProfileContext'
import { useTheme } from '@mui/material/styles'
import { PROJECTIO_COLORS } from '../context/ThemeContext'

const sidebarItems = [
  { label: 'Dashboard', href: '/dashboard', icon: <DashboardOutlined /> },
  { label: 'Employee', href: '/dashboard/employee', icon: <PersonOutlined /> },
  { label: 'Projects', href: '/dashboard/projects', icon: <FolderOutlined /> },
  { label: 'Team', href: '/dashboard/team', icon: <GroupsOutlined /> },
  { label: 'Billing', href: '/dashboard/billing', icon: <ReceiptLongOutlined /> },
  { label: 'Settings', href: '/dashboard/settings', icon: <SettingsOutlined /> },
]

export default function DashboardLayout({ children }) {
  const pathname = usePathname()
  const router = useRouter()
  const theme = useTheme()
  const { displayAvatar } = useProfile()

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
    if (!token) router.replace('/login')
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/login')
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <Box
        sx={{
          width: 220,
          minHeight: '100vh',
          bgcolor: PROJECTIO_COLORS.sidebar,
          color: 'rgba(255,255,255,0.92)',
          py: 2.5,
          display: 'flex',
          flexDirection: 'column',
          flexShrink: 0,
        }}
      >
        <Box sx={{ px: 2, mb: 4 }}>
          <Link href="/dashboard" style={{ textDecoration: 'none', color: 'inherit' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
              <Image src="/favicon.ico" alt="Projectio" width={24} height={24} className="rounded" />
              <span style={{ fontWeight: 600, fontSize: '0.9375rem', letterSpacing: '-0.02em' }}>Projectio</span>
            </Box>
          </Link>
        </Box>
        <List sx={{ flex: 1, px: 1.25, py: 0 }} disablePadding>
          {sidebarItems.map((item) => (
            <ListItem key={item.href} disablePadding sx={{ mb: 0.25 }}>
              <ListItemButton
                component={Link}
                href={item.href}
                selected={item.href === '/dashboard' ? pathname === '/dashboard' : pathname.startsWith(item.href)}
                sx={{
                  borderRadius: 1.5,
                  py: 1,
                  px: 1.5,
                  minHeight: 40,
                  '&.Mui-selected': {
                    bgcolor: PROJECTIO_COLORS.sidebarActive,
                    color: 'white',
                    '&:hover': { bgcolor: PROJECTIO_COLORS.primaryHover },
                  },
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.05)' },
                }}
              >
                <ListItemIcon sx={{ color: 'inherit', minWidth: 32, '& .MuiSvgIcon-root': { fontSize: 20 } }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} primaryTypographyProps={{ fontSize: '0.8125rem', fontWeight: 500, letterSpacing: '-0.01em' }} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Box sx={{ mt: 'auto', pt: 2, borderTop: '1px solid rgba(255,255,255,0.06)', px: 2, display: 'flex', justifyContent: 'flex-start' }}>
          <Link href="/dashboard/settings" style={{ textDecoration: 'none' }}>
            <Avatar src={displayAvatar()} sx={{ width: 36, height: 36, bgcolor: PROJECTIO_COLORS.sidebarActive, cursor: 'pointer', '&:hover': { opacity: 0.9 }, fontSize: '0.875rem' }}>
              {!displayAvatar() && <Person sx={{ fontSize: 18 }} />}
            </Avatar>
          </Link>
        </Box>
        {/* <Box sx={{ mt: 'auto', pt: 2, borderTop: '1px solid rgba(255,255,255,0.1)', mx: 2 }}>
          <ListItem disablePadding>
            <ListItemButton
              onClick={handleLogout}
              sx={{
                borderRadius: 1,
                color: '#f87171',
                '&:hover': { bgcolor: 'rgba(248,113,113,0.15)' },
              }}
            >
              <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}><Logout /></ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItemButton>
          </ListItem>
        </Box> */}
      </Box>

      {/* Main Content */}
      <Box sx={{ flex: 1, minWidth: 0, width: '100%', maxWidth: '100%', bgcolor: theme.palette.mode === 'dark' ? 'background.default' : '#f8fafc', p: { xs: 2, sm: 3 }, overflow: 'auto' }}>{children}</Box>
    </Box>
  )
}
