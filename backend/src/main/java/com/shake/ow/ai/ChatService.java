package com.shake.ow.ai;

import java.nio.charset.StandardCharsets;
import java.util.UUID;

import org.jspecify.annotations.NonNull;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.memory.ChatMemory;
import org.springframework.stereotype.Service;

import com.shake.ow.command.ToneRegistry;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import reactor.core.publisher.Flux;

@Slf4j
@Service
@RequiredArgsConstructor
public class ChatService {

    private final ChatClient chatClient;
    private final ToneRegistry toneRegistry;
    private final SystemPromptFactory systemPromptFactory;

    public String chat(String message, String conversationId, String tone) {
        log.debug("Chat: {} (tone: {})", message, tone);
        final var content = prepareCall(message, conversationId, tone).call().content();
        log.debug("Chat reply: {}", content);
        return content;
    }

    public Flux<String> stream(String message, String conversationId, String tone) {
        log.debug("Stream: {} (tone: {})", message, tone);
        return prepareCall(message, conversationId, tone).stream().content();
    }

    private ChatClient.@NonNull ChatClientRequestSpec prepareCall(String message, String conversationId,
            String tone) {
        final var toneDescriptor = toneRegistry.resolveOrDefault(tone);
        return chatClient.prompt()
                         .user(message)
                         .system(systemPromptFactory.render(toneDescriptor.prompt()))
                         .advisors(a -> a.param(ChatMemory.CONVERSATION_ID,
                                 UUID.nameUUIDFromBytes((conversationId + ":" + toneDescriptor.id()).getBytes(StandardCharsets.UTF_8)).toString()));
    }

}
