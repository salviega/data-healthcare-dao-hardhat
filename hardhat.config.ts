import '@typechain/hardhat'
import '@nomiclabs/hardhat-waffle'
import '@nomiclabs/hardhat-etherscan'
import '@nomiclabs/hardhat-ethers'
import 'hardhat-gas-reporter'
import 'dotenv/config'
import 'solidity-coverage'
import 'hardhat-deploy'
import { HardhatUserConfig } from 'hardhat/config'
require('dotenv').config()

const { PRIVATE_KEY, HYPERSPACE_RPC_URL } = process.env

const config: HardhatUserConfig = {
	defaultNetwork: 'hardhat',
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
			accounts: [PRIVATE_KEY || ''],
			url: HYPERSPACE_RPC_URL
		}
	},
	namedAccounts: {
		deployer: {
			default: 0,
			1: 0
		}
	},
	solidity: {
		version: '0.8.17',
		settings: {
			optimizer: {
				enabled: true,
				runs: 200
			}
		}
	}
	// etherscan: {
	//   apiKey: ETHERSCAN_API_KEY,
	// },
}

export default config
