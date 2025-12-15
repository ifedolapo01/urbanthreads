// app/api/verify-fix/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );
    
    // Test insert
    const testProduct = {
      name: `Verify Fix ${Date.now()}`,
      description: 'Testing the fix',
      price: 999,
      category: 'men',
      main_image: 'https://test.com/image.jpg',
      images: [],
      colors: ['Blue'],
      sizes: ['XL'],
      stock: 99,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    const { error } = await supabase
      .from('products')
      .insert([testProduct]);
    
    if (error) {
      return NextResponse.json({
        status: 'FAILED',
        error: error.message,
        code: error.code,
        solution: 'Run: DROP POLICY IF EXISTS "Allow admin full access to products" ON products;'
      });
    }
    
    return NextResponse.json({
      status: 'SUCCESS',
      message: 'API is working correctly!',
      note: 'The fix has been applied successfully.'
    });
    
  } catch (error: any) {
    return NextResponse.json({
      status: 'ERROR',
      error: error.message
    });
  }
}