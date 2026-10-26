import GuruPage from "@/components/GuruPage";
import ComparisonSection from "@/components/ComparisonSection";

export default function MotivationGuru() {
  return (
    <GuruPage
      guruName="Motivation Guru"
      guruTitle="Your Guide for Small Next Steps"
      heroImage="/images/UpkHzaTosKNvBsyv.jpg"

      avatarImage="/images/dynzrWuhAjoaQmHN.png"
      problemHeadline="When the To-Do List Feels Heavy, Start Smaller"
      problemDescription="A packed calendar, caregiving, and a stale routine can drain the energy you hoped to use for yourself. Motivation Guru helps you choose a manageable next step when getting started feels hard."
      challenges={[
        "You open your task list and do not know where to begin.",
        "An activity you once enjoyed now feels easier to put off.",
        "You wake up already thinking about everything you did not finish yesterday.",
        "A small task feels bigger because your energy is already spoken for.",
        "You compare your pace with everyone else and feel behind."
      ]}
      empathyStatement="Some days, keeping work, home, and other people moving leaves little energy for your own list. That does not make you lazy. It means the next step needs to fit the day you actually have."
      authorityStatement="Motivation Guru is an AI wellness persona in the StressGuru iPhone and Apple Watch app. Start a session when a task feels stuck, then use its prompts to choose a smaller, more workable next action. If you use an Apple Watch, its signals provide context only. They do not detect or prove your mood."
      planSteps={[
        {
          title: "Check in",
          description: "Name the task, responsibility, or moment that feels hard to start, without turning it into a verdict about yourself."
        },
        {
          title: "Start small",
          description: "Use a short prompt to choose one action that fits your available time and energy, rather than trying to solve the whole list."
        },
        {
          title: "Keep going",
          description: "Return to the same focus when you need it, and build on the small actions that make your day feel more possible."
        }
      ]}
      successOutcomes={[
        "Choose one task that fits the energy you have today.",
        "Make a start before you feel fully ready.",
        "Create a little forward motion in a day that felt stuck.",
        "Make room for an activity you have been putting off.",
        "Use kinder, more useful language when you are behind.",
        "End the day with one clear thing you moved forward."
      ]}
      failureOutcomes={[
        "When every task has to be done at full speed, the list can keep feeling impossible.",
        "A day spent comparing your pace can leave less room to see what you did manage.",
        "The activities that restore you can keep getting pushed after every obligation.",
        "A delayed first step can make a small task feel larger by the end of the day.",
        "You may keep carrying yesterday's unfinished list into tomorrow.",
        "Your own priorities can stay at the bottom of a schedule built around everyone else."
      ]}
    >
      <ComparisonSection 
        guruName="Motivation Guru"
        items={[
          {
            without: "Opening a long list and deciding none of it is possible today.",
            with: "**Choosing one task** that fits the time and energy you have."
          },
          {
            without: "Waiting for a perfect burst of energy before you begin.",
            with: "**Taking a small first action** that creates momentum."
          },
          {
            without: "Treating an unfinished task as proof that you are behind.",
            with: "**Looking at the next workable step** without the extra judgment."
          },
          {
            without: "Giving every open minute to obligations.",
            with: "**Saving a little time** for something you want to do."
          },
          {
            without: "Letting a slow day decide how you speak to yourself.",
            with: "**Using a more useful inner script** as you move forward."
          },
          {
            without: "Ending the day unsure whether you made any progress.",
            with: "**Knowing the one thing you moved** before you close the day."
          }
        ]}
      />
    </GuruPage>
  );
}
