/**
 * Firebase is configured via React Native Firebase native modules.
 * Config comes from GoogleService-Info.plist (iOS) and google-services.json (Android).
 *
 * We use React Native Firebase for Auth, Firestore, and Storage so there is a single
 * auth state and security rules work correctly.
 */
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

export { firestore, storage };
