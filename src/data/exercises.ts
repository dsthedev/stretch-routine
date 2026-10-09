import type { Exercise } from "@/types"

export const exercises: Exercise[] = [
    {
        id: "neck-lateral-flexion",
        name: "Neck lateral flexion",
        category: "neck",
        instructions:
            "Sit or stand tall. Slowly tilt one ear toward the same-side shoulder without raising the shoulder. Hold, return to center, and repeat on the other side.",
        durationSeconds: 40,
        purpose:
            "Gently move the side of the neck after periods of looking down or to the side.",
        muscles: ["Upper trapezius", "Scalenes"],
        workActivities: ["Looking down while installing flooring", "Checking work at low levels"],
        safetyNotes: "Do not pull on your head. Stop if you feel pain, numbness, or tingling.",
    },
    {
        id: "levator-scapulae-stretch",
        name: "Levator scapulae stretch",
        category: "neck",
        instructions:
            "Sit or stand tall. Turn your head slightly to one side, then look down toward that armpit. Hold gently, return to center, and repeat on the other side.",
        durationSeconds: 40,
        purpose:
            "Gently stretch the back and side of the neck after sustained downward head positions.",
        muscles: ["Levator scapulae", "Upper trapezius"],
        workActivities: ["Looking down while measuring or cutting", "Working close to the floor"],
        safetyNotes: "Keep the movement comfortable. Stop if you feel pain, numbness, or tingling.",
    },
    {
        id: "shoulder-rolls",
        name: "Shoulder rolls",
        category: "shoulders",
        instructions:
            "Stand or sit comfortably. Slowly roll both shoulders forward several times, then reverse and roll them backward.",
        durationSeconds: 30,
        purpose: "Move the shoulders through a comfortable range of motion.",
        muscles: ["Deltoids", "Trapezius"],
        workActivities: ["Carrying flooring materials", "Repeated reaching"],
        safetyNotes: "Use a comfortable range. Stop if you feel pain, numbness, or tingling.",
    },
    {
        id: "doorway-chest-stretch",
        name: "Doorway chest stretch",
        category: "chest",
        instructions:
            "Stand in a doorway with one forearm resting against the frame and your elbow near shoulder height. Step forward gently until you feel a mild stretch across the chest. Repeat with the other arm.",
        durationSeconds: 40,
        purpose:
            "Gently stretch the front of the chest after periods of forward reaching.",
        muscles: ["Pectorals", "Front deltoids"],
        workActivities: ["Forward reaching", "Carrying materials close to the body"],
        safetyNotes: "Keep the stretch mild and shoulders relaxed. Stop if you feel pain, numbness, or tingling.",
    },
    {
        id: "cross-body-shoulder-stretch",
        name: "Cross-body shoulder stretch",
        category: "shoulders",
        instructions:
            "Bring one arm across your chest. Use the other hand to support it above the elbow and draw it gently closer. Hold, then switch sides.",
        durationSeconds: 40,
        purpose: "Gently stretch the back of the shoulder.",
        muscles: ["Rear deltoids", "Rotator cuff"],
        workActivities: ["Repeated reaching", "Handling tools and materials"],
        safetyNotes: "Do not press directly on the elbow. Stop if you feel pain, numbness, or tingling.",
    },
    {
        id: "standing-thoracic-extension",
        name: "Standing thoracic extension",
        category: "upper-back",
        instructions:
            "Stand with your feet comfortably apart and place your hands on your hips. Gently lift your chest and extend your upper back while keeping your lower back relaxed. Return to standing tall.",
        durationSeconds: 30,
        purpose: "Gently move the upper back after sustained forward bending.",
        muscles: ["Thoracic extensors", "Rhomboids"],
        workActivities: ["Working bent over", "Installing flooring at ground level"],
        safetyNotes: "Keep the movement small and comfortable. Stop if you feel pain, numbness, or tingling.",
    },
]