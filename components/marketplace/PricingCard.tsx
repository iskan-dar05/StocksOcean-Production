'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

interface PricingCardProps {
  name: string
  price: string
  period?: string
  originalPrice?: string
  discountPercent?: number
  isEligibleForSignupDiscount?: boolean
  description: string
  features: string[]
  popular?: boolean
  ctaText: string
  ctaLink: string
  onCtaClick?: () => void
  monthlyDownloads?: number | null
}

export default function PricingCard({
  name,
  price,
  period = '',
  originalPrice,
  discountPercent,
  isEligibleForSignupDiscount,
  description,
  features,
  popular = false,
  ctaText,
  ctaLink,
  onCtaClick,
  monthlyDownloads,
}: PricingCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`relative bg-white dark:bg-gray-800 rounded-2xl p-6 border-2 transition-all ${
        popular
          ? 'border-blue-500 dark:border-blue-400 shadow-xl'
          : 'border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl'
      }`}
    >
      {(popular || discountPercent > 0) && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 flex items-center">
          {popular && (
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-1.5 rounded-l-full text-xs font-semibold whitespace-nowrap">
              Most Popular
            </span>
          )}
          {discountPercent > 0 && (
            <span className={`bg-green-500 text-white px-4 py-1.5 text-xs font-semibold whitespace-nowrap ${
              popular ? 'rounded-r-full' : 'rounded-full'
            }`}>
              {discountPercent}% OFF First Month
            </span>
          )}
        </div>
      )}

      <div className="mt-4">
        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">{name}</h3>
        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-4 sm:mb-6">{description}</p>

        <div className="mb-4 sm:mb-6">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">{price}</span>
            {period && (
              <span className="text-base sm:text-lg text-gray-600 dark:text-gray-400">{period}</span>
            )}
          </div>
          {originalPrice && isEligibleForSignupDiscount && (
            <div className="flex items-center gap-2 mt-2">
              <span className="text-sm text-gray-500 dark:text-gray-400 line-through">
                {originalPrice}
                {period}
              </span>
              <span className="text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded">
                Save {discountPercent}%
              </span>
            </div>
          )}
          {discountPercent && discountPercent > 0 && isEligibleForSignupDiscount && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              First month only, then {originalPrice || price}
              {period}
            </p>
          )}
          {monthlyDownloads !== undefined && monthlyDownloads !== null && monthlyDownloads > 0 && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              {monthlyDownloads.toLocaleString()} downloads/month
            </p>
          )}
        </div>

        <ul className="space-y-3 mb-8">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-3">
              <svg
                className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span className="text-sm text-gray-700 dark:text-gray-300">{feature}</span>
            </li>
          ))}
        </ul>

        {onCtaClick ? (
          <button
            onClick={onCtaClick}
            className={`block w-full text-center px-6 py-3 rounded-xl font-semibold transition-all ${
              popular
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            {ctaText}
          </button>
        ) : (
          <Link
            href={ctaLink}
            className={`block w-full text-center px-6 py-3 rounded-xl font-semibold transition-all ${
              popular
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl'
                : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
            }`}
          >
            {ctaText}
          </Link>
        )}
      </div>
    </motion.div>
  )
}
