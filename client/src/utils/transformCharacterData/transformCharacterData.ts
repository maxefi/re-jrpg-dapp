import { Big } from 'big.js';

import { TransformCharacterData, TransformCharacterDataResult } from './transformCharacterData.interface';

export const transformCharacterData = (data: TransformCharacterData): TransformCharacterDataResult => {
  const { name, imageURI, hp, maxHp, attackDamage } = data;

  return {
    name,
    imageURI,
    hp: Big(hp).toNumber(),
    maxHp: Big(maxHp).toNumber(),
    attackDamage: Big(attackDamage).toNumber(),
  };
};
