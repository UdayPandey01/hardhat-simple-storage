const { ethers, run, network } = require("hardhat");

async function main() {
  const SimpleStorageFactory = await ethers.getContractFactory("SimpleStorage");
  console.log("Deploying conntract...");
  const simpleStorage = await SimpleStorageFactory.deploy();
  await simpleStorage.waitForDeployment();
  const address = await simpleStorage.getAddress();
  console.log(`Deployment address ${address}`);

  if (network.config.chainId === 11155111 && process.env.ETHERSCAN_API_KEY) {
    console.log("Waiting for txs")
    await simpleStorage.deploymentTransaction().wait(6);
    await verify(address, []);
  }

  const currentValue = await simpleStorage.retreive()
  console.log(`Current value is: ${currentValue}`)

  const transactionResponse = await simpleStorage.store(56)
  await transactionResponse.wait(1)

  const updatedValue = await simpleStorage.retreive()
  console.log(`Updated value is: ${updatedValue}`)

}

async function verify(contractAddress, args) {
  console.log("Verifying conntract...");
  try {
    await run("verify:verify", {
      address: contractAddress,
      constructorArguments: args,
    });
  } catch (e) {
    if (e.message.toLowerCase().includes("already verified")) {
      console.log("Already verified");
    } else {
      console.log(e);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
