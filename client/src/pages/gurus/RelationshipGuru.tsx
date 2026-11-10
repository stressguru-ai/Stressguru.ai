import GuruPage from "@/components/GuruPage";
import ComparisonSection from "@/components/ComparisonSection";

export default function RelationshipGuru() {
  return (
    <GuruPage
      guruName="Relationship Guru"
      guruTitle="Your Guide for Hard Conversations"
      heroImage="/images/cbBkKzHOhCgwDsEl.jpg"

      avatarImage="/images/RiYvCLRiSOOKHHcr.png"
      problemHeadline="Before Small Friction Becomes the Whole Evening"
      problemDescription="A missed text, uneven chores, or a rushed handoff can follow you through the house. Relationship Guru helps you pause before replying and find words that better match what you mean."
      challenges={[
        "A quick question about plans turns into a longer argument than either of you expected.",
        "You keep having the same conversation about chores, time, or money.",
        "You are in the same room but each of you is carrying a different version of what happened.",
        "You hold back what you need because you do not want to start another conflict.",
        "A hard day at work changes the tone of a conversation at home."
      ]}
      empathyStatement="The conversations that matter most often happen when everyone is tired, rushed, or already carrying too much. A pause can help you say what you mean without adding more heat to the room."
      authorityStatement="Relationship Guru is an AI wellness persona in the StressGuru app. It offers prompts to help you pause, name what matters, and prepare for a hard conversation. It does not provide therapy, crisis care, or decide what relationship choice is right for you."
      planSteps={[
        {
          title: "Pause",
          description: "Start a session when a conversation feels loaded, so you can step back before you send the text or answer in the heat of the moment."
        },
        {
          title: "Put it in words",
          description: "Use a prompt to name what happened, what you need, and what you want the other person to understand."
        },
        {
          title: "Reconnect",
          description: "Choose one respectful next step, whether that is a clearer request, a better time to talk, or a moment to listen."
        }
      ]}
      successOutcomes={[
        "Start a hard conversation without adding more heat.",
        "Ask for what you need in clearer words.",
        "Notice when a workday is affecting the tone you bring home.",
        "Make room to hear the other person's point of view.",
        "Choose a better time for a conversation that deserves attention.",
        "Protect small moments of connection from the rush of daily logistics."
      ]}
      failureOutcomes={[
        "When the same issue is rushed or avoided, it can keep showing up in new forms.",
        "A sharp reply can take over an evening that started with a small disagreement.",
        "Unspoken needs can leave both people guessing.",
        "Work pressure can keep shaping conversations that have nothing to do with work.",
        "A difficult topic can get pushed aside until there is even less room for it.",
        "The small acts that help you feel like a team can get lost in daily logistics."
      ]}
    >
      <ComparisonSection 
        guruName="Relationship Guru"
        items={[
          {
            without: "Answering a loaded question while you are still upset.",
            with: "**Taking a pause first** and choosing the words you want to use."
          },
          {
            without: "Repeating the same fight about chores or time.",
            with: "**Making one clear request** instead of reliving the whole history."
          },
          {
            without: "Letting a rough workday set the tone at home.",
            with: "**Creating a small transition** before the conversation begins."
          },
          {
            without: "Holding back because the topic feels too hard to raise.",
            with: "**Naming what matters** in a respectful, direct way."
          },
          {
            without: "Talking past each other when both people feel unheard.",
            with: "**Making room to listen** before you decide what comes next."
          },
          {
            without: "Saving every hard topic for the end of an exhausting day.",
            with: "**Choosing a better moment** for a conversation that needs care."
          }
        ]}
      />
    </GuruPage>
  );
}
