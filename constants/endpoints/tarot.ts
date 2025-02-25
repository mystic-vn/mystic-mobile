import api from '../api';

export interface TarotContext {
  _id: string;
  name: string;
  description: string;
  slug: string;
  order: number;
  type: 'relationship' | 'career' | 'finance' | 'social';
}

export interface QuestionPosition {
  index: number;
  aspect: string;
  interpretation: string;
  _id: string;
}

export interface PreAnalyzedPatterns {
  cardCombinations: string[];
  interpretationTemplates: string[];
  _id: string;
}

export interface Question {
  _id: string;
  title: string;
  content: string;
  context: string;
  spreadType: string;
  positions: QuestionPosition[];
  keywords: string[];
  preAnalyzedPatterns: PreAnalyzedPatterns;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedQuestions {
  items: Question[];
  hasMore: boolean;
}

export const tarotApi = {
  contexts: {
    getAll: async (): Promise<TarotContext[]> => {
      return api.get('/tarot/contexts');
    },
    getBySlug: async (slug: string): Promise<TarotContext> => {
      return api.get(`/tarot/contexts/slug/${slug}`);
    },
  },
  questions: {
    getByContextSlug: async (contextSlug: string): Promise<Question[]> => {
      return api.get(`/tarot-reading/questions/context/${contextSlug}`);
    },
    getByContextSlugPaginated: async (
      contextSlug: string,
      page: number = 1,
      limit: number = 10
    ): Promise<PaginatedQuestions> => {
      return api.get(`/tarot-reading/questions/context/${contextSlug}/paginated`, {
        params: { page, limit }
      });
    }
  }
};