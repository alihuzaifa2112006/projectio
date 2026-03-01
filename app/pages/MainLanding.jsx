'use client'

import React from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const AVATAR_IMAGES = [
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=96&h=96&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=96&h=96&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=96&h=96&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=96&h=96&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=96&h=96&fit=crop&crop=face',
]

const MainLanding = () => {
  const router = useRouter()

  const handleCtaClick = () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
    if (token) router.push('/dashboard')
    else router.push('/login')
  }

  return (
    <div id="main-landing" className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        {/* Subtle green gradient bg */}
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-50/60 via-transparent to-transparent pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative">
          {/* Social proof */}
          <motion.div
            className="flex items-center justify-center gap-3 mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex -space-x-3">
              {AVATAR_IMAGES.map((src, i) => (
                <Image
                  key={i}
                  src={src}
                  alt={`Team member ${i + 1}`}
                  width={48}
                  height={48}
                  className="rounded-full border-2 border-white object-cover ring-2 ring-white shrink-0"
                />
              ))}
            </div>
            <p className="text-slate-600 text-sm">
              <span className="font-semibold text-slate-800">350K+</span> Success
              people are join with us
            </p>
          </motion.div>

          {/* Headline */}
          <motion.h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Discover of Project{' '}
            <span className="bg-gradient-to-r from-emerald-600 to-emerald-800 bg-clip-text text-transparent">
              Efficiency with Projectio
            </span>
          </motion.h1>

          {/* Tagline */}
          <motion.p
            className="text-slate-500 text-lg max-w-2xl mx-auto mb-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Empower your team, simplify complexities, and achieve exceptional
            outcomes using our user-friendly project management platform.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-wrap gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <button onClick={handleCtaClick} className="flex items-center gap-2 px-6 py-3.5 bg-emerald-600 text-white font-medium rounded-xl hover:bg-emerald-700 transition-colors">
              <span className="text-lg">+</span>
              Join with us
            </button>
            <button onClick={handleCtaClick} className="px-6 py-3.5 bg-white text-slate-700 font-medium rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors">
              Preview Growth
            </button>
          </motion.div>
        </div>
      </section>

      {/* Dashboard Mockup Section */}
      <section className="px-6 -mt-10 pb-24">
        <motion.div
          className="max-w-5xl mx-auto relative"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {/* Desktop mockup */}
          <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
            {/* Browser bar */}
            <div className="flex items-center gap-2 px-4 py-3 bg-slate-50 border-b border-slate-100">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <div className="w-3 h-3 rounded-full bg-emerald-400" />
              </div>
              <div className="flex-1 flex justify-center">
                <span className="text-slate-400 text-sm">
                  app.projectio.com
                </span>
              </div>
            </div>

            <div className="flex min-h-[400px]">
              {/* Sidebar */}
              <aside className="w-56 p-4 border-r border-slate-100 bg-slate-50/50">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-full bg-emerald-200" />
                  <div>
                    <p className="font-medium text-slate-800 text-sm">
                      Projectio LLC
                    </p>
                    <p className="text-xs text-slate-500">team@projectio.co</p>
                  </div>
                </div>
                <nav className="space-y-1">
                  {['Home', 'Inbox', 'My Task', 'Portfolios', 'Goal', 'Settings'].map(
                    (item, i) => (
                      <div
                        key={item}
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm ${
                          i === 0
                            ? 'bg-emerald-100 text-emerald-700 font-medium'
                            : 'text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        <div className="w-4 h-4 rounded bg-slate-300" />
                        {item}
                      </div>
                    )
                  )}
                </nav>
              </aside>

              {/* Main content */}
              <main className="flex-1 p-6">
                <div className="flex justify-between items-center mb-6">
                  <p className="text-slate-500 text-sm">Sunday, March 25</p>
                  <button className="text-sm text-slate-600 hover:text-slate-800">
                    Share
                  </button>
                </div>

                {/* Stats cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  {[
                    { label: 'Active Project', value: 18, sub: '15% Less then last week', color: 'emerald' },
                    { label: 'Complete Task', value: 23, sub: '10% Less then last week', color: 'rose' },
                    { label: 'To-Do List', value: 9, sub: '5% Less then last week', color: 'emerald' },
                    { label: 'OnHold', value: 4, sub: '5% Less then last week', color: 'amber' },
                  ].map((card) => (
                    <div
                      key={card.label}
                      className="p-4 rounded-xl bg-slate-50 border border-slate-100"
                    >
                      <p className="text-slate-500 text-xs mb-1">{card.label}</p>
                      <p className="text-2xl font-bold text-slate-800">
                        {card.value}
                      </p>
                      <p className="text-xs text-slate-400 mt-1">{card.sub}</p>
                    </div>
                  ))}
                </div>

                {/* Running projects */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold text-slate-800">
                      Running Projects
                    </h3>
                    <button className="text-sm text-emerald-600 font-medium">
                      View All
                    </button>
                  </div>
                  <div className="space-y-3">
                    {[
                      { name: 'Responsive Land...', company: 'Good Rock', progress: 50 },
                      { name: 'Web develope...', company: 'Smith Agency', progress: 50 },
                    ].map((p) => (
                      <div
                        key={p.name}
                        className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-100"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-4 h-4 rounded border border-slate-300" />
                          <div>
                            <p className="font-medium text-slate-800 text-sm">
                              {p.name}
                            </p>
                            <p className="text-xs text-slate-500">{p.company}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-emerald-500 rounded-full"
                              style={{ width: `${p.progress}%` }}
                            />
                          </div>
                          <span className="text-xs text-slate-500">
                            {p.progress}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </main>
            </div>
          </div>

          {/* Mobile mockup overlay */}
          <div className="absolute -right-4 md:right-8 -bottom-8 w-48 md:w-56 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden">
            <div className="p-3 border-b border-slate-100 flex items-center justify-between">
              <div className="flex gap-1 w-4 h-4">
                <div className="w-1 h-1 rounded-full bg-slate-300" />
                <div className="w-1 h-1 rounded-full bg-slate-300" />
                <div className="w-1 h-1 rounded-full bg-slate-300" />
              </div>
              <span className="text-[10px] text-slate-400">Projectio</span>
            </div>
            <div className="p-3 space-y-2">
              <div className="p-2 rounded-lg bg-slate-50">
                <p className="text-[10px] text-slate-500">Active Project</p>
                <p className="font-bold text-slate-800">18</p>
              </div>
              <div className="p-2 rounded-lg bg-slate-50">
                <p className="text-[10px] text-slate-500">Complete Task</p>
                <p className="font-bold text-slate-800">23</p>
              </div>
              <div className="text-center text-xs text-slate-500 py-2">
                March 2023
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-6 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Powerful Features
            </h2>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">
              Everything you need to manage projects, collaborate with your team, and deliver on time.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: '📋',
                title: 'Task Management',
                desc: 'Create, assign, and track tasks with drag-and-drop boards and custom workflows.',
              },
              {
                icon: '👥',
                title: 'Team Collaboration',
                desc: 'Real-time updates, comments, and file sharing to keep everyone in sync.',
              },
              {
                icon: '📊',
                title: 'Analytics & Reports',
                desc: 'Visual dashboards and insights to understand progress and productivity.',
              },
              {
                icon: '⏰',
                title: 'Time Tracking',
                desc: 'Log hours, set deadlines, and monitor project timelines effortlessly.',
              },
              {
                icon: '🔗',
                title: 'Integrations',
                desc: 'Connect with Slack, Google Drive, and 50+ tools you already use.',
              },
              {
                icon: '🔒',
                title: 'Secure & Private',
                desc: 'Enterprise-grade security with role-based access and data encryption.',
              },
            ].map((feature, i) => (
              <motion.div
                key={feature.title}
                className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-emerald-100 transition-all"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <span className="text-3xl mb-4 block">{feature.icon}</span>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-slate-600 text-sm">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Customer Section */}
      <section id="customer" className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Loved by Teams Everywhere
            </h2>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">
              See what our customers have to say about Projectio.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                quote: 'Projectio transformed how we manage our projects. We shipped 40% faster.',
                name: 'Sarah Chen',
                role: 'Product Lead, TechCorp',
                avatar: 'SC',
              },
              {
                quote: 'The best project tool we\'ve used. Simple, powerful, and our team actually uses it.',
                name: 'Marcus Johnson',
                role: 'CTO, StartupXYZ',
                avatar: 'MJ',
              },
              {
                quote: 'Finally, a tool that scales with our growth. Highly recommend for any team.',
                name: 'Elena Rodriguez',
                role: 'Operations Director, DesignCo',
                avatar: 'ER',
              },
            ].map((testimonial, i) => (
              <motion.div
                key={testimonial.name}
                className="p-6 bg-slate-50 rounded-2xl border border-slate-100"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <p className="text-slate-700 mb-6">"{testimonial.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-semibold">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">{testimonial.name}</p>
                    <p className="text-slate-500 text-sm">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 px-6 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">
              Start free and scale as you grow. No hidden fees.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                name: 'Starter',
                price: 'Free',
                period: 'forever',
                desc: 'For individuals and small teams',
                features: ['Up to 5 projects', '3 team members', 'Basic analytics', 'Email support'],
                cta: 'Get Started',
                highlight: false,
                isLogin: true,
              },
              {
                name: 'Pro',
                price: '$12',
                period: '/user/month',
                desc: 'For growing teams',
                features: ['Unlimited projects', 'Unlimited members', 'Advanced analytics', 'Priority support', 'Integrations'],
                cta: 'Start Free Trial',
                highlight: true,
                isLogin: true,
              },
              {
                name: 'Enterprise',
                price: 'Custom',
                period: '',
                desc: 'For large organizations',
                features: ['Everything in Pro', 'SSO & SAML', 'Dedicated support', 'Custom contracts'],
                cta: 'Contact Sales',
                highlight: false,
                isLogin: false,
              },
            ].map((plan) => (
              <motion.div
                key={plan.name}
                className={`p-6 rounded-2xl border ${
                  plan.highlight
                    ? 'bg-emerald-600 border-emerald-600 text-white shadow-xl ring-2 ring-emerald-300 ring-offset-2'
                    : 'bg-white border-slate-200'
                }`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h3 className={`text-lg font-semibold mb-2 ${plan.highlight ? 'text-white' : 'text-slate-900'}`}>
                  {plan.name}
                </h3>
                <div className="mb-4">
                  <span className={`text-3xl font-bold ${plan.highlight ? 'text-white' : 'text-slate-900'}`}>
                    {plan.price}
                  </span>
                  <span className={plan.highlight ? 'text-emerald-200' : 'text-slate-500'}>{plan.period}</span>
                </div>
                <p className={`text-sm mb-6 ${plan.highlight ? 'text-emerald-100' : 'text-slate-600'}`}>
                  {plan.desc}
                </p>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((f) => (
                    <li key={f} className={`flex items-center gap-2 text-sm ${plan.highlight ? 'text-emerald-100' : 'text-slate-600'}`}>
                      <span className="text-emerald-500">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={plan.isLogin ? handleCtaClick : undefined}
                  className={`w-full py-3 rounded-xl font-medium transition-colors ${
                    plan.highlight
                      ? 'bg-white text-emerald-600 hover:bg-emerald-50'
                      : 'bg-slate-900 text-white hover:bg-slate-800'
                  }`}
                >
                  {plan.cta}
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section id="blog" className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Latest from the Blog
            </h2>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">
              Tips, updates, and insights to help you work smarter.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: '10 Tips for Better Project Planning',
                excerpt: 'Learn how to plan projects that actually get delivered on time.',
                date: 'Feb 20, 2025',
                tag: 'Productivity',
                image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=400&fit=crop',
              },
              {
                title: 'How Remote Teams Stay Aligned',
                excerpt: 'Best practices for async collaboration and communication.',
                date: 'Feb 15, 2025',
                tag: 'Remote Work',
                image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=400&fit=crop',
              },
              {
                title: 'Introducing Projectio Analytics',
                excerpt: 'New dashboards and reports to understand your team\'s performance.',
                date: 'Feb 10, 2025',
                tag: 'Product',
                image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop',
              },
              {
                title: 'Building a Productive Home Office',
                excerpt: 'Set up your workspace for maximum focus and efficiency.',
                date: 'Feb 5, 2025',
                tag: 'Workspace',
                image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600&h=400&fit=crop',
              },
            ].map((post, i) => (
              <motion.article
                key={post.title}
                className="group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="relative h-48 rounded-xl mb-4 overflow-hidden bg-slate-100">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                </div>
                <span className="text-emerald-600 text-sm font-medium">{post.tag}</span>
                <h3 className="text-lg font-semibold text-slate-900 mt-2 mb-2 group-hover:text-emerald-600 transition-colors">
                  {post.title}
                </h3>
                <p className="text-slate-600 text-sm mb-4">{post.excerpt}</p>
                <p className="text-slate-400 text-xs">{post.date}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 px-6 bg-slate-50">
        <div className="max-w-3xl mx-auto">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Get in Touch
            </h2>
            <p className="text-slate-600 text-lg">
              Have questions? We&apos;d love to hear from you.
            </p>
          </motion.div>

          <motion.form
            className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Name</label>
                <input
                  type="text"
                  placeholder="Your name"
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                <input
                  type="email"
                  placeholder="you@company.com"
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-colors"
                />
              </div>
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 mb-2">Message</label>
              <textarea
                rows={4}
                placeholder="How can we help?"
                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-colors resize-none"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3.5 bg-emerald-600 text-white font-medium rounded-xl hover:bg-emerald-700 transition-colors"
            >
              Send Message
            </button>
          </motion.form>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default MainLanding
