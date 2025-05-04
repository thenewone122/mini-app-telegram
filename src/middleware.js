
// import { NextRequest, NextResponse } from 'next/server';
// import { validate, parse } from '@telegram-apps/init-data-node';

// const BOT_TOKEN = process.env.BOT_TOKEN;

// export async function middleware(req) {
//   const authHeader = req.headers.get('authorization');

//   if (!authHeader) {
    
//     return new NextResponse('Unauthorized', { status: 401 });
//   }

//   const [authType, authData] = authHeader.split(' ');

//   if (authType !== 'tma' || !authData) {
//     return new NextResponse('Unauthorized', { status: 401 });
//   }

//   try {
//     // Validate the initData
//     validate(authData, BOT_TOKEN, { expiresIn: 3600 });

//     // Parse the initData
//     const initData = parse(authData);

//     // You can now use initData.user.id to identify the user
//     // For example, attach it to the request headers or cookies
//     const requestHeaders = new Headers(req.headers);
//     requestHeaders.set('x-user-id', initData.user.id.toString());

//     return NextResponse.next({
//       request: {
//         headers: requestHeaders,
//       },
//     });
//   } catch (error) {
//     return new NextResponse('Unauthorized', { status: 401 });
//   }
// }

// export const config = {
//   matcher: ['/:path*'], // Apply middleware to all routes
// };


import { NextResponse } from 'next/server';

export async function middleware(req) {
  const url = new URL(req.url);
  const userId = url.searchParams.get('userId');
  const username = url.searchParams.get('username');

  const response = NextResponse.next();

  if (userId && username) {
    // Set cookies to persist the user data across refreshes
    response.cookies.set('userId', userId, { path: '/', httpOnly: true, secure: true });
    response.cookies.set('username', username, { path: '/', httpOnly: true, secure: true });
  }
  return response;
}

export const config = {
  matcher: ['/:path*'], // Apply middleware to all routes
};
