package com.shake.ow.api;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.shake.ow.model.ProfileDocumentDto;
import com.shake.ow.service.AdminService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/entries")
    List<ProfileDocumentDto> getEntries() {
        return adminService.getAllEntries();
    }
}
