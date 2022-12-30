import { Image } from 'react-native';
import { Asset } from 'expo-asset';

import { ImageUri } from './useCachedResources.interface';

export const cacheImages = (images: ImageUri[]): (Promise<boolean> | Promise<Asset>)[] => {
  return images.map((image) => {
    if (typeof image === 'string') {
      return Image.prefetch(image);
    }

    return Asset.fromModule(image).downloadAsync();
  });
};
