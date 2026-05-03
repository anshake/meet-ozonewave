package com.shake.ow.api;

import org.springframework.http.ResponseCookie;

import lombok.experimental.UtilityClass;

@UtilityClass
public final class Cookies {

    private static final String TONE = "tone";
    private static final String PATH = "/";
    private static final long MAX_AGE_SECONDS = 86400;
    private static final String SAME_SITE = "Lax";

    public static ResponseCookie tone(String tone) {
        return ResponseCookie.from(TONE, tone)
                             .path(PATH)
                             .maxAge(MAX_AGE_SECONDS)
                             .sameSite(SAME_SITE)
                             .build();
    }
}