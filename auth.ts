import NextAuth from "next-auth"
import { MongoDBAdapter } from "@auth/mongodb-adapter"
import clientPromise from "./lib/mongodb-adapter"
import authConfig from "./auth.config"

export const { handlers, auth, signIn, signOut } = NextAuth({
    secret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET,
    trustHost:
        process.env.AUTH_TRUST_HOST === "true" || process.env.NEXTAUTH_URL?.startsWith("http://localhost")
            ? true
            : undefined,
    adapter: MongoDBAdapter(clientPromise),
    session: { strategy: "jwt" },
    ...authConfig,
    callbacks: {
        ...authConfig.callbacks,
        async session({ session, token }) {
            if (token?.sub && session.user) {
                session.user.id = token.sub
            }
            return session
        },
    },
})
