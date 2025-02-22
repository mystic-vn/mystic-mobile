import { StyleSheet, useWindowDimensions, View, ViewStyle } from 'react-native';
import Animated, { 
  useAnimatedStyle, 
  withSpring, 
  withRepeat, 
  withSequence,
  useSharedValue,
  withTiming,
  withDelay,
  Easing,
  interpolate,
  withDecay
} from 'react-native-reanimated';
import { useEffect } from 'react';

interface StarProps {
  delay?: number;
  size?: number;
  style?: ViewStyle;
}

const Star = ({ delay = 0, size = 4, style }: StarProps) => {
  const progress = useSharedValue(0);
  const rotate = useSharedValue(0);

  useEffect(() => {
    // Hiệu ứng xoay nhẹ nhàng
    rotate.value = withDelay(
      delay,
      withRepeat(
        withTiming(360, {
          duration: 8000,
          easing: Easing.linear,
        }),
        -1,
        false
      )
    );

    // Hiệu ứng chuyển động phức hợp
    progress.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(1, {
            duration: 3000,
            easing: Easing.bezier(0.25, 0.1, 0.25, 1),
          }),
          withTiming(0, {
            duration: 3000,
            easing: Easing.bezier(0.25, 0.1, 0.25, 1),
          })
        ),
        -1,
        true
      )
    );
  }, [delay]);

  const animatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      progress.value,
      [0, 0.5, 1],
      [0.2, 1, 0.2]
    );

    const scale = interpolate(
      progress.value,
      [0, 0.5, 1],
      [0.8, 1.2, 0.8]
    );

    return {
      opacity,
      transform: [
        { scale },
        { rotate: `${rotate.value}deg` },
        { 
          translateY: interpolate(
            progress.value,
            [0, 0.5, 1],
            [-5, 0, 5]
          )
        }
      ],
    };
  });

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
};

export const MysticOverlay = () => {
  const { width, height } = useWindowDimensions();
  
  // Tạo các cụm sao với mật độ khác nhau và prefix cho id
  const createStarCluster = (count: number, sizeRange: [number, number], prefix: string) => {
    return Array(count).fill(0).map((_, i) => ({
      id: `${prefix}-${i}`,
      top: Math.random() * height,
      left: Math.random() * width,
      size: Math.random() * (sizeRange[1] - sizeRange[0]) + sizeRange[0],
      delay: Math.random() * 5000,
    }));
  };

  // Tạo 3 lớp sao với kích thước và prefix khác nhau
  const smallStars = createStarCluster(80, [1, 3], 'small');
  const mediumStars = createStarCluster(40, [3, 5], 'medium');
  const largeStars = createStarCluster(20, [5, 8], 'large');
  const stars = [...smallStars, ...mediumStars, ...largeStars];

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
};

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
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 5,
  }
}); 