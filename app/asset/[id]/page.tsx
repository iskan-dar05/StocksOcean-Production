'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import RelatedAssets from '@/components/marketplace/RelatedAssets'
import { supabase } from '@/lib/supabaseClient'
import type { Database } from '@/types/supabase'
import { useAuth } from '@/components/auth/AuthProvider'
import toast from 'react-hot-toast'

type Asset = Database['public']['Tables']['assets']['Row']
type Profile = Database['public']['Tables']['profiles']['Row']

export default function AssetDetailPage({ params }: { params: { id: string } }) {
  const { user, loading: authLoading } = useAuth()
  const [loading, setLoading] = useState(false)
  const [asset, setAsset] = useState<Asset | null>(null)
  const [contributor, setContributor] = useState<Profile | null>(null)
  const [relatedAssets, setRelatedAssets] = useState<Asset[]>([])
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [hasActiveSubscription, setHasActiveSubscription] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    fetchAsset()
  }, [params.id])

  useEffect(() => {
  checkSubscription()
}, [user])

  const checkSubscription = async () => {
    try {


      if (!user) {
        setHasActiveSubscription(false)
        return
      }


      // Check for active subscription
      const { data: subscription } = await supabase
        .from('subscriptions')
        .select('id')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .single()

      setHasActiveSubscription(!!subscription)
    } catch (error) {
      setHasActiveSubscription(false)
    }
  }

  const fetchAsset = async () => {
    setLoading(true)
    try {
      // Fetch asset
      const { data: assetData, error: assetError } = await supabase
        .from('assets')
        .select('*')
        .eq('id', params.id)
        .single()

      if (assetError || !assetData) {
        throw new Error(assetError?.message || 'Asset not found')
      }
      setAsset(assetData)

      // Get preview URL
      if (assetData.preview_path) {
        setPreviewUrl(assetData.preview_path)
      } else if (assetData.type === 'image' && assetData.storage_path) {
        const { data } = supabase.storage.from('assets').getPublicUrl(assetData.storage_path)
        setPreviewUrl(data.publicUrl)
      }

      // Fetch contributor profile (if profiles table exists)
      if (assetData.contributor_id) {
        try {
          const { data: profileData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', assetData.contributor_id)
            .single()

          if (profileData) {
            // For admin accounts, always use 'StocksOcean' as username and don't show real profile name
            if (profileData.role === 'admin') {
              setContributor({ username: 'StocksOcean', avatar_url: null, role: 'admin' } as any)
            } else {
              setContributor(profileData)
            }
          }
        } catch (error) {
          // Profiles table might not exist, use auth.users data instead
          console.warn('Could not fetch profile:', error)
          setLoading(false)
        }
      } else {
        // No contributor_id means it's an admin upload
        setContributor({ username: 'StocksOcean', avatar_url: null, role: 'admin' } as any)
      }

      // Fetch related assets (same type or same contributor)
      let relatedQuery = supabase
        .from('assets')
        .select('*')
        .eq('status', 'approved')
        .neq('id', params.id)
        .eq('type', assetData.type)
      
      if (assetData.contributor_id) {
        relatedQuery = relatedQuery.or(`type.eq.${assetData.type},contributor_id.eq.${assetData.contributor_id}`)
      }
      
      const { data: relatedData } = await relatedQuery.limit(4)

      setRelatedAssets(relatedData || [])
      setLoading(false)
    } catch (error) {
      console.error('Error fetching asset:', error)
    } finally {
      setLoading(false)
    }
  }


  const handleDownload = async () => {
  if (!user) {
    const returnUrl = encodeURIComponent(`/asset/${params.id}`)
    window.location.href = `/auth/signin?redirect=${returnUrl}`
    return
  }

  if (!hasActiveSubscription) {
    const returnUrl = encodeURIComponent(`/asset/${params.id}`)
    window.location.href = `/pricing?redirect=${returnUrl}`
    return
  }

  const toastId = toast.loading("Preparing download...")

  try {
    const res = await fetch('/api/assets/download', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ assetId: params.id })
    })

    const data = await res.json()

    if (data.url) {
      toast.success("Download started", { id: toastId })
      const link = document.createElement('a')
      link.href = data.url
      link.download = `${asset?.title || 'asset'}`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

    } else {
      toast.error(data.error || "Download failed", { id: toastId })
    }

  } catch (error) {
    toast.error("Error downloading file", { id: toastId })
  }
}

  const handleFreeDownload = async () => {
    if (!previewUrl || !asset) return

    try {
      // Only apply watermark for images
      if (asset.type.toLowerCase() === 'image') {
        // Create an image element to load the image
        const img = new Image()
        img.crossOrigin = 'anonymous'
        
        img.onload = () => {
          try {
            // Create canvas
            const canvas = document.createElement('canvas')
            const ctx = canvas.getContext('2d')
            if (!ctx) {
              throw new Error('Could not get canvas context')
            }

            // Set canvas size to image size
            canvas.width = img.width
            canvas.height = img.height

            // Draw the image
            ctx.drawImage(img, 0, 0)

            // Add watermark
            const fontSize = Math.max(canvas.width / 20, 24)
            ctx.font = `bold ${fontSize}px Arial`
            ctx.textAlign = 'center'
            ctx.textBaseline = 'middle'
            
            const watermarkText = 'StocksOcean.com'
            const textX = canvas.width / 2
            const textY = canvas.height / 2

            // Draw watermark background for better visibility
            const textMetrics = ctx.measureText(watermarkText)
            const textWidth = textMetrics.width
            const textHeight = fontSize
            const padding = 20

            ctx.fillStyle = 'rgba(0, 0, 0, 0.6)'
            ctx.fillRect(
              textX - textWidth / 2 - padding,
              textY - textHeight / 2 - padding,
              textWidth + padding * 2,
              textHeight + padding * 2
            )

            // Draw watermark text
            ctx.fillStyle = 'rgba(255, 255, 255, 0.95)'
            ctx.fillText(watermarkText, textX, textY)

            // Convert canvas to blob and download
            canvas.toBlob((blob) => {
              if (!blob) {
                throw new Error('Could not create blob')
              }
              const url = URL.createObjectURL(blob)
              const link = document.createElement('a')
              link.href = url
              link.download = `${asset.title || 'asset'}_watermarked.jpg`
              document.body.appendChild(link)
              link.click()
              document.body.removeChild(link)
              URL.revokeObjectURL(url)
            }, 'image/jpeg', 0.9)
          } catch (canvasError) {
            console.error('Canvas error:', canvasError)
            // Fallback: download original with watermark note
            alert('Watermark could not be applied. Downloading original image.')
            const link = document.createElement('a')
            link.href = previewUrl
            link.download = `${asset.title || 'asset'}_preview.jpg`
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
          }
        }

        img.onerror = () => {
          // If image fails to load due to CORS, try fetching via proxy or direct download
          console.warn('Image load failed, trying direct download')
          // Try to fetch the image and apply watermark server-side would be ideal
          // For now, just download the preview
          const link = document.createElement('a')
          link.href = previewUrl
          link.download = `${asset.title || 'asset'}_preview.jpg`
          link.target = '_blank'
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
        }

        img.src = previewUrl
      } else {
        // For non-image assets, just download the preview
        const link = document.createElement('a')
        link.href = previewUrl
        link.download = `${asset.title || 'asset'}_preview`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }
    } catch (error) {
      console.error('Error downloading watermarked image:', error)
      alert('Error downloading image. Please try again.')
    }
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="flex justify-center items-center py-20">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!asset) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Asset Not Found
          </h1>
          <Link
            href="/browse"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            Browse Assets
          </Link>
        </main>
        <Footer />
      </div>
    )
  }

  const typeColors: { [key: string]: string } = {
    image: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    video: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    '3d': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    other: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="container-fluid py-4 sm:py-6 md:py-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
            {/* Preview Section */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700 sticky top-4 lg:top-8 self-start"
            >
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt={asset.title}
                  loading="eager"
                  decoding="async"
                  className="w-full h-auto object-contain max-h-[70vh] sm:max-h-[80vh]"
                />
              ) : (
                <div className="aspect-video bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                  <svg
                    className="w-24 h-24 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              )}
            </motion.div>

            {/* Details Section */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              {/* Title and Type */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span
                    className={`px-3 py-1 rounded-lg text-sm font-semibold ${
                      typeColors[asset.type.toLowerCase()] || typeColors.other
                    }`}
                  >
                    {asset.type.toUpperCase()}
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
                  {asset.title}
                </h1>
                {asset.description && (
                  <p className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                    {asset.description}
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-200 dark:border-gray-700 sticky top-4 lg:top-8">
                {hasActiveSubscription ? (
                  /* User has active subscription - Show Download button */
                  <div className="space-y-3">
                    <button
                      onClick={handleDownload}
                      className="w-full px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-base bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2 touch-manipulation active:scale-95"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      Download Asset
                    </button>
                    <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                      Included in your subscription plan
                    </p>
                  </div>
                ) : (
                  /* User doesn't have subscription - Show subscription options */
                  <div className="space-y-4">
                    <div className="text-center mb-4">
                      <p className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        Subscribe to Download
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Get unlimited access to all assets with a subscription plan
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        const returnUrl = encodeURIComponent(`/asset/${params.id}`)
                        if (!user) {
                          window.location.href = `/auth/signin?redirect=${returnUrl}`
                        } else {
                          window.location.href = `/pricing?redirect=${returnUrl}`
                        }
                      }}
                      className="block w-full px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-base bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-center touch-manipulation active:scale-95"
                    >
                      {user ? 'View Subscription Plans' : 'Sign In to Subscribe'}
                    </button>
                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                      <button
                        onClick={handleFreeDownload}
                        className="w-full px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 touch-manipulation active:scale-95"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                          />
                        </svg>
                        Free Preview (Watermarked)
                      </button>
                      <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-2">
                        Download a watermarked preview for free
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Tags */}
              {asset.tags && asset.tags.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {asset.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Contributor Info */}
              {contributor && (
                <div
                  className={`bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow ${asset.contributor_id ? 'cursor-pointer' : ''}`}
                  onClick={asset.contributor_id ? () => window.location.href = `/contributor/${asset.contributor_id}` : undefined}
                >
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
                    {contributor.role === 'admin' ? 'Official Content' : 'Contributor'}
                  </h3>
                  <div className="flex items-center gap-4">
                    {contributor.role === 'admin' ? (
                      // Show site logo for admin accounts
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 ring-2 ring-yellow-400 flex items-center justify-center shadow-lg">
                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                          <span className="text-gray-900 font-bold text-lg">SO</span>
                        </div>
                      </div>
                    ) : contributor.avatar_url ? (
                      <img
                        src={contributor.avatar_url}
                        alt={contributor.username || 'Contributor'}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white font-semibold">
                        {(contributor.username || 'C')[0].toUpperCase()}
                      </div>
                    )}
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {contributor.role === 'admin' ? 'StocksOcean Official' : (contributor.username || 'Contributor')}
                        </p>
                        {contributor.role === 'admin' && (
                          <span className="px-1.5 py-0.5 bg-yellow-500 text-yellow-900 text-[10px] font-bold rounded">
                            OFFICIAL
                          </span>
                        )}
                      </div>
                      {asset.contributor_id && (
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {(contributor as any).total_download_count || 0} downloads
                        </p>
                      )}
                      {contributor.role === 'admin' && (
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Official platform content
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>

          {/* Related Assets */}
          {relatedAssets.length > 0 && (
            <RelatedAssets assets={relatedAssets} currentAssetId={params.id} />
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
