import React, { memo, ReactElement, useCallback, useEffect, useMemo } from 'react';
import Big from 'big.js';
import { ContractTransaction } from 'ethers';
import { Alert, Box, HStack, Progress, ScrollView, Slide, Spinner, Text, useSafeArea } from 'native-base';
import { TOAST_DURATION, useNativeToast, useToggle } from '@hooks';
import { AppDynamicField, useAppStore } from '@stores';

import { Button } from '@components/Button';
import { Character } from '@components/Character';
import { RatioImage } from '@components/RatioImage';
import { SubTitle } from '@components/SubTitle';
import { BOSS_WIDTH_FIXED, CLOUDFLARE_IPFS_URL, COMPACTA_FONT, FULL_WIDTH_FIXED } from '@constants';
import { getIsMobile, TransformCharacterData, transformCharacterData } from '@utils';

const Arena = (): Nullable<ReactElement> => {
  const { gameContract, currentAccount, characterNFT, setAppValue, bossNFT } = useAppStore();
  const [isAttacking, toggleIsAttacking] = useToggle();
  const { showToast } = useNativeToast();
  const [isCharacterAttacked, toggleIsCharacterAttacked] = useToggle();
  const safeAreaProps = useSafeArea({
    safeAreaTop: true,
  });

  async function fetchBoss(): Promise<void> {
    setAppValue(AppDynamicField.IsLoading);

    try {
      if (!gameContract) {
        console.warn('NO GAME');

        return;
      }

      const bossTxn: TransformCharacterData = await gameContract.getBigBoss();

      setAppValue(AppDynamicField.BossNFT, transformCharacterData(bossTxn));
    } catch (error) {
      console.error({ error });
    } finally {
      setAppValue(AppDynamicField.IsLoading);
    }
  }

  const onAttackComplete = useCallback(
    (from: string, newBossHp: string, newPlayerHp: string): void => {
      if (!gameContract) {
        console.warn('NO GAME');

        return;
      }

      const sender = from.toLowerCase();

      console.warn(`Attack complete: Boss Hp: ${newBossHp}, Player Hp: ${newPlayerHp}`);

      console.warn({ currentAccount });
      console.warn({ sender });

      if (currentAccount === sender) {
        if (characterNFT) {
          setAppValue(AppDynamicField.CharacterNFT, transformCharacterData({ ...characterNFT, hp: newPlayerHp }));

          toggleIsCharacterAttacked();

          setTimeout(() => {
            toggleIsCharacterAttacked();
          }, TOAST_DURATION);
        }

        if (bossNFT) {
          setAppValue(AppDynamicField.BossNFT, transformCharacterData({ ...bossNFT, hp: newBossHp }));

          showToast(`💥 ${bossNFT?.name} was hit for ${characterNFT?.attackDamage}!`);
        }
      }
    },
    [gameContract, currentAccount, characterNFT, bossNFT],
  );

  const onAttackHandler = useCallback(async (): Promise<void> => {
    try {
      if (!gameContract) {
        console.warn('NO GAME');

        return;
      }

      toggleIsAttacking();
      console.warn('Attacking boss...');

      const attackTxn: ContractTransaction = await gameContract.attackBoss();

      console.warn({ attackTxn });

      await attackTxn.wait();

      console.warn({ attackTxn });
    } catch (error) {
      console.error({ error });
    } finally {
      toggleIsAttacking();
    }
  }, [gameContract, bossNFT, characterNFT]);

  const bossHp = useMemo(() => {
    if (bossNFT?.hp && bossNFT?.maxHp) {
      return Big(bossNFT.hp).times(100).div(bossNFT.maxHp).toNumber();
    }

    return 100;
  }, [bossNFT?.hp, bossNFT?.maxHp]);

  const attackText = useMemo(() => {
    if (bossNFT?.name && !isAttacking) {
      return `🟥 Attack ${bossNFT.name}`;
    }

    return null;
  }, [bossNFT?.name, isAttacking]);

  useEffect(() => {
    fetchBoss();
  }, [gameContract]);

  useEffect(() => {
    if (gameContract) {
      gameContract.on('AttackComplete', onAttackComplete);
    }

    return (): void => {
      if (gameContract) {
        gameContract.off('AttackComplete', onAttackComplete);
      }
    };
  }, [onAttackComplete]);

  if (bossNFT) {
    return (
      <ScrollView mt={4}>
        <Slide in={isCharacterAttacked} placement="top">
          <Alert justifyContent="center" status="error" borderRadius={0} {...safeAreaProps}>
            <Text color="error.600" fontWeight="medium">
              {`💥 ${characterNFT?.name} was hit for ${bossNFT?.attackDamage}!`}
            </Text>
          </Alert>
        </Slide>

        <Box width={FULL_WIDTH_FIXED}>
          <Box px={2} py={getIsMobile() ? 2 : 4} bgColor="red.700">
            {/*
             * looks more centered with `ml={-2}`
             * */}

            <SubTitle text={bossNFT.name} color="black" textAlign="center" ml={-2} mt={getIsMobile() ? 4 : 2} />

            <RatioImage
              mt={4}
              mx="auto"
              ratio={1 / 2}
              width={BOSS_WIDTH_FIXED}
              uri={`${CLOUDFLARE_IPFS_URL}${bossNFT.imageURI}`}
              alt={bossNFT.name}
            />

            <Progress colorScheme="light" mt={4} value={bossHp} />

            <SubTitle mt={4} textAlign="center" text={`${bossNFT.hp} / ${bossNFT.maxHp} HP`} />
          </Box>

          <Button onPress={onAttackHandler} mt={2} isDisabled={isAttacking} text={attackText}>
            {isAttacking && (
              <HStack mt={1}>
                <Text fontSize="xl" {...COMPACTA_FONT} color="white">
                  {`⚔️ Attacking ${bossNFT.name}`}
                </Text>

                <Spinner ml={1} mt={-1} color="white" size="sm" />
              </HStack>
            )}
          </Button>

          {characterNFT && <Character character={characterNFT} isInBattle mt={2} />}
        </Box>
      </ScrollView>
    );
  }

  return null;
};

export default memo(Arena);
