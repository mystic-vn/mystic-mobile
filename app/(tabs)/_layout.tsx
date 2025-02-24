import { Tabs } from 'expo-router';
import React, { useMemo } from 'react';
import { Platform, Image, View, StyleSheet, ViewStyle } from 'react-native';
import { useCallback } from 'react';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol, IconSymbolName } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const mysticLogo = require('@/assets/images/logo.png');

  // Memoize các styles để tránh tính toán lại
  const tabBarStyle = useMemo((): ViewStyle => ({
    backgroundColor: Platform.OS === 'ios' ? 'rgba(52, 0, 51, 0.5)' : 'rgba(52, 0, 51, 0.9)',
    borderTopWidth: 0,
    ...(Platform.OS === 'ios' ? {
      position: 'absolute' as const,
      height: 85,
      paddingBottom: 20,
    } : {
      height: 70,
      paddingTop: 8,
      paddingBottom: 8,
    }),
  }), []);

  const tabBarIconStyle = useMemo(() => ({
    marginTop: 0,
    height: Platform.OS === 'ios' ? undefined : 28,
  }), []);

  const tabBarLabelStyle = useMemo(() => ({
    fontSize: 12,
    marginTop: Platform.OS === 'ios' ? undefined : 4,
  }), []);

  // Memoize các render functions
  const renderIcon = useCallback(({ color, iconName }: { color: string, iconName: IconSymbolName }) => (
    <View style={styles.iconWrapper}>
      <IconSymbol size={24} name={iconName} color={color} />
    </View>
  ), []);

  const renderLogo = useCallback(({ focused }: { focused: boolean }) => (
    <View style={styles.logoWrapper}>
      <Image 
        source={mysticLogo}
        style={[
          styles.logo,
          { opacity: focused ? 1 : 0.7 }
        ]}
        resizeMode="contain"
      />
    </View>
  ), []);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#9f7aea',
        tabBarInactiveTintColor: 'rgba(255,255,255,0.6)',
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle,
        tabBarIconStyle,
        tabBarLabelStyle,
      }}>
      <Tabs.Screen
        name="discover"
        options={{
          title: 'Khám phá',
          tabBarIcon: ({ color }) => renderIcon({ color, iconName: 'sparkles' }),
        }}
      />
      <Tabs.Screen
        name="library"
        options={{
          title: 'Thư viện',
          tabBarIcon: ({ color }) => renderIcon({ color, iconName: 'books.vertical.fill' }),
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: '',
          tabBarIcon: renderLogo,
        }}
      />
      <Tabs.Screen
        name="support"
        options={{
          title: 'Hỗ trợ',
          tabBarIcon: ({ color }) => renderIcon({ color, iconName: 'questionmark.circle.fill' }),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Tôi',
          tabBarIcon: ({ color }) => renderIcon({ color, iconName: 'person.fill' }),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconWrapper: {
    height: Platform.OS === 'ios' ? undefined : 28,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  logoWrapper: {
    height: Platform.OS === 'ios' ? 50 : 42,
    width: Platform.OS === 'ios' ? 50 : 42,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Platform.OS === 'ios' ? 8 : 6,
    backgroundColor: 'transparent',
  },
  logo: {
    width: '100%',
    height: '100%',
  },
});
