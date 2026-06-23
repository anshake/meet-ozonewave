package com.shake.ow.security;

import jakarta.validation.constraints.NotBlank;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

/**
 * Single-owner admin credentials, supplied via {@code OW_ADMIN_USERNAME} / {@code OW_ADMIN_PASSWORD}.
 * Both are required — the application refuses to start if {@code OW_ADMIN_PASSWORD} is missing.
 */
@Validated
@ConfigurationProperties("ow.admin")
public record AdminProperties(@NotBlank String username, @NotBlank String password) {
}
