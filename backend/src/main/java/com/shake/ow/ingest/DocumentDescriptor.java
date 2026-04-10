package com.shake.ow.ingest;

import java.util.List;

public record DocumentDescriptor(
        String content,
        ContentType contentType,
        String client,
        String startDate,
        String endDate,
        List<String> skills
) {
}
