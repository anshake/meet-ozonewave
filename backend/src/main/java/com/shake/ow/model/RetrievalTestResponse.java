package com.shake.ow.model;

import java.util.List;
import java.util.Map;

/**
 * Result of a test-embeddings run: the model's answer plus a trace of every profile tool the model called
 * and the entries each tool placed into the prompt. {@code topK}/{@code similarityThreshold} are the live
 * config values used by the similarity branch, shown read-only on the page.
 */
public record RetrievalTestResponse(
        String query,
        int topK,
        double similarityThreshold,
        String answer,
        List<ToolCall> toolCalls
) {

    public record ToolCall(String tool, String query, String client, List<TracedEntry> entries) {
    }

    public record TracedEntry(Double score, String content, Map<String, Object> metadata) {
    }
}
