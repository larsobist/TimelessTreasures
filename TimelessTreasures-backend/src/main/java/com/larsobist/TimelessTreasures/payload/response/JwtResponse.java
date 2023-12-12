package com.larsobist.TimelessTreasures.payload.response;


import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class JwtResponse {
    private String token;
    // Represents the JWT access token generated upon successful authentication.

    private String type = "Bearer";
    // Represents the token type. In this case, it is "Bearer" for JWT.

    private String id;
    // Represents the user ID associated with the authenticated user.

    private String username;
    // Represents the username of the authenticated user.

    private String email;
    // Represents the email address of the authenticated user.

    private List<String> roles;
    // Represents the list of roles associated with the authenticated user.

    public JwtResponse(String accessToken, String id, String username, String email, List<String> roles) {
        this.token = accessToken;
        this.id = id;
        this.username = username;
        this.email = email;
        this.roles = roles;
    }
}