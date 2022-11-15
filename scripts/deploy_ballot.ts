import hre, { ethers } from "hardhat";
import fs from "fs";

const tokenAddress = "0x629A92d7940d511F0bEb1495418d0cF6B5Cf5f4e";

async function main() {
  const Ballot = await ethers.getContractFactory("Ballot");
  const ballot = await Ballot.deploy(tokenAddress);
  await ballot.deployed();

  console.log(`Ballot contract deployed successfully at ${ballot.address}`);

  // Get Ballot ABI
  let abiFile = JSON.parse(fs.readFileSync("./artifacts/contracts/Ballot.sol/Ballot.json", "utf8"));
  let abi = JSON.stringify(abiFile.abi);
  console.log(`ABI: ${abi}`);

  await ballot.deployTransaction.wait(7);

  /** VERIFICATION:
   *****************/

  await hre.run("verify:verify", {
    address: ballot.address,
    constructorArguments: [tokenAddress]
  });
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
