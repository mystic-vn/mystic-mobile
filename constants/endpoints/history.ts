import api from '../api';

export interface Card {
  _id: string;
  name: string;
  imageUrl: string;
  description: string;
}

export interface ReadingHistory {
  _id: string;
  userId: string;
  type: 'tarot' | 'numerology' | 'zodiac';
  readingAnalysisId: string;
  spreadTypeId: string;
  context: string;
  questionId?: string;
  cards: Array<{
    cardId: Card;
    position: number;
    aspect: string;
    isReversed: boolean;
  }>;
  analysis: {
    overview: string;
    positionAnalyses: Array<{
      position: number;
      cardId: string;
      interpretation: string;
      advice: string;
    }>;
    conclusion: string;
  };
  isFavorite: boolean;
  tags: string[];
  personalNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserStats {
  tarot: {
    readingCount: number;
    favoriteCount: number;
  };
  numerology: {
    readingCount: number;
  };
  zodiac: {
    readingCount: number;
  };
  total: number;
}

const historyEndpoints = {
  getRecentHistory: async (userId: string): Promise<ReadingHistory[]> => {
    const data = await api.get<ReadingHistory[]>(`/tarot-reading/history/user/${userId}`);
    return data.slice(0, 5); // Chỉ lấy 5 kết quả gần nhất
  },
  
  getHistoryByContext: async (userId: string, contextId: string): Promise<ReadingHistory[]> => {
    return api.get<ReadingHistory[]>(`/tarot-reading/history/user/${userId}/context/${contextId}`);
  },
  
  getFavorites: async (userId: string): Promise<ReadingHistory[]> => {
    return api.get<ReadingHistory[]>(`/tarot-reading/history/user/${userId}/favorites`);
  },
  
  getHistoryDetail: async (userId: string, historyId: string): Promise<ReadingHistory> => {
    return api.get<ReadingHistory>(`/tarot-reading/history/user/${userId}/reading/${historyId}`);
  },
  
  toggleFavorite: async (userId: string, historyId: string): Promise<ReadingHistory> => {
    return api.put<ReadingHistory>(`/tarot-reading/history/user/${userId}/reading/${historyId}/favorite`);
  },
  
  addTag: async (userId: string, historyId: string, tag: string): Promise<ReadingHistory> => {
    return api.post<ReadingHistory>(`/tarot-reading/history/user/${userId}/reading/${historyId}/tags`, { tag });
  },
  
  removeTag: async (userId: string, historyId: string, tag: string): Promise<ReadingHistory> => {
    return api.delete<ReadingHistory>(`/tarot-reading/history/user/${userId}/reading/${historyId}/tags/${tag}`);
  },
  
  updateNotes: async (userId: string, historyId: string, notes: string): Promise<ReadingHistory> => {
    return api.put<ReadingHistory>(`/tarot-reading/history/user/${userId}/reading/${historyId}/notes`, { notes });
  },

  getUserStats: async (userId: string): Promise<UserStats> => {
    const data = await api.get<UserStats>(`/tarot-reading/history/user/${userId}/stats`);
    console.log('User stats:', data); // Thêm log để debug
    return data;
  }
};

export default historyEndpoints; 