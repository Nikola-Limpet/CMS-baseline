import { createAuthClient } from "better-auth/react"
import { organizationClient, adminClient, inferAdditionalFields } from "better-auth/client/plugins"
import type { auth } from "@/lib/auth"

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "",
  plugins: [
    organizationClient(),
    adminClient(),
    inferAdditionalFields<typeof auth>(),
  ],
})
