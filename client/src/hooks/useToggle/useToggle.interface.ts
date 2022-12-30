export type UseToggleResult = [
  boolean, // state
  () => void, // switcher for state: true->false и false->true
  () => void, // to set `true` state value only
  () => void, // to set `false` state value only
];
