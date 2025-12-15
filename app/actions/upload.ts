// app/actions/upload.ts - SIMPLIFIED VERSION
'use server';

import { createClient } from '@supabase/supabase-js';

export async function uploadProductImage(formData: FormData) {
  try {
    // Use service role client
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
    
    const file = formData.get('image') as File;
    
    if (!file) {
      return { error: 'No file provided' };
    }

    // Check file size
    if (file.size > 5 * 1024 * 1024) {
      return { error: 'File size must be less than 5MB' };
    }

    const fileName = `${Date.now()}-${file.name.replace(/\s+/g, '-').toLowerCase()}`;
    const fileBuffer = await file.arrayBuffer();

    // Upload with admin client
    const { error: uploadError } = await supabaseAdmin.storage
      .from('product_images')
      .upload(fileName, fileBuffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return { error: `Upload failed: ${uploadError.message}` };
    }

    // Get public URL
    const { data: { publicUrl } } = supabaseAdmin.storage
      .from('product_images')
      .getPublicUrl(fileName);

    return { success: true, url: publicUrl };
  } catch (error: any) {
    console.error('Upload action error:', error);
    return { error: `Server error: ${error.message}` };
  }
}