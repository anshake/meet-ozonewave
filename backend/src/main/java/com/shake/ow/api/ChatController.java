package com.shake.ow.api;

import org.springframework.http.MediaType;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.shake.ow.ai.ChatService;

import jakarta.validation.constraints.Size;
import lombok.RequiredArgsConstructor;

@RestController
@Validated
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;

    @PostMapping(consumes = MediaType.TEXT_PLAIN_VALUE, produces = MediaType.TEXT_PLAIN_VALUE)
    String chat(@RequestBody @Size(min = 1, max = 1014) String message,
            @RequestHeader("ConversationId") String conversationId) {
        return chatService.chat(message, conversationId);
    }

}
