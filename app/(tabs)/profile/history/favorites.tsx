import { useEffect, useState } from 'react';
import { StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { IconSymbol } from '@/components/ui/IconSymbol';

interface ReadingHistory {
  id: string;
  context: string;
  createdAt: string;
  cards: Array<{
    cardId: string;
    position: number;
    aspect: string;
    isReversed: boolean;
  }>;
  analysis: {
    overview: string;
    conclusion: string;
  };
  isFavorite: boolean;
}

export default function FavoriteReadingsScreen() {
  const [favorites, setFavorites] = useState<ReadingHistory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      setLoading(true);
      const userId = await AsyncStorage.getItem('userId');
      const token = await AsyncStorage.getItem('access_token');

      if (!userId || !token) {
        router.replace('/auth/login');
        return;
      }

      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/tarot-reading/history/user/${userId}/favorites`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch favorites');
      }

      const data = await response.json();
      setFavorites(data);
    } catch (error) {
      console.error('Error loading favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ThemedText>Đang tải...</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {favorites.length > 0 ? (
        <ThemedView style={styles.listContainer}>
          {favorites.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.historyItem}
              onPress={() => router.push(`/profile/history/details?id=${item.id}`)}
            >
              <ThemedView style={styles.historyHeader}>
                <ThemedText style={styles.historyContext}>{item.context}</ThemedText>
                <ThemedText style={styles.historyDate}>
                  {new Date(item.createdAt).toLocaleDateString('vi-VN')}
                </ThemedText>
              </ThemedView>
              <ThemedText 
                style={styles.historyOverview}
                numberOfLines={2}
              >
                {item.analysis.overview}
              </ThemedText>
              <IconSymbol 
                name="heart.fill" 
                size={16} 
                color="#ff4757" 
                style={styles.favoriteIcon} 
              />
            </TouchableOpacity>
          ))}
        </ThemedView>
      ) : (
        <ThemedView style={styles.emptyContainer}>
          <IconSymbol name="heart" size={48} color="#666" />
          <ThemedText style={styles.emptyText}>
            Bạn chưa có trải bài yêu thích nào
          </ThemedText>
        </ThemedView>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a1a',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    padding: 15,
  },
  historyItem: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  historyContext: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#9f7aea',
  },
  historyDate: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
  },
  historyOverview: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    lineHeight: 20,
  },
  favoriteIcon: {
    position: 'absolute',
    top: 15,
    right: 15,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
}); 