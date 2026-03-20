'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import AssetCard from '@/components/marketplace/AssetCard'
import AssetCarousel from '@/components/marketplace/AssetCarousel'
import { supabase } from '@/lib/supabaseClient'
import type { Database } from '@/types/supabase'

type Asset = Database['public']['Tables']['assets']['Row']

export default function Home() {
  const [featuredAssets, setFeaturedAssets] = useState<Asset[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isApprovedContributor, setIsApprovedContributor] = useState(false)

  useEffect(() => {
    const checkContributorStatus = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .maybeSingle()
          if (profile && (profile.role === 'contributor' || profile.role === 'admin')) {
            setIsApprovedContributor(true)
          }
        }
      } catch (error) {}
    }

    checkContributorStatus()

    const fetchFeaturedAssets = async () => {
      setLoading(true)
      try {
        const { data, error } = await supabase
          .from('assets')
          .select('*')
          .eq('status', 'approved')
          .order('views', { ascending: false })
          .limit(6)

        if (error) setError(error.message)
        else setFeaturedAssets(data || [])
      } catch (error: any) {
        setError(error?.message || 'Failed to load assets')
      } finally {
        setLoading(false)
      }
    }

    const timer = setTimeout(fetchFeaturedAssets, 100)
    return () => clearTimeout(timer)
  }, [])

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) element.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 w-full">
        {/* Error Display */}
        {error && (
          <div className="container mx-auto px-4 py-4">
            <div className="bg-red-600/20 border border-red-600 rounded-lg p-4 text-red-200">
              Error: {error}
            </div>
          </div>
        )}

        {/* Hero Section */}
        <section
      style={{ backgroundImage: "url('/hero.png')" }}
      className="flex-1 relative bg-cover bg-center py-4 sm:py-5 md:py-10 lg:py-24 mt-10 bg-no-repeat flex items-center justify-center"
    >
      {/* Optional dark overlay */}
      <div className="absolute inset-0 bg-black/50"></div>

      <div className="relative z-10 text-center px-4">
        <h1 className="heading-responsive font-bold text-white mb-4 sm:mb-6 md:mb-8 text-md sm:text-2xl md:text-3xl lg:text-5xl">
          Discover Premium <br className="hidden xs:block" />
          <span className="text-white">Digital Assets</span>
        </h1>
        <p className="text-responsive text-gray-300 mb-6 sm:mb-8 md:mb-10 max-w-3xl mx-auto text-[6px] sm:text-sm md:text-md lg:text-lg">
          High-quality images, videos, and 3D objects for your creative projects. Join our
          marketplace as a buyer or contributor.
        </p>
        <div className="flex gap-3 sm:gap-4 justify-center items-stretch xs:items-center px-4">
          <button
            onClick={() => scrollToSection('browse-section')}
            className="px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base bg-white border border-header text-primary rounded-xl font-semibold  transition-all transform hover:-translate-y-1 active:scale-95"
          >
            Browse Assets
          </button>
          {!isApprovedContributor && (
            <Link
              href="/become-contributor"
              className="px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base bg-header text-white rounded-xl hover:text-header hover:bg-white hover:border hover:border-header transition-all active:scale-95 text-center"
            >
              Become a Contributor
            </Link>
          )}
        </div>
      </div>
    </section>

        {/* Featured Assets Hero Section */}
{!loading && featuredAssets.length > 0 && (
  <section
    id="featured-hero"
    className="flex-1 relative flex flex-col items-center py-3 sm:py-4 md:py-6 lg:py-6 justify-center px-4"
  >

    <div className="relative z-10 text-center max-w-5xl w-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <h2 className="text-2xl sm:text-3xl md:text-3xl font-bold text-header mb-4">
          Featured Assets
        </h2>
        <p className="text-lg sm:text-xl md:text-2xl text-gray-400 mb-8">
          Explore our handpicked selection of premium digital assets
        </p>
      </motion.div>

      {/* Carousel */}
      <div className="max-w-5xl mx-auto">
        <AssetCarousel assets={featuredAssets.slice(0, 5)} />
      </div>
    </div>
  </section>
)}

        {/* How It Works Section */}
<section className="container mx-auto px-4 py-8 sm:py-12 md:py-16 bg-header rounded-2xl sm:rounded-3xl my-8 sm:my-12 md:my-16">
  <motion.div
    initial={{ opacity: 0 }}
    whileInView={{ opacity: 1 }}
    viewport={{ once: true }}
    className="text-center mb-8 sm:mb-10 md:mb-12"
  >
    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 sm:mb-4">
      How It Works
    </h2>
    <p className="text-sm sm:text-base md:text-lg text-gray-100 px-4">
      Get started in three simple steps
    </p>
  </motion.div>

  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto">
    {[
      {
        step: '01',
        title: 'Browse',
        description: 'Explore thousands of premium digital assets across images, videos, and 3D objects.',
        icon: (
          <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        ),
      },
      {
        step: '02',
        title: 'Subscribe',
        description: 'Choose a subscription plan that fits your needs and get unlimited access to all assets.',
        icon: (
          <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        ),
      },
      {
        step: '03',
        title: 'Use',
        description: 'Download and use your assets in any project with full commercial license.',
        icon: (
          <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
        ),
      },
    ].map((item, index) => (
      <motion.div
        key={item.step}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.2 }}
        className="text-center"
      >
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-white/20 via-white/10 to-white/20 text-white mb-6 shadow-lg">
          {item.icon}
        </div>
        <div className="text-sm font-semibold text-gray-100 mb-2">
          STEP {item.step}
        </div>
        <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
        <p className="text-gray-100">{item.description}</p>
      </motion.div>
    ))}
  </div>
</section>


        {/* Featured Assets Grid */}
        {!loading && featuredAssets.length > 0 && (
          <section id="browse-section" className="container mx-auto px-4 py-16">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Popular Assets
              </h2>
              <p className="text-3xl font-semibold text-header">
                Trending assets loved by our community
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {featuredAssets.slice(0, 6).map((asset, index) => (
                <motion.div
                  key={asset.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <AssetCard asset={asset} />
                </motion.div>
              ))}
            </div>

            <div className="text-center">
              <Link
                href="/browse"
                className="inline-block px-6 py-3 text-primary font-semibold hover:text-header transition-colors"
              >
                View All Assets →
              </Link>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  )
}
