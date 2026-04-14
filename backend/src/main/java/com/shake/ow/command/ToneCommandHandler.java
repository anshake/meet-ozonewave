package com.shake.ow.command;

import java.util.stream.Collectors;

import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class ToneCommandHandler implements CommandHandler {

    private final ToneRegistry toneRegistry;

    @Override
    public String commandId() {
        return "tone";
    }

    @Override
    public CommandResult handle(String arg, String conversationId, String tone) {
        if (toneRegistry.find(arg).isEmpty()) {
            String valid = toneRegistry.toToneParams().stream()
                                       .map(CommandParameter::parameter)
                                       .collect(Collectors.joining(", "));
            return new CommandResult("Unknown tone: '%s'. Valid options: %s.".formatted(arg, valid));
        }
        ResponseCookie cookie = ResponseCookie.from("tone", arg)
                                              .path("/")
                                              .maxAge(86400)
                                              .sameSite("Lax")
                                              .build();
        return new CommandResult("tone set to " + arg, cookie);
    }
}
