'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import AssetCard from '@/components/marketplace/AssetCard'
import ContributorStats from '@/components/contributor/ContributorStats'
import LevelBadge from '@/components/contributor/LevelBadge'
import ProgressBar from '@/components/contributor/ProgressBar'
import { supabase } from '@/lib/supabaseClient'
import { Grid, List } from 'lucide-react'
import type { Database } from '@/types/supabase'

type Asset = Database['public']['Tables']['assets']['Row']
type Profile = Database['public']['Tables']['profiles']['Row']

interface ContributorLevel {
  id: string
  name: string
  min_lifetime_downloads: number | null
  max_lifetime_downloads: number | null
  earnings_per_download: number | null
  revenue_share_percent: number
  benefits: string[]
}

export default function ContributorDashboardPage() {
  const [assets, setAssets] = useState<Asset[]>([])
  const [profile, setProfile] = useState<Profile | null>(null)
  const [currentLevel, setCurrentLevel] = useState<ContributorLevel | null>(null)
  const [nextLevel, setNextLevel] = useState<ContributorLevel | null>(null)
  const [stats, setStats] = useState({
    totalAssets: 0,
    views: 0,
    downloads: 0,
    earnings: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        window.location.href = '/auth/signin'
        return
      }

      // Check contributor status
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (profileData) {
        setProfile(profileData)

        // If not an approved contributor, show message and stop loading
        if (profileData.role !== 'contributor' && profileData.role !== 'admin') {
          setLoading(false)
          return
        }
      } else {
        // No profile exists - user hasn't applied yet
        setLoading(false)
        return
      }

      // Fetch user's assets
      const { data: assetsData, error: assetsError } = await supabase
        .from('assets')
        .select('*')
        .eq('contributor_id', user.id)
        .order('created_at', { ascending: false })

      if (assetsError) throw assetsError
      setAssets(assetsData || [])

      // Calculate stats
      const totalAssets = assetsData?.length || 0
      const views = assetsData?.reduce((sum, a) => sum + (a.views || 0), 0) || 0
      const downloads = assetsData?.reduce((sum, a) => sum + (a.downloads || 0), 0) || 0
      // Calculate earnings from earnings table
      const { data: earningsData } = await supabase
        .from('earnings')
        .select('amount')
        .eq('owner_id', user.id)
      const earnings = earningsData?.reduce((sum, e) => sum + Number(e.amount || 0), 0) || 0
      console.log("EARNINGS:: ", earnings)

      // Get lifetime downloads from profile
      const lifetimeDownloads = profileData?.total_download_count || 0

      setStats({
        totalAssets,
        views,
        downloads,
        earnings: Number(earnings),
      })

      // Fetch all contributor levels
      const { data: allLevelsData } = await supabase
        .from('contributor_levels' as any)
        .select('*')
        .order('min_lifetime_downloads', { ascending: true, nullsFirst: false })

      if (allLevelsData && allLevelsData.length > 0) {
        // Type assertion for contributor levels data
        const typedLevels = allLevelsData as any[]
        
        // Find current level based on lifetime downloads
        const currentLevelData = typedLevels.find((level: any) => {
          const min = level.min_lifetime_downloads ?? 0
          const max = level.max_lifetime_downloads ?? Infinity
          return lifetimeDownloads >= min && lifetimeDownloads <= max
        })

        if (currentLevelData) {
          setCurrentLevel({
            id: currentLevelData.id,
            name: currentLevelData.name,
            min_lifetime_downloads: currentLevelData.min_lifetime_downloads,
            max_lifetime_downloads: currentLevelData.max_lifetime_downloads,
            earnings_per_download: currentLevelData.earnings_per_download,
            revenue_share_percent: currentLevelData.revenue_share_percent,
            benefits: (currentLevelData.benefits as string[]) || [],
          })

          // Find next level
          const currentIndex = typedLevels.findIndex((l: any) => l.id === currentLevelData.id)
          if (currentIndex < typedLevels.length - 1) {
            const next = typedLevels[currentIndex + 1]
            setNextLevel({
              id: next.id,
              name: next.name,
              min_lifetime_downloads: next.min_lifetime_downloads,
              max_lifetime_downloads: next.max_lifetime_downloads,
              earnings_per_download: next.earnings_per_download,
              revenue_share_percent: next.revenue_share_percent,
              benefits: (next.benefits as string[]) || [],
            })
          }
        } else if (typedLevels.length > 0) {
          // No current level found, set first level as next
          const first = typedLevels[0] as any
          setNextLevel({
            id: first.id,
            name: first.name,
            min_lifetime_downloads: first.min_lifetime_downloads,
            max_lifetime_downloads: first.max_lifetime_downloads,
            earnings_per_download: first.earnings_per_download,
            revenue_share_percent: first.revenue_share_percent,
            benefits: (first.benefits as string[]) || [],
          })
        }
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const badges: { [key: string]: string } = {
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      approved: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      rejected: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    }
    return badges[status] || badges.pending
  }

  // Show approval pending message
  if (!loading && profile && profile.role !== 'contributor' && profile.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Contributor Application Not Approved
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                You need to apply to become a contributor before you can access the dashboard. You will receive an email notification once approved.
              </p>
              <Link
                href="/become-contributor"
                className="inline-block px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all"
              >
                Learn More
              </Link>
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

      <main className="container-fluid py-4 sm:py-6 md:py-8">
        <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-2">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                Contributor Dashboard
              </h1>
              {currentLevel && (
                <LevelBadge level={currentLevel.id as any} size="lg" />
              )}
            </div>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
              Manage your assets and track your performance
            </p>
          </div>
          {profile && (profile.role === 'contributor' || profile.role === 'admin') && (
            <div className="flex flex-wrap gap-2 sm:gap-3">
              <Link
                href="/contributor/upload"
                className="px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
              >
                Upload Asset
              </Link>
              <Link
                href="/contributor/bulk-upload"
                className="px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl"
              >
                Bulk Upload
              </Link>
            </div>
          )}
        </div>

        {/* Contributor Level Section */}
        {currentLevel && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 sm:p-6 mb-6 sm:mb-8 border border-gray-200 dark:border-gray-700"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6 mb-4 sm:mb-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Contributor Level: {currentLevel.name}
                </h2>
                <div className="space-y-1">
                  <p className="text-gray-600 dark:text-gray-400">
                    Revenue Share: <span className="font-semibold">{currentLevel.revenue_share_percent}%</span>
                  </p>
                  {currentLevel.earnings_per_download && (
                    <p className="text-gray-600 dark:text-gray-400">
                      Earnings per Download: <span className="font-semibold">${currentLevel.earnings_per_download.toFixed(2)}</span>
                    </p>
                  )}
                </div>
              </div>
              <LevelBadge level={currentLevel.id as any} size="lg" />
            </div>

            {/* Level Benefits */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Your Benefits:
              </h3>
              <div className="flex flex-wrap gap-2">
                {currentLevel.benefits.map((benefit, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-lg text-sm"
                  >
                    {benefit}
                  </span>
                ))}
              </div>
            </div>

            {/* Progress to Next Level */}
            {nextLevel && nextLevel.min_lifetime_downloads !== null && (
              <div className="space-y-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Progress to {nextLevel.name} Level
                </h3>
                <ProgressBar
                  current={profile?.total_download_count || 0}
                  target={nextLevel.min_lifetime_downloads || 0}
                  label="Lifetime Downloads"
                  type="downloads"
                />
                <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    <strong>Next Level Benefits:</strong> {nextLevel.benefits.join(', ')}
                  </p>
                  <div className="mt-2 space-y-1">
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      Revenue Share: <strong>{nextLevel.revenue_share_percent}%</strong>
                    </p>
                    {nextLevel.earnings_per_download && (
                      <p className="text-sm text-blue-700 dark:text-blue-300">
                        Earnings per Download: <strong>${nextLevel.earnings_per_download.toFixed(2)}</strong>
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700"
          >
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Assets</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {stats.totalAssets}
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700"
          >
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Views</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.views}</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700"
          >
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Downloads</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.downloads}</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700"
          >
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Earnings</p>
            <p className="text-3xl font-bold text-green-600 dark:text-green-400">
              ${stats.earnings.toFixed(2)}
            </p>
            {currentLevel && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {currentLevel.revenue_share_percent}% revenue share
              </p>
            )}
          </motion.div>
        </div>

        {/* Earnings Chart */}
        {stats.totalAssets > 0 && (
          <div className="mb-8">
            <ContributorStats
              totalAssets={stats.totalAssets}
              views={stats.views}
              downloads={stats.downloads}
              earnings={stats.earnings}
            />
          </div>
        )}

        {/* Assets List */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 sm:mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Your Assets</h2>
            <div className="flex gap-2">
              <button className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <Grid className="w-4 h-4" />
              </button>

              <button className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
          {loading ? (
            <div className="flex justify-center py-8 sm:py-12">
              <div className="w-10 h-10 sm:w-12 sm:h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : assets.length > 0 ? (
            <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {assets.map((asset, index) => (
                <motion.div
                  key={asset.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="relative"
                >
                  <AssetCard asset={asset} />
                  <div className="absolute top-3 right-3">
                    <span
                      className={`px-2 py-1 rounded-md text-xs font-semibold ${getStatusBadge(
                        asset.status || 'pending'
                      )}`}
                    >
                      {asset.status?.toUpperCase() || 'PENDING'}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400">No assets uploaded yet.</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
