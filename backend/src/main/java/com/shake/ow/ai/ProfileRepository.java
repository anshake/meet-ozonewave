package com.shake.ow.ai;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface ProfileRepository extends JpaRepository<ProfileDocument, UUID> {

    @Query(value = "SELECT content FROM vector_store WHERE lower(metadata->>'client') = lower(:client)",
           nativeQuery = true)
    List<String> findContentByClient(String client);

    @Query(value = "SELECT content FROM vector_store WHERE metadata->>'contentType' = :contentType",
           nativeQuery = true)
    List<String> findContentByContentType(String contentType);
}
