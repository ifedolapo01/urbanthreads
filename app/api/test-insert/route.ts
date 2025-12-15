// app/api/test-insert/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(request: NextRequest) {
  try {
    console.log('=== TEST INSERT START ===');
    
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
    
    // Test 1: Simple insert without .select()
    console.log('Test 1: Simple insert...');
    const testProduct1 = {
      name: 'Test Insert 1',
      description: 'Testing direct insert',
      price: 1000,
      category: 'men',
      main_image: 'https://test.com/image.jpg',
      images: [],
      colors: ['Black'],
      sizes: ['M'],
      stock: 1,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    const { error: error1 } = await supabase
      .from('products')
      .insert([testProduct1]);
    
    console.log('Test 1 result:', error1?.message || 'Success');
    
    // Test 2: Insert with .select()
    console.log('Test 2: Insert with select...');
    const testProduct2 = {
      name: 'Test Insert 2',
      description: 'Testing insert with select',
      price: 2000,
      category: 'women',
      main_image: 'https://test.com/image2.jpg',
      images: [],
      colors: ['White'],
      sizes: ['S'],
      stock: 2,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    const { data: data2, error: error2 } = await supabase
      .from('products')
      .insert([testProduct2])
      .select()
      .single();
    
    console.log('Test 2 result:', error2?.message || `Success - ID: ${data2?.id}`);
    
    // Test 3: Check what columns exist
    console.log('Test 3: Check table structure...');
    const { data: columns, error: columnsError } = await supabase
      .from('information_schema.columns')
      .select('column_name, data_type, is_nullable')
      .eq('table_schema', 'public')
      .eq('table_name', 'products')
      .order('ordinal_position');
    
    return NextResponse.json({
      success: true,
      tests: {
        test1: error1 ? `FAILED: ${error1.message}` : 'SUCCESS',
        test2: error2 ? `FAILED: ${error2.message}` : `SUCCESS - ID: ${data2?.id}`,
        test3: columnsError ? `FAILED: ${columnsError.message}` : 'SUCCESS',
        columns: columnsError ? null : columns
      },
      suggestion: error2 ? 'The issue is with SELECT after INSERT. This is an RLS policy issue.' : 'All tests passed'
    });
    
  } catch (error: any) {
    console.error('Test error:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack
    });
  }
}