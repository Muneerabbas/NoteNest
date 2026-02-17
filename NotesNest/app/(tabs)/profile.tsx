import { ScrollView, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Fonts } from '@/constants/theme';
import { useAuth } from '@/context/auth-context';
import { useColorScheme } from '@/hooks/use-color-scheme';

const palette = {
  light: {
    background: '#F2F5F3',
    ink: '#1A1C1A',
    muted: '#667068',
    card: '#FFFFFF',
    accent: '#CFE7DE',
    accentDeep: '#2B7A66',
    line: '#DEE6E1',
    glow1: '#D7EEE6',
    glow2: '#F7E3C5',
  },
  dark: {
    background: '#121513',
    ink: '#F3F7F4',
    muted: '#AAB4AE',
    card: '#1A1F1C',
    accent: '#2B7A66',
    accentDeep: '#CFE7DE',
    line: '#28302B',
    glow1: '#1F2D27',
    glow2: '#3A2B1B',
  },
};

const stats = [
  { label: 'Notes', value: '128' },
  { label: 'Collections', value: '9' },
  { label: 'Streak', value: '7 days' },
];

const habits = [
  { label: 'Daily capture', value: 0.82 },
  { label: 'Weekly review', value: 0.64 },
  { label: 'Archive cleanup', value: 0.45 },
];

export default function ProfileScreen() {
  const scheme = useColorScheme() ?? 'light';
  const colors = palette[scheme];
  const { token, clearAuthToken } = useAuth();

  return (
    <ThemedView style={[styles.page, { backgroundColor: colors.background }]}
      lightColor={palette.light.background}
      darkColor={palette.dark.background}>
      <View style={[styles.glow, styles.glowOne, { backgroundColor: colors.glow1 }]} />
      <View style={[styles.glow, styles.glowTwo, { backgroundColor: colors.glow2 }]} />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={[styles.profileCard, { backgroundColor: colors.card, borderColor: colors.line }]}
          >
          <View style={[styles.avatar, { backgroundColor: colors.accent }]}
            >
            <IconSymbol name="person.crop.circle" size={40} color={colors.ink} />
          </View>
          <View style={styles.profileInfo}>
            <ThemedText style={[styles.name, { color: colors.ink }]}>Muneera Bass</ThemedText>
            <ThemedText style={[styles.handle, { color: colors.muted }]}>Building a calmer note system</ThemedText>
          </View>
          <View style={[styles.editBadge, { borderColor: colors.line }]}
            >
            <IconSymbol name="square.and.pencil" size={16} color={colors.accentDeep} />
            <ThemedText style={[styles.editText, { color: colors.accentDeep }]}>Edit</ThemedText>
          </View>
        </View>

        <View style={[styles.tokenCard, { backgroundColor: colors.card, borderColor: colors.line }]}>
          <ThemedText style={[styles.tokenLabel, { color: colors.muted }]}>Current token</ThemedText>
          <ThemedText style={[styles.tokenValue, { color: colors.ink }]}>{token ?? 'No token'}</ThemedText>
          <View style={styles.logoutButton}>
            <ThemedText style={styles.logoutText} onPress={clearAuthToken}>
              Logout
            </ThemedText>
          </View>
        </View>

        <View style={styles.statsRow}>
          {stats.map((stat) => (
            <View key={stat.label} style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.line }]}
              >
              <ThemedText style={[styles.statValue, { color: colors.ink }]}>{stat.value}</ThemedText>
              <ThemedText style={[styles.statLabel, { color: colors.muted }]}>{stat.label}</ThemedText>
            </View>
          ))}
        </View>

        <View style={[styles.insightCard, { backgroundColor: colors.card, borderColor: colors.line }]}
          >
          <View style={styles.insightHeader}>
            <ThemedText style={[styles.sectionTitle, { color: colors.ink }]}>Weekly insight</ThemedText>
            <IconSymbol name="sparkles" size={18} color={colors.accentDeep} />
          </View>
          <ThemedText style={[styles.insightBody, { color: colors.muted }]}
            >You capture the most ideas on Tuesday afternoons. Plan your focus block there.</ThemedText>
        </View>

        <View style={styles.sectionHeader}>
          <ThemedText style={[styles.sectionTitle, { color: colors.ink }]}>Habit goals</ThemedText>
          <ThemedText style={[styles.sectionLink, { color: colors.accentDeep }]}>Adjust</ThemedText>
        </View>

        {habits.map((habit) => (
          <View key={habit.label} style={[styles.habitCard, { backgroundColor: colors.card, borderColor: colors.line }]}
            >
            <View style={styles.habitRow}>
              <ThemedText style={[styles.habitLabel, { color: colors.ink }]}>{habit.label}</ThemedText>
              <ThemedText style={[styles.habitPercent, { color: colors.muted }]}> 
                {Math.round(habit.value * 100)}%
              </ThemedText>
            </View>
            <View style={[styles.progressTrack, { backgroundColor: colors.line }]}
              >
              <View style={[styles.progressFill, { width: `${habit.value * 100}%`, backgroundColor: colors.accentDeep }]} />
            </View>
          </View>
        ))}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
  },
  content: {
    padding: 24,
    paddingTop: 44,
    gap: 20,
  },
  glow: {
    position: 'absolute',
    borderRadius: 999,
    opacity: 0.5,
  },
  glowOne: {
    width: 220,
    height: 220,
    top: -70,
    left: -80,
  },
  glowTwo: {
    width: 180,
    height: 180,
    right: -60,
    top: 140,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInfo: {
    flex: 1,
    gap: 6,
  },
  name: {
    fontSize: 18,
    fontFamily: Fonts.serif,
  },
  handle: {
    fontSize: 12,
  },
  editBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
  },
  editText: {
    fontSize: 11,
    fontFamily: Fonts.rounded,
  },
  tokenCard: {
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    gap: 10,
  },
  tokenLabel: {
    fontSize: 12,
    fontFamily: Fonts.rounded,
  },
  tokenValue: {
    fontSize: 13,
  },
  logoutButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#111827',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  logoutText: {
    color: '#ffffff',
    fontSize: 12,
    fontFamily: Fonts.rounded,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    gap: 4,
  },
  statValue: {
    fontSize: 18,
    fontFamily: Fonts.rounded,
  },
  statLabel: {
    fontSize: 12,
  },
  insightCard: {
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    gap: 10,
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  insightBody: {
    fontSize: 13,
    lineHeight: 18,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: Fonts.serif,
  },
  sectionLink: {
    fontSize: 12,
    fontFamily: Fonts.rounded,
  },
  habitCard: {
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    gap: 10,
  },
  habitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  habitLabel: {
    fontSize: 14,
    fontFamily: Fonts.rounded,
  },
  habitPercent: {
    fontSize: 12,
  },
  progressTrack: {
    height: 8,
    borderRadius: 999,
    overflow: 'hidden',
  },
  progressFill: {
    height: 8,
    borderRadius: 999,
  },
});
