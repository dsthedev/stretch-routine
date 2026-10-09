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
    {
        id: "wrist-flexor-stretch",
        name: "Wrist flexor stretch",
        category: "wrists",
        instructions:
            "Extend one arm in front of you with the palm facing up. With the other hand, gently guide the fingers toward the floor. Hold, then switch sides.",
        durationSeconds: 30,
        purpose: "Gently stretch the inner forearm after repeated gripping.",
        muscles: ["Wrist flexors", "Forearm muscles"],
        workActivities: ["Gripping hand tools", "Handling flooring materials"],
        safetyNotes:
            "Use light pressure and keep the elbow comfortable. Stop if you feel pain, numbness, or tingling.",
    },
    {
        id: "wrist-extensor-stretch",
        name: "Wrist extensor stretch",
        category: "wrists",
        instructions:
            "Extend one arm in front of you with the palm facing down. With the other hand, gently guide the fingers toward the floor. Hold, then switch sides.",
        durationSeconds: 30,
        purpose: "Gently stretch the outer forearm after repeated wrist use.",
        muscles: ["Wrist extensors", "Forearm muscles"],
        workActivities: ["Using hand tools", "Repeated wrist movements"],
        safetyNotes:
            "Use light pressure and keep the elbow comfortable. Stop if you feel pain, numbness, or tingling.",
    },
    {
        id: "open-and-close-hand-movements",
        name: "Open-and-close hand movements",
        category: "hands",
        instructions:
            "Hold your hands in front of you. Slowly spread your fingers comfortably wide, then bring them together and make a loose fist. Repeat without squeezing.",
        durationSeconds: 30,
        purpose: "Move the fingers through a comfortable range after repeated gripping.",
        muscles: ["Finger flexors", "Finger extensors"],
        workActivities: ["Gripping tools", "Handling small materials"],
        safetyNotes:
            "Keep the movement gentle and do not force your fingers. Stop if you feel pain, numbness, or tingling.",
    },
    {
        id: "cat-cow",
        name: "Cat-Cow",
        category: "trunk",
        instructions:
            "Begin on your hands and knees, with hands under shoulders and knees under hips. Gently round your back, then return through neutral and lift your chest slightly. Move slowly between positions.",
        durationSeconds: 40,
        purpose: "Gently move the spine through flexion and extension.",
        muscles: ["Spinal extensors", "Abdominal muscles"],
        workActivities: ["Working bent over", "Changing floor-level positions"],
        safetyNotes:
            "Use a comfortable range and place padding under your knees if needed. Stop if you feel pain, numbness, or tingling.",
    },
    {
        id: "childs-pose-side-reach",
        name: "Child's Pose with Side Reach",
        category: "trunk",
        instructions:
            "Begin on your hands and knees, then gently move your hips back toward your heels. Walk both hands to one side until you feel a comfortable stretch along your side. Return to center and repeat on the other side.",
        durationSeconds: 40,
        purpose: "Gently stretch the sides of the trunk and upper back.",
        muscles: ["Latissimus dorsi", "Obliques", "Upper-back muscles"],
        workActivities: ["Repeated reaching", "Working in low positions"],
        safetyNotes:
            "Keep the movement comfortable; adjust your position if your knees or hips feel strained. Stop if you feel pain, numbness, or tingling.",
    },
    {
        id: "standing-side-bend",
        name: "Standing side bend",
        category: "trunk",
        instructions:
            "Stand with your feet comfortably apart. Reach one arm overhead and gently lean to the opposite side without twisting. Return to center and repeat on the other side.",
        durationSeconds: 30,
        purpose: "Gently move the sides of the trunk.",
        muscles: ["Obliques", "Latissimus dorsi"],
        workActivities: ["Reaching across a work area", "Carrying materials"],
        safetyNotes:
            "Keep both feet planted and avoid forcing the bend. Stop if you feel pain, numbness, or tingling.",
    },
]