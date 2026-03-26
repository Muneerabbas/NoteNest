import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors, Fonts, SEMESTERS } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { firestore } from '@/lib/firebase';
import { getAuth } from '@react-native-firebase/auth';

type MyNote = {
  id: string;
  name: string;
  subject: string;
  semester: number;
  year: number;
  likes: number;
  fileUrl: string;
  createdAt: { toDate: () => Date } | null;
};

const TYPE_COLORS: Record<string, { bg: string; text: string }> = {
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

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function MyNotesScreen() {
  const scheme = useColorScheme() ?? 'light';
  const c = Colors[scheme];
  const [notes, setNotes] = useState<MyNote[]>([]);
  const [loading, setLoading] = useState(true);

  const uid = getAuth().currentUser?.uid ?? null;

  useEffect(() => {
    setLoading(true);

    if (!uid) {
      setNotes([]);
      setLoading(false);
      return;
    }

    // Query without orderBy to avoid composite index; sort in memory
    const unsubscribe = firestore()
      .collection('notes')
      .where('uploadedBy', '==', uid)
      .onSnapshot(
        (snapshot) => {
          const list: MyNote[] = snapshot.docs
            .map((doc) => {
              const d = doc.data();
              return {
                id: doc.id,
                name: d.name ?? '',
                subject: d.subject ?? '',
                semester: d.semester ?? 1,
                year: d.year ?? 0,
                likes: d.likes ?? 0,
                fileUrl: d.fileUrl ?? '',
                createdAt: d.createdAt ?? null,
              };
            })
            .sort((a, b) => {
              const tA = a.createdAt?.toDate?.()?.getTime() ?? 0;
              const tB = b.createdAt?.toDate?.()?.getTime() ?? 0;
              return tB - tA;
            });
          setNotes(list);
          setLoading(false);
        },
        (err) => {
          console.error('[my-notes] error', err);
          setNotes([]);
          setLoading(false);
        }
      );

    const timeout = setTimeout(() => setLoading(false), 5000);

    return () => {
      clearTimeout(timeout);
      unsubscribe();
    };
  }, [uid]);

  const handleDelete = (note: MyNote) => {
    Alert.alert(
      'Delete note',
      `Remove "${note.name}"? This cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await firestore().collection('notes').doc(note.id).delete();
            } catch (e) {
              Alert.alert('Error', 'Could not delete note.');
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: c.background }]}>
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color={c.accent} />
          <Text style={[styles.loadingText, { color: c.textSecondary }]}>
            Loading your notes...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: c.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: c.text }]}>My Notes</Text>
        <View style={[styles.countBadge, { backgroundColor: c.accentSoft }]}>
          <Text style={[styles.countText, { color: c.accent }]}>{notes.length}</Text>
        </View>
      </View>

      <FlatList
        data={notes}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <View style={[styles.emptyIcon, { backgroundColor: c.accentSoft }]}>
              <IconSymbol name="tray.and.arrow.up.fill" size={32} color={c.accent} />
            </View>
            <Text style={[styles.emptyTitle, { color: c.text }]}>No uploads yet</Text>
            <Text style={[styles.emptySub, { color: c.textSecondary }]}>
              Upload your first notes to share with classmates
            </Text>
          </View>
        }
        renderItem={({ item }) => {
          const fileType = getFileTypeFromUrl(item.fileUrl);
          const tc = TYPE_COLORS[fileType] ?? TYPE_COLORS.File;
          const dateStr = item.createdAt
            ? formatDate(item.createdAt.toDate())
            : '—';
          const semLabel = item.semester >= 1 && item.semester <= 8
            ? SEMESTERS[item.semester - 1]
            : `Sem ${item.semester}`;

          return (
            <Pressable
              style={[styles.noteCard, { backgroundColor: c.card, borderColor: c.border }]}
            >
              <View style={styles.cardRow}>
                <View style={[styles.fileIcon, { backgroundColor: c.accentSoft }]}>
                  <IconSymbol name="doc.text.fill" size={22} color={c.accent} />
                </View>
                <View style={styles.noteInfo}>
                  <Text style={[styles.noteTitle, { color: c.text }]} numberOfLines={1}>
                    {item.name}
                  </Text>
                  <View style={styles.noteMeta}>
                    <View style={[styles.typeBadge, { backgroundColor: tc.bg }]}>
                      <Text style={[styles.typeBadgeText, { color: tc.text }]}>{fileType}</Text>
                    </View>
                    <Text style={[styles.metaText, { color: c.textSecondary }]}>
                      {item.subject}
                    </Text>
                  </View>
                </View>
              </View>

              <View style={[styles.statsRow, { borderTopColor: c.border }]}>
                <View style={styles.stat}>
                  <IconSymbol name="heart.fill" size={14} color={c.muted} />
                  <Text style={[styles.statText, { color: c.textSecondary }]}>
                    {item.likes} likes
                  </Text>
                </View>
                <View style={styles.stat}>
                  <IconSymbol name="calendar" size={14} color={c.muted} />
                  <Text style={[styles.statText, { color: c.textSecondary }]}>{dateStr}</Text>
                </View>
                <View style={styles.stat}>
                  <IconSymbol name="graduationcap.fill" size={14} color={c.muted} />
                  <Text style={[styles.statText, { color: c.textSecondary }]}>{semLabel}</Text>
                </View>
              </View>

              <View style={styles.actions}>
                <Pressable
                  style={[styles.actionBtn, { borderColor: c.border }]}
                  onPress={() => item.fileUrl && Linking.openURL(item.fileUrl)}
                >
                  <IconSymbol name="arrow.down.circle" size={14} color={c.accent} />
                  <Text style={[styles.actionText, { color: c.accent }]}>Open</Text>
                </Pressable>
                <Pressable
                  style={[styles.actionBtn, { borderColor: c.border }]}
                  onPress={() => handleDelete(item)}
                >
                  <IconSymbol name="trash" size={14} color={c.danger} />
                  <Text style={[styles.actionText, { color: c.danger }]}>Delete</Text>
                </Pressable>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
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
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
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
    overflow: 'hidden',
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 16,
  },
  fileIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noteInfo: {
    flex: 1,
    gap: 6,
  },
  noteTitle: {
    fontSize: 15,
    fontFamily: Fonts.semiBold,
  },
  noteMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
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
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderTopWidth: 1,
    gap: 16,
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
  actions: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
    paddingBottom: 14,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    borderWidth: 1,
  },
  actionText: {
    fontSize: 12,
    fontFamily: Fonts.medium,
  },
  empty: {
    paddingTop: 80,
    alignItems: 'center',
    gap: 12,
  },
  emptyIcon: {
    width: 72,
    height: 72,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  emptyTitle: {
    fontSize: 17,
    fontFamily: Fonts.semiBold,
  },
  emptySub: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
});
