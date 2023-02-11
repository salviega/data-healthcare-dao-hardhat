// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.0 <=0.8.18;

import "@openzeppelin/contracts/metatx/ERC2771Context.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";
import "@openzeppelin/contracts/metatx/ERC2771Context.sol";

contract HealthcareToken is ERC2771Context, ERC20Votes {
	event tokenMinted(string);
	event tokenDelegated(string);

	constructor(
		address trustedForwarder
	)
		ERC2771Context(trustedForwarder)
		ERC20("Healthcare DAO token", "DHD")
		ERC20Permit("Healthcare DAO token")
	{}

	function _msgData()
		internal
		view
		override(Context, ERC2771Context)
		returns (bytes calldata)
	{
		return ERC2771Context._msgData();
	}

	function _msgSender()
		internal
		view
		override(Context, ERC2771Context)
		returns (address sender)
	{
		sender = ERC2771Context._msgSender();
	}

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

	function relayMint(address _to, uint256 _amount) public {
		_mint(_to, _amount);
		emit tokenMinted("Minted!");
	}

	function relayDelegate(address _to) public {
		delegate(_to);
		emit tokenDelegated("Delegated");
	}
}
