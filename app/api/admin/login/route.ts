// app/api/admin/login/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    
    // Check credentials (use environment variables)
    if (email === process.env.ADMIN_EMAIL && 
        password === process.env.ADMIN_PASSWORD) {
      
      const response = NextResponse.json({ 
        success: true, 
        message: 'Login successful' 
      });
      
      // Set the cookie
      response.cookies.set('admin-token', 'authenticated', {
        httpOnly: false, // Set to true for production
        secure: false, // Set to true for production (HTTPS)
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/',
      });
      
      return response;
    }
    
    return NextResponse.json(
      { success: false, error: 'Invalid credentials' },
      { status: 401 }
    );
    
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Login failed' },
      { status: 500 }
    );
  }
}