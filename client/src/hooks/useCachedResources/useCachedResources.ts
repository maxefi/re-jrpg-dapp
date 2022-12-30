import { useEffect, useMemo } from 'react';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

import { HE_IS_COMING_IMAGE, THOSE_STAIRS_IMAGE } from '@constants';
import { useToggle } from '../useToggle/useToggle';

import { UseCachedResourcesResult } from './useCachedResources.interface';
import { cacheImages } from './useCachedResources.utils';

export function useCachedResources(): UseCachedResourcesResult {
  const [isFontsLoaded] = useFonts({
    compacta: require('../../../assets/fonts/compacta.ttf'),
    cambria: require('../../../assets/fonts/cambria.ttf'),
  });

  const [isCachedResourcesLoaded, toggleIsCachedResourcesLoaded] = useToggle();

  async function loadResources(): Promise<void> {
    try {
      const imageAssets = cacheImages([THOSE_STAIRS_IMAGE.uri, HE_IS_COMING_IMAGE.uri]);

      await Promise.all([...imageAssets]);
    } catch (error) {
      console.warn(error);
    } finally {
      toggleIsCachedResourcesLoaded();
    }
  }

  const isUseCachedResourcesLoaded = useMemo(
    () => isFontsLoaded && isCachedResourcesLoaded,
    [isFontsLoaded, isCachedResourcesLoaded],
  );

  useEffect(() => {
    if (isUseCachedResourcesLoaded) {
      /*
       * `setTimeout` without a timeout is to make sure that
       * `SplashScreen.hideAsync()` always happens after `isUseCachedResourcesLoaded` is `true`
       * */
      setTimeout(() => {
        SplashScreen.hideAsync();
      });
    }
  }, [isUseCachedResourcesLoaded]);

  useEffect(() => {
    loadResources();
  }, []);

  return { isUseCachedResourcesLoaded };
}
