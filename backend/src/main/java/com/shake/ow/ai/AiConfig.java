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
    ChatClient conversationChatClient(AnthropicChatModel chatModel, ChatMemory chatMemory,
            ProfileSearchTool profileSearchTool) {
        return ChatClient.builder(chatModel)
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

}
