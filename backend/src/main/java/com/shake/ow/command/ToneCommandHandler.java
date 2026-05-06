package com.shake.ow.command;

import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

import com.shake.ow.api.Cookies;

@Component
public class ToneCommandHandler implements CommandHandler {

    private final ToneRegistry toneRegistry;
    private final CommandDescriptor commandDescriptor;

    public ToneCommandHandler(ToneRegistry toneRegistry) {
        this.toneRegistry = toneRegistry;
        this.commandDescriptor = new CommandDescriptor("tone", "set response tone", toneRegistry.toToneParams());
    }

    @Override
    public CommandDescriptor commandDesc() {
        return commandDescriptor;
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
