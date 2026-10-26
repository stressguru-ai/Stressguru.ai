import GuruPage from "@/components/GuruPage";

export default function SpiritualGuru() {
  return (
    <GuruPage
      guruName="Spiritual Guru"
      guruTitle="Your Guide for Reflection (The Turtle)"
      heroImage="/images/oyHVHoAzUuRseQEe.jpg"

      avatarImage="/images/itZXkUHXnEimtTTz.png"
      problemHeadline="When a Full Life Still Feels Off, Ask What Matters"
      problemDescription="You can meet deadlines, care for others, and keep the household moving yet still lose sight of what you want. Spiritual Guru offers quiet prompts to reflect on your values, purpose, and next choice."
      challenges={[
        "Your roles at work and home leave little time to ask what you want.",
        "You keep moving through the week without a moment to reflect.",
        "A major decision feels hard because several important values are pulling at once.",
        "You miss having a practice that helps you slow down and listen to yourself.",
        "The life you are managing does not always feel connected to what matters most to you."
      ]}
      empathyStatement="When your roles fill every inch of the week, reflection can feel like one more item to schedule. A few quiet minutes can help you reconnect with the values you want your choices to reflect."
      authorityStatement="Spiritual Guru is an AI wellness persona in the StressGuru app, with a turtle point of view. It offers prompts for reflection and stillness. It does not claim spiritual authority, tell you what to believe, or replace support from people and communities you trust."
      planSteps={[
        {
          title: "Pause",
          description: "Set aside a short moment away from the next task, so you can notice what has been asking for your attention."
        },
        {
          title: "Reflect",
          description: "Use a prompt to consider the values, questions, or hopes that are shaping the choice in front of you."
        },
        {
          title: "Choose",
          description: "Take one small next step that feels more connected to what matters to you, without needing to solve your whole future today."
        }
      ]}
      successOutcomes={[
        "Make a little room for reflection in a crowded week.",
        "Name the values that matter in the decision in front of you.",
        "Move through a change with a clearer sense of what you want to protect.",
        "Choose one next step that fits your priorities.",
        "Spend less time rushing past questions that deserve attention.",
        "Return to the present moment before you decide what comes next."
      ]}
      failureOutcomes={[
        "When every decision is made in a rush, what matters most can get less attention.",
        "A full schedule can leave little room to notice whether your choices still fit your values.",
        "Important questions can keep getting postponed for a quieter day.",
        "Major changes may feel harder to sort through without time to reflect.",
        "Your own priorities can stay unspoken while you meet everyone else's needs.",
        "The next task can keep setting the direction when you wanted to choose it yourself."
      ]}
    />
  );
}
