package com.shake.ow.ai;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Component;

/**
 * Thread-local capture of what each profile tool returned into the prompt during a single chat call.
 * <p>
 * Capture is opt-in: {@link #record} only stores anything when {@link #start()} was called on the same
 * thread. The production streaming chat path never calls {@code start()}, so recording is a no-op there.
 * The test-embeddings endpoint runs a blocking {@code ChatClient.call()} — tools execute synchronously on
 * the request thread — so it can {@code start()} before the call and {@link #collect()} afterwards.
 */
@Component
public class ToolCallTrace {

    private final ThreadLocal<List<ToolInvocation>> invocations = new ThreadLocal<>();

    /** Begin capturing on the current thread. */
    public void start() {
        invocations.set(new ArrayList<>());
    }

    /** Record an invocation, but only while capturing is active on this thread. */
    public void record(ToolInvocation invocation) {
        final var list = invocations.get();
        if (list != null) {
            list.add(invocation);
        }
    }

    /** Return everything captured on this thread and clear it. */
    public List<ToolInvocation> collect() {
        final var list = invocations.get();
        invocations.remove();
        return list == null ? List.of() : list;
    }

    public record ToolInvocation(String tool, String query, String client, List<TracedEntry> entries) {
    }

    public record TracedEntry(Double score, String content, Map<String, Object> metadata) {
    }
}
