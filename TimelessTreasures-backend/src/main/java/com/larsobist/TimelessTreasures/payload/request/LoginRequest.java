package com.larsobist.TimelessTreasures.payload.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LoginRequest {

    private String username;
    // Represents the username provided by the user during login.

    private String password;
    // Represents the password provided by the user during login.
}
