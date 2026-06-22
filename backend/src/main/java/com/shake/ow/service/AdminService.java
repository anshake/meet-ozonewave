package com.shake.ow.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.shake.ow.data.ProfileRepository;
import com.shake.ow.model.ProfileDocumentDto;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class AdminService {

    private final ProfileRepository repo;

    @Transactional(readOnly = true)
    public List<ProfileDocumentDto> getAllEntries() {
        return repo.findAll().stream().map(entity -> new ProfileDocumentDto(entity.getId(), entity.getMetadata(), entity.getContent()))
                   .toList();
    }
}
