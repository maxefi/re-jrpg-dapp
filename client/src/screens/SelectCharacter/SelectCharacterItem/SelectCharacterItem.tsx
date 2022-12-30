import React, { memo, ReactElement, useCallback } from 'react';
import { Box } from 'native-base';

import { Button } from '@components/Button';
import { Character } from '@components/Character';
import { SELECT_CHARACTER_HEIGHT_FIXED } from '@constants';

import { SelectCharacterItemProps } from './SelectCharacterItem.interface';

const SelectCharacterItem = ({ character, index, onMintCharacterNFT }: SelectCharacterItemProps): ReactElement => {
  const { name } = character;

  const onMintCharacterNFTHandler = useCallback(() => {
    onMintCharacterNFT(index);
  }, [index]);

  return (
    <Box key={name} h={SELECT_CHARACTER_HEIGHT_FIXED}>
      <Character character={character} />

      <Button text="INSERT A COIN" onPress={onMintCharacterNFTHandler} />
    </Box>
  );
};

export default memo(SelectCharacterItem);
