package com.shake.ow.ai;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.memory.ChatMemory;
import org.springframework.stereotype.Service;
import org.springframework.web.util.HtmlUtils;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final ChatClient chatClient;

    public String chat(String message, String conversationId) {
        String sanitizedMessage = HtmlUtils.htmlEscape(
                message.replaceAll("<[^>]*>", "")
        );

        return chatClient.prompt()
                         .user(sanitizedMessage)
                         .advisors(a -> a.param(ChatMemory.CONVERSATION_ID, conversationId))
                         .call()
                         .content();
    }
}
