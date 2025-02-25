import React from 'react';
import { StyleSheet, ScrollView, ActivityIndicator, Image, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ThemedText } from '@components/ThemedText';
import { ThemedView } from '@components/ThemedView';
import { useLocalSearchParams, Stack } from 'expo-router';
import { tarotApi, ReadingAnalysis, Card } from '@constants/endpoints/tarot';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.4;
const CARD_HEIGHT = CARD_WIDTH * 1.75;

export default function AnalysisScreen() {
  const { id, analysisId } = useLocalSearchParams<{ id: string; analysisId: string }>();
  const insets = useSafeAreaInsets();

  // Fetch analysis details
  const { data: analysis, isLoading: loadingAnalysis } = useQuery<ReadingAnalysis>({
    queryKey: ['analysis', analysisId],
    queryFn: () => tarotApi.readingAnalysis.getById(analysisId),
  });

  // Fetch all cards to get card details
  const { data: cards } = useQuery<Card[]>({
    queryKey: ['cards'],
    queryFn: () => tarotApi.cards.getAllWithoutPagination(),
  });

  if (loadingAnalysis) {
    return (
      <LinearGradient
        colors={['#2D1B69', '#4A1B6D', '#1F1135']}
        style={styles.loadingContainer}
      >
        <ActivityIndicator size="large" color="#fff" />
        <ThemedText style={styles.loadingText}>
          Đang tải kết quả phân tích...
        </ThemedText>
      </LinearGradient>
    );
  }

  if (!analysis) {
    return (
      <LinearGradient
        colors={['#2D1B69', '#4A1B6D', '#1F1135']}
        style={styles.errorContainer}
      >
        <ThemedText style={styles.errorText}>
          Không thể tải kết quả phân tích. Vui lòng thử lại sau.
        </ThemedText>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={['#2D1B69', '#4A1B6D', '#1F1135']}
      style={styles.container}
    >
      <Stack.Screen 
        options={{
          title: 'Kết quả phân tích',
          headerStyle: {
            backgroundColor: '#2D1B69',
          },
          headerTintColor: '#fff',
        }} 
      />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={{
          padding: 16,
          paddingBottom: insets.bottom + 16,
        }}
      >
        {/* Tổng quan */}
        <ThemedView style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Tổng quan</ThemedText>
          <ThemedText style={styles.text}>{analysis.analysis.overview}</ThemedText>
        </ThemedView>

        {/* Chi tiết từng lá bài */}
        <ThemedView style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Chi tiết các lá bài</ThemedText>
          {analysis.analysis.positionAnalyses.map((position, index) => {
            const card = cards?.find(c => c._id === position.cardId);
            return (
              <ThemedView key={index} style={styles.cardAnalysis}>
                {card && (
                  <Image
                    source={{ uri: card.imageUrl }}
                    style={styles.cardImage}
                    resizeMode="contain"
                  />
                )}
                <ThemedView style={styles.cardContent}>
                  <ThemedText style={styles.cardTitle}>
                    Vị trí {position.position + 1}: {card?.name}
                  </ThemedText>
                  <ThemedText style={styles.text}>
                    {position.interpretation}
                  </ThemedText>
                </ThemedView>
              </ThemedView>
            );
          })}
        </ThemedView>

        {/* Kết luận */}
        <ThemedView style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Kết luận</ThemedText>
          <ThemedText style={styles.text}>{analysis.analysis.conclusion}</ThemedText>
        </ThemedView>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  errorText: {
    textAlign: 'center',
    opacity: 0.7,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
    opacity: 0.8,
  },
  cardAnalysis: {
    flexDirection: 'row',
    marginBottom: 24,
    gap: 16,
  },
  cardImage: {
    width: CARD_WIDTH * 0.6,
    height: CARD_HEIGHT * 0.6,
    borderRadius: 12,
  },
  cardContent: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
}); 