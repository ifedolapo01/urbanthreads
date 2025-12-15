// app/api/mobile-test/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Get request headers to see differences
  const headers = Object.fromEntries(request.headers.entries());
  
  return NextResponse.json({
    mobile: 'Test API working',
    userAgent: headers['user-agent'],
    headers: {
      'content-type': headers['content-type'],
      'accept': headers['accept'],
      'host': headers['host']
    },
    timestamp: new Date().toISOString()
  });
}