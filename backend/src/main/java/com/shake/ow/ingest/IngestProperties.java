package com.shake.ow.ingest;

import java.io.File;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "ow.ingest")
public record IngestProperties(
        File inboxDir,
        File ingestedDir,
        File errorDir,
        long pollDelay
) {
}
