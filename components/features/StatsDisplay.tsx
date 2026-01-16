'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Users, Building2, FolderGit2 } from 'lucide-react'

export function StatsDisplay() {
    const [stats, setStats] = useState({
        orgs: 0,
        projects: 0,
        contributors: 0,
    })

    const targets = {
        orgs: 185, // Historical GSoC organizations
        projects: 0,
        contributors: 10000,
    }

    useEffect(() => {
        let timer: NodeJS.Timeout | null = null

        // Fetch real stats from API
        const fetchStats = async () => {
            try {
                const response = await fetch('/api/projects')
                if (response.ok) {
                    const data = await response.json()
                    targets.projects = data.pagination?.total || 617
                    targets.orgs = 185 // More accurate for 2025
                }
            } catch (error) {
                console.error('Failed to fetch stats:', error)
            }

            // Animate to target values
            const duration = 2000 // 2 seconds animation
            const steps = 60
            const interval = duration / steps

            let currentStep = 0
            timer = setInterval(() => {
                currentStep++
                const progress = currentStep / steps

                setStats({
                    orgs: Math.floor(targets.orgs * progress),
                    projects: Math.floor(targets.projects * progress),
                    contributors: Math.floor(targets.contributors * progress),
                })

                if (currentStep >= steps) {
                    if (timer) clearInterval(timer)
                    setStats({
                        orgs: targets.orgs,
                        projects: targets.projects,
                        contributors: targets.contributors,
                    })
                }
            }, interval)
        }

        fetchStats()

        return () => {
            if (timer) clearInterval(timer)
        }
    }, [])

    const statItems = [
        {
            icon: Building2,
            label: 'Organizations',
            value: stats.orgs,
            suffix: '+',
        },
        {
            icon: FolderGit2,
            label: 'Projects',
            value: stats.projects,
            suffix: '+',
        },
        {
            icon: Users,
            label: 'Contributors',
            value: stats.contributors,
            suffix: '+',
        },
    ]

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {statItems.map((item, index) => (
                <motion.div
                    key={item.label}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.2 }}
                    className="flex flex-col items-center p-6 glass rounded-xl hover:scale-105 transition-transform"
                >
                    <item.icon className="h-10 w-10 mb-3 text-primary" />
                    <div className="text-4xl font-bold text-gradient gradient-purple">
                        {item.value.toLocaleString()}
                        {item.suffix}
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                        {item.label}
                    </div>
                </motion.div>
            ))}
        </div>
    )
}
