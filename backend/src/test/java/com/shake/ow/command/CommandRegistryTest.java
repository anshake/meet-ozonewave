package com.shake.ow.command;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.mock;

import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import com.shake.ow.ai.ChatService;

class CommandRegistryTest {

    private CommandRegistry registry;
    private final CommandHandler handlerA = new ToneCommandHandler(new ToneRegistry());
    private final CommandHandler handlerB = new ContactCommandHandler(mock(ChatService.class));

    @BeforeEach
    void setUp() {
        registry = new CommandRegistry(List.of(handlerA, handlerB));
    }

    @Test
    void getAll_returnsAllDescriptors() {
        assertThat(registry.getAll())
                .hasSize(2)
                .extracting(CommandDescriptor::command)
                .containsExactly("tone", "contact");
    }

    @Test
    void getAll_toneDescriptor_hasParameters() {
        CommandDescriptor tone = registry.getAll().stream()
                                         .filter(d -> d.command().equals("tone"))
                                         .findFirst()
                                         .orElseThrow();

        assertThat(tone.parameters())
                .isNotEmpty()
                .extracting(CommandParameter::parameter)
                .containsExactlyInAnyOrder("professional", "casual", "monty-python", "yoda", "consigliere");
    }

    @Test
    void getAll_contactDescriptor_hasNoParameters() {
        CommandDescriptor contact = registry.getAll().stream()
                                            .filter(d -> d.command().equals("contact"))
                                            .findFirst()
                                            .orElseThrow();

        assertThat(contact.parameters()).isEmpty();
    }

    @Test
    void find_knownCommandId_returnsHandler() {
        assertThat(registry.find("tone")).isSameAs(handlerA);
        assertThat(registry.find("contact")).isSameAs(handlerB);
    }

    @Test
    void find_unknownCommandId_throwsIllegalArgumentException() {
        assertThatThrownBy(() -> registry.find("unknown"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("unknown");
    }

    @Test
    void find_htmlSpecialCharsInId_escapesAndThrows() {
        assertThatThrownBy(() -> registry.find("<script>"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageNotContaining("<script>");
    }
}