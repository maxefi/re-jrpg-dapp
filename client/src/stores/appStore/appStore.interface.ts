import ethers from 'ethers';

import { TransformCharacterDataResult } from '@utils';

import { AppDynamicField } from './appStore.constants';

export type SetAppValueType = AppStore[AppDynamicField];

export interface AppStore {
  setAppValue: (name: AppDynamicField, value?: SetAppValueType) => void;
  resetAppStore: () => void;
  [AppDynamicField.IsLoading]: boolean;
  [AppDynamicField.GameContract]: Nullable<ethers.Contract>;
  [AppDynamicField.CurrentAccount]: Nullable<string>;
  [AppDynamicField.CharacterNFT]: Nullable<TransformCharacterDataResult>;
  [AppDynamicField.BossNFT]: Nullable<TransformCharacterDataResult>;
}

export interface AppStoreProviderProps {
  store?: AppStore;
}
