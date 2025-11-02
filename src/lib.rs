#![no_std]

//! # Carbon-X: Stellar Decentralized Carbon Credit Registry & Exchange
//! 
//! A comprehensive Soroban smart contract for tokenizing, verifying, trading,
//! and retiring carbon credits on the Stellar network.

use soroban_sdk::{
    contract, contractimpl, contracttype, contracterror, contractmeta,
    Address, Env, String, Vec, symbol_short,
};

// Contract metadata
contractmeta!(
    key = "Description",
    val = "Carbon-X: Decentralized Carbon Credit Registry & Marketplace"
);

/// Storage keys for contract data
#[derive(Clone)]
#[contracttype]
pub enum DataKey {
    Admin,
    NextCreditId,
    Credit(u64),                    // CarbonCredit by ID
    Verifiers,                       // Vec<Address> of whitelisted verifiers
    Listing(u64),                    // MarketListing by credit ID
    RetiredCredits,                  // Vec<u64> of retired credit IDs
}

/// Carbon Credit metadata structure
#[derive(Clone)]
#[contracttype]
pub struct CarbonCredit {
    pub id: u64,
    pub project_id: String,
    pub issuer: Address,
    pub verifier: Address,
    pub vintage_year: u32,
    pub region: String,
    pub quantity: u64,              // Tons of CO₂ offset
    pub verified: bool,
    pub retired: bool,
    pub owner: Address,
}

/// Marketplace listing structure
#[derive(Clone)]
#[contracttype]
pub struct MarketListing {
    pub credit_id: u64,
    pub seller: Address,
    pub price: i128,                // Price in stroops (XLM)
    pub active: bool,
}

/// Contract errors
#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq, PartialOrd, Ord)]
#[repr(u32)]
pub enum Error {
    AlreadyInitialized = 1,
    NotInitialized = 2,
    Unauthorized = 3,
    NotVerifier = 4,
    CreditNotFound = 5,
    AlreadyVerified = 6,
    AlreadyRetired = 7,
    NotOwner = 8,
    ListingNotActive = 9,
    InsufficientPayment = 10,
    InvalidQuantity = 11,
}

/// Events for contract actions
#[contracttype]
pub enum CarbonXEvent {
    Initialized(Address),
    VerifierAdded(Address),
    CreditRegistered(u64, String),
    CreditVerified(u64, Address),
    CreditListed(u64, i128),
    CreditSold(u64, Address, Address, i128),
    CreditRetired(u64, Address),
}

#[contract]
pub struct CarbonXContract;

#[contractimpl]
impl CarbonXContract {
    /// Initialize the contract with an admin address
    /// Can only be called once
    pub fn initialize(env: Env, admin: Address) -> Result<(), Error> {
        if env.storage().instance().has(&DataKey::Admin) {
            return Err(Error::AlreadyInitialized);
        }

        admin.require_auth();

        // Set admin
        env.storage().instance().set(&DataKey::Admin, &admin);
        
        // Initialize next credit ID counter
        env.storage().instance().set(&DataKey::NextCreditId, &1u64);
        
        // Initialize empty verifiers list
        let verifiers: Vec<Address> = Vec::new(&env);
        env.storage().instance().set(&DataKey::Verifiers, &verifiers);
        
        // Initialize empty retired credits list
        let retired: Vec<u64> = Vec::new(&env);
        env.storage().instance().set(&DataKey::RetiredCredits, &retired);

        // Emit initialization event
        env.events().publish((symbol_short!("init"),), CarbonXEvent::Initialized(admin));

        Ok(())
    }

    /// Add a whitelisted verifier (admin only)
    pub fn add_verifier(env: Env, verifier: Address) -> Result<(), Error> {
        let admin: Address = env.storage().instance()
            .get(&DataKey::Admin)
            .ok_or(Error::NotInitialized)?;
        
        admin.require_auth();

        let mut verifiers: Vec<Address> = env.storage().instance()
            .get(&DataKey::Verifiers)
            .unwrap_or(Vec::new(&env));
        
        verifiers.push_back(verifier.clone());
        env.storage().instance().set(&DataKey::Verifiers, &verifiers);

        env.events().publish((symbol_short!("verify"),), CarbonXEvent::VerifierAdded(verifier));

        Ok(())
    }

