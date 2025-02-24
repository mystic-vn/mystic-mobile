import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { memo } from 'react';

// Export function component trực tiếp thay vì export default
export function TabBarBackground() {
  return (
    <View style={[StyleSheet.absoluteFill, styles.background]} />
  );
}

export function useBottomTabOverflow() {
  const tabHeight = useBottomTabBarHeight();
  const { bottom } = useSafeAreaInsets();
  return tabHeight - bottom;
}

const styles = StyleSheet.create({
  background: {
    backgroundColor: 'rgba(52, 0, 51, 0.85)',
  },
});
