import { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');
const LOGO_SIZE = Math.min(width * 0.3, height * 0.15);
const CIRCLE_SIZE = Math.min(width * 0.7, height * 0.35);

export default function SplashScreen() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const innerRotateAnim = useRef(new Animated.Value(0)).current;

  const startAnimation = () => {
    return new Promise((resolve) => {
      // Hiệu ứng xoay vòng tròn
      Animated.loop(
        Animated.parallel([
          Animated.timing(rotateAnim, {
            toValue: 1,
            duration: 4000,
            useNativeDriver: true,
          }),
          Animated.timing(innerRotateAnim, {
            toValue: 1,
            duration: 3000,
            useNativeDriver: true,
          }),
        ])
      ).start();

      // Hiệu ứng xuất hiện logo
      Animated.sequence([
        // Logo xuất hiện từ từ
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.spring(scaleAnim, {
            toValue: 1,
            friction: 8,
            tension: 40,
            useNativeDriver: true,
          }),
        ]),
        // Dừng một chút để hiển thị logo
        Animated.delay(2000),
        // Hiệu ứng biến mất
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1.2,
            duration: 600,
            useNativeDriver: true,
          }),
        ]),
      ]).start(() => {
        resolve(true);
      });
    });
  };

  useEffect(() => {
    const initApp = async () => {
      try {
        // Chạy animation
        await startAnimation();
        
        // Kiểm tra token
        const token = await AsyncStorage.getItem('access_token');
        
        // Chuyển hướng dựa vào token
        if (token) {
          router.replace('/(tabs)');
        } else {
          router.replace('/auth/login');
        }
      } catch (error) {
        console.error('Error initializing app:', error);
      }
    };

    initApp();
  }, []);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const spinInner = innerRotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['360deg', '0deg'],
  });

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0A051E', '#1A0B3E', '#0A051E']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.content}>
        
        {/* Vòng tròn ngoài */}
        <Animated.View style={[styles.outerCircle, { transform: [{ rotate: spin }] }]}>
          <LinearGradient
            colors={['rgba(159,122,234,0.2)', 'transparent']}
            style={styles.circleGradient}
          />
        </Animated.View>

        {/* Vòng tròn trong */}
        <Animated.View style={[styles.innerCircle, { transform: [{ rotate: spinInner }] }]}>
          <LinearGradient
            colors={['rgba(159,122,234,0.15)', 'transparent']}
            style={styles.circleGradient}
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
            resizeMode="contain"
          />
        </Animated.View>
      </LinearGradient>
    </View>
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
  },
  outerCircle: {
    position: 'absolute',
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    borderWidth: 1,
    borderColor: 'rgba(159,122,234,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerCircle: {
    position: 'absolute',
    width: CIRCLE_SIZE * 0.7,
    height: CIRCLE_SIZE * 0.7,
    borderRadius: (CIRCLE_SIZE * 0.7) / 2,
    borderWidth: 1,
    borderColor: 'rgba(159,122,234,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleGradient: {
    width: '100%',
    height: '100%',
    borderRadius: CIRCLE_SIZE / 2,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: LOGO_SIZE,
    height: LOGO_SIZE,
  },
}); 