import GuruPage from "@/components/GuruPage";
import ComparisonSection from "@/components/ComparisonSection";

export default function HappinessGuru() {
  return (
    <GuruPage
      guruName="Happiness Guru"
      guruTitle="Your Guide to More Play (The Dog)"
      heroImage="/images/zZcPWlwWYxNGpiqJ.jpg"

      avatarImage="/images/xSeUQcwBWbWGSnFH.jpg"
      problemHeadline="When Every Hour Is Spoken For, Save Some Room for Joy"
      problemDescription="If the day is meeting, errand, dinner, repeat, small moments you enjoy can disappear. Happiness Guru gives you prompts to notice one and make room for a little more play."
      challenges={[
        "Your days feel like the same cycle of work, errands, and tasks.",
        "You cannot remember the last time you laughed without checking the time.",
        "You feel guilty when you take a break for yourself.",
        "The next goal gets more attention than the moment you are in.",
        "You have less room for the playful side of yourself.",
        "A small inconvenience stays with you longer than you want it to.",
        "Responsibilities leave little time for the things that lift your mood.",
        "You have a hard time noticing what went well in an ordinary day.",
        "You move through the day without a moment that feels like yours.",
        "The people you care about get the leftover version of your attention.",
        "You miss the small pleasures that used to feel easy to enjoy."
      ]}
      empathyStatement="Busy seasons can shrink life to logistics. When every open minute goes to catching up, pleasure and connection are often the first things postponed. A small moment you enjoy still counts."
      authorityStatement="Happiness Guru is an AI wellness persona in the StressGuru app, with a playful dog point of view. It offers simple prompts for noticing, play, and connection when your day feels all responsibility. It is a wellness guide, not a healthcare provider or crisis service."
      planSteps={[
        {
          title: "Notice",
          description: "Use a short prompt to spot one small moment of comfort, humor, beauty, or ease that might otherwise pass by."
        },
        {
          title: "Play",
          description: "Choose a small action that brings a little lightness to the day, even if the rest of your schedule stays full."
        },
        {
          title: "Share",
          description: "Make room to send a kind note, invite someone into a simple plan, or tell them what made you smile."
        }
      ]}
      successOutcomes={[
        "Notice one good moment in an ordinary day.",
        "Make time for a short activity you enjoy.",
        "Bring a little more humor into a busy routine.",
        "Share a lighter moment with someone you care about.",
        "Let a small annoyance take up less of your evening.",
        "Remember that your own enjoyment belongs on the calendar too."
      ]}
      failureOutcomes={[
        "When every open minute is used to catch up, pleasure and connection can keep getting pushed later.",
        "A long list of obligations can make a whole week feel like one repeated task.",
        "Small good moments may pass by without your attention.",
        "The people closest to you can get less of your playful side.",
        "A minor irritation can become the story you tell yourself about the day.",
        "Your own enjoyment can stay off the calendar, even when you need a break."
      ]}
    >
      <ComparisonSection 
        guruName="Happiness Guru"
        items={[
          {
            without: "Moving from task to task without a moment that feels like yours.",
            with: "**Noticing one small pleasure** in the middle of a regular day."
          },
          {
            without: "Letting a minor irritation decide the mood of the evening.",
            with: "**Making room for a lighter moment** before the day is over."
          },
          {
            without: "Saving every enjoyable activity for a day that never comes.",
            with: "**Choosing a small bit of play** that fits the day you have."
          },
          {
            without: "Giving the people you care about only the leftover minutes.",
            with: "**Sharing a kind message or simple plan** with your people."
          },
          {
            without: "Treating a packed schedule as proof you cannot enjoy anything.",
            with: "**Finding one good thing** without waiting for the schedule to clear."
          },
          {
            without: "Forgetting what helps you feel a little more like yourself.",
            with: "**Keeping a small pleasure in view** while you handle the rest."
          }
        ]}
      />
    </GuruPage>
  );
}
