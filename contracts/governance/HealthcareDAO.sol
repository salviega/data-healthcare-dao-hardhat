// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.0 <=0.8.18;

import "@openzeppelin/contracts/governance/Governor.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorSettings.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorCountingSimple.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorVotes.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorVotesQuorumFraction.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorTimelockControl.sol";
import "@openzeppelin/contracts/metatx/ERC2771Context.sol";

contract HealthcareDAO is
	ERC2771Context,
	Governor,
	GovernorSettings,
	GovernorCountingSimple,
	GovernorVotes,
	GovernorVotesQuorumFraction,
	GovernorTimelockControl
{
	constructor(
		address trustedForwarder,
		IVotes _token,
		TimelockController _timelock
	)
		ERC2771Context(trustedForwarder)
		Governor("Healthcare DAO")
		GovernorSettings(1 /* 1 block */, 25 /* 5 minutes */, 0)
		GovernorVotes(_token)
		GovernorVotesQuorumFraction(4)
		GovernorTimelockControl(_timelock)
	{}

	// The following functions are overrides required by Solidity.

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

	function votingDelay()
		public
		view
		override(IGovernor, GovernorSettings)
		returns (uint256)
	{
		return super.votingDelay();
	}

	function votingPeriod()
		public
		view
		override(IGovernor, GovernorSettings)
		returns (uint256)
	{
		return super.votingPeriod();
	}

	function quorum(
		uint256 blockNumber
	)
		public
		view
		override(IGovernor, GovernorVotesQuorumFraction)
		returns (uint256)
	{
		return super.quorum(blockNumber);
	}

	function state(
		uint256 proposalId
	)
		public
		view
		override(Governor, GovernorTimelockControl)
		returns (ProposalState)
	{
		return super.state(proposalId);
	}

	function propose(
		address[] memory targets,
		uint256[] memory values,
		bytes[] memory calldatas,
		string memory description
	) public override(Governor, IGovernor) returns (uint256) {
		return super.propose(targets, values, calldatas, description);
	}

	function proposalThreshold()
		public
		view
		override(Governor, GovernorSettings)
		returns (uint256)
	{
		return super.proposalThreshold();
	}

	function _execute(
		uint256 proposalId,
		address[] memory targets,
		uint256[] memory values,
		bytes[] memory calldatas,
		bytes32 descriptionHash
	) internal override(Governor, GovernorTimelockControl) {
		super._execute(proposalId, targets, values, calldatas, descriptionHash);
	}

	function _cancel(
		address[] memory targets,
		uint256[] memory values,
		bytes[] memory calldatas,
		bytes32 descriptionHash
	) internal override(Governor, GovernorTimelockControl) returns (uint256) {
		return super._cancel(targets, values, calldatas, descriptionHash);
	}

	function _executor()
		internal
		view
		override(Governor, GovernorTimelockControl)
		returns (address)
	{
		return super._executor();
	}

	function supportsInterface(
		bytes4 interfaceId
	) public view override(Governor, GovernorTimelockControl) returns (bool) {
		return super.supportsInterface(interfaceId);
	}
}
