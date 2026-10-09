import { createDefaultAppData } from "@/lib/default-data"
import { isAppData } from "@/lib/validation"
import type { AppData, ThemePreference } from "@/types"

export const APP_DATA_STORAGE_KEY = "stretch-routine:app-data"

const LEGACY_THEME_STORAGE_KEY = "theme"
const THEME_PREFERENCES: readonly ThemePreference[] = ["dark", "light", "system"]

function isThemePreference(value: string | null): value is ThemePreference {
    return value !== null && THEME_PREFERENCES.includes(value as ThemePreference)
}

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
        const data = createDefaultAppData()

        try {
            const legacyTheme = localStorage.getItem(LEGACY_THEME_STORAGE_KEY)

            if (isThemePreference(legacyTheme)) {
                data.settings.theme = legacyTheme

                if (saveAppData(data).status === "saved") {
                    localStorage.removeItem(LEGACY_THEME_STORAGE_KEY)
                }
            }
        } catch (error) {
            return { status: "unavailable", error }
        }

        return {
            status: "ready",
            source: "default",
            data,
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
