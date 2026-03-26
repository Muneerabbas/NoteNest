import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Linking,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';

import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors, Fonts, SEMESTERS } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { firestore } from '@/lib/firebase';

type NoteItem = {
  id: string;
  name: string;
  subject: string;
  semester: number;
  year: number;
  likes: number;
  fileUrl: string;
  createdAt: { toDate: () => Date } | null;
};

const SUBJECT_KEY_TO_FULL: Record<string, string> = {
  Physics: 'Physics',
  CS: 'Computer Science',
  Math: 'Mathematics',
  Bio: 'Biology',
  Arts: 'Arts',
  English: 'English',
  Chemistry: 'Chemistry',
  Other: 'Other',
};

const TYPE_COLORS: Record<string, { bg: string; text: string }> = {
  PDF: { bg: '#FF3B3012', text: '#FF3B30' },
  DOCX: { bg: '#007AFF12', text: '#007AFF' },
  Image: { bg: '#34C75912', text: '#34C759' },
  File: { bg: '#8E8E9312', text: '#8E8E93' },
};

function getFileType(url: string): string {
  const l = url.toLowerCase();
  if (l.includes('.pdf')) return 'PDF';
  if (l.includes('.doc')) return 'DOCX';
  if (l.includes('.jpg') || l.includes('.jpeg') || l.includes('.png')) return 'Image';
  return 'File';
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function NotesListScreen() {
  const { subject: subjectKey, semester: semesterParam } = useLocalSearchParams<{
    subject?: string;
    semester?: string;
  }>();
  const scheme = useColorScheme() ?? 'light';
  const c = Colors[scheme];
  const [notes, setNotes] = useState<NoteItem[]>([]);
  const [loading, setLoading] = useState(true);

  const subjectFilter = subjectKey ? SUBJECT_KEY_TO_FULL[subjectKey] ?? subjectKey : null;
  const semesterFilter = semesterParam != null ? parseInt(semesterParam, 10) : null;
  const isValidSemester = semesterFilter != null && !isNaN(semesterFilter) && semesterFilter >= 1 && semesterFilter <= 8;

  const title = subjectFilter
    ? subjectFilter
    : isValidSemester
      ? `Semester ${semesterFilter}`
      : 'All Notes';

  const mapDoc = (doc: { id: string; data: () => Record<string, unknown> }): NoteItem => {
    const d = doc.data() ?? {};
    return {
      id: doc.id,
      name: typeof d.name === 'string' ? d.name : '',
      subject: typeof d.subject === 'string' ? d.subject : '',
      semester: typeof d.semester === 'number' ? d.semester : 1,
      year: typeof d.year === 'number' ? d.year : 0,
      likes: typeof d.likes === 'number' ? d.likes : 0,
      fileUrl: typeof d.fileUrl === 'string' ? d.fileUrl : '',
      createdAt: d.createdAt as NoteItem['createdAt'],
    };
  };

  const sortByCreatedAt = (a: NoteItem, b: NoteItem) => {
    const tA = a.createdAt?.toDate?.()?.getTime() ?? 0;
    const tB = b.createdAt?.toDate?.()?.getTime() ?? 0;
    return tB - tA;
  };

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    setLoading(true);

    if (subjectFilter && isValidSemester) {
      // Both subject and semester: two where clauses, no orderBy to avoid index
      unsubscribe = firestore()
        .collection('notes')
        .where('subject', '==', subjectFilter)
        .where('semester', '==', semesterFilter!)
        .onSnapshot(
          (snapshot) => {
            const list = snapshot.docs.map((doc) => mapDoc(doc)).sort(sortByCreatedAt);
            setNotes(list);
            setLoading(false);
          },
          (err) => {
            console.error('[notes-list] subject+semester query error', err);
            setNotes([]);
            setLoading(false);
          }
        );
    } else if (subjectFilter) {
      // Subject only: filter then sort in memory
      unsubscribe = firestore()
        .collection('notes')
        .where('subject', '==', subjectFilter)
        .onSnapshot(
          (snapshot) => {
            const list = snapshot.docs.map((doc) => mapDoc(doc)).sort(sortByCreatedAt);
            setNotes(list);
            setLoading(false);
          },
          (err) => {
            console.error('[notes-list] subject query error', err);
            setNotes([]);
            setLoading(false);
          }
        );
    } else if (isValidSemester) {
      // Semester only
      unsubscribe = firestore()
        .collection('notes')
        .where('semester', '==', semesterFilter!)
        .onSnapshot(
          (snapshot) => {
            const list = snapshot.docs.map((doc) => mapDoc(doc)).sort(sortByCreatedAt);
            setNotes(list);
            setLoading(false);
          },
          (err) => {
            console.error('[notes-list] semester query error', err);
            setNotes([]);
            setLoading(false);
          }
        );
    } else {
      // All notes: single orderBy is supported by default index
      unsubscribe = firestore()
        .collection('notes')
        .orderBy('createdAt', 'desc')
        .onSnapshot(
          (snapshot) => {
            setNotes(snapshot.docs.map((doc) => mapDoc(doc)));
            setLoading(false);
          },
          (err) => {
            console.error('[notes-list] all query error', err);
            setNotes([]);
            setLoading(false);
          }
        );
    }

    const timeout = setTimeout(() => setLoading(false), 5000);

    return () => {
      clearTimeout(timeout);
      unsubscribe?.();
    };
  }, [subjectFilter, semesterFilter, isValidSemester]);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: c.background }]} edges={['top']}>
      <View style={[styles.header, { borderBottomColor: c.border }]}>
        <Pressable onPress={() => router.back()} hitSlop={12} style={styles.backBtn}>
          <IconSymbol name="chevron.left" size={22} color={c.accent} />
        </Pressable>
        <Text style={[styles.title, { color: c.text }]} numberOfLines={1}>
          {title}
        </Text>
        <View style={styles.backBtn} />
      </View>

      {loading ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color={c.accent} />
          <Text style={[styles.loadingText, { color: c.textSecondary }]}>Loading notes...</Text>
        </View>
      ) : (
        <FlatList
          data={notes}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.empty}>
              <IconSymbol name="doc.text" size={48} color={c.muted} />
              <Text style={[styles.emptyTitle, { color: c.text }]}>No notes here yet</Text>
              <Text style={[styles.emptySub, { color: c.textSecondary }]}>
                Check back later or upload your own
              </Text>
            </View>
          }
          renderItem={({ item }) => {
            const fileType = getFileType(item.fileUrl);
            const tc = TYPE_COLORS[fileType] ?? TYPE_COLORS.File;
            const dateStr = item.createdAt ? formatDate(item.createdAt.toDate()) : '—';
            const semLabel =
              item.semester >= 1 && item.semester <= 8
                ? SEMESTERS[item.semester - 1]
                : `Sem ${item.semester}`;

            return (
              <Pressable
                style={[styles.card, { backgroundColor: c.card, borderColor: c.border }]}
                onPress={() => item.fileUrl && Linking.openURL(item.fileUrl)}
              >
                <View style={styles.cardRow}>
                  <View style={[styles.fileIcon, { backgroundColor: c.accentSoft }]}>
                    <IconSymbol name="doc.text.fill" size={24} color={c.accent} />
                  </View>
                  <View style={styles.cardInfo}>
                    <Text style={[styles.cardTitle, { color: c.text }]} numberOfLines={2}>
                      {item.name}
                    </Text>
                    <View style={styles.cardMeta}>
                      <View style={[styles.typeBadge, { backgroundColor: tc.bg }]}>
                        <Text style={[styles.typeBadgeText, { color: tc.text }]}>{fileType}</Text>
                      </View>
                      <Text style={[styles.metaText, { color: c.textSecondary }]}>{item.subject}</Text>
                      <View style={[styles.dot, { backgroundColor: c.muted }]} />
                      <Text style={[styles.metaText, { color: c.textSecondary }]}>{semLabel}</Text>
                    </View>
                  </View>
                  <IconSymbol name="chevron.right" size={16} color={c.muted} />
                </View>
                <View style={[styles.footer, { borderTopColor: c.border }]}>
                  <View style={styles.stat}>
                    <IconSymbol name="heart.fill" size={12} color={c.muted} />
                    <Text style={[styles.statText, { color: c.textSecondary }]}>{item.likes}</Text>
                  </View>
                  <Text style={[styles.statText, { color: c.textSecondary }]}>{dateStr}</Text>
                </View>
              </Pressable>
            );
          }}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  backBtn: {
    width: 44,
    alignItems: 'flex-start',
  },
  title: {
    flex: 1,
    fontSize: 18,
    fontFamily: Fonts.semiBold,
    textAlign: 'center',
  },
  loadingWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
    fontFamily: Fonts.regular,
  },
  list: {
    padding: 20,
    paddingBottom: 100,
  },
  empty: {
    paddingTop: 60,
    alignItems: 'center',
    gap: 10,
  },
  emptyTitle: {
    fontSize: 17,
    fontFamily: Fonts.semiBold,
  },
  emptySub: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    textAlign: 'center',
  },
  card: {
    borderRadius: 14,
    borderWidth: 1,
    overflow: 'hidden',
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
  },
  fileIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardInfo: {
    flex: 1,
    gap: 4,
  },
  cardTitle: {
    fontSize: 15,
    fontFamily: Fonts.semiBold,
  },
  cardMeta: {
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
  metaText: {
    fontSize: 12,
    fontFamily: Fonts.regular,
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 2,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderTopWidth: 1,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 12,
    fontFamily: Fonts.regular,
  },
});
