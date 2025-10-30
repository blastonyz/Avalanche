include .env
export

# Variables
RPC_URL ?= $(AVA_RPC_URL)
RPC_URL2 ?= $(MY_RPC_URL)
PK ?= $(AVA_PK)
GOV := 0xfBB205886F4dfcce3e3b35E14557914CB9D90668
PROPOSAL_ID := 0xb8b2e429b12a90d45302a8cca07d24bc65f0901e10ba72393a051986d14d6509
TOKEN := 0xD8ED7139fEef8775c8A6c9974Da8BB8DF22868c1
ADMIN := 0x0571235134DC15a00f02916987C2c16b5fC52E2A
TIMELOCK := 0x592966903c10037fD1a97a5655ef2392b24E8d1c

#erc20 propiedad de governor?

# hash Executor: 0xd8aa0f3194971a2a116679f7c2090f6939c8d4e01a2a8d7e41d55e5351469e63
# Proposer: 0xb09aa5aeb3702cfd50b6b62bc4532604938f21248a27a1d5ca736082b6819cc1

# Targets
deployTk:
	forge script script/DeployToken.s.sol:DeploySimpleToken --rpc-url $(RPC_URL) --broadcast --private-key $(AVA_PK)

deploy:
	forge script script/DeployGovernor.s.sol:DeployGovernor --rpc-url $(RPC_URL) --broadcast --private-key $(AVA_PK)

#timelock permisions, debe tener rol proposer (keccak "PROPOSER_ROLE")
haveTimePerm:
	cast call $(TIMELOCK) \
  "hasRole(bytes32,address)(bool)" \
  0xb09aa5aeb3702cfd50b6b62bc4532604938f21248a27a1d5ca736082b6819cc1 \
  0x7c59c16Dd64D4D1B1eD3d646A43c07928447A3dB \
  --rpc-url https://api.avax-test.network/ext/bc/C/rpc

getTimePerm:
	cast send $(TIMELOCK) \
  "grantRole(bytes32,address)" \
  0xb09aa5aeb3702cfd50b6b62bc4532604938f21248a27a1d5ca736082b6819cc1 \
  $(GOV) \
  --rpc-url https://api.avax-test.network/ext/bc/C/rpc \
  --private-key $(PK)

#tambien rol executor
haveExec:
	cast call $(TIMELOCK) \
  "hasRole(bytes32,address)(bool)" \
  0xd8aa0f3194971a2a116679f7c2090f6939c8d4e01a2a8d7e41d55e5351469e63 \
  $(GOV) \
  --rpc-url https://api.avax-test.network/ext/bc/C/rpc
getExec:
	cast send $(TIMELOCK) \
  "grantRole(bytes32,address)" \
  0xd8aa0f3194971a2a116679f7c2090f6939c8d4e01a2a8d7e41d55e5351469e63 \
  $(GOV) \
  --rpc-url https://api.avax-test.network/ext/bc/C/rpc \
  --private-key $(PK)

#tambien ser owner del token porque el transfiere
timeToken:
	cast send $(TOKEN) \
  "transferOwnership(address)" $(TIMELOCK) \
  --rpc-url $(RPC_URL) \
  --private-key $(PK)


delegate:
	cast send $(TOKEN) "delegate(address)" $(ADMIN) --rpc-url $(RPC_URL) --private-key $(PK)

propose:
	cast send $(GOV) "propose(address[],uint256[],bytes[],string)"   "[$(TOKEN)]"   "[0]"   "[0x40c10f190000000000000000000000000571235134dc15a00f02916987c2c16b5fc52e2a00000000000000000000000000000000000000000000000000000000000003e8]"   "Propuesta: mintear 1000 tokens a ADMIN"   --rpc-url $(RPC_URL)   --private-key $(PK)

# porposal id sin usar make
#  cast keccak256 $(cast abi-encode "propose(address[],uint256[],bytes[],bytes32)" \
  "[0xD8ED7139fEef8775c8A6c9974Da8BB8DF22868c1]" \
  "[0]" \
  "[0x40c10f190000000000000000000000000571235134dc15a00f02916987c2c16b5fc52e2a00000000000000000000000000000000000000000000000000000000000003e8]" \
  $(cast keccak256 "Propuesta: mintear 1000 tokens a ADMIN"))

  

