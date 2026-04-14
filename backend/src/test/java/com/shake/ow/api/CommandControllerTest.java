package com.shake.ow.api;

import static org.hamcrest.Matchers.containsString;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import com.shake.ow.ai.ChatService;
import com.shake.ow.command.CommandRegistry;
import com.shake.ow.command.ContactCommandHandler;
import com.shake.ow.command.ToneCommandHandler;
import com.shake.ow.command.ToneRegistry;

@WebMvcTest(CommandController.class)
@Import({CommandRegistry.class, ToneRegistry.class, ToneCommandHandler.class, ContactCommandHandler.class})
class CommandControllerTest {

    @Autowired
    MockMvc mockMvc;

    @MockitoBean
    ChatService chatService;

    @Test
    void list_returnsAllDescriptors() throws Exception {
        mockMvc.perform(get("/api/commands"))
               .andExpect(status().isOk())
               .andExpect(jsonPath("$[0].command").value("tone"))
               .andExpect(jsonPath("$[1].command").value("contact"));
    }

    @Test
    void execute_toneCommand_validArg_returns200WithCookie() throws Exception {
        mockMvc.perform(post("/api/commands")
                       .contentType(MediaType.APPLICATION_JSON)
                       .header("ConversationId", "conv-1")
                       .content("""
                               {"command":"tone","arg":"casual"}
                               """))
               .andExpect(status().isOk())
               .andExpect(jsonPath("$.message").value("tone set to casual"))
               .andExpect(header().exists("Set-Cookie"));
    }

    @Test
    void execute_toneCommand_invalidArg_returns200WithErrorMessage() throws Exception {
        mockMvc.perform(post("/api/commands")
                       .contentType(MediaType.APPLICATION_JSON)
                       .header("ConversationId", "conv-1")
                       .content("""
                               {"command":"tone","arg":"robot"}
                               """))
               .andExpect(status().isOk())
               .andExpect(jsonPath("$.message").value(containsString("Unknown tone")))
               .andExpect(header().doesNotExist("Set-Cookie"));
    }

    @Test
    void execute_contactCommand_returns200WithChatServiceReply() throws Exception {
        when(chatService.chat(any(), any(), any())).thenReturn("You can reach me at test@example.com");

        mockMvc.perform(post("/api/commands")
                       .contentType(MediaType.APPLICATION_JSON)
                       .header("ConversationId", "conv-1")
                       .content("""
                               {"command":"contact","arg":""}
                               """))
               .andExpect(status().isOk())
               .andExpect(jsonPath("$.message").value("You can reach me at test@example.com"));
    }

    @Test
    void execute_contactCommand_missingToneHeader_usesEmptyDefault() throws Exception {
        when(chatService.chat(any(), any(), any())).thenReturn("Here are my details");

        mockMvc.perform(post("/api/commands")
                       .contentType(MediaType.APPLICATION_JSON)
                       .header("ConversationId", "conv-1")
                       // X-Tone deliberately omitted
                       .content("""
                               {"command":"contact","arg":""}
                               """))
               .andExpect(status().isOk())
               .andExpect(jsonPath("$.message").value("Here are my details"));
    }

    @Test
    void execute_unknownCommand_returns400WithErrorMessage() throws Exception {
        mockMvc.perform(post("/api/commands")
                       .contentType(MediaType.APPLICATION_JSON)
                       .header("ConversationId", "conv-1")
                       .content("""
                               {"command":"bogus","arg":""}
                               """))
               .andExpect(status().isBadRequest())
               .andExpect(jsonPath("$.message").value(containsString("bogus")));
    }
}