package com.larsobist.TimelessTreasures.repository;

import com.larsobist.TimelessTreasures.models.User;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface UserRepository extends MongoRepository<User, String> {
    // Custom query method to find a user by their username.
    Optional<User> findByUsername(String username);

    // Custom query method to check if a user with a given username exists in the database.
    Boolean existsByUsername(String username);

    // Custom query method to check if a user with a given email exists in the database.
    Boolean existsByEmail(String email);
}
