'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'

const Navbar = () => {
  const router = useRouter()

  const handleLoginClick = () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
    if (token) router.push('/dashboard')
    else router.push('/login')
  }
  const navLinks = [
    { href: '#home', label: 'Home' },
    { href: '#features', label: 'Features' },
    { href: '#customer', label: 'Customer' },
    { href: '#pricing', label: 'Pricing' },
    { href: '#blog', label: 'Blog' },
    { href: '#contact', label: 'Contact' },
  ]

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-slate-100">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <a href="#home" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
          <Image src="/favicon.ico" alt="Projectio" width={28} height={28} />
          <span className="font-semibold text-slate-800">Projectio</span>
        </a>

        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              className="text-slate-600 hover:text-slate-900 text-sm font-medium transition-colors"
            >
              {label}
            </a>
          ))}
        </nav>

        <button
          onClick={handleLoginClick}
          className="px-5 py-2.5 rounded-lg border border-slate-200 text-slate-700 font-medium text-sm hover:bg-slate-50 transition-colors"
        >
          Login
        </button>
      </div>
    </header>
  )
}

export default Navbar
