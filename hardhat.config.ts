/*
 * see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
 * */
import * as dotenv from 'dotenv';
dotenv.config();

import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

/*
 * You need to export an object to set up your config
 * Go to https://hardhat.org/config/ to learn more
 * */
const config: HardhatUserConfig = {
  solidity: "0.8.17",
  networks: {
    goerli: {
      url: process.env.STAGING_QUICKNODE_KEY,
      accounts: [process.env.PRIVATE_KEY ?? ''],
    },
  },
};

export default config;
