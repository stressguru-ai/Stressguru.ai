import GuruPage from "@/components/GuruPage";
import ComparisonSection from "@/components/ComparisonSection";

export default function StressGuru() {
  return (
    <GuruPage
      guruName="Stress Guru"
      guruTitle="Your Guide for Steadier Moments"
      heroImage="/images/VcxLCAagBZORQRuf.jpg"

      avatarImage="/images/ckfNdeCXRAEriBpm.png"
      problemHeadline="When Pressure Follows You Home, Take a Reset"
      problemDescription="A deadline can still feel loud while dinner is on the table. Stress Guru gives you a brief, guided pause so you can choose your next move with a clearer head."
      challenges={[
        "After a demanding meeting, you carry the tension into your next call.",
        "A small interruption gets a bigger reaction than you intended.",
        "Your to-do list keeps running while you try to fall asleep.",
        "You move from task to task without a real pause.",
        "You reread the same email because your focus has thinned.",
        "You reach for another coffee to push through an afternoon slump.",
        "Work tension shows up in a conversation with someone you care about.",
        "A full calendar leaves little room to decide what can wait.",
        "You finish the day tired but still keyed up.",
        "Every new request feels equally urgent.",
        "You want a pause before pressure takes over the rest of your evening.",
        "You miss having enough space to respond instead of react."
      ]}
      empathyStatement="A hard day can make every new request feel urgent. That pressure can cut into your focus, sleep, and patience. You deserve a practical way to pause before the next demand takes over."
      authorityStatement="Stress Guru is an AI wellness persona in the StressGuru iPhone and Apple Watch app. Start a session when pressure builds, and use an Apple Watch as added context if you choose. It offers a brief reset and prompts to help you steady your attention before the next task. Apple Watch signals provide context only. They do not diagnose or prove stress."
      planSteps={[
        {
          title: "Check in",
          description: "Start a session when a deadline, message, or crowded schedule raises the pressure. You can also choose to use Apple Watch context alongside your own check-in."
        },
        {
          title: "Reset",
          description: "Follow a short, guided pause that helps you step away from the rush and decide what needs your attention first."
        },
        {
          title: "Carry it forward",
          description: "Use what you notice to make one next choice that protects your focus, your evening, or the conversation in front of you."
        }
      ]}
      successOutcomes={[
        "Return to your next meeting with a clearer priority.",
        "Leave more room for a calmer bedtime after a full day.",
        "Pause before replying when your patience is thin.",
        "Work through one task at a time instead of carrying them all at once.",
        "Notice which demands are pulling at your attention.",
        "Protect an evening moment for the people and routines that matter to you."
      ]}
      failureOutcomes={[
        "When each demand gets the same urgency, work can spill into dinner and bedtime.",
        "A rushed reply can create more friction than you meant to bring into a relationship.",
        "Your calendar may keep setting the pace, even when your attention needs a break.",
        "Important tasks can take longer when you are switching between too many demands.",
        "The small pauses that help you regroup can keep getting postponed.",
        "You may end the day with little space left for your own needs."
      ]}
    >
      <ComparisonSection 
        guruName="Stress Guru"
        items={[
          {
            without: "Carrying one tense meeting into every conversation that follows.",
            with: "**Taking a brief pause** before you enter the next room or call."
          },
          {
            without: "Sending a sharp reply because you are already at capacity.",
            with: "**Choosing your response** after you have had a moment to regroup."
          },
          {
            without: "Keeping a crowded task list in your head at bedtime.",
            with: "**Naming one next step** and giving the rest permission to wait."
          },
          {
            without: "Treating every notification as a problem that needs an immediate answer.",
            with: "**Deciding what deserves your attention** before you react."
          },
          {
            without: "Finishing the day with no transition between work and home.",
            with: "**Creating a small buffer** before you move into the rest of your evening."
          },
          {
            without: "Letting a packed schedule make every choice for you.",
            with: "**Keeping one moment of control** over what comes next."
          }
        ]}
      />
    </GuruPage>
  );
}
