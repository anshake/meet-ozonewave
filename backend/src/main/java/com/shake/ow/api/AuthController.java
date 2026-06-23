package com.shake.ow.api;

import java.security.Principal;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Login and logout are handled by the Spring Security filter chain
 * ({@code /api/auth/login}, {@code /api/auth/logout}). This only exposes the
 * current session so the SPA guard can verify auth on load — an unauthenticated
 * request never reaches here, it is short-circuited with 401 by the filter chain.
 */
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @GetMapping("/me")
    AuthenticatedUser me(Principal principal) {
        return new AuthenticatedUser(principal.getName());
    }

    record AuthenticatedUser(String username) {
    }
}
