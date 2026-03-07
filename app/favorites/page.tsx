'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import AssetCard from '@/components/marketplace/AssetCard'
import { supabase } from '@/lib/supabaseClient'
import type { Database } from '@/types/supabase'
import { useAuth } from '@/components/auth/AuthProvider'


type Asset = Database['public']['Tables']['assets']['Row']

export default function FavoritesPage() {
  const { user, loading: authLoading } = useAuth()
  const [favoriteAssets, setFavoriteAssets] = useState<Asset[]>([])
  const [loading, setLoading] = useState(true)

  const fetchFavoriteAssets = useCallback(async () => {
  try {
    if (!user) return

    const { data: favorites } = await supabase
      .from('favorites')
      .select('asset_id')
      .eq('user_id', user.id)

    if (!favorites || favorites.length === 0) {
      setFavoriteAssets([])
      setLoading(false)
      return
    }

    const assetIds = favorites.map(f => f.asset_id)

    const { data, error } = await supabase
      .from('assets')
      .select('*')
      .in('id', assetIds)
      .eq('status', 'approved')

    if (error) throw error

    setFavoriteAssets(data || [])

  } catch (error) {
    console.error('Error fetching favorite assets:', error)
  } finally {
    setLoading(false)
  }

}, [user])

 useEffect(() => {
  if (!user) return

  fetchFavoriteAssets()

  

}, [user, fetchFavoriteAssets])

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 md:py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 sm:mb-8"
        >
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-header mb-2">
            My Favorites
          </h1>
          <p className="text-sm sm:text-base text-secondary">
            Your saved favorite assets
          </p>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md border border-gray-200 dark:border-gray-700 animate-pulse"
              >
                <div className="aspect-video bg-gray-200 dark:bg-gray-700" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full" />
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : favoriteAssets.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favoriteAssets.map((asset, index) => (
              <motion.div
                key={asset.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <AssetCard asset={asset} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="max-w-md mx-auto">
              <svg
                className="mx-auto h-16 w-16 text-header mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                />
              </svg>
              <h2 className="text-2xl font-bold text-primary mb-2">
                No Favorites Yet
              </h2>
              <p className="text-secondary mb-6">
                Start exploring and save your favorite assets by clicking the bookmark icon.
              </p>
              <Link
                href="/browse"
                className="inline-block px-6 py-3 bg-header hover:bg-white hover:border hover:border-header hover:text-header text-white rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl"
              >
                Browse Assets
              </Link>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}