    /// Register a new carbon credit batch (verifier only)
    pub fn register_credit(
        env: Env,
        verifier: Address,
        project_id: String,
        issuer: Address,
        vintage_year: u32,
        region: String,
        quantity: u64,
    ) -> Result<u64, Error> {
        verifier.require_auth();

        // Check if caller is a whitelisted verifier
        let verifiers: Vec<Address> = env.storage().instance()
            .get(&DataKey::Verifiers)
            .ok_or(Error::NotInitialized)?;
        
        if !Self::is_verifier(&env, &verifier, &verifiers) {
            return Err(Error::NotVerifier);
        }

        if quantity == 0 {
            return Err(Error::InvalidQuantity);
        }

        // Get next credit ID
        let credit_id: u64 = env.storage().instance()
            .get(&DataKey::NextCreditId)
            .unwrap_or(1u64);

        // Create new carbon credit
        let credit = CarbonCredit {
            id: credit_id,
            project_id: project_id.clone(),
            issuer: issuer.clone(),
            verifier: verifier.clone(),
            vintage_year,
            region,
            quantity,
            verified: false,
            retired: false,
            owner: issuer,
        };

        // Store credit
        env.storage().instance().set(&DataKey::Credit(credit_id), &credit);
        
        // Increment credit ID counter
        env.storage().instance().set(&DataKey::NextCreditId, &(credit_id + 1));

        env.events().publish((symbol_short!("register"),), CarbonXEvent::CreditRegistered(credit_id, project_id));

        Ok(credit_id)
    }

    /// Verify a registered carbon credit (verifier only)
    pub fn verify_credit(env: Env, verifier: Address, credit_id: u64) -> Result<(), Error> {
        verifier.require_auth();

        // Check if caller is a whitelisted verifier
        let verifiers: Vec<Address> = env.storage().instance()
            .get(&DataKey::Verifiers)
            .ok_or(Error::NotInitialized)?;
        
        if !Self::is_verifier(&env, &verifier, &verifiers) {
            return Err(Error::NotVerifier);
        }

        // Get credit
        let mut credit: CarbonCredit = env.storage().instance()
            .get(&DataKey::Credit(credit_id))
            .ok_or(Error::CreditNotFound)?;

        if credit.verified {
            return Err(Error::AlreadyVerified);
        }

        // Mark as verified
        credit.verified = true;
        env.storage().instance().set(&DataKey::Credit(credit_id), &credit);

        env.events().publish((symbol_short!("verified"),), CarbonXEvent::CreditVerified(credit_id, verifier));

        Ok(())
    }

    /// List a verified carbon credit for sale on the marketplace
    pub fn list_for_sale(env: Env, owner: Address, credit_id: u64, price: i128) -> Result<(), Error> {
        owner.require_auth();

        // Get credit
        let credit: CarbonCredit = env.storage().instance()
            .get(&DataKey::Credit(credit_id))
            .ok_or(Error::CreditNotFound)?;

        // Check ownership
        if credit.owner != owner {
            return Err(Error::NotOwner);
        }

        // Check if verified and not retired
        if !credit.verified {
            return Err(Error::Unauthorized);
        }
        
        if credit.retired {
            return Err(Error::AlreadyRetired);
        }

        // Create listing
        let listing = MarketListing {
            credit_id,
            seller: owner,
            price,
            active: true,
        };

        env.storage().instance().set(&DataKey::Listing(credit_id), &listing);

        env.events().publish((symbol_short!("listed"),), CarbonXEvent::CreditListed(credit_id, price));

        Ok(())
    }

    /// Purchase a listed carbon credit
    pub fn buy_credit(env: Env, buyer: Address, credit_id: u64) -> Result<(), Error> {
        buyer.require_auth();

        // Get listing
        let mut listing: MarketListing = env.storage().instance()
            .get(&DataKey::Listing(credit_id))
            .ok_or(Error::ListingNotActive)?;

        if !listing.active {
            return Err(Error::ListingNotActive);
        }

        // Get credit
        let mut credit: CarbonCredit = env.storage().instance()
            .get(&DataKey::Credit(credit_id))
            .ok_or(Error::CreditNotFound)?;

        if credit.retired {
            return Err(Error::AlreadyRetired);
        }

        // Transfer ownership
        let seller = credit.owner.clone();
        credit.owner = buyer.clone();
        env.storage().instance().set(&DataKey::Credit(credit_id), &credit);

        // Deactivate listing
        listing.active = false;
        env.storage().instance().set(&DataKey::Listing(credit_id), &listing);

        env.events().publish(
            (symbol_short!("sold"),),
            CarbonXEvent::CreditSold(credit_id, seller, buyer, listing.price)
        );

        Ok(())
    }

