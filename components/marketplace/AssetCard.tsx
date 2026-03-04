'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { supabase } from '@/lib/supabaseClient'

interface AssetCardProps {
  asset: {
    id: string
    title: string
    description?: string | null
    type: string
    price: number
    preview_path?: string | null
    storage_path: string
    status?: string
    tags?: string[] | null
    contributor_id?: string | null
  }
}

export default function AssetCard({ asset }: AssetCardProps) {
  const [isFavorite, setIsFavorite] = useState(false)
  const [contributor, setContributor] = useState<{ username: string | null; avatar_url: string | null; role: string | null } | null>(null)
  const [user, setUser] = useState<any | null>(null)

  // Load favorite status from localStorage

  useEffect(() => {
  const getUser = async () => {
    const { data, error } = await supabase.auth.getUser()

    if (error || !data?.user) {
      window.location.href = '/auth/signin'
      return
    }

    setUser(data.user)
  }

  getUser()
}, [])


  useEffect(() => {
    if(!user) return
    const checkFavorite = async () => {
      const {data} = await supabase.from('favorites').select('id').eq('user_id', user.id).eq('asset_id', asset.id)
      setIsFavorite(data.length > 0)
    }
    
    checkFavorite()
  }, [user, asset.id])

  // Get preview URL
  const getPreviewUrl = (): string | null => {
    if (asset.preview_path) {
      return asset.preview_path
    }
    if (asset.type === 'image' && asset.storage_path) {
      try {
        const { data } = supabase.storage.from('assets').getPublicUrl(asset.storage_path)
        return data.publicUrl
      } catch (error) {
        console.error('Error getting preview URL:', error)
        return null
      }
    }
    return null
  }

  const previewUrl = getPreviewUrl()

  // Fetch contributor info if available
  useEffect(() => {
    if (asset.contributor_id) {
      supabase
        .from('profiles')
        .select('username, avatar_url, role')
        .eq('id', asset.contributor_id)
        .single()
        .then(({ data, error }) => {
          if (data) {
            // For admin accounts, always use 'StocksOcean' as username and don't show real profile name
            if (data.role === 'admin') {
              setContributor({ username: 'StocksOcean', avatar_url: null, role: 'admin' })
            } else {
              setContributor(data)
            }
          }
          // Profile might not exist, ignore errors
        })
    } else {
      // If no contributor_id, it's an admin upload
      setContributor({ username: 'StocksOcean', avatar_url: null, role: 'admin' })
    }
  }, [asset.contributor_id])

  const handleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    try {      
      if (isFavorite) {
        setIsFavorite(false)
        await supabase.from('favorites').delete().eq('user_id', user.id).eq('asset_id', asset.id)
      } else {
        setIsFavorite(true)
        await supabase.from('favorites').insert({
          user_id: user.id,
          asset_id: asset.id
        })
      }
      
      // Dispatch custom event to notify other components
      window.dispatchEvent(new CustomEvent('favoritesUpdated'))
    } catch (error) {
      console.error('Error saving favorite:', error)
    }
  }

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    // TODO: Implement add to collection functionality
  }

  const handleDownload = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    // TODO: Implement download functionality
    window.location.href = `/asset/${asset.id}`
  }

  // Get contributor initials
  const getInitials = (name: string | null) => {
    if (!name) return 'U'
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -4 }}
      className="group bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700"
    >
      {/* Preview Image - Entire card is clickable */}
      <Link href={`/asset/${asset.id}`} className="block relative aspect-video bg-gray-100 dark:bg-gray-700 overflow-hidden cursor-pointer">
        {previewUrl ? (
          <img
            src={previewUrl}
            alt={asset.title}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg
              className="w-16 h-16 text-gray-400"
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

        {/* Dark Overlay on Hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-all duration-300 pointer-events-none" />

        {/* Top Right - Bookmark Button (appears on hover) */}
        <div className="absolute top-4 right-4 z-20 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-[-10px] group-hover:translate-y-0">
          {/* Bookmark Button */}
          <button
            onClick={handleFavorite}
            className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-lg hover:bg-gray-50 transition-all"
          >
            <svg
              className={`w-5 h-5 transition-colors ${
                isFavorite ? 'text-red-500 fill-current' : 'text-gray-900'
              }`}
              fill={isFavorite ? 'currentColor' : 'none'}
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
          </button>
        </div>

        {/* Bottom Left - Contributor Info (appears on hover) */}
        {(asset.contributor_id || contributor?.role === 'admin') && (
          <>
            {/* Mobile/Tablet - Minimal Version (just tiny avatar + badge) - NO TEXT */}
            <div className="absolute bottom-1.5 left-1.5 z-30 lg:hidden">
              <div
                onClick={(e) => {
                  e.stopPropagation()
                  e.preventDefault()
                  if (asset.contributor_id) {
                    window.location.href = `/contributor/${asset.contributor_id}`
                  }
                }}
                className={`relative ${asset.contributor_id ? 'cursor-pointer' : 'cursor-default'}`}
              >
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-white font-semibold text-[8px] shadow-md ${
                  contributor?.role === 'admin' 
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 ring-1 ring-yellow-400' 
                    : 'bg-gradient-to-r from-blue-600 to-purple-600'
                }`}>
                  {contributor?.role === 'admin' ? (
                    <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                      <span className="text-gray-900 font-bold text-[7px]">SO</span>
                    </div>
                  ) : contributor?.avatar_url ? (
                    <img
                      src={contributor.avatar_url}
                      alt={contributor.username || 'Contributor'}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-[7px]">{getInitials(contributor?.username || 'User')}</span>
                  )}
                </div>
                {contributor?.role === 'admin' && (
                  <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-yellow-500 rounded-full border border-white flex items-center justify-center">
                    <span className="text-[6px] text-yellow-900 font-bold">✓</span>
                  </span>
                )}
              </div>
            </div>

            {/* Desktop - Full Version with Text (only on large screens) */}
            <div className="absolute bottom-4 left-4 z-[35] opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-[10px] group-hover:translate-y-0 hidden lg:block max-w-[calc(100%-120px)]">
              <div
                onClick={(e) => {
                  e.stopPropagation()
                  e.preventDefault()
                  if (asset.contributor_id) {
                    window.location.href = `/contributor/${asset.contributor_id}`
                  }
                }}
                className={`flex items-center gap-3 hover:opacity-90 transition-opacity ${asset.contributor_id ? 'cursor-pointer' : 'cursor-default'}`}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-lg flex-shrink-0 ${
                  contributor?.role === 'admin' 
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 ring-2 ring-yellow-400' 
                    : 'bg-gradient-to-r from-blue-600 to-purple-600'
                }`}>
                  {contributor?.role === 'admin' ? (
                    <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                      <span className="text-gray-900 font-bold text-lg">SO</span>
                    </div>
                  ) : contributor?.avatar_url ? (
                    <img
                      src={contributor.avatar_url}
                      alt={contributor.username || 'Contributor'}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    getInitials(contributor?.username || 'User')
                  )}
                </div>
                <div className="bg-gray-900/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg max-w-[200px]">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-white truncate">
                      {contributor?.role === 'admin' ? 'StocksOcean Official' : (contributor?.username || 'StocksOcean')}
                    </p>
                    {contributor?.role === 'admin' && (
                      <span className="px-1.5 py-0.5 bg-yellow-500 text-yellow-900 text-[10px] font-bold rounded flex-shrink-0">
                        OFFICIAL
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-white/70 truncate">
                    {contributor?.role === 'admin' ? 'Official Content' : 'For StocksOcean'}
                  </p>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Bottom Right - Download Button (appears on hover) */}
        <button
          onClick={handleDownload}
          className="absolute bottom-2 right-2 md:bottom-4 md:right-4 z-[40] px-2 py-1.5 md:px-4 md:py-2.5 bg-white rounded md:rounded-lg flex items-center gap-1 md:gap-2 shadow-lg hover:bg-gray-50 transition-all opacity-0 group-hover:opacity-100 transform translate-y-[10px] group-hover:translate-y-0 pointer-events-auto"
        >
          <svg className="w-3 h-3 md:w-4 md:h-4 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span className="text-[10px] md:text-sm font-medium text-gray-900 hidden sm:inline">Download</span>
        </button>

      </Link>
    </motion.div>
  )
}
