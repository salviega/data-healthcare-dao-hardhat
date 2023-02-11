// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.0 <=0.8.18;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Funds is Ownable {
	function transferFunds(address _to, uint256 _amount) public onlyOwner {
		require(
			_amount <= address(this).balance,
			"There aren't enough funds to withdraw"
		);
		(bool response /*bytes memory data*/, ) = _to.call{value: _amount}("");
		require(response, "Tranfer revert");
	}

	function totalAsserts() public view returns (uint256) {
		return address(this).balance;
	}

	receive() external payable {}
}
