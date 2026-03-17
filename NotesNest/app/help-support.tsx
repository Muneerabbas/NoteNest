import { Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';

import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors, Fonts } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

const SUPPORT_ITEMS = [
  {
    icon: 'envelope.fill',
    title: 'Email support',
    subtitle: 'notesnest.support@gmail.com',
    action: () => Linking.openURL('mailto:notesnest.support@gmail.com'),
  },
  {
    icon: 'questionmark.bubble.fill',
    title: 'Report an issue',
    subtitle: 'Tell us what is not working',
    action: () =>
      Linking.openURL(
        'mailto:notesnest.support@gmail.com?subject=NotesNest%20Support%20Request'
      ),
  },
];

export default function HelpSupportScreen() {
  const scheme = useColorScheme() ?? 'light';
  const c = Colors[scheme];

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: c.background }]}>
      <Stack.Screen options={{ headerShown: false }} />

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={[styles.title, { color: c.text }]}>Help & Support</Text>
        <Text style={[styles.description, { color: c.textSecondary }]}>
          Reach out if you need help with uploads, bookmarks, or account issues.
        </Text>

        <View style={[styles.infoCard, { backgroundColor: c.card, borderColor: c.border }]}>
          {SUPPORT_ITEMS.map((item, index) => (
            <Pressable
              key={item.title}
              style={[
                styles.row,
                index !== SUPPORT_ITEMS.length - 1 && {
                  borderBottomWidth: 1,
                  borderBottomColor: c.border,
                },
              ]}
              onPress={item.action}
            >
              <View style={[styles.iconWrap, { backgroundColor: c.accentSoft }]}>
                <IconSymbol name={item.icon as any} size={18} color={c.accent} />
              </View>
              <View style={styles.copy}>
                <Text style={[styles.rowTitle, { color: c.text }]}>{item.title}</Text>
                <Text style={[styles.rowSubtitle, { color: c.textSecondary }]}>
                  {item.subtitle}
                </Text>
              </View>
              <IconSymbol name="arrow.up.right" size={16} color={c.muted} />
            </Pressable>
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
  infoCard: {
    borderRadius: 18,
    borderWidth: 1,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  iconWrap: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  copy: {
    flex: 1,
    gap: 2,
  },
  rowTitle: {
    fontSize: 15,
    fontFamily: Fonts.medium,
  },
  rowSubtitle: {
    fontSize: 12,
    fontFamily: Fonts.regular,
  },
});
