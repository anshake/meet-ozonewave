package com.shake.ow.service;

import java.util.List;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import com.shake.ow.ai.SystemPromptFactory;
import com.shake.ow.ai.ToolCallTrace;
import com.shake.ow.ai.ToolProperties;
import com.shake.ow.command.ToneRegistry;
import com.shake.ow.model.RetrievalTestResponse;

import lombok.extern.slf4j.Slf4j;

/**
 * Runs the live assistant for a single query and reports back which entries each tool placed into the
 * prompt. Drives the same path production uses (same tools + system prompt) but statelessly, on a blocking
 * call so the {@link ToolCallTrace} captures tool output on the request thread.
 */
@Slf4j
@Service
public class RetrievalTestService {

    // Explicit constructor (not Lombok) so @Qualifier reliably selects the stateless, memory-less client
    // over the @Primary conversationChatClient — Lombok does not copy @Qualifier onto the constructor here.
    private final ChatClient testChatClient;
    private final ToolCallTrace trace;
    private final SystemPromptFactory systemPromptFactory;
    private final ToolProperties toolProperties;
    private final ToneRegistry toneRegistry;

    public RetrievalTestService(@Qualifier("testChatClient") ChatClient testChatClient,
            ToolCallTrace trace, SystemPromptFactory systemPromptFactory,
            ToolProperties toolProperties, ToneRegistry toneRegistry) {
        this.testChatClient = testChatClient;
        this.trace = trace;
        this.systemPromptFactory = systemPromptFactory;
        this.toolProperties = toolProperties;
        this.toneRegistry = toneRegistry;
    }

    public RetrievalTestResponse test(String query) {
        log.debug("Test embeddings query: {}", query);

        // Neutral tone for evaluation — the live default is a comedic persona, unhelpful for judging retrieval.
        final var tone = toneRegistry.resolveOrDefault("professional");

        trace.start();
        try {
            final var answer = testChatClient.prompt()
                                             .user(query)
                                             .system(systemPromptFactory.render(tone.prompt()))
                                             .call()
                                             .content();
            return new RetrievalTestResponse(
                    query,
                    toolProperties.topK(),
                    toolProperties.similarityThreshold(),
                    answer,
                    toToolCalls(trace.collect()));
        } finally {
            trace.collect(); // clear the thread-local on the exception path
        }
    }

    private List<RetrievalTestResponse.ToolCall> toToolCalls(List<ToolCallTrace.ToolInvocation> calls) {
        return calls.stream()
                    .map(c -> new RetrievalTestResponse.ToolCall(c.tool(), c.query(), c.client(),
                            c.entries().stream()
                             .map(e -> new RetrievalTestResponse.TracedEntry(e.score(), e.content(), e.metadata()))
                             .toList()))
                    .toList();
    }
}
