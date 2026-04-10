package com.shake.ow.ingest;

import java.util.List;
import java.util.Map;

import org.springframework.ai.document.Document;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

@Service
@RequiredArgsConstructor
public class IngestionService {

    private final VectorStore vectorStore;

    private final ObjectMapper objectMapper;

    public void ingest(DocumentDescriptor documentDescriptor) {

        final var metadata = objectMapper.convertValue(documentDescriptor, new TypeReference<Map<String, Object>>() {
        });
        metadata.remove("content");

        vectorStore.add(List.of(new Document(documentDescriptor.content(), metadata)));
    }

}
