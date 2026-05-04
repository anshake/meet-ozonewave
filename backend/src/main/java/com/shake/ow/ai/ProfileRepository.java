package com.shake.ow.ai;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.shake.ow.ingest.ContentType;

public interface ProfileRepository extends JpaRepository<ProfileDocument, UUID> {

    @Query(value = "SELECT content FROM vector_store WHERE lower(metadata->>'client') = lower(:client)",
           nativeQuery = true)
    List<String> findContentByClient(String client);

    @Query(value = "SELECT content FROM vector_store WHERE metadata->>'contentType' = :contentType",
           nativeQuery = true)
    List<String> findContentByContentTypeName(String contentType);

    default List<String> findContentByContentType(ContentType contentType) {
        return findContentByContentTypeName(contentType.name());
    }
}
