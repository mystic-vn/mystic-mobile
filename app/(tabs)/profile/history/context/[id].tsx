import { useEffect, useState } from 'react';
import { StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { IconSymbol } from '@/components/ui/IconSymbol';
import historyEndpoints, { ReadingHistory } from '@/constants/endpoints/history';
import { tarotEndpoints } from '@/constants/endpoints/tarot';

interface Context {
  id: string;
  name: string;
  description: string;
}

export default function ContextHistoryScreen() {
  const { id } = useLocalSearchParams();
  const [context, setContext] = useState<Context | null>(null);
  const [readings, setReadings] = useState<ReadingHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadContextHistory();
  }, [id]);

  const loadContextHistory = async () => {
    try {
      setLoading(true);
      setError(null);

      const userStr = await AsyncStorage.getItem('user');

      if (!userStr) {
        console.log('No user found');
        router.replace('/auth/login');
        return;
      }

      const user = JSON.parse(userStr);

      // Lấy thông tin context
      const contextData = await tarotEndpoints.getContext(id as string);
      setContext(contextData);

      // Lấy lịch sử trải bài của context
      const historyData = await historyEndpoints.getHistoryByContext(user.id, id as string);
      setReadings(historyData);
    } catch (error) {
      console.error('Error loading context history:', error);
      setError('Có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại sau.');
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

  if (error) {
    return (
      <ThemedView style={styles.errorContainer}>
        <IconSymbol name="shield.fill" size={48} color="#ff4757" />
        <ThemedText style={styles.errorText}>{error}</ThemedText>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={loadContextHistory}
        >
          <ThemedText style={styles.retryText}>Thử lại</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    );
  }

  if (!context) {
    return (
      <ThemedView style={styles.errorContainer}>
        <ThemedText>Không tìm thấy thông tin chủ đề</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText style={styles.contextName}>{context.name}</ThemedText>
        <ThemedText style={styles.contextDescription}>
          {context.description}
        </ThemedText>
        <ThemedView style={styles.statsContainer}>
          <ThemedView style={styles.stat}>
            <ThemedText style={styles.statNumber}>{readings.length}</ThemedText>
            <ThemedText style={styles.statLabel}>Lần trải bài</ThemedText>
          </ThemedView>
          <ThemedView style={styles.stat}>
            <ThemedText style={styles.statNumber}>
              {readings.filter(r => r.isFavorite).length}
            </ThemedText>
            <ThemedText style={styles.statLabel}>Yêu thích</ThemedText>
          </ThemedView>
        </ThemedView>
      </ThemedView>

      <ThemedView style={styles.listContainer}>
        {readings.length > 0 ? (
          readings.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.historyItem}
              onPress={() => router.push({
                pathname: '/profile/history/details',
                params: { id: item.id }
              })}
            >
              <ThemedView style={styles.historyHeader}>
                <ThemedText style={styles.historyDate}>
                  {new Date(item.createdAt).toLocaleDateString('vi-VN')}
                </ThemedText>
                {item.isFavorite && (
                  <IconSymbol 
                    name="heart.fill" 
                    size={16} 
                    color="#ff4757" 
                  />
                )}
              </ThemedView>
              <ThemedText 
                style={styles.historyOverview}
                numberOfLines={2}
              >
                {item.analysis.overview}
              </ThemedText>
            </TouchableOpacity>
          ))
        ) : (
          <ThemedView style={styles.emptyContainer}>
            <IconSymbol name="doc.text" size={48} color="#666" />
            <ThemedText style={styles.emptyText}>
              Chưa có lịch sử trải bài nào cho chủ đề này
            </ThemedText>
          </ThemedView>
        )}
      </ThemedView>
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  contextName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#9f7aea',
    marginBottom: 8,
  },
  contextDescription: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    lineHeight: 24,
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
  },
  stat: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  statLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)',
    marginTop: 4,
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
  historyDate: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)',
  },
  historyOverview: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    lineHeight: 20,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  errorText: {
    marginBottom: 20,
    fontSize: 16,
    color: '#ff4757',
    textAlign: 'center',
  },
  retryButton: {
    padding: 12,
    backgroundColor: '#9f7aea',
    borderRadius: 8,
  },
  retryText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
}); 