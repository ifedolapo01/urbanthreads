// app/api/admin/logout/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ success: true });
  
  // Clear the admin cookie
  response.cookies.delete('admin-token');
  
  return response;
}