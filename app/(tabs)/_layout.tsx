import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, Image } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const mysticLogo = require('@/assets/images/logo.png');

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#9f7aea', // Màu tím mystic khi active
        tabBarInactiveTintColor: 'rgba(255,255,255,0.6)', // Màu mờ khi không active
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            backgroundColor: 'rgba(52, 0, 51, 0.5)', // Màu nền tối mystic với độ trong suốt
            borderTopWidth: 0,
            position: 'absolute',
            height: 85,
            paddingBottom: 20,
          },
          default: {
            backgroundColor: 'rgba(52, 0, 51, 0.5)',
            borderTopWidth: 0,
            height: 70,
            paddingBottom: 10,
          },
        }),
      }}>
      <Tabs.Screen
        name="library"
        options={{
          title: 'Thư viện',
          tabBarIcon: ({ color }) => <IconSymbol size={24} name="books.vertical.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="support"
        options={{
          title: 'Hỗ trợ',
          tabBarIcon: ({ color }) => <IconSymbol size={24} name="questionmark.circle.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: '',
          tabBarIcon: ({ focused }) => (
            <Image 
              source={mysticLogo}
              style={{
                width: 50,
                height: 50,
                marginBottom: Platform.OS === 'ios' ? 0 : 10,
                opacity: focused ? 1 : 0.7,
              }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          title: 'Thông báo',
          tabBarIcon: ({ color }) => <IconSymbol size={24} name="bell.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Tôi',
          tabBarIcon: ({ color }) => <IconSymbol size={24} name="person.fill" color={color} />,
        }}
      />
    </Tabs>
  );
}
