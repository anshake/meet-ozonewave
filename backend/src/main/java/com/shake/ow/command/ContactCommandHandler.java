package com.shake.ow.command;

import org.springframework.stereotype.Component;

import com.shake.ow.ai.ChatService;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class ContactCommandHandler implements CommandHandler {

    private final ChatService chatService;

    @Override
    public String commandId() {
        return "contact";
    }

    @Override
    public CommandResult handle(String arg, String conversationId, String tone) {
        String reply = chatService.chat("how can I contact you?", conversationId, tone);
        return new CommandResult(reply);
    }
}
