import { Redirect, Tabs } from 'expo-router';
import React from 'react';
import { Platform, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors, Fonts } from '@/constants/theme';
import { useAuth } from '@/context/auth-context';
import { useColorScheme } from '@/hooks/use-color-scheme';

function UploadTabButton(props: any) {
  const scheme = useColorScheme() ?? 'light';
  const accent = Colors[scheme].accent;
  return (
    <Pressable
      {...props}
      style={[props.style, styles.uploadWrap]}
    >
      <View style={[styles.uploadCircle, { backgroundColor: accent }]}>
        <IconSymbol name="tray.and.arrow.up.fill" size={22} color="#FFF" />
      </View>
    </Pressable>
  );
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { token, isHydrated } = useAuth();
  const scheme = colorScheme ?? 'light';
  const c = Colors[scheme];
  const insets = useSafeAreaInsets();

  if (!isHydrated) return null;
  if (!token) return <Redirect href="/auth" />;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: c.accent,
        tabBarInactiveTintColor: c.tabIconDefault,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: (Platform.OS === 'ios' ? 58 : 58) + insets.bottom,
          paddingBottom: (Platform.OS === 'ios' ? 8 : 10) + insets.bottom,
          paddingTop: 8,
          backgroundColor: c.card,
          borderTopWidth: 1,
          borderTopColor: c.border,
          elevation: 0,
          shadowColor: '#000',
          shadowOpacity: 0.06,
          shadowRadius: 16,
          shadowOffset: { width: 0, height: -6 },
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontFamily: Fonts.semiBold,
          marginTop: 2,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol size={focused ? 24 : 22} name={focused ? 'house.fill' : 'house'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol
              size={focused ? 24 : 22}
              name={focused ? 'bookmark.fill' : 'bookmark'}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="upload"
        options={{
          title: '',
          tabBarButton: UploadTabButton,
        }}
      />
      <Tabs.Screen
        name="notes"
        options={{
          title: 'My Notes',
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol size={focused ? 24 : 22} name={focused ? 'tray.and.arrow.up.fill' : 'tray.and.arrow.up'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol size={focused ? 24 : 22} name={focused ? 'person.crop.circle' : 'person'} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  uploadWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    top: -18,
  },
  uploadCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#007AFF',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
});
