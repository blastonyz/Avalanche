// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract Treasury is Ownable {
    address public governor;

    event Received(address indexed sender, uint256 amount);
    event Withdrawn(address indexed to, uint256 amount);
    constructor() Ownable(msg.sender){}
    
    modifier onlyGovernor() {
        require(msg.sender == governor, "Not authorized");
        _;
    }

    function initialize(address _governor) external {
        require(governor == address(0), "Already initialized");
        governor = _governor;
        _transferOwnership(_governor);
    }

    receive() external payable {
        emit Received(msg.sender, msg.value);
    }

    function withdraw(address payable to, uint256 amount) external onlyGovernor {
        require(address(this).balance >= amount, "Insufficient balance");
        to.transfer(amount);
        emit Withdrawn(to, amount);
    }

    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }
}