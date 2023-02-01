import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"
import verify from "../helper-functions"
import { networkConfig, developmentChains } from "../helper-hardhat-config"
import { ethers } from "hardhat"

const deployHealthcareToken: DeployFunction = async function (
	hre: HardhatRuntimeEnvironment
) {
	// @ts-ignore
	const { getNamedAccounts, deployments, network } = hre
	const { deploy, log } = deployments
	const { deployer } = await getNamedAccounts()

	log("----------------------------------------------------")
	log("Deploying HealthCareToken and waiting for confirmations...")
	const healthcareToken = await deploy("HealthcareToken", {
		from: deployer,
		args: [],
		log: true
		// waitConfirmations: networkConfig[network.name].blockConfirmations || 1
	})

	log(`HealthCareToken at ${healthcareToken.address}`)
	if (
		!developmentChains.includes(network.name) &&
		process.env.ETHERSCAN_API_KEY
	) {
		await verify(healthcareToken.address, [])
	}

	// log(`Minting to ${deployer}`)
	// await mint(healthcareToken.address, deployer)

	// log('Minted!')
}

const mint = async (governanceTokenAddress: string, voteerAccount: string) => {
	const governanceToken = await ethers.getContractAt(
		"HealthcareToken",
		governanceTokenAddress
	)
	const mintToken = await governanceToken.safeMint(
		voteerAccount,
		ethers.utils.parseEther("1")
	)
	await mintToken.wait(1)

	const transactionResponse = await governanceToken.delegate(voteerAccount)
	await transactionResponse.wait(1)

	console.log(
		`Checkpoints: ${await governanceToken.numCheckpoints(voteerAccount)}`
	)
}

export default deployHealthcareToken
deployHealthcareToken.tags = ["all", "governor"]