    /// Retire a carbon credit (makes it permanently non-transferable)
    pub fn retire_credit(env: Env, owner: Address, credit_id: u64) -> Result<(), Error> {
        owner.require_auth();

        // Get credit
        let mut credit: CarbonCredit = env.storage().instance()
            .get(&DataKey::Credit(credit_id))
            .ok_or(Error::CreditNotFound)?;

        // Check ownership
        if credit.owner != owner {
            return Err(Error::NotOwner);
        }

        if credit.retired {
            return Err(Error::AlreadyRetired);
        }

        // Mark as retired
        credit.retired = true;
        env.storage().instance().set(&DataKey::Credit(credit_id), &credit);

        // Add to retired credits list
        let mut retired: Vec<u64> = env.storage().instance()
            .get(&DataKey::RetiredCredits)
            .unwrap_or(Vec::new(&env));
        retired.push_back(credit_id);
        env.storage().instance().set(&DataKey::RetiredCredits, &retired);

        // Deactivate any active listing
        if let Some(mut listing) = env.storage().instance().get::<DataKey, MarketListing>(&DataKey::Listing(credit_id)) {
            listing.active = false;
            env.storage().instance().set(&DataKey::Listing(credit_id), &listing);
        }

        env.events().publish((symbol_short!("retired"),), CarbonXEvent::CreditRetired(credit_id, owner));

        Ok(())
    }

    /// Get carbon credit details
    pub fn get_credit(env: Env, credit_id: u64) -> Result<CarbonCredit, Error> {
        env.storage().instance()
            .get(&DataKey::Credit(credit_id))
            .ok_or(Error::CreditNotFound)
    }

    /// Get marketplace listing details
    pub fn get_listing(env: Env, credit_id: u64) -> Result<MarketListing, Error> {
        env.storage().instance()
            .get(&DataKey::Listing(credit_id))
            .ok_or(Error::ListingNotActive)
    }

    /// Get all retired credit IDs
    pub fn get_retired_credits(env: Env) -> Vec<u64> {
        env.storage().instance()
            .get(&DataKey::RetiredCredits)
            .unwrap_or(Vec::new(&env))
    }

    /// Check if address is admin
    pub fn is_admin(env: Env, address: Address) -> bool {
        if let Some(admin) = env.storage().instance().get::<DataKey, Address>(&DataKey::Admin) {
            admin == address
        } else {
            false
        }
    }

    /// Helper: Check if address is a whitelisted verifier
    fn is_verifier(_env: &Env, address: &Address, verifiers: &Vec<Address>) -> bool {
        for i in 0..verifiers.len() {
            if let Some(v) = verifiers.get(i) {
                if &v == address {
                    return true;
                }
            }
        }
        false
    }
}

#[cfg(test)]
mod test {
    use super::*;
    use soroban_sdk::{Env, testutils::Address as _};

    #[test]
    fn test_initialization() {
        let env = Env::default();
        let contract_id = env.register_contract(None, CarbonXContract);
        let client = CarbonXContractClient::new(&env, &contract_id);
        
        let admin = Address::generate(&env);
        env.mock_all_auths();

        client.initialize(&admin);
        assert!(client.is_admin(&admin));
    }

    #[test]
    fn test_add_verifier() {
        let env = Env::default();
        let contract_id = env.register_contract(None, CarbonXContract);
        let client = CarbonXContractClient::new(&env, &contract_id);
        
        let admin = Address::generate(&env);
        let verifier = Address::generate(&env);
        env.mock_all_auths();

        client.initialize(&admin);
        client.add_verifier(&verifier);
    }

    #[test]
    fn test_register_and_verify_credit() {
        let env = Env::default();
        let contract_id = env.register_contract(None, CarbonXContract);
        let client = CarbonXContractClient::new(&env, &contract_id);
        
        let admin = Address::generate(&env);
        let verifier = Address::generate(&env);
        let issuer = Address::generate(&env);
        env.mock_all_auths();

        // Initialize and add verifier
        client.initialize(&admin);
        client.add_verifier(&verifier);

        // Register credit
        let project_id = String::from_str(&env, "PROJECT-001");
        let region = String::from_str(&env, "Brazil");
        let credit_id = client.register_credit(
            &verifier,
            &project_id,
            &issuer,
            &2024u32,
            &region,
            &100u64
        );

        assert_eq!(credit_id, 1);

        // Verify credit
        client.verify_credit(&verifier, &credit_id);

        // Check credit details
        let credit = client.get_credit(&credit_id);
        assert_eq!(credit.id, 1);
        assert_eq!(credit.quantity, 100);
        assert!(credit.verified);
        assert!(!credit.retired);
    }

