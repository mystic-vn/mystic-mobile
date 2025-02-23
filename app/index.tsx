import { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';

const { width } = Dimensions.get('window');

export default function SplashScreen() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  const startAnimation = () => {
    return new Promise((resolve) => {
      // Hiệu ứng xoay vòng tròn
      Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        })
      ).start();

      // Hiệu ứng xuất hiện logo
      Animated.sequence([
        // Logo xuất hiện từ từ
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 1000,
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
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1.2,
            duration: 800,
            useNativeDriver: true,
          }),
        ]),
      ]).start(() => {
        resolve(true);
      });
    });
  };

  useEffect(() => {
    const initSplashScreen = async () => {
      await startAnimation();
      router.replace('/(tabs)');
    };

    initSplashScreen();
  }, []);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0A051E', '#1A0B3E', '#0A051E']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.content}>
        
        {/* Vòng tròn ma thuật */}
        <Animated.View style={[styles.magicCircle, { transform: [{ rotate: spin }] }]}>
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
  magicCircle: {
    position: 'absolute',
    width: width * 0.8,
    height: width * 0.8,
    borderRadius: width * 0.4,
    borderWidth: 1,
    borderColor: 'rgba(159,122,234,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleGradient: {
    width: '100%',
    height: '100%',
    borderRadius: width * 0.4,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: width * 0.35,
    height: width * 0.35,
  },
}); 