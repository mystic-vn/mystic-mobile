import { Stack, useRouter } from 'expo-router';
import * as React from 'react';
import { Platform, Pressable, View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { IconSymbol } from '@components/ui/IconSymbol';

const BackButton = React.memo(() => {
  const router = useRouter();
  return (
    <Pressable 
      onPress={() => router.back()} 
      style={{ marginLeft: 8 }}
    >
      <IconSymbol name="chevron.left" size={28} color="#fff" />
    </Pressable>
  );
});

const commonScreenOptions = {
  headerStyle: {
    backgroundColor: '#2D1B69',
  },
  headerTintColor: '#fff',
  headerTransparent: false,
  ...(Platform.OS === 'ios' ? {
    animation: 'slide_from_right' as const,
    animationDuration: 300,
    contentStyle: {
      backgroundColor: '#2D1B69',
    },
  } : {
    animation: 'slide_from_right' as const,
    animationDuration: 200,
    contentStyle: {
      backgroundColor: 'transparent',
    },
  }),
  headerLeft: () => <BackButton />,
};

export default React.memo(function DiscoverLayout() {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#2D1B69', '#4A1B6D', '#1F1135']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <Stack screenOptions={commonScreenOptions}>
        <Stack.Screen
          name="index"
          options={{
            title: 'Khám phá',
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="tarot/index"
          options={{
            title: 'Tarot',
          }}
        />
        <Stack.Screen
          name="tarot/[id]/questions"
          options={{
            title: 'Câu hỏi Tarot',
          }}
        />
        <Stack.Screen
          name="tarot/[id]/spread"
          options={{
            title: 'Trải Bài Tarot',
          }}
        />
        <Stack.Screen
          name="tarot/[id]/analysis/[analysisId]"
          options={{
            title: 'Kết quả phân tích',
          }}
        />
        <Stack.Screen
          name="oracle"
          options={{
            title: 'Oracle',
          }}
        />
        <Stack.Screen
          name="numerology"
          options={{
            title: 'Thần Số Học',
          }}
        />
        <Stack.Screen
          name="zodiac"
          options={{
            title: 'Cung Hoàng Đạo',
          }}
        />
      </Stack>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
}); 