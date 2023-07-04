import { ethers, run, network } from "hardhat"
import { any } from "hardhat/internal/core/params/argumentTypes"

async function main() {
    let SimpleStorageFactory: any
    let simpleStorage: any

    SimpleStorageFactory = await ethers.getContractFactory("SimpleStorage")
    console.log("Deploying contract...")
    simpleStorage = await SimpleStorageFactory.deploy()
    const deploymentReceipt = await simpleStorage
        .deploymentTransaction()
        .wait(6)
    console.log(`Deployed contract to: ${deploymentReceipt.contractAddress}`)
    if (network.config.chainId === 11155111 && process.env.ETHERSCAN_API_KEY) {
        console.log("Waiting for verification...")
        await simpleStorage.deploymentTransaction().wait(6)
        await sleep(60000) // Delay for 1 minute (60,000 milliseconds)
        await verify(deploymentReceipt.contractAddress, [])
    }

    const currentValue = await simpleStorage.retrieve()
    console.log(`Current Value is: ${currentValue}`)

    // Update the current value
    const transactionResponse = await simpleStorage.store(7)
    await transactionResponse.wait(1)
    const updatedValue = await simpleStorage.retrieve()
    console.log(`Updated Value is: ${updatedValue}`)
}

async function verify(contractAddress: string, args: any[]) {
    console.log("Verifying contract...")
    try {
        await run("verify:verify", {
            address: contractAddress,
            constructorArguments: args,
        })
    } catch (e: any) {
        if (e.message.toLowerCase().includes("already verified")) {
            console.log("Already Verified!")
        } else {
            console.log(e)
        }
    }
}

function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms))
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
