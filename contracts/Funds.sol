// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.0 <=0.8.17;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract Funds is Ownable {
	using Counters for Counters.Counter;
	Counters.Counter public queryCounter;

	struct Query {
		uint256 id;
		uint256 deadline;
		address consultant;
	}

	mapping(address => uint256[]) public queriesListByConsultant;
	mapping(uint256 => Query) private queryHistory;

	event ArrangeData(uint256, uint256, address, bool);
	event StripData(uint256, uint256, address, bool);

	function rentData(uint256 _dealine) public payable {
		require(msg.value > 1 , "You don't have enough FIL");

		queryCounter.increment();
		uint256 queryId = queryCounter.current();
		
		uint256 deadline =_dealine;

		queriesListByConsultant[msg.sender].push(queryId);

		Query memory newQuery = Query(queryId, deadline, msg.sender);
		queryHistory[queryId] = newQuery;

		emit ArrangeData(queryId, deadline, msg.sender, true);
	}

	function getQueriesActive() public view returns (uint256[] memory) {
		return queriesListByConsultant[msg.sender];
	}

	function getTimeRent(
		uint256[] memory _ids
	) external view returns (uint256[] memory) {
		uint256 currentTime = block.timestamp;
		uint256[] memory arr = new uint256[](_ids.length);

		for (uint256 index = 0; index < _ids.length; index++) {
			Query memory currentQuery = queryHistory[_ids[index]];
			arr[index] = currentQuery.deadline - currentTime;
		}
		return arr;
	}

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
