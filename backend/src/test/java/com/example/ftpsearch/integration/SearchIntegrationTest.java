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
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import java.util.Arrays;
import java.util.Date;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest(classes = FtpSearchApplication.class)
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class SearchIntegrationTest {

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
    public void testSearchFiles_ReturnsResults() throws Exception {
        // 创建测试数据
        FileMetadata file1 = createTestFile("document1.pdf", "/documents/", "PDF document about technology");
        FileMetadata file2 = createTestFile("document2.docx", "/documents/", "Word document about business");
        FileMetadata file3 = createTestFile("image.jpg", "/images/", "JPEG image file");

        fileMetadataRepository.saveAll(Arrays.asList(file1, file2, file3));

        // 执行搜索请求
        mockMvc.perform(get("/api/search")
                .param("keyword", "document")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalResults").value(2))
                .andExpect(jsonPath("$.files[0].fileName").value("document1.pdf"))
                .andExpect(jsonPath("$.files[1].fileName").value("document2.docx"));
    }

    @Test
    public void testSearchFiles_WithPathFilter_ReturnsFilteredResults() throws Exception {
        // 创建测试数据
        FileMetadata file1 = createTestFile("document1.pdf", "/documents/", "PDF document about technology");
        FileMetadata file2 = createTestFile("document2.docx", "/reports/", "Word document about business");
        FileMetadata file3 = createTestFile("image.jpg", "/images/", "JPEG image file");

        fileMetadataRepository.saveAll(Arrays.asList(file1, file2, file3));

        // 执行带路径过滤的搜索请求
        mockMvc.perform(get("/api/search")
                .param("keyword", "document")
                .param("path", "/documents/")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalResults").value(1))
                .andExpect(jsonPath("$.files[0].fileName").value("document1.pdf"));
    }

    @Test
    public void testSearchFiles_WithNoResults_ReturnsEmpty() throws Exception {
        // 执行搜索请求（无结果）
        mockMvc.perform(get("/api/search")
                .param("keyword", "nonexistent")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalResults").value(0))
                .andExpect(jsonPath("$.files").isEmpty());
    }

    @Test
    public void testSearchFiles_WithInvalidPath_ReturnsEmpty() throws Exception {
        // 创建测试数据
        FileMetadata file1 = createTestFile("document1.pdf", "/documents/", "PDF document about technology");
        fileMetadataRepository.save(file1);

        // 执行带无效路径的搜索请求
        mockMvc.perform(get("/api/search")
                .param("keyword", "document")
                .param("path", "/invalid/")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalResults").value(0))
                .andExpect(jsonPath("$.files").isEmpty());
    }

    @Test
    public void testSearchFiles_WithPagination() throws Exception {
        // 创建测试数据（10个文件）
        for (int i = 1; i <= 10; i++) {
            FileMetadata file = createTestFile("file" + i + ".txt", "/files/", "Text file " + i);
            fileMetadataRepository.save(file);
        }

        // 第一页（每页5个）
        mockMvc.perform(get("/api/search")
                .param("keyword", "file")
                .param("page", "0")
                .param("size", "5")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalResults").value(10))
                .andExpect(jsonPath("$.totalPages").value(2))
                .andExpect(jsonPath("$.currentPage").value(0))
                .andExpect(jsonPath("$.files").isArray())
                .andExpect(jsonPath("$.files").exists())
                .andExpect(jsonPath("$.files").isNotEmpty())
                .andExpect(jsonPath("$.files.length()").value(5));

        // 第二页（每页5个）
        mockMvc.perform(get("/api/search")
                .param("keyword", "file")
                .param("page", "1")
                .param("size", "5")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalResults").value(10))
                .andExpect(jsonPath("$.totalPages").value(2))
                .andExpect(jsonPath("$.currentPage").value(1))
                .andExpect(jsonPath("$.files.length()").value(5));
    }

    @Test
    public void testSearchFiles_WithSorting() throws Exception {
        // 创建测试数据
        FileMetadata file1 = createTestFile("document1.pdf", "/documents/", "PDF document");
        file1.setLastModified(new Date(System.currentTimeMillis() - 10000));
        FileMetadata file2 = createTestFile("document2.pdf", "/documents/", "PDF document");
        file2.setLastModified(new Date());

        fileMetadataRepository.saveAll(Arrays.asList(file1, file2));

        // 按修改时间降序排列
        mockMvc.perform(get("/api/search")
                .param("keyword", "document")
                .param("sort", "lastModified,desc")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.files[0].fileName").value("document2.pdf"))
                .andExpect(jsonPath("$.files[1].fileName").value("document1.pdf"));

        // 按修改时间升序排列
        mockMvc.perform(get("/api/search")
                .param("keyword", "document")
                .param("sort", "lastModified,asc")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.files[0].fileName").value("document1.pdf"))
                .andExpect(jsonPath("$.files[1].fileName").value("document2.pdf"));
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