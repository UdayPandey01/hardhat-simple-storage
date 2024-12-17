const { ethers } = require("hardhat");
const {expect, assert} = require("chai")

describe("SimpleStorage", function () {
  let SimpleStorageFactory, simpleStorage
  beforeEach(async function () {
    SimpleStorageFactory = await ethers.getContractFactory(
      "SimpleStorage"
    );
    simpleStorage  = await SimpleStorageFactory.deploy();
  });
  it("Should start with a favourite number 0", async function (){
    const currentValue = await simpleStorage.retreive()
    const expectedvalue = "0"
    assert.equal(currentValue.toString(), expectedvalue)
  })
  it("Should update when we call store", async function(){
    const expectedvalue = "7"
    const transactionResponse = await simpleStorage.store("7")
    await transactionResponse.wait(1)

    const currentValue = await simpleStorage.retreive()
    assert.equal(currentValue.toString(), expectedvalue)
  })
});
