import { ethers } from "hardhat"

export interface networkConfigItem {
	ethUsdPriceFeed?: string
	blockConfirmations?: number
}

export interface networkConfigInfo {
	[key: string]: networkConfigItem
}

export const networkConfig: networkConfigInfo = {
	localhost: {},
	hardhat: {},
	goerli: {
		blockConfirmations: 3
	},
	hyperspace: {
		blockConfirmations: 3
	},
	mumbai: {
		blockConfirmations: 3
	}
}

export const developmentChains = ["hardhat", "localhost"]
export const proposalsFile = "proposals.json"

// Governor Values
export const QUORUM_PERCENTAGE = 4 // Need 4% of voters to pass
export const MIN_DELAY = 300 // 5 minutres - after a vote passes, you have 5 minutes before you can enact
export const VOTING_PERIOD = 25 // blocks
export const VOTING_DELAY = 1 // 1 Block - How many blocks till a proposal vote becomes active
export const ADDRESS_ZERO = "0x0000000000000000000000000000000000000000"
export const GELATO_FORWARDER = "0x70A792ad975Aa0977c6E9d55a14f5F2228bBC685"

export const VALUES = [
	"0x8626f6940e2eb28930efb4cef49b2d1f2c9c1199",
	ethers.utils.parseEther("1")
]
export const FUNC = "transferFunds"
export const PROPOSAL_DESCRIPTION =
	"I will spend 1 ETH to improve infrastructure of the DAO"
