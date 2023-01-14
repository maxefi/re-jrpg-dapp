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
  
  await gameContract.checkIfUserHasNFT();

  // let txn;
  // let returnedTokenUri;
  
  // txn = await gameContract.mintCharacterNFT(0);
  // await txn.wait();
  // console.log("Minted NFT #1");
  // returnedTokenUri = await gameContract.tokenURI(1);
  // console.log("Token URI:", returnedTokenUri);
  
  // txn = await gameContract.attackBoss();
  // await txn.wait();
  
  // txn = await gameContract.attackBoss();
  // await txn.wait();
  
  // txn = await gameContract.attackBoss();
  // await txn.wait();
  
  // txn = await gameContract.mintCharacterNFT(1);
  // await txn.wait();
  // console.log("Minted NFT #2");
  // returnedTokenUri = await gameContract.tokenURI(2);
  // console.log("Token URI:", returnedTokenUri);
  
  // txn = await gameContract.mintCharacterNFT(2);
  // await txn.wait();
  // console.log("Minted NFT #3");
  // returnedTokenUri = await gameContract.tokenURI(3);
  // console.log("Token URI:", returnedTokenUri);
  
  // txn = await gameContract.mintCharacterNFT(1);
  // await txn.wait();
  // console.log("Minted NFT #4");
  // returnedTokenUri = await gameContract.tokenURI(4);
  // console.log("Token URI:", returnedTokenUri);
  
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