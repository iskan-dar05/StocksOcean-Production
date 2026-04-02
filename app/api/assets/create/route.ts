import { NextRequest, NextResponse } from 'next/server'
import { createUserSupabase, createClient } from '@/lib/supabaseServer'
import sharp from "sharp"


export async function POST(request: NextRequest) {
  try {
    const supabase = createUserSupabase()

    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized. Please log in to upload assets.' },
        { status: 401 }
      )
    }

    const userId = user.id

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single()

    if (!profile || (profile.role !== 'contributor' && profile.role !== 'admin')) {
      return NextResponse.json(
        { error: 'Forbidden. Only approved contributors can upload assets.' },
        { status: 403 }
      )
    }

    const formData = await request.formData()

    const file = formData.get("file") as File
    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const type = formData.get("type") as string
    const license = formData.get("license") as string
    const category = formData.get("category") as string
    const tags = JSON.parse((formData.get("tags") as string) || "[]")
  
    if (typeof title !== 'string' || title.trim().length === 0) {
      return NextResponse.json(
        { error: 'Title must be a non-empty string' },
        { status: 400 }
      )
    }

    if (typeof type !== 'string') {
      return NextResponse.json(
        { error: 'Type must be a string' },
        { status: 400 }
      )
    }

    const validTypes = ['image', 'video', '3d', 'other']
    if (!validTypes.includes(type)) {
      return NextResponse.json(
        {
          error: `Type must be one of: ${validTypes.join(', ')}`,
        },
        { status: 400 }
      )
    }

    const isAdmin = profile.role === 'admin'
    const path = isAdmin ? 'admin' : `contributors/${userId}`


    const price = 0

    if (typeof license !== 'string') {
      return NextResponse.json(
        { error: 'License must be a string' },
        { status: 400 }
      )
    }

    if (tags !== undefined && tags !== null) {
      if (!Array.isArray(tags)) {
        return NextResponse.json(
          { error: 'Tags must be an array' },
          { status: 400 }
        )
      }
      
      if (!tags.every((tag) => typeof tag === 'string')) {
        return NextResponse.json(
          { error: 'All tags must be strings' },
          { status: 400 }
        )
      }
    }


    if (!file) {
      return NextResponse.json(
          { error: "File is required" },
          { status: 400 }
        )
    }

  const filename = `${Date.now()}-${file.name}`

  const originalPath = `${path}/${filename}`
  const previewPath = `${path}/${filename}`

  const buffer = Buffer.from(await file.arrayBuffer())

  const previewBuffer = await sharp(buffer)
    .resize({ width: 1200 })
    .jpeg({ quality: 75 })
    .toBuffer()

  await supabase.storage
    .from("private_assets")
    .upload(originalPath, buffer, { contentType: file.type, })

  await supabase.storage
    .from("assets")
    .upload(previewPath, previewBuffer)


  const { data: previewData } = supabase.storage
    .from("assets")
    .getPublicUrl(previewPath)

  const previewUrl = previewData.publicUrl
   


    const assetData = {
      contributor_id: userId,
      title: title.trim(),
      description: description?.trim() || null,
      type,
      storage_path: originalPath,
      preview_path: previewUrl,
      price: 0,
      license,
      status: 'pending',
      tags: tags.length > 0 ? tags : null,
      category: category || null,
      views: 0,
      downloads: 0,
    }

    const { data: insertedAsset, error: insertError } = await supabase
      .from('assets')
      .insert(assetData)
      .select('id')
      .single()

    if (insertError) {
      console.error('Database insert error:', insertError)
      return NextResponse.json(
        {
          error: 'Failed to create asset record',
          details: insertError.message,
        },
        { status: 500 }
      )
    }

    if (!insertedAsset || !insertedAsset.id) {
      return NextResponse.json(
        { error: 'Asset created but no ID returned' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        assetId: insertedAsset.id,
        message: 'Asset created successfully',
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Unexpected error in /api/assets/create:', error)
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined,
      },
      { status: 500 }
    )
  }
}

