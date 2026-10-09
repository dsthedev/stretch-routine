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
import { Button } from "@/components/ui/button"
import { getLocalDateString } from "@/lib/dates"
import { updateRoutineProgress } from "@/lib/routine-progress"
import type { RoutineProgress, RoutineStage } from "@/types"

const STAGE_ICONS: Record<RoutineStage, LucideIcon> = {
  "morning-prep": Sunrise,
  "workday-mobility": BriefcaseBusiness,
  "evening-recovery": Moon,
}

export function App() {
  const { loadResult, saveData } = useAppData()
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
  const totalExerciseCount = data.routines.reduce(
    (total, routine) => total + routine.exerciseIds.length,
    0,
  )
  const completedExerciseCount = data.routines.reduce(
    (total, routine) =>
      total + (todayRecord?.routines[routine.id]?.completedExerciseIds.length ?? 0),
    0,
  )
  const currentRoutine = data.routines.find(
    (routine) => todayRecord?.routines[routine.id]?.status !== "completed",
  )

  if (!currentRoutine) {
    return (
      <main className="mx-auto min-h-svh max-w-3xl px-5 py-8 sm:px-8">
        <header className="border-b border-border pb-7">
          <p className="font-heading text-sm font-semibold tracking-wide text-primary">
            STRETCH ROUTINE
          </p>
          <p className="mt-2 text-sm text-muted-foreground">{today}</p>
        </header>
        <section className="mt-12 max-w-xl">
          <h1 className="font-heading text-3xl font-semibold">
            Today’s routines are complete
          </h1>
          <p className="mt-3 text-muted-foreground">
            {completedExerciseCount} of {totalExerciseCount} exercises completed.
          </p>
        </section>
      </main>
    )
  }

  const activeRoutineId = currentRoutine.id
  const routineExercises = currentRoutine.exerciseIds.flatMap((id) => {
    const exercise = data.exerciseLibrary.find((item) => item.id === id)
    return exercise ? [exercise] : []
  })
  const activeProgress = todayRecord?.routines[activeRoutineId] ?? {
    status: "not-started" as const,
    currentExerciseIndex: 0,
    completedExerciseIds: [],
  }
  const firstIncompleteIndex = routineExercises.findIndex(
    (exercise) => !activeProgress.completedExerciseIds.includes(exercise.id),
  )
  const currentExerciseIndex =
    activeProgress.status === "in-progress"
      ? activeProgress.currentExerciseIndex < routineExercises.length
        ? activeProgress.currentExerciseIndex
        : Math.max(firstIncompleteIndex, 0)
      : 0
  const exercise = routineExercises[currentExerciseIndex]
  const completedInRoutine = activeProgress.completedExerciseIds.length
  const routineProgressPercent = routineExercises.length
    ? Math.round((completedInRoutine / routineExercises.length) * 100)
    : 0
  const dailyProgressPercent = totalExerciseCount
    ? Math.round((completedExerciseCount / totalExerciseCount) * 100)
    : 0
  const StageIcon = STAGE_ICONS[currentRoutine.stage]
  const isRoutineStarted = activeProgress.status === "in-progress"
  const isLastExercise = currentExerciseIndex === routineExercises.length - 1

  function saveProgress(progress: RoutineProgress) {
    const updatedData = updateRoutineProgress(
      data,
      today,
      activeRoutineId,
      progress,
    )
    const result = saveData(updatedData)

    if (result.status === "saved") {
      setSaveMessage("")
      return
    }

    setSaveMessage("Progress could not be saved. Check browser storage.")
  }

  function startRoutine() {
    saveProgress({
      ...activeProgress,
      status: "in-progress",
      currentExerciseIndex,
    })
  }

  function changeExercise(nextIndex: number) {
    saveProgress({
      ...activeProgress,
      status: "in-progress",
      currentExerciseIndex: nextIndex,
    })
  }

  function completeExercise() {
    if (!exercise) {
      return
    }

    const completedExerciseIds = activeProgress.completedExerciseIds.includes(
      exercise.id,
    )
      ? activeProgress.completedExerciseIds
      : [...activeProgress.completedExerciseIds, exercise.id]
    const allExercisesComplete = routineExercises.every((item) =>
      completedExerciseIds.includes(item.id),
    )
    const nextIncompleteIndex = routineExercises.findIndex(
      (item) => !completedExerciseIds.includes(item.id),
    )

    saveProgress({
      status: allExercisesComplete ? "completed" : "in-progress",
      currentExerciseIndex: allExercisesComplete
        ? routineExercises.length
        : isLastExercise
          ? nextIncompleteIndex
          : currentExerciseIndex + 1,
      completedExerciseIds,
    })
  }

  if (!exercise) {
    return (
      <main className="mx-auto min-h-svh max-w-3xl px-5 py-8 sm:px-8">
        <p className="font-heading text-sm font-semibold text-primary">
          {currentRoutine.name}
        </p>
        <h1 className="mt-3 font-heading text-2xl font-semibold">
          No exercises in this routine
        </h1>
      </main>
    )
  }

  return (
    <main className="mx-auto min-h-svh max-w-3xl px-5 py-8 sm:px-8">
      <header className="border-b border-border pb-6">
        <p className="font-heading text-sm font-semibold tracking-wide text-primary">
          STRETCH ROUTINE <span aria-hidden="true">·</span> {today}
        </p>
        <div className="mt-5 flex items-center gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
            <StageIcon aria-hidden="true" className="size-5" />
          </span>
          <div>
            <p className="text-sm text-muted-foreground">
              {currentRoutine.name}
            </p>
            <h1 className="font-heading text-2xl font-semibold">
              Exercise {currentExerciseIndex + 1} of {routineExercises.length}
            </h1>
          </div>
        </div>
        <div className="mt-5 flex items-center justify-between gap-4 text-sm text-muted-foreground">
          <span>Today</span>
          <span>
            {completedExerciseCount} of {totalExerciseCount} exercises complete
          </span>
        </div>
        <div
          className="mt-2 h-2 overflow-hidden rounded-full bg-muted"
          role="progressbar"
          aria-label="Daily routine progress"
          aria-valuemin={0}
          aria-valuemax={totalExerciseCount}
          aria-valuenow={completedExerciseCount}
        >
          <div
            className="h-full bg-primary transition-[width]"
            style={{ width: `${dailyProgressPercent}%` }}
          />
        </div>
      </header>

      <article className="mt-8 border-y border-border py-7">
        <div className="flex items-center justify-between gap-4">
          <p className="font-heading font-semibold">{currentRoutine.name}</p>
          <p className="shrink-0 text-sm text-muted-foreground">
            {completedInRoutine} of {routineExercises.length} complete
          </p>
        </div>
        <div
          className="mt-3 h-2 overflow-hidden rounded-full bg-muted"
          role="progressbar"
          aria-label={`${currentRoutine.name} progress`}
          aria-valuemin={0}
          aria-valuemax={routineExercises.length}
          aria-valuenow={completedInRoutine}
        >
          <div
            className="h-full bg-primary transition-[width]"
            style={{ width: `${routineProgressPercent}%` }}
          />
        </div>

        <p className="mt-6 text-sm text-muted-foreground">
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

      {!isRoutineStarted ? (
        <Button className="mt-6 w-full sm:w-auto" onClick={startRoutine}>
          Start {currentRoutine.name}
          <ArrowRight aria-hidden="true" />
        </Button>
      ) : (
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-between">
          <Button
            variant="outline"
            disabled={currentExerciseIndex === 0}
            onClick={() => changeExercise(currentExerciseIndex - 1)}
          >
            <ArrowLeft aria-hidden="true" />
            Previous
          </Button>
          <div className="flex flex-col gap-3 sm:flex-row">
            {!isLastExercise && (
              <Button
                variant="outline"
                onClick={() => changeExercise(currentExerciseIndex + 1)}
              >
                Next
                <ArrowRight aria-hidden="true" />
              </Button>
            )}
            <Button onClick={completeExercise}>
              <Check aria-hidden="true" />
              Mark complete
            </Button>
          </div>
        </div>
      )}
    </main>
  )


}

export default App
