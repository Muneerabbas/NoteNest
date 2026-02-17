import { ScrollView, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Fonts } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

const palette = {
  light: {
    background: '#F6F3F0',
    ink: '#1C1815',
    muted: '#6A635D',
    card: '#FFFFFF',
    accent: '#9FD5D4',
    accentDeep: '#2F7D7A',
    line: '#E8DED4',
    chip: '#F0E6DC',
  },
  dark: {
    background: '#141210',
    ink: '#F6F0E8',
    muted: '#B0A69E',
    card: '#1E1A17',
    accent: '#2F7D7A',
    accentDeep: '#9FD5D4',
    line: '#2A2622',
    chip: '#231F1C',
  },
};

const filters = ['All', 'Personal', 'Work', 'Ideas', 'Pinned'];
const notes = [
  {
    title: 'New landing page copy',
    preview: 'Lean into clarity. Highlight the timeline and benefits upfront.',
    tag: 'Work',
    time: 'Updated 2h ago',
  },
  {
    title: 'Weekend reset list',
    preview: 'Laundry, inbox zero, plant care, and a short reflection walk.',
    tag: 'Personal',
    time: 'Updated yesterday',
  },
  {
    title: 'Product narrative beats',
    preview: 'Problem framing, promise, proof, and the next chapter.',
    tag: 'Ideas',
    time: 'Updated Feb 4',
  },
];

export default function NotesScreen() {
  const scheme = useColorScheme() ?? 'light';
  const colors = palette[scheme];

  return (
    <ThemedView style={[styles.page, { backgroundColor: colors.background }]}
      lightColor={palette.light.background}
      darkColor={palette.dark.background}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <View>
            <ThemedText style={[styles.title, { color: colors.ink }]}>Your notes</ThemedText>
            <ThemedText style={[styles.subtitle, { color: colors.muted }]}
              >3 drafts waiting for review.</ThemedText>
          </View>
          <View style={[styles.addButton, { backgroundColor: colors.accent }]}>
            <IconSymbol name="square.and.pencil" size={20} color={colors.ink} />
          </View>
        </View>

        <View style={[styles.search, { backgroundColor: colors.card, borderColor: colors.line }]}
          >
          <IconSymbol name="sparkles" size={18} color={colors.accentDeep} />
          <ThemedText style={[styles.searchText, { color: colors.muted }]}>
            Search by title, tag, or keyword
          </ThemedText>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}
          >
          {filters.map((item, index) => (
            <View
              key={item}
              style={[
                styles.filterChip,
                {
                  backgroundColor: index === 0 ? colors.accent : colors.chip,
                  borderColor: colors.line,
                },
              ]}>
              <ThemedText
                style={[
                  styles.filterText,
                  { color: index === 0 ? colors.ink : colors.muted },
                ]}>
                {item}
              </ThemedText>
            </View>
          ))}
        </ScrollView>

        <View style={styles.sectionHeader}>
          <ThemedText style={[styles.sectionTitle, { color: colors.ink }]}>Pinned</ThemedText>
          <ThemedText style={[styles.sectionLink, { color: colors.accentDeep }]}>Manage</ThemedText>
        </View>

        <View style={[styles.pinnedCard, { backgroundColor: colors.card, borderColor: colors.line }]}
          >
          <View style={styles.pinnedHeader}>
            <IconSymbol name="bookmark.fill" size={18} color={colors.accentDeep} />
            <ThemedText style={[styles.pinnedTitle, { color: colors.ink }]}>
              Launch checklist
            </ThemedText>
          </View>
          <ThemedText style={[styles.pinnedBody, { color: colors.muted }]}
            >Finalize tasks, share with the team, and run a last QA sweep.</ThemedText>
          <View style={[styles.pinnedFooter, { borderColor: colors.line }]}
            >
            <ThemedText style={[styles.pinnedMeta, { color: colors.muted }]}>12 items</ThemedText>
            <ThemedText style={[styles.pinnedMeta, { color: colors.muted }]}>Due tomorrow</ThemedText>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <ThemedText style={[styles.sectionTitle, { color: colors.ink }]}>Latest</ThemedText>
          <ThemedText style={[styles.sectionLink, { color: colors.accentDeep }]}>Sort</ThemedText>
        </View>

        {notes.map((note) => (
          <View key={note.title} style={[styles.noteCard, { backgroundColor: colors.card, borderColor: colors.line }]}
            >
            <View style={styles.noteHeader}>
              <ThemedText style={[styles.noteTitle, { color: colors.ink }]}>{note.title}</ThemedText>
              <View style={[styles.tag, { borderColor: colors.line }]}
                >
                <ThemedText style={[styles.tagText, { color: colors.muted }]}>{note.tag}</ThemedText>
              </View>
            </View>
            <ThemedText style={[styles.notePreview, { color: colors.muted }]}>{note.preview}</ThemedText>
            <ThemedText style={[styles.noteTime, { color: colors.muted }]}>{note.time}</ThemedText>
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
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
  },
  title: {
    fontSize: 30,
    fontFamily: Fonts.serif,
  },
  subtitle: {
    fontSize: 14,
    marginTop: 6,
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  searchText: {
    fontSize: 13,
  },
  filterRow: {
    gap: 10,
    paddingRight: 12,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
  },
  filterText: {
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
    fontSize: 12,
    fontFamily: Fonts.rounded,
  },
  pinnedCard: {
    padding: 18,
    borderRadius: 20,
    borderWidth: 1,
    gap: 12,
  },
  pinnedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  pinnedTitle: {
    fontSize: 16,
    fontFamily: Fonts.rounded,
  },
  pinnedBody: {
    fontSize: 13,
    lineHeight: 18,
  },
  pinnedFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
  },
  pinnedMeta: {
    fontSize: 12,
  },
  noteCard: {
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    gap: 8,
  },
  noteHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  noteTitle: {
    fontSize: 15,
    fontFamily: Fonts.rounded,
  },
  tag: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  tagText: {
    fontSize: 11,
  },
  notePreview: {
    fontSize: 13,
    lineHeight: 18,
  },
  noteTime: {
    fontSize: 11,
  },
});
