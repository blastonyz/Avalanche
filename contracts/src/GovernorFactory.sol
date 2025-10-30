// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Clones} from "@openzeppelin/contracts/proxy/Clones.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {TimelockController} from "@openzeppelin/contracts/governance/TimelockController.sol";
import {SimpleGovernor} from "./SimpleGovernor.sol";
import {Treasury} from "./Treasury.sol";
import {DAORegistry} from "./DAORegistry.sol";
import {IVotes} from "@openzeppelin/contracts/governance/utils/IVotes.sol";

contract GovernorFactory is Ownable {
    address public immutable governorImpl;
    address public immutable treasuryImpl;
    TimelockController public immutable sharedTimelock;
    DAORegistry public immutable registry;

    event DAOCreated(
        address indexed governor,
        address indexed treasury,
        address indexed token,
        string name,
        string description
    );

    constructor(
        address _governorImpl,
        address _treasuryImpl,
        address _registry,
        address[] memory proposers,
        address[] memory executors,
        address admin
    ) Ownable(msg.sender) {
        governorImpl = _governorImpl;
        treasuryImpl = _treasuryImpl;
        registry = DAORegistry(_registry);

        sharedTimelock = new TimelockController(
            180, // 3 minutes delay
            proposers,
            executors,
            admin
        );
    }

    function deployDAO(
        string memory name,
        string memory description,
        address token,
        uint256 quorumPercent
    ) external returns (address governor, address treasury) {
        // Clone and initialize Governor
        governor = Clones.clone(governorImpl);
        SimpleGovernor(payable(governor)).initialize(
            IVotes(token),
            sharedTimelock,
            quorumPercent
        );

        // Clone and initialize Treasury
        treasury = Clones.clone(treasuryImpl);
        Treasury(payable(treasury)).initialize(governor);

        // Register DAO metadata
        registry.registerDAO(name, description, governor, treasury, token);

        emit DAOCreated(governor, treasury, token, name, description);
    }
}
