import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('receipt') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Convert file to base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Image = buffer.toString('base64');
    
    // Upload to Cloudinary (you need to install and configure cloudinary)
    // For now, we'll store it locally or use a free service
    // You can use: https://www.npmjs.com/package/cloudinary
    
    // Temporary solution: Return a mock URL
    // In production, replace with actual Cloudinary upload
    const receiptUrl = `https://example.com/receipts/${Date.now()}-${file.name}`;

    return NextResponse.json({ 
      success: true, 
      receiptUrl 
    });

  } catch (error) {
    console.error('Error uploading receipt:', error);
    return NextResponse.json(
      { error: 'Failed to upload receipt' },
      { status: 500 }
    );
  }
}