'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

const ProfileContext = createContext()

export function useProfile() {
  const ctx = useContext(ProfileContext)
  if (!ctx) throw new Error('useProfile must be used within ProfileProvider')
  return ctx
}

function getProfileKey() {
  try {
    const userStr = typeof window !== 'undefined' ? localStorage.getItem('user') : null
    const user = userStr ? JSON.parse(userStr) : null
    return user?.id ? `userProfile_${user.id}` : 'userProfile'
  } catch (e) {
    return 'userProfile'
  }
}

export function ProfileProvider({ children }) {
  const [profile, setProfileState] = useState({ name: '', avatar: '' })
  const [displayName, setDisplayName] = useState('')

  const loadProfile = () => {
    try {
      const key = getProfileKey()
      const stored = localStorage.getItem(key)
      const storedProfile = stored ? JSON.parse(stored) : {}
      setProfileState(storedProfile)
      const userStr = localStorage.getItem('user')
      const user = userStr ? JSON.parse(userStr) : null
      setDisplayName(storedProfile.name || user?.name || 'User')
    } catch (e) {}
  }

  useEffect(() => {
    loadProfile()
    const handler = () => loadProfile()
    window.addEventListener('user-logged-in', handler)
    return () => window.removeEventListener('user-logged-in', handler)
  }, [])

  useEffect(() => {
    const userStr = localStorage.getItem('user')
    const user = userStr ? JSON.parse(userStr) : null
    setDisplayName(profile.name || user?.name || 'User')
  }, [profile.name])

  const setProfile = (updates) => {
    setProfileState((prev) => {
      const next = { ...prev, ...updates }
      try {
        localStorage.setItem(getProfileKey(), JSON.stringify(next))
      } catch (e) {}
      return next
    })
  }

  const displayAvatar = () => profile.avatar || null

  return (
    <ProfileContext.Provider value={{ profile, setProfile, displayName, displayAvatar }}>
      {children}
    </ProfileContext.Provider>
  )
}
