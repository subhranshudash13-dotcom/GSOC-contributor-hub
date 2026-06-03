import GitHub from "next-auth/providers/github"
import Google from "next-auth/providers/google"
import type { NextAuthConfig } from "next-auth"

export default {
    providers: [
        GitHub,
        Google,
    ],
    pages: {
        signIn: "/auth/signin",
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user
            const isDashboard = nextUrl.pathname.startsWith('/dashboard')
            const isAdmin = nextUrl.pathname.startsWith('/admin')

            if (isDashboard || isAdmin) {
                if (isLoggedIn) return true
                return false // Redirect to login
            }
            return true
        },
    },
} satisfies NextAuthConfig
