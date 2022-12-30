import { TransformCharacterDataResult } from '@utils';

export interface SelectCharacterItemProps {
  character: TransformCharacterDataResult;
  index: number;
  onMintCharacterNFT: (characterId: number) => void;
}
