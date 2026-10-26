import GuruPage from "@/components/GuruPage";
import ComparisonSection from "@/components/ComparisonSection";

export default function CalmGuru() {
  return (
    <GuruPage
      guruName="Calm Guru"
      guruTitle={<>Your Guide to Quiet Moments<br />(The Cat)</>}
      heroImage="/images/UOZELxgaoZBIBJSe.jpg"

      avatarImage="/images/GjrsMwPTDhrCwQjg.jpg"
      problemHeadline="When Every Alert Wants an Answer, Protect a Quiet Minute"
      problemDescription="A full inbox, family requests, and constant noise can make every minute feel claimed. Calm Guru helps you step back, protect a quiet pause, and choose what needs you now."
      challenges={[
        "Noise, screens, or conversations leave you feeling crowded.",
        "You agree to one more request when your schedule is already full.",
        "Social plans drain the energy you hoped to use for yourself.",
        "You want time alone but feel guilty taking it.",
        "You move quickly all day and cannot find a real pause.",
        "Saying no feels harder than rearranging your own plans.",
        "You keep responding before you have time to think.",
        "Even a quiet room does not feel like a break from the day.",
        "Interruptions make it hard to finish one simple task.",
        "You feel irritated by requests you would usually handle with ease.",
        "Your time and attention seem available to everyone except you."
      ]}
      empathyStatement="When requests keep arriving, even a small pause can feel hard to protect. Wanting a quiet corner does not make you difficult. It can give you the space to decide what you can take on."
      authorityStatement="Calm Guru is an AI wellness persona in the StressGuru app, with a cat point of view. It offers brief prompts to help you pause, reduce the rush, and set a boundary around your time. It is a wellness guide, not a healthcare provider or crisis service."
      planSteps={[
        {
          title: "Notice",
          description: "Start a session when the noise, pace, or requests begin to feel like too much, and name what is pulling at you."
        },
        {
          title: "Step back",
          description: "Use a short guided pause to create a little distance between the demand and your response."
        },
        {
          title: "Protect",
          description: "Choose one boundary, such as a quieter transition, a delayed reply, or a clear no, that fits the moment."
        }
      ]}
      successOutcomes={[
        "Take a quiet pause before the next request arrives.",
        "Choose one boundary that protects your time.",
        "Respond to interruptions with more intention.",
        "Make room to finish one task without constant switching.",
        "Keep a small part of your evening for yourself.",
        "Decide what can wait without turning every request into an emergency."
      ]}
      failureOutcomes={[
        "When every request gets an immediate yes, your own plans can disappear from the day.",
        "Constant switching can leave even simple tasks unfinished.",
        "A crowded schedule can make a quiet moment feel out of reach.",
        "Irritation can build when there is no space between one demand and the next.",
        "The people around you may get a rushed answer when you needed time to think.",
        "Your evening can end without a single moment that was protected for you."
      ]}
    >
      <ComparisonSection 
        guruName="Calm Guru"
        items={[
          {
            without: "Answering every alert as if it needs you right now.",
            with: "**Choosing what deserves a response** before you react."
          },
          {
            without: "Agreeing to another request when your schedule is already full.",
            with: "**Using a clear boundary** that respects the time you have."
          },
          {
            without: "Moving through the day without a moment to reset.",
            with: "**Protecting a quiet pause** between one role and the next."
          },
          {
            without: "Letting interruptions decide how you spend your attention.",
            with: "**Returning to one task** with a little more space around it."
          },
          {
            without: "Saving your own needs for after everyone else is settled.",
            with: "**Keeping a small part of the day** for yourself."
          },
          {
            without: "Bringing the rush of the day into every room at home.",
            with: "**Creating a quieter transition** before you move on."
          }
        ]}
      />
    </GuruPage>
  );
}
