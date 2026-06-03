import GitHub from "next-auth/providers/github"
import Google from "next-auth/providers/google"
import type { NextAuthConfig } from "next-auth"

const githubId = process.env.AUTH_GITHUB_ID ?? process.env.GITHUB_ID ?? process.env.GITHUB_CLIENT_ID
const githubSecret =
    process.env.AUTH_GITHUB_SECRET ?? process.env.GITHUB_SECRET ?? process.env.GITHUB_CLIENT_SECRET

const googleId = process.env.AUTH_GOOGLE_ID ?? process.env.GOOGLE_ID ?? process.env.GOOGLE_CLIENT_ID
const googleSecret =
    process.env.AUTH_GOOGLE_SECRET ?? process.env.GOOGLE_SECRET ?? process.env.GOOGLE_CLIENT_SECRET

const providers = [
    ...(githubId && githubSecret
        ? [GitHub({ clientId: githubId, clientSecret: githubSecret })]
        : []),
    ...(googleId && googleSecret
        ? [Google({ clientId: googleId, clientSecret: googleSecret })]
        : []),
]

export default {
    providers,
    pages: {
        signIn: "/auth/signin",
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user
            const isProtectedRoute =
                nextUrl.pathname.startsWith("/dashboard") ||
                nextUrl.pathname.startsWith("/admin") ||
                nextUrl.pathname.startsWith("/profile")

            if (!isProtectedRoute) return true
            return isLoggedIn
        },
    },
} satisfies NextAuthConfig
