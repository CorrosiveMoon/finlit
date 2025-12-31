'use client'

import { useUser } from '@clerk/nextjs'

export function useUserId() {
  const { user, isLoaded } = useUser()
  
  // Return the Clerk user ID, or empty string if not loaded or not signed in
  return isLoaded && user ? user.id : ''
}
