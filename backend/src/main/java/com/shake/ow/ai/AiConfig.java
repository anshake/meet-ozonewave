package com.shake.ow.ai;

import static org.springframework.ai.anthropic.AnthropicCacheStrategy.SYSTEM_AND_TOOLS;

import org.springframework.ai.anthropic.AnthropicCacheOptions;
import org.springframework.ai.anthropic.AnthropicChatModel;
import org.springframework.ai.anthropic.AnthropicChatOptions;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.client.advisor.MessageChatMemoryAdvisor;
import org.springframework.ai.chat.memory.ChatMemory;
import org.springframework.ai.chat.memory.MessageWindowChatMemory;
import org.springframework.ai.chat.memory.repository.jdbc.JdbcChatMemoryRepository;
import org.springframework.ai.tool.ToolCallbackProvider;
import org.springframework.ai.tool.method.MethodToolCallbackProvider;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.JdbcTemplate;

@Configuration
@EnableConfigurationProperties(ToolProperties.class)
public class AiConfig {

    @Bean
    ChatMemory chatMemory(JdbcTemplate jdbcTemplate) {
        var repository = JdbcChatMemoryRepository.builder()
                                                 .jdbcTemplate(jdbcTemplate)
                                                 .build();
        return MessageWindowChatMemory.builder()
                                      .chatMemoryRepository(repository)
                                      .maxMessages(10)
                                      .build();
    }

    @Bean
    ToolCallbackProvider profileTools(ProfileSearchTool profileSearchTool) {
        return MethodToolCallbackProvider.builder()
                                         .toolObjects(profileSearchTool)
                                         .build();
    }

    @Bean
    ChatClient conversationChatClient(AnthropicChatModel chatModel, ChatMemory chatMemory, ProfileSearchTool profileSearchTool) {
        return ChatClient.builder(chatModel)
                         .defaultSystem("""
                                 You are the Professional AI Assistant for OzoneWave/Anton Pavlik.
                                 Your sole purpose is to provide accurate, concise, and professional information about Anton's career, skills, and projects to visitors of their landing page.
                                 
                                 ### DATA SOURCE
                                 Use the `searchProfile` tool to retrieve information from Anton's professional profile before answering any question about his background.
                                 
                                 ### TONE
                                 - You speak like a character from Monty Python's the Holy Grail.
                                 
                                 ### RULES
                                 1. **Never Hallucinate:** Do not invent technologies, dates, or job titles. If the tool returns nothing relevant, say so.
                                 2. **Persona:** Use the first person ("I") to represent Anton.
                                 3. **Formatting:** Use bullet points for lists of skills or responsibilities to ensure readability on a web interface.
                                 4. **No Speculation:** Do not answer general questions (e.g., "How do I learn Java?") unless it relates directly to Anton's experience.
                                 """)
                         .defaultAdvisors(MessageChatMemoryAdvisor.builder(chatMemory).build())
                         .defaultTools(profileSearchTool)
                         .defaultOptions(AnthropicChatOptions
                                 .builder()
                                 .cacheOptions(AnthropicCacheOptions
                                         .builder()
                                         .strategy(SYSTEM_AND_TOOLS)
                                         .build())
                                 .build())
                         .build();
    }


//                                     - Professional and confident, but not stiff — keep it human.
//                                 - Dry humor is welcome when it fits naturally. Do not force it.
//            - Keep answers concise. No corporate filler.

}
