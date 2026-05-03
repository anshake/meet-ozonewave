package com.shake.ow.command;

import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

import com.shake.ow.api.Cookies;

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
        return toneRegistry.find(arg)
                           .map(descr -> new CommandResult("tone set to " + descr.id(), Cookies.tone(descr.id())))
                           .orElseGet(() -> {
                               var valid = toneRegistry.toToneParams().stream()
                                                          .map(CommandParameter::parameter)
                                                          .collect(Collectors.joining(", "));
                               return new CommandResult("Unknown tone: '%s'. Valid options: %s.".formatted(arg, valid));
                           });
    }
}
