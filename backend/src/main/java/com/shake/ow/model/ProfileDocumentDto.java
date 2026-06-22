package com.shake.ow.model;

import java.util.Map;
import java.util.UUID;

public record ProfileDocumentDto(UUID id, Map<String, Object> metadata, String content) {
}
