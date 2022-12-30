import React, { Fragment, memo, ReactElement, useMemo } from 'react';
import { Box, Image, VStack } from 'native-base';

import { Badge } from '@components/Badge';
import { CHARACTER_HEIGHT_FIXED, CHARACTER_WIDTH_FIXED, CLOUDFLARE_IPFS_URL, FULL_WIDTH_FIXED } from '@constants';

import { CharacterProps } from './Character.interface';

const Character = ({ character, isInBattle, ...rest }: CharacterProps): ReactElement => {
  const { name, imageURI, maxHp, attackDamage, hp } = character;

  const width = useMemo((): Record<string, number> => {
    if (isInBattle) {
      return FULL_WIDTH_FIXED;
    }

    return CHARACTER_WIDTH_FIXED;
  }, [isInBattle]);

  return (
    <Box width={width} {...rest}>
      <Badge position="absolute" zIndex={1} m={4} text={name} />

      <Image source={{ uri: `${CLOUDFLARE_IPFS_URL}${imageURI}` }} h={CHARACTER_HEIGHT_FIXED} alt={name} />

      <VStack position="absolute" zIndex={1} bottom={0} right={0} m={4} space={3}>
        {isInBattle ? (
          <Badge text={`${hp} / ${maxHp} HP`} />
        ) : (
          <Fragment>
            <Badge text={`hp: ${maxHp}`} />

            <Badge text={`atk: ${attackDamage}`} />
          </Fragment>
        )}
      </VStack>
    </Box>
  );
};

export default memo(Character);
