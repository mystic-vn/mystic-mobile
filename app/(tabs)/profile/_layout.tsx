import { Stack, useRouter } from 'expo-router';
import * as React from 'react';
import { Platform, Pressable } from 'react-native';
import { IconSymbol } from '@/components/ui/IconSymbol';

const BackButton = React.memo(() => {
  const router = useRouter();
  return (
    <Pressable 
      onPress={() => router.push('/(tabs)/profile')} 
      style={{ marginLeft: 8 }}
    >
      <IconSymbol name="chevron.left" size={28} color="#fff" />
    </Pressable>
  );
});

const commonScreenOptions = {
  headerStyle: {
    backgroundColor: 'rgba(52, 0, 51, 0.9)',
  },
  headerTintColor: '#fff',
  contentStyle: {
    backgroundColor: 'transparent',
  },
  headerTransparent: true,
  ...(Platform.OS === 'ios' ? {
    headerBlurEffect: 'dark' as const,
  } : {}),
  animation: 'slide_from_right' as const,
  animationDuration: 200,
  headerLeft: () => <BackButton />,
};

export default React.memo(function ProfileLayout() {
  return (
    <Stack screenOptions={commonScreenOptions}>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="edit"
        options={{
          title: 'Thông tin cá nhân',
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
  );
});