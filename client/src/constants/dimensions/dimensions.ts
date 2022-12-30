import { Dimensions } from './dimensions.interface';

export const FULL_WIDTH_FIXED: Dimensions = {
  base: 290,
  sm: 420,
  md: 550,
};

/*
 * minus `16` to each value of `FULL_WIDTH_FIXED`,
 * because boss image has `py={4}`
 * */
export const BOSS_WIDTH_FIXED: Dimensions = {
  base: 274,
  sm: 404,
  md: 534,
};

export const CHARACTER_HEIGHT_FIXED: Dimensions = {
  base: 260,
  sm: 390,
};

export const CHARACTER_WIDTH_FIXED: Dimensions = {
  ...CHARACTER_HEIGHT_FIXED,
  md: 520,
};

/*
 * plus `48` to each value of `CHARACTER_HEIGHT_FIXED`,
 * because `Character` component has a button next to an image,
 * and buttons height is `12`
 * */
export const SELECT_CHARACTER_HEIGHT_FIXED: Dimensions = {
  base: 308,
  sm: 438,
};
