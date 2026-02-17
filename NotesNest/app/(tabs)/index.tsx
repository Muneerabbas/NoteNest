import { ScrollView, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Fonts } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

const palette = {
  light: {
    background: '#F7F4EF',
    ink: '#1F1C16',
    muted: '#6B6358',
    card: '#FFFFFF',
    accent: '#FFB566',
    accentSoft: '#FFF1E0',
    accentDeep: '#E37B23',
    line: '#EEE5D8',
    orb1: '#FFD6A5',
    orb2: '#FBE7C5',
  },
  dark: {
    background: '#151312',
    ink: '#F7F2EA',
    muted: '#B7AEA2',
    card: '#1E1B19',
    accent: '#FFB566',
    accentSoft: '#3A2C1E',
    accentDeep: '#F08A2B',
    line: '#2B2623',
    orb1: '#3D2A1A',
    orb2: '#2B2016',
  },
};

const quickActions = [
  { label: 'New Note', sub: 'Blank page', icon: 'square.and.pencil' },
  { label: 'Checklist', sub: 'Get it done', icon: 'checklist' },
  { label: 'Spark', sub: 'Voice capture', icon: 'sparkles' },
];

const recentNotes = [
  { title: 'Brand refresh ideas', meta: 'Edited 12m ago' },
  { title: 'Onboarding flow', meta: 'Edited yesterday' },
  { title: 'Meeting snapshots', meta: 'Edited Feb 6' },
];

export default function HomeScreen() {
  const scheme = useColorScheme() ?? 'light';
  const colors = palette[scheme];

  return (
    <ThemedView style={[styles.page, { backgroundColor: colors.background }]}
      lightColor={palette.light.background}
      darkColor={palette.dark.background}>
      <View style={[styles.orb, styles.orbOne, { backgroundColor: colors.orb1 }]} />
      <View style={[styles.orb, styles.orbTwo, { backgroundColor: colors.orb2 }]} />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.heroRow}>
          <View style={styles.heroText}>
            <ThemedText style={[styles.kicker, { color: colors.muted }]}>Welcome back</ThemedText>
            <ThemedText style={[styles.title, { color: colors.ink }]}>NotesNest</ThemedText>
            <ThemedText style={[styles.subtitle, { color: colors.muted }]}>
              Your ideas, gently organized and ready to ship.
            </ThemedText>
          </View>
          <View style={[styles.heroBadge, { backgroundColor: colors.accentSoft, borderColor: colors.accent }]}
            >
            <IconSymbol name="sparkles" size={22} color={colors.accentDeep} />
            <ThemedText style={[styles.badgeText, { color: colors.accentDeep }]}>7-day streak</ThemedText>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <ThemedText style={[styles.sectionTitle, { color: colors.ink }]}>Quick actions</ThemedText>
          <ThemedText style={[styles.sectionLink, { color: colors.accentDeep }]}>Customize</ThemedText>
        </View>

        <View style={styles.actionGrid}>
          {quickActions.map((item) => (
            <View
              key={item.label}
              style={[
                styles.actionCard,
                { backgroundColor: colors.card, borderColor: colors.line },
              ]}>
              <View style={[styles.actionIcon, { backgroundColor: colors.accentSoft }]}
                >
                <IconSymbol name={item.icon} size={20} color={colors.accentDeep} />
              </View>
              <ThemedText style={[styles.actionTitle, { color: colors.ink }]}>{item.label}</ThemedText>
              <ThemedText style={[styles.actionSub, { color: colors.muted }]}>{item.sub}</ThemedText>
            </View>
          ))}
        </View>

        <View style={[styles.featureCard, { backgroundColor: colors.card, borderColor: colors.line }]}
          >
          <View style={styles.featureHeader}>
            <View>
              <ThemedText style={[styles.featureTitle, { color: colors.ink }]}>Today’s focus</ThemedText>
              <ThemedText style={[styles.featureSub, { color: colors.muted }]}
                >Pick one note to refine this afternoon.</ThemedText>
            </View>
            <View style={[styles.featureBadge, { backgroundColor: colors.accent }]}
              >
              <ThemedText style={styles.featureBadgeText}>2h</ThemedText>
            </View>
          </View>
          <View style={[styles.featureChip, { borderColor: colors.line }]}
            >
            <IconSymbol name="folder.fill" size={16} color={colors.accentDeep} />
            <ThemedText style={[styles.featureChipText, { color: colors.muted }]}
              >Client strategy / Launch</ThemedText>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <ThemedText style={[styles.sectionTitle, { color: colors.ink }]}>Recent notes</ThemedText>
          <ThemedText style={[styles.sectionLink, { color: colors.accentDeep }]}>See all</ThemedText>
        </View>

        {recentNotes.map((note) => (
          <View key={note.title} style={[styles.noteRow, { borderColor: colors.line }]}
            >
            <View style={[styles.noteDot, { backgroundColor: colors.accent }]} />
            <View style={styles.noteInfo}>
              <ThemedText style={[styles.noteTitle, { color: colors.ink }]}>{note.title}</ThemedText>
              <ThemedText style={[styles.noteMeta, { color: colors.muted }]}>{note.meta}</ThemedText>
            </View>
            <IconSymbol name="chevron.right" size={18} color={colors.muted} />
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
    paddingTop: 48,
    gap: 20,
  },
  orb: {
    position: 'absolute',
    borderRadius: 999,
    opacity: 0.55,
  },
  orbOne: {
    width: 220,
    height: 220,
    top: -60,
    right: -80,
  },
  orbTwo: {
    width: 180,
    height: 180,
    top: 120,
    left: -90,
  },
  heroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 18,
  },
  heroText: {
    flex: 1,
    gap: 8,
  },
  kicker: {
    fontSize: 13,
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontFamily: Fonts.rounded,
  },
  title: {
    fontSize: 34,
    fontFamily: Fonts.serif,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 22,
  },
  heroBadge: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    gap: 6,
  },
  badgeText: {
    fontSize: 12,
    fontFamily: Fonts.rounded,
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
    fontSize: 13,
    fontFamily: Fonts.rounded,
  },
  actionGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  actionCard: {
    flex: 1,
    padding: 14,
    borderRadius: 18,
    borderWidth: 1,
    gap: 6,
  },
  actionIcon: {
    width: 34,
    height: 34,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionTitle: {
    fontSize: 15,
    fontFamily: Fonts.rounded,
  },
  actionSub: {
    fontSize: 12,
  },
  featureCard: {
    padding: 18,
    borderRadius: 22,
    borderWidth: 1,
    gap: 14,
  },
  featureHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  featureTitle: {
    fontSize: 18,
    fontFamily: Fonts.serif,
  },
  featureSub: {
    fontSize: 13,
    marginTop: 6,
  },
  featureBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  featureBadgeText: {
    fontSize: 12,
    fontFamily: Fonts.rounded,
    color: '#1E1B19',
  },
  featureChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  featureChipText: {
    fontSize: 13,
  },
  noteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
    gap: 12,
  },
  noteDot: {
    width: 10,
    height: 10,
    borderRadius: 999,
  },
  noteInfo: {
    flex: 1,
    gap: 2,
  },
  noteTitle: {
    fontSize: 15,
    fontFamily: Fonts.rounded,
  },
  noteMeta: {
    fontSize: 12,
  },
});
