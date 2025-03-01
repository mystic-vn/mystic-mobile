import React, { useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Image, Dimensions, Animated, Easing } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ThemedText } from '@components/ThemedText';
import { ThemedView } from '@components/ThemedView';
import { router, useLocalSearchParams, Stack } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { tarotApi, SpreadType, Card, Question, ReadingAnalysis, TarotContext } from '@constants/endpoints/tarot';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.4;
const CARD_HEIGHT = CARD_WIDTH * 1.75;

// Thêm type cho mutation data
type CreateAnalysisData = {
  spreadTypeId: string;
  context: string;
  questionId?: string;
  cards: {
    cardId: string;
    position: number;
    aspect: string;
    isReversed: boolean;
  }[];
};

// Thêm component LoadingAnalysis
const LoadingAnalysis = () => {
  const [rotation] = useState(new Animated.Value(0));
  const [scale] = useState(new Animated.Value(1));

  useEffect(() => {
    // Hiệu ứng xoay liên tục
    Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    // Hiệu ứng co giãn
    Animated.loop(
      Animated.sequence([
        Animated.timing(scale, {
          toValue: 1.2,
          duration: 1000,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1,
          duration: 1000,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const spin = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <LinearGradient
      colors={['#2D1B69', '#4A1B6D', '#1F1135']}
      style={styles.loadingContainer}
    >
      <ThemedView style={styles.loadingContent}>
        <Animated.View
          style={[
            styles.loadingIconContainer,
            {
              transform: [
                { rotate: spin },
                { scale: scale }
              ],
            },
          ]}
        >
          <MaterialCommunityIcons
            name="cards"
            size={48}
            color="#fff"
          />
        </Animated.View>
        <ThemedText style={styles.loadingText}>
          Đang phân tích trải bài của bạn...
        </ThemedText>
        <ThemedText style={styles.loadingSubText}>
          Xin vui lòng chờ trong giây lát
        </ThemedText>
      </ThemedView>
    </LinearGradient>
  );
};

export default function SpreadScreen() {
  const { id, questionId } = useLocalSearchParams<{ id: string; questionId: string }>();
  const insets = useSafeAreaInsets();
  const queryClient = useQueryClient();
  
  const [selectedCards, setSelectedCards] = useState<{cardId: string, position: number}[]>([]);
  const [isShuffling, setIsShuffling] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<ReadingAnalysis | null>(null);
  const [shuffleRotation, setShuffleRotation] = useState(0);
  const [shuffleScale, setShuffleScale] = useState(1);

  const handleReset = () => {
    router.back();
    setTimeout(() => {
      router.back();
    }, 100);
  };

  // Fetch question details (which includes spread type)
  const { data: question, isLoading: loadingQuestion } = useQuery<Question>({
    queryKey: ['question', questionId],
    queryFn: () => tarotApi.questions.getById(questionId),
  });

  // Fetch context details to get the ID
  const { data: context } = useQuery<TarotContext>({
    queryKey: ['tarot-context', id],
    queryFn: () => tarotApi.contexts.getBySlug(id as string),
  });

  // Fetch all cards
  const { data: cards, isLoading: loadingCards, error: cardsError } = useQuery<Card[]>({
    queryKey: ['cards'],
    queryFn: async () => {
      try {
        const response = await tarotApi.cards.getAllWithoutPagination();
        console.log('Cards response:', response);
        return response;
      } catch (error) {
        console.error('Error fetching cards:', error);
        throw error;
      }
    },
    enabled: true,
  });

  // Mutation for creating reading analysis
  const { mutate: createAnalysis, isPending: isAnalyzing, error: analysisError } = useMutation<
    ReadingAnalysis,
    Error,
    CreateAnalysisData
  >({
    mutationFn: async (data) => {
      try {
        const response = await tarotApi.readingAnalysis.create(data);
        console.log('Analysis response:', response);
        return response;
      } catch (error: any) {
        console.error('Analysis error:', error.response?.data || error);
        throw error;
      }
    },
    onSuccess: (data) => {
      console.log('Analysis created successfully:', data);
      setAnalysisResult(data);
    },
    onError: (error: Error) => {
      console.error('Analysis creation failed:', error);
      // TODO: Hiển thị thông báo lỗi cho người dùng
    }
  });

  // Thêm hàm shuffle cards
  const shuffleCards = (cards: Card[]) => {
    const shuffled = [...cards];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Thêm hàm xử lý việc rút bài
  const handleDrawCards = () => {
    if (!cards || !question) return;
    
    setIsShuffling(true);
    
    // Tạo hiệu ứng shuffle
    let rotationInterval: NodeJS.Timeout;
    let scaleInterval: NodeJS.Timeout;
    
    // Hiệu ứng xoay
    rotationInterval = setInterval(() => {
      setShuffleRotation(prev => (prev + 45) % 360);
    }, 200);

    // Hiệu ứng co giãn
    scaleInterval = setInterval(() => {
      setShuffleScale(prev => prev === 1 ? 0.8 : 1);
    }, 300);
    
    // Tạo hiệu ứng shuffle trong 2 giây
    setTimeout(() => {
      clearInterval(rotationInterval);
      clearInterval(scaleInterval);
      setShuffleRotation(0);
      setShuffleScale(1);
      
      const shuffled = shuffleCards(cards);
      const drawnCards = shuffled.slice(0, question.positions.length);
      const selected = drawnCards.map((card, index) => ({
        cardId: card._id,
        position: index
      }));
      
      setSelectedCards(selected);
      setIsShuffling(false);
    }, 2000);
  };

  const handleSubmit = () => {
    if (!question?.spreadType || !context?._id || selectedCards.length !== question.positions.length) {
      return;
    }

    // Tạo data với đầy đủ thông tin theo yêu cầu của backend
    const analysisData: CreateAnalysisData = {
      spreadTypeId: question.spreadType,
      context: context._id,
      questionId: questionId,
      cards: selectedCards.map((card, index) => ({
        cardId: card.cardId,
        position: card.position,
        aspect: question.positions[index].aspect || 'general',
        isReversed: false,
      })),
    };

    // Log data trước khi gửi
    console.log('Submitting analysis data:', JSON.stringify(analysisData, null, 2));

    createAnalysis(analysisData);
  };

  if (loadingQuestion || loadingCards) {
    return (
      <LinearGradient
        colors={['#2D1B69', '#4A1B6D', '#1F1135']}
        style={styles.loadingContainer}
      >
        <ActivityIndicator size="large" color="#fff" />
      </LinearGradient>
    );
  }

  if (cardsError) {
    console.error('Cards error details:', cardsError);
    return (
      <LinearGradient
        colors={['#2D1B69', '#4A1B6D', '#1F1135']}
        style={styles.errorContainer}
      >
        <ThemedText style={styles.errorText}>
          {cardsError instanceof Error 
            ? `Lỗi: ${cardsError.message}`
            : 'Không thể tải dữ liệu lá bài. Vui lòng thử lại sau.'}
        </ThemedText>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={() => {
            // Thử lại cả 2 query
            queryClient.invalidateQueries({ queryKey: ['cards'] });
            queryClient.invalidateQueries({ queryKey: ['question', questionId] });
          }}
        >
          <ThemedText style={styles.retryButtonText}>Thử lại</ThemedText>
        </TouchableOpacity>
      </LinearGradient>
    );
  }

  if (analysisResult) {
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
            paddingBottom: insets.bottom + 85,
          }}
        >
          {/* Tổng quan */}
          <ThemedView style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Tổng quan</ThemedText>
            <ThemedText style={styles.text}>{analysisResult.analysis.overview}</ThemedText>
          </ThemedView>

          {/* Chi tiết từng lá bài */}
          <ThemedView style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Chi tiết các lá bài</ThemedText>
            {analysisResult.analysis.positionAnalyses.map((position, index) => {
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
            <ThemedText style={styles.text}>{analysisResult.analysis.conclusion}</ThemedText>
          </ThemedView>

          <TouchableOpacity
            style={[styles.submitButton, styles.resetButton]}
            onPress={handleReset}
          >
            <ThemedText style={styles.submitButtonText}>
              Trải bài mới
            </ThemedText>
          </TouchableOpacity>
        </ScrollView>
      </LinearGradient>
    );
  }

  if (isAnalyzing) {
    return <LoadingAnalysis />;
  }

  return (
    <LinearGradient
      colors={['#2D1B69', '#4A1B6D', '#1F1135']}
      style={styles.container}
    >
      <Stack.Screen 
        options={{
          title: 'Trải Bài Tarot',
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
        {question && (
          <>
            <ThemedView style={styles.questionContainer}>
              <ThemedText style={styles.questionTitle}>{question.title}</ThemedText>
              <ThemedText style={styles.questionContent}>{question.content}</ThemedText>
            </ThemedView>

            {selectedCards.length === 0 && (
              <TouchableOpacity
                style={[styles.submitButton, styles.shuffleButton]}
                onPress={handleDrawCards}
                disabled={isShuffling}
              >
                {isShuffling ? (
                  <>
                    <MaterialCommunityIcons
                      name="cards"
                      size={24}
                      color="#fff"
                      style={[
                        styles.shuffleIcon,
                        {
                          transform: [
                            { rotate: `${shuffleRotation}deg` },
                            { scale: shuffleScale }
                          ]
                        }
                      ]}
                    />
                    <ThemedText style={styles.submitButtonText}>
                      Đang trộn bài...
                    </ThemedText>
                  </>
                ) : (
                  <>
                    <MaterialCommunityIcons
                      name="cards"
                      size={24}
                      color="#fff"
                      style={styles.shuffleIcon}
                    />
                    <ThemedText style={styles.submitButtonText}>
                      Bắt đầu trải bài
                    </ThemedText>
                  </>
                )}
              </TouchableOpacity>
            )}

            <ThemedView style={styles.spreadPositions}>
              {question.positions.map((position, index) => {
                const selectedCard = selectedCards.find(c => c.position === index);
                const card = selectedCard ? cards?.find(c => c._id === selectedCard.cardId) : null;
                const isLastCard = index === question.positions.length - 1;
                const isOddLastCard = isLastCard && question.positions.length % 2 !== 0;
                
                return (
                  <ThemedView 
                    key={index}
                    style={isOddLastCard ? styles.lastCardWrapper : styles.cardWrapper}
                  >
                    <ThemedView
                      style={[
                        styles.positionCard,
                        selectedCard && styles.positionCardSelected
                      ]}
                    >
                      {card ? (
                        <>
                          <Image
                            source={{ uri: card.imageUrl }}
                            style={styles.selectedCardImage}
                            resizeMode="contain"
                          />
                          <ThemedText style={styles.cardTitle}>
                            {card.name}
                          </ThemedText>
                        </>
                      ) : (
                        <>
                          <MaterialCommunityIcons
                            name="cards"
                            size={32}
                            color="rgba(255,255,255,0.5)"
                          />
                          <ThemedText style={styles.positionNumber}>
                            {index + 1}
                          </ThemedText>
                          <ThemedText style={styles.positionName}>
                            {position.aspect}
                          </ThemedText>
                        </>
                      )}
                    </ThemedView>
                  </ThemedView>
                );
              })}
            </ThemedView>

            {selectedCards.length === question.positions.length && (
              <TouchableOpacity
                style={[styles.submitButton, { marginBottom: insets.bottom + 20 }]}
                onPress={handleSubmit}
                disabled={isAnalyzing}
              >
                {isAnalyzing ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <ThemedText style={styles.submitButtonText}>
                    Phân tích trải bài
                  </ThemedText>
                )}
              </TouchableOpacity>
            )}
          </>
        )}
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
  scrollView: {
    flex: 1,
  },
  questionContainer: {
    padding: 20,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  questionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  questionContent: {
    fontSize: 14,
    opacity: 0.7,
    lineHeight: 20,
  },
  spreadPositions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 8,
  },
  cardWrapper: {
    width: '50%',
    paddingHorizontal: 8,
    marginBottom: 16,
    alignItems: 'center',
  },
  lastCardWrapper: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 16,
  },
  positionCard: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  positionCardSelected: {
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  positionNumber: {
    fontSize: 24,
    fontWeight: '600',
    marginTop: 8,
  },
  positionName: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 8,
    opacity: 0.7,
  },
  selectedCardImage: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
  },
  cardGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    justifyContent: 'space-between',
  },
  cardItem: {
    width: CARD_WIDTH,
    marginBottom: 16,
  },
  cardImage: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 16,
    marginBottom: 8,
  },
  cardName: {
    fontSize: 14,
    textAlign: 'center',
  },
  positionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  positionDescription: {
    fontSize: 14,
    opacity: 0.7,
    lineHeight: 20,
    marginBottom: 24,
  },
  submitButton: {
    backgroundColor: '#6B46C1',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 16,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  errorText: {
    textAlign: 'center',
    marginBottom: 16,
    opacity: 0.7,
  },
  retryButton: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  section: {
    padding: 16,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  text: {
    fontSize: 14,
    opacity: 0.7,
    lineHeight: 20,
  },
  cardAnalysis: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
    width: '100%',
  },
  resetButton: {
    marginBottom: 20,
  },
  shuffleButton: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 8,
    marginHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  shuffleIcon: {
    marginRight: 8,
  },
  positionAspect: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  loadingContent: {
    alignItems: 'center',
    padding: 20,
  },
  loadingIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  loadingText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  loadingSubText: {
    fontSize: 14,
    opacity: 0.7,
    textAlign: 'center',
  },
}); 