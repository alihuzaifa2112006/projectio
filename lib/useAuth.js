'use client'

import { useState, useEffect } from 'react'

export function useAuth() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    try {
      const userStr = typeof window !== 'undefined' ? localStorage.getItem('user') : null
      setUser(userStr ? JSON.parse(userStr) : null)
    } catch (e) {
      setUser(null)
    }
  }, [])

  return {
    user,
    role: user?.role || null,
    isAdmin: user?.role === 'admin',
    userId: user?.id || null,
  }
}
