package com.shake.ow.api;

import java.util.List;

import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.shake.ow.model.ProfileDocumentDto;
import com.shake.ow.model.RetrievalTestResponse;
import com.shake.ow.service.AdminService;
import com.shake.ow.service.RetrievalTestService;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import lombok.RequiredArgsConstructor;

@RestController
@Validated
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;
    private final RetrievalTestService retrievalTestService;

    @GetMapping("/entries")
    List<ProfileDocumentDto> getEntries() {
        return adminService.getAllEntries();
    }

    @PostMapping("/test-embeddings")
    RetrievalTestResponse testEmbeddings(@Valid @RequestBody TestEmbeddingsRequest request) {
        return retrievalTestService.test(request.query());
    }

    record TestEmbeddingsRequest(@NotBlank String query) {
    }
}
