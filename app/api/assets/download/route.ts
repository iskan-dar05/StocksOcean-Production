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
    const supabase = createUserSupabase()
    const adminSupabase = supabaseAdmin

    const { data: { user } } = await supabase.auth.getUser()

    console.log("USER USER::::::: ", user)


    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }


  // get active plan

   const { data: sub } = await supabase
	  .from('subscriptions')
	  .select(`
      id,
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

    console.log("STORAGE PATH::::::: ", assetData.storage_path)


    const { data, error: urlError } = await adminSupabase.storage
      .from('private_assets')
      .createSignedUrl(assetData.storage_path, 60, {
        download: true
      })

    console.log("DOWNLOAD LINK ERROR:::::   ", urlError)



    const { data: files, error } = await adminSupabase.storage
      .from('private_assets')
      .list('admin')

    if (urlError || !data) {
      return NextResponse.json(
        { error: 'Could not generate download link' },
        { status: 500 }
      )
    }


    console.log("SUBSCRIPTION MONTHLY DOWNLOADS:: ", sub.subscription_plans.monthly_downloads)
    console.log("SUB ID:::: ", sub.id)
  
    const { data: rpcData, error: rpcError } = await supabase.rpc('process_download_v2', {
        p_asset_id: assetId,
        p_downloads_limit: sub.subscription_plans.monthly_downloads,
        p_price: sub.price,
        p_subscription_id: sub.id,
        p_user_id: user.id
      })

    console.log("RPC DATA:", rpcData)
    console.log("RPC ERROR:", rpcError)
        

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