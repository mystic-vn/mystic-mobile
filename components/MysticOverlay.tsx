import { StyleSheet, useWindowDimensions, View, ViewStyle } from 'react-native';
import Animated, { 
  useAnimatedStyle, 
  withRepeat, 
  useSharedValue,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { useEffect, memo } from 'react';

interface StarProps {
  delay?: number;
  size?: number;
  style?: ViewStyle;
}

// Memoize Star component để tránh re-render không cần thiết
const Star = memo(({ delay = 0, size = 4, style }: StarProps) => {
  const opacity = useSharedValue(0.2);

  useEffect(() => {
    // Chỉ sử dụng một animation đơn giản
    opacity.value = withRepeat(
      withTiming(1, {
        duration: 2000 + delay,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true
    );
  }, [delay]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        styles.star,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
        },
        style,
        animatedStyle,
      ]}
    />
  );
});

// Memoize toàn bộ MysticOverlay
export const MysticOverlay = memo(() => {
  const { width, height } = useWindowDimensions();
  
  // Giảm số lượng sao và tạo sẵn mảng stars để tránh tính toán lại
  const stars = Array(30).fill(0).map((_, i) => ({
    id: `star-${i}`,
    top: Math.random() * height,
    left: Math.random() * width,
    size: Math.random() * 4 + 2, // 2-6px
    delay: Math.random() * 2000,
  }));

  return (
    <View style={[styles.overlay, { width, height }]}>
      {stars.map(star => (
        <Star
          key={star.id}
          delay={star.delay}
          size={star.size}
          style={{
            position: 'absolute',
            top: star.top,
            left: star.left,
          }}
        />
      ))}
    </View>
  );
});

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
  },
  star: {
    position: 'absolute',
    backgroundColor: '#FFE5B4',
    shadowColor: '#FFA500',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 3,
  }
}); 