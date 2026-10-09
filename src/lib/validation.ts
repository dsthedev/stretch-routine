import type {
    AppData,
    DailyRecord,
    Exercise,
    ExerciseCategory,
    Routine,
    RoutineProgress,
    RoutineStage,
} from "@/types"

const EXERCISE_CATEGORIES = [
    "neck",
    "shoulders",
    "chest",
    "upper-back",
    "arms",
    "wrists",
    "hands",
    "trunk",
    "hips",
    "thighs",
    "knees",
    "calves",
    "feet",
] satisfies readonly ExerciseCategory[]

const ROUTINE_STAGES = [
    "morning-prep",
    "workday-mobility",
    "evening-recovery",
] satisfies readonly RoutineStage[]

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null && !Array.isArray(value)
}

function isStringArray(value: unknown): value is string[] {
    return Array.isArray(value) && value.every((item) => typeof item === "string")
}

function isExercise(value: unknown): value is Exercise {
    if (!isRecord(value)) {
        return false
    }

    return (
        typeof value.id === "string" &&
        typeof value.name === "string" &&
        EXERCISE_CATEGORIES.includes(value.category as ExerciseCategory) &&
        typeof value.instructions === "string" &&
        Number.isInteger(value.durationSeconds) &&
        (value.durationSeconds as number) > 0 &&
        typeof value.purpose === "string" &&
        isStringArray(value.muscles) &&
        isStringArray(value.workActivities) &&
        (value.safetyNotes === undefined || typeof value.safetyNotes === "string") &&
        (value.referenceUrl === undefined || typeof value.referenceUrl === "string")
    )
}

function isExerciseArray(value: unknown): value is Exercise[] {
    return Array.isArray(value) && value.every(isExercise)
}

function isRoutine(value: unknown): value is Routine {
    if (!isRecord(value)) {
        return false
    }

    return (
        typeof value.id === "string" &&
        ROUTINE_STAGES.includes(value.stage as RoutineStage) &&
        typeof value.name === "string" &&
        isStringArray(value.exerciseIds)
    )
}

function isRoutineArray(value: unknown): value is Routine[] {
    return Array.isArray(value) && value.every(isRoutine)
}

function isRoutineProgress(value: unknown): value is RoutineProgress {
    if (!isRecord(value)) {
        return false
    }

    return (
        ["not-started", "in-progress", "completed"].includes(value.status as string) &&
        Number.isInteger(value.currentExerciseIndex) &&
        (value.currentExerciseIndex as number) >= 0 &&
        isStringArray(value.completedExerciseIds)
    )
}

function isLocalDateString(value: unknown): value is string {
    if (typeof value !== "string") {
        return false
    }

    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value)
    if (!match) {
        return false
    }

    const year = Number(match[1])
    const month = Number(match[2])
    const day = Number(match[3])
    const isLeapYear = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0)
    const daysPerMonth = [
        31,
        isLeapYear ? 29 : 28,
        31,
        30,
        31,
        30,
        31,
        31,
        30,
        31,
        30,
        31,
    ]

    return month >= 1 && month <= 12 && day >= 1 && day <= daysPerMonth[month - 1]
}

function isDailyRecord(value: unknown, routines: Routine[]): value is DailyRecord {
    if (!isRecord(value) || !isLocalDateString(value.date) || !isRecord(value.routines)) {
        return false
    }

    const progressByRoutine = value.routines

    return (
        Object.keys(progressByRoutine).length === routines.length &&
        routines.every((routine) => {
            const progress = progressByRoutine[routine.id]

            return (
                isRoutineProgress(progress) &&
                progress.currentExerciseIndex <= routine.exerciseIds.length &&
                new Set(progress.completedExerciseIds).size ===
                progress.completedExerciseIds.length &&
                progress.completedExerciseIds.every((id) =>
                    routine.exerciseIds.includes(id),
                )
            )
        })
    )
}

function isDailyRecordArray(value: unknown, routines: Routine[]): value is DailyRecord[] {
    if (!Array.isArray(value) || !value.every((record) => isDailyRecord(record, routines))) {
        return false
    }

    const dates = value.map((record) => {
        if (!isRecord(record) || typeof record.date !== "string") {
            return null
        }

        return record.date
    })

    return new Set(dates).size === dates.length
}

export function isAppData(value: unknown): value is AppData {
    if (!isRecord(value) || value.schemaVersion !== 1 || !isRecord(value.settings)) {
        return false
    }

    const settings = value.settings
    const exerciseLibrary = value.exerciseLibrary
    const routines = value.routines

    if (
        !["dark", "light", "system"].includes(settings.theme as string) ||
        !isExerciseArray(exerciseLibrary) ||
        !isRoutineArray(routines)
    ) {
        return false
    }

    const exerciseIds = new Set(exerciseLibrary.map((exercise) => exercise.id))
    const routineIds = new Set(routines.map((routine) => routine.id))

    return (
        exerciseIds.size === exerciseLibrary.length &&
        routineIds.size === routines.length &&
        routines.every(
            (routine) =>
                new Set(routine.exerciseIds).size === routine.exerciseIds.length &&
                routine.exerciseIds.every((id) => exerciseIds.has(id)),
        ) &&
        isDailyRecordArray(value.dailyRecords, routines)
    )
}