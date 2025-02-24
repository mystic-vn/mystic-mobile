import { View, StyleSheet } from 'react-native';

// Export function component cho Android
export function TabBarBackground() {
  return (
    <View style={[StyleSheet.absoluteFill, styles.background]} />
  );
}

export function useBottomTabOverflow() {
  return 0;
}

const styles = StyleSheet.create({
  background: {
    backgroundColor: 'rgba(52, 0, 51, 0.85)',
  },
});
