import GuruPage from "@/components/GuruPage";
import ComparisonSection from "@/components/ComparisonSection";

export default function SleepGuru() {
  return (
    <GuruPage
      guruName="Sleep Guru"
      guruTitle="Your Guide for a Calmer Wind-Down"
      heroImage="/images/sAlmVdkOmkUzIASt.jpg"

      avatarImage="/images/sDSBaqlRTTJBzglV.png"
      problemHeadline="Protect Tonight's Rest Before Tomorrow Gets Here"
      problemDescription="When late emails and a full mental list follow you to bed, the next day starts before you are ready. Sleep Guru helps you build a calmer wind-down and make a more intentional bedtime choice."
      challenges={[
        "You feel tired at 9 PM but still alert once you get into bed.",
        "At 2 AM, you check the clock and start doing math about tomorrow.",
        "A conversation from the day keeps replaying when the room gets quiet.",
        "You keep your phone close because there might be one more thing to handle.",
        "You wake up wishing you had more time before the day begins.",
        "Your schedule changes so often that bedtime has no clear rhythm.",
        "You dread getting into bed because your mind gets busier there.",
        "A rough night makes patience and focus feel harder the next day.",
        "You find yourself looking for a way to switch off instead of a routine that feels workable.",
        "You cannot tell where the workday ends and your wind-down begins.",
        "Worry about tomorrow keeps taking up the quiet you wanted for rest."
      ]}
      empathyStatement="A busy day can keep asking for your attention after the lights are off. When bedtime becomes another place to solve problems, rest gets pushed aside. A simple wind-down can give the day a clearer ending."
      authorityStatement="Sleep Guru is an AI wellness persona in the StressGuru iPhone and Apple Watch app. It offers prompts for a calmer wind-down and a short pause before bed. If you use an Apple Watch, its signals provide context only. They do not diagnose or prove a sleep issue. StressGuru is a wellness app, not healthcare or crisis care."
      planSteps={[
        {
          title: "Notice",
          description: "Start with a check-in about what your evening feels like. You can use your own notes or Apple Watch context to spot patterns worth paying attention to."
        },
        {
          title: "Wind down",
          description: "Choose a short guided practice that helps you step away from the day's mental list and make space for a quieter transition."
        },
        {
          title: "Set up tomorrow",
          description: "Leave your session with one small choice for the next evening, so bedtime feels less like a second shift."
        }
      ]}
      successOutcomes={[
        "Make your bedroom feel less like an extension of the workday.",
        "Set aside a few minutes to transition before bed.",
        "Give tomorrow's tasks a place other than your pillow.",
        "Notice the routines that make a calmer evening more possible.",
        "Bring more patience and attention into the next day.",
        "Choose a bedtime rhythm that fits your real schedule."
      ]}
      failureOutcomes={[
        "When every late-night thought gets attention, bed can start to feel like another place to work.",
        "A rushed evening can leave little time to shift out of work or caregiving mode.",
        "Checking the clock can pull you further into tomorrow's pressure.",
        "The routines that support rest can keep getting replaced by one more task.",
        "A tired morning can make the day's first decisions feel heavier.",
        "Your evening may keep ending without a moment that is truly yours."
      ]}
    >
      <ComparisonSection 
        guruName="Sleep Guru"
        items={[
          {
            without: "Opening your laptop one more time after you have already changed for bed.",
            with: "**Creating a short wind-down** that marks the end of the workday."
          },
          {
            without: "Checking the clock and calculating how little time is left.",
            with: "**Returning to the present moment** with a simple bedtime prompt."
          },
          {
            without: "Bringing tomorrow's first meeting into bed with you.",
            with: "**Choosing one place to park the plan** before you turn in."
          },
          {
            without: "Reaching for more stimulation when you want to settle down.",
            with: "**Using a quieter cue** to begin your evening routine."
          },
          {
            without: "Starting the day already frustrated by the night before.",
            with: "**Giving yourself a gentler start** to the next morning."
          },
          {
            without: "Treating bedtime as another item to get through.",
            with: "**Making room for a pause** before the day begins again."
          }
        ]}
      />
    </GuruPage>
  );
}
