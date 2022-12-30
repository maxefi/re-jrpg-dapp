// https://docs.ethers.io/v5/cookbook/react-native/
// Import the crypto getRandomValues shim (**BEFORE** the shims)
// import "react-native-get-random-values"

// Pull in the shims (BEFORE importing ethers)
import React, { memo, ReactElement, useCallback, useEffect, useMemo } from 'react';
import { ethers } from 'ethers';
import * as SplashScreen from 'expo-splash-screen';
import { Box, Spinner, VStack } from 'native-base';
import '@ethersproject/shims';
import { useCachedResources } from '@hooks';
import { MetaMaskInpageProvider } from '@metamask/providers';
import { AppDynamicField, useAppStore } from '@stores';
import { useWalletConnect } from '@walletconnect/react-native-dapp';
import WalletConnectProvider from '@walletconnect/web3-provider';

import { Button } from '@components/Button';
import { Description } from '@components/Description';
import { RatioImage } from '@components/RatioImage';
import { SubTitle } from '@components/SubTitle';
import { Title } from '@components/Title';
import { CHARACTER_WIDTH_FIXED, CONTRACT_ADDRESS, FULL_WIDTH_FIXED, THOSE_STAIRS_IMAGE } from '@constants';
import { Accounts, MetaMaskAccounts } from '@interfaces';
import { Arena } from '@screens/Arena';
import { SelectCharacter } from '@screens/SelectCharacter';
import { getIsMobile, getIsWeb, shortenAddress, TransformCharacterData, transformCharacterData } from '@utils';
import reJrpgDapp from '../../configs/re-jrpg-dapp.json';

/*
 * `SplashScreen.preventAutoHideAsync()` must be before the component to properly work
 * */
SplashScreen.preventAutoHideAsync();

const App = (): Nullable<ReactElement> => {
  const { isUseCachedResourcesLoaded } = useCachedResources();
  const { isLoading, gameContract, currentAccount, characterNFT, setAppValue, resetAppStore } = useAppStore();
  const connector = useWalletConnect();

  const disconnect = useCallback(() => {
    if (getIsMobile()) {
      connector.killSession();
    }

    resetAppStore();
  }, [connector]);

  const setCurrentAccount = useCallback((accounts: Accounts) => {
    console.warn({ accounts });

    if (accounts && accounts.length > 0) {
      const firstAccount = accounts[0];

      console.warn({ firstAccount });

      setAppValue(AppDynamicField.CurrentAccount, firstAccount);
    }
  }, []);

  function createGameContract(web3Provider: WalletConnectProvider | MetaMaskInpageProvider, accounts: Accounts): void {
    /*
     * I believe any `provider` may be used with `Web3Provider`
     * */
    // @ts-ignore
    const provider = new ethers.providers.Web3Provider(web3Provider);
    const signer = provider.getSigner();
    const gameContract = new ethers.Contract(CONTRACT_ADDRESS, reJrpgDapp.abi, signer);

    setAppValue(AppDynamicField.GameContract, gameContract);
    setCurrentAccount(accounts);
  }

  async function connectMobileProvider(): Promise<void> {
    setAppValue(AppDynamicField.IsLoading);

    try {
      const mobileProvider = new WalletConnectProvider({
        infuraId: process.env.INFRA_ID,
        connector,
      });

      await mobileProvider.enable();

      createGameContract(mobileProvider, connector.accounts);
    } catch (error) {
      console.error({ error });
    } finally {
      setAppValue(AppDynamicField.IsLoading);
    }
  }

  async function checkIfWalletIsConnected(): Promise<void> {
    setAppValue(AppDynamicField.IsLoading);

    try {
      if (getIsWeb()) {
        const { ethereum } = window;

        const accounts: MetaMaskAccounts = await ethereum.request({ method: 'eth_accounts' });

        createGameContract(ethereum, accounts);
      }
    } catch (error) {
      console.error({ error });
    } finally {
      setAppValue(AppDynamicField.IsLoading);
    }
  }

  const fetchNFTMetadata = useCallback(async (): Promise<void> => {
    setAppValue(AppDynamicField.IsLoading);

    try {
      if (!gameContract) {
        console.warn('NO GAME');

        return;
      }

      const characterNFT: TransformCharacterData = await gameContract.checkIfUserHasNFT();

      if (characterNFT.name) {
        setAppValue(AppDynamicField.CharacterNFT, transformCharacterData(characterNFT));
      }
    } catch (error) {
      console.error({ error });
    } finally {
      setAppValue(AppDynamicField.IsLoading);
    }
  }, [gameContract]);

  const onPressConnectWalletHandler = useCallback(async (): Promise<void> => {
    try {
      if (getIsWeb()) {
        const { ethereum } = window;

        if (!ethereum) {
          console.warn('NO METAMASK');

          return;
        }

        console.warn({ ethereum });

        const accounts: MetaMaskAccounts = await ethereum.request({ method: 'eth_requestAccounts' });

        createGameContract(ethereum, accounts);

        return;
      }

      connector.connect();
    } catch (error) {
      console.error({ error });

      setAppValue(AppDynamicField.IsLoading);
    }
  }, [connector]);

  const isConnected = useMemo(() => currentAccount && gameContract, [currentAccount, gameContract]);

  const descriptionText = useMemo(() => shortenAddress(isConnected ? currentAccount : ''), [isConnected]);

  const renderContent = useCallback((): ReactElement => {
    if (isConnected) {
      if (characterNFT) {
        return <Arena />;
      }

      return <SelectCharacter />;
    }

    return (
      <Box mt={4}>
        <RatioImage width={FULL_WIDTH_FIXED} uri={THOSE_STAIRS_IMAGE.uri} alt={THOSE_STAIRS_IMAGE.alt} />

        <Button text="CONNECT" onPress={onPressConnectWalletHandler} mt={2} />
      </Box>
    );
  }, [characterNFT, isConnected]);

  useEffect(() => {
    if (getIsMobile() && connector.connected) {
      connectMobileProvider();
    }
  }, [connector.connected]);

  useEffect(() => {
    if (isConnected) {
      fetchNFTMetadata();
    }
  }, [isConnected]);

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  if (!isUseCachedResourcesLoaded) {
    return null;
  }

  return (
    <VStack flex={1} bg="dark.50" alignItems="center" justifyContent="center">
      <Box my={4}>
        {/*
         * `mt={12}` is the spacing for `Slide` in `Arena` component
         * */}

        <Box alignItems="center">
          <Title text="🩸 RE JRPG DAPP 🩸" mt={getIsMobile() ? 16 : 12} />

          <SubTitle text="STARS..." mt={2} />

          <Description text={descriptionText} mt={1} />
        </Box>

        {isLoading && <Spinner color="red.700" size="lg" h={CHARACTER_WIDTH_FIXED} />}

        {renderContent()}

        {isConnected && <Button text="disconnect" onPress={disconnect} mt={2} />}
      </Box>
    </VStack>
  );
};

export default memo(App);
