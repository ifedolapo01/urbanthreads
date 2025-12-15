// app/api/admin/products/route.ts - FIXED VERSION
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: NextRequest) {
  try {
    // Log environment check
    console.log('API Environment check:', {
      hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY
    });

    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Service role key not configured',
          details: 'Add SUPABASE_SERVICE_ROLE_KEY to .env.local'
        },
        { status: 500 }
      );
    }

    // Create admin client with service role
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );
    
    const body = await request.json();
    
    console.log('Creating product:', {
      name: body.name,
      price: body.price,
      category: body.category
    });
    
    const { data, error } = await supabaseAdmin
      .from('products')
      .insert([{
        name: body.name,
        description: body.description,
        price: body.price,
        category: body.category,
        main_image: body.main_image,
        images: body.images || [],
        colors: body.colors || [],
        sizes: body.sizes || [],
        stock: body.stock || 0,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) {
      console.error('Supabase insert error:', error);
      return NextResponse.json(
        { 
          success: false, 
          error: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      product: data,
      message: 'Product created successfully'
    });
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Create regular client for reading (respects RLS)
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Fetch error:', error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      products: data || [] 
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}