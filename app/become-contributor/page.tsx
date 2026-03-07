'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Notification from '@/components/ui/Notification'
import { supabase } from '@/lib/supabaseClient'
import * as Icons from "lucide-react"
import { useAuth } from '@/components/auth/AuthProvider'


export default function BecomeContributorPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [applicationMessage, setApplicationMessage] = useState('')
  const [portfolioUrl, setPortfolioUrl] = useState('')
  const [hasPendingApplication, setHasPendingApplication] = useState(false)
  const [checkingStatus, setCheckingStatus] = useState(true)
  const [notification, setNotification] = useState<{
    message: string
    type: 'success' | 'error' | 'info'
    visible: boolean
  }>({ message: '', type: 'info', visible: false })

  // Check if user already has a pending application
  useEffect(() => {
    const checkApplicationStatus = async () => {
      try {
        if (!user) {
          setCheckingStatus(false)
          return
        }

        const { data: profile } = await supabase
          .from('profiles')
          .select('role, application_date')
          .eq('id', user.id)
          .maybeSingle()

        if (profile) {
          if (profile.role === 'contributor' || profile.role === 'admin') {
            setHasPendingApplication(false)
            setCheckingStatus(false)
            return
          }
          if (profile.application_date && profile.role === 'user') {
            setHasPendingApplication(true)
          }
        }
      } catch (error) {
        console.error('Error checking application status:', error)
      } finally {
        setCheckingStatus(false)
      }
    }

    checkApplicationStatus()
  }, [])

  const handleApply = async () => {
    setLoading(true)
    setNotification({ message: '', type: 'info', visible: false })
    
    try {
      if (!user) {
          setNotification({
          message: 'You must be logged in to apply. Redirecting to sign in...',
          type: 'error',
          visible: true,
        })
          setCheckingStatus(false)
          setTimeout(() => {
          router.push('/auth/signin?redirect=/become-contributor')
        }, 2000)
          return
      }

      const response = await fetch('/api/contributor/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          userEmail: user.email,
          applicationMessage: applicationMessage.trim(),
          portfolioUrl: portfolioUrl.trim(),
        }),
        credentials: 'include',
      })

      let data
      try {
        const text = await response.text()
        data = JSON.parse(text)
      } catch (parseError) {
        throw new Error(`Server error: Received non-JSON response. Status: ${response.status}`)
      }

      if (!response.ok) {
        if (data.hasPendingApplication) setHasPendingApplication(true)
        throw new Error(data.error || `Failed to apply (${response.status})`)
      }

      setNotification({
        message: data.message || 'Application submitted successfully! You will be notified once approved.',
        type: 'success',
        visible: true,
      })
      setHasPendingApplication(true)
    } catch (error: any) {
      setNotification({
        message: error.message || 'Failed to submit application. Please try again.',
        type: 'error',
        visible: true,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <Notification
        message={notification.message}
        type={notification.type}
        isVisible={notification.visible}
        onClose={() => setNotification({ ...notification, visible: false })}
      />

      <main className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-extrabold text-header mb-4">
            Become a Contributor
          </h1>
          <p className="text-xl md:text-2xl text-secondary max-w-3xl mx-auto">
            Turn your creative work into income. Join thousands of creators selling digital assets on StocksOcean.
          </p>
        </motion.div>

        {/* Benefits Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-16">
          <h2 className="text-3xl font-bold text-header mb-8 text-center">
            Why Sell on StocksOcean?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: 'Fair Revenue Share',
                description: 'Earn competitive commissions on every sale. Set your own prices and keep more of what you make.',
                icon: 'DollarSign'
              },
              {
                title: 'Global Reach',
                description: 'Reach millions of potential buyers worldwide. Your assets are discoverable by businesses and creators everywhere.',
                icon: 'Globe'
              },
              {
                title: 'Easy Upload Process',
                description: 'Upload your assets in minutes. Our simple interface makes it easy to add titles, descriptions, and tags.',
                icon: 'UploadCloud'
              },
              {
                title: 'Fast Approval',
                description: 'Our team reviews submissions quickly, typically within 24-48 hours. Get your assets live fast.',
                icon: 'Zap'
              },
              {
                title: 'Analytics Dashboard',
                description: 'Track your sales, views, and earnings with detailed analytics. See what works and optimize your portfolio.',
                icon: 'BarChart3'
              },
              {
                title: 'Support & Resources',
                description: 'Get help when you need it. Our support team and resources help you succeed as a contributor.',
                icon: 'Headset'
              },
            ].map((benefit, idx) => {
              const Icon = Icons[benefit.icon]
              return (
                <motion.div key={idx} whileHover={{ y: -5, scale: 1.02 }} transition={{ delay: 0.2 + idx * 0.1 }} className="flex flex-col justify-center items-center bg-white rounded-xl p-6 border border-header shadow-md hover:shadow-xl transition-all text-center">
                <Icon className="w-9 h-9 text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold text-primary mb-2">{benefit.title}</h3>
                <p className="text-secondary">{benefit.description}</p>
              </motion.div>
              )
              
            })}
          </div>
        </motion.div>

        {/* How It Works */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="max-w-4xl mx-auto mb-16 px-4">
          <h2 className="text-3xl font-bold text-header mb-8 text-center">How It Works</h2>
          <div className="relative border-l-2 border-gray-700 pl-8 space-y-8">
            {[
              { step: '1', title: 'Create Your Account', description: 'Sign up for free and complete your contributor profile. Add your bio, portfolio link, and payment information.' },
              { step: '2', title: 'Upload Your Assets', description: 'Upload your images, videos, or 3D models. Add titles, descriptions, tags, and set your prices.' },
              { step: '3', title: 'Get Approved', description: 'Our team reviews your submissions to ensure quality. Most assets are approved within 24-48 hours.' },
              { step: '4', title: 'Start Earning', description: 'Once approved, your assets go live. Start earning money as subscribers download your work.' },
            ].map((step, idx) => (
              <motion.div key={idx} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 + idx * 0.1 }} className="flex gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold shadow-lg">{step.step}</div>
                <div>
                  <h3 className="text-xl font-semibold text-primary">{step.title}</h3>
                  <p className="text-secondary mt-1">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Requirements */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} className="max-w-4xl mx-auto mb-16">
          <div className="bg-header rounded-2xl shadow-lg p-6 border border-gray-700">
            <h2 className="text-3xl font-bold text-white mb-6">Requirements</h2>
            <ul className="space-y-4">
              {[
                'High-quality, original digital assets (images, videos, or 3D models)',
                'Proper file formats: JPG, PNG, WebP, GIF, MP4, or GLB',
                'Files must be under 50MB',
                'Clear, descriptive titles and descriptions',
                'Relevant tags for discoverability',
                'Commercial license rights for all uploaded content',
              ].map((req, idx) => (
                <li key={idx} className="flex items-start gap-3 p-3 rounded-lg hover:bg-green-600 transition-colors">
                  <svg className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-300">{req}</span>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>

        {/* Application Form */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }} className="max-w-2xl mx-auto mb-16 px-4">
          <div className="bg-header rounded-2xl shadow-lg p-6 border border-header">
            <h2 className="text-3xl font-bold text-white mb-6 text-center">Apply to Become a Contributor</h2>
            <p className="text-gray-100 mb-6 text-center">Fill out the form below to start your journey as a contributor. Our team will review your application and get back to you soon.</p>

            {checkingStatus ? (
              <div className="text-center py-8">
                <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-300">Checking application status...</p>
              </div>
            ) : hasPendingApplication ? (
              <div className="bg-yellow-500/20 border-2 border-yellow-400 rounded-xl p-6 text-center animate-pulse">
                <div className="text-5xl mb-4">⏳</div>
                <h3 className="text-xl font-semibold text-white mb-2">Application Pending Review</h3>
                <p className="text-gray-100 mb-4">You have already submitted an application. Our team is reviewing it and you will be notified once a decision is made.</p>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">Why do you want to become a contributor? <span className="text-red-500">*</span></label>
                  <textarea
                    value={applicationMessage}
                    onChange={(e) => setApplicationMessage(e.target.value)}
                    rows={4}
                    placeholder="Tell us about yourself and your creative work..."
                    className="w-full px-4 py-3 rounded-lg bg-white text-primary focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">Portfolio or Website (Optional)</label>
                  <input
                    type="url"
                    value={portfolioUrl}
                    onChange={(e) => setPortfolioUrl(e.target.value)}
                    placeholder="https://yourportfolio.com"
                    className="w-full px-4 py-3 rounded-lg bg-white text-primary border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <button
                  onClick={handleApply}
                  disabled={loading || hasPendingApplication}
                  className="w-full py-3 bg-blue-500 hover:bg-blue-700 rounded-xl text-white font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Applying...' : 'Submit Application'}
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  )
}
