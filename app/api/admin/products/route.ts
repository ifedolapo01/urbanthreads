// app/api/admin/products/route.ts - ENHANCED DEBUG VERSION
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: NextRequest) {
  console.log('=== PRODUCT API CALLED ===');
  console.log('Environment:', process.env.NODE_ENV);
  console.log('Vercel Env:', process.env.VERCEL_ENV);
  
  try {
    // Detailed environment check
    const envCheck = {
      NEXT_PUBLIC_SUPABASE_URL: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      SUPABASE_SERVICE_ROLE_KEY: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      urlPreview: process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 30),
      serviceKeyPreview: process.env.SUPABASE_SERVICE_ROLE_KEY?.substring(0, 10)
    };
    
    console.log('Env Check:', envCheck);

    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error('❌ SUPABASE_SERVICE_ROLE_KEY is missing!');
      return NextResponse.json(
        { 
          success: false, 
          error: 'Service role key not configured',
          envCheck,
          timestamp: new Date().toISOString()
        },
        { status: 500 }
      );
    }

    // Create admin client
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
          detectSessionInUrl: false
        }
      }
    );
    
    // Test connection first
    console.log('Testing Supabase connection...');
    const { error: connectionError } = await supabaseAdmin
      .from('products')
      .select('count')
      .limit(1);
    
    if (connectionError) {
      console.error('❌ Connection test failed:', connectionError);
      return NextResponse.json(
        { 
          success: false, 
          error: 'Supabase connection failed',
          connectionError: {
            message: connectionError.message,
            code: connectionError.code,
            details: connectionError.details
          },
          envCheck
        },
        { status: 500 }
      );
    }
    
    console.log('✅ Connection test passed');
    
    const body = await request.json();
    console.log('Request body received');
    
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
    
    console.log('Inserting product:', {
      name: productData.name,
      price: productData.price,
      category: productData.category
    });
    
    const { data, error } = await supabaseAdmin
      .from('products')
      .insert([productData])
      .select()
      .single();

    if (error) {
      console.error('❌ Insert error:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint
      });
      
      // Check for common errors
      let userMessage = error.message;
      if (error.code === '42501') {
        userMessage = 'Permission denied. Check RLS policies on products table.';
      } else if (error.code === 'PGRST301') {
        userMessage = 'Table not found or insufficient permissions.';
      }
      
      return NextResponse.json(
        { 
          success: false, 
          error: userMessage,
          supabaseError: {
            message: error.message,
            code: error.code,
            details: error.details,
            hint: error.hint
          },
          suggestion: 'Check Supabase RLS policies for products table'
        },
        { status: 500 }
      );
    }

    console.log('✅ Product created successfully:', data.id);
    
    return NextResponse.json({ 
      success: true, 
      product: data,
      message: 'Product created successfully'
    });
    
  } catch (error: any) {
    console.error('❌ Unexpected error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error',
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}