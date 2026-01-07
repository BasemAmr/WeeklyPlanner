import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface SettingsContextType {
    weekStartDay: number // 0=Sunday, 1=Monday, 6=Saturday
    setWeekStartDay: (day: number) => void
    isSetupComplete: boolean
    completeSetup: (weekStartDay: number) => void
    resetSetup: () => void
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

export function SettingsProvider({ children }: { children: ReactNode }) {
    const [weekStartDay, setWeekStartDay] = useState<number>(() => {
        const saved = localStorage.getItem('weekStartDay')
        return saved ? parseInt(saved, 10) : 1
    })

    const [isSetupComplete, setIsSetupComplete] = useState<boolean>(() => {
        return localStorage.getItem('isSetupComplete') === 'true'
    })

    useEffect(() => {
        localStorage.setItem('weekStartDay', weekStartDay.toString())
    }, [weekStartDay])

    useEffect(() => {
        localStorage.setItem('isSetupComplete', isSetupComplete.toString())
    }, [isSetupComplete])

    const completeSetup = (day: number) => {
        setWeekStartDay(day)
        setIsSetupComplete(true)
    }

    const resetSetup = () => {
        setIsSetupComplete(false)
        localStorage.removeItem('isSetupComplete')
    }

    return (
        <SettingsContext.Provider value={{
            weekStartDay,
            setWeekStartDay,
            isSetupComplete,
            completeSetup,
            resetSetup
        }}>
            {children}
        </SettingsContext.Provider>
    )
}

export function useSettings() {
    const context = useContext(SettingsContext)
    if (context === undefined) {
        throw new Error('useSettings must be used within a SettingsProvider')
    }
    return context
}
