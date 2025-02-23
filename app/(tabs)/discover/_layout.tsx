import { Stack } from 'expo-router';
import React from 'react';

export default function DiscoverLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: 'Khám phá',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="tarot"
        options={{
          title: 'Tarot',
          headerStyle: {
            backgroundColor: 'rgba(52, 0, 51, 0.9)',
          },
          headerTintColor: '#fff',
        }}
      />
      <Stack.Screen
        name="oracle"
        options={{
          title: 'Oracle',
          headerStyle: {
            backgroundColor: 'rgba(52, 0, 51, 0.9)',
          },
          headerTintColor: '#fff',
        }}
      />
      <Stack.Screen
        name="numerology"
        options={{
          title: 'Thần Số Học',
          headerStyle: {
            backgroundColor: 'rgba(52, 0, 51, 0.9)',
          },
          headerTintColor: '#fff',
        }}
      />
      <Stack.Screen
        name="zodiac"
        options={{
          title: 'Cung Hoàng Đạo',
          headerStyle: {
            backgroundColor: 'rgba(52, 0, 51, 0.9)',
          },
          headerTintColor: '#fff',
        }}
      />
    </Stack>
  );
} 