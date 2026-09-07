export const validateEnv = () => {
  const required = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'SUPABASE_SERVICE_ROLE_KEY',
    'GEMINI_API_KEY'
  ];
  
  for (const key of required) {
    if (!process.env[key]) {
      throw new Error(`CRITICAL: Environment variable ${key} is missing in .env.local`);
    }
  }
};
