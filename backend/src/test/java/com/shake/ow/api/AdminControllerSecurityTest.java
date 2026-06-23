package com.shake.ow.api;

import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestBuilders.formLogin;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import com.shake.ow.security.SecurityConfig;
import com.shake.ow.service.AdminService;
import com.shake.ow.service.RetrievalTestService;

@WebMvcTest(AdminController.class)
@Import(SecurityConfig.class)
@TestPropertySource(properties = {
    "ow.admin.username=tester",
    "ow.admin.password={noop}secret"})
class AdminControllerSecurityTest {

    @Autowired
    MockMvc mockMvc;

    @MockitoBean
    AdminService adminService;

    @MockitoBean
    RetrievalTestService retrievalTestService;

    @Test
    void entries_unauthenticated_returns401() throws Exception {
        mockMvc.perform(get("/api/admin/entries"))
               .andExpect(status().isUnauthorized());
    }

    @Test
    void entries_authenticated_returns200() throws Exception {
        when(adminService.getAllEntries()).thenReturn(List.of());
        mockMvc.perform(get("/api/admin/entries").with(user("tester")))
               .andExpect(status().isOk());
    }

    @Test
    void login_validCredentials_returns200() throws Exception {
        mockMvc.perform(formLogin("/api/auth/login").user("tester").password("secret"))
               .andExpect(status().isOk());
    }

    @Test
    void login_invalidCredentials_returns401() throws Exception {
        mockMvc.perform(formLogin("/api/auth/login").user("tester").password("wrong"))
               .andExpect(status().isUnauthorized());
    }
}