    #[test]
    fn test_marketplace_listing_and_purchase() {
        let env = Env::default();
        let contract_id = env.register_contract(None, CarbonXContract);
        let client = CarbonXContractClient::new(&env, &contract_id);
        
        let admin = Address::generate(&env);
        let verifier = Address::generate(&env);
        let seller = Address::generate(&env);
        let buyer = Address::generate(&env);
        env.mock_all_auths();

        // Setup: Initialize, add verifier, register and verify credit
        client.initialize(&admin);
        client.add_verifier(&verifier);

        let project_id = String::from_str(&env, "PROJECT-002");
        let region = String::from_str(&env, "Kenya");
        let credit_id = client.register_credit(
            &verifier,
            &project_id,
            &seller,
            &2024u32,
            &region,
            &50u64
        );
        client.verify_credit(&verifier, &credit_id);

        // List for sale
        let price = 1000000i128; // 0.1 XLM in stroops
        client.list_for_sale(&seller, &credit_id, &price);

        let listing = client.get_listing(&credit_id);
        assert_eq!(listing.price, price);
        assert!(listing.active);

        // Buy credit
        client.buy_credit(&buyer, &credit_id);

        // Verify ownership changed
        let credit = client.get_credit(&credit_id);
        assert_eq!(credit.owner, buyer);

        // Verify listing is no longer active
        let listing = client.get_listing(&credit_id);
        assert!(!listing.active);
    }

    #[test]
    fn test_retire_credit() {
        let env = Env::default();
        let contract_id = env.register_contract(None, CarbonXContract);
        let client = CarbonXContractClient::new(&env, &contract_id);
        
        let admin = Address::generate(&env);
        let verifier = Address::generate(&env);
        let owner = Address::generate(&env);
        env.mock_all_auths();

        // Setup
        client.initialize(&admin);
        client.add_verifier(&verifier);

        let project_id = String::from_str(&env, "PROJECT-003");
        let region = String::from_str(&env, "India");
        let credit_id = client.register_credit(
            &verifier,
            &project_id,
            &owner,
            &2023u32,
            &region,
            &200u64
        );
        client.verify_credit(&verifier, &credit_id);

        // Retire credit
        client.retire_credit(&owner, &credit_id);

        // Verify retired
        let credit = client.get_credit(&credit_id);
        assert!(credit.retired);

        // Check retired credits list
        let retired_credits = client.get_retired_credits();
        assert_eq!(retired_credits.len(), 1);
        assert_eq!(retired_credits.get(0).unwrap(), credit_id);
    }

    #[test]
    fn test_unauthorized_verifier() {
        let env = Env::default();
        let contract_id = env.register_contract(None, CarbonXContract);
        let client = CarbonXContractClient::new(&env, &contract_id);
        
        let admin = Address::generate(&env);
        let unauthorized = Address::generate(&env);
        let issuer = Address::generate(&env);
        env.mock_all_auths();

        client.initialize(&admin);

        // Try to register credit without being a verifier - should return Error::NotVerifier
        let project_id = String::from_str(&env, "PROJECT-004");
        let region = String::from_str(&env, "China");
        let result = client.try_register_credit(
            &unauthorized,
            &project_id,
            &issuer,
            &2024u32,
            &region,
            &100u64
        );
        
        assert_eq!(result, Err(Ok(Error::NotVerifier)));
    }

    #[test]
    fn test_non_owner_cannot_retire() {
        let env = Env::default();
        let contract_id = env.register_contract(None, CarbonXContract);
        let client = CarbonXContractClient::new(&env, &contract_id);
        
        let admin = Address::generate(&env);
        let verifier = Address::generate(&env);
        let owner = Address::generate(&env);
        let attacker = Address::generate(&env);
        env.mock_all_auths();

        client.initialize(&admin);
        client.add_verifier(&verifier);

        let project_id = String::from_str(&env, "PROJECT-005");
        let region = String::from_str(&env, "USA");
        let credit_id = client.register_credit(
            &verifier,
            &project_id,
            &owner,
            &2024u32,
            &region,
            &75u64
        );
        client.verify_credit(&verifier, &credit_id);

        // Try to retire someone else's credit - should return Error::NotOwner
        let result = client.try_retire_credit(&attacker, &credit_id);
        
        assert_eq!(result, Err(Ok(Error::NotOwner)));
    }
}
