import { Image, StyleSheet, Platform, TouchableOpacity, View, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { memo } from 'react';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';

const { width, height } = Dimensions.get('window');

// Memoize các components để tránh re-render
const MemoizedLogo = memo(() => (
  <View style={styles.logoContainer}>
    <View style={styles.glow} />
    <Image 
      source={require('@/assets/images/logo.png')}
      style={styles.logo}
      resizeMode="contain"
    />
  </View>
));

const MemoizedButton = memo(({ onPress }: { onPress: () => void }) => (
  <TouchableOpacity style={styles.button} onPress={onPress}>
    <LinearGradient
      colors={['rgba(159,122,234,0.3)', 'rgba(159,122,234,0.1)']}
      style={styles.buttonContent}>
      <ThemedText style={styles.buttonText}>Khám phá ngay</ThemedText>
      <IconSymbol name="chevron.right" size={20} color="#fff" />
    </LinearGradient>
  </TouchableOpacity>
));

export default function HomeScreen() {
  return (
    <ThemedView style={styles.container}>
      <LinearGradient
        colors={['#2D1B69', '#4A1B6D', '#1F1135']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.content}>
        
        <MemoizedLogo />

        <View style={styles.textContainer}>
          <ThemedText style={styles.title}>
            Mystic{'\n'}
            Journey
          </ThemedText>
          <ThemedText style={styles.description}>
            Khám phá thế giới tâm linh huyền bí{'\n'}
            cùng Mystic Journey
          </ThemedText>
        </View>

        <MemoizedButton onPress={() => router.push('/discover')} />
      </LinearGradient>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  logoContainer: {
    marginBottom: 40,
    alignItems: 'center',
  },
  logo: {
    width: width * 0.35,
    height: width * 0.35,
  },
  glow: {
    position: 'absolute',
    width: width * 0.4,
    height: width * 0.4,
    borderRadius: width * 0.2,
    backgroundColor: 'rgba(159,122,234,0.15)',
    transform: [{ scale: 1.2 }],
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  title: {
    marginBottom: 16,
    textAlign: 'center',
    fontSize: 42,
    letterSpacing: 2,
    lineHeight: 50,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    opacity: 0.8,
    maxWidth: '80%',
    letterSpacing: 0.5,
  },
  button: {
    width: '70%',
    height: 50,
    borderRadius: 25,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(159,122,234,0.3)',
  },
  buttonContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});
