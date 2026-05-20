export type Rating = 1 | 2 | 3 | 4; // Again | Hard | Good | Easy

export interface ScheduleInput {
  interval: number;
  easeFactor: number;
  repetitions: number;
}

export interface ScheduleResult {
  nextReview: Date;
  interval: number;
  easeFactor: number;
  repetitions: number;
}

export function calculateNextReview(
  rating: Rating,
  current: ScheduleInput
): ScheduleResult {
  let { interval, easeFactor, repetitions } = current;

  if (rating === 1) {
    interval = 1;
    repetitions = 0;
  } else if (rating === 2) {
    interval = Math.max(1, Math.round(interval * 0.8));
    easeFactor = Math.max(1.3, easeFactor - 0.15);
    repetitions += 1;
  } else if (rating === 3) {
    if (repetitions === 0) interval = 1;
    else if (repetitions === 1) interval = 3;
    else interval = Math.round(interval * easeFactor);
    repetitions += 1;
  } else {
    if (repetitions === 0) interval = 1;
    else if (repetitions === 1) interval = 4;
    else interval = Math.round(interval * easeFactor * 1.3);
    easeFactor = Math.min(4.0, easeFactor + 0.15);
    repetitions += 1;
  }

  const nextReview = new Date();
  nextReview.setDate(nextReview.getDate() + interval);
  nextReview.setHours(0, 0, 0, 0);

  return { nextReview, interval, easeFactor, repetitions };
}
