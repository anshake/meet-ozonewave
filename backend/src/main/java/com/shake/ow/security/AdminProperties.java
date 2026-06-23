package com.shake.ow.security;

import jakarta.validation.constraints.NotBlank;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

/**
 * Single-owner admin credentials, supplied via {@code OW_ADMIN_USERNAME} / {@code OW_ADMIN_PASSWORD}.
 * Both are required — the application refuses to start if either is missing.
 *
 * <p>{@code OW_ADMIN_PASSWORD} holds a <em>hashed</em> password carrying its encoder id prefix,
 * e.g. {@code {bcrypt}$2a$12$...}, so the cleartext password never lives in the environment.
 * Generate one with: {@code htpasswd -bnBC 12 "" 'your-password' | tr -d ':\n'} (prefix it with
 * {@code {bcrypt}}).
 */
@Validated
@ConfigurationProperties("ow.admin")
public record AdminProperties(@NotBlank String username, @NotBlank String password) {
}
