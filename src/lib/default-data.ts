import { exercises } from "@/data/exercises"
import { routines } from "@/data/routines"
import type { AppData } from "@/types"

export function createDefaultAppData(): AppData {
    return {
        schemaVersion: 1,
        settings: {
            theme: "system",
        },
        exerciseLibrary: structuredClone(exercises),
        routines: structuredClone(routines),
        dailyRecords: [],
    }
}