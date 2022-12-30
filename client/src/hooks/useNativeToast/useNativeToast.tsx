import { useToast } from 'native-base';

import { TOAST_DURATION } from './useNativeToast.constants';
import { UseNativeToastResult } from './useNativeToast.interface';

export function useNativeToast(): UseNativeToastResult {
  const toast = useToast();

  function showToast(title: string): void {
    toast.show({
      placement: 'bottom',
      variant: 'subtle',
      title,
      duration: TOAST_DURATION,
    });
  }

  return { showToast };
}
