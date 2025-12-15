// app/api/admin/products/route.ts - FINAL WORKING VERSION
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: NextRequest) {
  console.log('📦 Product creation API called');
  
  try {
    // Create Supabase client with service role
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
    
    // Parse request body
    const body = await request.json();
    
    // Validate required fields
    if (!body.name || !body.price || !body.category) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Missing required fields: name, price, and category are required' 
        },
        { status: 400 }
      );
    }
    
    // Prepare product data
    const productData = {
      name: body.name,
      description: body.description || '',
      price: Number(body.price),
      category: body.category,
      main_image: body.main_image || '',
      images: body.images || [],
      colors: body.colors || [],
      sizes: body.sizes || [],
      stock: Number(body.stock) || 0,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    console.log('Creating product:', productData.name);
    
    // Insert product
    const { data, error } = await supabase
      .from('products')
      .insert([productData])
      .select()
      .single();

    if (error) {
      console.error('Product creation error:', error);
      return NextResponse.json(
        { 
          success: false, 
          error: error.message,
          code: error.code
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
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

// GET endpoint for testing
export async function GET() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) throw error;

    return NextResponse.json({ 
      success: true, 
      count: data?.length || 0,
      products: data 
    });
    
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}