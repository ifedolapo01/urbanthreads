// app/api/admin/products/route.ts - WORKING VERSION
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: NextRequest) {
  console.log('🔄 PRODUCT API CALLED');
  
  try {
    // Create client with service role
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
    
    // Parse request
    const body = await request.json();
    console.log('📦 Product data:', { 
      name: body.name, 
      price: body.price,
      category: body.category 
    });
    
    // Prepare product data
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
    
    console.log('🚀 Inserting product...');
    
    // Insert WITHOUT .select().single() first
    const { error: insertError } = await supabase
      .from('products')
      .insert([productData]);
    
    if (insertError) {
      console.error('❌ Insert error:', insertError);
      return NextResponse.json(
        { 
          success: false, 
          error: insertError.message,
          code: insertError.code,
          hint: 'Check RLS policies - service_role should have full access'
        },
        { status: 500 }
      );
    }
    
    console.log('✅ Insert successful, fetching created product...');
    
    // Now fetch the product we just inserted
    const { data: fetchedData, error: fetchError } = await supabase
      .from('products')
      .select('*')
      .eq('name', body.name)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
    
    if (fetchError) {
      console.warn('⚠️ Could not fetch product after insert:', fetchError);
      // Still return success since insert worked
      return NextResponse.json({
        success: true,
        product: productData, // Return what we tried to insert
        message: 'Product created but could not retrieve details',
        note: 'This is usually fine - the product was created successfully'
      });
    }
    
    console.log('🎉 Product fully processed:', fetchedData.id);
    
    return NextResponse.json({
      success: true,
      product: fetchedData,
      message: 'Product created successfully'
    });
    
  } catch (error: any) {
    console.error('💥 Unexpected error:', error);
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