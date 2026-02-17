import { Redirect } from 'expo-router';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/themed-text';
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
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isHydrated) {
    return null;
  }

  if (token) {
    return <Redirect href="/(tabs)" />;
  }

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
        submitError instanceof Error ? submitError.message : 'Authentication failed. Please try again.';
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.card}>
          <ThemedText style={styles.title}>NotesNest</ThemedText>
          <ThemedText style={styles.subtitle}>Sign in or create an account to open your tabs.</ThemedText>

          <View style={styles.tabRow}>
            <Pressable
              style={[styles.tabButton, mode === 'login' && styles.tabButtonActive]}
              onPress={() => setMode('login')}>
              <ThemedText style={[styles.tabText, mode === 'login' && styles.tabTextActive]}>Login</ThemedText>
            </Pressable>
            <Pressable
              style={[styles.tabButton, mode === 'signup' && styles.tabButtonActive]}
              onPress={() => setMode('signup')}>
              <ThemedText style={[styles.tabText, mode === 'signup' && styles.tabTextActive]}>
                Sign Up
              </ThemedText>
            </Pressable>
          </View>

          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="Email"
            placeholderTextColor="#71717a"
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholder="Password"
            placeholderTextColor="#71717a"
            secureTextEntry
          />
          {mode === 'signup' ? (
            <TextInput
              style={styles.input}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Confirm password"
              placeholderTextColor="#71717a"
              secureTextEntry
            />
          ) : null}

          {error ? <ThemedText style={styles.error}>{error}</ThemedText> : null}

          <Pressable style={styles.submitButton} onPress={onSubmit} disabled={isSubmitting}>
            <ThemedText style={styles.submitText}>
              {isSubmitting ? 'Please wait...' : mode === 'login' ? 'Login' : 'Create Account'}
            </ThemedText>
          </Pressable>
        </View>
        
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
  safeArea: {
    flex: 1,
    backgroundColor: '#f4f4f5',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#e4e4e7',
    padding: 20,
    gap: 12,
  },
  title: {
    fontSize: 30,
    fontFamily: Fonts.serif,
    color: '#09090b',
  },
  subtitle: {
    color: '#52525b',
    fontSize: 14,
  },
  tabRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
  tabButton: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#d4d4d8',
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: '#fafafa',
  },
  tabButtonActive: {
    backgroundColor: '#18181b',
    borderColor: '#18181b',
  },
  tabText: {
    fontFamily: Fonts.rounded,
    color: '#3f3f46',
  },
  tabTextActive: {
    color: '#fafafa',
  },
  input: {
    borderWidth: 1,
    borderColor: '#d4d4d8',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: '#09090b',
  },
  error: {
    color: '#b91c1c',
    fontSize: 13,
  },
  submitButton: {
    marginTop: 4,
    borderRadius: 12,
    backgroundColor: '#18181b',
    paddingVertical: 12,
    alignItems: 'center',
  },
  submitText: {
    color: '#fafafa',
    fontFamily: Fonts.rounded,
    fontSize: 14,
  },
});
