#!/bin/bash

SOURCE_DIR="./out"
TARGET_DIR="../daoservice/abis"
CONTRACTS=("SimpleGovernor" "GovernorFactory" "DaoRegistry" "Treasury" "SimpleToken")

mkdir -p "$TARGET_DIR"

for CONTRACT in "${CONTRACTS[@]}"; do
  INPUT="$SOURCE_DIR/$CONTRACT.sol/$CONTRACT.json"
  OUTPUT="$TARGET_DIR/${CONTRACT}Abi.ts"

  if [ -f "$INPUT" ]; then
    echo "Exporting $CONTRACT ABI..."
    jq '.abi' "$INPUT" > tmp.json
    echo -n "export const ${CONTRACT}Abi = " > "$OUTPUT"
    cat tmp.json >> "$OUTPUT"
    echo ";" >> "$OUTPUT"
    rm tmp.json
  else
    echo "❌ ABI not found for $CONTRACT"
  fi
done

echo "✅ ABIs synced to $TARGET_DIR"