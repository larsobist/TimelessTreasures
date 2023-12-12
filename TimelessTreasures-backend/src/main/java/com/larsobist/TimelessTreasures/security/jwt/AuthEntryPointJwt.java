package com.larsobist.TimelessTreasures.security.jwt;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@Component
public class AuthEntryPointJwt implements AuthenticationEntryPoint {
    private static final Logger logger = LoggerFactory.getLogger(AuthEntryPointJwt.class);

    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response,
                         AuthenticationException authException) throws IOException {
        // The commence() method is called when an unauthenticated user attempts to access a protected resource.

        logger.error("Unauthorized error: {}", authException.getMessage());
        // The logger is used to log an error message indicating the unauthorized access attempt.

        response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Error: Unauthorized");
        // The response is sent with a 401 Unauthorized status code and an error message in the body.
    }
}
