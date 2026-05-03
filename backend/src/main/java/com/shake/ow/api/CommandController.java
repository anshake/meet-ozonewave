package com.shake.ow.api;

import java.util.List;

import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.shake.ow.command.CommandDescriptor;
import com.shake.ow.command.CommandRegistry;
import com.shake.ow.command.CommandRequest;
import com.shake.ow.command.CommandResult;

import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/commands")
@RequiredArgsConstructor
public class CommandController {

    private final CommandRegistry cmdRegistry;

    @GetMapping
    List<CommandDescriptor> list() {
        return cmdRegistry.getAll();
    }

    @PostMapping
    ResponseEntity<ChatReply> execute(
            @RequestBody CommandRequest request,
            @RequestHeader("ConversationId") String conversationId,
            @RequestHeader(value = "X-Tone", required = false, defaultValue = "") String tone,
            HttpServletResponse response) {
        CommandResult result = cmdRegistry.find(request.command()).handle(request.arg(), conversationId, tone);
        if (result.cookie() != null) {
            response.addHeader(HttpHeaders.SET_COOKIE, result.cookie().toString());
        }
        return ResponseEntity.ok(new ChatReply(result.message()));
    }
}
