export function getEnv() {
  const env = {
    baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
    apiUrl: process.env.NEXT_PUBLIC_API_URL,
    authUrl: process.env.NEXTAUTH_URL,
    authSecret: process.env.NEXTAUTH_SECRET,
    wsUrl: process.env.NEXT_PUBLIC_WS_URL,
  };

  Object.entries(env).forEach(([key, value]) => {
    if (!value) {
      if (
        (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') ||
        typeof window === 'undefined'
      ) {
        console.warn(`Environment variable for ${key} is missing or empty.`);
      }
    }
  });

  return env;
}
