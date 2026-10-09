import type { AppData, DailyRecord, RoutineProgress } from "@/types"

function createInitialProgress(
    data: AppData,
): Record<string, RoutineProgress> {
    return data.routines.reduce<Record<string, RoutineProgress>>(
        (progressByRoutine, routine) => {
            progressByRoutine[routine.id] = {
                status: "not-started",
                currentExerciseIndex: 0,
                completedExerciseIds: [],
            }

            return progressByRoutine
        },
        {},
    )
}

export function updateRoutineProgress(
    data: AppData,
    date: string,
    routineId: string,
    progress: RoutineProgress,
): AppData {
    const routine = data.routines.find((item) => item.id === routineId)

    if (!routine) {
        throw new Error(`Unknown routine: ${routineId}`)
    }

    if (
        !Number.isInteger(progress.currentExerciseIndex) ||
        progress.currentExerciseIndex < 0 ||
        progress.currentExerciseIndex > routine.exerciseIds.length
    ) {
        throw new RangeError("Routine exercise index is out of bounds")
    }

    const completedIds = progress.completedExerciseIds

    if (
        new Set(completedIds).size !== completedIds.length ||
        !completedIds.every((id) => routine.exerciseIds.includes(id))
    ) {
        throw new Error("Routine progress contains invalid exercise IDs")
    }

    const existingRecord = data.dailyRecords.find(
        (record) => record.date === date,
    )

    const updatedRecord: DailyRecord = {
        date,
        routines: {
            ...(existingRecord?.routines ?? createInitialProgress(data)),
            [routineId]: {
                ...progress,
                completedExerciseIds: [...completedIds],
            },
        },
    }

    const dailyRecords = existingRecord
        ? data.dailyRecords.map((record) =>
            record.date === date ? updatedRecord : record,
        )
        : [...data.dailyRecords, updatedRecord]

    return {
        ...data,
        dailyRecords,
    }
}