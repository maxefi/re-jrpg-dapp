async function main() {
  const gameContractFactory = await hre.ethers.getContractFactory('ReJrpgDapp');
  const gameContract = await gameContractFactory.deploy(
    ["Ada", "Leon", "Kendo"], // Names
    ["QmdFrnXMV45T7j7XQf4viHchGQGfnfoYZwjNs241E7aic8",
    "QmRfCENqLyi4S2oLPDaedes9jaVDcJA1AKEyzZrJFRGfkE",
    "Qma7tzEDBsmbz16J3GM5QnwuDnbDcwsce34yTyt4a9iuW9"], // Images
    [75, 300, 450], // HP
    [300, 225, 150], // DMG
    [7, 3, 2], // DODGE
    "TYRANT",
    "QmUhfXcHbWixqR8GGgvFQfzrnafirMGx8panxuVaoAhsPn",
    9999,
    49,
    1
  );

  await gameContract.deployed();
  console.log({ gameContractAddress: gameContract.address });

  // let txn;
  // txn = await gameContract.mintCharacterNFT(2);
  // await txn.wait();
  // console.log("Minted Kendo");

  console.log("Done deploying and minting!");
};

async function runMain() {
  try {
    await main();
    process.exit(0);
  } catch(error) {
    console.log(error);
    process.exit(1);
  }
};

runMain();