// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script} from "forge-std/Script.sol";
import {SimpleGovernor} from "../src/SimpleGovernor.sol";
import {Treasury} from "../src/Treasury.sol";
import {DAORegistry} from "../src/DAORegistry.sol";
import {GovernorFactory} from "../src/GovernorFactory.sol";
import {TimelockController} from "@openzeppelin/contracts/governance/TimelockController.sol";
import {IVotes} from "@openzeppelin/contracts/governance/utils/IVotes.sol";
import "forge-std/console.sol";

contract DeployGovernorFactory is Script {
    address public votes = 0x37f6a860625a68b414C2D4c63840212f4271d3C0;

    function run() external {
        vm.startBroadcast();

        address[] memory proposers = new address[](1);
        address[] memory executors = new address[](1);

        proposers[0] = msg.sender;
        executors[0] = msg.sender;

        TimelockController timelock = new TimelockController(
            60, // 1 minuto de delay para pruebas
            proposers,
            executors,
            msg.sender
        );

        // 2️⃣ Desplegar implementación base de Governor (usa el timelock real)
        SimpleGovernor governorImpl = new SimpleGovernor(
            "BaseGovernor",
            IVotes(votes), // placeholder
            timelock, // timelock recién desplegado
            1, // voting delay (bloques o segundos según config)
            10 minutes, // voting period (corto para test)
            1, // proposal threshold (mínimo de votos para proponer)
            4, // quorum percent
            msg.sender
        );

        // 3️⃣ Desplegar implementación base del Treasury
        Treasury treasuryImpl = new Treasury();

        // 4️⃣ Desplegar el registro
        DAORegistry registry = new DAORegistry();

        // 5️⃣ Desplegar la factory con referencias reales
        GovernorFactory factory = new GovernorFactory(
            address(governorImpl),
            address(treasuryImpl),
            address(registry),
            proposers,
            executors,
            msg.sender
        );

        vm.stopBroadcast();

        // 6️⃣ Logs para verificar en consola
        console.log("Timelock:", address(timelock));
        console.log("Governor Impl:", address(governorImpl));
        console.log("Treasury Impl:", address(treasuryImpl));
        console.log("Registry:", address(registry));
        console.log("GovernorFactory:", address(factory));
    }
}
