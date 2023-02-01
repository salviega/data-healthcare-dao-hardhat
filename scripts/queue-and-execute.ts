import { ethers, network } from 'hardhat'
import {
	FUNC,
	PROPOSAL_DESCRIPTION,
	MIN_DELAY,
	developmentChains,
	VALUES
} from '../helper-hardhat-config'
import { moveBlocks } from '../utils/move-blocks'
import { moveTime } from '../utils/move-time'

export async function queueAndExecute() {
	const args = VALUES
	const functionToCall = FUNC
	const funds = await ethers.getContract('Funds')
	const encodedFunctionCall = funds.interface.encodeFunctionData(
		functionToCall,
		args
	)
	const descriptionHash = ethers.utils.keccak256(
		ethers.utils.toUtf8Bytes(PROPOSAL_DESCRIPTION)
	)
	const governor = await ethers.getContract('HealthcareDAO')
	console.log('Queueing...')
	const queueTx = await governor.queue(
		[funds.address],
		[0],
		[encodedFunctionCall],
		descriptionHash
	)
	await queueTx.wait(1)

	if (developmentChains.includes(network.name)) {
		await moveTime(MIN_DELAY + 1)
		await moveBlocks(1)
	}

	console.log('Executing...')
	const executeTx = await governor.execute(
		[funds.address],
		[0],
		[encodedFunctionCall],
		descriptionHash
	)
	await executeTx.wait(1)

	console.log(`Funds value: ${await funds.totalAsserts()}`)
}

queueAndExecute()
	.then(() => process.exit(0))
	.catch(error => {
		console.error(error)
		process.exit(1)
	})
