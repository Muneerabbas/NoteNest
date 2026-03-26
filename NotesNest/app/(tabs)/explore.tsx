import { useCallback, useState } from 'react';
import {
  FlatList,
  Linking,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';

import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors, Fonts, SEMESTERS } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { BookmarkedNote, getBookmarkedNotes, toggleBookmarkedNote } from '@/lib/bookmarks';

const TYPE_COLORS = {
  PDF: { bg: '#FF3B3012', text: '#FF3B30' },
  DOCX: { bg: '#007AFF12', text: '#007AFF' },
  Image: { bg: '#34C75912', text: '#34C759' },
  File: { bg: '#8E8E9312', text: '#8E8E93' },
};

function getFileTypeFromUrl(url: string): 'PDF' | 'DOCX' | 'Image' | 'File' {
  const lower = url.toLowerCase();
  if (lower.includes('.pdf')) return 'PDF';
  if (lower.includes('.doc')) return 'DOCX';
  if (lower.includes('.jpg') || lower.includes('.jpeg') || lower.includes('.png')) return 'Image';
  return 'File';
}

function formatDate(value: string | null): string {
  if (!value) return 'Recently';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Recently';

  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function ExploreScreen() {
  const scheme = useColorScheme() ?? 'light';
  const c = Colors[scheme];
  const [bookmarks, setBookmarks] = useState<BookmarkedNote[]>([]);

  const loadBookmarks = useCallback(async () => {
    const saved = await getBookmarkedNotes();
    setBookmarks(saved);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadBookmarks();
    }, [loadBookmarks])
  );

  const handleToggleBookmark = async (note: BookmarkedNote) => {
    const next = await toggleBookmarkedNote(note);
    setBookmarks(next);
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: c.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: c.text }]}>Bookmarked Notes</Text>
        <View style={[styles.countBadge, { backgroundColor: c.accentSoft }]}>
          <IconSymbol name="bookmark.fill" size={14} color={c.accent} />
          <Text style={[styles.countText, { color: c.accent }]}>{bookmarks.length}</Text>
        </View>
      </View>

      <FlatList
        data={bookmarks}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <View style={[styles.emptyIcon, { backgroundColor: c.accentSoft }]}>
              <IconSymbol name="bookmark" size={32} color={c.accent} />
            </View>
            <Text style={[styles.emptyTitle, { color: c.text }]}>No bookmarked notes yet</Text>
            <Text style={[styles.emptyText, { color: c.textSecondary }]}>
              Save notes from the home screen and they will appear here.
            </Text>
          </View>
        }
        renderItem={({ item }) => {
          const fileType = getFileTypeFromUrl(item.fileUrl);
          const tc = TYPE_COLORS[fileType];
          const semLabel =
            item.semester >= 1 && item.semester <= 8
              ? SEMESTERS[item.semester - 1]
              : `Sem ${item.semester}`;

          return (
            <Pressable
              style={[styles.noteCard, { backgroundColor: c.card, borderColor: c.border }]}
              onPress={() => item.fileUrl && Linking.openURL(item.fileUrl)}
            >
              <View style={styles.cardTop}>
                <View style={[styles.typeBadge, { backgroundColor: tc.bg }]}>
                  <Text style={[styles.typeBadgeText, { color: tc.text }]}>{fileType}</Text>
                </View>
                <Pressable hitSlop={8} onPress={() => handleToggleBookmark(item)}>
                  <IconSymbol name="bookmark.fill" size={18} color={c.accent} />
                </Pressable>
              </View>

              <View style={[styles.docPreview, { backgroundColor: c.background, borderColor: c.border }]}>
                <IconSymbol name="doc.text.fill" size={28} color={c.muted} />
              </View>

              <Text style={[styles.noteTitle, { color: c.text }]} numberOfLines={2}>
                {item.name}
              </Text>

              <View style={styles.noteMeta}>
                <Text style={[styles.noteMetaText, { color: c.textSecondary }]}>{item.subject}</Text>
                <View style={[styles.dot, { backgroundColor: c.muted }]} />
                <Text style={[styles.noteMetaText, { color: c.textSecondary }]}>{semLabel}</Text>
              </View>

              <View style={styles.noteFooter}>
                <View style={styles.footerItem}>
                  <IconSymbol name="heart.fill" size={14} color={c.muted} />
                  <Text style={[styles.noteMetaText, { color: c.textSecondary }]}>{item.likes}</Text>
                </View>
                <Text style={[styles.noteMetaText, { color: c.textSecondary }]}>
                  {formatDate(item.createdAt)}
                </Text>
              </View>
            </Pressable>
          );
        }}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
  },
  title: {
    fontSize: 24,
    fontFamily: Fonts.bold,
    letterSpacing: -0.3,
  },
  countBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
  },
  countText: {
    fontSize: 13,
    fontFamily: Fonts.bold,
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  noteCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    gap: 10,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  typeBadgeText: {
    fontSize: 10,
    fontFamily: Fonts.bold,
  },
  docPreview: {
    height: 88,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noteTitle: {
    fontSize: 16,
    fontFamily: Fonts.semiBold,
    lineHeight: 22,
  },
  noteMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  noteMetaText: {
    fontSize: 12,
    fontFamily: Fonts.regular,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  noteFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  footerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  empty: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 100,
    paddingHorizontal: 24,
  },
  emptyIcon: {
    width: 72,
    height: 72,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: Fonts.bold,
    marginBottom: 6,
  },
  emptyText: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    textAlign: 'center',
    lineHeight: 20,
  },
});
