// app/api/check-env/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Get ALL environment variables (be careful with sensitive data)
  const envVars = {
    // Supabase
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL 
      ? `Set (${process.env.NEXT_PUBLIC_SUPABASE_URL.substring(0, 20)}...)`
      : 'NOT SET',
      
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY 
      ? `Set (${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.substring(0, 10)}...)`
      : 'NOT SET',
      
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY 
      ? 'Set (starts with eyJ...)'
      : 'NOT SET',
      
    // Admin
    ADMIN_EMAIL: process.env.ADMIN_EMAIL || 'NOT SET',
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD 
      ? 'Set (hidden)' 
      : 'NOT SET',
    
    // Vercel info
    VERCEL_ENV: process.env.VERCEL_ENV || 'NOT SET',
    VERCEL_URL: process.env.VERCEL_URL || 'NOT SET',
    NODE_ENV: process.env.NODE_ENV || 'NOT SET',
    
    // All env vars (names only for security)
    allKeys: Object.keys(process.env).filter(key => 
      key.includes('SUPABASE') || 
      key.includes('ADMIN') || 
      key.includes('VERCEL') ||
      key.includes('NODE')
    )
  };

  return NextResponse.json(envVars);
}