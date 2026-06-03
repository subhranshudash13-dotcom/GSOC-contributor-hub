'use client'

import { AlertCircle, Info } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function GSoCDataBanner() {
    const [isVisible, setIsVisible] = useState(true)
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted || !isVisible) return null

    return (
        <div className="bg-gradient-to-r from-purple-900/40 to-blue-900/40 backdrop-blur-sm border-b border-purple-500/20">
            <div className="container mx-auto px-4 py-3">
                <div className="flex items-start gap-3 justify-between">
                    <div className="flex items-start gap-3 flex-1">
                        <Info className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                            <p className="text-sm text-gray-200">
                                <span className="font-semibold text-purple-300">🎉 GSoC 2026 Data is Live!</span>{' '}
                                Explore all 183 officially accepted organizations and 1,140 projects. Use our AI Matcher or the new Organizations Explorer to find your perfect fit!
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => setIsVisible(false)}
                        className="text-gray-400 hover:text-white transition-colors ml-2 flex-shrink-0"
                        aria-label="Dismiss banner"
                    >
                        ×
                    </button>
                </div>
            </div>
        </div>
    )
}
