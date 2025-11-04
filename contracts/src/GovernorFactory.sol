// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

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
            60, 
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
        
        SimpleGovernor gov = new SimpleGovernor(
            name,
            IVotes(token),
            sharedTimelock,
            1,       
            10 minutes,
            1,     
            quorumPercent,
            msg.sender
        );

        // 🚀 Crear Treasury
        Treasury tre = new Treasury();
        tre.initialize(address(gov));

        // Registrar en DAORegistry
        registry.registerDAO(
            name,
            description,
            address(gov),
            address(tre),
            token
        );

        emit DAOCreated(address(gov), address(tre), token, name, description);
        return (address(gov), address(tre));
    }
}