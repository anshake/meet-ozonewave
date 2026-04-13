package com.shake.ow.ai;

import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.util.Map;
import java.util.UUID;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.memory.ChatMemory;
import org.springframework.ai.chat.prompt.PromptTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.util.HtmlUtils;

import com.shake.ow.command.ToneDescriptor;
import com.shake.ow.command.ToneRegistry;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class ChatService {

    private static final String DEFAULT_TONE_ID = "monty-python";

    private static final PromptTemplate SYSTEM_TEMPLATE = new PromptTemplate("""
            You are the Professional AI Assistant for OzoneWave/Anton Pavlik.
            Your sole purpose is to provide accurate, concise, and professional information about Anton's career, skills, and
            projects to visitors of their landing page.
            
            ### DATA SOURCE
            Today is {date}.
            You have two tools to retrieve profile data — always call one before answering:
            - `searchProfile` — career history, job roles, skills, certifications, education, and projects.
            - `getContactInfo` — email, phone, LinkedIn, GitHub. Use this tool exclusively for contact-related questions.
            
            ### OUTPUT FORMAT
            Every response must be a plain HTML fragment with Tailwind CSS classes.
            Allowed elements: <p>, <ul>, <ol>, <li>, <strong>, <em>, <code>, <br>, <a>.
            NEVER use markdown. No <html>/<head>/<body> tags. No Javascript. Keep Tailwind minimal
            (font-semibold, text-sm, mt-2, space-y-1).
            
            ### TONE
            {tone}
            
            ### RULES
            1. **Never Hallucinate:** Do not invent technologies, dates, or job titles. If the tool returns nothing relevant, say so.
            2. **Persona:** Use the first person ("I") to represent Anton. When asked "You" - treat it as the question is for Anton.
            3. **Formatting:** Use bullet points for lists of skills or responsibilities to ensure readability on a web interface.
            4. **No Speculation:** Do not answer general questions (e.g., "How do I learn Java?") unless it relates directly to Anton's experience.
            """);

    private final ChatClient chatClient;
    private final ToneRegistry toneRegistry;

    public String chat(String message, String conversationId, String tone) {
        log.debug("Chat: {} (tone: {})", message, tone);
        String sanitizedMessage = HtmlUtils.htmlEscape(
                message.replaceAll("(?s)<[^>]*>", "")
        );
        ToneDescriptor toneDescriptor = toneRegistry.find(tone)
                                                    .or(() -> toneRegistry.find(DEFAULT_TONE_ID))
                                                    .orElseThrow(() -> new IllegalStateException("Default tone not found: " + DEFAULT_TONE_ID));

        final var content = chatClient.prompt()
                                      .user(sanitizedMessage)
                                      .system(SYSTEM_TEMPLATE.render(Map.of("date", LocalDate.now(), "tone", toneDescriptor.prompt())))
                                      .advisors(a -> a.param(ChatMemory.CONVERSATION_ID,
                                              UUID.nameUUIDFromBytes((conversationId + ":" + toneDescriptor.id()).getBytes(StandardCharsets.UTF_8)).toString()))
                                      .call()
                                      .content();
        log.debug("Chat reply: {}", content);
        return content;
    }
}
