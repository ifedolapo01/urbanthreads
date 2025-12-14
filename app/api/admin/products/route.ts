// app/api/admin/products/route.ts - UPDATED WITH SERVICE ROLE
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: NextRequest) {
  try {
    // Use service role client (bypasses RLS)
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
        is_active: true
      }])
      .select()
      .single();

    if (error) {
      console.error('Supabase insert error:', error);
      throw error;
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
        error: error.message,
        details: 'Check Supabase RLS policies for products table'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // For GET, we can use regular client since we only need to read
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
    
    const { data, error } = await supabaseAdmin
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ 
      success: true, 
      products: data 
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}