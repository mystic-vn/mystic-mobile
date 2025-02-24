import { useEffect } from 'react';
import { View, StyleSheet, Image, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';

const { width } = Dimensions.get('window');

export default function SplashScreen() {
  useEffect(() => {
    // Chuyển hướng sau 2 giây
    const timer = setTimeout(() => {
      router.replace('/(tabs)');
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0A051E', '#1A0B3E', '#0A051E']}
        style={styles.content}>
        <View style={styles.logoContainer}>
          <Image 
            source={require('@/assets/images/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
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
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: width * 0.35,
    height: width * 0.35,
  },
}); 