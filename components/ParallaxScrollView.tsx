import type { PropsWithChildren, ReactElement } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  interpolate,
  useAnimatedRef,
  useAnimatedStyle,
  useScrollViewOffset,
  withSpring,
} from 'react-native-reanimated';
import { memo } from 'react';

import { ThemedView } from '@/components/ThemedView';
import { useBottomTabOverflow } from '@/components/ui/TabBarBackground';
import { useColorScheme } from '@/hooks/useColorScheme';

const HEADER_HEIGHT = 250;

type Props = PropsWithChildren<{
  headerImage: ReactElement;
  headerBackgroundColor: { dark: string; light: string };
}>;

// Memoize header component
const Header = memo(({ 
  headerImage, 
  headerBackgroundColor, 
  headerAnimatedStyle, 
  colorScheme 
}: {
  headerImage: ReactElement;
  headerBackgroundColor: { dark: string; light: string };
  headerAnimatedStyle: any;
  colorScheme: 'light' | 'dark';
}) => (
  <Animated.View
    style={[
      styles.header,
      { backgroundColor: headerBackgroundColor[colorScheme] },
      headerAnimatedStyle,
    ]}>
    {headerImage}
  </Animated.View>
));

// Memoize content component
const Content = memo(({ children, bottom }: PropsWithChildren<{ bottom: number }>) => (
  <ThemedView style={[styles.content, { paddingBottom: bottom }]}>
    {children}
  </ThemedView>
));

const ParallaxScrollView = memo(({
  children,
  headerImage,
  headerBackgroundColor,
}: Props) => {
  const colorScheme = useColorScheme() ?? 'light';
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollOffset = useScrollViewOffset(scrollRef);
  const bottom = useBottomTabOverflow();

  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: withSpring(interpolate(
            scrollOffset.value,
            [-HEADER_HEIGHT, 0, HEADER_HEIGHT],
            [-HEADER_HEIGHT / 2, 0, HEADER_HEIGHT * 0.75]
          ), {
            damping: 15,
            stiffness: 90
          }),
        },
        {
          scale: withSpring(interpolate(
            scrollOffset.value,
            [-HEADER_HEIGHT, 0, HEADER_HEIGHT],
            [2, 1, 1]
          ), {
            damping: 15,
            stiffness: 90
          }),
        },
      ],
    };
  });

  return (
    <ThemedView style={styles.container}>
      <Animated.ScrollView
        ref={scrollRef}
        scrollEventThrottle={16}
        scrollIndicatorInsets={{ bottom }}
        contentContainerStyle={{ paddingBottom: bottom }}>
        <Header
          headerImage={headerImage}
          headerBackgroundColor={headerBackgroundColor}
          headerAnimatedStyle={headerAnimatedStyle}
          colorScheme={colorScheme}
        />
        <Content bottom={bottom}>
          {children}
        </Content>
      </Animated.ScrollView>
    </ThemedView>
  );
});

export default ParallaxScrollView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: HEADER_HEIGHT,
    overflow: 'hidden',
  },
  content: {
    flex: 1,
    padding: 32,
    gap: 16,
    overflow: 'hidden',
  },
});
