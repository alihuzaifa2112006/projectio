'use client'

import React from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'

const Home = () => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-50">
      {/* Subtle gradient accent - minimalist */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-100/50 to-transparent pointer-events-none" />

      {/* Large PROJECTIO text - center, full width, behind content */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden">
        <motion.h1
          className="text-[clamp(5rem,18vw,14rem)] font-black tracking-tighter text-slate-400/90 select-none"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: 'easeOut' }}
        >
          PROJECTIO
        </motion.h1>
      </div>

      {/* Main content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-16">
        {/* Laptop - centered */}
        <motion.div
          className="relative w-full max-w-4xl flex justify-center items-center"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2, ease: 'easeOut' }}
        >
          <motion.div
            className="relative z-20 w-full max-w-2xl aspect-[16/10]"
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Image
              src="/laptop-hero.png"
              alt="Project Management Dashboard"
              fill
              className="object-contain drop-shadow-xl"
              priority
              sizes="(max-width: 768px) 100vw, 800px"
            />
          </motion.div>
        </motion.div>

        {/* Tagline - minimalist */}
        {/* <motion.p
          className="text-slate-500 text-lg md:text-xl mt-8 font-medium tracking-wide"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
  Projectio | Your Project Management Solution
        </motion.p> */}

        {/* CTA buttons - minimalist */}
        {/* <motion.div
          className="flex flex-wrap gap-4 justify-center mt-10"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <motion.button
            className="px-6 py-3 bg-slate-800 text-white font-medium rounded-lg hover:bg-slate-700 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Get Started
          </motion.button>
          <motion.button
            className="px-6 py-3 bg-transparent text-slate-600 font-medium rounded-lg border border-slate-300 hover:border-slate-400 hover:bg-slate-100/50 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Learn More
          </motion.button>
        </motion.div> */}
      </div>
    </div>
  )
}

export default Home
