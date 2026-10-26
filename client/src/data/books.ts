export interface Book {
  id: string;
  title: string;
  subtitle: string;
  author: string;
  guruSlug: string;
  guruName: string;
  description: string;
  shortDescription: string;
  coverImage: string;
  amazonUrl: string;
  format: string;
  pages: number;
  publicationDate: string;
  language: string;
  isbn: string;
  dimensions: string;
  highlights: string[];
  whoIsItFor: string[];
}

export const books: Book[] = [
  {
    id: "sleep-again",
    title: "Sleep Again",
    subtitle: "A 21-Day Guided Workbook to Reclaim Your Rest",
    author: "S. Mueen",
    guruSlug: "sleep-guru",
    guruName: "Sleep Guru",
    description:
      "Sleep Again is for the working woman who strives to do everything right all day, then lies awake at night with a racing mind, a buzzing body, and tomorrow's to-do list on repeat. This is not a willpower problem. It is a nervous system problem, and it is solvable.\n\nIn this 21-day guided workbook, Sleep Guru (from StressGuru.ai) becomes your calm, practical guide and gives you a clear plan that fits real life. Each day takes 15\u201320 minutes and follows a simple rhythm: a quick morning reset, a 10-minute evening wind-down, and an \u201cif you wake up at night\u201d rescue protocol you can use at 2:00 a.m. without thinking.\n\nStart tonight. Open to Day 1, follow the plan, and in three weeks you will have a repeatable system to fall asleep faster, wake up less, and wake up calmer, with more energy for your work and the people you love.",
    shortDescription:
      "A 21-day guided workbook that gives you a clear, practical plan to fall asleep faster, wake up less, and reclaim your rest. Just 15\u201320 minutes a day.",
    coverImage:
      "/images/sleep-again-book-cover-real_ed711d38.png",
    amazonUrl: "https://www.amazon.com/dp/B0GJBR1PHD",
    format: "Hardcover",
    pages: 104,
    publicationDate: "January 16, 2026",
    language: "English",
    isbn: "B0GJBR1PHD",
    dimensions: '5.74 x 0.44 x 8.74 inches',
    highlights: [
      "21 days of guided exercises, each taking just 15\u201320 minutes",
      "Morning reset routine to start your day grounded",
      "10-minute evening wind-down protocol",
      '2:00 a.m. "wake up at night" rescue plan',
      "Science-backed nervous system regulation techniques",
      "Designed for busy working women with real schedules",
    ],
    whoIsItFor: [
      "Working women who lie awake with a racing mind",
      "Anyone who wakes up at 2 or 3 a.m. and can't fall back asleep",
      "People who have tried sleep apps and supplements without lasting results",
      "Professionals experiencing burnout-related sleep disruption",
      "Anyone who wants a structured, day-by-day plan instead of generic tips",
    ],
  },
];

export function getBooksByGuru(guruSlug: string): Book[] {
  return books.filter((book) => book.guruSlug === guruSlug);
}

export function getBookById(id: string): Book | undefined {
  return books.find((book) => book.id === id);
}
