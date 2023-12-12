package com.larsobist.TimelessTreasures.payload.request;

import lombok.Getter;
import lombok.Setter;

import java.util.Set;

@Getter
@Setter
public class SignupRequest {

    private String username;
    // Represents the username provided by the user during registration.

    private String email;
    // Represents the email address provided by the user during registration.

    private Set<String> roles;
    // Represents the set of roles selected by the user during registration.
    // The roles are represented as strings.

    private String password;
    // Represents the password provided by the user during registration.
}
