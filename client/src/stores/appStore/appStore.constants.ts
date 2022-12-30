import { AppStore } from './appStore.interface';

export enum AppDynamicField {
  IsLoading = 'isLoading',
  GameContract = 'gameContract',
  CurrentAccount = 'currentAccount',
  CharacterNFT = 'characterNFT',
  BossNFT = 'bossNFT',
}

export const DEFAULT_APP_STORE: AppStore = {
  setAppValue: (): void => {},
  resetAppStore: (): void => {},
  isLoading: false,
  gameContract: null,
  currentAccount: null,
  characterNFT: null,
  bossNFT: null,
};
