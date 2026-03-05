import { NextRequest, NextResponse } from 'next/server'
import { createUserSupabase, createClient } from '@/lib/supabaseServer'



const isWithin48Hours = (createdAt: string) => {
	const signupTime = new Date(createdAt).getTime()

	const now = Date.now()

	const difInHours = (now - signupTime) / (1000 * 60 * 60)
	return difInHours <= 48
}

const calculateFinalPrice = (
  originalPrice: number | null,
  planDiscount: number | null
) => {
  const price = originalPrice ?? 0
  const discount = planDiscount ?? 0

  return price * (1 - discount / 100)
}


export async function POST(request: NextRequest) {
  const startedAt = new Date()

  try {
    const user = await createClient()
    const supabase = createUserSupabase()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { plan_id, billing } = await request.json()

    if (!plan_id || !['monthly', 'yearly'].includes(billing)) {
      return NextResponse.json({ error: 'Invalid Data' }, { status: 400 })
    }

    const { data: plan, error: fetchError } = await supabase
      .from('subscription_plans')
      .select('*')
      .eq('id', plan_id)
      .single()

    if (fetchError) {
      return NextResponse.json({ error: fetchError.message }, { status: 500 })
    }

    if (!plan) {
      return NextResponse.json({ error: 'Plan not found' }, { status: 404 })
    }

    // Determine price and end date
    let endedAt = new Date(startedAt)
    let finalPrice: number

    if (isWithin48Hours(user.created_at)) {
      // First-month discount
      if (billing === 'monthly') {
        finalPrice = calculateFinalPrice(
            plan.original_price_monthly,
            plan.first_month_discount_percent
          )
        endedAt.setMonth(startedAt.getMonth() + 1)
      } else {
        finalPrice = calculateFinalPrice(
            plan.original_price_yearly,
            plan.first_month_discount_percent
          )
        endedAt.setFullYear(startedAt.getFullYear() + 1)
      }
    } else {
      // Normal price
      if (billing === 'monthly') {
        finalPrice = plan.original_price_monthly ?? 0
        endedAt.setMonth(startedAt.getMonth() + 1)
      } else {
        finalPrice = plan.original_price_yearly ?? 0
        endedAt.setFullYear(startedAt.getFullYear() + 1)
      }
    }

    // Insert subscription
    const { data: newSubscription, error: subscriptionError } = await supabase
      .from('subscriptions')
      .insert([{
        user_id: user.id,
        plan_id: plan.id,
        status: 'active',
        started_at: startedAt,
        ends_at: endedAt
      }])
      .select()
      .single()

    if (subscriptionError) {
      return NextResponse.json({ error: subscriptionError.message }, { status: 500 })
    }

    // Return subscription + finalPrice for payment
    return NextResponse.json({
      message: 'Subscription created',
      subscription: newSubscription,
      finalPrice
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}


