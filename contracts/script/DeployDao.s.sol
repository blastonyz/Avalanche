// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/GovernorFactory.sol";

contract DeployDaoScript is Script {
    function run() external {
        address factory = 0x623b879bB025589B89FC2A96559F569A28700422;
        GovernorFactory govFactory = GovernorFactory(factory);

        vm.startBroadcast();

        govFactory.deployDAO(
            "FirstDAO",
            "new dao",
            0x37f6a860625a68b414C2D4c63840212f4271d3C0,
            5
        );

        vm.stopBroadcast();
    }
}
