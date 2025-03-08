import React, { useEffect, useState } from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, Image, View } from 'react-native';
import { router, useGlobalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';

import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { IconSymbol } from '@/components/ui/IconSymbol';
import historyEndpoints, { ReadingHistory } from '@/constants/endpoints/history';
import { tarotEndpoints } from '@/constants/endpoints/tarot';

export default function HistoryDetailScreen() {
  const { id } = useGlobalSearchParams();
  const [reading, setReading] = useState<ReadingHistory | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [contextName, setContextName] = useState<string>('');

  useEffect(() => {
    console.log('Reading ID from params:', id);
    if (!id || typeof id !== 'string') {
      setError('Không tìm thấy thông tin trải bài');
      setLoading(false);
      return;
    }
    loadReadingDetail();
  }, [id]);

  const loadContext = async (contextId: string) => {
    try {
      const context = await tarotEndpoints.getContext(contextId);
      if (context) {
        setContextName(context.name);
      }
    } catch (error) {
      console.error('Error loading context:', error);
    }
  };

  const loadReadingDetail = async () => {
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
      
      if (!id || typeof id !== 'string') {
        throw new Error('ID không hợp lệ');
      }

      const data = await historyEndpoints.getHistoryDetail(user.id, id);
      setReading(data);
      await loadContext(data.context);
    } catch (error: any) {
      console.error('Error loading reading detail:', error);
      setError('Có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async () => {
    try {
      if (!reading) return;

      const userStr = await AsyncStorage.getItem('user');
      if (!userStr) return;

      const user = JSON.parse(userStr);
      const updatedReading = await historyEndpoints.toggleFavorite(user.id, reading._id);
      setReading(updatedReading);
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  if (loading) {
    return (
      <LinearGradient colors={['#1F1135', '#2D1B69', '#4A1B6D']} style={styles.container}>
        <ThemedView style={styles.loadingContainer}>
          <ThemedText>Đang tải...</ThemedText>
        </ThemedView>
      </LinearGradient>
    );
  }

  if (error) {
    return (
      <LinearGradient colors={['#1F1135', '#2D1B69', '#4A1B6D']} style={styles.container}>
        <ThemedView style={styles.errorContainer}>
          <IconSymbol name="shield.fill" size={48} color="#ff4757" />
          <ThemedText style={styles.errorText}>{error}</ThemedText>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={loadReadingDetail}
          >
            <ThemedText style={styles.retryText}>Thử lại</ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </LinearGradient>
    );
  }

  if (!reading) {
    return (
      <LinearGradient colors={['#1F1135', '#2D1B69', '#4A1B6D']} style={styles.container}>
        <ThemedView style={styles.errorContainer}>
          <ThemedText>Không tìm thấy thông tin trải bài</ThemedText>
        </ThemedView>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#1F1135', '#2D1B69', '#4A1B6D']} style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <ThemedView style={styles.header}>
          <View style={styles.typeIndicator}>
            <IconSymbol name="sparkles" size={16} color="#9f7aea" />
            <ThemedText style={styles.typeText}>Tarot</ThemedText>
          </View>

          <ThemedView style={styles.headerContent}>
            <ThemedText style={styles.contextName}>{contextName || 'Đang tải...'}</ThemedText>
            <ThemedText style={styles.date}>
              {new Date(reading.createdAt).toLocaleDateString('vi-VN')}
            </ThemedText>
          </ThemedView>

          <TouchableOpacity 
            style={styles.favoriteButton}
            onPress={toggleFavorite}
          >
            <IconSymbol
              name={reading.isFavorite ? 'heart.fill' : 'heart'}
              size={24}
              color={reading.isFavorite ? '#ff4757' : '#666'}
            />
          </TouchableOpacity>
        </ThemedView>

        <ThemedView style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Tổng quan</ThemedText>
          <ThemedText style={styles.text}>{reading.analysis.overview}</ThemedText>
        </ThemedView>

        <ThemedView style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Chi tiết các lá bài</ThemedText>
          {reading.cards.map((card, index) => (
            <ThemedView key={`${card.cardId._id}-${index}`} style={styles.cardAnalysis}>
              <ThemedView style={styles.cardHeader}>
                <ThemedView style={styles.cardInfo}>
                  <ThemedText style={styles.cardTitle}>
                    {card.cardId.name} {card.isReversed && '(Ngược)'}
                  </ThemedText>
                  <ThemedText style={styles.cardAspect}>
                    {card.aspect}
                  </ThemedText>
                </ThemedView>
                <Image 
                  source={{ uri: card.cardId.imageUrl }} 
                  style={[
                    styles.cardImage,
                    card.isReversed && styles.cardImageReversed
                  ]}
                />
              </ThemedView>

              {reading.analysis.positionAnalyses
                .find(pa => pa.position === card.position) && (
                <View style={styles.analysisContent}>
                  <View style={styles.analysisSection}>
                    <ThemedText style={styles.analysisTitle}>Diễn giải</ThemedText>
                    <ThemedText style={styles.analysisText}>
                      {reading.analysis.positionAnalyses.find(pa => pa.position === card.position)?.interpretation}
                    </ThemedText>
                  </View>

                  <View style={styles.analysisSection}>
                    <ThemedText style={styles.analysisTitle}>Lời khuyên</ThemedText>
                    <ThemedText style={styles.analysisText}>
                      {reading.analysis.positionAnalyses.find(pa => pa.position === card.position)?.advice}
                    </ThemedText>
                  </View>
                </View>
              )}
            </ThemedView>
          ))}
        </ThemedView>

        <ThemedView style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Kết luận</ThemedText>
          <ThemedText style={styles.text}>{reading.analysis.conclusion}</ThemedText>
        </ThemedView>
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
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  typeIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(159,122,234,0.1)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  typeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#9f7aea',
    marginLeft: 4,
  },
  headerContent: {
    marginBottom: 8,
  },
  contextName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  date: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)',
  },
  favoriteButton: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  text: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    lineHeight: 24,
  },
  cardAnalysis: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  cardInfo: {
    flex: 1,
    marginRight: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#9f7aea',
    marginBottom: 4,
  },
  cardAspect: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)',
  },
  cardImage: {
    width: 80,
    height: 140,
    borderRadius: 8,
  },
  cardImageReversed: {
    transform: [{ rotate: '180deg' }],
  },
  analysisContent: {
    marginTop: 16,
  },
  analysisSection: {
    marginBottom: 16,
  },
  analysisTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#9f7aea',
    marginBottom: 8,
  },
  analysisText: {
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
  },
  errorText: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    marginBottom: 20,
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
}); 