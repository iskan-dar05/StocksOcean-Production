import { createUserSupabase } from '@/lib/supabaseServer'
import { supabaseAdmin } from '@/lib/supabaseAdmin' // استيراد العميل الذي أنشأته
import { redirect } from 'next/navigation'


export async function requireAdmin() {
  const supabase = await createUserSupabase()

  const { data: { session } } = await supabase.auth.getSession()

  if (!session || !session.user) {
    console.log('requireAdmin: No session found, redirecting to signin')
    redirect('/auth/signin?redirect=/admin')
  }

  console.log('requireAdmin: Checking role for user:', session.user.id)

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', session.user.id)
    .maybeSingle()

  if (error) {
    console.error('requireAdmin: Error fetching profile:', error)
    redirect('/')
  }

  console.log('requireAdmin: Profile data:', { role: profile?.role, userId: session.user.id })

  if (!profile || profile.role !== 'admin') {
    console.log('requireAdmin: User is not admin, redirecting to home')
    redirect('/')
  }

  console.log('requireAdmin: Admin access granted')
  return session
}


export async function requireAdminAPI() {
  const supabaseUser = await createUserSupabase()
  const { data: { session } } = await supabaseUser.auth.getSession()

  if (!session || !session.user) {
    throw new Error('Unauthorized: Please log in')
  }

  const { data: profile, error } = await supabaseAdmin
    .from('profiles')
    .select('role')
    .eq('id', session.user.id)
    .single()

  if (error || profile?.role !== 'admin') {
    console.error('Admin Access Denied:', error)
    throw new Error('Forbidden: Admin access required')
  }

  return session
}


export async function isAdmin(): Promise<boolean> {
  const supabase = await createUserSupabase()

  const { data: { session } } = await supabase.auth.getSession()

  if (!session || !session.user) {
    return false
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', session.user.id)
    .maybeSingle()

  return profile?.role === 'admin'
}

