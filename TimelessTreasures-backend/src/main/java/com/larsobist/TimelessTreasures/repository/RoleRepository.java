package com.larsobist.TimelessTreasures.repository;

import com.larsobist.TimelessTreasures.models.ERole;
import com.larsobist.TimelessTreasures.models.Role;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface RoleRepository extends MongoRepository<Role, String> {
    // Custom query method to find a role by its name.
    Optional<Role> findByName(ERole name);
}
