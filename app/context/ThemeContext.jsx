'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material/styles'

const ThemeContext = createContext()

export const PROJECTIO_COLORS = {
  sidebar: '#14532d',
  sidebarActive: '#16a34a',
  tableHeader: '#14532d',
  primary: '#16a34a',
  primaryHover: '#15803d',
  error: '#dc3545',
  mainBg: '#ffffff',
  paperBg: '#ffffff',
}

export function useThemeMode() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useThemeMode must be used within ThemeProvider')
  return ctx
}

export function ThemeProvider({ children }) {
  const [mode, setModeState] = useState('light')

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setModeState(localStorage.getItem('theme') || 'light')
    }
  }, [])

  const setMode = (newMode) => {
    setModeState(newMode)
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', newMode)
    }
  }

  const toggleTheme = () => setMode(mode === 'light' ? 'dark' : 'light')

  const theme = createTheme({
    typography: {
      fontFamily: 'var(--font-inter), system-ui, -apple-system, sans-serif',
      h4: { fontWeight: 600, fontSize: '1.5rem', letterSpacing: '-0.02em' },
      h5: { fontWeight: 600, fontSize: '1.25rem', letterSpacing: '-0.01em' },
      h6: { fontWeight: 600, fontSize: '1rem', letterSpacing: '-0.01em' },
      body1: { fontSize: '0.9375rem', lineHeight: 1.5 },
      body2: { fontSize: '0.8125rem', lineHeight: 1.5 },
    },
    palette: {
      mode,
      primary: { main: PROJECTIO_COLORS.primary, dark: PROJECTIO_COLORS.primaryHover },
      error: { main: PROJECTIO_COLORS.error },
      ...(mode === 'light' && {
        background: { default: PROJECTIO_COLORS.mainBg, paper: PROJECTIO_COLORS.paperBg },
      }),
      ...(mode === 'dark' && {
        background: { default: '#0f172a', paper: '#1e293b' },
      }),
    },
    shape: { borderRadius: 10 },
    components: {
      MuiButton: {
        styleOverrides: {
          contained: {
            borderRadius: 10,
            fontWeight: 600,
            fontSize: '0.8125rem',
            textTransform: 'uppercase',
            letterSpacing: '0.03em',
            boxShadow: '0 1px 3px rgba(22, 163, 74, 0.2)',
            '&:hover': { boxShadow: '0 2px 6px rgba(22, 163, 74, 0.3)' },
          },
          containedPrimary: { '&:hover': { backgroundColor: PROJECTIO_COLORS.primaryHover } },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: 8,
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: { borderRadius: 2, boxShadow: 'none', border: '1px solid #e5e7eb' },
        },
      },
    },
  })

  return (
    <ThemeContext.Provider value={{ mode, setMode, toggleTheme }}>
      <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
    </ThemeContext.Provider>
  )
}
