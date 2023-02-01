import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"
import verify from "../helper-functions"
import { networkConfig, developmentChains } from "../helper-hardhat-config"
import { ethers } from "hardhat"

const deployBox: DeployFunction = async function (
	hre: HardhatRuntimeEnvironment
) {
	// @ts-ignore
	const { getNamedAccounts, deployments, network } = hre
	const { deploy, log } = deployments
	const { deployer } = await getNamedAccounts()

	log("----------------------------------------------------")
	log("Deploying Funds contract and waiting for confirmations...")
	const funds = await deploy("Funds", {
		from: deployer,
		args: [],
		log: true
		// waitConfirmations: networkConfig[network.name].blockConfirmations || 1
	})

	log(`funds at ${funds.address}`)
	if (
		!developmentChains.includes(network.name) &&
		process.env.ETHERSCAN_API_KEY
	) {
		await verify(funds.address, [])
	}

	const fundsContract = await ethers.getContractAt("Funds", funds.address)
	const timeLock = await ethers.getContract("TimeLock")
	const transferTx = await fundsContract.transferOwnership(timeLock.address)
	await transferTx.wait(1)

	// const rentDataTx = await fundsContract.rentData(300, {
	// 	value: ethers.utils.parseEther('1.5')
	// })
	// await rentDataTx.wait(1)
}

export default deployBox
deployBox.tags = ["all", "box"]
