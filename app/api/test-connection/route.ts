// app/api/test-connection/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(request: NextRequest) {
  try {
    console.log('Testing Supabase connection from Vercel...');
    
    // Test with service role
    const supabaseService = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        },
        global: {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      }
    );
    
    // Simple query
    console.log('Making test query...');
    const { data, error, count, status, statusText } = await supabaseService
      .from('products')
      .select('*', { count: 'exact', head: true });
    
    console.log('Response:', { error, count, status, statusText });
    
    if (error) {
      return NextResponse.json({
        success: false,
        error: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
        connection: 'Failed'
      });
    }
    
    return NextResponse.json({
      success: true,
      connection: 'Success',
      count,
      status,
      statusText,
      note: 'Supabase connection is working'
    });
    
  } catch (error: any) {
    console.error('Connection test error:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack,
      type: 'Network/Timeout Error'
    });
  }
}