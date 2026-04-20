# Fake Authentication Setup

This project has been configured to use hardcoded fake users and businesses instead of real authentication.

## Changes Made

### 1. Created `/lib/fake-data.ts`
- Defines hardcoded fake users (John Doe, Jane Smith, Mike Johnson)
- Defines hardcoded fake businesses with sample data
- Provides helper functions to get fake businesses for a user
- Default user is automatically logged in: **john@example.com**

### 2. Updated `/lib/services/auth.ts`
- Replaced all API calls with mock implementations
- Login, register, and all auth methods return the default fake user
- User session is automatically initialized on app startup
- No password validation or real authentication happens

### 3. Updated `/lib/business-context.tsx`
- Changed to load fake businesses instead of calling the API
- Uses `getFakeBusinessesForUser()` to get businesses for the logged-in user
- Maintains the same interface so the rest of the app works unchanged

### 4. Updated `/middleware.ts`
- Removed authentication checks from routing
- Fake user is always considered logged in
- Routes are no longer protected - anyone can access them
- Automatic redirect from "/" to home page (no login flow)

### 5. Updated `/components/sporgates/auth-guard.tsx`
- Simplified to always render children
- No authentication checks needed
- Fake user is always authenticated

## Testing Different Users

To test with different fake users, edit `/lib/fake-data.ts`:

```typescript
export const DEFAULT_FAKE_USER = FAKE_USERS.user2; // Change to user2 or user3
```

## Testing Different Businesses

Edit the `FAKE_BUSINESSES` array in `/lib/fake-data.ts` to add more businesses or modify existing ones.

## Key Features

- ✅ No login/signup required
- ✅ App loads directly to home page
- ✅ All features work with fake data
- ✅ Easy to switch between test users
- ✅ Easy to add/modify fake businesses
- ✅ No API calls for authentication
- ✅ Fast development iteration

## How to Switch Users

1. Open `/lib/fake-data.ts`
2. Find the line: `export const DEFAULT_FAKE_USER = FAKE_USERS.user1;`
3. Change to `user2` or `user3` to test different users
4. Refresh the app - it will instantly log in as the new user

## Notes

- All authentication and API calls are mocked
- The app behaves as if you're always logged in
- No actual data is persisted
- Changes to fake data are hot-reloaded
