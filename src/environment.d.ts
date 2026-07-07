declare global {
  namespace NodeJS {
    interface ProcessEnv {
      ALLOW_INDEXING?: 'true' | 'false'
      APP_ENV?: 'production' | 'staging' | 'development'
      PAYLOAD_SECRET: string
      DATABASE_URL: string
      NEXT_PUBLIC_SERVER_URL: string
      NEXT_PUBLIC_TURNSTILE_SITE_KEY: string
      TURNSTILE_EXPECTED_HOSTNAME?: string
      TURNSTILE_SECRET_KEY: string
      VERCEL_ENV?: 'production' | 'preview' | 'development'
      VERCEL_PROJECT_PRODUCTION_URL: string
    }
  }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {}
