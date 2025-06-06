
export interface Option {
  label: string; // "A", "B", "C", "D"
  text: string;
}

export interface Question {
  id: string;
  questionText: string;
  options: Option[];
  correctAnswerLabel: string; // "A", "B", "C", "D"
  explanation?: string; // Optional: for future use
}

export enum QuizStatus {
  NOT_STARTED = 'NOT_STARTED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
}

export interface UserAnswer {
  questionId: string;
  selectedOptionLabel: string;
  isCorrect: boolean;
}
