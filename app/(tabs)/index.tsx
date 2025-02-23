import { Image, StyleSheet, Platform, TouchableOpacity, Animated, Dimensions, Easing, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useRef } from 'react';
import { router } from 'expo-router';
import { BlurView } from 'expo-blur';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';

const { width, height } = Dimensions.get('window');

const STAR_COUNT = 50;

export default function HomeScreen() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0.4)).current;
  const starsAnim = Array(STAR_COUNT).fill(0).map(() => ({
    opacity: useRef(new Animated.Value(Math.random())).current,
    scale: useRef(new Animated.Value(Math.random())).current,
  }));

  useEffect(() => {
    // Logo animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 2000,
        easing: Easing.out(Easing.back(1.5)),
        useNativeDriver: true,
      }),
    ]).start();

    // Rotating animation
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 20000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    // Glow animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0.4,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Stars twinkling
    starsAnim.forEach(star => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(star.opacity, {
            toValue: Math.random(),
            duration: 1000 + Math.random() * 2000,
            useNativeDriver: true,
          }),
          Animated.timing(star.scale, {
            toValue: Math.random(),
            duration: 1000 + Math.random() * 2000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    });
  }, []);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <ThemedView style={styles.container}>
      <LinearGradient
        colors={['#2D1B69', '#4A1B6D', '#1F1135']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.content}>
        
        {/* Stars Background */}
        {starsAnim.map((star, index) => (
          <Animated.View
            key={index}
            style={[
              styles.star,
              {
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                opacity: star.opacity,
                transform: [{ scale: star.scale }],
              },
            ]}
          />
        ))}

        {/* Mystic Circle */}
        <Animated.View
          style={[
            styles.mysticCircle,
            {
              opacity: fadeAnim,
              transform: [
                { rotate: spin },
                { scale: scaleAnim }
              ],
            },
          ]}>
          <LinearGradient
            colors={['rgba(159,122,234,0.05)', 'rgba(159,122,234,0.02)']}
            style={styles.circleGradient}
          />
        </Animated.View>

        {/* Inner Circle */}
        <Animated.View
          style={[
            styles.innerCircle,
            {
              opacity: fadeAnim,
              transform: [
                { rotate: spin },
                { scale: scaleAnim }
              ],
            },
          ]}>
          <LinearGradient
            colors={['rgba(159,122,234,0.1)', 'transparent']}
            style={styles.innerGradient}
          />
        </Animated.View>

        {/* Logo */}
        <Animated.View
          style={[
            styles.logoContainer,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}>
          <Image 
            source={require('@/assets/images/logo.png')}
            style={styles.logo}
          />
          <Animated.View
            style={[
              styles.glow,
              {
                opacity: glowAnim,
              },
            ]}
          />
        </Animated.View>
        
        {/* Welcome Text */}
        <Animated.View
          style={[
            styles.textContainer,
            {
              opacity: fadeAnim,
            },
          ]}>
          <ThemedText type="title" style={styles.title}>
            Mystic
          </ThemedText>
          <ThemedText style={styles.description}>
            Khám phá những điều kỳ diệu trong vũ trụ tâm linh
          </ThemedText>
        </Animated.View>

        {/* Start Button */}
        <TouchableOpacity
          onPress={() => router.push('/(tabs)/discover')}
          style={styles.button}>
          <LinearGradient
            colors={['rgba(159,122,234,0.3)', 'rgba(159,122,234,0.1)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.buttonContent}>
            <IconSymbol name="sparkles" size={20} color="#fff" />
            <ThemedText style={styles.buttonText}>
              Bắt đầu hành trình
            </ThemedText>
          </LinearGradient>
        </TouchableOpacity>
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
  star: {
    position: 'absolute',
    width: 3,
    height: 3,
    backgroundColor: '#fff',
    borderRadius: 1.5,
  },
  mysticCircle: {
    position: 'absolute',
    width: width * 0.85,
    height: width * 0.85,
    borderRadius: width * 0.425,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(159,122,234,0.1)',
  },
  circleGradient: {
    width: '100%',
    height: '100%',
    borderRadius: width * 0.425,
  },
  innerCircle: {
    position: 'absolute',
    width: width * 0.65,
    height: width * 0.65,
    borderRadius: width * 0.325,
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ rotate: '45deg' }],
  },
  innerGradient: {
    width: '100%',
    height: '100%',
    borderRadius: width * 0.325,
    borderWidth: 1,
    borderColor: 'rgba(159,122,234,0.05)',
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
