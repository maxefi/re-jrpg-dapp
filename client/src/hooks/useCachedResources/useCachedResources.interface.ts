import { ImageRequireSource } from 'react-native';

export type ImageUri = string | ImageRequireSource;

export interface UseCachedResourcesResult {
  isUseCachedResourcesLoaded: boolean;
}
