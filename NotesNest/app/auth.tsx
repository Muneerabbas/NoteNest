import { Redirect } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { IconSymbol } from '@/components/ui/icon-symbol';
import { Fonts } from '@/constants/theme';
import { useAuth } from '@/context/auth-context';
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
} from '@react-native-firebase/auth';

type AuthMode = 'login' | 'signup';

export default function AuthScreen() {
  const { token, isHydrated, setAuthToken } = useAuth();
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isHydrated) return null;
  if (token) return <Redirect href="/(tabs)" />;

  const onSubmit = async () => {
    setError(null);
    if (!email || !password) {
      setError('Email and password are required.');
      return;
    }
    if (mode === 'signup' && password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    try {
      setIsSubmitting(true);
      const nextToken =
        mode === 'login'
          ? await loginWithFirebase(email, password)
          : await signupWithFirebase(email, password);
      setAuthToken(nextToken);
    } catch (submitError: unknown) {
      const message =
        submitError instanceof Error ? submitError.message : 'Authentication failed.';
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.kav}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.logoArea}>
            <View style={styles.logoCircle}>
              <IconSymbol name="note.text" size={30} color="#FFF" />
            </View>
            <Text style={styles.brand}>NotesNest</Text>
            <Text style={styles.tagline}>Share and discover student notes</Text>
          </View>

          <View style={styles.card}>
            <View style={styles.segmentRow}>
              <Pressable
                style={[styles.segment, mode === 'login' && styles.segmentActive]}
                onPress={() => setMode('login')}
              >
                <Text style={[styles.segmentText, mode === 'login' && styles.segmentTextActive]}>
                  Log in
                </Text>
              </Pressable>
              <Pressable
                style={[styles.segment, mode === 'signup' && styles.segmentActive]}
                onPress={() => setMode('signup')}
              >
                <Text style={[styles.segmentText, mode === 'signup' && styles.segmentTextActive]}>
                  Sign up
                </Text>
              </Pressable>
            </View>

            <View style={styles.inputWrap}>
              <IconSymbol name="envelope.fill" size={18} color="#AEAEB2" />
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="Email address"
                placeholderTextColor="#AEAEB2"
                autoCapitalize="none"
                keyboardType="email-address"
                autoComplete="email"
              />
            </View>

            <View style={styles.inputWrap}>
              <IconSymbol name="lock.fill" size={18} color="#AEAEB2" />
              <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                placeholder="Password"
                placeholderTextColor="#AEAEB2"
                secureTextEntry={!showPassword}
                autoComplete="password"
              />
              <Pressable onPress={() => setShowPassword((v) => !v)} hitSlop={8}>
                <IconSymbol
                  name={showPassword ? 'eye.slash.fill' : 'eye.fill'}
                  size={18}
                  color="#AEAEB2"
                />
              </Pressable>
            </View>

            {mode === 'signup' && (
              <View style={styles.inputWrap}>
                <IconSymbol name="lock.fill" size={18} color="#AEAEB2" />
                <TextInput
                  style={styles.input}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder="Confirm password"
                  placeholderTextColor="#AEAEB2"
                  secureTextEntry={!showPassword}
                />
              </View>
            )}

            {error && (
              <View style={styles.errorRow}>
                <IconSymbol name="info.circle" size={14} color="#FF3B30" />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            <Pressable
              style={[styles.submitBtn, isSubmitting && { opacity: 0.7 }]}
              onPress={onSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator size="small" color="#FFF" />
              ) : (
                <View style={styles.submitInner}>
                  <Text style={styles.submitText}>
                    {mode === 'login' ? 'Log in' : 'Create account'}
                  </Text>
                  <IconSymbol name="arrow.right" size={18} color="#FFF" />
                </View>
              )}
            </Pressable>
          </View>

          <Text style={styles.footer}>
            {mode === 'login'
              ? "Don't have an account? Tap Sign up."
              : 'Already have an account? Tap Log in.'}
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

async function loginWithFirebase(email: string, password: string): Promise<string> {
  const credential = await signInWithEmailAndPassword(getAuth(), email.trim(), password);
  return credential.user.getIdToken();
}

async function signupWithFirebase(email: string, password: string): Promise<string> {
  const credential = await createUserWithEmailAndPassword(getAuth(), email.trim(), password);
  return credential.user.getIdToken();
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  kav: { flex: 1 },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  logoArea: {
    alignItems: 'center',
    gap: 10,
    marginBottom: 32,
  },
  logoCircle: {
    width: 68,
    height: 68,
    borderRadius: 22,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
    shadowColor: '#007AFF',
    shadowOpacity: 0.3,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  brand: {
    fontSize: 30,
    fontFamily: Fonts.bold,
    color: '#1A1A2E',
    letterSpacing: -0.5,
  },
  tagline: {
    fontSize: 15,
    fontFamily: Fonts.regular,
    color: '#8E8E93',
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 20,
    gap: 14,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  segmentRow: {
    flexDirection: 'row',
    backgroundColor: '#F2F2F7',
    borderRadius: 12,
    padding: 4,
    marginBottom: 4,
  },
  segment: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 9,
  },
  segmentActive: {
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  segmentText: {
    fontFamily: Fonts.medium,
    fontSize: 14,
    color: '#8E8E93',
  },
  segmentTextActive: {
    fontFamily: Fonts.semiBold,
    color: '#007AFF',
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#F8F8FA',
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 52,
  },
  input: {
    flex: 1,
    fontSize: 15,
    fontFamily: Fonts.regular,
    color: '#1A1A2E',
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  errorText: {
    fontSize: 13,
    fontFamily: Fonts.regular,
    color: '#FF3B30',
  },
  submitBtn: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
    shadowColor: '#007AFF',
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  submitInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  submitText: {
    fontFamily: Fonts.semiBold,
    fontSize: 16,
    color: '#FFF',
  },
  footer: {
    textAlign: 'center',
    fontSize: 13,
    fontFamily: Fonts.regular,
    color: '#8E8E93',
    marginTop: 20,
  },
});
