import { Maybe } from '@metamask/providers/dist/utils';

export type MetaMaskAccounts = Maybe<Nullable<string>[]>;

export type Accounts = MetaMaskAccounts | string[];
