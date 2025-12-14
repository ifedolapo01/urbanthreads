// lib/supabase/admin-server.ts - NEW FILE
import { createClient } from '@supabase/supabase-js'

// This uses the service role key - ONLY use on server
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!, // Will add to .env
  )
}