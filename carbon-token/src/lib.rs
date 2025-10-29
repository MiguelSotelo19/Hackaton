#![no_std]
use soroban_sdk::{contract, contractimpl, Address, Env, Symbol, symbol_short};

const CARBON: Symbol = symbol_short!("CARBON");
const ADMIN: Symbol = symbol_short!("ADMIN");

#[contract]
pub struct CarbonToken;

#[contractimpl]
impl CarbonToken {
    
    // Inicializar contrato con admin
    pub fn initialize(env: Env, admin: Address) {
        admin.require_auth();
        env.storage().instance().set(&ADMIN, &admin);
    }
    
    // Mintear tokens (solo admin)
    pub fn mint(env: Env, to: Address, amount: i128) {
        let admin: Address = env.storage().instance().get(&ADMIN).unwrap();
        admin.require_auth();
        
        let key = (CARBON, to.clone());
        let balance: i128 = env.storage().persistent().get(&key).unwrap_or(0);
        let new_balance = balance + amount;
        env.storage().persistent().set(&key, &new_balance);
    }
    
    // Transferir tokens
    pub fn transfer(env: Env, from: Address, to: Address, amount: i128) {
        from.require_auth();
        
        // Restar de from
        let from_key = (CARBON, from.clone());
        let from_balance: i128 = env.storage().persistent().get(&from_key).unwrap_or(0);
        
        if from_balance < amount {
            panic!("Insufficient balance");
        }
        
        let new_from = from_balance - amount;
        env.storage().persistent().set(&from_key, &new_from);
        
        // Sumar a to
        let to_key = (CARBON, to.clone());
        let to_balance: i128 = env.storage().persistent().get(&to_key).unwrap_or(0);
        let new_to = to_balance + amount;
        env.storage().persistent().set(&to_key, &new_to);
    }
    
    // Ver balance
    pub fn balance(env: Env, account: Address) -> i128 {
        let key = (CARBON, account);
        env.storage().persistent().get(&key).unwrap_or(0)
    }
    
    // Mintear badge
    pub fn mint_badge(env: Env, to: Address, badge_type: Symbol) {
        let admin: Address = env.storage().instance().get(&ADMIN).unwrap();
        admin.require_auth();
        
        let key = (symbol_short!("BADGE"), to, badge_type);
        env.storage().persistent().set(&key, &true);
    }
    
    // Ver si tiene badge
    pub fn has_badge(env: Env, account: Address, badge_type: Symbol) -> bool {
        let key = (symbol_short!("BADGE"), account, badge_type);
        env.storage().persistent().get(&key).unwrap_or(false)
    }
}

#[cfg(test)]
mod test {
    use super::*;
    use soroban_sdk::{Env, Address};
    
    #[test]
    fn test_basic() {
        let env = Env::default();
        let contract_id = env.register_contract(None, CarbonToken);
        let client = CarbonTokenClient::new(&env, &contract_id);
        
        let admin = Address::generate(&env);
        let user = Address::generate(&env);
        
        env.mock_all_auths();
        
        client.initialize(&admin);
        client.mint(&user, &100);
        
        assert_eq!(client.balance(&user), 100);
    }
}