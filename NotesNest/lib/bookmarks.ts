import AsyncStorage from '@react-native-async-storage/async-storage';

export const BOOKMARKS_STORAGE_KEY = '@notesnest/bookmarked_notes';

export type BookmarkedNote = {
  id: string;
  name: string;
  subject: string;
  semester: number;
  year: number;
  uploadedBy: string;
  likes: number;
  fileUrl: string;
  createdAt: string | null;
};

function normalizeNote(input: unknown): BookmarkedNote | null {
  if (!input || typeof input !== 'object') return null;
  const note = input as Record<string, unknown>;

  if (typeof note.id !== 'string' || note.id.length === 0) return null;

  return {
    id: note.id,
    name: typeof note.name === 'string' ? note.name : '',
    subject: typeof note.subject === 'string' ? note.subject : '',
    semester: typeof note.semester === 'number' ? note.semester : 1,
    year: typeof note.year === 'number' ? note.year : 0,
    uploadedBy: typeof note.uploadedBy === 'string' ? note.uploadedBy : '',
    likes: typeof note.likes === 'number' ? note.likes : 0,
    fileUrl: typeof note.fileUrl === 'string' ? note.fileUrl : '',
    createdAt: typeof note.createdAt === 'string' ? note.createdAt : null,
  };
}

export async function getBookmarkedNotes(): Promise<BookmarkedNote[]> {
  try {
    const raw = await AsyncStorage.getItem(BOOKMARKS_STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed
      .map((item) => normalizeNote(item))
      .filter((item): item is BookmarkedNote => item !== null);
  } catch (err) {
    console.error('[bookmarks] load error', err);
    return [];
  }
}

export async function toggleBookmarkedNote(note: BookmarkedNote): Promise<BookmarkedNote[]> {
  const current = await getBookmarkedNotes();
  const exists = current.some((item) => item.id === note.id);
  const next = exists
    ? current.filter((item) => item.id !== note.id)
    : [note, ...current.filter((item) => item.id !== note.id)];

  try {
    await AsyncStorage.setItem(BOOKMARKS_STORAGE_KEY, JSON.stringify(next));
  } catch (err) {
    console.error('[bookmarks] save error', err);
  }

  return next;
}
