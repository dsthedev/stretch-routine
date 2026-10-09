export type ExerciseCategory =
    | "neck"
    | "shoulders"
    | "chest"
    | "upper-back"
    | "arms"
    | "wrists"
    | "hands"
    | "trunk"
    | "hips"
    | "thighs"
    | "knees"
    | "calves"
    | "feet"

export interface Exercise {
    id: string
    name: string
    category: ExerciseCategory
    instructions: string
    durationSeconds: number
    purpose: string
    muscles: string[]
    workActivities: string[]
    safetyNotes?: string
    referenceUrl?: string
}

export type RoutineStage =
    | "morning-prep"
    | "workday-mobility"
    | "evening-recovery"

export interface Routine {
    id: string
    stage: RoutineStage
    name: string
    exerciseIds: string[]
}

export type ThemePreference = "dark" | "light" | "system"

export interface AppSettings {
    theme: ThemePreference
}

export type RoutineCompletionStatus = "not-started" | "in-progress" | "completed"

export interface RoutineProgress {
    status: RoutineCompletionStatus
    currentExerciseIndex: number
    completedExerciseIds: string[]
}

export interface DailyRecord {
    date: string
    routines: Record<string, RoutineProgress>
}

export interface AppData {
    schemaVersion: 1
    settings: AppSettings
    exerciseLibrary: Exercise[]
    routines: Routine[]
    dailyRecords: DailyRecord[]
}
