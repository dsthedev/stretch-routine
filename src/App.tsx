import { Button } from "@/components/ui/button"
import { useState } from "react"
import {
  ArrowLeft,
  ArrowRight,
  BriefcaseBusiness,
  Check,
  Moon,
  Sunrise,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

import { useAppData } from "@/components/app-data-provider"
import { getLocalDateString } from "@/lib/dates"
import { updateRoutineProgress } from "@/lib/routine-progress"
import type {
  RoutineCompletionStatus,
  RoutineProgress,
  RoutineStage,
} from "@/types"

const STAGE_ICONS: Record<RoutineStage, LucideIcon> = {
  "morning-prep": Sunrise,
  "workday-mobility": BriefcaseBusiness,
  "evening-recovery": Moon,
}

function getStatusLabel(status?: RoutineCompletionStatus): string {
  if (status === "completed") {
    return "Completed today"
  }

  if (status === "in-progress") {
    return "In progress"
  }

  return "Not started"
}

export function App() {
  const { loadResult, saveData } = useAppData()
  const [selectedRoutineId, setSelectedRoutineId] = useState<string | null>(
    null,
  )
  const [saveMessage, setSaveMessage] = useState("")

  if (loadResult.status !== "ready") {
    const message =
      loadResult.status === "invalid"
        ? "Saved app data could not be loaded."
        : "App data is currently unavailable."

    return (
      <main className="mx-auto flex min-h-svh max-w-2xl items-center px-5 py-10">
        <section aria-labelledby="data-status-title">
          <p className="mb-3 font-heading text-sm font-semibold tracking-wide text-primary">
            STRETCH ROUTINE
          </p>
          <h1
            id="data-status-title"
            className="font-heading text-3xl font-semibold"
          >
            {message}
          </h1>
          <p className="mt-4 max-w-prose text-muted-foreground">
            Your stored data has not been replaced. Check browser storage
            availability or keep a copy of the stored value before trying
            recovery.
          </p>
        </section>
      </main>
    )
  }

  const { data } = loadResult
  const today = getLocalDateString()
  const todayRecord = data.dailyRecords.find((record) => record.date === today)
  const selectedRoutine = data.routines.find(
    (routine) => routine.id === selectedRoutineId,
  )

  function saveProgress(routineId: string, progress: RoutineProgress) {
    const updatedData = updateRoutineProgress(data, today, routineId, progress)
    const result = saveData(updatedData)

    if (result.status === "saved") {
      setSaveMessage("")
      return
    }

    setSaveMessage("Progress could not be saved. Check browser storage.")
  }

  function beginRoutine(routineId: string) {
    const previousProgress = todayRecord?.routines[routineId]
    const progress =
      previousProgress?.status === "in-progress"
        ? previousProgress
        : {
          status: "in-progress" as const,
          currentExerciseIndex: 0,
          completedExerciseIds: [],
        }

    saveProgress(routineId, progress)
    setSelectedRoutineId(routineId)
  }

  if (selectedRoutine) {
    const routineExercises = selectedRoutine.exerciseIds.flatMap((id) => {
      const exercise = data.exerciseLibrary.find((item) => item.id === id)
      return exercise ? [exercise] : []
    })
    const progress = todayRecord?.routines[selectedRoutine.id] ?? {
      status: "in-progress" as const,
      currentExerciseIndex: 0,
      completedExerciseIds: [],
    }
    const completedCount = progress.completedExerciseIds.length
    const progressPercent = routineExercises.length
      ? Math.round((completedCount / routineExercises.length) * 100)
      : 0

    function returnToRoutines() {
      setSelectedRoutineId(null)
    }

    if (progress.status === "completed") {
      return (
        <main className="mx-auto min-h-svh max-w-3xl px-5 py-8 sm:px-8">
          <Button variant="ghost" onClick={returnToRoutines}>
            <ArrowLeft aria-hidden="true" />
            Routines
          </Button>
          <section className="mt-12 max-w-xl">
            <p className="font-heading text-sm font-semibold text-primary">
              {selectedRoutine.name}
            </p>
            <h1 className="mt-3 font-heading text-3xl font-semibold">
              Routine complete
            </h1>
            <p className="mt-3 text-muted-foreground">
              {completedCount} of {routineExercises.length} exercises completed
              today.
            </p>
            <Button className="mt-7" onClick={returnToRoutines}>
              Return to routines
            </Button>
          </section>
        </main>
      )
    }

    const exercise = routineExercises[progress.currentExerciseIndex]

    if (!exercise) {
      return (
        <main className="mx-auto min-h-svh max-w-3xl px-5 py-8 sm:px-8">
          <Button variant="ghost" onClick={returnToRoutines}>
            <ArrowLeft aria-hidden="true" />
            Routines
          </Button>
          <p className="mt-8 text-muted-foreground">
            This routine has no exercise at the saved position.
          </p>
        </main>
      )
    }

    const isLastExercise =
      progress.currentExerciseIndex === routineExercises.length - 1

    function changeExercise(nextIndex: number) {
      saveProgress(selectedRoutine.id, {
        ...progress,
        status: "in-progress",
        currentExerciseIndex: nextIndex,
      })
    }

    function completeExercise() {
      const completedExerciseIds = progress.completedExerciseIds.includes(
        exercise.id,
      )
        ? progress.completedExerciseIds
        : [...progress.completedExerciseIds, exercise.id]

      saveProgress(selectedRoutine.id, {
        status: isLastExercise ? "completed" : "in-progress",
        currentExerciseIndex: isLastExercise
          ? routineExercises.length
          : progress.currentExerciseIndex + 1,
        completedExerciseIds,
      })
    }

    return (
      <main className="mx-auto min-h-svh max-w-3xl px-5 py-8 sm:px-8">
        <Button variant="ghost" onClick={returnToRoutines}>
          <ArrowLeft aria-hidden="true" />
          Routines
        </Button>

        <header className="mt-7">
          <p className="font-heading text-sm font-semibold text-primary">
            {selectedRoutine.name}
          </p>
          <div className="mt-3 flex items-end justify-between gap-4">
            <h1 className="font-heading text-2xl font-semibold">
              Exercise {progress.currentExerciseIndex + 1}
            </h1>
            <p className="shrink-0 text-sm text-muted-foreground">
              {completedCount} / {routineExercises.length} complete
            </p>
          </div>
          <div
            className="mt-3 h-2 overflow-hidden rounded-full bg-muted"
            role="progressbar"
            aria-label="Routine progress"
            aria-valuemin={0}
            aria-valuemax={routineExercises.length}
            aria-valuenow={completedCount}
          >
            <div
              className="h-full bg-primary transition-[width]"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </header>

        <article className="mt-8 border-y border-border py-7">
          <p className="text-sm text-muted-foreground">
            Suggested duration: {exercise.durationSeconds} seconds
          </p>
          <h2 className="mt-2 font-heading text-3xl font-semibold">
            {exercise.name}
          </h2>
          <p className="mt-5 leading-relaxed">{exercise.instructions}</p>

          <dl className="mt-7 grid gap-5 sm:grid-cols-2">
            <div>
              <dt className="font-semibold">Purpose</dt>
              <dd className="mt-1 text-sm text-muted-foreground">
                {exercise.purpose}
              </dd>
            </div>
            <div>
              <dt className="font-semibold">Muscles involved</dt>
              <dd className="mt-1 text-sm text-muted-foreground">
                {exercise.muscles.join(", ")}
              </dd>
            </div>
            <div>
              <dt className="font-semibold">Relevant work activities</dt>
              <dd className="mt-1 text-sm text-muted-foreground">
                {exercise.workActivities.join(", ")}
              </dd>
            </div>
            {exercise.safetyNotes && (
              <div>
                <dt className="font-semibold">Safety</dt>
                <dd className="mt-1 text-sm text-muted-foreground">
                  {exercise.safetyNotes}
                </dd>
              </div>
            )}
          </dl>
        </article>

        {saveMessage && (
          <p className="mt-4 text-sm text-destructive" role="status">
            {saveMessage}
          </p>
        )}

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-between">
          <Button
            variant="outline"
            disabled={progress.currentExerciseIndex === 0}
            onClick={() =>
              changeExercise(progress.currentExerciseIndex - 1)
            }
          >
            <ArrowLeft aria-hidden="true" />
            Previous
          </Button>
          <div className="flex flex-col gap-3 sm:flex-row">
            {!isLastExercise && (
              <Button
                variant="outline"
                onClick={() =>
                  changeExercise(progress.currentExerciseIndex + 1)
                }
              >
                Next
                <ArrowRight aria-hidden="true" />
              </Button>
            )}
            <Button onClick={completeExercise}>
              <Check aria-hidden="true" />
              {isLastExercise ? "Finish routine" : "Mark complete"}
            </Button>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="mx-auto min-h-svh max-w-3xl px-5 py-8 sm:px-8">
      <header className="border-b border-border pb-7">
        <p className="font-heading text-sm font-semibold tracking-wide text-primary">
          STRETCH ROUTINE
        </p>
        <h1 className="mt-3 font-heading text-3xl font-semibold">
          Daily movement
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">{today}</p>
      </header>

      <section aria-labelledby="routine-list-title" className="pt-7">
        <h2
          id="routine-list-title"
          className="font-heading text-xl font-semibold"
        >
          Routines
        </h2>

        <div className="mt-2 divide-y divide-border">
          {data.routines.map((routine) => {
            const Icon = STAGE_ICONS[routine.stage]
            const progress = todayRecord?.routines[routine.id]
            const buttonLabel =
              progress?.status === "completed"
                ? "Start again"
                : progress?.status === "in-progress"
                  ? "Resume"
                  : "Start routine"

            return (
              <article
                key={routine.id}
                className="flex flex-col gap-4 py-6 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex min-w-0 items-start gap-4">
                  <span className="mt-1 flex size-10 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                    <Icon aria-hidden="true" className="size-5" />
                  </span>
                  <div className="min-w-0">
                    <h3 className="font-heading text-lg font-semibold">
                      {routine.name}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {routine.exerciseIds.length} exercises
                      <span aria-hidden="true"> · </span>
                      {getStatusLabel(progress?.status)}
                    </p>
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto"
                  onClick={() => beginRoutine(routine.id)}
                >
                  {buttonLabel}
                  <ArrowRight aria-hidden="true" />
                </Button>
              </article>
            )
          })}
        </div>
        {saveMessage && (
          <p className="mt-4 text-sm text-destructive" role="status">
            {saveMessage}
          </p>
        )}
      </section>
    </main>
  )
}

export default App
