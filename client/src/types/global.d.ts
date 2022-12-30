/*
 * if `*.d.ts` file contains `import`, other types in the same file won't work globally, e. g.
 * keeping a `Nullable` type in this file does not work
 *
 * https://stackoverflow.com/questions/42233987/how-to-configure-custom-global-interfaces-d-ts-files-for-typescript
 * */
import { MetaMaskInpageProvider } from '@metamask/providers';

declare global {
  interface Window {
    ethereum: MetaMaskInpageProvider;
  }
}