vote:
	cast send $(GOV) \
		"castVote(uint256,uint8)" \
		$(PROPOSAL_ID) 1 \
		--rpc-url $(RPC_URL) --private-key $(PK)

state:
	cast call $(GOV) "state(uint256)" $(PROPOSAL_ID) --rpc-url $(RPC_URL)

hasVote:
	cast call $(GOV) "hasVoted(uint256,address)(bool)" $(PROPOSAL_ID) $(ADMIN) --rpc-url $(RPC_URL)

queue:
	cast send $(GOV) \
		"queue(address[],uint256[],bytes[],bytes32)" \
		"[$(TOKEN)]" \
		"[0]" \
		"[0x40c10f190000000000000000000000000571235134dc15a00f02916987c2c16b5fc52e2a00000000000000000000000000000000000000000000000000000000000003e8]" \
		$(shell cast keccak "Propuesta: mintear 1000 tokens a ADMIN") \
		--rpc-url $(RPC_URL) --private-key $(PK)

execute:
	cast send $(GOV) \
		"execute(address[],uint256[],bytes[],bytes32)" \
		"[$(TOKEN)]" \
		"[0]" \
		"[0x40c10f190000000000000000000000000571235134dc15a00f02916987c2c16b5fc52e2a00000000000000000000000000000000000000000000000000000000000003e8]" \
		$(shell cast keccak "Propuesta: mintear 1000 tokens a ADMIN") \
		--rpc-url $(RPC_URL) --private-key $(PK)

#MY L1
GOV2 := 0x7577C79a42eE3F198ee3Db8bB1FCD231FA06851F
TIME := 0x83ab6C28388be272379546946afabd7F15541464
PROPOSAL_ID2 := 0xb124cb880c41c8e2d61de65bee6d7d235f31f0fe3b0dedd4e7bf32cd12dd185c

deployTk2:
	forge script script/DeployToken.s.sol:DeploySimpleToken --rpc-url $(RPC_URL2) --broadcast --private-key $(AVA_PK)

deployGov2:
	forge script script/DeployGovernor.s.sol:DeployGovernor --rpc-url $(RPC_URL2) --broadcast --private-key $(AVA_PK)

propose2:
	cast send $(GOV2) "propose(address[],uint256[],bytes[],string)"   "[0x0072ec00a288c4ba4283B6166DBca5A5952D5530]"   "[0]"   "[0x40c10f190000000000000000000000000571235134dc15a00f02916987c2c16b5fc52e2a00000000000000000000000000000000000000000000000000000000000003e8]"   "Propuesta: mintear 1000 tokens a ADMIN v2"   --rpc-url $(RPC_URL2)   --private-key $(AVA_PK)

vote2:
	cast send $(GOV2) \
		"castVote(uint256,uint8)" \
		$(PROPOSAL_ID2) 1 \
		--rpc-url $(RPC_URL2) --private-key $(PK)

state2:
	cast call $(GOV2) "state(uint256)" $(PROPOSAL_ID2) --rpc-url $(RPC_URL2)

queue2:
	cast send $(GOV2) \
		"queue(address[],uint256[],bytes[],bytes32)" \
		"[0x0072ec00a288c4ba4283B6166DBca5A5952D5530]" \
		"[0]" \
		"[0x40c10f190000000000000000000000000571235134dc15a00f02916987c2c16b5fc52e2a00000000000000000000000000000000000000000000000000000000000003e8]" \
		$(shell cast keccak "Propuesta: mintear 1000 tokens a ADMIN") \
		--rpc-url $(RPC_URL2) --private-key $(PK)

execute2:
	cast send $(GOV2) \
		"execute(address[],uint256[],bytes[],bytes32)" \
		"[0x0072ec00a288c4ba4283B6166DBca5A5952D5530]" \
		"[0]" \
		"[0x40c10f190000000000000000000000000571235134dc15a00f02916987c2c16b5fc52e2a00000000000000000000000000000000000000000000000000000000000003e8]" \
		$(shell cast keccak "Propuesta: mintear 1000 tokens a ADMIN") \
		--rpc-url $(RPC_URL2) --private-key $(PK)
