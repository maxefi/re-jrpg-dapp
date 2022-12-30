import { useCallback, useState } from 'react';

import { UseToggleResult } from './useToggle.interface';

/*
 * `useToggle` hook is used for cases when we want to provide toggle and other functions to change state,
 * usually for such cases we create several callback function, for example
 * ```
 *     // variable to store state value
 *     const [isLoading, setIsLoading] = useState(false);
 *     // function to toggle state variable
 *     const onToggleLoading = useCallback(
 *       () => setIsLoading((isLoading: boolean) => !isLoading),
 *       []
 *     );
 *     // function to set state to false only
 *     const onIsLoading = useCallback(() => setIsLoading(false), []);
 * ```
 *
 * To prevent creation of such functions, this hook provide set of utilities for that
 * */
export function useToggle(initialState = false): UseToggleResult {
  const [state, setState] = useState<boolean>(initialState);

  const toggle = useCallback(() => setState((currentState: boolean) => !currentState), []);
  const setTrueState = useCallback(() => setState(true), []);
  const setFalseState = useCallback(() => setState(false), []);

  /*
   * Example of usages:
   * 1. Only with toggle
   * ```
   *   const [isOpen, toggleIsOpen] = useToggle();
   * ```
   *
   * 2. Only with set true handler
   * ```
   *   const [isOpen, , openHandler] = useToggle();
   * ```
   *
   * 3. Only with set false handler
   * ```
   *   const [isOpen, , , closeHandler] = useToggle();
   * ```
   *
   * 4. With toggle and set false handler
   * ```
   *   const [isOpen, toggleIsOpen, , closeHandler] = useToggle();
   * ```
   * */
  return [state, toggle, setTrueState, setFalseState];
}
