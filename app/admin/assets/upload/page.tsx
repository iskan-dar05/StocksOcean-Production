'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import UploadForm from '@/components/UploadForm'
import { supabase } from '@/lib/supabaseClient'

export default function AdminUploadAssetsPage() {
  const router = useRouter()
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [isApproved, setIsApproved] = useState(false)
  const [profile, setProfile] = useState<any>(null)

  useEffect(() => {
    checkContributorStatus()
  }, [])

  const checkContributorStatus = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/auth/signin')
        return
      }

      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (profileData) {
        setProfile(profileData)
        // Check if user is an approved contributor (role === 'contributor' or 'admin')
        if (profileData.role === 'contributor' || profileData.role === 'admin') {
          setIsApproved(true)
        }
      }
    } catch (error) {
      console.error('Error checking contributor status:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSuccess = (assetId: string) => {
    setSuccessMessage('Asset uploaded successfully! Redirecting...')
    setTimeout(() => {
      router.push('/contributor/dashboard')
    }, 2000)
  }

  const handleError = (error: string) => {
    // Error is handled by UploadForm component
    console.error('Upload error:', error)
  }

  if (loading) {
    return (
      <div className="min-h-screen">
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-center justify-center py-12">
                <div className="w-8 h-8 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  if (!isApproved) {
    return (
      <div className="min-h-screen">
        <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 md:py-8">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 md:p-8 border border-gray-200">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 sm:mb-6">
                Upload Asset
              </h1>
              
              <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-6 mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-3">
                  Contributor Access Required
                </h2>
                {!profile ? (
                  <>
                    <p className="text-gray-700 dark:text-gray-300 mb-4">
                      You need to apply to become a contributor before you can upload assets.
                    </p>
                    <Link
                      href="/become-contributor"
                      className="inline-block px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all"
                    >
                      Apply to Become a Contributor
                    </Link>
                  </>
                ) : profile.role === 'user' ? (
                  <>
                    <p className="text-gray-700 dark:text-gray-300 mb-4">
                      You need to apply to become a contributor before you can upload assets.
                    </p>
                    <Link
                      href="/become-contributor"
                      className="inline-block px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
                    >
                      Apply to Become a Contributor
                    </Link>
                  </>
                ) : null}
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen">

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Upload Asset
            </h1>

            {successMessage && (
              <div className="mb-6 bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800 rounded-xl p-4">
                <p className="text-sm text-green-800 dark:text-green-200">
                  {successMessage}
                </p>
              </div>
            )}

            <UploadForm onSuccess={handleSuccess} onError={handleError} />
          </div>
        </div>
      </main>

    </div>
  )
}

