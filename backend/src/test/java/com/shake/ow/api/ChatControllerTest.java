package com.shake.ow.api;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.asyncDispatch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.request;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import com.shake.ow.ai.ChatService;
import com.shake.ow.command.ToneRegistry;

import reactor.core.publisher.Flux;

@WebMvcTest(ChatController.class)
@Import(ToneRegistry.class)
class ChatControllerTest {

    @Autowired
    MockMvc mockMvc;

    @MockitoBean
    ChatService chatService;

    @Test
    void chat_validTone_streamsAndSetsToneCookie() throws Exception {
        when(chatService.stream(any(), any(), any())).thenReturn(Flux.just("hello", " world"));

        MvcResult result = mockMvc.perform(post("/api/chat")
                                          .contentType(MediaType.TEXT_PLAIN)
                                          .header("ConversationId", "conv-1")
                                          .header("X-Tone", "casual")
                                          .content("hi"))
                                  .andExpect(request().asyncStarted())
                                  .andReturn();

        mockMvc.perform(asyncDispatch(result))
               .andExpect(status().isOk())
               .andExpect(header().string("Set-Cookie",
                       org.hamcrest.Matchers.containsString("tone=casual")));

        verify(chatService).stream("hi", "conv-1", "casual");
    }

    @Test
    void chat_missingToneHeader_fallsBackToDefaultTone() throws Exception {
        when(chatService.stream(any(), any(), any())).thenReturn(Flux.just("ok"));

        MvcResult result = mockMvc.perform(post("/api/chat")
                                          .contentType(MediaType.TEXT_PLAIN)
                                          .header("ConversationId", "conv-1")
                                          .content("hello"))
                                  .andExpect(request().asyncStarted())
                                  .andReturn();

        mockMvc.perform(asyncDispatch(result))
               .andExpect(status().isOk())
               .andExpect(header().string("Set-Cookie",
                       org.hamcrest.Matchers.containsString("tone=" + ToneRegistry.DEFAULT_TONE_ID)));

        verify(chatService).stream("hello", "conv-1", ToneRegistry.DEFAULT_TONE_ID);
    }

    @Test
    void chat_unknownTone_fallsBackToDefaultTone() throws Exception {
        when(chatService.stream(any(), any(), any())).thenReturn(Flux.just("ok"));

        MvcResult result = mockMvc.perform(post("/api/chat")
                                          .contentType(MediaType.TEXT_PLAIN)
                                          .header("ConversationId", "conv-1")
                                          .header("X-Tone", "robot")
                                          .content("hello"))
                                  .andExpect(request().asyncStarted())
                                  .andReturn();

        mockMvc.perform(asyncDispatch(result))
               .andExpect(status().isOk())
               .andExpect(header().string("Set-Cookie",
                       org.hamcrest.Matchers.containsString("tone=" + ToneRegistry.DEFAULT_TONE_ID)));

        verify(chatService).stream("hello", "conv-1", ToneRegistry.DEFAULT_TONE_ID);
    }

    @Test
    void chat_missingConversationIdHeader_returnsBadRequest() throws Exception {
        mockMvc.perform(post("/api/chat")
                       .contentType(MediaType.TEXT_PLAIN)
                       .content("hi"))
               .andExpect(status().isBadRequest());
    }

    @Test
    void chat_emptyBody_failsValidation() throws Exception {
        mockMvc.perform(post("/api/chat")
                       .contentType(MediaType.TEXT_PLAIN)
                       .header("ConversationId", "conv-1")
                       .content(""))
               .andExpect(status().is4xxClientError());
    }

    @Test
    void chat_bodyOverMaxSize_failsValidation() throws Exception {
        String tooLong = "x".repeat(4097);

        mockMvc.perform(post("/api/chat")
                       .contentType(MediaType.TEXT_PLAIN)
                       .header("ConversationId", "conv-1")
                       .content(tooLong))
               .andExpect(status().is4xxClientError());
    }

    @Test
    void chat_bodyAtMaxSize_isAccepted() throws Exception {
        when(chatService.stream(any(), any(), any())).thenReturn(Flux.just("ok"));
        String maxBody = "x".repeat(4096);

        MvcResult result = mockMvc.perform(post("/api/chat")
                                          .contentType(MediaType.TEXT_PLAIN)
                                          .header("ConversationId", "conv-1")
                                          .content(maxBody))
                                  .andExpect(request().asyncStarted())
                                  .andReturn();

        mockMvc.perform(asyncDispatch(result))
               .andExpect(status().isOk());
    }

    @Test
    void chat_responseBody_containsStreamedChunks() throws Exception {
        when(chatService.stream(any(), any(), any())).thenReturn(Flux.just("foo", "bar"));

        MvcResult result = mockMvc.perform(post("/api/chat")
                                          .contentType(MediaType.TEXT_PLAIN)
                                          .header("ConversationId", "conv-1")
                                          .header("X-Tone", "casual")
                                          .content("hi"))
                                  .andExpect(request().asyncStarted())
                                  .andReturn();

        String body = mockMvc.perform(asyncDispatch(result))
                             .andExpect(status().isOk())
                             .andReturn()
                             .getResponse()
                             .getContentAsString();

        assertThat(body).contains("foo").contains("bar");
    }

}