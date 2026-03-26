import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { SymbolWeight, SymbolViewProps } from 'expo-symbols';
import { ComponentProps } from 'react';
import { OpaqueColorValue, type StyleProp, type TextStyle } from 'react-native';

type IconMapping = Record<SymbolViewProps['name'], ComponentProps<typeof MaterialIcons>['name']>;
type IconSymbolName = keyof typeof MAPPING;

const MAPPING = {
  'house.fill': 'home',
  'house': 'home',
  'paperplane.fill': 'send',
  'chevron.left.forwardslash.chevron.right': 'code',
  'chevron.right': 'chevron-right',
  'chevron.down': 'keyboard-arrow-down',
  'square.and.pencil': 'edit',
  'person.crop.circle': 'person',
  'person': 'person-outline',
  'sparkles': 'auto-awesome',
  'folder.fill': 'folder',
  'bookmark.fill': 'bookmark',
  'bookmark': 'bookmark-border',
  'checklist': 'playlist-add-check',
  'doc.text': 'description',
  'doc.text.fill': 'description',
  'magnifyingglass': 'search',
  'plus': 'add',
  'envelope.fill': 'email',
  'lock.fill': 'lock',
  'eye.fill': 'visibility',
  'eye.slash.fill': 'visibility-off',
  'arrow.right': 'arrow-forward',
  'arrow.left': 'arrow-back',
  'arrow.up.doc.fill': 'upload-file',
  'book.fill': 'menu-book',
  'atom': 'science',
  'function': 'functions',
  'laptopcomputer': 'computer',
  'text.book.closed.fill': 'auto-stories',
  'gearshape': 'settings',
  'bell': 'notifications-none',
  'bell.fill': 'notifications',
  'questionmark.circle': 'help-outline',
  'info.circle': 'info-outline',
  'arrow.right.square': 'logout',
  'shield.fill': 'shield',
  'paintbrush.fill': 'palette',
  'moon.fill': 'dark-mode',
  'pencil': 'edit',
  'trash': 'delete-outline',
  'clock': 'access-time',
  'star.fill': 'star',
  'star': 'star-border',
  'xmark': 'close',
  'camera.fill': 'photo-camera',
  'photo.fill': 'photo',
  'tray.and.arrow.up.fill': 'cloud-upload',
  'tray.and.arrow.up': 'cloud-upload',
  'note.text': 'sticky-note-2',
  'line.3.horizontal.decrease': 'tune',
  'arrow.down.circle': 'download',
  'flame.fill': 'local-fire-department',
  'graduationcap.fill': 'school',
  'calendar': 'calendar-today',
  'doc.on.doc': 'file-copy',
  'hand.thumbsup.fill': 'thumb-up',
  'square.grid.2x2': 'grid-view',
  'list.bullet': 'view-list',
  'slider.horizontal.3': 'tune',
} as IconMapping;

export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  return <MaterialIcons color={color} size={size} name={MAPPING[name]} style={style} />;
}
