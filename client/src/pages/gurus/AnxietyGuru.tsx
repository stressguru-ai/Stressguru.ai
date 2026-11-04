import GuruPage from "@/components/GuruPage";
import ComparisonSection from "@/components/ComparisonSection";

export default function AnxietyGuru() {
  return (
    <GuruPage
      guruName="Anxiety Guru"
      guruTitle="Your Guide for Worry-Filled Moments"
      heroImage="/images/cbBkKzHOhCgwDsEl.jpg"

      avatarImage="/images/RjEvlDvMOtWTRzEq.png"
      problemHeadline="When Worry Takes Up the Whole Day, Make Room to Think"
      problemDescription="A single meeting, message, or decision can keep replaying long after it is over. Anxiety Guru gives you a grounding pause so you can return to the next thing you can actually do."
      challenges={[
        "You replay a meeting response on the way home.",
        "One decision stays open because you can picture too many outcomes.",
        "A calendar invite makes your thoughts race ahead.",
        "You delay a reply because you want to get every word exactly right.",
        "You rehearse a conversation so often that the rest of your work waits.",
        "Quiet time turns into a review of everything that could go wrong.",
        "You feel pulled away from the person or task in front of you.",
        "A minor change to the plan takes up more attention than you want it to.",
        "You want to make a choice but keep returning to the same question.",
        "Your mind stays busy even after the urgent part of the day has passed.",
        "You need a way to pause before worry shapes the next decision."
      ]}
      empathyStatement="When worry keeps revisiting a decision, it can steal attention from work, rest, and the people in the room. A brief pause can help you return to the next thing you can actually do."
      authorityStatement="Anxiety Guru is an AI wellness persona in the StressGuru iPhone and Apple Watch app. It offers guided grounding prompts and short check-ins for worry-filled moments. Apple Watch signals provide context only. They do not diagnose, detect, prove, or predict anxiety or any condition. StressGuru is not crisis care."
      planSteps={[
        {
          title: "Name it",
          description: "Start with what is happening right now, such as a decision you keep replaying or a message you are avoiding."
        },
        {
          title: "Ground",
          description: "Use a short guided pause to bring your attention back from imagined outcomes to the moment in front of you."
        },
        {
          title: "Choose",
          description: "Pick one small next action you can take now, then let the larger question wait until you have more information."
        }
      ]}
      successOutcomes={[
        "Give one decision your full attention instead of revisiting it all day.",
        "Return to a meeting, message, or task with a clearer next step.",
        "Make room for a conversation without rehearsing every outcome.",
        "Use a grounding pause when your thoughts race ahead.",
        "Protect time with the people you care about from a lingering work worry.",
        "Let one unanswered question wait while you handle what is in your control."
      ]}
      failureOutcomes={[
        "When every possible outcome needs an answer, important tasks and conversations can wait longer than you intend.",
        "A small uncertainty can take up the attention you meant to give your evening.",
        "Replaying a decision can make it harder to notice the information you already have.",
        "A delayed reply can create more pressure around a conversation.",
        "Your mind may stay at work after the urgent part of the day has passed.",
        "The next workable step can get hidden by a long list of imagined ones."
      ]}
    >
      <ComparisonSection 
        guruName="Anxiety Guru"
        items={[
          {
            without: "Replaying one sentence from a meeting for the rest of the day.",
            with: "**Returning to the next useful action** after a short grounding pause."
          },
          {
            without: "Keeping a decision open because every outcome feels urgent.",
            with: "**Choosing what you can decide now** and letting the rest wait."
          },
          {
            without: "Writing and rewriting a message until you avoid sending it.",
            with: "**Finding clear words** that match what you need to say."
          },
          {
            without: "Letting one change of plan take over your attention.",
            with: "**Making space for the facts in front of you** before the next choice."
          },
          {
            without: "Bringing a worry loop into dinner or bedtime.",
            with: "**Creating a boundary around the thought** so you can be present."
          },
          {
            without: "Trying to solve every future problem before today is done.",
            with: "**Focusing on one manageable step** in the moment you have."
          }
        ]}
      />
    </GuruPage>
  );
}
