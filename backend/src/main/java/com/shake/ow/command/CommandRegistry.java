package com.shake.ow.command;

import static java.util.function.Function.identity;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;
import org.springframework.web.util.HtmlUtils;

@Component
public class CommandRegistry {

    private final List<CommandDescriptor> descriptors;
    private final Map<String, CommandHandler> handlers;

    public CommandRegistry(ToneRegistry toneRegistry, List<CommandHandler> handlers) {
        this.descriptors = List.of(
                new CommandDescriptor("tone", "set response tone", toneRegistry.toToneParams()),
                new CommandDescriptor("contact", "show contact details", List.of())
        );
        this.handlers = handlers.stream()
                                .collect(Collectors.toMap(CommandHandler::commandId, identity()));
    }

    public List<CommandDescriptor> getAll() {
        return descriptors;
    }

    public CommandHandler find(String commandId) {
        final var escapedCommandId = HtmlUtils.htmlEscape(commandId);
        CommandHandler handler = handlers.get(escapedCommandId);
        if (handler == null) {
            throw new IllegalArgumentException("Unknown command: " + escapedCommandId);
        }
        return handler;
    }
}
