import { POST } from "@/app/api/admin/asset/[id]/page.tsx"
import { createUserSupabase } from '@/lib/supabaseServer'
import { requireAdminAPI } from '@/lib/admin/auth'
import { sendNotificationEmail } from '@/lib/email'
import { NextRequest } from 'next/server'


