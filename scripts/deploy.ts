import hre, { ethers } from "hardhat";
import fs from "fs";

async function main() {
  
  const Token = await ethers.getContractFactory("KoloToken");
  const token = await Token.deploy();

  await token.deployed();
  console.log(`Kolo token contract deploy at ${token.address}`);
  // Get Token ABI
  let abiFile = JSON.parse(fs.readFileSync("./artifacts/contracts/Token.sol/KoloToken.json", "utf8"));
  let abi = JSON.stringify(abiFile.abi);
  await token.deployTransaction.wait(7);

  /** VERIFICATION: 
   *****************/
  await hre.run("verify:verify", {
    address: token.address
  });

  const Ballot = await ethers.getContractFactory("Ballot");
  const ballot = await Ballot.deploy('0xB77Cdf9B2E1547c3b9b47744b490Fa4C1Dee7b63');

  await ballot.deployed();
  console.log(`Ballot contract deployed successfully at ${ballot.address}`);

  abiFile = JSON.parse(fs.readFileSync("./artifacts/contracts/Ballot.sol/Ballot.json", "utf8"))
  abi = JSON.stringify(abiFile.abi);
  await ballot.deployTransaction.wait(7);

  /** VERIFICATION: 
   *****************/
  await hre.run("verify:verify", {
    address: ballot.address,
    constructorArguments: [token.address],
  });
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
