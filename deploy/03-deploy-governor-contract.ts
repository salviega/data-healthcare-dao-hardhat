import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { DeployFunction } from 'hardhat-deploy/types'
import verify from '../helper-functions'
import { networkConfig, developmentChains } from '../helper-hardhat-config'

const deployGovernorContract: DeployFunction = async function (
	hre: HardhatRuntimeEnvironment
) {
	// @ts-ignore
	const { getNamedAccounts, deployments, network } = hre
	const { deploy, log, get } = deployments
	const { deployer } = await getNamedAccounts()
	const governanceToken = await get('HealthcareToken')
	const timeLock = await get('TimeLock')
	const args = [governanceToken.address, timeLock.address]

	log('----------------------------------------------------')
	log('Deploying GovernorContract and waiting for confirmations...')
	const governorContract = await deploy('HealthcareDAO', {
		from: deployer,
		args,
		log: true
		// waitConfirmations: networkConfig[network.name].blockConfirmations || 1
	})

	log(`HealthcareDAO at ${governorContract.address}`)
	if (
		!developmentChains.includes(network.name) &&
		process.env.ETHERSCAN_API_KEY
	) {
		await verify(governorContract.address, args)
	}
}

export default deployGovernorContract
deployGovernorContract.tags = ['all', 'governor']
