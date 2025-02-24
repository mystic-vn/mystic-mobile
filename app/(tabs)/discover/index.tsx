import { StyleSheet, ScrollView, Pressable, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { memo } from 'react';

import { IconSymbol } from '@/components/ui/IconSymbol';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

const { width } = Dimensions.get('window');
const CARD_PADDING = 20;
const CARD_WIDTH = width - (CARD_PADDING * 2);

type MysticItem = {
  id: string;
  title: string;
  description: string;
  icon: string;
  colors: readonly [string, string];
};

const MYSTIC_ITEMS: MysticItem[] = [
  {
    id: 'tarot',
    title: 'Tarot',
    description: 'Khám phá bộ bài Tarot huyền bí',
    icon: 'wand.and.stars',
    colors: ['#9f7aea', '#805ad5'] as const,
  },
  {
    id: 'oracle',
    title: 'Oracle',
    description: 'Thông điệp từ thế giới tâm linh',
    icon: 'moon.stars',
    colors: ['#667eea', '#764ba2'] as const,
  },
  {
    id: 'numerology',
    title: 'Thần Số Học',
    description: 'Khám phá con số định mệnh của bạn',
    icon: 'number',
    colors: ['#f687b3', '#ed64a6'] as const,
  },
  {
    id: 'zodiac',
    title: 'Cung Hoàng Đạo',
    description: 'Khám phá năng lượng của các vì sao',
    icon: 'sparkles',
    colors: ['#fbd38d', '#ed8936'] as const,
  },
];

// Memoize card component
const MysticCard = memo(({ item, onPress }: {
  item: MysticItem;
  onPress: () => void;
}) => (
  <Pressable style={styles.card} onPress={onPress}>
    <LinearGradient
      colors={item.colors}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.cardGradient}>
      <ThemedView style={styles.cardContent}>
        <ThemedView style={styles.iconContainer}>
          <IconSymbol name={item.icon as any} size={32} color="#fff" />
        </ThemedView>
        <ThemedView style={styles.cardTextContainer}>
          <ThemedText type="subtitle" style={styles.cardTitle}>{item.title}</ThemedText>
          <ThemedText style={styles.cardDescription}>{item.description}</ThemedText>
        </ThemedView>
      </ThemedView>
    </LinearGradient>
  </Pressable>
));

// Memoize header component
const Header = memo(() => (
  <ThemedView style={styles.header}>
    <ThemedText type="title" style={styles.title}>Khám Phá</ThemedText>
    <ThemedText type="subtitle" style={styles.subtitle}>
      Hành trình tìm hiểu thế giới huyền bí
    </ThemedText>
  </ThemedView>
));

export default function DiscoverScreen() {
  return (
    <LinearGradient
      colors={['#2D1B69', '#4A1B6D', '#1F1135']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={true}>
        <Header />

        <ThemedView style={styles.cardsContainer}>
          {MYSTIC_ITEMS.map((item) => (
            <MysticCard
              key={item.id}
              item={item}
              onPress={() => router.push('/(tabs)/discover/' + item.id as any)}
            />
          ))}
        </ThemedView>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: CARD_PADDING,
    paddingTop: 60,
    marginBottom: 10,
  },
  title: {
    marginBottom: 8,
    lineHeight: 80,
  },
  subtitle: {
    opacity: 0.7,
  },
  cardsContainer: {
    paddingHorizontal: CARD_PADDING,
  },
  card: {
    width: CARD_WIDTH,
    marginBottom: 15,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  cardGradient: {
    height: 100,
  },
  cardContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTextContainer: {
    flex: 1,
    marginLeft: 15,
  },
  cardTitle: {
    color: '#fff',
    marginBottom: 4,
  },
  cardDescription: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 14,
    lineHeight: 20,
  },
});