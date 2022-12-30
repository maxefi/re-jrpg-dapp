import { Platform } from 'react-native';

export const getIsMobile = (): boolean => Platform.OS !== 'web';
