import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 

export  async function middleware(request: NextRequest) {

const token = await getToken({req:request});
console.log("TOKEN_______:",token);
const url = request.nextUrl;

if(token && (url.pathname.startsWith('/login'))){
  return NextResponse.redirect(new URL('/', request.nextUrl))
}

// if(!token && (url.pathname.startsWith('/login')) ){
//     return NextResponse.redirect(new URL('/login', request.nextUrl))
// }

 // Convert decoded token to JSON string (headers can only store strings)
 const encodedToken = Buffer.from(JSON.stringify(token)).toString("base64");

 // Clone request with modified headers
 const modifiedHeaders = new Headers(request.headers);
 modifiedHeaders.set("user-token", encodedToken);

 const modifiedRequest = new Request(request, { headers: modifiedHeaders });

 return NextResponse.next({ request: modifiedRequest });
    
}

 
// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    '/profile',
    '/login',
    '/signup',
    '/verifyemail',
    '/dashboard/:path*',
    '/api/game/:path*',
    
  ]
}