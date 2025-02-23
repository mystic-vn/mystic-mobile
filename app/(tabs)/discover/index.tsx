import { StyleSheet, ScrollView, Pressable, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

import { IconSymbol } from '@/components/ui/IconSymbol';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

const { width } = Dimensions.get('window');
const CARD_PADDING = 20;
const CARD_WIDTH = width - (CARD_PADDING * 2);

const MYSTIC_ITEMS = [
  {
    id: 'tarot',
    title: 'Tarot',
    description: 'Khám phá bộ bài Tarot huyền bí',
    icon: 'wand.and.stars',
    colors: ['#9f7aea', '#805ad5'],
  },
  {
    id: 'oracle',
    title: 'Oracle',
    description: 'Thông điệp từ thế giới tâm linh',
    icon: 'moon.stars',
    colors: ['#667eea', '#764ba2'],
  },
  {
    id: 'numerology',
    title: 'Thần Số Học',
    description: 'Khám phá con số định mệnh của bạn',
    icon: 'number',
    colors: ['#f687b3', '#ed64a6'],
  },
  {
    id: 'zodiac',
    title: 'Cung Hoàng Đạo',
    description: 'Khám phá năng lượng của các vì sao',
    icon: 'sparkles',
    colors: ['#fbd38d', '#ed8936'],
  },
];

export default function DiscoverScreen() {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <ThemedView style={styles.header}>
        <ThemedText type="title" style={styles.title}>Khám Phá</ThemedText>
        <ThemedText type="subtitle" style={styles.subtitle}>Hành trình tìm hiểu thế giới huyền bí</ThemedText>
      </ThemedView>

      <ThemedView style={styles.cardsContainer}>
        {MYSTIC_ITEMS.map((item) => (
          <Pressable
            key={item.id}
            style={styles.card}
            onPress={() => router.push(`/discover/${item.id}`)}>
            <LinearGradient
              colors={item.colors as any}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.cardGradient}>
              <BlurView intensity={20} style={styles.cardContent}>
                <ThemedView style={styles.iconContainer}>
                  <IconSymbol name={item.icon as any} size={32} color="#fff" />
                </ThemedView>
                <ThemedView style={styles.cardTextContainer}>
                  <ThemedText type="subtitle" style={styles.cardTitle}>{item.title}</ThemedText>
                  <ThemedText style={styles.cardDescription}>{item.description}</ThemedText>
                </ThemedView>
              </BlurView>
            </LinearGradient>
          </Pressable>
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
    padding: CARD_PADDING,
    paddingTop: 60,
    marginBottom: 10,
  },
  title: {
    marginBottom: 8,
    lineHeight:80
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