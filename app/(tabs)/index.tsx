import { Image, StyleSheet, Platform, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function HomeScreen() {
  const tempImage = require('@/assets/images/logo.png');
  
  return (
    <ScrollView style={styles.container}>
     
      <ThemedView style={styles.headerGradient} >
      <Image 
          source={tempImage}
          style={styles.headerLogo}
        />
        <ThemedText style={styles.headerTitle}>Mystic</ThemedText>
        <ThemedText style={styles.headerSubtitle}>Khám phá thế giới huyền bí</ThemedText>
      </ThemedView>
      <ThemedView style={styles.categoriesContainer}>
        <TouchableOpacity style={styles.categoryCard}>
          <LinearGradient
            colors={['#4a2b7e', '#2d1b4f']}
            style={styles.categoryGradient}>
            <Image 
              source={tempImage}
              style={styles.categoryImage}
            />
            <ThemedText style={styles.categoryTitle}>Tarot</ThemedText>
            <ThemedText style={styles.categoryDesc}>Khám phá những thông điệp từ lá bài</ThemedText>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity style={styles.categoryCard}>
          <LinearGradient
            colors={['#7e2b5e', '#4f1b3d']}
            style={styles.categoryGradient}>
            <Image
              source={tempImage}
              style={styles.categoryImage}
            />
            <ThemedText style={styles.categoryTitle}>Oracle</ThemedText>
            <ThemedText style={styles.categoryDesc}>Thông điệp từ các thiên thần</ThemedText>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity style={styles.categoryCard}>
          <LinearGradient
            colors={['#2b7e6f', '#1b4f46']}
            style={styles.categoryGradient}>
            <Image
              source={tempImage}
              style={styles.categoryImage}
            />
            <ThemedText style={styles.categoryTitle}>Thần Số Học</ThemedText>
            <ThemedText style={styles.categoryDesc}>Khám phá bản thân bạn qua những con số</ThemedText>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity style={styles.categoryCard}>
          <LinearGradient
            colors={['#7e612b', '#4f3d1b']}
            style={styles.categoryGradient}>
            <Image
              source={tempImage}
              style={styles.categoryImage}
            />
            <ThemedText style={styles.categoryTitle}>Chiêm Tinh</ThemedText>
            <ThemedText style={styles.categoryDesc}>Khám phá bản đồ sao của bạn</ThemedText>
          </LinearGradient>
        </TouchableOpacity>
      </ThemedView>

      <ThemedView style={styles.featuredSection}>
        <ThemedText style={styles.sectionTitle}>Đọc nhiều nhất</ThemedText>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.featuredScroll}>
          <TouchableOpacity style={styles.featuredCard}>
            <LinearGradient
              colors={['#2b4a7e', '#1b2d4f']}
              style={styles.featuredGradient}>
              <Image
                source={tempImage}
                style={styles.featuredImage}
              />
              <ThemedText style={styles.featuredTitle}>Bài Tarot hôm nay</ThemedText>
              <ThemedText style={styles.featuredDesc}>Thông điệp dành cho bạn</ThemedText>
            </LinearGradient>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.featuredCard}>
            <LinearGradient
              colors={['#7e2b4a', '#4f1b2d']}
              style={styles.featuredGradient}>
              <Image
                source={tempImage}
                style={styles.featuredImage}
              />
              <ThemedText style={styles.featuredTitle}>Số chủ đạo</ThemedText>
              <ThemedText style={styles.featuredDesc}>Khám phá con số của bạn</ThemedText>
            </LinearGradient>
          </TouchableOpacity>
        </ScrollView>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom:80,
  },
  headerGradient: {
    padding: 20,
    height: 250,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  headerLogo: {
    width: 120,
    height: 120,
    marginBottom: 15,
  },
  headerTitle: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
    lineHeight: 48,
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
    padding: 15,
    alignItems: 'center',
    borderRadius: 15,
  },
  categoryImage: {
    width: 50,
    height: 50,
    marginBottom: 10,
    borderRadius: 25,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#fff',
  },
  categoryDesc: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
  },
  featuredSection: {
    padding: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#fff',
  },
  featuredScroll: {
    flexDirection: 'row',
  },
  featuredCard: {
    width: 200,
    marginRight: 15,
    borderRadius: 15,
    overflow: 'hidden',
  },
  featuredGradient: {
    padding: 15,
    alignItems: 'center',
    borderRadius: 15,
    height: 200,
  },
  featuredImage: {
    width: 80,
    height: 80,
    marginBottom: 15,
    borderRadius: 40,
  },
  featuredTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#fff',
    textAlign: 'center',
  },
  featuredDesc: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
  },
});
