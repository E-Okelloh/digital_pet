#[allow(duplicate_alias)]
module digital_pet::pet {
    use sui::object::UID;
    use sui::clock::Clock;
    use sui::event;
    use std::string::String;

    // Pet struct
    public struct Pet has key, store {
        id: UID,
        name: String,
        pet_type: String, // cat, dog, dragon
        level: u64,
        experience: u64,
        hunger: u64,      // 0-100 (0 is starving, 100 is full)
        happiness: u64,   // 0-100
        energy: u64,      // 0-100
        last_fed: u64,    // timestamp
        last_played: u64, // timestamp
        birth_time: u64,
    }

    // Events
    public struct PetMinted has copy, drop {
        pet_id: address,
        owner: address,
        name: String,
        pet_type: String,
    }

    public struct PetFed has copy, drop {
        pet_id: address,
        new_hunger: u64,
    }

    public struct PetPlayed has copy, drop {
        pet_id: address,
        new_happiness: u64,
        experience_gained: u64,
    }

    public struct PetLevelUp has copy, drop {
        pet_id: address,
        new_level: u64,
    }

    // Error codes
    const ENotEnoughEnergy: u64 = 2;

    // Mint a new pet
    public entry fun mint_pet(
        name: String,
        pet_type: String,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        let current_time = clock.timestamp_ms();
        let pet = Pet {
            id: object::new(ctx),
            name,
            pet_type,
            level: 1,
            experience: 0,
            hunger: 80,
            happiness: 80,
            energy: 100,
            last_fed: current_time,
            last_played: current_time,
            birth_time: current_time,
        };

        let sender = ctx.sender();
        let pet_id = object::uid_to_address(&pet.id);

        event::emit(PetMinted {
            pet_id,
            owner: sender,
            name: pet.name,
            pet_type: pet.pet_type,
        });

        transfer::transfer(pet, sender);
    }

    // Feed the pet
    public entry fun feed_pet(
        pet: &mut Pet,
        clock: &Clock,
    ) {
        let current_time = clock.timestamp_ms();
        
        // Update hunger based on time passed
        update_stats(pet, current_time);

        // Feed the pet
        pet.hunger = if (pet.hunger + 30 > 100) { 100 } else { pet.hunger + 30 };
        pet.last_fed = current_time;

        event::emit(PetFed {
            pet_id: object::uid_to_address(&pet.id),
            new_hunger: pet.hunger,
        });
    }

    // Play with the pet
    public entry fun play_with_pet(
        pet: &mut Pet,
        clock: &Clock,
    ) {
        let current_time = clock.timestamp_ms();
        
        // Update stats based on time passed
        update_stats(pet, current_time);

        // Check if pet has energy
        assert!(pet.energy >= 20, ENotEnoughEnergy);

        // Play with pet
        pet.happiness = if (pet.happiness + 25 > 100) { 100 } else { pet.happiness + 25 };
        pet.energy = pet.energy - 20;
        pet.hunger = if (pet.hunger < 10) { 0 } else { pet.hunger - 10 };
        pet.last_played = current_time;

        // Gain experience
        let exp_gained = 15;
        pet.experience = pet.experience + exp_gained;

        // Check for level up
        let exp_needed = pet.level * 100;
        if (pet.experience >= exp_needed) {
            pet.level = pet.level + 1;
            pet.experience = pet.experience - exp_needed;
            
            event::emit(PetLevelUp {
                pet_id: object::uid_to_address(&pet.id),
                new_level: pet.level,
            });
        };

        event::emit(PetPlayed {
            pet_id: object::uid_to_address(&pet.id),
            new_happiness: pet.happiness,
            experience_gained: exp_gained,
        });
    }

    // Rest to restore energy
    public entry fun rest_pet(
        pet: &mut Pet,
        clock: &Clock,
    ) {
        let current_time = clock.timestamp_ms();
        update_stats(pet, current_time);
        
        pet.energy = 100;
    }

    // Helper function to update stats based on time
    fun update_stats(pet: &mut Pet, current_time: u64) {
        // Decay hunger over time (1 point per 5 minutes)
        let time_since_fed = (current_time - pet.last_fed) / 1000 / 60; // minutes
        let hunger_decay = time_since_fed / 5;
        pet.hunger = if (pet.hunger < hunger_decay) { 0 } else { pet.hunger - hunger_decay };

        // Decay happiness over time (1 point per 10 minutes)
        let time_since_played = (current_time - pet.last_played) / 1000 / 60; // minutes
        let happiness_decay = time_since_played / 10;
        pet.happiness = if (pet.happiness < happiness_decay) { 0 } else { pet.happiness - happiness_decay };

        // Energy recovers slowly (1 point per 3 minutes)
        let energy_recovery = time_since_played / 3;
        pet.energy = if (pet.energy + energy_recovery > 100) { 100 } else { pet.energy + energy_recovery };
    }
}