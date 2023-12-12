package com.larsobist.TimelessTreasures.models;

import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@NoArgsConstructor
@Document(collection = "roles")
public class Role {
    @Id
    private String id;
    private ERole name;

    // Collection name for MongoDB
    // The documents of this class will be stored in the "roles" collection.

    // Constructor to create a Role object with a given name
    public Role(ERole name) {
        this.name = name;
    }

    // Getter method for retrieving the ID of the role
    public String getId() {
        return id;
    }

    // Setter method to update the ID of the role
    public void setId(String id) {
        this.id = id;
    }

    // Getter method for retrieving the name of the role
    public ERole getName() {
        return name;
    }

    // Setter method to update the name of the role
    public void setName(ERole name) {
        this.name = name;
    }
}
