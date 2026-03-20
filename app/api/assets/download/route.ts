import { NextRequest, NextResponse } from 'next/server'
import { createUserSupabase, createClient } from '@/lib/supabaseServer'

function getRemainingDownloads(downloadsUsed: number, downloadLimit: number) {
  return downloadLimit - downloadsUsed
}


function calculateContributorEarning(price: number, downloads_limit:number, commission=0.33) {
  return (price / downloads_limit) * commission
}

export async function POST(request: NextRequest) {
  try {

    const { assetId } = await request.json()

    const user = await createClient()
    const supabase = createUserSupabase()

    // console.log("USER USER:: from download route.ts: ", user)

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

   const { data: sub } = await supabase
	  .from('subscriptions')
	  .select(`
	    downloads_used,
	    subscription_plans (monthly_downloads),
      downloads_limit,
      price
	  `)
	  .eq('user_id', user.id)
	  .eq('status', 'active')
	  .single()
	
		console.log("SUB TEST FIXED:", sub)

    if (!sub) {
      return NextResponse.json({ error: 'No active plan' }, { status: 403 })
    }

    const remaining = getRemainingDownloads(
      sub.downloads_used,
      sub.subscription_plans.monthly_downloads
    )

    if (remaining <= 0) {
      return NextResponse.json(
        { error: 'Download limit reached' },
        { status: 403 }
      )
    }

    const { data: assetData, error: assetError } = await supabase
      .from('assets')
      .select('*')
      .eq('id', assetId)
      .single()

    if (assetError || !assetData) {
      return NextResponse.json({ error: 'Asset not found' }, { status: 404 })
    }

    if (!assetData.storage_path) {
      return NextResponse.json({ error: 'File not available' }, { status: 404 })
    }

    console.log("STORAGE PATH: ", assetData.preview_path)

    const { data, error: urlError } = await supabase.storage
      .from('assets')
      .createSignedUrl(assetData.preview_path, 60)

    console.log("URL ERROR: ", urlError)

    if (urlError || !data) {
      return NextResponse.json(
        { error: 'Could not generate download link' },
        { status: 500 }
      )
    }

    const {error: updateSubscriptionError} = await supabase
      .from('subscriptions')
      .update({
        downloads_used: sub.downloads_used + 1
      })
      .eq('user_id', user.id)

   

    if (updateSubscriptionError) {
		  return NextResponse.json(
		    { error: 'Could not update download count' },
		    { status: 500 }
		  )
		}

    const { error: updateProfileError } = await supabase
      .from('profiles')
      .update({
        balance: supabase.raw('balance + ?', [calculateContributorEarning(sub.price, sub.downloads_limit)])
      })
      .eq('id', assetData.contributor_id)

    if (updateProfileError) {
      return NextResponse.json(
        { error: 'Could not update balance count' },
        { status: 500 }
      )
    }

    const { data: newDownload, error: downloadError } = await supabase
      .from('downloads')
      .insert({
        asset_id: assetData.id,
        subscription_id: sub.id,
        buyer_id: user.id,
        contributor_id: assetData.contributor_id
      })

    return NextResponse.json({
      url: data.signedUrl
    })

  } catch (error) {
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    )
  }
}