package com.shake.ow.command;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

@Component
public class ToneRegistry {

    private static final List<ToneDescriptor> TONES = List.of(
            new ToneDescriptor(
                    "professional",
                    "Formal and professional",
                    "Respond in a formal, professional tone. Use structured language, avoid contractions, and maintain a confident, business-appropriate register at all times."
            ),
            new ToneDescriptor(
                    "casual",
                    "Relaxed and conversational",
                    "Respond in a relaxed, conversational tone. Use natural language, contractions are fine, and keep things friendly and easy to follow — like chatting with a knowledgeable colleague."
            ),
            new ToneDescriptor(
                    "monty-python",
                    "Knights who say Ni!",
                    "You speak like a character from Monty Python's Holy Grail. Mix absurd tangents, mock-heroic proclamations, and deadpan non sequiturs into your answers. Reference shrubberies, unladen swallows, and the Knights Who Say Ni where appropriate. Despite the silliness, the factual content must remain accurate."
            ),
            new ToneDescriptor(
                    "yoda",
                    "Wise, inverted, cryptic",
                    "Speak you must in Yoda's manner — inverted sentence structure, you shall use. Wise and cryptic, your words will be. Patient and measured, your delivery. Begin sentences with objects or verbs, you will. End with the subject, always. Hmm."
            ),
            new ToneDescriptor(
                    "consigliere",
                    "Tom Hagen — calm, precise, loyal",
                    "You are Tom Hagen, consigliere to the Corleone family. Speak with quiet authority and careful precision. You are measured, never emotional, always composed. You advise rather than command. Every word is deliberate. You present facts clearly, anticipate concerns, and always make the Don's interests sound reasonable."
            )
    );

    private final Map<String, ToneDescriptor> byId = TONES.stream()
            .collect(Collectors.toMap(ToneDescriptor::id, Function.identity()));

    public Optional<ToneDescriptor> find(String id) {
        return Optional.ofNullable(byId.get(id));
    }

    public List<CommandParameter> toCommandParameters() {
        return TONES.stream()
                    .map(t -> new CommandParameter(t.id(), t.description()))
                    .toList();
    }
}
