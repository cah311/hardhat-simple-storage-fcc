const { ethers } = require("hardhat")
const { expect, assert } = require("chai")

describe("SimpleStorage", function () {
    let simpleStorageFactory, simpleStorage

    beforeEach(async function () {
        simpleStorageFactory = await ethers.getContractFactory("SimpleStorage")
        simpleStorage = await simpleStorageFactory.deploy()
    })

    it("Should start with a favorite number of 0", async function () {
        const currentValue = await simpleStorage.retrieve()
        const expectedValue = "0"
        assert.equal(currentValue.toString(), expectedValue)
    })

    it("Should update when we call store", async function () {
        const expectedValue = "7"
        const transactionResponse = await simpleStorage.store(expectedValue)
        await transactionResponse.wait(1)

        const currentValue = await simpleStorage.retrieve()
        assert.equal(currentValue.toString(), expectedValue)
    })

    it("Should add a person", async function () {
        const name = "Carson"
        const number = 19
        const transactionResponse = await simpleStorage.addPerson(number, name)
        await transactionResponse.wait(1)

        const person = await simpleStorage.people(0)
        assert.equal(person.name, name)
        assert.equal(person.favoriteNumber, number)
    })
})
