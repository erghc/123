package com.example.ftpsearch.controller;

import com.example.ftpsearch.dto.FileMetadataDto;
import com.example.ftpsearch.model.FileMetadata;
import com.example.ftpsearch.model.Role;
import com.example.ftpsearch.model.User;
import com.example.ftpsearch.service.AdminService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AdminController.class)
@WithMockUser(roles = "ADMIN")
public class AdminControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private AdminService adminService;

    @Autowired
    private ObjectMapper objectMapper;

    private User testUser;
    private FileMetadata testFile;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(1L);
        testUser.setUsername("admin");
        testUser.setEmail("admin@example.com");
        testUser.setRole(Role.ADMIN);

        testFile = new FileMetadata();
        testFile.setId(1L);
        testFile.setFileName("test.pdf");
        testFile.setFilePath("/documents/");
        testFile.setFileSize(1024L);
        testFile.setLastModified(System.currentTimeMillis());
        testFile.setFileType("PDF");
    }

    @Test
    void testGetAllUsers_WithAdminRole_ReturnsUserList() throws Exception {
        List<User> users = Arrays.asList(testUser);

        Mockito.when(adminService.getAllUsers()).thenReturn(users);

        mockMvc.perform(get("/api/admin/users")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.size()").value(1))
                .andExpect(jsonPath("$[0].username").value("admin"));
    }

    @Test
    void testUpdateUserRole_WithValidData_ReturnsUpdatedUser() throws Exception {
        User updatedUser = new User();
        updatedUser.setId(1L);
        updatedUser.setUsername("admin");
        updatedUser.setEmail("admin@example.com");
        updatedUser.setRole(Role.USER);

        Mockito.when(adminService.updateUserRole(1L, Role.USER)).thenReturn(updatedUser);

        mockMvc.perform(put("/api/admin/users/{userId}/role", 1L)
                .param("role", "USER")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.role").value("USER"));
    }

    @Test
    void testDeleteUser_WithValidId_ReturnsNoContent() throws Exception {
        Mockito.doNothing().when(adminService).deleteUser(1L);

        mockMvc.perform(delete("/api/admin/users/{userId}", 1L)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNoContent());
    }

    @Test
    void testIndexAllFiles_WithAdminRole_ReturnsSuccess() throws Exception {
        Mockito.doNothing().when(adminService).indexAllFiles();

        mockMvc.perform(post("/api/admin/index")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().string("Indexing started successfully"));
    }

    @Test
    void testGetFileStatistics_WithAdminRole_ReturnsStatistics() throws Exception {
        long totalFiles = 100L;
        long totalSize = 1024 * 1024 * 500L; // 500 MB
        long indexedFiles = 90L;

        Mockito.when(adminService.getFileStatistics()).thenReturn(
                new Object[]{totalFiles, totalSize, indexedFiles}
        );

        mockMvc.perform(get("/api/admin/statistics")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalFiles").value(100))
                .andExpect(jsonPath("$.totalSize").value(500));
    }

    @Test
    void testGetSearchHistory_WithAdminRole_ReturnsHistory() throws Exception {
        // 准备测试数据
        List<Object[]> searchHistory = Collections.singletonList(new Object[]{
                "document", 25, "2023-06-15"
        });

        Mockito.when(adminService.getSearchHistory()).thenReturn(searchHistory);

        mockMvc.perform(get("/api/admin/search-history")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.size()").value(1))
                .andExpect(jsonPath("$[0].query").value("document"))
                .andExpect(jsonPath("$[0].count").value(25));
    }
}    