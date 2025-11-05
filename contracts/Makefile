include .env
export

# Variables
RPC_URL ?= $(AVA_RPC_URL)
RPC_URL2 ?= $(MY_RPC_URL)
PK ?= $(AVA_PK)
GOV := 0xC1D9D726BBE5af20bd844c6F6ECf4BCa52E985e9
PROPOSAL_ID := 0x19b834a868d0e0f608e39fad6c8b7e0f2940c985730fa9faab539130cbe43601
TOKEN := 0x37f6a860625a68b414C2D4c63840212f4271d3C0
TREASURY := 0x1F870Bb783bA193EaBD765195a8A9e31D6641c08
ADMIN := 0x0571235134DC15a00f02916987C2c16b5fC52E2A
TIMELOCK := 0x9258c4c1621d6eCB85971b81B56Fd1206E405A68
REGISTRY := 0x7ea7fC66A5a1eEe4B6b983A84718372ce043fD19
GOVFAC := 0xfFd14cEf06fe527Df57829Ca7EB93158727afb48
PID := 0xdbe173360db52fe847bafb29e3e774f5f0a71acd64006cd600ee8c021a573e0b
GOVNEWFR := 0x4dF4178A9cb71cff072848Aa2CD007c02CF072bF
#erc20 propiedad de governor?

# hash Executor: 0xd8aa0f3194971a2a116679f7c2090f6939c8d4e01a2a8d7e41d55e5351469e63
# Proposer: 0xb09aa5aeb3702cfd50b6b62bc4532604938f21248a27a1d5ca736082b6819cc1

#calldata trasnfer 0xa9059cbb0000000000000000000000001f870bb783ba193eabd765195a8a9e31d6641c0800000000000000000000000000000000000000000000003635c9adc5dea00000
#descrip hash 0xaa567dc393fe08920b7bfb0bd96676e59dad39ae01f522deebe5376a0ca023fd

#pid new 0xa3644832d07842c87238356588cf977049a18aa5a725b803a9b0e999a1a522d6
# Targets
deployTk:
	forge script script/DeployToken.s.sol:DeploySimpleToken --rpc-url $(RPC_URL) --broadcast --private-key $(AVA_PK)

deploy:
	forge script script/DeployGovernor.s.sol:DeployGovernor --rpc-url $(RPC_URL) --broadcast --private-key $(AVA_PK)

deployFactory:
	forge script script/DeployGovernor.s.sol:DeployGovernorFactory --rpc-url $(RPC_URL) --broadcast --private-key $(AVA_PK)

#timelock permisions, debe tener rol proposer (keccak "PROPOSER_ROLE")
haveTimePerm:
	cast call $(TIMELOCK) \
  "hasRole(bytes32,address)(bool)" \
  0xb09aa5aeb3702cfd50b6b62bc4532604938f21248a27a1d5ca736082b6819cc1 \
  $(GOV) \
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
	
proposeB:
	cast send $(GOV) \
  "propose(address[],uint256[],bytes[],string)" \
  "[$(TOKEN)]" \
  "[0]" \
  "[0xa9059cbb0000000000000000000000001f870bb783ba193eabd765195a8a9e31d6641c0800000000000000000000000000000000000000000000003635c9adc5dea00000]" \
  "Propuesta2: enviar 1000 tokens al Treasury para financiar" \
  --rpc-url $(RPC_URL) \
  --private-key $(PK)


# porposal id sin usar make
#  cast keccak256 $(cast abi-encode "propose(address[],uint256[],bytes[],bytes32)" \
  "[0x37f6a860625a68b414C2D4c63840212f4271d3C0]" \
  "[0]" \
  "[0x40c10f190000000000000000000000000571235134dc15a00f02916987c2c16b5fc52e2a00000000000000000000000000000000000000000000000000000000000003e8]" \
  $(cast keccak256 "Propuesta: mintear 1000 tokens a ADMIN"))

  

vote:
	cast send $(GOV) \
		"castVote(uint256,uint8)" \
		$(PID) 1 \
		--rpc-url $(RPC_URL) --private-key $(PK)

state:
	cast call $(GOV) "state(uint256)" $(PID) --rpc-url $(RPC_URL)

hasVote:
	cast call $(GOV) "hasVoted(uint256,address)(bool)" $(PID) $(ADMIN) --rpc-url $(RPC_URL)

proposalSnapshot:
	cast call $(GOV) "proposalSnapshot(uint256)" $(PID) --rpc-url $(RPC_URL)


queue:
	cast send $(GOV) \
		"queue(address[],uint256[],bytes[],bytes32)" \
		"[$(TOKEN)]" \
		"[0]" \
		"[0xa9059cbb0000000000000000000000001f870bb783ba193eabd765195a8a9e31d6641c0800000000000000000000000000000000000000000000003635c9adc5dea00000]" \
		$(shell cast keccak "Propuesta2: enviar 1000 tokens al Treasury para financiar") \
		--rpc-url $(RPC_URL) --private-key $(PK)

execute:
	cast send $(GOV) \
		"execute(address[],uint256[],bytes[],bytes32)" \
		"[$(TOKEN)]" \
		"[0]" \
		"[0xa9059cbb0000000000000000000000001f870bb783ba193eabd765195a8a9e31d6641c0800000000000000000000000000000000000000000000003635c9adc5dea00000]" \
		$(shell cast keccak "Propuesta2: enviar 1000 tokens al Treasury para financiar") \
		--rpc-url $(RPC_URL) --private-key $(PK)

createDao:
	cast send $(GOVFAC) \
  "deployDAO(string,string,address,uint256)(address,address)" \
  "GreenHouseDAO" \
  "DAO para tokenizar créditos de carbono verificados" \
  $(TOKEN) \
  4 \
  --rpc-url https://api.avax-test.network/ext/bc/C/rpc \
  --private-key $(PK)


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

govnew:
	cast call $(GOVNEWFR) "votingDelay()(uint256)" --rpc-url $(AVA_RPC_URL)
governornewVotP:
	cast call $(GOVNEWFR) "votingPeriod()(uint256)" --rpc-url $(AVA_RPC_URL)
govnewTOk:	
	cast call $(GOVNEWFR) "token()(address)" --rpc-url $(AVA_RPC_URL)

seeVOtes:
	cast call $(TOKEN) "getVotes(address)(uint256)" $(ADMIN) --rpc-url $(AVA_RPC_URL)	
seeGOVVotes:
	cast call $(TOKEN) "getVotes(address)(uint256)" $(GOVNEWFR) --rpc-url $(AVA_RPC_URL)	