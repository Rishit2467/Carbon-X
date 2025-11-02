# 🚀 Carbon-X Deployment Checklist

Use this checklist to ensure a smooth deployment to Stellar Soroban.

## Pre-Deployment

### 1. Environment Setup
- [ ] Rust and Cargo installed (`rustc --version`)
- [ ] Soroban CLI installed (`soroban --version`)
- [ ] WASM target added (`rustup target list | grep wasm32`)
- [ ] Network configured (`soroban network ls`)

### 2. Contract Verification
- [ ] All tests passing (`cargo test`)
- [ ] WASM builds successfully (`cargo build --target wasm32-unknown-unknown --release`)
- [ ] No compilation warnings
- [ ] Contract size optimized (check `target/wasm32-unknown-unknown/release/carbon_x_.wasm`)

### 3. Account Preparation
- [ ] Admin account created (`soroban keys generate admin`)
- [ ] Admin account funded (testnet: use friendbot, mainnet: fund with real XLM)
- [ ] Admin address saved (`soroban keys address admin`)
- [ ] Verifier accounts prepared (if applicable)

### 4. Documentation Review
- [ ] README.md reviewed
- [ ] QUICKSTART.md tested
- [ ] EXAMPLES.md verified
- [ ] API documentation accurate

## Deployment Steps

### Step 1: Build Contract
```bash
# Build optimized WASM
cargo build --target wasm32-unknown-unknown --release

# Verify build
ls -lh target/wasm32-unknown-unknown/release/carbon_x_.wasm
```
- [ ] Build successful
- [ ] WASM file exists
- [ ] File size reasonable (<500KB recommended)

### Step 2: Deploy to Network

#### For Testnet:
```bash
CONTRACT_ID=$(soroban contract deploy \
  --wasm target/wasm32-unknown-unknown/release/carbon_x_.wasm \
  --source admin \
  --network testnet)

echo $CONTRACT_ID > .contract_id
echo "Contract ID: $CONTRACT_ID"
```

#### For Futurenet:
```bash
CONTRACT_ID=$(soroban contract deploy \
  --wasm target/wasm32-unknown-unknown/release/carbon_x_.wasm \
  --source admin \
  --network futurenet)

echo $CONTRACT_ID > .contract_id
echo "Contract ID: $CONTRACT_ID"
```

#### For Mainnet:
```bash
# ⚠️ MAINNET DEPLOYMENT - VERIFY EVERYTHING FIRST!
CONTRACT_ID=$(soroban contract deploy \
  --wasm target/wasm32-unknown-unknown/release/carbon_x_.wasm \
  --source admin \
  --network mainnet)

echo $CONTRACT_ID > .contract_id
echo "Contract ID: $CONTRACT_ID"
```

- [ ] Deployment transaction successful
- [ ] Contract ID saved
- [ ] Transaction hash recorded

### Step 3: Initialize Contract
```bash
ADMIN_ADDRESS=$(soroban keys address admin)

soroban contract invoke \
  --id $(cat .contract_id) \
  --source admin \
  --network testnet \
  -- initialize \
  --admin $ADMIN_ADDRESS
```

- [ ] Initialization successful
- [ ] Admin address set correctly
- [ ] No error messages

### Step 4: Verify Deployment
```bash
# Check if admin is set correctly
soroban contract invoke \
  --id $(cat .contract_id) \
  --network testnet \
  -- is_admin \
  --address $ADMIN_ADDRESS
```

- [ ] Returns `true` for admin address
- [ ] Contract responding to queries

### Step 5: Add Initial Verifiers
```bash
# Generate verifier account
soroban keys generate verifier1 --network testnet
VERIFIER1=$(soroban keys address verifier1)

# Add to whitelist
soroban contract invoke \
  --id $(cat .contract_id) \
  --source admin \
  --network testnet \
  -- add_verifier \
  --verifier $VERIFIER1
```

- [ ] Verifier added successfully
- [ ] Multiple verifiers added (if needed)
- [ ] Verifier addresses documented

## Post-Deployment

### 1. Testing
- [ ] Register a test carbon credit
- [ ] Verify the test credit
- [ ] List test credit for sale
- [ ] Purchase test credit (different account)
- [ ] Retire test credit
- [ ] Query all functions work correctly

### 2. Documentation
- [ ] Update README.md with contract ID
- [ ] Document deployed network
- [ ] Update examples with real contract ID
- [ ] Create deployment notes

### 3. Monitoring
- [ ] Set up event monitoring
- [ ] Configure alerts (if applicable)
- [ ] Document admin procedures
- [ ] Create backup of admin keys

### 4. Security
- [ ] Admin keys secured (hardware wallet recommended for mainnet)
- [ ] Backup keys created and stored safely
- [ ] Recovery procedures documented
- [ ] Access control verified

## Verification Commands

### Check Contract State
```bash
CONTRACT_ID=$(cat .contract_id)

# View a credit
soroban contract invoke --id $CONTRACT_ID --network testnet -- get_credit --credit_id 1

# View retired credits
soroban contract invoke --id $CONTRACT_ID --network testnet -- get_retired_credits

# Check admin
soroban contract invoke --id $CONTRACT_ID --network testnet -- is_admin --address <ADDRESS>
```

### Monitor Events
```bash
soroban events --id $CONTRACT_ID --network testnet --start ledger
```

## Rollback Plan

In case of issues:

1. **Don't panic** - Contract is immutable once deployed
2. **Document the issue** - Save error messages and transaction IDs
3. **Deploy new version** - If needed, deploy a corrected version
4. **Migrate data** - Plan data migration if necessary (manual process)
5. **Communicate** - Inform users of any changes

## Mainnet-Specific Checks

⚠️ **ONLY for Mainnet Deployment**

- [ ] Full security audit completed
- [ ] Code review by multiple developers
- [ ] All tests passing on testnet
- [ ] Real-world testing completed
- [ ] Legal compliance verified
- [ ] Insurance/coverage considered
- [ ] Incident response plan ready
- [ ] Customer support prepared
- [ ] Admin keys in hardware wallet
- [ ] Multi-sig considered for admin functions

## Support Information

### Contract Information
- **Contract ID**: `_________________`
- **Network**: `_________________`
- **Deployed Date**: `_________________`
- **Deployed By**: `_________________`
- **Admin Address**: `_________________`

### Key Contacts
- **Admin**: `_________________`
- **Technical Lead**: `_________________`
- **Security Contact**: `_________________`

### Resources
- GitHub Repository: `_________________`
- Documentation: `_________________`
- Support Channel: `_________________`

---

## Final Checklist

Before going live:

- [ ] All pre-deployment checks completed
- [ ] Contract deployed and initialized
- [ ] Initial verifiers added
- [ ] Test transactions successful
- [ ] Documentation updated
- [ ] Monitoring in place
- [ ] Keys secured
- [ ] Team notified
- [ ] Users informed (if applicable)
- [ ] Support ready

---

## 🎉 Deployment Complete!

Once all items are checked:

1. **Announce** - Share contract ID with stakeholders
2. **Document** - Update all documentation
3. **Monitor** - Watch for first real transactions
4. **Support** - Be ready to help early users

**Contract ID**: `_________________`

**Status**: 🚀 **LIVE ON STELLAR**

---

*Checklist Version: 1.0*  
*Last Updated: November 2, 2025*
