package com.shake.ow.ingest;

import java.io.File;
import java.io.IOException;
import java.nio.file.StandardCopyOption;
import java.util.List;

import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.integration.config.EnableIntegration;
import org.springframework.integration.dsl.IntegrationFlow;
import org.springframework.integration.dsl.Pollers;
import org.springframework.integration.file.dsl.Files;
import org.springframework.integration.file.filters.AbstractFileListFilter;
import org.springframework.integration.file.filters.AcceptOnceFileListFilter;
import org.springframework.integration.file.filters.CompositeFileListFilter;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import tools.jackson.databind.ObjectMapper;

@Slf4j
@Configuration
@EnableConfigurationProperties(IngestProperties.class)
@RequiredArgsConstructor
@EnableIntegration
public class ChunkInboxWatcher {

    private final IngestProperties ingestProperties;
    private final ObjectMapper objectMapper;
    private final IngestionService ingestService;

    @Bean
    IntegrationFlow inboxWatcher() {
        log.info("Watching for new chunks in {}", ingestProperties.inboxDir());

        return IntegrationFlow
                .from(Files.inboundAdapter(ingestProperties.inboxDir())
                           .filter(new CompositeFileListFilter<>(List.of(
                                   new AcceptOnceFileListFilter<>(),
                                   new AbstractFileListFilter<>() {
                                       @Override
                                       public boolean accept(File file) {
                                           return file.getName().endsWith(".json");
                                       }
                                   }
                           ))),
                        e -> e.poller(Pollers.fixedDelay(ingestProperties.pollDelay())))
                .handle(File.class, (file, _) -> {
                    log.info("Processing chunk {}", file.getName());
                    try {
                        DocumentDescriptor doc = objectMapper.readValue(file, DocumentDescriptor.class);
                        ingestService.ingest(doc);
                        log.info("Ingested document '{}' for client '{}'", doc.contentType(), doc.client());
                        move(file, ingestProperties.ingestedDir());
                    } catch (Exception ex) {
                        log.error("Failed to ingest {}: {}", file.getName(), ex.getMessage());
                        move(file, ingestProperties.errorDir());
                    }
                    return null;
                })
                .get();
    }

    private void move(File file, File targetDir) {
        try {
            java.nio.file.Files.move(
                    file.toPath(),
                    targetDir.toPath().resolve(file.getName()),
                    StandardCopyOption.REPLACE_EXISTING);
            log.info("Moved {} to {}", file.getName(), targetDir.getName());
        } catch (IOException ex) {
            log.error("Failed to move {} to {}: {}", file.getName(), targetDir.getName(), ex.getMessage());
        }
    }

}