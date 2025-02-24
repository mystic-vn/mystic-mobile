import { StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function OracleScreen() {
  return (
    <LinearGradient
      colors={['#2D1B69', '#4A1B6D', '#1F1135']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}>
      <ThemedView style={styles.content}>
        <ThemedText type="title" style={styles.title}>Oracle</ThemedText>
        <ThemedText type="subtitle" style={styles.subtitle}>Đang phát triển...</ThemedText>
      </ThemedView>
    </LinearGradient>
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
    backgroundColor: 'transparent',
  },
  title: {
    marginBottom: 8,
  },
  subtitle: {
    opacity: 0.7,
  },
});
