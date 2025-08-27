# Stack Auth Google OAuth Setup Guide

## Overview
This guide explains how to set up and configure Stack Auth with Google OAuth for the VibePHX site.

## Current Implementation

### 1. Environment Variables
The following environment variables are configured in `.env.local`:

```env
NEXT_PUBLIC_STACK_PROJECT_ID=bfb5a3e6-cdc3-40fc-ae3b-5ae5b43852e0
NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY=pck_vb94s4qjz8j28pmrmhwqf4vsbte1y0wm26ysrs0ngrscr
STACK_SECRET_SERVER_KEY=ssk_4qppvqaf5y1gze0phjbm6rdmzsejem0gkp6np761t6r3r
```

### 2. Stack Auth Configuration

#### Server Configuration (`/stack.ts`)
```typescript
import { StackServerApp } from '@stackframe/stack';

export const stackServerApp = new StackServerApp({
  tokenStore: 'nextjs-cookie',
  projectId: process.env.NEXT_PUBLIC_STACK_PROJECT_ID!,
  publishableClientKey: process.env.NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY!,
  secretServerKey: process.env.STACK_SECRET_SERVER_KEY!,
  urls: {
    signIn: '/auth/signin',
    afterSignIn: '/builder',
    afterSignOut: '/',
  },
});
```

#### Client Provider (`/components/providers/StackProvider.tsx`)
- Wraps client components with Stack Auth context
- Validates environment variables before initialization
- Configured with proper redirect URLs

### 3. API Routes

#### Auth Handler (`/app/api/v1/auth/[...stack]/route.ts`)
```typescript
import { stackServerApp } from "@/stack";

export const GET = stackServerApp.handler;
export const POST = stackServerApp.handler;
```

This handles OAuth callbacks and Stack Auth API endpoints.

### 4. Authentication Components

#### Sign-In Form (`/components/auth/SimpleSignInForm.tsx`)
- Uses `useStackApp` hook for Google OAuth
- Properly handles authentication state
- Redirects authenticated users to `/builder`

#### User Menu (`/components/auth/SimpleUserMenu.tsx`)
- Shows user profile when authenticated
- Provides sign-out functionality
- Graceful loading states and fallbacks

#### Auth Guard (`/components/auth/AuthGuard.tsx`)
- Protects routes requiring authentication
- Redirects unauthenticated users to sign-in
- Shows appropriate loading states

### 5. Route Protection

#### Conditional Stack Provider
- Only loads Stack Auth on routes that need it
- Prevents unnecessary context initialization on public pages
- Routes with Stack Auth: `/builder/*`, `/dashboard/*`, `/auth/*`

#### Protected Routes
- `/builder/*` - Requires authentication
- `/dashboard/*` - Requires authentication
- `/auth/*` - Has Stack Auth context for sign-in

## Stack Auth Dashboard Configuration

### Required Settings in Stack Auth Dashboard:

1. **OAuth Providers**
   - Enable Google OAuth
   - Configure Google client ID and secret

2. **Redirect URLs**
   ```
   Development:
   - http://localhost:3000/api/v1/auth/callback/google
   
   Production:
   - https://your-domain.com/api/v1/auth/callback/google
   ```

3. **Sign-in URL**: `/auth/signin`
4. **After Sign-in URL**: `/builder`
5. **After Sign-out URL**: `/`

## Testing the Integration

### 1. Check Environment Variables
```bash
npm run dev
```
Ensure no environment variable warnings in console.

### 2. Test Sign-in Flow
1. Navigate to `http://localhost:3000/auth/signin`
2. Click "Continue with Google"
3. Complete Google OAuth flow
4. Should redirect to `/builder`

### 3. Test Protected Routes
1. Visit `http://localhost:3000/builder` without being signed in
2. Should redirect to `/auth/signin`
3. After signing in, should return to `/builder`

### 4. Test Sign-out
1. While authenticated, click user menu in top-right
2. Click "Sign Out"
3. Should redirect to homepage

## Troubleshooting

### Common Issues:

1. **"app is undefined" Error**
   - Ensure environment variables are properly set
   - Check that StackProvider is wrapping the component
   - Verify server configuration includes all required fields

2. **OAuth Redirect Issues**
   - Check redirect URLs in Stack Auth dashboard
   - Ensure callback route is accessible
   - Verify domain matches between development and configuration

3. **Context Not Available**
   - Ensure component using Stack Auth hooks is wrapped by StackProvider
   - Check that ConditionalStackProvider includes the route

4. **Session Not Persisting**
   - Verify `tokenStore: 'nextjs-cookie'` is set
   - Check that cookies are enabled in browser
   - Ensure HTTPS in production

## File Structure

```
app/
├── api/v1/auth/[...stack]/route.ts    # Stack Auth API handler
├── auth/
│   ├── layout.tsx                     # Wraps with StackProvider
│   └── signin/page.tsx                # Sign-in page
├── builder/layout.tsx                 # Protected route with AuthGuard
└── layout.tsx                         # Root layout with ConditionalStackProvider

components/
├── auth/
│   ├── AuthGuard.tsx                  # Route protection
│   ├── SimpleSignInForm.tsx           # Google OAuth sign-in
│   └── SimpleUserMenu.tsx             # User profile menu
└── providers/
    ├── StackProvider.tsx              # Stack Auth context
    └── ConditionalStackProvider.tsx   # Route-based provider

stack.ts                               # Server configuration
.env.local                            # Environment variables
```

## Next Steps

1. **Test in Production**: Deploy and verify OAuth redirects work
2. **Add Error Handling**: Enhance error states and user feedback
3. **User Profile**: Expand user management features
4. **Session Management**: Add session timeout handling
5. **Analytics**: Track authentication metrics