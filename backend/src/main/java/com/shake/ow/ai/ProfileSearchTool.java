package com.shake.ow.ai;

import java.util.Comparator;
import java.util.stream.Collectors;

import org.springframework.ai.document.Document;
import org.springframework.ai.tool.annotation.Tool;
import org.springframework.ai.tool.annotation.ToolParam;
import org.springframework.ai.vectorstore.SearchRequest;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.stereotype.Component;

import com.shake.ow.ingest.ContentType;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@RequiredArgsConstructor
@Slf4j
public class ProfileSearchTool {

    private final VectorStore vectorStore;
    private final ProfileRepository profileRepository;
    private final ToolProperties toolProperties;

    @Tool(description = """
            Search Anton Pavlik's professional profile to retrieve factual information.
            Use this tool for ANY question about Anton's career history, job roles, responsibilities,
            technical skills, programming languages, frameworks, certifications, education, and projects.
            Always call this tool before answering — never answer from memory alone.
            Always prefer latest assignments.
            When a specific client/company name is mentioned (e.g. "ING", "Backbase", "KPN"), pass it as the 'client' parameter.
            When possible, sort results by startDate, descending order.
            Do NOT use this tool for contact information — use getContactInfo instead.
            Do NOT use this tool for availability questions — use getAvailability instead.
            """)
    public String searchProfile(
            @ToolParam(
                    description = "A specific, focused search query to find relevant profile information, e.g. 'Java Spring Boot experience', 'AWS certifications', 'backend architecture projects'")
            String query,
            @ToolParam(required = false,
                       description = "Exact client/company name to filter by, e.g. 'ING', 'Backbase', 'KPN'. Use when the question is about a specific employer or client.")
            String client) {

        log.debug("Using Search tool. Searching for: {}, client filter: {}", query, client);

        if (client != null) {
            final var contents = profileRepository.findContentByClient(client);
            if (contents.isEmpty()) {
                return "No relevant profile information found for client: " + client;
            }
            final var result = String.join("\n\n---\n\n", contents);
            log.trace("Search results (client SQL): {}", result);
            return result;
        }

        final var docs = vectorStore.similaritySearch(
                SearchRequest.builder()
                             .query(query)
                             .topK(toolProperties.topK())
                             .similarityThreshold(toolProperties.similarityThreshold())
                             .build());

        if (docs.isEmpty()) {
            return "No relevant profile information found for: " + query;
        }

        final var result = docs.stream()
                               .sorted(Comparator.comparing(
                                       doc -> (String) doc.getMetadata().get("startDate"),
                                       Comparator.nullsLast(Comparator.reverseOrder())))
                               .limit(toolProperties.candidateK())
                               .map(Document::getText)
                               .collect(Collectors.joining("\n\n---\n\n"));
        log.trace("Search results: {}", result);
        return result;
    }

    @Tool(description = """
            Retrieve Anton Pavlik's contact information: email, phone, LinkedIn, GitHub.
            Use this tool when the user asks how to contact Anton, or requests any contact details.
            Do NOT use searchProfile for this — always use this tool instead.
            """)
    public String getContactInfo() {
        log.debug("Using getContactInfo tool");

        final var contents = profileRepository.findContentByContentType(ContentType.CONTACT_INFO);

        if (contents.isEmpty()) {
            return "No contact information found.";
        }

        final var result = String.join("\n\n---\n\n", contents);
        log.trace("Contact info results: {}", result);
        return result;
    }

    @Tool(description = """
            Retrieve Anton Pavlik's availability for new engagements: start date and preferred work mode (remote / hybrid / on-site).
            Use this tool when the user asks when Anton is available, whether he does remote work, or about on-site requirements.
            Do NOT use searchProfile for this — always use this tool instead.
            """)
    public String getAvailability() {
        log.debug("Using getAvailability tool");

        final var contents = profileRepository.findContentByContentType(ContentType.AVAILABILITY);

        if (contents.isEmpty()) {
            return "No availability information found.";
        }

        final var result = String.join("\n\n---\n\n", contents);
        log.trace("Availability results: {}", result);
        return result;
    }
}