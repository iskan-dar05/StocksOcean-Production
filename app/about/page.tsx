'use client'

import { motion } from 'framer-motion'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'
import { useAuth } from '@/components/auth/AuthProvider'


export default function AboutPage() {
  const { user, loading: authLoading } = useAuth()
  return (
    <div className="min-h-screen bg-white font-inter">
      <Header />

      <main className="container mx-auto px-3 sm:px-4 py-8 sm:py-12 md:py-16">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 sm:mb-12 md:mb-16"
        >
          <h1 className="heading-responsive font-bold text-header mb-3 sm:mb-4 font-jakarta">
            About StocksOcean
          </h1>
          <p className="text-responsive text-secondary max-w-3xl mx-auto px-4">
            Empowering creators and businesses with premium digital assets
          </p>
        </motion.div>

        {/* Mission Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="max-w-4xl mx-auto mb-8 sm:mb-12 md:mb-16 px-4"
        >
          <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 md:p-12 border border-purple-200">
            <h2 className="text-2xl sm:text-3xl font-bold text-header mb-4 sm:mb-6 font-jakarta">
              Our Mission
            </h2>
            <p className="text-primary mb-4 text-responsive">
              StocksOcean was founded with a simple mission: to create a marketplace where
              creators can monetize their digital assets and businesses can find high-quality
              content for their projects.
            </p>
            <p className="text-primary text-lg">
              We believe that great design should be accessible to everyone, and creators
              deserve fair compensation for their work. Our platform bridges the gap between
              talented artists and businesses in need of premium digital assets.
            </p>
          </div>
        </motion.div>

        {/* Values Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8 sm:mb-12 md:mb-16 px-4"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-header mb-6 sm:mb-8 text-center font-jakarta">
            Our Values
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
            {[
              {
                title: 'Quality First',
                description:
                  'We curate only the highest quality assets, ensuring our marketplace maintains exceptional standards.',
                icon: (
                  <svg className="w-12 h-12 text-header" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                    />
                  </svg>
                ),
              },
              {
                title: 'Fair Compensation',
                description:
                  'We ensure creators receive fair compensation for their work, with transparent pricing and revenue sharing.',
                icon: (
                  <svg className="w-12 h-12 text-header" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                ),
              },
              {
                title: 'Community Driven',
                description:
                  'We build our platform with our community in mind, listening to feedback and continuously improving.',
                icon: (
                  <svg className="w-12 h-12 text-header" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                ),
              },
            ].map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="bg-white rounded-xl p-6 border border-purple-200 text-center shadow-md"
              >
                <div className="mb-4 flex justify-center">{value.icon}</div>
                <h3 className="text-xl font-bold text-primary mb-3 font-jakarta">
                  {value.title}
                </h3>
                <p className="text-secondary">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-center"
        >
          <div className="bg-header rounded-2xl p-8 md:p-12 text-white">
            <h2 className="text-3xl font-bold mb-4 font-jakarta">Join Our Community</h2>
            <p className="text-xl mb-8 opacity-90">
              Start selling your assets or find the perfect content for your next project
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {!user && (
              <Link
                href="/auth/signup"
                className="flex items-center justify-center px-8 py-3 bg-white text-center text-header hover:text-header rounded-xl font-semibold hover:bg-gray-50 hover:scale-105 transition-colors"
              >
                Get Started
              </Link>
              )}
              
              <Link
                href="/contributor/dashboard"
                className="px-8 py-3 bg-blue-600  text-white rounded-xl font-semibold hover:bg-blue-800 transition-colors border-2 border-white/20"
              >
                Become a Contributor
              </Link>
            </div>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  )
}
