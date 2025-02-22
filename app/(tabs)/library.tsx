import { ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';

export default function LibraryScreen() {
  const categories = [
    {
      id: 1,
      title: 'Tarot',
      description: 'Bộ sưu tập các bộ bài Tarot',
      icon: 'sparkles',
      colors: ['#4a2b7e', '#2d1b4f'],
    },
    {
      id: 2,
      title: 'Oracle',
      description: 'Thông điệp từ các thiên thần',
      icon: 'moon.stars.fill',
      colors: ['#7e2b5e', '#4f1b3d'],
    },
    {
      id: 3,
      title: 'Thần Số Học',
      description: 'Khám phá ý nghĩa các con số',
      icon: 'number.circle.fill',
      colors: ['#2b7e6f', '#1b4f46'],
    },
    {
      id: 4,
      title: 'Chiêm Tinh',
      description: 'Kiến thức về 12 cung hoàng đạo',
      icon: 'star.fill',
      colors: ['#7e612b', '#4f3d1b'],
    },
    {
      id: 5,
      title: 'Khóa học',
      description: 'Các khóa học về huyền học',
      icon: 'book.fill',
      colors: ['#2b4a7e', '#1b2d4f'],
    },
    {
      id: 6,
      title: 'Bài viết',
      description: 'Blog và các bài viết chuyên sâu',
      icon: 'doc.text.fill',
      colors: ['#7e2b4a', '#4f1b2d'],
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText style={styles.headerTitle}>Thư Viện</ThemedText>
        <ThemedText style={styles.headerSubtitle}>Khám phá kho tàng kiến thức huyền bí</ThemedText>
      </ThemedView>

      <ThemedView style={styles.categoriesContainer}>
        {categories.map((category) => (
          <TouchableOpacity key={category.id} style={styles.categoryCard}>
            <LinearGradient colors={category.colors} style={styles.categoryGradient}>
              <IconSymbol name={category.icon} size={32} color="#fff" />
              <ThemedText style={styles.categoryTitle}>{category.title}</ThemedText>
              <ThemedText style={styles.categoryDesc}>{category.description}</ThemedText>
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 60,
  },
  headerTitle: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
    lineHeight:70,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
  },
  categoriesContainer: {
    padding: 15,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryCard: {
    width: '48%',
    marginBottom: 15,
    borderRadius: 15,
    overflow: 'hidden',
  },
  categoryGradient: {
    padding: 20,
    alignItems: 'center',
    borderRadius: 15,
    minHeight: 150,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 5,
    color: '#fff',
    textAlign: 'center',
  },
  categoryDesc: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
  },
}); 