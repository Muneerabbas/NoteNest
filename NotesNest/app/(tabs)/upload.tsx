import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as DocumentPicker from 'expo-document-picker';

import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors, Fonts, SEMESTERS } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { firestore, storage } from '@/lib/firebase';
import { getAuth } from '@react-native-firebase/auth';

const SUBJECT_OPTIONS = [
  'Mathematics',
  'Computer Science',
  'Physics',
  'Biology',
  'English',
  'Chemistry',
  'Arts',
  'Other',
];

export default function UploadScreen() {
  const scheme = useColorScheme() ?? 'light';
  const c = Colors[scheme];
  const [title, setTitle] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [selectedSemester, setSelectedSemester] = useState(0);
  const [year, setYear] = useState('');
  const [fileUri, setFileUri] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [showSubjects, setShowSubjects] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const clearForm = () => {
    setTitle('');
    setSelectedSubject(null);
    setSelectedSemester(0);
    setYear('');
    setFileUri(null);
    setFileName(null);
  };

  const handleFilePick = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/*'],
        copyToCacheDirectory: true,
        multiple: false,
      });

      if (result.canceled || !result.assets?.length) {
        return;
      }

      const [pickedFile] = result.assets;
      setFileUri(pickedFile.uri);
      setFileName(pickedFile.name ?? `note-${Date.now()}`);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Unable to open the document picker.';
      Alert.alert('File picker error', message);
    }
  };

  const handleUpload = async () => {
    if (!fileUri || !fileName) {
      Alert.alert('No file', 'Please select a file to upload.');
      return;
    }
    if (!title.trim()) {
      Alert.alert('No title', 'Please enter a note title.');
      return;
    }
    if (!selectedSubject) {
      Alert.alert('No subject', 'Please select a subject.');
      return;
    }
    if (!year.trim()) {
      Alert.alert('No year', 'Please enter the academic year.');
      return;
    }

    const parsedYear = Number(year);
    if (!Number.isInteger(parsedYear)) {
      Alert.alert('Invalid year', 'Year must be a valid number.');
      return;
    }

    const currentUser = getAuth().currentUser;
    if (!currentUser) {
      Alert.alert('Not signed in', 'Please sign in before uploading notes.');
      return;
    }

    try {
      setIsUploading(true);
      console.log('[upload] starting', {
        fileName,
        fileUri,
        subject: selectedSubject,
        semester: selectedSemester + 1,
        year: parsedYear,
        uploadedBy: currentUser.uid,
      });

      const storagePath = `notes/${Date.now()}-${fileName}`;
      console.log('[upload] uploading to storage', { path: storagePath });

      const storageRef = storage().ref(storagePath);
      await storageRef.putFile(fileUri);
      console.log('[upload] storage upload complete');

      const downloadUrl = await storageRef.getDownloadURL();
      console.log('[upload] download URL resolved', { downloadUrl });

      await firestore().collection('notes').add({
        name: title.trim(),
        subject: selectedSubject,
        semester: selectedSemester + 1,
        year: parsedYear,
        uploadedBy: currentUser.uid,
        likes: 0,
        fileUrl: downloadUrl,
        createdAt: firestore.FieldValue.serverTimestamp(),
      });
      console.log('[upload] firestore write complete');

      Alert.alert('Uploaded!', 'Your notes have been uploaded successfully.', [
        {
          text: 'OK',
          onPress: clearForm,
        },
      ]);
    } catch (error) {
      console.error('[upload] failed', error);
      const message = error instanceof Error ? error.message : 'Upload failed. Please try again.';
      Alert.alert('Upload failed', message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: c.background }]}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={[styles.title, { color: c.text }]}>Upload Notes</Text>
        <Text style={[styles.subtitle, { color: c.textSecondary }]}>
          Share your notes with fellow students
        </Text>

        <Text style={[styles.label, { color: c.text }]}>Select Files</Text>
        <Pressable
          style={[
            styles.dropZone,
            {
              backgroundColor: fileUri ? c.accentSoft : c.card,
              borderColor: fileUri ? c.accent : c.borderDashed,
            },
          ]}
          onPress={handleFilePick}
        >
          <View style={[styles.uploadIconWrap, { backgroundColor: c.accentSoft }]}>
            <IconSymbol
              name="tray.and.arrow.up.fill"
              size={28}
              color={c.accent}
            />
          </View>
          {fileUri ? (
            <>
              <Text style={[styles.dropTitle, { color: c.text }]}>File selected</Text>
              <Text style={[styles.dropHint, { color: c.accent }]}>
                {fileName ?? 'Tap to change'}
              </Text>
            </>
          ) : (
            <>
              <Text style={[styles.dropTitle, { color: c.text }]}>Tap to browse files</Text>
              <Text style={[styles.dropHint, { color: c.textSecondary }]}>
                PDF or image (Max 20MB)
              </Text>
            </>
          )}
        </Pressable>

        <Text style={[styles.label, { color: c.text }]}>Note Title</Text>
        <View style={[styles.inputWrap, { backgroundColor: c.card, borderColor: c.border }]}>
          <TextInput
            style={[styles.input, { color: c.text }]}
            placeholder="e.g. Intro to Algorithms"
            placeholderTextColor={c.muted}
            value={title}
            onChangeText={setTitle}
          />
        </View>

        <Text style={[styles.label, { color: c.text }]}>Subject</Text>
        <Pressable
          style={[styles.pickerBtn, { backgroundColor: c.card, borderColor: c.border }]}
          onPress={() => setShowSubjects(!showSubjects)}
        >
          <Text
            style={[
              styles.pickerText,
              { color: selectedSubject ? c.text : c.muted },
            ]}
          >
            {selectedSubject ?? 'Select a Subject'}
          </Text>
          <IconSymbol name="chevron.down" size={20} color={c.muted} />
        </Pressable>

        {showSubjects && (
          <View style={[styles.dropdown, { backgroundColor: c.card, borderColor: c.border }]}>
            {SUBJECT_OPTIONS.map((subj) => (
              <Pressable
                key={subj}
                style={[
                  styles.dropdownItem,
                  selectedSubject === subj && { backgroundColor: c.accentSoft },
                ]}
                onPress={() => {
                  setSelectedSubject(subj);
                  setShowSubjects(false);
                }}
              >
                <Text
                  style={[
                    styles.dropdownText,
                    { color: selectedSubject === subj ? c.accent : c.text },
                  ]}
                >
                  {subj}
                </Text>
                {selectedSubject === subj && (
                  <IconSymbol name="checklist" size={18} color={c.accent} />
                )}
              </Pressable>
            ))}
          </View>
        )}

        <Text style={[styles.label, { color: c.text }]}>Semester</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.semRow}
        >
          {SEMESTERS.map((sem, i) => (
            <Pressable
              key={sem}
              style={[
                styles.semChip,
                i === selectedSemester
                  ? { backgroundColor: c.accent, borderColor: c.accent }
                  : { backgroundColor: c.card, borderColor: c.border },
              ]}
              onPress={() => setSelectedSemester(i)}
            >
              <Text
                style={[
                  styles.semText,
                  { color: i === selectedSemester ? '#FFF' : c.textSecondary },
                ]}
              >
                {sem}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        <Text style={[styles.label, { color: c.text }]}>Year</Text>
        <View style={[styles.inputWrap, { backgroundColor: c.card, borderColor: c.border }]}>
          <TextInput
            style={[styles.input, { color: c.text }]}
            placeholder="e.g. 2026"
            placeholderTextColor={c.muted}
            value={year}
            onChangeText={setYear}
            keyboardType="number-pad"
          />
        </View>

        <Pressable
          style={[
            styles.uploadBtn,
            { backgroundColor: c.accent },
            isUploading && styles.uploadBtnDisabled,
          ]}
          onPress={handleUpload}
          disabled={isUploading}
        >
          {isUploading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <>
              <IconSymbol name="tray.and.arrow.up.fill" size={18} color="#FFF" />
              <Text style={styles.uploadBtnText}>Upload Notes</Text>
            </>
          )}
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 100,
  },
  title: {
    fontSize: 24,
    fontFamily: Fonts.bold,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 15,
    fontFamily: Fonts.regular,
    marginTop: 4,
    marginBottom: 24,
  },
  label: {
    fontSize: 15,
    fontFamily: Fonts.semiBold,
    marginBottom: 10,
  },
  dropZone: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderRadius: 16,
    paddingVertical: 36,
    alignItems: 'center',
    gap: 10,
    marginBottom: 24,
  },
  uploadIconWrap: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  dropTitle: {
    fontSize: 16,
    fontFamily: Fonts.semiBold,
  },
  dropHint: {
    fontSize: 13,
    fontFamily: Fonts.regular,
  },
  inputWrap: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 50,
    justifyContent: 'center',
    marginBottom: 24,
  },
  input: {
    fontSize: 15,
    fontFamily: Fonts.regular,
  },
  pickerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 50,
    marginBottom: 8,
  },
  pickerText: {
    fontSize: 15,
    fontFamily: Fonts.regular,
  },
  dropdown: {
    borderWidth: 1,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 13,
  },
  dropdownText: {
    fontSize: 15,
    fontFamily: Fonts.regular,
  },
  semRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 32,
    paddingRight: 20,
  },
  semChip: {
    minWidth: 72,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
  },
  semText: {
    fontSize: 13,
    fontFamily: Fonts.semiBold,
  },
  uploadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 52,
    borderRadius: 14,
  },
  uploadBtnDisabled: {
    opacity: 0.7,
  },
  uploadBtnText: {
    color: '#FFF',
    fontSize: 16,
    fontFamily: Fonts.bold,
  },
});
