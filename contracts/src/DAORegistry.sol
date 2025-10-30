// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract DAORegistry {
    struct DAO {
        string name;
        string description;
        address governor;
        address treasury;
        address token;
        uint256 createdAt;
    }

    mapping(address => DAO) public daos;
    address[] public daoList;

    event DAORegistered(
        address indexed governor,
        address indexed treasury,
        address indexed token,
        string name,
        string description
    );

    function registerDAO(
        string memory name,
        string memory description,
        address governor,
        address treasury,
        address token
    ) external {
        require(daos[governor].createdAt == 0, "DAO already registered");

        daos[governor] = DAO({
            name: name,
            description: description,
            governor: governor,
            treasury: treasury,
            token: token,
            createdAt: block.timestamp
        });

        daoList.push(governor);

        emit DAORegistered(governor, treasury, token, name, description);
    }

    function getDAOCount() external view returns (uint256) {
        return daoList.length;
    }

    function getDAOByIndex(uint256 index) external view returns (DAO memory) {
        return daos[daoList[index]];
    }
}