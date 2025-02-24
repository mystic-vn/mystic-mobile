import React from 'react';
import { StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { router } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { tarotApi, TarotContext } from '@/constants/endpoints/tarot';
import { Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';

const getContextIcon = (type: string, name: string) => {
  // Xử lý theo tên context trước
  switch (name.toLowerCase()) {
    case 'tình yêu':
      return 'heart-multiple';  // Icon trái tim đôi
    case 'gia đạo':
      return 'home-heart';  // Icon nhà với trái tim
    case 'gia đình':
      return 'account-group';  // Icon nhóm người
    case 'công việc':
      return 'briefcase';  // Icon cặp công việc
    case 'tài chính':
      return 'cash-multiple';  // Icon nhiều tờ tiền
    case 'sức khỏe':
      return 'heart-pulse';  // Icon nhịp tim
    case 'tâm linh':
      return 'meditation';  // Icon thiền định
  }

  // Fallback theo type nếu không match với tên
  switch (type) {
    case 'relationship':
      return 'heart';
    case 'career':
      return 'briefcase';
    case 'finance':
      return 'cash';
    case 'social':
      return 'account-group';
    default:
      return 'cards';
  }
};

export default function TarotScreen() {
  const insets = useSafeAreaInsets();
  
  const { data: contexts = [], isLoading, isError, error, refetch } = useQuery<TarotContext[]>({
    queryKey: ['tarot-contexts'],
    queryFn: () => tarotApi.contexts.getAll(),
  });

  const handleContextPress = (context: TarotContext) => {
    router.push({
      pathname: '/discover/tarot/[id]/questions',
      params: { id: context.slug }
    });
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Bói Bài Tarot',
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
        >
          <ThemedView style={styles.content}>
            <ThemedText type="subtitle" style={styles.subtitle}>
              Chọn chủ đề bạn muốn khám phá
            </ThemedText>

            {isLoading ? (
              <ThemedView style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#fff" />
              </ThemedView>
            ) : isError ? (
              <ThemedView style={styles.errorContainer}>
                <ThemedText style={styles.errorText}>
                  {error instanceof Error ? error.message : 'Không thể tải dữ liệu. Vui lòng thử lại sau.'}
                </ThemedText>
                <TouchableOpacity
                  onPress={() => refetch()}
                  style={styles.retryButton}
                >
                  <ThemedText>Thử lại</ThemedText>
                </TouchableOpacity>
              </ThemedView>
            ) : (
              <ThemedView style={styles.grid}>
                {contexts.map((context) => (
                  <TouchableOpacity
                    key={context._id}
                    style={styles.contextCard}
                    onPress={() => handleContextPress(context)}
                  >
                    <LinearGradient
                      colors={['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)']}
                      style={styles.cardGradient}
                    >
                      <MaterialCommunityIcons
                        name={getContextIcon(context.type, context.name)}
                        size={32}
                        color="#fff"
                        style={styles.icon}
                      />
                      <ThemedText type="subtitle" style={styles.contextName}>
                        {context.name}
                      </ThemedText>
                      <ThemedText style={styles.contextDescription}>
                        {context.description}
                      </ThemedText>
                    </LinearGradient>
                  </TouchableOpacity>
                ))}
              </ThemedView>
            )}
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
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  contextCard: {
    width: '48%', // Chia làm 2 cột với khoảng cách
    aspectRatio: 1,
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  cardGradient: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    marginBottom: 12,
  },
  contextName: {
    textAlign: 'center',
    marginBottom: 8,
    fontWeight: '600',
    fontSize: 16,
  },
  contextDescription: {
    fontSize: 12,
    textAlign: 'center',
    opacity: 0.7,
    lineHeight: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 200,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
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
}); 