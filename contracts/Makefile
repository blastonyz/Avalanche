include .env
export

# Variables
RPC_URL ?= $(AVA_RPC_URL)
RPC_URL2 ?= $(MY_RPC_URL)
PK ?= $(AVA_PK)
GOV := 0x7b1fddcc54fcb5f585e4d49822336356d1b7c351
PROPOSAL_ID := 57271435509266813522100432373138232976217142996545672054452807377444095144612
TOKEN := 0x37f6a860625a68b414C2D4c63840212f4271d3C0
TREASURY := 0x746e2011b20a7df9952f3ae9591c0a9d4a0b8865
ADMIN := 0x0571235134DC15a00f02916987C2c16b5fC52E2A
TIMELOCK := 0xA110171dB163F492ea0495d679B590b9708bDB59
REGISTRY := 0xC0DDC50f740A3FcA6f8A84565AE89F69b98B2168
GOVFAC := 0x7E4786C7B2d31A7EE6EaF2f3557aF53bd0C680EE
PID := 100523211453757576252262195424482199024159405828057605577187529177129917839081
GOVNEWFR := 0x330959bef1dd1bbd2d62a2c12ac877bb8b97b41f
DESHASHFR := 0x87abb80c1f043f422727dafedb9dc8ce3e36c1302c611a948288ef2a389309d2
NEWTIMELOCK := 0x4336b947A4ee4fc285a29719dc2a227A88bB0DD9
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
	forge script script/DeployGovernorFactory.s.sol:DeployGovernorFactory --rpc-url $(RPC_URL) --broadcast --private-key $(AVA_PK)

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
  "[$(TREASURY)]" \
  "[0]" \
  "[0xa9059cbb000000000000000000000000746e2011b20a7df9952f3ae9591c0a9d4a0b8865000000000000000000000000000000000000000000000000056bc75e2d63100000]" \
  0x87abb80c1f043f422727dafedb9dc8ce3e36c1302c611a948288ef2a389309d2 \
  --private-key $(PK) \
  --rpc-url https://api.avax-test.network/ext/bc/C/rpc


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
  "DaoDTH" \
  "DAO para probar" \
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

registryCheck: 
	cast call $(REGISTRY) "getDAOByIndex(uint256)((string,string,address,address,address))" 0 --rpc-url $(AVA_RPC_URL)

seeGOVVotes2:
	cast call $(TOKEN) "getVotes(address)(uint256)" 0xFEFca832cE869f72492DAe69cE7E90282BcEb7e8 --rpc-url $(AVA_RPC_URL)	

voteNew:
	cast call 0x875602396eb69e8adb6ee860fb6ea11134c9ff99 \
"hashProposal(address[],uint256[],bytes[],bytes32)" \
"[0x37f6a860625a68b414C2D4c63840212f4271d3C0]" \
"[0]" \
"[0xa9059cbb000000000000000000000000951f96b2e22c4d1ad4150aef33081171e27b59ae000000000000000000000000000000000000000000000000016345785d8a0000]" \
0x2c3a3950f3e4c1d3a9f6c4e2b7e1a3d9c5f4e3a2b1c0d9e8f7a6b5c4d3e2f1a0 --rpc-url $(RPC_URL) --private-key $(PK)

queueFront:
	cast send $(GOVNEWFR) \
		"queue(address[],uint256[],bytes[],bytes32)" \
		"[0x37f6a860625a68b414C2D4c63840212f4271d3C0]" \
		"[0]" \
		"[0xa9059cbb0000000000000000000000004137e8b0e14725619b7e083c0598097f0b01d698000000000000000000000000000000000000000000000000016345785d8a0000]" \
		$(shell cast keccak "Transfer test funds") \
		--rpc-url $(RPC_URL) --private-key $(PK)

voteExec:
	cast send $(GOVNEWFR) \
		"castVote(uint256,uint8)" \
		$(PID) 1 \
		--rpc-url $(RPC_URL) --private-key $(PK)

daosCount:	
	cast call $(REGISTRY) "getDAOCount()(uint256)" --rpc-url $(RPC_URL)	

getTimePerm2:
	cast send $(NEWTIMELOCK) \
  "grantRole(bytes32,address)" \
  0xb09aa5aeb3702cfd50b6b62bc4532604938f21248a27a1d5ca736082b6819cc1 \
  0x330959bef1dd1bbd2d62a2c12ac877bb8b97b41f \
  --rpc-url https://api.avax-test.network/ext/bc/C/rpc \
  --private-key $(PK)			

executeFr:
	cast send 0x330959bef1dd1bbd2d62a2c12ac877bb8b97b41f \
		"execute(address[],uint256[],bytes[],bytes32)" \
		"[$(TOKEN)]" \
		"[0]" \
		"[0xa9059cbb0000000000000000000000001f870bb783ba193eabd765195a8a9e31d6641c0800000000000000000000000000000000000000000000003635c9adc5dea00000]" \
		0x87abb80c1f043f422727dafedb9dc8ce3e36c1302c611a948288ef2a389309d2 \
		--rpc-url $(RPC_URL) --private-key $(PK)