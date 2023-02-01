// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.0 <=0.8.17;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";

contract HealthcareToken is ERC20Votes {
	constructor()
		ERC20("Healthcare DAO token", "DHD")
		ERC20Permit("Healthcare DAO token")
	{}

	function _afterTokenTransfer(
		address from,
		address to,
		uint256 amount
	) internal override(ERC20Votes) {
		super._afterTokenTransfer(from, to, amount);
	}

	function _mint(address to, uint256 amount) internal override(ERC20Votes) {
		super._mint(to, amount);
	}

	function _burn(
		address account,
		uint256 amount
	) internal override(ERC20Votes) {
		super._burn(account, amount);
	}

	function safeMint(address to, uint256 amount) public {
		_mint(to, amount);
	}
}
