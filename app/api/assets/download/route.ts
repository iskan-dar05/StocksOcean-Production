import { NextRequest, NextResponse } from 'next/server'
import { createUserSupabase, createClient } from '@/lib/supabaseServer'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

function getRemainingDownloads(downloadsUsed: number, downloadLimit: number) {
  return downloadLimit - downloadsUsed
}


export async function POST(request: NextRequest) {
  try {

    const { assetId } = await request.json()

    // Use RLS permission
    const supabase = supabaseAdmin

    const { data: { user } } = await supabase.auth.getUser()


    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }


  // get active plan

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


    const { data, error: urlError } = await supabase.storage
      .from('private_assets')
      .createSignedUrl(assetData.storage_path, 60, {
        download: true
      })



    const { data: files, error } = await supabase.storage
      .from('private_assets')
      .list('admin')

    if (urlError || !data) {
      return NextResponse.json(
        { error: 'Could not generate download link' },
        { status: 500 }
      )
    }

  
    await supabase.rpc('process_download', {
      p_user_id: user.id,
      p_asset_id: assetId,
      p_subscription_id: sub.id,
      p_price: sub.price,
      p_downloads_limit: sub.subscription_plans.monthly_downloads
    });
    

    return NextResponse.json({
      url: data.signedUrl
    })

  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}