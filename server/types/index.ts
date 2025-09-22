export interface Word {
  id: number;
  english: string;
  russian: string;
  exampleEn: string;
  exampleRu: string;
  createdAt: Date;
  updatedAt: Date;
  isFavorite: boolean;
}

export interface StudyWordResponse {
  word: Word;
  unlearnedCount: number;
}

export interface Answer {
  id: number;
  wordId: number;
  answer: string;
  isCorrect: boolean;
  isSynonym: boolean;
  createdAt: Date;
}

export interface CreateWordRequest {
  english: string;
  russian: string;
  exampleEn: string;
  exampleRu: string;
}

export interface UpdateWordRequest {
  english?: string;
  russian?: string;
  exampleEn?: string;
  exampleRu?: string;
  isFavorite?: boolean;
}

export interface CheckAnswerRequest {
  wordId: number;
  answer: string;
}

export interface CheckAnswerResponse {
  isCorrect: boolean;
  isPartial: boolean;
  hint?: string;
  isSynonym?: boolean;
  correctAnswer: string;
  todayCorrectAnswers: number;
  totalCorrectAnswers: number;
  totalWords: number;
}

export interface ClearAnswersResponse {
  deletedCount: number;
}

export interface WordWithAnswers extends Word {
  answers: Answer[];
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
