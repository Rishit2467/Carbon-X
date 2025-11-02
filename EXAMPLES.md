# Carbon-X Usage Examples

This document provides practical examples for interacting with the Carbon-X smart contract.

## Table of Contents
1. [Setup](#setup)
2. [Admin Operations](#admin-operations)
3. [Verifier Operations](#verifier-operations)
4. [Marketplace Operations](#marketplace-operations)
5. [Retirement Operations](#retirement-operations)

---

## Setup

### Install Soroban CLI
```bash
cargo install --locked soroban-cli
```

### Generate Identities
```bash
# Generate admin identity
soroban keys generate admin --network testnet

# Generate verifier identity
soroban keys generate verifier --network testnet

# Generate user identities
soroban keys generate user1 --network testnet
soroban keys generate user2 --network testnet
```

### Configure Network
```bash
soroban network add testnet \
  --rpc-url https://soroban-testnet.stellar.org:443 \
  --network-passphrase "Test SDF Network ; September 2015"
```

### Fund Accounts
```bash
# Get testnet lumens from friendbot
soroban keys address admin | xargs -I {} curl "https://friendbot.stellar.org?addr={}"
soroban keys address verifier | xargs -I {} curl "https://friendbot.stellar.org?addr={}"
soroban keys address user1 | xargs -I {} curl "https://friendbot.stellar.org?addr={}"
soroban keys address user2 | xargs -I {} curl "https://friendbot.stellar.org?addr={}"
```

---

## Admin Operations

### 1. Deploy Contract
```bash
CONTRACT_ID=$(soroban contract deploy \
  --wasm target/wasm32-unknown-unknown/release/carbon_x_.wasm \
  --source admin \
  --network testnet)

echo "Contract deployed with ID: $CONTRACT_ID"
echo $CONTRACT_ID > .contract_id
```

### 2. Initialize Contract
```bash
CONTRACT_ID=$(cat .contract_id)
ADMIN_ADDRESS=$(soroban keys address admin)

soroban contract invoke \
  --id $CONTRACT_ID \
  --source admin \
  --network testnet \
  -- initialize \
  --admin $ADMIN_ADDRESS
```

### 3. Add Verifier
```bash
CONTRACT_ID=$(cat .contract_id)
VERIFIER_ADDRESS=$(soroban keys address verifier)

soroban contract invoke \
  --id $CONTRACT_ID \
  --source admin \
  --network testnet \
  -- add_verifier \
  --verifier $VERIFIER_ADDRESS
```

### 4. Check Admin Status
```bash
CONTRACT_ID=$(cat .contract_id)
ADMIN_ADDRESS=$(soroban keys address admin)

soroban contract invoke \
  --id $CONTRACT_ID \
  --network testnet \
  -- is_admin \
  --address $ADMIN_ADDRESS
```

---

## Verifier Operations

### 1. Register a Carbon Credit
```bash
CONTRACT_ID=$(cat .contract_id)
VERIFIER_ADDRESS=$(soroban keys address verifier)
ISSUER_ADDRESS=$(soroban keys address user1)

# Register credit for reforestation project in Brazil
CREDIT_ID=$(soroban contract invoke \
  --id $CONTRACT_ID \
  --source verifier \
  --network testnet \
  -- register_credit \
  --verifier $VERIFIER_ADDRESS \
  --project_id "REFOREST-BR-2024-001" \
  --issuer $ISSUER_ADDRESS \
  --vintage_year 2024 \
  --region "Amazon Basin, Brazil" \
  --quantity 1000)

echo "Credit registered with ID: $CREDIT_ID"
```

### 2. Verify a Carbon Credit
```bash
CONTRACT_ID=$(cat .contract_id)
VERIFIER_ADDRESS=$(soroban keys address verifier)

soroban contract invoke \
  --id $CONTRACT_ID \
  --source verifier \
  --network testnet \
  -- verify_credit \
  --verifier $VERIFIER_ADDRESS \
  --credit_id 1
```

### 3. Get Credit Details
```bash
CONTRACT_ID=$(cat .contract_id)

soroban contract invoke \
  --id $CONTRACT_ID \
  --network testnet \
  -- get_credit \
  --credit_id 1
```

---

## Marketplace Operations

### 1. List Credit for Sale
```bash
CONTRACT_ID=$(cat .contract_id)
OWNER_ADDRESS=$(soroban keys address user1)

# List for 10 XLM (100000000 stroops)
soroban contract invoke \
  --id $CONTRACT_ID \
  --source user1 \
  --network testnet \
  -- list_for_sale \
  --owner $OWNER_ADDRESS \
  --credit_id 1 \
  --price 100000000
```

### 2. View Listing
```bash
CONTRACT_ID=$(cat .contract_id)

soroban contract invoke \
  --id $CONTRACT_ID \
  --network testnet \
  -- get_listing \
  --credit_id 1
```

### 3. Purchase Credit
```bash
CONTRACT_ID=$(cat .contract_id)
BUYER_ADDRESS=$(soroban keys address user2)

soroban contract invoke \
  --id $CONTRACT_ID \
  --source user2 \
  --network testnet \
  -- buy_credit \
  --buyer $BUYER_ADDRESS \
  --credit_id 1
```

### 4. Verify Ownership Changed
```bash
CONTRACT_ID=$(cat .contract_id)

# Check new owner
soroban contract invoke \
  --id $CONTRACT_ID \
  --network testnet \
  -- get_credit \
  --credit_id 1
```

---

## Retirement Operations

### 1. Retire a Carbon Credit
```bash
CONTRACT_ID=$(cat .contract_id)
OWNER_ADDRESS=$(soroban keys address user2)

soroban contract invoke \
  --id $CONTRACT_ID \
  --source user2 \
  --network testnet \
  -- retire_credit \
  --owner $OWNER_ADDRESS \
  --credit_id 1
```

### 2. View Retired Credits
```bash
CONTRACT_ID=$(cat .contract_id)

soroban contract invoke \
  --id $CONTRACT_ID \
  --network testnet \
  -- get_retired_credits
```

### 3. Verify Retirement Status
```bash
CONTRACT_ID=$(cat .contract_id)

soroban contract invoke \
  --id $CONTRACT_ID \
  --network testnet \
  -- get_credit \
  --credit_id 1
```

---

## Complete Workflow Example

Here's a complete workflow from setup to retirement:

```bash
# 1. Deploy and initialize
CONTRACT_ID=$(soroban contract deploy \
  --wasm target/wasm32-unknown-unknown/release/carbon_x_.wasm \
  --source admin \
  --network testnet)

ADMIN_ADDRESS=$(soroban keys address admin)
soroban contract invoke \
  --id $CONTRACT_ID \
  --source admin \
  --network testnet \
  -- initialize \
  --admin $ADMIN_ADDRESS

# 2. Add verifier
VERIFIER_ADDRESS=$(soroban keys address verifier)
soroban contract invoke \
  --id $CONTRACT_ID \
  --source admin \
  --network testnet \
  -- add_verifier \
  --verifier $VERIFIER_ADDRESS

# 3. Register credit
ISSUER_ADDRESS=$(soroban keys address user1)
CREDIT_ID=$(soroban contract invoke \
  --id $CONTRACT_ID \
  --source verifier \
  --network testnet \
  -- register_credit \
  --verifier $VERIFIER_ADDRESS \
  --project_id "SOLAR-KE-2024-042" \
  --issuer $ISSUER_ADDRESS \
  --vintage_year 2024 \
  --region "Kenya" \
  --quantity 500)

# 4. Verify credit
soroban contract invoke \
  --id $CONTRACT_ID \
  --source verifier \
  --network testnet \
  -- verify_credit \
  --verifier $VERIFIER_ADDRESS \
  --credit_id $CREDIT_ID

# 5. List for sale
soroban contract invoke \
  --id $CONTRACT_ID \
  --source user1 \
  --network testnet \
  -- list_for_sale \
  --owner $ISSUER_ADDRESS \
  --credit_id $CREDIT_ID \
  --price 50000000

# 6. Purchase credit
BUYER_ADDRESS=$(soroban keys address user2)
soroban contract invoke \
  --id $CONTRACT_ID \
  --source user2 \
  --network testnet \
  -- buy_credit \
  --buyer $BUYER_ADDRESS \
  --credit_id $CREDIT_ID

# 7. Retire credit
soroban contract invoke \
  --id $CONTRACT_ID \
  --source user2 \
  --network testnet \
  -- retire_credit \
  --owner $BUYER_ADDRESS \
  --credit_id $CREDIT_ID

echo "✅ Complete workflow executed successfully!"
```

---

## Troubleshooting

### Common Issues

**Issue: "Already initialized" error**
```
Solution: The contract can only be initialized once. Deploy a new contract instance if needed.
```

**Issue: "Not verifier" error**
```
Solution: Ensure the address is whitelisted using add_verifier before attempting to register credits.
```

**Issue: "Not owner" error**
```
Solution: Only the credit owner can list, retire, or transfer their credits.
```

**Issue: "Credit not found" error**
```
Solution: Verify the credit ID exists using get_credit.
```

---

## Advanced Usage

### Batch Operations (Script)

```bash
#!/bin/bash
# register_multiple_credits.sh

CONTRACT_ID=$(cat .contract_id)
VERIFIER_ADDRESS=$(soroban keys address verifier)
ISSUER_ADDRESS=$(soroban keys address user1)

# Array of projects
declare -a projects=(
  "WIND-IN-2024-001:India:2024:750"
  "HYDRO-NO-2024-002:Norway:2024:1200"
  "BIOGAS-TH-2024-003:Thailand:2024:600"
)

# Register each project
for project in "${projects[@]}"; do
  IFS=':' read -r id region year quantity <<< "$project"
  
  echo "Registering: $id"
  soroban contract invoke \
    --id $CONTRACT_ID \
    --source verifier \
    --network testnet \
    -- register_credit \
    --verifier $VERIFIER_ADDRESS \
    --project_id "$id" \
    --issuer $ISSUER_ADDRESS \
    --vintage_year $year \
    --region "$region" \
    --quantity $quantity
done
```

---

## Monitoring Events

To monitor contract events in real-time:

```bash
# Watch for all events
soroban events --id $CONTRACT_ID --network testnet --start ledger

# Filter specific event types
soroban events --id $CONTRACT_ID --network testnet \
  --start ledger \
  --filter "topic1=CreditVerified"
```

---

**For more examples and updates, visit the GitHub repository.**
