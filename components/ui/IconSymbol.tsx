// This file is a fallback for using MaterialIcons on Android and web.

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { SymbolWeight } from 'expo-symbols';
import * as React from 'react';
import { OpaqueColorValue, StyleProp, ViewStyle, Platform } from 'react-native';

// Add your SFSymbol to MaterialIcons mappings here.
const MAPPING = {
  // Navigation
  'chevron.left': 'keyboard-arrow-left',
  'chevron.right': 'keyboard-arrow-right',
  'chevron.down': 'keyboard-arrow-down',
  'chevron.up': 'keyboard-arrow-up',
  'xmark': 'close',
  
  // Tab Bar & Main Navigation
  'sparkles': 'auto-awesome',
  'books.vertical.fill': 'library-books',
  'questionmark.circle.fill': 'help-outline',
  'person.fill': 'account-circle',
  
  // Profile Section
  'person.circle': 'person', // Thông tin cá nhân
  'person.circle.fill': 'person', // Thông tin cá nhân (filled)
  'clock.arrow.circlepath': 'update', // Lịch sử tra cứu
  'gear': 'settings', // Cài đặt
  'gear.circle': 'settings', // Cài đặt (circle)
  'gear.circle.fill': 'settings', // Cài đặt (filled)
  'doc.text': 'description', // Điều khoản sử dụng
  'doc.text.fill': 'description', // Điều khoản sử dụng (filled)
  'shield.fill': 'security', // Chính sách bảo mật
  'arrow.right.circle.fill': 'arrow-forward', // Icon mũi tên
  
  // Support Section
  'book.fill': 'menu-book', // Hướng dẫn sử dụng
  'person.2.fill': 'groups', // Cộng đồng
  'person.3.fill': 'groups', // Cộng đồng (alt)
  
  // Library Section
  'moon.stars.fill': 'nights-stay', // Oracle
  'number.circle.fill': 'looks-one', // Thần số học
  'book.closed.fill': 'class', // Khóa học
  'doc.richtext.fill': 'article', // Bài viết
  
  // Common Icons
  'house.fill': 'home',
  'paperplane.fill': 'send',
  'moon.stars': 'nightlight',
  'star': 'star-border',
  'star.fill': 'star',
  'sun.max': 'light-mode',
  'number': 'looks-one',
  'wand.and.stars': 'auto-fix-high',
  'bell': 'notifications-none',
  'bell.fill': 'notifications',
  'lock': 'lock-outline',
  'lock.fill': 'lock',
  'envelope': 'mail-outline',
  'envelope.fill': 'mail',
  'phone': 'phone',
  'phone.fill': 'phone-enabled',
  'info.circle': 'info-outline',
  'info.circle.fill': 'info',
  'checkmark': 'check',
  'checkmark.circle': 'check-circle-outline',
  'checkmark.circle.fill': 'check-circle',
  'plus': 'add',
  'plus.circle': 'add-circle-outline',
  'plus.circle.fill': 'add-circle',
  'minus': 'remove',
  'minus.circle': 'remove-circle-outline',
  'minus.circle.fill': 'remove-circle',
  'pencil': 'edit',
  'pencil.circle': 'edit',
  'trash': 'delete-outline',
  'trash.fill': 'delete',
  'doc': 'description',
  'doc.fill': 'article',
  'calendar': 'calendar-today',
  'calendar.fill': 'event',
  'clock': 'schedule',
  'clock.fill': 'access-time-filled',
  'heart': 'favorite-border',
  'heart.fill': 'favorite',
  'bookmark': 'bookmark-border',
  'bookmark.fill': 'bookmark',
  'search': 'search',
  'magnifyingglass': 'search',
  'arrow.clockwise': 'refresh',
  'arrow.triangle.2.circlepath': 'refresh',
  'arrow.up': 'arrow-upward',
  'arrow.down': 'arrow-downward',
  'arrow.left': 'arrow-back',
  'arrow.right': 'arrow-forward',
  'arrow.up.right': 'arrow-forward',
  'arrow.up.left': 'arrow-back',
  'arrow.down.right': 'arrow-forward',
  'arrow.down.left': 'arrow-back',
  'ellipsis': 'more-horiz',
  'ellipsis.circle': 'more-horiz',
  'list.bullet': 'list',
  'square.grid.2x2': 'grid-view',
  'square.grid.3x3': 'apps',
} as const;

export type IconSymbolName = keyof typeof MAPPING;

/**
 * An icon component that uses native SFSymbols on iOS, and MaterialIcons on Android and web.
 * This ensures a consistent look across platforms, and optimal resource usage.
 *
 * Icon `name`s are based on SFSymbols and require manual mapping to MaterialIcons.
 * See all available Material Icons here: https://fonts.google.com/icons?icon.set=Material+Icons
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<ViewStyle>;
  weight?: SymbolWeight;
}) {
  if (__DEV__) {
    // Log trong development để debug
    console.log('IconSymbol:', {
      name,
      mappedName: MAPPING[name],
      platform: Platform.OS,
    });
  }

  const materialIconName = MAPPING[name] || 'help-outline';
  return <MaterialIcons color={color} size={size} name={materialIconName} style={style} />;
}
