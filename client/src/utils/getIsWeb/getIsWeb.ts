import { Platform } from 'react-native';

export const getIsWeb = (): boolean => Platform.OS === 'web';
