'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { getTimeUnits } from '@/lib/utils'

export function CountdownTimer() {
    const gsocDate = new Date('2026-03-02T00:00:00Z') // GSoC 2026 typical start
    const [timeUnits, setTimeUnits] = useState(getTimeUnits(gsocDate))
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
        const interval = setInterval(() => {
            setTimeUnits(getTimeUnits(gsocDate))
        }, 1000)

        return () => clearInterval(interval)
    }, [])

    if (!mounted) {
        return null
    }

    const units = [
        { label: 'Days', value: timeUnits.days },
        { label: 'Hours', value: timeUnits.hours },
        { label: 'Minutes', value: timeUnits.minutes },
        { label: 'Seconds', value: timeUnits.seconds },
    ]

    return (
        <div className="flex gap-4 justify-center">
            {units.map((unit, index) => (
                <motion.div
                    key={unit.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex flex-col items-center glass-dark rounded-lg p-4 min-w-[80px]"
                >
                    <motion.div
                        key={unit.value}
                        initial={{ rotateX: 0 }}
                        animate={{ rotateX: [0, 90, 0] }}
                        transition={{ duration: 0.6 }}
                        className="text-3xl md:text-4xl font-bold text-gradient gradient-purple"
                    >
                        {String(unit.value).padStart(2, '0')}
                    </motion.div>
                    <div className="text-xs md:text-sm text-muted-foreground mt-1">
                        {unit.label}
                    </div>
                </motion.div>
            ))}
        </div>
    )
}
