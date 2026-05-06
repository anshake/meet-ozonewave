package com.shake.ow.command;

import java.util.List;

import org.springframework.stereotype.Component;

import com.shake.ow.ai.ChatService;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class ContactCommandHandler implements CommandHandler {

    private final ChatService chatService;
    private final CommandDescriptor descriptor = new CommandDescriptor("contact", "show contact details", List.of());

    @Override
    public CommandDescriptor commandDesc() {
        return this.descriptor;
    }

    @Override
    public CommandResult handle(String arg, String conversationId, String tone) {
        final var reply = chatService.chat("how can I contact you?", conversationId, tone);
        return new CommandResult(reply);
    }
}
