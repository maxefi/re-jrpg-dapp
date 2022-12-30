import { IBoxProps } from 'native-base';

import { TransformCharacterDataResult } from '@utils';

export interface CharacterProps extends IBoxProps {
  character: TransformCharacterDataResult;
  isInBattle?: boolean;
}
