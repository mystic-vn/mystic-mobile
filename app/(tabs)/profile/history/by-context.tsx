import { useEffect, useState } from 'react';
import { StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { IconSymbol } from '@/components/ui/IconSymbol';

interface Context {
  id: string;
  name: string;
  description: string;
  readingCount: number;
}

export default function HistoryByContextScreen() {
  const [contexts, setContexts] = useState<Context[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadContexts();
  }, []);

  const loadContexts = async () => {
    try {
      setLoading(true);
      const userId = await AsyncStorage.getItem('userId');
      const token = await AsyncStorage.getItem('access_token');

      if (!userId || !token) {
        router.replace('/auth/login');
        return;
      }

      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/tarot/contexts`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch contexts');
      }

      const data = await response.json();
      
      // Lấy số lượng trải bài cho mỗi context
      const contextsWithCount = await Promise.all(
        data.map(async (context: Context) => {
          const historyResponse = await fetch(
            `${process.env.EXPO_PUBLIC_API_URL}/tarot-reading/history/user/${userId}/context/${context.id}`,
            {
              headers: {
                'Authorization': `Bearer ${token}`,
              },
            }
          );
          
          if (historyResponse.ok) {
            const historyData = await historyResponse.json();
            return {
              ...context,
              readingCount: historyData.length,
            };
          }
          
          return {
            ...context,
            readingCount: 0,
          };
        })
      );

      setContexts(contextsWithCount);
    } catch (error) {
      console.error('Error loading contexts:', error);
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
      <ThemedView style={styles.listContainer}>
        {contexts.map((context) => (
          <TouchableOpacity
            key={context.id}
            style={styles.contextItem}
            onPress={() => router.push(`/profile/history/context/${context.id}`)}
          >
            <ThemedView style={styles.contextHeader}>
              <ThemedText style={styles.contextName}>{context.name}</ThemedText>
              <ThemedView style={styles.badge}>
                <ThemedText style={styles.badgeText}>
                  {context.readingCount}
                </ThemedText>
              </ThemedView>
            </ThemedView>
            <ThemedText 
              style={styles.contextDescription}
              numberOfLines={2}
            >
              {context.description}
            </ThemedText>
            <IconSymbol 
              name="chevron.right" 
              size={20} 
              color="#666" 
              style={styles.chevronIcon} 
            />
          </TouchableOpacity>
        ))}
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
  listContainer: {
    padding: 15,
  },
  contextItem: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
  },
  contextHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  contextName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#9f7aea',
    flex: 1,
  },
  badge: {
    backgroundColor: 'rgba(159,122,234,0.2)',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginLeft: 10,
  },
  badgeText: {
    fontSize: 12,
    color: '#9f7aea',
    fontWeight: 'bold',
  },
  contextDescription: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    lineHeight: 20,
    marginRight: 20,
  },
  chevronIcon: {
    position: 'absolute',
    right: 15,
    top: '50%',
    marginTop: -10,
  },
}); 