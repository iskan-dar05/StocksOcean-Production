'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { supabase } from '@/lib/supabaseClient'
import type { Database } from '@/types/supabase'

type Asset = Database['public']['Tables']['assets']['Row']

interface AssetCarouselProps {
  assets: Asset[]
  autoScrollInterval?: number
}

export default function AssetCarousel({
  assets,
  autoScrollInterval = 5000,
}: AssetCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)

  useEffect(() => {
    if (assets.length <= 1) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % assets.length)
    }, autoScrollInterval)

    return () => clearInterval(interval)
  }, [assets.length, autoScrollInterval])

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return

    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > 50
    const isRightSwipe = distance < -50

    if (isLeftSwipe && currentIndex < assets.length - 1) {
      setCurrentIndex(currentIndex + 1)
    }
    if (isRightSwipe && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }

  const getPreviewUrl = (asset: Asset): string | null => {
    if (asset.preview_path) return asset.preview_path
    if (asset.type === 'image' && asset.storage_path) {
      try {
        const { data } = supabase.storage.from('assets').getPublicUrl(asset.preview_path)
        return data.publicUrl
      } catch (error) {
        console.error('Error getting preview URL:', error)
        return null
      }
    }
    return null
  }

  if (assets.length === 0) return null

  return (
    <div className="relative w-full flex-1">
      <div
        className="overflow-hidden flex-1 lg:h-[400px] rounded-2xl"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -300 }}
            transition={{ duration: 0.5 }}
            className="relative aspect-video bg-gray-100 dark:bg-gray-800"
          >
            <Link href={`/asset/${assets[currentIndex].id}`}>
              {getPreviewUrl(assets[currentIndex]) ? (
                <img
                  src={getPreviewUrl(assets[currentIndex]) || ''}
                  alt={assets[currentIndex].title || 'Asset preview'}
                  className="w-full h-full object-cover cursor-pointer"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
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
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                <h3 className="text-white text-xl font-bold mb-1">
                  {assets[currentIndex].title}
                </h3>
                <p className="text-white/80 text-sm">
                  {assets[currentIndex].type.toUpperCase()}
                </p>
              </div>
            </Link>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Dots */}
      {assets.length > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          {assets.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-2 rounded-full transition-all ${
                index === currentIndex
                  ? 'w-8 bg-blue-600'
                  : 'w-2 bg-gray-300 dark:bg-gray-600'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Navigation Arrows */}
      {assets.length > 1 && (
        <>
          <button
            onClick={() => setCurrentIndex((prev) => (prev - 1 + assets.length) % assets.length)}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full p-2 shadow-lg hover:bg-white dark:hover:bg-gray-800 transition-colors"
            aria-label="Previous slide"
          >
            <svg
              className="w-6 h-6 text-gray-900 dark:text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <button
            onClick={() => setCurrentIndex((prev) => (prev + 1) % assets.length)}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full p-2 shadow-lg hover:bg-white dark:hover:bg-gray-800 transition-colors"
            aria-label="Next slide"
          >
            <svg
              className="w-6 h-6 text-gray-900 dark:text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </>
      )}
    </div>
  )
}

