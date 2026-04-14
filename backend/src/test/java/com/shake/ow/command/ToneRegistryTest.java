package com.shake.ow.command;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.Test;

class ToneRegistryTest {

    private final ToneRegistry registry = new ToneRegistry();

    @Test
    void find_knownId_returnsDescriptor() {
        Optional<ToneDescriptor> result = registry.find("professional");

        assertThat(result)
                .isPresent()
                .get()
                .extracting(ToneDescriptor::id, ToneDescriptor::description)
                .containsExactly("professional", "Formal and professional");
    }

    @Test
    void find_unknownId_returnsEmpty() {
        assertThat(registry.find("unknown")).isEmpty();
    }

    @Test
    void find_nullId_returnsEmpty() {
        assertThat(registry.find(null)).isEmpty();
    }

    @Test
    void toToneParams_returnsAllTones() {
        List<CommandParameter> params = registry.toToneParams();

        assertThat(params)
                .hasSize(5)
                .extracting(CommandParameter::parameter)
                .containsExactlyInAnyOrder("professional", "casual", "monty-python", "yoda", "consigliere");
    }

    @Test
    void toToneParams_eachParamHasMatchingDescription() {
        List<CommandParameter> params = registry.toToneParams();

        assertThat(params)
                .isNotEmpty()
                .allSatisfy(p -> {
                    ToneDescriptor descriptor = registry.find(p.parameter()).orElseThrow();
                    assertThat(p.description()).isEqualTo(descriptor.description());
                });
    }
}