import type { Routine } from "@/types"

export const routines: Routine[] = [
    {
        id: "routine-morning-prep",
        stage: "morning-prep",
        name: "Morning Prep",
        exerciseIds: [
            "neck-lateral-flexion",
            "shoulder-rolls",
            "standing-thoracic-extension",
            "wrist-flexor-stretch",
            "wrist-extensor-stretch",
            "half-kneeling-hip-flexor-stretch",
            "standing-quadriceps-stretch",
            "straight-knee-calf-stretch",
        ],
    },
    {
        id: "routine-workday-mobility",
        stage: "workday-mobility",
        name: "Workday Mobility",
        exerciseIds: [
            "shoulder-rolls",
            "standing-side-bend",
            "standing-thoracic-extension",
            "open-and-close-hand-movements",
            "wrist-flexor-stretch",
            "neck-lateral-flexion",
        ],
    },
    {
        id: "routine-evening-recovery",
        stage: "evening-recovery",
        name: "Evening Recovery",
        exerciseIds: [
            "cat-cow",
            "childs-pose-side-reach",
            "supine-figure-four-stretch",
            "butterfly-stretch",
            "supine-hamstring-stretch",
            "bent-knee-soleus-stretch",
            "plantar-fascia-toe-extension-stretch",
        ],
    },
]