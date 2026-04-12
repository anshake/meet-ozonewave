package com.shake.ow.ai;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "ow.ai.tool")
public record ToolProperties(
        int topK,
        int candidateK,
        double similarityThreshold
) {
}
