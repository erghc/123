package com.example.ftpsearch.controller;

import com.example.ftpsearch.dto.FileMetadataDto;
import com.example.ftpsearch.model.FileMetadata;
import com.example.ftpsearch.service.FileService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

import java.util.Optional;

import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(FileController.class)
public class FileControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private FileService fileService;

    @Autowired
    private ObjectMapper objectMapper;

    private FileMetadata fileMetadata;

    @BeforeEach
    void setUp() {
        fileMetadata = new FileMetadata();
        fileMetadata.setId(1L);
        fileMetadata.setFileName("test.pdf");
        fileMetadata.setFilePath("/documents/");
        fileMetadata.setFileSize(1024L);
        fileMetadata.setLastModified(System.currentTimeMillis());
        fileMetadata.setFileType("PDF");
        fileMetadata.setIsDirectory(false);
    }

    @Test
    void testGetFileMetadata_WithValidId_ReturnsFileMetadata() throws Exception {
        Mockito.when(fileService.getFileMetadata(1L)).thenReturn(Optional.of(fileMetadata));

        mockMvc.perform(MockMvcRequestBuilders
                .get("/api/files/{id}", 1L)
                .contentType(MediaType.APPLICATION_JSON))
                .andDo(print)
                .andExpect(status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.fileName").value("test.pdf"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.fileType").value("PDF"));
    }

    @Test
    void testGetFileMetadata_WithInvalidId_ReturnsNotFound() throws Exception {
        Mockito.when(fileService.getFileMetadata(999L)).thenReturn(Optional.empty());

        mockMvc.perform(MockMvcRequestBuilders
                .get("/api/files/{id}", 999L)
                .contentType(MediaType.APPLICATION_JSON))
                .andDo(print)
                .andExpect(status().isNotFound());
    }

    @Test
    void testGetFileContents_WithValidDirectoryId_ReturnsFileList() throws Exception {
        FileMetadata dirMetadata = new FileMetadata();
        dirMetadata.setId(2L);
        dirMetadata.setFileName("documents");
        dirMetadata.setFilePath("/");
        dirMetadata.setIsDirectory(true);

        Mockito.when(fileService.getDirectoryContents(2L)).thenReturn(Optional.of(fileMetadata));

        mockMvc.perform(MockMvcRequestBuilders
                .get("/api/files/{id}/contents", 2L)
                .contentType(MediaType.APPLICATION_JSON))
                .andDo(print)
                .andExpect(status().isOk());
    }

    @Test
    void testGetFileContents_WithInvalidId_ReturnsNotFound() throws Exception {
        Mockito.when(fileService.getDirectoryContents(999L)).thenReturn(Optional.empty());

        mockMvc.perform(MockMvcRequestBuilders
                .get("/api/files/{id}/contents", 999L)
                .contentType(MediaType.APPLICATION_JSON))
                .andDo(print)
                .andExpect(status().isNotFound());
    }

    @Test
    void testDownloadFile_WithValidId_ReturnsFile() throws Exception {
        Mockito.when(fileService.getFileDownloadPath(1L)).thenReturn("/path/to/test.pdf");

        mockMvc.perform(MockMvcRequestBuilders
                .get("/api/files/{id}/download", 1L))
                .andDo(print)
                .andExpect(status().isOk());
    }

    @Test
    void testDownloadFile_WithInvalidId_ReturnsNotFound() throws Exception {
        Mockito.when(fileService.getFileDownloadPath(999L)).thenReturn(null);

        mockMvc.perform(MockMvcRequestBuilders
                .get("/api/files/{id}/download", 999L))
                .andDo(print)
                .andExpect(status().isNotFound());
    }

    @Test
    void testUploadFile_WithValidData_ReturnsSuccess() throws Exception {
        MockMultipartFile file = new MockMultipartFile(
                "file",
                "test.pdf",
                "application/pdf",
                "Test content".getBytes()
        );

        Mockito.when(fileService.uploadFile(Mockito.any(), Mockito.anyString())).thenReturn(fileMetadata);

        mockMvc.perform(MockMvcRequestBuilders.multipart("/api/files/upload")
                .file(file)
                .param("directoryPath", "/documents/"))
                .andDo(print)
                .andExpect(status().isCreated());
    }

    @Test
    void testUploadFile_WithMissingFile_ReturnsBadRequest() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.multipart("/api/files/upload")
                .param("directoryPath", "/documents/"))
                .andDo(print)
                .andExpect(status().isBadRequest());
    }
}    