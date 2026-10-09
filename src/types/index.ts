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