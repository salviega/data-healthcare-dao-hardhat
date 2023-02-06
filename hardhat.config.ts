import "@typechain/hardhat"
import "@nomiclabs/hardhat-waffle"
import "@nomiclabs/hardhat-etherscan"
import "@nomiclabs/hardhat-ethers"
import "hardhat-gas-reporter"
import "dotenv/config"
import "solidity-coverage"
import "hardhat-deploy"
import { HardhatUserConfig } from "hardhat/config"
require("dotenv").config()

const {
	COINMARKETCAP_API_KEY,
	ETHERSCAN_API_KEY,
	HYPERSPACE_RPC_URL,
	MUMBAI_RPC_URL,
	PRIVATE_KEY
} = process.env

const config = {
	defaultNetwork: "hardhat",
	networks: {
		hardhat: {
			chainId: 31337,
			allowUnlimitedContractSize: true
		},
		localhost: {
			chainId: 31337,
			allowUnlimitedContractSize: true
		},
		hyperspace: {
			chainId: 3141,
			accounts: [PRIVATE_KEY || ""],
			url: HYPERSPACE_RPC_URL,
			allowUnlimitedContractSize: true,
		},
		mumbai: {
			chainId: 80001,
			accounts: [PRIVATE_KEY || ""],
			url: MUMBAI_RPC_URL
		}
	},
	etherscan: {
		apiKey: ETHERSCAN_API_KEY
	},
	gasReporter: {
		enabled: true,
		currency: "USD",
		outputFile: "gas-report.txt",
		noColors: true,
		coinmarketcap: COINMARKETCAP_API_KEY
	},
	namedAccounts: {
		deployer: {
			default: 0,
			1: 0
		}
	},
	solidity: {
		version: "0.8.17",
		settings: {
			optimizer: {
				enabled: true,
				runs: 200
			}
		}
	},
	mocha: {
		timeout: 200000
	}
}

export default config
