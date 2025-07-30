// Configuration for development environment
export const config = {
  // Disable Clerk in development if no valid keys are provided
  isDevelopment: process.env.NODE_ENV === 'development',
  hasValidClerkKeys: 
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && 
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY !== 'pk_test_your_publishable_key_here' &&
    process.env.CLERK_SECRET_KEY && 
    process.env.CLERK_SECRET_KEY !== 'sk_test_your_secret_key_here',
}

export const shouldUseClerk = config.hasValidClerkKeys || process.env.NODE_ENV === 'production'
