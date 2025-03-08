import { Stack, useRouter } from 'expo-router';
import * as React from 'react';
import { Platform, Pressable, View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { IconSymbol } from '@/components/ui/IconSymbol';

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

export default function ProfileLayout() {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#2D1B69', '#4A1B6D', '#1F1135']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[StyleSheet.absoluteFill, styles.gradient]}
      />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: '#2D1B69',
          },
          headerTintColor: '#fff',
          headerShadowVisible: false,
          animation: 'slide_from_right',
          animationDuration: 200,
          contentStyle: {
            backgroundColor: 'transparent',
          },
          headerLeft: () => <BackButton />,
          ...(Platform.OS === 'ios' ? {
            headerBlurEffect: 'dark',
          } : {}),
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            headerShown: false,
            title: 'Hồ sơ',
          }}
        />
        <Stack.Screen
          name="history"
          options={{
            title: 'Lịch sử tra cứu',
          }}
        />
        <Stack.Screen
          name="history/details"
          options={{
            title: 'Chi tiết trải bài',
          }}
        />
        <Stack.Screen
          name="history/favorites"
          options={{
            title: 'Trải bài yêu thích',
          }}
        />
        <Stack.Screen
          name="history/by-context"
          options={{
            title: 'Theo chủ đề',
          }}
        />
        <Stack.Screen
          name="history/context/[id]"
          options={{
            title: 'Lịch sử theo chủ đề',
          }}
        />
        <Stack.Screen
          name="edit"
          options={{
            title: 'Thông tin cá nhân',
          }}
        />
        <Stack.Screen
          name="saved"
          options={{
            title: 'Bài viết đã lưu',
          }}
        />
        <Stack.Screen
          name="settings"
          options={{
            title: 'Cài đặt',
          }}
        />
        <Stack.Screen
          name="terms"
          options={{
            title: 'Điều khoản sử dụng',
          }}
        />
        <Stack.Screen
          name="privacy"
          options={{
            title: 'Chính sách bảo mật',
          }}
        />
      </Stack>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    opacity: 0.9,
  },
});