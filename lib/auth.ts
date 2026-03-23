import { betterAuth } from "better-auth"
import { nextCookies } from "better-auth/next-js"
import { organization, admin } from "better-auth/plugins"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { db } from "@/db"
import * as schema from "@/db/schema"

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  trustedOrigins:
    process.env.BETTER_AUTH_TRUSTED_ORIGINS?.split(",")
      .map((o) => o.trim())
      .filter(Boolean) ?? [],
  database: drizzleAdapter(db, { provider: "pg", schema }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
  user: {
    additionalFields: {
      bio: { type: "string", required: false },
      preferences: { type: "string", required: false },
    },
  },
  plugins: [
    organization(),
    admin(),
    nextCookies(),
  ],
})
