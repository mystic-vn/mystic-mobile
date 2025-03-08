import React from 'react';
import { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, ScrollView, View } from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { IconSymbol } from '@/components/ui/IconSymbol';
import historyEndpoints, { ReadingHistory } from '@/constants/endpoints/history';
import { tarotEndpoints } from '@/constants/endpoints/tarot';

interface ContextMap {
  [key: string]: string;
}

export default function HistoryScreen() {
  const [recentHistory, setRecentHistory] = useState<ReadingHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [contextMap, setContextMap] = useState<ContextMap>({});

  const insets = useSafeAreaInsets();

  useEffect(() => {
    checkAuthAndLoadHistory();
  }, []);

  const loadContexts = async (histories: ReadingHistory[]) => {
    try {
      const uniqueContextIds = [...new Set(histories.map(h => h.context))];
      const contextDetails = await Promise.all(
        uniqueContextIds.map(id => tarotEndpoints.getContext(id))
      );
      
      const newContextMap: ContextMap = {};
      contextDetails.forEach((context, index) => {
        if (context) {
          newContextMap[uniqueContextIds[index]] = context.name;
        }
      });
      
      setContextMap(newContextMap);
    } catch (error) {
      console.error('Error loading contexts:', error);
    }
  };

  const checkAuthAndLoadHistory = async () => {
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
      const data = await historyEndpoints.getRecentHistory(user.id);
      setRecentHistory(data);
      await loadContexts(data);
    } catch (error) {
      console.error('Error in checkAuthAndLoadHistory:', error);
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
          onPress={checkAuthAndLoadHistory}
        >
          <ThemedText style={styles.retryText}>Thử lại</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    );
  }

  const groupHistoryByDate = () => {
    const groups: { [key: string]: ReadingHistory[] } = {};
    recentHistory.forEach(item => {
      const date = new Date(item.createdAt).toLocaleDateString('vi-VN');
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(item);
    });
    return groups;
  };

  const historyGroups = groupHistoryByDate();

  return (
    <LinearGradient
      colors={['#1F1135', '#2D1B69', '#4A1B6D']}
      style={styles.container}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={{
          paddingBottom: insets.bottom + 80,
        }}
      >
        {Object.entries(historyGroups).map(([date, items]) => (
          <View key={date}>
            <ThemedText style={styles.dateHeader}>{date}</ThemedText>
            {items.map((item) => (
              <TouchableOpacity
                key={item._id}
                style={styles.historyItem}
                onPress={() => {
                  router.push({ 
                    pathname: '/profile/history/details', 
                    params: { id: item._id } 
                  });
                }}
              >
                <View style={styles.itemTop}>
                  <View style={styles.typeIndicator}>
                    <IconSymbol name="sparkles" size={16} color="#9f7aea" />
                    <ThemedText style={styles.typeText}>Tarot</ThemedText>
                  </View>
                  <ThemedText style={styles.timeText}>
                    {new Date(item.createdAt).toLocaleTimeString('vi-VN', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </ThemedText>
                </View>

                <View style={styles.contentContainer}>
                  <View style={styles.mainContent}>
                    <ThemedText style={styles.contextText}>
                      {contextMap[item.context] || 'Đang tải...'}
                    </ThemedText>
                    <ThemedText style={styles.cardList}>
                      {item.cards.map(card => card.cardId.name).join(' • ')}
                    </ThemedText>
                  </View>
                  {item.isFavorite && (
                    <IconSymbol 
                      name="heart.fill" 
                      size={16} 
                      color="#ff4757"
                    />
                  )}
                </View>

                <ThemedText 
                  style={styles.overview}
                  numberOfLines={2}
                >
                  {item.analysis.overview}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </View>
        ))}

        {recentHistory.length === 0 && (
          <ThemedView style={styles.emptyContainer}>
            <IconSymbol name="doc.text" size={48} color="#9f7aea" />
            <ThemedText style={styles.emptyText}>
              Bạn chưa có lịch sử tra cứu nào
            </ThemedText>
          </ThemedView>
        )}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  dateHeader: {
    fontSize: 14,
    fontWeight: '600',
    color: '#9f7aea',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: 'rgba(159,122,234,0.1)',
  },
  historyItem: {
    margin: 15,
    padding: 15,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  itemTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  typeIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(159,122,234,0.1)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  typeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#9f7aea',
    marginLeft: 4,
  },
  timeText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.4)',
  },
  contentContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  mainContent: {
    flex: 1,
    marginRight: 10,
  },
  contextText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  cardList: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
    marginBottom: 8,
  },
  overview: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    lineHeight: 20,
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
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: 'rgba(159,122,234,0.2)',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#9f7aea',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
  },
}); 