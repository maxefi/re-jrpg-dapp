import React, { createContext, PropsWithChildren, ReactElement, useContext, useState } from 'react';
import { useToggle } from '@hooks';

import { TransformCharacterDataResult } from '@utils';

import { AppDynamicField, DEFAULT_APP_STORE } from './appStore.constants';
import { AppStore, AppStoreProviderProps, SetAppValueType } from './appStore.interface';

const AppStoreContext = createContext<AppStore>(DEFAULT_APP_STORE);

export function AppStoreProvider(props: PropsWithChildren<AppStoreProviderProps>): ReactElement {
  const { store = DEFAULT_APP_STORE, children } = props;

  const [isLoading, toggleIsLoading, , setIsNotLoading] = useToggle();
  const [gameContract, setGameContract] = useState<AppStore[AppDynamicField.GameContract]>(store.gameContract);
  const [currentAccount, setCurrentAccount] = useState<AppStore[AppDynamicField.CurrentAccount]>(store.currentAccount);
  const [characterNFT, setCharacterNFT] = useState<AppStore[AppDynamicField.CharacterNFT]>(store.characterNFT);
  const [bossNFT, setBossNFT] = useState<AppStore[AppDynamicField.BossNFT]>(store.bossNFT);

  function setAppValue(name: AppDynamicField, value?: SetAppValueType): void {
    switch (name) {
      case AppDynamicField.IsLoading:
        toggleIsLoading();

        break;
      case AppDynamicField.GameContract:
        setGameContract(value as AppStore[AppDynamicField.GameContract]);

        break;
      case AppDynamicField.CurrentAccount:
        setCurrentAccount(value as AppStore[AppDynamicField.CurrentAccount]);

        break;
      case AppDynamicField.CharacterNFT:
        setCharacterNFT(value as Nullable<TransformCharacterDataResult>);

        break;
      case AppDynamicField.BossNFT:
        setBossNFT(value as Nullable<TransformCharacterDataResult>);

        break;
      default:
        break;
    }
  }

  function resetAppStore(): void {
    setIsNotLoading();
    setGameContract(DEFAULT_APP_STORE[AppDynamicField.GameContract]);
    setCurrentAccount(DEFAULT_APP_STORE[AppDynamicField.CurrentAccount]);
    setCharacterNFT(DEFAULT_APP_STORE[AppDynamicField.CharacterNFT]);
    setBossNFT(DEFAULT_APP_STORE[AppDynamicField.BossNFT]);
  }

  return (
    <AppStoreContext.Provider
      value={Object.freeze<AppStore>({
        setAppValue,
        resetAppStore,
        isLoading,
        gameContract,
        currentAccount,
        characterNFT,
        bossNFT,
      })}
    >
      {children}
    </AppStoreContext.Provider>
  );
}

export const useAppStore = (): AppStore => useContext<AppStore>(AppStoreContext);
