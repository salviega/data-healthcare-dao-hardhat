import { ethers, network } from "hardhat"
import {
	developmentChains,
	VOTING_DELAY,
	proposalsFile,
	FUNC,
	PROPOSAL_DESCRIPTION,
	VALUES
} from "../helper-hardhat-config"
import * as fs from "fs"
import { moveBlocks } from "../utils/move-blocks"

export async function propose(
	args: any[],
	functionToCall: string,
	proposalDescription: string
) {
	const governor = await ethers.getContract("HealthcareDAO")
	const funds = await ethers.getContract("Funds")
	const encodedFunctionCall = funds.interface.encodeFunctionData(
		functionToCall,
		args
	)
	console.log(`Proposing ${functionToCall} on ${funds.address} with ${args}`)
	console.log(`Proposal Description:\n  ${proposalDescription}`)
	const proposeTx = await governor.propose(
		[funds.address],
		[0],
		[encodedFunctionCall],
		proposalDescription
	)
	if (developmentChains.includes(network.name)) {
		await moveBlocks(VOTING_DELAY + 1)
	}
	const proposeReceipt = await proposeTx.wait(1)
	const proposalId = proposeReceipt.events[0].args.proposalId
	console.log(`Proposed with proposal ID:\n  ${proposalId}`)

	const proposalState = await governor.state(proposalId)
	const proposalSnapShot = await governor.proposalSnapshot(proposalId)
	const proposalDeadline = await governor.proposalDeadline(proposalId)
	storeProposalId(proposalId)

	console.log(`Current Proposal State: ${proposalState}`)
	console.log(`Current Proposal Snapshot: ${proposalSnapShot}`)
	console.log(`Current Proposal Deadline: ${proposalDeadline}`)
}

function storeProposalId(proposalId: any) {
	const chainId = network.config.chainId!.toString()
	let proposals: any

	if (fs.existsSync(proposalsFile)) {
		proposals = JSON.parse(fs.readFileSync(proposalsFile, "utf8"))
	} else {
		proposals = {}
		proposals[chainId] = []
	}
	proposals[chainId].push(proposalId.toString())
	fs.writeFileSync(proposalsFile, JSON.stringify(proposals), "utf8")
}

propose(VALUES, FUNC, PROPOSAL_DESCRIPTION)
	.then(() => process.exit(0))
	.catch(error => {
		console.error(error)
		process.exit(1)
	})
