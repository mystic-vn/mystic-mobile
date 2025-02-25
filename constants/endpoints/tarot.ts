import api from '../api';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';

export interface TarotContext {
  _id: string;
  name: string;
  description: string;
  slug: string;
  order: number;
  type: 'relationship' | 'career' | 'finance' | 'social';
}

export interface QuestionPosition {
  _id: string;
  index: number;
  name: string;
  aspect: string;
  description: string;
  interpretation: string;
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

export interface SpreadType {
  _id: string;
  name: string;
  description: string;
  positions: {
    name: string;
    description: string;
  }[];
  supportedContexts: string[];
}

export interface Card {
  _id: string;
  name: string;
  imageUrl: string;
  description: string;
  keywords: string[];
  deckId: string;
  arcanaTypeId: string;
  suitId?: string;
}

export interface ReadingAnalysis {
  _id: string;
  spreadType: string;
  context: string;
  question?: string;
  cards: {
    _id: string;
    cardId: string;
    position: number;
    aspect: string;
    isReversed: boolean;
  }[];
  analysis: {
    _id: string;
    overview: string;
    positionAnalyses: {
      position: number;
      cardId: string;
      interpretation: string;
    }[];
    conclusion: string;
  };
  extractedPatterns: {
    _id: string;
    cardCombinations: string[];
    contextKeywords: string[];
    interpretationTemplates: string[];
  };
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
  __v: number;
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
    },
    getById: async (id: string): Promise<Question> => {
      return api.get(`/tarot-reading/questions/${id}`);
    },
  },
  spreadTypes: {
    getByContextSlug: async (contextSlug: string): Promise<SpreadType[]> => {
      return api.get(`/tarot-reading/spread-types/by-context/${contextSlug}`);
    },
  },
  cards: {
    getAllWithoutPagination: async (): Promise<Card[]> => {
      return api.get('/tarot/cards/all');
    },
  },
  readingAnalysis: {
    create: async (data: {
      spreadTypeId: string;
      context: string;
      questionId?: string;
      cards: { cardId: string; position: number; aspect: string; isReversed: boolean; }[];
    }): Promise<ReadingAnalysis> => {
      return api.post('/tarot-reading/analysis', data);
    },
    getById: async (id: string): Promise<ReadingAnalysis> => {
      return api.get(`/tarot-reading/analysis/${id}`);
    },
  },
};