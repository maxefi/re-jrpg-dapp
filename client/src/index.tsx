import React, { ReactElement, useEffect } from 'react';
import '../global';
import Big from 'big.js';
import { registerRootComponent } from 'expo';
import * as NavigationBar from 'expo-navigation-bar';
import { NativeBaseProvider } from 'native-base';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppStoreProvider } from '@stores';
import WalletConnectProvider from '@walletconnect/react-native-dapp';

import { App } from '@screens/App';
import { expo } from '../app.json';

import { getIsWeb } from './utils/getIsWeb/getIsWeb';

const Root = (): ReactElement => {
  useEffect(() => {
    /*
     * setting Big library maximum number of decimal
     * */
    Big.DP = 2;

    /*
     * `#18181b` -> `dark.50`
     * */
    NavigationBar.setBackgroundColorAsync('#18181b');
  }, []);

  return (
    <WalletConnectProvider
      redirectUrl={getIsWeb() ? window.location.origin : `${expo.scheme}://`}
      storageOptions={{
        /*
         * `asyncStorage` can be any `AsyncStorage`, type really does not matter in this case
         * */
        // @ts-ignore
        asyncStorage: AsyncStorage,
      }}
    >
      <NativeBaseProvider>
        <AppStoreProvider>
          <App />
        </AppStoreProvider>
      </NativeBaseProvider>
    </WalletConnectProvider>
  );
};

export default registerRootComponent(Root);
