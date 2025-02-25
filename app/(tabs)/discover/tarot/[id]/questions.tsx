import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, RefreshControl } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { router, useLocalSearchParams, Stack } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { tarotApi, Question, TarotContext, PaginatedQuestions } from '@/constants/endpoints/tarot';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

export default function QuestionsScreen() {
  const { id } = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { data: context } = useQuery<TarotContext>({
    queryKey: ['tarot-context', id],
    queryFn: () => tarotApi.contexts.getBySlug(id as string),
  });

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
    refetch
  } = useInfiniteQuery<PaginatedQuestions>({
    queryKey: ['tarot-questions', id],
    queryFn: ({ pageParam }) => 
      tarotApi.questions.getByContextSlugPaginated(id as string, pageParam as number),
    getNextPageParam: (lastPage, pages) => 
      lastPage.hasMore ? pages.length + 1 : undefined,
    initialPageParam: 1,
  });

  const questions = data?.pages.flatMap(page => page.items) ?? [];

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
  };

  const handleQuestionPress = (question: Question) => {
    // TODO: Navigate to spread type selection screen
    console.log('Selected question:', question);
  };

  if (isLoading) {
    return (
      <LinearGradient
        colors={['#2D1B69', '#4A1B6D', '#1F1135']}
        style={styles.loadingContainer}
      >
        <ActivityIndicator size="large" color="#fff" />
      </LinearGradient>
    );
  }

  if (isError) {
    return (
      <LinearGradient
        colors={['#2D1B69', '#4A1B6D', '#1F1135']}
        style={styles.errorContainer}
      >
        <ThemedText style={styles.errorText}>
          {error instanceof Error ? error.message : 'Không thể tải dữ liệu. Vui lòng thử lại sau.'}
        </ThemedText>
        <TouchableOpacity onPress={() => refetch()} style={styles.retryButton}>
          <ThemedText>Thử lại</ThemedText>
        </TouchableOpacity>
      </LinearGradient>
    );
  }

  return (
    <>
      <Stack.Screen 
        options={{
          title: context?.name || 'Câu hỏi Tarot',
          headerStyle: {
            backgroundColor: '#2D1B69',
          },
          headerTintColor: '#fff',
        }} 
      />
     
      <LinearGradient
        colors={['#2D1B69', '#4A1B6D', '#1F1135']}
        style={styles.container}
      >
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={{
            paddingBottom: insets.bottom + 80,
          }}
          onScroll={({ nativeEvent }) => {
            const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
            const isCloseToBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height - 20;
            
            if (isCloseToBottom) {
              handleLoadMore();
            }
          }}
          scrollEventThrottle={400}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              tintColor="#fff"
            />
          }
        >
          <ThemedView style={styles.content}>
            <ThemedText type="subtitle" style={styles.subtitle}>
              Chọn câu hỏi bạn muốn khám phá
            </ThemedText>

            <ThemedView style={styles.questionsList}>
              {questions.length === 0 ? (
                <ThemedView style={styles.emptyContainer}>
                  <MaterialCommunityIcons
                    name="card-search"
                    size={64}
                    color="rgba(255,255,255,0.5)"
                    style={styles.emptyIcon}
                  />
                  <ThemedText style={styles.emptyTitle}>
                    Chưa có câu hỏi nào
                  </ThemedText>
                  <ThemedText style={styles.emptyDescription}>
                    Hiện tại chưa có câu hỏi nào cho chủ đề này. Vui lòng quay lại sau.
                  </ThemedText>
                </ThemedView>
              ) : (
                <>
                  {questions.map((question) => (
                    <TouchableOpacity
                      key={question._id}
                      style={styles.questionCard}
                      onPress={() => handleQuestionPress(question)}
                    >
                      <LinearGradient
                        colors={['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)']}
                        style={styles.cardGradient}
                      >
                        <MaterialCommunityIcons
                          name="cards"
                          size={24}
                          color="#fff"
                          style={styles.icon}
                        />
                        <ThemedView style={styles.questionContent}>
                          <ThemedText style={styles.questionTitle}>
                            {question.title}
                          </ThemedText>
                          <ThemedText style={styles.questionDescription} numberOfLines={2}>
                            {question.content}
                          </ThemedText>
                          {question.keywords.length > 0 && (
                            <ThemedView style={styles.keywordsContainer}>
                              {question.keywords.map((keyword: string, index: number) => (
                                <ThemedText key={index} style={styles.keyword}>
                                  #{keyword}
                                </ThemedText>
                              ))}
                            </ThemedView>
                          )}
                        </ThemedView>
                      </LinearGradient>
                    </TouchableOpacity>
                  ))}
                  
                  {isFetchingNextPage && (
                    <ThemedView style={styles.loadingMoreContainer}>
                      <ActivityIndicator size="small" color="#fff" />
                    </ThemedView>
                  )}
                </>
              )}
            </ThemedView>
          </ThemedView>
        </ScrollView>
      </LinearGradient>
    </>
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    textAlign: 'center',
    marginBottom: 16,
    opacity: 0.7,
  },
  retryButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
    backgroundColor: 'transparent',
  },
  subtitle: {
    opacity: 0.7,
    marginBottom: 24,
    textAlign: 'center',
  },
  questionsList: {
    gap: 16,
  },
  questionCard: {
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
  },
  cardGradient: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  icon: {
    opacity: 0.7,
  },
  questionContent: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  questionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  questionDescription: {
    fontSize: 14,
    opacity: 0.7,
    lineHeight: 20,
  },
  keywordsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
    backgroundColor: 'transparent',
  },
  keyword: {
    fontSize: 12,
    opacity: 0.5,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
  },
  emptyIcon: {
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyDescription: {
    fontSize: 14,
    opacity: 0.7,
    textAlign: 'center',
    lineHeight: 20,
  },
  loadingMoreContainer: {
    padding: 16,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
}); 