// app/api/admin/products/route.ts - WITH TIMEOUT HANDLING
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Set max duration for Vercel
export const maxDuration = 10;

export async function POST(request: NextRequest) {
  console.log('=== PRODUCT API START ===');
  
  // Set a timeout promise
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error('Request timeout after 8 seconds'));
    }, 8000);
  });
  
  try {
    const supabase = createClient(
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
    
    const body = await request.json();
    console.log('Body received, starting insert...');
    
    const productData = {
      name: body.name,
      description: body.description || '',
      price: Number(body.price) || 0,
      category: body.category || 'men',
      main_image: body.main_image || '',
      images: body.images || [],
      colors: body.colors || [],
      sizes: body.sizes || [],
      stock: Number(body.stock) || 0,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    // Race between the insert and timeout
    const insertPromise = supabase
      .from('products')
      .insert([productData])
      .select()
      .single();
    
    const { data, error } = await Promise.race([insertPromise, timeoutPromise]) as any;
    
    if (error) {
      console.error('Insert error:', error);
      
      // Try a simpler insert without the .select().single()
      console.log('Trying simpler insert...');
      const { error: simpleError } = await supabase
        .from('products')
        .insert([productData]);
      
      if (simpleError) {
        return NextResponse.json({
          success: false,
          error: simpleError.message,
          code: simpleError.code,
          suggestion: 'The insert succeeded but selecting the record failed. Check if RLS allows SELECT after INSERT.'
        }, { status: 500 });
      }
      
      return NextResponse.json({
        success: true,
        message: 'Product inserted (but could not retrieve details)',
        note: 'Insert succeeded but select failed. This is usually an RLS issue.'
      });
    }
    
    console.log('=== PRODUCT API SUCCESS ===');
    return NextResponse.json({
      success: true,
      product: data
    });
    
  } catch (error: any) {
    console.error('=== PRODUCT API ERROR ===', error);
    
    if (error.message.includes('timeout')) {
      return NextResponse.json({
        success: false,
        error: 'Request timeout',
        details: 'The request took too long. This could be a network issue between Vercel and Supabase.',
        suggestion: '1. Check Supabase region 2. Try smaller image 3. Check network connectivity'
      }, { status: 504 });
    }
    
    return NextResponse.json({
      success: false,
      error: error.message,
      type: 'Unexpected Error'
    }, { status: 500 });
  }
}