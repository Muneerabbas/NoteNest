import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';

import { Colors, Fonts } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

const PRIVACY_POINTS = [
  'Your saved notes are stored on your device so you can access them quickly.',
  'Uploaded notes stay linked to your account so you can manage them later.',
  'Only the app features you use will request access to files or network services.',
];

export default function PrivacyScreen() {
  const scheme = useColorScheme() ?? 'light';
  const c = Colors[scheme];

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: c.background }]}>
      <Stack.Screen options={{ headerShown: false }} />

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={[styles.title, { color: c.text }]}>Privacy</Text>
        <Text style={[styles.description, { color: c.textSecondary }]}>
          NotesNest keeps your note activity focused on the features you use inside the app.
        </Text>

        <View style={[styles.card, { backgroundColor: c.card, borderColor: c.border }]}>
          {PRIVACY_POINTS.map((point) => (
            <View key={point} style={styles.pointRow}>
              <View style={[styles.dot, { backgroundColor: c.accent }]} />
              <Text style={[styles.pointText, { color: c.text }]}>{point}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontFamily: Fonts.bold,
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: Fonts.regular,
    marginBottom: 20,
  },
  card: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 18,
    gap: 16,
  },
  pointRow: {
    flexDirection: 'row',
    gap: 12,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 6,
  },
  pointText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    fontFamily: Fonts.regular,
  },
});
