package com.shake.ow.api;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.shake.ow.ai.ChatService;
import com.shake.ow.command.ToneRegistry;

import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.constraints.Size;
import lombok.RequiredArgsConstructor;
import reactor.core.publisher.Flux;

@RestController
@Validated
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;
    private final ToneRegistry toneRegistry;

    @PostMapping(consumes = MediaType.TEXT_PLAIN_VALUE, produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    Flux<String> chat(@RequestBody @Size(min = 1, max = 1014) String message,
            @RequestHeader("ConversationId") String conversationId,
            @RequestHeader(value = "X-Tone", required = false, defaultValue = "") String tone,
            HttpServletResponse response) {
        final var resolvedTone = toneRegistry.resolveOrDefault(tone).id();
        response.addHeader(HttpHeaders.SET_COOKIE, Cookies.tone(resolvedTone).toString());
        return chatService.stream(message, conversationId, resolvedTone);
    }
}
