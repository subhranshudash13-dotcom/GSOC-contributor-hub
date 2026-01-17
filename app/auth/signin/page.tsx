'use client'

import { signIn } from "next-auth/react"
import { Github, Mail, Sparkles, LayoutDashboard, Search, Rocket } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

export default function SignInPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4 relative overflow-hidden">
            {/* Ambient Background */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] -z-10 animate-pulse" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md"
            >
                <div className="glass-dark border border-primary/20 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
                    {/* Header */}
                    <div className="text-center mb-10">
                        <Link href="/" className="inline-flex items-center space-x-2 mb-8 group">
                            <div className="h-10 w-10 rounded-xl gradient-purple flex items-center justify-center group-hover:rotate-12 transition-transform shadow-lg shadow-purple-500/20">
                                <Sparkles className="h-6 w-6 text-white" />
                            </div>
                            <span className="font-bold text-2xl tracking-tight">
                                GSoC<span className="text-primary">Hub</span>
                            </span>
                        </Link>
                        <h1 className="text-3xl font-extrabold mb-3 tracking-tight">Welcome Back</h1>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                            Sign in to track your GSoC 2026 projects and manage your contributions.
                        </p>
                    </div>

                    {/* Social Login Buttons */}
                    <div className="space-y-4 mb-8">
                        <button
                            onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
                            className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-[#24292F] hover:bg-[#24292F]/90 text-white font-semibold transition-all shadow-lg hover:shadow-xl active:scale-[0.98]"
                        >
                            <Github className="h-5 w-5" />
                            Continue with GitHub
                        </button>
                        <button
                            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
                            className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-white hover:bg-white/90 text-slate-900 font-semibold transition-all shadow-md hover:shadow-lg active:scale-[0.98]"
                        >
                            <svg className="h-5 w-5" viewBox="0 0 24 24">
                                <path
                                    fill="currentColor"
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                />
                                <path
                                    fill="currentColor"
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                />
                                <path
                                    fill="currentColor"
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.25.81-.59z"
                                />
                                <path
                                    fill="currentColor"
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                />
                            </svg>
                            Continue with Google
                        </button>
                    </div>

                    {/* Features Grid */}
                    <div className="grid grid-cols-2 gap-4 pb-2 border-t border-primary/10 pt-8">
                        <div className="text-center space-y-1">
                            <LayoutDashboard className="h-4 w-4 mx-auto text-primary opacity-60" />
                            <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Shortlisting</p>
                        </div>
                        <div className="text-center space-y-1">
                            <Rocket className="h-4 w-4 mx-auto text-gsoc-purple opacity-60" />
                            <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Tracking</p>
                        </div>
                    </div>
                </div>

                <p className="text-center mt-8 text-xs text-muted-foreground">
                    Don't have an account? <span className="text-primary font-medium">It's automatically created when you sign in.</span>
                </p>
            </motion.div>
        </div>
    )
}
