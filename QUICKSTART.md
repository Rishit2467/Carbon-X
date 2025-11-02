# 🚀 Carbon-X Quick Start Guide

Get started with Carbon-X in 5 minutes!

## Prerequisites

- [Rust](https://rustup.rs/) installed
- [Soroban CLI](https://soroban.stellar.org/docs/getting-started/setup) installed
- A Stellar testnet account

## Step 1: Clone & Build (2 minutes)

```bash
# Clone the repository
git clone <your-repo-url>
cd carbon-x-

# Build the contract
cargo build --target wasm32-unknown-unknown --release

# Run tests
cargo test
```

✅ Expected output: All tests passing

## Step 2: Deploy to Testnet (1 minute)

```bash
# Generate an admin identity
soroban keys generate admin --network testnet

# Fund your account
soroban keys address admin | xargs -I {} curl "https://friendbot.stellar.org?addr={}"

# Deploy the contract
CONTRACT_ID=$(soroban contract deploy \
  --wasm target/wasm32-unknown-unknown/release/carbon_x_.wasm \
  --source admin \
  --network testnet)

echo "✅ Contract deployed: $CONTRACT_ID"
echo $CONTRACT_ID > .contract_id
```

## Step 3: Initialize (30 seconds)

```bash
# Initialize the contract with admin
ADMIN_ADDRESS=$(soroban keys address admin)

soroban contract invoke \
  --id $(cat .contract_id) \
  --source admin \
  --network testnet \
  -- initialize \
  --admin $ADMIN_ADDRESS

echo "✅ Contract initialized"
```

## Step 4: Try It Out (1 minute)

### Add a Verifier

```bash
# Generate verifier identity
soroban keys generate verifier --network testnet
soroban keys address verifier | xargs -I {} curl "https://friendbot.stellar.org?addr={}"

# Add verifier to whitelist
VERIFIER_ADDRESS=$(soroban keys address verifier)

soroban contract invoke \
  --id $(cat .contract_id) \
  --source admin \
  --network testnet \
  -- add_verifier \
  --verifier $VERIFIER_ADDRESS

echo "✅ Verifier added"
```

### Register Your First Carbon Credit

```bash
# Generate issuer identity
soroban keys generate issuer --network testnet
soroban keys address issuer | xargs -I {} curl "https://friendbot.stellar.org?addr={}"

ISSUER_ADDRESS=$(soroban keys address issuer)

# Register a carbon credit
CREDIT_ID=$(soroban contract invoke \
  --id $(cat .contract_id) \
  --source verifier \
  --network testnet \
  -- register_credit \
  --verifier $VERIFIER_ADDRESS \
  --project_id "QUICKSTART-2024-001" \
  --issuer $ISSUER_ADDRESS \
  --vintage_year 2024 \
  --region "Test Region" \
  --quantity 100)

echo "✅ Credit registered with ID: $CREDIT_ID"
```

### Verify the Credit

```bash
soroban contract invoke \
  --id $(cat .contract_id) \
  --source verifier \
  --network testnet \
  -- verify_credit \
  --verifier $VERIFIER_ADDRESS \
  --credit_id 1

echo "✅ Credit verified"
```

### View Credit Details

```bash
soroban contract invoke \
  --id $(cat .contract_id) \
  --network testnet \
  -- get_credit \
  --credit_id 1

echo "✅ Credit details retrieved"
```

## 🎉 Success!

You've successfully:
- ✅ Built and deployed Carbon-X to Stellar Testnet
- ✅ Initialized the contract
- ✅ Added a verifier
- ✅ Registered and verified a carbon credit

## What's Next?

### Try the Marketplace
```bash
# List your credit for sale
soroban contract invoke \
  --id $(cat .contract_id) \
  --source issuer \
  --network testnet \
  -- list_for_sale \
  --owner $ISSUER_ADDRESS \
  --credit_id 1 \
  --price 10000000  # 1 XLM
```

### Retire a Credit
```bash
soroban contract invoke \
  --id $(cat .contract_id) \
  --source issuer \
  --network testnet \
  -- retire_credit \
  --owner $ISSUER_ADDRESS \
  --credit_id 1
```

## 📚 Learn More

- **Full Documentation:** See [README.md](README.md)
- **API Reference:** See [README.md#api-reference](README.md#-api-reference)
- **More Examples:** See [EXAMPLES.md](EXAMPLES.md)

## 🆘 Need Help?

- Check the [Troubleshooting](#troubleshooting) section in EXAMPLES.md
- Open an issue on GitHub
- Read the [Soroban Documentation](https://soroban.stellar.org/docs)

## Troubleshooting

### Command not found: soroban
```bash
cargo install --locked soroban-cli
```

### Network not found: testnet
```bash
soroban network add testnet \
  --rpc-url https://soroban-testnet.stellar.org:443 \
  --network-passphrase "Test SDF Network ; September 2015"
```

### Account not funded
```bash
# Use friendbot to get test XLM
soroban keys address <YOUR_KEY> | xargs -I {} curl "https://friendbot.stellar.org?addr={}"
```

---

**Happy building! 🌳**
