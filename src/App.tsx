import { Button } from "@/components/ui/button"
import { useState } from "react"
import {
  ArrowLeft,
  ArrowRight,
  BriefcaseBusiness,
  Moon,
  Sunrise,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

import { useAppData } from "@/components/app-data-provider"
import { getLocalDateString } from "@/lib/dates"
import type { RoutineCompletionStatus, RoutineStage } from "@/types"

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
  const { loadResult } = useAppData()
  const [selectedRoutineId, setSelectedRoutineId] = useState<string | null>(
    null,
  )

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
            Your stored data has not been replaced. Reload after checking
            browser storage availability, or keep a copy of the stored value
            before trying recovery.
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

  if (selectedRoutine) {
    const routineExercises = selectedRoutine.exerciseIds.flatMap((id) => {
      const exercise = data.exerciseLibrary.find((item) => item.id === id)
      return exercise ? [exercise] : []
    })

    return (
      <main className="mx-auto min-h-svh max-w-3xl px-5 py-8 sm:px-8">
        <Button
          variant="ghost"
          onClick={() => setSelectedRoutineId(null)}
          aria-label="Back to routines"
        >
          <ArrowLeft aria-hidden="true" />
          Routines
        </Button>

        <header className="mt-8 border-b border-border pb-6">
          <p className="font-heading text-sm font-semibold text-primary">
            {selectedRoutine.stage.replaceAll("-", " ").toUpperCase()}
          </p>
          <h1 className="mt-2 font-heading text-3xl font-semibold">
            {selectedRoutine.name}
          </h1>
          <p className="mt-2 text-muted-foreground">
            {routineExercises.length} exercises
          </p>
        </header>

        <ol className="divide-y divide-border">
          {routineExercises.map((exercise, index) => (
            <li
              key={exercise.id}
              className="flex items-start justify-between gap-4 py-5"
            >
              <div className="flex gap-4">
                <span className="font-heading text-sm text-muted-foreground">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <h2 className="font-medium">{exercise.name}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {exercise.durationSeconds} seconds
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ol>
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
                  onClick={() => setSelectedRoutineId(routine.id)}
                >
                  View exercises
                  <ArrowRight aria-hidden="true" />
                </Button>
              </article>
            )
          })}
        </div>
      </section>
    </main>
  )
}

export default App
