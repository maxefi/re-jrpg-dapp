import React, { Fragment, memo, ReactElement, useCallback, useEffect, useState } from 'react';
import { ContractTransaction } from 'ethers';
import { Spinner } from 'native-base';
import { HStack, ScrollView } from 'native-base';
import { useToggle } from '@hooks';
import { AppDynamicField, useAppStore } from '@stores';

import { Description } from '@components/Description';
import { RatioImage } from '@components/RatioImage';
import { CONTRACT_ADDRESS, FULL_WIDTH_FIXED, HE_IS_COMING_IMAGE } from '@constants';
import { TransformCharacterData, transformCharacterData, TransformCharacterDataResult } from '@utils';

import { SelectCharacterItem } from './SelectCharacterItem';

const SelectCharacter = (): ReactElement => {
  const { isLoading, gameContract, setAppValue } = useAppStore();
  const [characters, setCharacters] = useState<TransformCharacterDataResult[]>([]);
  const [isMintingCharacter, toggleIsMintingCharacter] = useToggle();

  const onMintCharacterNFTHandler = useCallback(
    async (characterId: number): Promise<void> => {
      try {
        if (!gameContract) {
          console.warn('NO GAME');

          return;
        }

        toggleIsMintingCharacter();

        const mintTxn: ContractTransaction = await gameContract.mintCharacterNFT(characterId);

        console.warn({ mintTxn });

        await mintTxn.wait();

        console.warn({ mintTxn });
      } catch (error) {
        console.error({ error });
      } finally {
        toggleIsMintingCharacter();
      }
    },
    [gameContract],
  );

  async function getCharacters(): Promise<void> {
    setAppValue(AppDynamicField.IsLoading);

    try {
      if (!gameContract) {
        console.warn('NO GAME');

        return;
      }

      const charactersTxn: TransformCharacterData[] = await gameContract.getAllDefaultCharacters();
      const characters: TransformCharacterDataResult[] = charactersTxn.map((characterData: TransformCharacterData) =>
        transformCharacterData(characterData),
      );

      setCharacters(characters);
    } catch (error) {
      console.error({ error });
    } finally {
      setAppValue(AppDynamicField.IsLoading);
    }
  }

  async function onCharacterMint(sender: string, tokenId: string, characterIndex: string): Promise<void> {
    try {
      if (!gameContract) {
        console.warn('NO GAME');

        return;
      }

      const characterNFT: TransformCharacterData = await gameContract.checkIfUserHasNFT();

      console.warn(`CharacterNFTMinted - sender: ${sender} tokenId: ${tokenId} characterIndex: ${characterIndex}`);
      console.warn(
        `Your NFT is all done -- see it here: https://testnets.opensea.io/assets/${CONTRACT_ADDRESS}/${tokenId}`,
      );

      setAppValue(AppDynamicField.CharacterNFT, transformCharacterData(characterNFT));
    } catch (error) {
      console.error({ error });
    }
  }

  useEffect(() => {
    getCharacters();

    if (gameContract) {
      gameContract.on('CharacterNFTMinted', onCharacterMint);
    }

    return (): void => {
      if (gameContract) {
        gameContract.off('CharacterNFTMinted', onCharacterMint);
      }
    };
  }, [gameContract]);

  return (
    <Fragment>
      {isMintingCharacter && (
        <Fragment>
          <HStack justifyContent="center" alignItems="center" mt={3}>
            <Description text="Minting..." />

            <Spinner color="red.700" ml={2} />
          </HStack>

          <RatioImage width={FULL_WIDTH_FIXED} mt={2} uri={HE_IS_COMING_IMAGE.uri} alt={HE_IS_COMING_IMAGE.alt} />
        </Fragment>
      )}

      {!isLoading && !isMintingCharacter && characters.length > 0 && (
        <Fragment>
          <Description text="🔻 Mint Your Destiny." alignSelf="flex-start" mt={3} />

          <Description text="Choose wisely 🔺" alignSelf="flex-end" />

          <ScrollView
            horizontal
            w={FULL_WIDTH_FIXED}
            flexGrow={0}
            flexShrink={1}
            showsHorizontalScrollIndicator={false}
          >
            <HStack space={3} mt={4}>
              {characters.map((character: TransformCharacterDataResult, index: number) => (
                <SelectCharacterItem
                  key={character.name}
                  character={character}
                  index={index}
                  onMintCharacterNFT={onMintCharacterNFTHandler}
                />
              ))}
            </HStack>
          </ScrollView>
        </Fragment>
      )}
    </Fragment>
  );
};

export default memo(SelectCharacter);
