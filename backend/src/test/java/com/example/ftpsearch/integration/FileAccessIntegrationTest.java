package com.example.ftpsearch.integration;

import com.example.ftpsearch.FtpSearchApplication;
import com.example.ftpsearch.model.FileMetadata;
import com.example.ftpsearch.repository.FileMetadataRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import java.util.Arrays;
import java.util.Date;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest(classes = FtpSearchApplication.class)
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class FileAccessIntegrationTest {

    @Autowired
    private WebApplicationContext context;

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private FileMetadataRepository fileMetadataRepository;

    @BeforeEach
    public void setup() {
        mockMvc = MockMvcBuilders.webAppContextSetup(context).build();
        fileMetadataRepository.deleteAll();
    }

    @Test
    public void testGetFileMetadata_WithValidId_ReturnsMetadata() throws Exception {
        // 创建测试文件
        FileMetadata file = createTestFile("test.pdf", "/documents/", "PDF file");
        fileMetadataRepository.save(file);

        // 请求文件元数据
        mockMvc.perform(get("/api/files/{id}", file.getId())
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.fileName").value("test.pdf"))
                .andExpect(jsonPath("$.filePath").value("/documents/"))
                .andExpect(jsonPath("$.fileType").value("PDF"));
    }

    @Test
    public void testGetFileMetadata_WithInvalidId_ReturnsNotFound() throws Exception {
        // 请求不存在的文件
        mockMvc.perform(get("/api/files/{id}", 999L)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound());
    }

    @Test
    public void testDownloadFile_WithValidId_ReturnsFile() throws Exception {
        // 创建测试文件
        FileMetadata file = createTestFile("test.txt", "/files/", "Test content");
        fileMetadataRepository.save(file);

        // 模拟文件下载
        mockMvc.perform(get("/api/files/{id}/download", file.getId()))
                .andExpect(status().isOk())
                .andExpect(header().string("Content-Disposition", "attachment; filename=test.txt"))
                .andExpect(content().contentType(MediaType.TEXT_PLAIN_VALUE));
    }

    @Test
    public void testDownloadFile_WithInvalidId_ReturnsNotFound() throws Exception {
        // 请求不存在的文件下载
        mockMvc.perform(get("/api/files/{id}/download", 999L))
                .andExpect(status().isNotFound());
    }

    @Test
    public void testUploadFile_SuccessfullyUploads() throws Exception {
        // 创建模拟文件
        MockMultipartFile file = new MockMultipartFile(
                "file",
                "test-upload.txt",
                "text/plain",
                "Test upload content".getBytes()
        );

        // 执行文件上传
        mockMvc.perform(multipart("/api/files/upload")
                .file(file)
                .param("directoryPath", "/uploads/"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.fileName").value("test-upload.txt"))
                .andExpect(jsonPath("$.filePath").value("/uploads/"))
                .andExpect(jsonPath("$.fileType").value("TXT"));

        // 验证文件是否保存到数据库
        Optional<FileMetadata> savedFile = fileMetadataRepository.findByFileName("test-upload.txt");
        assertTrue(savedFile.isPresent());
        assertEquals("/uploads/", savedFile.get().getFilePath());
    }

    @Test
    public void testDeleteFile_WithValidId_DeletesSuccessfully() throws Exception {
        // 创建测试文件
        FileMetadata file = createTestFile("to-delete.txt", "/temp/", "Delete me");
        fileMetadataRepository.save(file);

        // 执行删除
        mockMvc.perform(delete("/api/files/{id}", file.getId())
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNoContent());

        // 验证文件是否已删除
        assertFalse(fileMetadataRepository.existsById(file.getId()));
    }

    @Test
    public void testDeleteFile_WithInvalidId_ReturnsNotFound() throws Exception {
        // 尝试删除不存在的文件
        mockMvc.perform(delete("/api/files/{id}", 999L)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound());
    }

    @Test
    public void testUpdateFileMetadata_WithValidData_UpdatesSuccessfully() throws Exception {
        // 创建测试文件
        FileMetadata file = createTestFile("original.txt", "/old/", "Original content");
        fileMetadataRepository.save(file);

        // 准备更新数据
        String updatedJson = "{\"fileName\":\"updated.txt\",\"filePath\":\"/new/\"}";

        // 执行更新
        mockMvc.perform(put("/api/files/{id}", file.getId())
                .contentType(MediaType.APPLICATION_JSON)
                .content(updatedJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.fileName").value("updated.txt"))
                .andExpect(jsonPath("$.filePath").value("/new/"));

        // 验证更新结果
        Optional<FileMetadata> updatedFile = fileMetadataRepository.findById(file.getId());
        assertTrue(updatedFile.isPresent());
        assertEquals("updated.txt", updatedFile.get().getFileName());
        assertEquals("/new/", updatedFile.get().getFilePath());
    }

    @Test
    public void testUpdateFileMetadata_WithInvalidId_ReturnsNotFound() throws Exception {
        // 准备更新数据
        String updatedJson = "{\"fileName\":\"updated.txt\"}";

        // 尝试更新不存在的文件
        mockMvc.perform(put("/api/files/{id}", 999L)
                .contentType(MediaType.APPLICATION_JSON)
                .content(updatedJson))
                .andExpect(status().isNotFound());
    }

    @Test
    public void testGetDirectoryContents_WithValidDirectory_ReturnsContents() throws Exception {
        // 创建目录和文件
        FileMetadata dir = new FileMetadata();
        dir.setFileName("docs");
        dir.setFilePath("/");
        dir.setIsDirectory(true);
        dir = fileMetadataRepository.save(dir);

        FileMetadata file1 = createTestFile("file1.txt", "/docs/", "Text file 1");
        FileMetadata file2 = createTestFile("file2.txt", "/docs/", "Text file 2");
        fileMetadataRepository.saveAll(Arrays.asList(file1, file2));

        // 请求目录内容
        mockMvc.perform(get("/api/files/{id}/contents", dir.getId())
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.fileName").value("docs"))
                .andExpect(jsonPath("$.filePath").value("/"))
                .andExpect(jsonPath("$.isDirectory").value(true))
                .andExpect(jsonPath("$.children").isArray())
                .andExpect(jsonPath("$.children.length()").value(2));
    }

    private FileMetadata createTestFile(String fileName, String filePath, String content) {
        FileMetadata file = new FileMetadata();
        file.setFileName(fileName);
        file.setFilePath(filePath);
        file.setFileSize(1024L);
        file.setFileType(fileName.substring(fileName.lastIndexOf(".") + 1).toUpperCase());
        file.setContent(content);
        file.setLastModified(new Date());
        return file;
    }
}    