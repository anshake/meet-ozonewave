package com.shake.ow.command;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

class ToneCommandHandlerTest {

    private final ToneRegistry registry = new ToneRegistry();
    private final ToneCommandHandler handler = new ToneCommandHandler(registry);

    @Test
    void commandId_isTone() {
        assertThat(handler.commandId()).isEqualTo("tone");
    }

    @Test
    void handle_knownTone_returnsConfirmationAndCookie() {
        var result = handler.handle("yoda", "conv-1", "casual");

        assertThat(result.message()).isEqualTo("tone set to yoda");
        assertThat(result.cookie()).isNotNull();
        assertThat(result.cookie().getName()).isEqualTo("tone");
        assertThat(result.cookie().getValue()).isEqualTo("yoda");
    }

    @Test
    void handle_unknownTone_returnsErrorWithValidOptionsAndNoCookie() {
        var result = handler.handle("bogus", "conv-1", "casual");

        assertThat(result.cookie()).isNull();
        assertThat(result.message())
                .startsWith("Unknown tone: 'bogus'. Valid options: ")
                .endsWith(".")
                .contains("professional", "casual", "monty-python", "yoda", "consigliere");
    }

    @Test
    void handle_nullArg_returnsError() {
        var result = handler.handle(null, "conv-1", "casual");

        assertThat(result.cookie()).isNull();
        assertThat(result.message()).startsWith("Unknown tone: 'null'.");
    }

    @Test
    void handle_emptyArg_returnsError() {
        var result = handler.handle("", "conv-1", "casual");

        assertThat(result.cookie()).isNull();
        assertThat(result.message()).startsWith("Unknown tone: ''.");
    }
}