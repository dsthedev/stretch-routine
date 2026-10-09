import { createContext, useContext, useState } from "react"
import type { ReactNode } from "react"

import {
    loadAppData,
    saveAppData as saveStoredAppData,
} from "@/lib/storage"
import type {
    LoadAppDataResult,
    SaveAppDataResult,
} from "@/lib/storage"
import type { AppData } from "@/types"

type ContextSaveResult = SaveAppDataResult | { status: "blocked" }

interface AppDataContextValue {
    loadResult: LoadAppDataResult
    saveData: (data: AppData) => ContextSaveResult
}

const AppDataContext = createContext<AppDataContextValue | null>(null)

export function AppDataProvider({ children }: { children: ReactNode }) {
    const [loadResult, setLoadResult] = useState<LoadAppDataResult>(() =>
        loadAppData(),
    )

    function saveData(data: AppData): ContextSaveResult {
        if (loadResult.status !== "ready") {
            return { status: "blocked" }
        }

        const saveResult = saveStoredAppData(data)

        if (saveResult.status === "saved") {
            setLoadResult({
                status: "ready",
                source: "storage",
                data,
            })
        }

        return saveResult
    }

    return (
        <AppDataContext.Provider value={{ loadResult, saveData }}>
            {children}
        </AppDataContext.Provider>
    )
}

export function useAppData(): AppDataContextValue {
    const context = useContext(AppDataContext)

    if (context === null) {
        throw new Error("useAppData must be used within an AppDataProvider")
    }

    return context
}