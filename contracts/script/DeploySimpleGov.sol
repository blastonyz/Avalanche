// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import {GovernorFactory} from "../src/GovernorFactory.sol";
import {DAORegistry} from "../src/DAORegistry.sol";

contract DeploySimpleGov is Script {
    address constant admin = 0x0571235134DC15a00f02916987C2c16b5fC52E2A;
    address[] proposers = [admin];
    address[] executors = [address(0)];

    function run() external returns (GovernorFactory factory) {
        vm.startBroadcast();

        address governorImpl = 0x0571235134DC15a00f02916987C2c16b5fC52E2A;
        address treasuryImpl = 0x0571235134DC15a00f02916987C2c16b5fC52E2A;
        DAORegistry registry = new DAORegistry();

        factory = new GovernorFactory(
            governorImpl,
            treasuryImpl,
            address(registry),
            proposers,
            executors
        );

        vm.stopBroadcast();
    }
}
