'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import ContributorBulkUploadForm from '@/components/contributor/BulkUploadForm'
import { supabase } from '@/lib/supabaseClient'

export default function ContributorBulkUploadPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [isApproved, setIsApproved] = useState(false)

  useEffect(() => {
    const checkContributorStatus = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        
        if (!user) {
          router.push('/auth/signin')
          return
        }

        const { data: profileData } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single()

        if (profileData && (profileData.role === 'contributor' || profileData.role === 'admin')) {
          setIsApproved(true)
        }
      } catch (error) {
        console.error('Error checking contributor status:', error)
      } finally {
        setLoading(false)
      }
    }

    checkContributorStatus()
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!isApproved) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Access Denied
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                You need to be an approved contributor to use bulk upload.
              </p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <ContributorBulkUploadForm />
        </div>
      </main>
      <Footer />
    </div>
  )
}

