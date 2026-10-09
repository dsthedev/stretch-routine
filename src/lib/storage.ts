import { createDefaultAppData } from "@/lib/default-data"
import { isAppData } from "@/lib/validation"
import type { AppData } from "@/types"

export const APP_DATA_STORAGE_KEY = "stretch-routine:app-data"

export type LoadAppDataResult =
    | {
        status: "ready"
        source: "default" | "storage"
        data: AppData
    }
    | {
        status: "invalid"
        reason: "invalid-json" | "invalid-data" | "unsupported-version"
        rawValue: string
    }
    | {
        status: "unavailable"
        error: unknown
    }

export type SaveAppDataResult =
    | { status: "saved" }
    | { status: "invalid-data" }
    | { status: "unavailable"; error: unknown }

export function loadAppData(): LoadAppDataResult {
    let rawValue: string | null

    try {
        rawValue = localStorage.getItem(APP_DATA_STORAGE_KEY)
    } catch (error) {
        return { status: "unavailable", error }
    }

    if (rawValue === null) {
        return {
            status: "ready",
            source: "default",
            data: createDefaultAppData(),
        }
    }

    let parsed: unknown

    try {
        parsed = JSON.parse(rawValue)
    } catch {
        return { status: "invalid", reason: "invalid-json", rawValue }
    }

    if (
        typeof parsed === "object" &&
        parsed !== null &&
        !Array.isArray(parsed) &&
        "schemaVersion" in parsed &&
        parsed.schemaVersion !== 1
    ) {
        return { status: "invalid", reason: "unsupported-version", rawValue }
    }

    if (!isAppData(parsed)) {
        return { status: "invalid", reason: "invalid-data", rawValue }
    }

    return { status: "ready", source: "storage", data: parsed }
}

export function saveAppData(data: AppData): SaveAppDataResult {
    if (!isAppData(data)) {
        return { status: "invalid-data" }
    }

    try {
        const serialized = JSON.stringify(data)

        if (serialized === undefined) {
            return { status: "invalid-data" }
        }

        localStorage.setItem(APP_DATA_STORAGE_KEY, serialized)
        return { status: "saved" }
    } catch (error) {
        return { status: "unavailable", error }
    }
}