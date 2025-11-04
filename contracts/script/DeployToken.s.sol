// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import "forge-std/Script.sol";
import "forge-std/console.sol";
import {SimpleToken} from "../src/SimpleToken.sol";
import {Treasury} from "../src/Treasury.sol";
import {DAORegistry} from "../src/DAORegistry.sol";

contract DeploySimpleToken is Script {
    function run() external {
        // Start broadcast with your deployer key
        vm.startBroadcast();

        // Deploy the token
        SimpleToken token = new SimpleToken();

        console.log("SimpleToken deployed at:", address(token));
        console.log("Delegated votes to:", msg.sender);

        // Optional: delegate votes to deployer
        token.delegate(msg.sender);

        Treasury treasury = new Treasury();
        console.log("Treasury deployed at:", address(treasury));

     
        vm.stopBroadcast();
    }
}
