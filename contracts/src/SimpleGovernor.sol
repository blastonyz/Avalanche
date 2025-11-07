// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

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
    address public tokenAddress;
    address public timelockAddress;

    event ProposalCreated(uint256 proposalId, address proposer);

    /**
     * @notice Constructor que inicializa correctamente todos los módulos.
     * @param name_ nombre del Governor (ej: "MyDAO Governor")
     * @param token_ contrato que implementa IVotes (ERC20Votes u otro)
     * @param timelock_ TimelockController que actuará como executor
     * @param votingDelay_ delay en bloques/tiempo para que empiece la votación
     * @param votingPeriod_ duración de la votación
     * @param proposalThreshold_ umbral de propuesta (power)
     * @param quorumFraction_ porcentaje de quorum (ej 4 => 4%)
     * @param owner_ address que será propietario del Governor (transferOwnership)
     */
    constructor(
        string memory name_,
        IVotes token_,
        TimelockController timelock_,
        uint48 votingDelay_,
        uint32 votingPeriod_,
        uint256 proposalThreshold_,
        uint256 quorumFraction_,
        address owner_
    )
        Governor(name_)
        GovernorVotes(token_)
        GovernorTimelockControl(timelock_)
        GovernorSettings(votingDelay_, votingPeriod_, proposalThreshold_)
        GovernorVotesQuorumFraction(quorumFraction_)
        Ownable(owner_)
    {
        // asigno ownership al address que indique (normalmente el msg.sender del factory)
        _transferOwnership(owner_);

        // trackeo opcional
        tokenAddress = address(token_);
        timelockAddress = address(timelock_);
    }

    // --- API pública / hooks ---
    function propose(
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas,
        string memory description
    ) public override returns (uint256) {
        uint256 proposalId = super.propose(targets, values, calldatas, description);
        emit ProposalCreated(proposalId, msg.sender);
        return proposalId;
    }

    // Ejemplo: puedes sobrescribir estos para devolver valores constantes o variables
    function votingDelay()
        public
        view
        override(Governor, GovernorSettings)
        returns (uint256)
    {
        return super.votingDelay();
    }

    function votingPeriod()
        public
        view
        override(Governor, GovernorSettings)
        returns (uint256)
    {
        return super.votingPeriod();
    }

    function proposalThreshold()
        public
        view
        override(Governor, GovernorSettings)
        returns (uint256)
    {
        return super.proposalThreshold();
    }

    // Overrides requeridos por Solidity para combinar Governor + TimelockControl
    function state(uint256 proposalId)
        public
        view
        override(Governor, GovernorTimelockControl)
        returns (ProposalState)
    {
        return super.state(proposalId);
    }

    function proposalNeedsQueuing(uint256 proposalId)
        public
        view
        override(Governor, GovernorTimelockControl)
        returns (bool)
    {
        return super.proposalNeedsQueuing(proposalId);
    }

    function castVote(uint256 proposalId, uint8 support) public override returns (uint256) {
        address voter = _msgSender();
        return _castVote(proposalId, voter, support, "");
    }

    function castVoteWithReason(
        uint256 proposalId,
        uint8 support,
        string calldata reason
    ) public override returns (uint256) {
        address voter = _msgSender();
        return _castVote(proposalId, voter, support, reason);
    }

    function _queueOperations(
        uint256 proposalId,
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas,
        bytes32 descriptionHash
    ) internal override(Governor, GovernorTimelockControl) returns (uint48) {
        return super._queueOperations(proposalId, targets, values, calldatas, descriptionHash);
    }

    function _executeOperations(
        uint256 proposalId,
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas,
        bytes32 descriptionHash
    ) internal override(Governor, GovernorTimelockControl) {
        super._executeOperations(proposalId, targets, values, calldatas, descriptionHash);
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
