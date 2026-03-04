'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'

export default function HelpPage() {
  const [openSection, setOpenSection] = useState<string | null>(null)

  const faqs = [
    {
      category: 'Getting Started',
      questions: [
        {
          q: 'How do I create an account?',
          a: 'Click on "Sign Up" in the top right corner, fill in your details, and verify your email address. You can also sign up using Google or GitHub. Once registered, you can browse assets and subscribe to a plan to download them.',
        },
        {
          q: 'How do I become a contributor?',
          a: 'Navigate to the "Become a Contributor" page, fill out the application form with your portfolio URL and a message explaining why you want to contribute. Our team will review your application and notify you via email once approved.',
        },
      ],
    },
    {
      category: 'Subscription Plans',
      questions: [
        {
          q: 'What subscription plans are available?',
          a: 'We offer Bronze, Silver, Gold, and Platinum plans with different downloads per month. All plans include first-month discounts.',
        },
      ],
    },
    {
      category: 'Technical Support',
      questions: [
        {
          q: 'I\'m having trouble downloading an asset. What should I do?',
          a: 'Check your internet connection or browser cache. If the issue persists, contact our support team.',
        },
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 md:py-16">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-header mb-4">
            Help Center
          </h1>
          <p className="text-lg sm:text-xl text-secondary max-w-2xl mx-auto">
            Find answers to common questions and get the support you need
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="max-w-2xl mx-auto mb-12"
        >
          <div className="relative">
            <input
            type="text"
            placeholder="Search for help..."
            className="
              w-full
              px-6 py-4 pl-12
              rounded-xl
              bg-white
              text-primary
              placeholder-secondary
              border border-secondary
              focus:border-header
              focus:ring-2
              focus:ring-header/30
              focus:outline-none
              transition
            "
          />
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </motion.div>

        {/* Quick Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16"
        >
          {[
            {
              title: 'Getting Started Guide',
              description: 'Learn how to use StocksOcean',
              link: '/help#getting-started',
              icon: (
                <svg
                  className="w-8 h-8 text-secondary group-hover:text-header transition"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              ),
            },
            {
              title: 'Contact Support',
              description: 'Get help from our team',
              link: '/contact',
              icon: (
                <svg
                  className="w-8 h-8 text-secondary group-hover:text-header transition"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              ),
            },
            {
              title: 'Become a Contributor',
              description: 'Start selling your assets',
              link: '/become-contributor',
              icon: (
                <svg
                  className="w-8 h-8 text-secondary group-hover:text-header transition"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              ),
            },
          ].map((link) => (
            <Link
              key={link.title}
              href={link.link}
              className="bg-white rounded-xl p-6 border border-secondary hover:border-header hover:shadow-lg transition group"
            >
              <div className="mb-4">{link.icon}</div>
              <h3 className="text-xl font-jakarta font-bold text-primary mb-2">
                {link.title}
              </h3>
              <p className="text-secondary">{link.description}</p>
            </Link>
          ))}
        </motion.div>

        {/* FAQ Sections */}
        <div className="max-w-4xl mx-auto space-y-6">
          {faqs.map((section, idx) => (
            <motion.div
              key={section.category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + idx * 0.1 }}
              className="bg-white rounded-2xl shadow-lg border border-purple-200 overflow-hidden"
            >
              <button
                onClick={() =>
                  setOpenSection(openSection === section.category ? null : section.category)
                }
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <h2 className="text-2xl font-jakarta font-bold text-primary">
                  {section.category}
                </h2>
                <svg
                  className={`w-6 h-6 text-secondary transition-transform ${
                    openSection === section.category ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {openSection === section.category && (
                <div className="px-6 pb-6 space-y-4">
                  {section.questions.map((faq, index) => (
                    <div
                      key={index}
                      className="pt-4 border-t border-secondary first:border-t-0"
                    >
                      <h3 className="font-jakarta font-semibold text-primary mb-2">
                        {faq.q}
                      </h3>
                      <p className="text-secondary mb-2">{faq.a}</p>
                      <button
                        onClick={() =>
                          alert(
                            `More details about: ${faq.q}\n\n${faq.a}\n\nContact support for more info.`
                          )
                        }
                        className="text-primary hover:text-header text-sm font-medium flex items-center gap-1 transition-colors"
                      >
                        Learn More
                        <svg
                          className="w-4 h-4"
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
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Still Need Help */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="max-w-2xl mx-auto mt-16 text-center"
        >
          <div className="bg-header rounded-2xl p-8 text-white">
            <h2 className="text-2xl font-jakarta font-bold mb-4">Still need help?</h2>
            <p className="mb-6 opacity-90">
              Can't find what you're looking for? Our support team is here to help.
            </p>
            <Link
              href="/contact"
              className="inline-block px-6 py-3 bg-white text-primary rounded-xl font-semibold hover:bg-gray-100 hover:text-primary transition-colors"
            >
              Contact Support
            </Link>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  )
}
