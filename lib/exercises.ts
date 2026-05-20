import type { Card } from "@/app/generated/prisma/client";

export type ExerciseType =
  | "flashcard"
  | "multiple_choice"
  | "fill_blank"
  | "translation"
  | "conjugation";

export interface Exercise {
  type: ExerciseType;
  cardId: string;
  prompt: string;
  promptLanguage: "fr" | "en";
  answer: string;
  options?: string[];       // for multiple_choice
  blankSentence?: string;   // for fill_blank
  hints?: string;           // e.g. tense/person for conjugation
}

export function buildExercise(card: Card, allCards: Card[]): Exercise {
  const type = chooseExerciseType(card, allCards);
  return makeExercise(type, card, allCards);
}

function chooseExerciseType(card: Card, allCards: Card[]): ExerciseType {
  const available: ExerciseType[] = ["flashcard", "translation"];

  if (allCards.length >= 4) available.push("multiple_choice");
  if (card.exampleFr) available.push("fill_blank");
  if (card.type === "verb" && card.metadata) available.push("conjugation");

  return available[Math.floor(Math.random() * available.length)];
}

function makeExercise(type: ExerciseType, card: Card, allCards: Card[]): Exercise {
  switch (type) {
    case "flashcard":
      return {
        type: "flashcard",
        cardId: card.id,
        prompt: card.front,
        promptLanguage: "fr",
        answer: card.back,
      };

    case "translation": {
      const frToEn = Math.random() > 0.5;
      return {
        type: "translation",
        cardId: card.id,
        prompt: frToEn ? card.front : card.back,
        promptLanguage: frToEn ? "fr" : "en",
        answer: frToEn ? card.back : card.front,
      };
    }

    case "multiple_choice": {
      const distractors = allCards
        .filter((c) => c.id !== card.id)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3)
        .map((c) => c.back);

      const options = [...distractors, card.back].sort(() => Math.random() - 0.5);
      return {
        type: "multiple_choice",
        cardId: card.id,
        prompt: card.front,
        promptLanguage: "fr",
        answer: card.back,
        options,
      };
    }

    case "fill_blank": {
      const sentence = card.exampleFr ?? card.front;
      const word = card.front.split(" ")[0];
      const blankSentence = sentence.replace(
        new RegExp(`\\b${word}\\b`, "i"),
        "_____"
      );
      return {
        type: "fill_blank",
        cardId: card.id,
        prompt: blankSentence,
        promptLanguage: "fr",
        answer: word,
        blankSentence,
        hints: card.back,
      };
    }

    case "conjugation": {
      const meta = JSON.parse(card.metadata ?? "{}");
      const tenses = Object.keys(meta.conjugations ?? {});
      const tense = tenses[Math.floor(Math.random() * tenses.length)] ?? "présent";
      const conjugations = meta.conjugations?.[tense] ?? {};
      const persons = Object.keys(conjugations);
      const person = persons[Math.floor(Math.random() * persons.length)] ?? "je";
      const answer = conjugations[person] ?? card.front;

      return {
        type: "conjugation",
        cardId: card.id,
        prompt: card.front,
        promptLanguage: "fr",
        answer,
        hints: `${tense} — ${person}`,
      };
    }
  }
}
