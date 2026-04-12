package com.shake.ow.command;

import org.springframework.http.ResponseCookie;

public record CommandResult(String message, ResponseCookie cookie) {

    public CommandResult(String message) {
        this(message, null);
    }
}