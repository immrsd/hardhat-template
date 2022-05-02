import { ethers } from 'hardhat';
import { Contract, ContractFactory } from 'ethers';

async function main(): Promise<void> {
  const NAME = "TestToken";
  const factory: ContractFactory = await ethers.getContractFactory(
    NAME,
  );
  const instance: Contract = await factory.deploy();
  await instance.deployed();
  console.log(`${NAME} deployed to: ${instance.address}`);
}

main()
  .then(() => process.exit(0))
  .catch((error: Error) => {
    console.error(error);
    process.exit(1);
  });
