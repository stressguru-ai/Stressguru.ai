// Script to seed the gurus table with initial data
// Run with: npx tsx server/seed-gurus.ts

import { createGuru, getAllGurus } from "./db";

const gurusData = [
  {
    slug: "stress-guru",
    name: "Stress Guru",
    role: "AI Wellness Persona for Stress Support",
    image: "/images/ckfNdeCXRAEriBpm.png",
    description: "AI-guided reflection and practical wellness exercises for everyday stress.",
    icpProblems: [
      "Feeling overwhelmed by work responsibilities and unable to disconnect",
      "Experiencing constant tension and anxiety about deadlines",
      "Struggling to balance career success with personal well-being",
      "Noticing physical symptoms like headaches and muscle tension from stress",
      "Feeling like you're always 'on' and can't relax even during downtime",
    ],
  },
  {
    slug: "sleep-guru",
    name: "Sleep Guru",
    role: "AI Wellness Persona for Sleep Support",
    image: "/images/sDSBaqlRTTJBzglV.png",
    description: "AI-guided evening reflection and wellness routines for a calmer transition to bed.",
    icpProblems: [
      "Waking up at 3 AM and unable to fall back asleep",
      "Feeling exhausted despite getting 8 hours in bed",
      "Racing thoughts keeping you awake at night",
      "Relying on sleep aids or alcohol to fall asleep",
      "Waking up feeling unrested and reaching for caffeine immediately",
    ],
  },
  {
    slug: "anxiety-guru",
    name: "Anxiety Guru",
    role: "AI Wellness Persona for Anxiety Support",
    image: "/images/RjEvlDvMOtWTRzEq.png",
    description: "AI-guided grounding and reflection for moments when everyday worry feels loud.",
    icpProblems: [
      "Experiencing sudden panic attacks in public or at work",
      "Constant worry about things that might go wrong",
      "Physical symptoms like racing heart and shortness of breath",
      "Avoiding social situations due to fear of judgment",
      "Feeling paralyzed by 'what if' thinking",
    ],
  },
  {
    slug: "motivation-guru",
    name: "Motivation Guru",
    role: "AI Wellness Persona for Motivation Support",
    image: "/images/dynzrWuhAjoaQmHN.png",
    description: "AI-guided prompts for choosing a smaller next action when motivation feels low.",
    icpProblems: [
      "Struggling to start or maintain healthy habits",
      "Feeling stuck in a rut with no motivation to change",
      "Procrastinating on important goals and projects",
      "Losing momentum after initial enthusiasm fades",
      "Feeling disconnected from your purpose and passion",
    ],
  },
  {
    slug: "relationship-guru",
    name: "Relationship Guru",
    role: "AI Wellness Persona for Relationship Reflection",
    image: "/images/RiYvCLRiSOOKHHcr.png",
    description: "AI-guided reflection for preparing clearer boundaries and conversations.",
    icpProblems: [
      "Feeling disconnected from your partner despite living together",
      "Constant arguments over small things that escalate quickly",
      "Difficulty expressing needs without causing conflict",
      "Feeling unappreciated or taken for granted",
      "Struggling to maintain friendships while managing family and work",
    ],
  },
  {
    slug: "happiness-guru",
    name: "Happiness Guru",
    role: "AI Wellness Persona for Everyday Joy",
    image: "/images/xSeUQcwBWbWGSnFH.jpg",
    description: "AI-guided reflection on everyday enjoyment, connection, and personal values.",
    icpProblems: [
      "Going through the motions without feeling genuine happiness",
      "Achieving goals but still feeling empty inside",
      "Comparing yourself to others and feeling inadequate",
      "Struggling to find meaning in daily activities",
      "Feeling like happiness is always just out of reach",
    ],
  },
  {
    slug: "calm-guru",
    name: "Calm Guru",
    role: "AI Wellness Persona for Calm Practices",
    image: "/images/GjrsMwPTDhrCwQjg.jpg",
    description: "AI-guided grounding and optional mindfulness practices for a short pause.",
    icpProblems: [
      "Mind constantly racing with thoughts and worries",
      "Unable to be present in the moment with loved ones",
      "Feeling reactive instead of responsive to situations",
      "Struggling to find quiet time in a busy schedule",
      "Wanting to meditate but not knowing where to start",
    ],
  },
  {
    slug: "spiritual-guru",
    name: "Spiritual Guru",
    role: "AI Wellness Persona for Values and Meaning",
    image: "/images/itZXkUHXnEimtTTz.png",
    description: "AI-guided reflection on values, meaning, stillness, and purpose.",
    icpProblems: [
      "Feeling spiritually disconnected or lost",
      "Searching for deeper meaning and purpose in life",
      "Struggling to align actions with personal values",
      "Feeling overwhelmed by existential questions",
      "Wanting to develop a spiritual practice but unsure how",
    ],
  },
];

async function seedGurus() {
  console.log("Checking existing gurus...");
  const existingGurus = await getAllGurus();
  
  if (existingGurus.length > 0) {
    console.log(`Found ${existingGurus.length} existing gurus. Skipping seed.`);
    return;
  }

  console.log("Seeding gurus...");
  for (const guru of gurusData) {
    try {
      const id = await createGuru(guru);
      console.log(`Created guru: ${guru.name} (ID: ${id})`);
    } catch (error) {
      console.error(`Failed to create guru ${guru.name}:`, error);
    }
  }
  console.log("Seeding complete!");
}

seedGurus()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Seeding failed:", error);
    process.exit(1);
  });
