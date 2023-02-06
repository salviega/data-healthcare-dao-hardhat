import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"
import { ADDRESS_ZERO, MIN_DELAY } from "../helper-hardhat-config"
import { ethers } from "hardhat"

require("dotenv").config()

let {
	PRIVATE_KEY 
} = process.env

 let PRIVATE_KEY_WALLET = PRIVATE_KEY || ''

const wallet = new ethers.Wallet(PRIVATE_KEY_WALLET, ethers.provider)

const deployHealthcareDAO: DeployFunction = async function (
	hre: HardhatRuntimeEnvironment
) {

    const { deployments } = hre
	const { log } = deployments

	log("----------------------------------------------------")
	log("Deploying HealthCareToken and waiting for confirmations...")

	const HealthcareToken = await ethers.getContractFactory('HealthcareToken', wallet);
	const healthcareToken = await HealthcareToken.deploy();
    await healthcareToken.deployed()

	log(`HealthCareToken at ${healthcareToken.address}`)

    log("----------------------------------------------------")
	log("Deploying TimeLock and waiting for confirmations...")

	const TimeLock = await ethers.getContractFactory('TimeLock', wallet);
	const timeLock = await TimeLock.deploy(MIN_DELAY, [], [], wallet.address);
    await timeLock.deployed()

	log(`TimeLock at ${timeLock.address}`)

	log("----------------------------------------------------")
	log("Deploying GovernorContract and waiting for confirmations...")

	const GovernorContract = await ethers.getContractFactory('HealthcareDAO', wallet);
	const governorContract = await GovernorContract.deploy(healthcareToken.address, timeLock.address);
    await governorContract.deployed()
	
	log(`HealthcareDAO at ${governorContract.address}`)

	log("----------------------------------------------------")
	log("Setting up contracts for roles...")
	const proposerRole = await timeLock.PROPOSER_ROLE()
	const executorRole = await timeLock.EXECUTOR_ROLE()
	const adminRole = await timeLock.TIMELOCK_ADMIN_ROLE()

	log("set propose role")
	const proposerTx = await timeLock.grantRole(proposerRole, governorContract.address)
	await proposerTx.wait(1)
	log("set executor role")
	const executorTx = await timeLock.grantRole(executorRole, ADDRESS_ZERO)
	await executorTx.wait(1)
	log("set admin role")
	const revokeTx = await timeLock.revokeRole(adminRole, wallet.address)
	await revokeTx.wait(1)


	log("----------------------------------------------------")
	log("Deploying Funds contract and waiting for confirmations...")

	const Funds = await ethers.getContractFactory('Funds', wallet);
	const funds = await Funds.deploy();
    await funds.deployed()


	log(`funds at ${funds.address}`)

    log("transfer owership")
	const transferTx = await funds.transferOwnership(timeLock.address)
	await transferTx.wait(1)

	log("end")

}

export default deployHealthcareDAO
deployHealthcareDAO.tags = ["DAO"]