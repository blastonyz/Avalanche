## Governor Proposals States
| Estado      | Código | Descripción                                                                 |
|-------------|--------|------------------------------------------------------------------------------|
| Pending     | 0      | La propuesta fue creada pero aún no comenzó la votación (`votingDelay`)     |
| Active      | 1      | La votación está abierta (`votingPeriod`)                                   |
| Canceled    | 2      | La propuesta fue cancelada antes de ejecutarse                              |
| Defeated    | 3      | La propuesta no alcanzó quorum o fue rechazada por votos                    |
| Succeeded   | 4      | La propuesta fue aprobada y puede ser encolada (`queue`)                    |
| Queued      | 5      | La propuesta está encolada en el `TimelockController`                       |
| Expired     | 6      | La propuesta encolada expiró antes de ejecutarse                            |
| Executed    | 7      | La propuesta fue ejecutada exitosamente                                     |

## Foundry

**Foundry is a blazing fast, portable and modular toolkit for Ethereum application development written in Rust.**

Foundry consists of:

-   **Forge**: Ethereum testing framework (like Truffle, Hardhat and DappTools).
-   **Cast**: Swiss army knife for interacting with EVM smart contracts, sending transactions and getting chain data.
-   **Anvil**: Local Ethereum node, akin to Ganache, Hardhat Network.
-   **Chisel**: Fast, utilitarian, and verbose solidity REPL.

## Documentation

https://book.getfoundry.sh/

## Usage

### Build

```shell
$ forge build
```

### Test

```shell
$ forge test
```

### Format

```shell
$ forge fmt
```

### Gas Snapshots

```shell
$ forge snapshot
```

### Anvil

```shell
$ anvil
```

### Deploy

```shell
$ forge script script/Counter.s.sol:CounterScript --rpc-url <your_rpc_url> --private-key <your_private_key>
```

### Cast

```shell
$ cast <subcommand>
```

### Help

```shell
$ forge --help
$ anvil --help
$ cast --help
```
