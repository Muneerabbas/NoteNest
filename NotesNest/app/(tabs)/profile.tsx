import { Alert, Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors, Fonts } from '@/constants/theme';
import { useAuth } from '@/context/auth-context';
import { useThemePreference } from '@/context/theme-context';
import { useColorScheme } from '@/hooks/use-color-scheme';

type MenuItem = {
  icon: string;
  label: string;
  subtitle?: string;
  color?: string;
  onPress?: () => void;
  trailing?: 'chevron' | 'switch';
};

export default function ProfileScreen() {
  const scheme = useColorScheme() ?? 'light';
  const c = Colors[scheme];
  const { clearAuthToken } = useAuth();
  const { toggleTheme } = useThemePreference();

  const accountItems: MenuItem[] = [
    {
      icon: 'pencil',
      label: 'Edit Profile',
      subtitle: 'Name and photo',
      onPress: () => Alert.alert('Coming soon', 'Profile editing will be available soon.'),
    },
    { icon: 'bell', label: 'Notifications', subtitle: 'Manage alerts' },
    {
      icon: 'bookmark.fill',
      label: 'Saved Notes',
      subtitle: 'Your bookmarks',
      onPress: () => router.navigate('/(tabs)/explore'),
    },
    {
      icon: 'shield.fill',
      label: 'Privacy',
      subtitle: 'Account security',
      onPress: () => router.push('/privacy'),
    },
  ];

  const appItems: MenuItem[] = [
    {
      icon: 'paintbrush.fill',
      label: 'Theme',
      subtitle: `Current: ${scheme === 'dark' ? 'Dark' : 'Light'} mode`,
      onPress: toggleTheme,
      trailing: 'switch',
    },
    {
      icon: 'questionmark.circle',
      label: 'Help & Support',
      subtitle: 'Contact support',
      onPress: () => router.push('/help-support'),
    },
    { icon: 'info.circle', label: 'About', subtitle: 'Version 1.0.0' },
  ];

  const renderItem = (item: MenuItem, isLast: boolean) => (
    <Pressable
      key={item.label}
      style={[
        styles.menuItem,
        !isLast && { borderBottomWidth: 1, borderBottomColor: c.border },
      ]}
      onPress={item.onPress}
    >
      <View style={[styles.menuIcon, { backgroundColor: c.accentSoft }]}>
        <IconSymbol name={item.icon as any} size={18} color={c.accent} />
      </View>
      <View style={styles.menuContent}>
        <Text style={[styles.menuLabel, { color: c.text }]}>{item.label}</Text>
        {item.subtitle && (
          <Text style={[styles.menuSub, { color: c.textSecondary }]}>{item.subtitle}</Text>
        )}
      </View>
      {item.trailing === 'switch' ? (
        <Switch
          value={scheme === 'dark'}
          onValueChange={toggleTheme}
          trackColor={{ false: c.border, true: c.accent }}
          thumbColor="#FFFFFF"
        />
      ) : (
        <IconSymbol name="chevron.right" size={16} color={c.muted} />
      )}
    </Pressable>
  );

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: c.background }]}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={[styles.title, { color: c.text }]}>Profile</Text>

        <View style={[styles.profileCard, { backgroundColor: c.card, borderColor: c.border }]}>
          <View style={[styles.avatar, { backgroundColor: c.accent }]}>
            <Text style={styles.avatarText}>M</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={[styles.name, { color: c.text }]}>Muneera Bass</Text>
            <Text style={[styles.role, { color: c.textSecondary }]}>Student</Text>
          </View>
          <Pressable style={[styles.editBtn, { backgroundColor: c.accentSoft }]}>
            <IconSymbol name="pencil" size={16} color={c.accent} />
          </Pressable>
        </View>

        <View style={styles.statsRow}>
          {[
            { val: '3', label: 'Uploads', icon: 'tray.and.arrow.up' },
            { val: '12', label: 'Downloads', icon: 'arrow.down.circle' },
            { val: '5', label: 'Saved', icon: 'bookmark' },
          ].map((s) => (
            <View key={s.label} style={[styles.statCard, { backgroundColor: c.card, borderColor: c.border }]}>
              <IconSymbol name={s.icon as any} size={18} color={c.accent} />
              <Text style={[styles.statVal, { color: c.text }]}>{s.val}</Text>
              <Text style={[styles.statLabel, { color: c.textSecondary }]}>{s.label}</Text>
            </View>
          ))}
        </View>

        <Text style={[styles.sectionLabel, { color: c.textSecondary }]}>Account</Text>
        <View style={[styles.menuCard, { backgroundColor: c.card, borderColor: c.border }]}>
          {accountItems.map((item, i) => renderItem(item, i === accountItems.length - 1))}
        </View>

        <Text style={[styles.sectionLabel, { color: c.textSecondary }]}>App</Text>
        <View style={[styles.menuCard, { backgroundColor: c.card, borderColor: c.border }]}>
          {appItems.map((item, i) => renderItem(item, i === appItems.length - 1))}
        </View>

        <Pressable
          style={[styles.logoutBtn, { backgroundColor: c.danger + '10', borderColor: c.danger + '25' }]}
          onPress={clearAuthToken}
        >
          <IconSymbol name="arrow.right.square" size={18} color={c.danger} />
          <Text style={[styles.logoutText, { color: c.danger }]}>Log out</Text>
        </Pressable>

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: {
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  title: {
    fontSize: 24,
    fontFamily: Fonts.bold,
    letterSpacing: -0.3,
    marginBottom: 20,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    marginBottom: 20,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#FFF',
    fontSize: 22,
    fontFamily: Fonts.bold,
  },
  profileInfo: {
    flex: 1,
    gap: 2,
  },
  name: {
    fontSize: 18,
    fontFamily: Fonts.bold,
  },
  role: {
    fontSize: 13,
    fontFamily: Fonts.regular,
  },
  editBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 28,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 16,
    borderRadius: 14,
    borderWidth: 1,
    gap: 6,
  },
  statVal: {
    fontSize: 20,
    fontFamily: Fonts.bold,
  },
  statLabel: {
    fontSize: 11,
    fontFamily: Fonts.medium,
  },
  sectionLabel: {
    fontSize: 12,
    fontFamily: Fonts.bold,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 10,
  },
  menuCard: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: 24,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  menuIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuContent: {
    flex: 1,
    gap: 1,
  },
  menuLabel: {
    fontSize: 15,
    fontFamily: Fonts.medium,
  },
  menuSub: {
    fontSize: 12,
    fontFamily: Fonts.regular,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 15,
    borderRadius: 14,
    borderWidth: 1,
  },
  logoutText: {
    fontSize: 15,
    fontFamily: Fonts.semiBold,
  },
});
