'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Sparkles, ArrowRight } from 'lucide-react'
import { ThemeToggle } from '@/components/ui/theme-toggle'

export function Header() {
    return (
        <header className="sticky top-0 z-50 w-full border-b glass-dark backdrop-blur-xl">
            <div className="container flex h-16 items-center justify-between">
                <Link href="/" className="flex items-center space-x-2">
                    <motion.div
                        whileHover={{ rotate: 180 }}
                        transition={{ duration: 0.3 }}
                        className="h-8 w-8 rounded-lg bg-gradient-to-br from-gsoc-purple to-gsoc-purple-light flex items-center justify-center"
                    >
                        <Sparkles className="h-5 w-5 text-white" />
                    </motion.div>
                    <span className="font-bold text-xl">
                        GSoC<span className="text-primary">Hub</span>
                    </span>
                </Link>

                <nav className="hidden md:flex items-center space-x-6">
                    <Link
                        href="/projects"
                        className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                    >
                        Browse Projects
                    </Link>
                    <Link
                        href="/matcher"
                        className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                    >
                        AI Matcher
                    </Link>
                    <Link
                        href="/dashboard"
                        className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                    >
                        Dashboard
                    </Link>
                </nav>

                <div className="flex items-center space-x-4">
                    <ThemeToggle />
                    <Link
                        href="/matcher"
                        className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full gradient-purple text-white text-sm font-medium hover:opacity-90 transition-opacity"
                    >
                        Get Started
                        <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>
            </div>
        </header>
    )
}
