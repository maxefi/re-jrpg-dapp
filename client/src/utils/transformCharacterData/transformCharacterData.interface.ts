export interface TransformCharacterData {
  name: string;
  imageURI: string;
  hp: string | number;
  maxHp: string | number;
  attackDamage: string | number;
}

export interface TransformCharacterDataResult {
  name: string;
  imageURI: string;
  hp: number;
  maxHp: number;
  attackDamage: number;
}
