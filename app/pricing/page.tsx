'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import PricingCard from '@/components/marketplace/PricingCard'
import { supabase } from '@/lib/supabaseClient'
import { useAuth } from '@/components/auth/AuthProvider'


export default function PricingPage() {
  const { user, loading: authLoading } = useAuth()
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly')
  const [plans, setPlans] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isEligibleForSignupDiscount, setIsEligibleForSignupDiscount] = useState(false)

  const isWithin48Hours = (createdAt: string) => {
    const signupTime = new Date(createdAt).getTime()
    const now = Date.now()
    const diffInHours = (now - signupTime) / (1000 * 60 * 60)

    return diffInHours <= 48
  } 

   const fetchPlans = async () => {
    try {
      const { data, error } = await supabase
        .from('subscription_plans' as any)
        .select('*')
        .order('original_price_monthly', { ascending: true })

      if (error) throw error

      if (data) {
        const typedData = data as any[]
        const formattedPlans = typedData.map((plan: any) => ({
          id: plan.id,
          name: plan.name,
          description: plan.description || '',
          originalPriceMonthly: Number(plan.original_price_monthly) || 0,
          originalPriceYearly: Number(plan.original_price_yearly) || 0,
          firstMonthDiscount: plan.first_month_discount_percent  || 0,
          monthlyDownloads: plan.monthly_downloads,
          features: (plan.features as string[]) || [],
          isPopular: plan.is_popular || false,
          isCustom: plan.id === 'enterprise' || !plan.monthly_downloads,
        }))
        setPlans(formattedPlans)
      }
    } catch (error) {
      console.error('Error fetching plans:', error)
      // Fallback to hardcoded plans if fetch fails
      setPlans([
        {
          id: 'starter',
          name: 'Starter',
          description: 'Perfect for individuals and small projects',
          originalPriceMonthly: 15,
          originalPriceYearly: 150,
          firstMonthDiscount: 33,
          monthlyDownloads: 75,
          features: [
            'Access to images, videos, 3D objects',
            'High-res downloads',
            'Commercial license',
            'Standard support',
          ],
          isPopular: false,
          isCustom: false,
        },
        {
          id: 'growth',
          name: 'Growth',
          description: 'Best for professionals and growing teams',
          originalPriceMonthly: 25,
          originalPriceYearly: 250,
          firstMonthDiscount: 20,
          monthlyDownloads: 250,
          features: [
            'Everything in Bronze',
            'Unlimited downloads',
            'Team management',
            'Secure storage',
            'Priority support',
          ],
          isPopular: true,
          isCustom: false,
        },
        {
          id: 'unlimited',
          name: 'Unlimited',
          description: 'For agencies and large teams',
          originalPriceMonthly: 50,
          originalPriceYearly: 500,
          firstMonthDiscount: 20,
          monthlyDownloads: 700,
          features: [
            'Everything in Silver',
            'Featured listing',
            'Newsletter exposure',
            'API access',
            'Priority support',
          ],
          isPopular: false,
          isCustom: false,
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPlans()
    if (isWithin48Hours(user?.created_at)) {
      setIsEligibleForSignupDiscount(true)
    }
  }, [user])





type billingPeriodType = 'monthly' | 'yearly'




  const handleGetStarted = async (planId: string, billingPeriod: billingPeriod) => {    
    if (!user) {
      window.location.href = `/auth/signin?redirect=${encodeURIComponent(`/pricing?redirect=${encodeURIComponent('/pricing')}`)}`
    }

    try{
      const response = await fetch('/api/plans', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          plan_id: planId,
          billing: billingPeriod
        }),
        credentials: 'include',
      })


      if(response.status === 200){
        console.log(response)
      }
    }catch(error)
    {
      console.error(error)
    }
  }

 

  const calculateFinalPrice = (
  originalPrice: number,
  planDiscount: number
) => {
  let finalDiscount = planDiscount

  if (isEligibleForSignupDiscount) {
    return originalPrice * (1 - finalDiscount / 100)
  }

  return originalPrice
}

  return (
    <div className="min-h-screen bg-white">
  <Header />

  <main className="container mx-auto px-4 py-16">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center mb-12"
    >
      <h1 className="text-4xl md:text-5xl font-bold text-header mb-4">
        Simple, Transparent Pricing
      </h1>
      <p className="text-lg md:text-xl text-secondary max-w-2xl mx-auto mb-8">
        Choose the plan that works best for you. All plans include full commercial licenses.
      </p>

      {/* Billing Toggle */}
      <div className="flex items-center justify-center gap-6 mb-8">
        <span
          className={`text-sm font-medium ${
            billingPeriod === 'monthly'
              ? 'text-primary'
              : 'text-secondary'
          }`}
        >
          Monthly
        </span>

        <label className="inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={billingPeriod === 'yearly'}
            onChange={() =>
              setBillingPeriod(billingPeriod === 'monthly' ? 'yearly' : 'monthly')
            }
          />
          <div className="w-11 h-6 bg-secondary peer-checked:bg-header rounded-full relative transition">
            <div className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition ${billingPeriod === 'yearly' ? 'translate-x-5 sm:translate-x-6 md:translate-x-5' : ''}`}></div>
          </div>
        </label>

        <span
          className={`text-sm font-medium ${
            billingPeriod === 'yearly'
              ? 'text-primary'
              : 'text-secondary'
          }`}
        >
          Yearly
          <span className="ml-2 text-xs bg-header text-white px-2 py-1 rounded">
            Save 17%
          </span>
        </span>
      </div>
    </motion.div>

    {loading ? (
      <div className="flex justify-center items-center py-20">
        <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    ) : (
      <>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-7xl mx-auto mb-8 sm:mb-12">
          {plans.map((plan, index) => {
            const originalPrice =
              billingPeriod === 'monthly' ? plan.originalPriceMonthly : plan.originalPriceYearly
            const firstMonthPrice = calculateFinalPrice(originalPrice, plan.firstMonthDiscount)

            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <PricingCard
                  name={plan.name}
                  price={`$${firstMonthPrice.toFixed(2)}`}
                  period={billingPeriod === 'monthly' ? '/month' : '/year'}
                  originalPrice={`$${originalPrice.toFixed(2)}`}
                  isEligibleForSignupDiscount={isEligibleForSignupDiscount}
                  discountPercent={plan.firstMonthDiscount}
                  description={plan.description}
                  features={plan.features}
                  popular={plan.isPopular}
                  ctaText={user ? "Get Started" : "Sign In to Subscribe"}
                  ctaLink="#"
                  onCtaClick={() => handleGetStarted(plan.id, billingPeriod)}
                  monthlyDownloads={plan.monthlyDownloads}
                  // NEW COLOR STYLING FOR CARD
                  cardBg="bg-white/90 dark:bg-purple-50/80"
                  cardBorder="border border-purple-200"
                  nameColor="text-purple-900"
                  priceColor="text-purple-800"
                  originalPriceColor="text-purple-500 line-through"
                  ctaBg="bg-purple-600 hover:bg-purple-700"
                  ctaTextColor="text-white"
                  featureTextColor="text-purple-700"
                  popularBg="bg-purple-100 text-purple-800"
                />
              </motion.div>
            )
          })}
        </div>
      </>
    )}
  </main>

  <Footer />
</div>

  )
}
