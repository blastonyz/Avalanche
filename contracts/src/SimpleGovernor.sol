// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;
import {Governor} from "@openzeppelin/contracts/governance/Governor.sol";
import {GovernorSettings} from "@openzeppelin/contracts/governance/extensions/GovernorSettings.sol";
import {GovernorCountingSimple} from "@openzeppelin/contracts/governance/extensions/GovernorCountingSimple.sol";
import {GovernorVotes} from "@openzeppelin/contracts/governance/extensions/GovernorVotes.sol";
import {GovernorVotesQuorumFraction} from "@openzeppelin/contracts/governance/extensions/GovernorVotesQuorumFraction.sol";
import {GovernorTimelockControl} from "@openzeppelin/contracts/governance/extensions/GovernorTimelockControl.sol";
import {TimelockController} from "@openzeppelin/contracts/governance/TimelockController.sol";
import {IVotes} from "@openzeppelin/contracts/governance/utils/IVotes.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
contract SimpleGovernor is
    Governor,
    GovernorSettings,
    GovernorCountingSimple,
    GovernorVotes,
    GovernorVotesQuorumFraction,
    GovernorTimelockControl,
    Ownable
{
    bool private initialized;
    address public tokenAddress;
    address public timelockAddress;

    event ProposalCreated(uint256 proposalId, address proposer);

    constructor()
        Governor("SimpleGovernor")
        GovernorVotes(IVotes(address(0)))
        GovernorTimelockControl(TimelockController(payable(address(0))))
        GovernorSettings(1, 250, 0)
        GovernorVotesQuorumFraction(4)
        Ownable(msg.sender)
    {}

    function initialize(
        IVotes _token,
        TimelockController _timelock,
        uint256 _quorumPercent
    ) external {
        require(!initialized, "Already initialized");
        initialized = true;

        _transferOwnership(msg.sender);

        // Reinitialize base contracts
        _initializeGovernorVotes(_token);
        _initializeGovernorTimelockControl(_timelock);
        _updateQuorumNumerator(_quorumPercent);
    }

    function propose(
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas,
        string memory description
    ) public override returns (uint256) {
        uint256 proposalId = super.propose(
            targets,
            values,
            calldatas,
            description
        );
        emit ProposalCreated(proposalId, msg.sender);
        return proposalId;
    }

    function votingDelay()
        public
        pure
        override(Governor, GovernorSettings)
        returns (uint256)
    {
        return 10;
    }

    function votingPeriod()
        public
        pure
        override(Governor, GovernorSettings)
        returns (uint256)
    {
        return 250;
    }

    function proposalThreshold()
        public
        pure
        override(Governor, GovernorSettings)
        returns (uint256)
    {
        return 0;
    }
    // The functions below are overrides required by Solidity.
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

    function proposalNeedsQueuing(
        uint256 proposalId
    )
        public
        view
        virtual
        override(Governor, GovernorTimelockControl)
        returns (bool)
    {
        return super.proposalNeedsQueuing(proposalId);
    }

    function _queueOperations(
        uint256 proposalId,
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas,
        bytes32 descriptionHash
    ) internal override(Governor, GovernorTimelockControl) returns (uint48) {
        return
            super._queueOperations(
                proposalId,
                targets,
                values,
                calldatas,
                descriptionHash
            );
    }

    function _executeOperations(
        uint256 proposalId,
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas,
        bytes32 descriptionHash
    ) internal override(Governor, GovernorTimelockControl) {
        super._executeOperations(
            proposalId,
            targets,
            values,
            calldatas,
            descriptionHash
        );
    }

    function _initializeGovernorVotes(IVotes _token) internal {
        tokenAddress = address(_token); // optional tracking
    }

    function _initializeGovernorTimelockControl(
        TimelockController _timelock
    ) internal {
        timelockAddress = address(_timelock); // optional tracking
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
}
