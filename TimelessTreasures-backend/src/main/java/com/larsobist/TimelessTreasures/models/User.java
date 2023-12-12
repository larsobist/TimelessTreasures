package com.larsobist.TimelessTreasures.models;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@Document(collection = "users")
public class User {

    @Id
    private String userId;

    private String username;
    // Required: The username of the user.

    private String email;
    // Required: The email address of the user.

    private String password;
    // Required: The password of the user.

    @DBRef
    private Set<Role> roles = new HashSet<>();
    // Represents the roles associated with the user.
    // The roles are stored as references to the Role collection in MongoDB.

    // Constructor to create a User object with the provided username, email, and password
    public User(String username, String email, String password) {
        this.username = username;
        this.email = email;
        this.password = password;
    }
}
