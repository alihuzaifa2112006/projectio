'use client'

import React from 'react'
import { ThemeProvider } from '../context/ThemeContext'
import { ProfileProvider } from '../context/ProfileContext'

export function Providers({ children }) {
  return (
    <ThemeProvider>
      <ProfileProvider>{children}</ProfileProvider>
    </ThemeProvider>
  )
}
