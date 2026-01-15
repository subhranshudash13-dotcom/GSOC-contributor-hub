import type { Metadata } from 'next'
import { Inter, Outfit } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/providers/theme-provider'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { Toaster } from 'react-hot-toast'
import GoogleAnalytics from '@/components/providers/GoogleAnalytics'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' })

export const metadata: Metadata = {
    title: 'GSoC 2026 Contributor Hub | Find & Match Projects with AI',
    description: 'The ultimate platform for Google Summer of Code aspirants. Find your perfect GSoC 2026 project, get AI-powered recommendations, and track your contributions.',
    keywords: ['GSoC 2026', 'Google Summer of Code', 'Open Source', 'Programming', 'Internships', 'Coding', 'AI Matcher', 'Find GSoC Projects'],
    authors: [{ name: 'GSoC Hub Team' }],
    creator: 'GSoC Hub',
    publisher: 'GSoC Hub',
    openGraph: {
        type: 'website',
        locale: 'en_US',
        url: 'https://gsoc-contributor-hub.vercel.app',
        title: 'GSoC 2026 Contributor Hub',
        description: 'Find your dream GSoC 2026 project with our AI Matcher.',
        siteName: 'GSoC Contributor Hub',
        images: [
            {
                url: '/og-image.jpg',
                width: 1200,
                height: 630,
                alt: 'GSoC Contributor Hub Preview',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'GSoC 2026 Contributor Hub',
        description: 'Match with your perfect Google Summer of Code project instantly.',
        images: ['/og-image.jpg'],
    },
    icons: {
        icon: '/favicon.ico',
        shortcut: '/favicon-16x16.png',
        apple: '/apple-touch-icon.png',
    },
    metadataBase: new URL('https://gsoc-contributor-hub.vercel.app'),
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <link rel="manifest" href="/manifest.json" />
                <meta name="theme-color" content="#7C3AED" />
            </head>
            <body className={`${inter.variable} ${outfit.variable} font-sans antialiased min-h-screen flex flex-col bg-background text-foreground selection:bg-primary/20`}>
                <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
                    <GoogleAnalytics GA_MEASUREMENT_ID={process.env.NEXT_PUBLIC_GA_ID || ''} />
                    <Header />
                    <main className="flex-1 w-full">
                        {children}
                    </main>
                    <Footer />
                    <Toaster position="bottom-right" toastOptions={{
                        style: {
                            background: 'rgba(15, 23, 42, 0.8)',
                            color: '#fff',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                        },
                    }} />
                </ThemeProvider>
            </body>
        </html>
    )
}
