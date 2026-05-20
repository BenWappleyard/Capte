import path from "node:path";
import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const adapter = new PrismaBetterSqlite3({ url: path.join(process.cwd(), "prisma/dev.db") });
const prisma = new PrismaClient({ adapter });

const cards = [
  { front: "bonjour", back: "hello", type: "vocabulary", category: "greetings" },
  { front: "merci", back: "thank you", type: "vocabulary", category: "greetings" },
  { front: "s'il vous plaît", back: "please", type: "phrase", category: "greetings" },
  { front: "je m'appelle", back: "my name is", type: "phrase", category: "introductions" },
  { front: "comment allez-vous", back: "how are you (formal)", type: "phrase", category: "greetings" },
  { front: "manger", back: "to eat", type: "verb", category: "verbs", exampleFr: "Je veux manger maintenant.", exampleEn: "I want to eat now." },
  { front: "parler", back: "to speak", type: "verb", category: "verbs", exampleFr: "Tu peux parler français?", exampleEn: "Can you speak French?", metadata: JSON.stringify({ conjugations: { "présent": { "je": "parle", "tu": "parles", "il/elle": "parle", "nous": "parlons", "vous": "parlez", "ils/elles": "parlent" } } }) },
  { front: "le chien", back: "the dog", type: "vocabulary", category: "animals" },
  { front: "la maison", back: "the house", type: "vocabulary", category: "places" },
  { front: "aujourd'hui", back: "today", type: "vocabulary", category: "time" },
];

const result = await prisma.card.createMany({ data: cards });
console.log(`Seeded ${result.count} cards`);
await prisma.$disconnect();
