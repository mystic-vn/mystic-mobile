import { memo } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { ThemedText } from '@/components/ThemedText';

// Memoize component để tránh re-render
export const HelloWave = memo(() => {
  const rotation = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  const handlePress = () => {
    rotation.value = withSequence(
      withTiming(25, { duration: 150 }),
      withTiming(0, { duration: 150 })
    );
  };

  return (
    <Animated.View style={animatedStyle}>
      <ThemedText onPress={handlePress} style={styles.text}>👋</ThemedText>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  text: {
    fontSize: 24,
  },
});
