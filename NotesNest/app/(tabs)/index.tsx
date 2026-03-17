import { useCallback, useEffect, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Pressable,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';

import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors, Fonts, SEMESTER_COLORS, SUBJECTS } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { getBookmarkedNotes, toggleBookmarkedNote } from '@/lib/bookmarks';
import { firestore } from '@/lib/firebase';

export type NoteDoc = {
  id: string;
  name: string;
  subject: string;
  semester: number;
  year: number;
  uploadedBy: string;
  likes: number;
  fileUrl: string;
  createdAt: { toDate: () => Date } | null;
};

const SEMESTER_LABELS = [
  'Semester 1',
  'Semester 2',
  'Semester 3',
  'Semester 4',
  'Semester 5',
  'Semester 6',
  'Semester 7',
  'Semester 8',
];

function formatNoteDate(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (24 * 60 * 60 * 1000));
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function getFileTypeFromUrl(url: string): string {
  const lower = url.toLowerCase();
  if (lower.includes('.pdf')) return 'PDF';
  if (lower.includes('.doc')) return 'DOCX';
  if (lower.includes('.jpg') || lower.includes('.jpeg') || lower.includes('.png')) return 'Image';
  return 'File';
}

export default function HomeScreen() {
  const scheme = useColorScheme() ?? 'light';
  const c = Colors[scheme];
  const [recentNotes, setRecentNotes] = useState<NoteDoc[]>([]);
  const [semesterCounts, setSemesterCounts] = useState<number[]>(() =>
    Array(8).fill(0)
  );
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);

  const loadBookmarks = useCallback(async () => {
    const bookmarks = await getBookmarkedNotes();
    setBookmarkedIds(bookmarks.map((note) => note.id));
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadBookmarks();
    }, [loadBookmarks])
  );

  useEffect(() => {
    const unsubRecent = firestore()
      .collection('notes')
      .orderBy('createdAt', 'desc')
      .limit(10)
      .onSnapshot(
        (snapshot) => {
          const notes: NoteDoc[] = snapshot.docs.map((doc) => {
            const d = doc.data();
            return {
              id: doc.id,
              name: d.name ?? '',
              subject: d.subject ?? '',
              semester: d.semester ?? 1,
              year: d.year ?? 0,
              uploadedBy: d.uploadedBy ?? '',
              likes: d.likes ?? 0,
              fileUrl: d.fileUrl ?? '',
              createdAt: d.createdAt ?? null,
            };
          });
          setRecentNotes(notes);
        },
        (err) => {
          console.error('[home] recent notes error', err);
          setRecentNotes([]);
        }
      );

    // Semester counts: fetch in background, never block UI
    firestore()
      .collection('notes')
      .orderBy('createdAt', 'desc')
      .limit(300)
      .get()
      .then((snapshot) => {
        const counts = Array(8).fill(0);
        snapshot.docs.forEach((doc) => {
          const sem = (doc.data().semester as number) ?? 1;
          if (sem >= 1 && sem <= 8) counts[sem - 1]++;
        });
        setSemesterCounts(counts);
      })
      .catch((err) => {
        console.error('[home] semester counts error', err);
      })
      .finally(() => setLoading(false));

    // Safety: stop loading after 5s if Firestore never responds
    const timeout = setTimeout(() => setLoading(false), 5000);
    return () => {
      unsubRecent();
      clearTimeout(timeout);
    };
  }, []);

  const handleToggleBookmark = async (note: NoteDoc) => {
    const next = await toggleBookmarkedNote({
      ...note,
      createdAt: note.createdAt?.toDate?.().toISOString() ?? null,
    });
    setBookmarkedIds(next.map((item) => item.id));
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: c.background }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <View style={[styles.logo, { backgroundColor: c.accent }]}>
            <IconSymbol name="note.text" size={18} color="#FFF" />
          </View>
          <Text style={[styles.appName, { color: c.text }]}>NotesNest</Text>
          <View style={{ flex: 1 }} />
          <Pressable style={[styles.headerBtn, { backgroundColor: c.card, borderColor: c.border }]}>
            <IconSymbol name="bell" size={20} color={c.textSecondary} />
          </Pressable>
          <Pressable
            style={[styles.avatarSmall, { backgroundColor: c.accent }]}
            onPress={() => router.navigate('/(tabs)/profile')}
          >
            <Text style={styles.avatarSmallText}>M</Text>
          </Pressable>
        </View>

        <View style={styles.greetSection}>
          <Text style={[styles.greeting, { color: c.text }]}>Hi, Muneera</Text>
          <Text style={[styles.greetSub, { color: c.textSecondary }]}>
            Find the best notes for your exams.
          </Text>
        </View>

        <View style={[styles.searchBox, { backgroundColor: c.card, borderColor: c.border }]}>
          <IconSymbol name="magnifyingglass" size={18} color={c.muted} />
          <TextInput
            style={[styles.searchInput, { color: c.text }]}
            placeholder="Search notes, PYQs, labs..."
            placeholderTextColor={c.muted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <View style={[styles.filterIcon, { backgroundColor: c.accentSoft }]}>
            <IconSymbol name="slider.horizontal.3" size={16} color={c.accent} />
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: c.text }]}>Quick Access</Text>
          <Pressable onPress={() => router.push('/notes-list')}>
            <Text style={[styles.sectionLink, { color: c.accent }]}>View all</Text>
          </Pressable>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.subjectsRow}
        >
          {SUBJECTS.map((subj) => {
            const subjColor = c[subj.colorKey as keyof typeof c] as string;
            return (
              <Pressable
                key={subj.key}
                style={styles.subjectItem}
                onPress={() => router.push(`/notes-list?subject=${encodeURIComponent(subj.key)}`)}
              >
                <View style={[styles.subjectCircle, { backgroundColor: subjColor + '18' }]}>
                  <IconSymbol name={subj.icon as any} size={24} color={subjColor} />
                </View>
                <Text style={[styles.subjectLabel, { color: c.textSecondary }]}>
                  {subj.key.toUpperCase()}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: c.text }]}>Browse by Semester</Text>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.semRow}
        >
          {SEMESTER_LABELS.map((label, i) => (
            <Pressable
              key={label}
              style={[styles.semCard, { backgroundColor: c.card, borderColor: c.border }]}
              onPress={() => router.push(`/notes-list?semester=${i + 1}`)}
            >
              <View
                style={[
                  styles.semAccent,
                  { backgroundColor: (SEMESTER_COLORS[i] ?? SEMESTER_COLORS[0]) + '15' },
                ]}
              >
                <IconSymbol
                  name="folder.fill"
                  size={20}
                  color={SEMESTER_COLORS[i] ?? SEMESTER_COLORS[0]}
                />
              </View>
              <Text style={[styles.semLabel, { color: c.text }]}>{label}</Text>
              <Text style={[styles.semCount, { color: c.textSecondary }]}>
                {loading ? '...' : `${semesterCounts[i] ?? 0} notes`}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: c.text }]}>Recently Added</Text>
          <Pressable onPress={() => router.push('/notes-list')}>
            <Text style={[styles.sectionLink, { color: c.accent }]}>See all</Text>
          </Pressable>
        </View>

        {recentNotes.length === 0 ? (
          <View style={[styles.emptyCard, { backgroundColor: c.card, borderColor: c.border }]}>
            <IconSymbol name="doc.text" size={32} color={c.muted} />
            <Text style={[styles.emptyText, { color: c.textSecondary }]}>
              No notes yet. Be the first to upload!
            </Text>
          </View>
        ) : (
          recentNotes.map((note) => {
            const dateStr = note.createdAt
              ? formatNoteDate(note.createdAt.toDate())
              : 'Recently';
            const fileType = getFileTypeFromUrl(note.fileUrl);
            const isBookmarked = bookmarkedIds.includes(note.id);
            return (
              <Pressable
                key={note.id}
                style={[styles.recentCard, { backgroundColor: c.card, borderColor: c.border }]}
                onPress={() => note.fileUrl && Linking.openURL(note.fileUrl)}
              >
                <View style={[styles.fileThumb, { backgroundColor: c.accentSoft }]}>
                  <IconSymbol name="doc.text.fill" size={22} color={c.accent} />
                </View>
                <View style={styles.recentInfo}>
                  <Text style={[styles.recentTitle, { color: c.text }]} numberOfLines={1}>
                    {note.name}
                  </Text>
                  <View style={styles.recentMeta}>
                    <View
                      style={[
                        styles.typeBadge,
                        {
                          backgroundColor:
                            fileType === 'PDF' ? '#FF3B3015' : '#007AFF15',
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.typeBadgeText,
                          { color: fileType === 'PDF' ? '#FF3B30' : '#007AFF' },
                        ]}
                      >
                        {fileType}
                      </Text>
                    </View>
                    <Text style={[styles.recentDate, { color: c.textSecondary }]}>
                      {note.subject}
                    </Text>
                    <View style={[styles.dot, { backgroundColor: c.muted }]} />
                    <Text style={[styles.recentDate, { color: c.textSecondary }]}>
                      {dateStr}
                    </Text>
                  </View>
                </View>
                <Pressable hitSlop={8} onPress={() => handleToggleBookmark(note)}>
                  <IconSymbol
                    name={isBookmarked ? 'bookmark.fill' : 'bookmark'}
                    size={20}
                    color={isBookmarked ? c.accent : c.muted}
                  />
                </Pressable>
              </Pressable>
            );
          })
        )}

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { paddingHorizontal: 20 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingTop: 8,
    paddingBottom: 12,
  },
  logo: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  appName: {
    fontSize: 18,
    fontFamily: Fonts.bold,
  },
  headerBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarSmall: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarSmallText: {
    color: '#FFF',
    fontFamily: Fonts.bold,
    fontSize: 14,
  },
  greetSection: {
    paddingTop: 8,
    paddingBottom: 18,
    gap: 4,
  },
  greeting: {
    fontSize: 24,
    fontFamily: Fonts.bold,
    letterSpacing: -0.3,
  },
  greetSub: {
    fontSize: 15,
    fontFamily: Fonts.regular,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
    borderRadius: 14,
    paddingLeft: 16,
    paddingRight: 6,
    height: 48,
    marginBottom: 24,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontFamily: Fonts.regular,
  },
  filterIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: Fonts.bold,
  },
  sectionLink: {
    fontSize: 14,
    fontFamily: Fonts.semiBold,
  },
  subjectsRow: {
    gap: 20,
    paddingBottom: 24,
  },
  subjectItem: {
    alignItems: 'center',
    gap: 8,
    width: 64,
  },
  subjectCircle: {
    width: 56,
    height: 56,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subjectLabel: {
    fontSize: 10,
    fontFamily: Fonts.bold,
    letterSpacing: 0.5,
  },
  loadingRow: {
    paddingVertical: 24,
    alignItems: 'center',
  },
  semRow: {
    gap: 12,
    paddingBottom: 24,
  },
  semCard: {
    width: 150,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    gap: 10,
  },
  semAccent: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  semLabel: {
    fontSize: 15,
    fontFamily: Fonts.semiBold,
  },
  semCount: {
    fontSize: 12,
    fontFamily: Fonts.regular,
  },
  recentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 10,
  },
  fileThumb: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recentInfo: {
    flex: 1,
    gap: 6,
  },
  recentTitle: {
    fontSize: 14,
    fontFamily: Fonts.semiBold,
  },
  recentMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  typeBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  typeBadgeText: {
    fontSize: 10,
    fontFamily: Fonts.bold,
  },
  recentDate: {
    fontSize: 12,
    fontFamily: Fonts.regular,
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 2,
  },
  emptyCard: {
    padding: 24,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    gap: 8,
  },
  emptyText: {
    fontSize: 14,
    fontFamily: Fonts.regular,
  },
});
