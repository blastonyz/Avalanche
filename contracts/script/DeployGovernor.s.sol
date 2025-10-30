// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import "forge-std/Script.sol";
import "forge-std/console.sol";
import {SimpleGovernor} from "../src/SimpleGovernor.sol";
import {TimelockController} from "@openzeppelin/contracts/governance/TimelockController.sol";
import {IVotes} from "@openzeppelin/contracts/governance/utils/IVotes.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract DeployGovernor is Script {
    address constant TOKEN_ADDRESS = 0xD8ED7139fEef8775c8A6c9974Da8BB8DF22868c1;
    address constant ADMIN = 0x0571235134DC15a00f02916987C2c16b5fC52E2A;
  

    function run() external {
        vm.startBroadcast();
               // Deploy TimelockController
        address[] memory proposers = new address[](1);
        proposers[0] = ADMIN;
        address[] memory executors = new address[](1);
        executors[0] = ADMIN;

        TimelockController timelock = new TimelockController(
            15 minutes,
            proposers,
            executors,
            ADMIN
        );

        // Deploy Governor
        SimpleGovernor governor = new SimpleGovernor();

        // Transfer token ownership to Timelock
        Ownable token = Ownable(TOKEN_ADDRESS);
        token.transferOwnership(address(timelock));

        // Grant roles to Governor
        bytes32 PROPOSER_ROLE = timelock.PROPOSER_ROLE();
        bytes32 EXECUTOR_ROLE = timelock.EXECUTOR_ROLE();
        timelock.grantRole(PROPOSER_ROLE, address(governor));
        timelock.grantRole(EXECUTOR_ROLE, address(governor));

        // Delegate votes to ADMIN
        IVotes(TOKEN_ADDRESS).delegate(ADMIN);

        // Logs
        console.log("Governor deployed at:", address(governor));
        console.log("Timelock deployed at:", address(timelock));

        vm.stopBroadcast();
    }
}

