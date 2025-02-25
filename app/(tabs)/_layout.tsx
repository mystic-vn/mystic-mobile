import { Tabs } from 'expo-router';
import * as React from 'react';
import { Platform, Image, View, StyleSheet } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { TabBarBackground } from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

type TabBarIconProps = {
  color?: string;
  focused?: boolean;
};

// Cache logo image để tránh bị reload
const LOGO_IMAGE = require('@/assets/images/logo.png');

export default function TabLayout() {
  const colorScheme = useColorScheme();

  // Memoize styles để tránh tính toán lại
  const tabBarStyle = React.useMemo(() => ({
    backgroundColor: 'rgba(52, 0, 51, 0.5)',
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

  // Memoize logo component để tránh re-render
  const LogoIcon = React.useCallback(({ focused }: TabBarIconProps) => (
    <View style={styles.logoWrapper}>
      <Image 
        source={LOGO_IMAGE}
        style={[styles.logo, { opacity: focused ? 1 : 0.7 }]}
        resizeMode="contain"
      />
    </View>
  ), []);

  const screenOptions = React.useMemo(() => ({
    tabBarActiveTintColor: '#9f7aea',
    tabBarInactiveTintColor: 'rgba(255,255,255,0.6)',
    headerShown: false,
    tabBarButton: HapticTab,
    tabBarBackground: TabBarBackground,
    tabBarStyle,
    tabBarIconStyle: {
      marginTop: Platform.OS === 'ios' ? undefined : 0,
    },
    tabBarLabelStyle: {
      fontSize: 12,
      marginTop: Platform.OS === 'ios' ? undefined : 4,
    },
  }), [tabBarStyle]);

  return (
    <Tabs screenOptions={screenOptions}>
      <Tabs.Screen
        name="discover"
        options={{
          title: 'Khám phá',
          tabBarIcon: ({ color }: TabBarIconProps) => (
            <View style={styles.iconWrapper}>
              <IconSymbol size={24} name="sparkles" color={color || '#fff'} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="library"
        options={{
          title: 'Thư viện',
          tabBarIcon: ({ color }: TabBarIconProps) => (
            <View style={styles.iconWrapper}>
              <IconSymbol size={24} name="books.vertical.fill" color={color || '#fff'} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: '',
          tabBarIcon: LogoIcon,
        }}
      />
      <Tabs.Screen
        name="support"
        options={{
          title: 'Hỗ trợ',
          tabBarIcon: ({ color }: TabBarIconProps) => (
            <View style={styles.iconWrapper}>
              <IconSymbol size={24} name="questionmark.circle.fill" color={color || '#fff'} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Tôi',
          tabBarIcon: ({ color }: TabBarIconProps) => (
            <View style={styles.iconWrapper}>
              <IconSymbol size={24} name="person.fill" color={color || '#fff'} />
            </View>
          ),
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
