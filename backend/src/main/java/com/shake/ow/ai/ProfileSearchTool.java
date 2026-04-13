package com.shake.ow.ai;

import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.stream.Collectors;

import org.springframework.ai.document.Document;
import org.springframework.ai.tool.annotation.Tool;
import org.springframework.ai.tool.annotation.ToolParam;
import org.springframework.ai.vectorstore.SearchRequest;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.ai.vectorstore.filter.FilterExpressionBuilder;
import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@RequiredArgsConstructor
@Slf4j
public class ProfileSearchTool {

    private final VectorStore vectorStore;
    private final ToolProperties toolProperties;

    @Tool(description = """
            Search Anton Pavlik's professional profile to retrieve factual information.
            Use this tool for ANY question about Anton's career history, job roles, responsibilities,
            technical skills, programming languages, frameworks, certifications, education, projects, and contact information.
            Always call this tool before answering — never answer from memory alone.
            Always prefer latest assignments.
            When a specific client/company name is mentioned (e.g. "ING", "Backbase", "KPN"), pass it as the 'client' parameter.
            When possible, sort messages by startDate, descending order
            """)
    public String searchProfile(
            @ToolParam(
                    description = "A specific, focused search query to find relevant profile information, e.g. 'Java Spring Boot experience', 'AWS certifications', 'backend architecture projects'")
            String query,
            @ToolParam(required = false,
                    description = "Exact client/company name to filter by, e.g. 'ING', 'Backbase', 'KPN'. Use when the question is about a specific employer or client.")
            String client) {

        log.info("Using Search tool. Searching for: {}, client filter: {}", query, client);

        var results = new LinkedHashMap<String, Document>();

        if (client != null) {
            var b = new FilterExpressionBuilder();
            vectorStore.similaritySearch(
                    SearchRequest.builder()
                                 .query(query)
                                 .topK(toolProperties.topK())
                                 .similarityThreshold(0.0)
                                 .filterExpression(b.eq("client", client).build())
                                 .build())
                       .forEach(doc -> results.put(doc.getId(), doc));
        }

        vectorStore.similaritySearch(
                SearchRequest.builder()
                             .query(query)
                             .topK(toolProperties.topK())
                             .similarityThreshold(toolProperties.similarityThreshold())
                             .build())
                   .forEach(doc -> results.putIfAbsent(doc.getId(), doc));

        if (results.isEmpty()) {
            return "No relevant profile information found for: " + query + (client != null ? ", client: " + client : "");
        }

        final var result = results.values().stream()
                                  .sorted(Comparator.comparing(
                                          doc -> (String) doc.getMetadata().get("startDate"),
                                          Comparator.nullsLast(Comparator.reverseOrder())))
                                  .limit(toolProperties.candidateK())
                                  .map(Document::getText)
                                  .collect(Collectors.joining("\n\n---\n\n"));
        log.info("Search results: {}", result);
        return result;
    }
}