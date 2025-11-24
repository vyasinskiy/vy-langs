import axios from 'axios';
import { 
  Word, 
  CreateWordRequest, 
  UpdateWordRequest, 
  CheckAnswerRequest, 
  CheckAnswerResponse, 
  ApiResponse, 
  Stats, 
  StudyWordResponse,
  ClearAnswersResponse,
  TodayCorrectWord,
  WordListResponse,
} from '../types';

const backendUrl = (process.env.NEXT_PUBLIC_BACKEND_URL ?? '').replace(/\/$/, '');
const API_BASE_URL = backendUrl ? `${backendUrl}/api` : '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Words API
export const wordsApi = {
  getPaginated: async (params: { page: number; pageSize: number; search?: string }): Promise<WordListResponse> => {
    const searchParams = new URLSearchParams();
    searchParams.set('page', String(params.page));
    searchParams.set('pageSize', String(params.pageSize));
    if (params.search) {
      searchParams.set('search', params.search);
    }
    const response = await api.get<ApiResponse<WordListResponse>>(`/words?${searchParams.toString()}`);
    if (!response.data.success) {
      throw new Error(response.data.error);
    }
    return response.data.data!;
  },

  getById: async (id: number): Promise<Word> => {
    const response = await api.get<ApiResponse<Word>>(`/words/${id}`);
    if (!response.data.success) {
      throw new Error(response.data.error);
    }
    return response.data.data!;
  },

  getStudyWord: async (favoriteOnly: boolean = false, excludeId?: number): Promise<StudyWordResponse> => {
    const params = new URLSearchParams();
    params.set('favoriteOnly', String(favoriteOnly));
    if (excludeId) params.set('excludeId', String(excludeId));
    const response = await api.get<ApiResponse<StudyWordResponse>>(`/words/study?${params.toString()}`);
    if (!response.data.success) {
      throw new Error(response.data.error);
    }
    return response.data.data!;
  },

  getFavorites: async (): Promise<Word[]> => {
    const response = await api.get<ApiResponse<Word[]>>('/words/favorites');
    return response.data.data || [];
  },

  create: async (wordData: CreateWordRequest): Promise<Word> => {
    const response = await api.post<ApiResponse<Word>>('/words', wordData);
    if (!response.data.success) {
      throw new Error(response.data.error);
    }
    return response.data.data!;
  },

  update: async (id: number, wordData: UpdateWordRequest): Promise<Word> => {
    const response = await api.put<ApiResponse<Word>>(`/words/${id}`, wordData);
    if (!response.data.success) {
      throw new Error(response.data.error);
    }
    return response.data.data!;
  },

  delete: async (id: number): Promise<void> => {
    const response = await api.delete<ApiResponse<{}>>(`/words/${id}`);
    if (!response.data.success) {
      throw new Error(response.data.error);
    }
  },

  toggleFavorite: async (id: number): Promise<Word> => {
    const response = await api.patch<ApiResponse<Word>>(`/words/${id}/favorite`);
    if (!response.data.success) {
      throw new Error(response.data.error);
    }
    return response.data.data!;
  },
};

// Answers API
export const answersApi = {
  checkAnswer: async (answerData: CheckAnswerRequest): Promise<CheckAnswerResponse> => {
    const response = await api.post<ApiResponse<CheckAnswerResponse>>('/answers/check', answerData);
    if (!response.data.success) {
      throw new Error(response.data.error);
    }
    return response.data.data!;
  },

  getStats: async (): Promise<Stats> => {
    const response = await api.get<ApiResponse<Stats>>('/answers/stats');
    if (!response.data.success) {
      throw new Error(response.data.error);
    }
    return response.data.data!;
  },

  getTodayCorrectWords: async (): Promise<TodayCorrectWord[]> => {
    const response = await api.get<ApiResponse<TodayCorrectWord[]>>('/answers/today-correct-words');
    if (!response.data.success) {
      throw new Error(response.data.error);
    }
    return response.data.data || [];
  },

  clearAll: async (): Promise<ClearAnswersResponse> => {
    const response = await api.delete<ApiResponse<ClearAnswersResponse>>('/answers');
    if (!response.data.success) {
      throw new Error(response.data.error);
    }
    return response.data.data!;
  },
};
