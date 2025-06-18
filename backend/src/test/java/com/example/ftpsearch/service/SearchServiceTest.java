package com.example.ftpsearch.service;

import com.example.ftpsearch.dto.SearchResultDto;
import com.example.ftpsearch.model.FileMetadata;
import com.example.ftpsearch.repository.FileMetadataRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.*;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class SearchServiceTest {

    @Mock
    private FileMetadataRepository fileMetadataRepository;

    @InjectMocks
    private SearchServiceImpl searchService;

    private FileMetadata file1, file2;

    @BeforeEach
    void setUp() {
        file1 = new FileMetadata();
        file1.setId(1L);
        file1.setFileName("document1.pdf");
        file1.setFilePath("/documents/");
        file1.setFileSize(1024L);
        file1.setLastModified(System.currentTimeMillis());
        file1.setFileType("PDF");
        file1.setContent("This is a sample PDF document with searchable text.");

        file2 = new FileMetadata();
        file2.setId(2L);
        file2.setFileName("document2.docx");
        file2.setFilePath("/documents/");
        file2.setFileSize(2048L);
        file2.setLastModified(System.currentTimeMillis() - 10000);
        file2.setFileType("DOCX");
        file2.setContent("Another document for testing search functionality.");
    }

    @Test
    void testSearchFiles_WithKeyword_ReturnsResults() {
        // 准备测试数据
        List<FileMetadata> files = Arrays.asList(file1, file2);
        Page<FileMetadata> page = new PageImpl<>(files);

        // 设置分页参数
        Pageable pageable = PageRequest.of(0, 10, Sort.by("lastModified").descending());

        // 模拟repository方法调用
        when(fileMetadataRepository.findByFileNameContainingIgnoreCaseOrContentContainingIgnoreCase(
                "document", "document", pageable)).thenReturn(page);

        // 执行搜索
        SearchResultDto result = searchService.searchFiles("document", 0, 10);

        // 验证结果
        assertNotNull(result);
        assertEquals(2, result.getTotalResults());
        assertEquals(1, result.getTotalPages());
        assertEquals(2, result.getFiles().size());
        assertTrue(result.getFiles().stream().anyMatch(f -> f.getFileName().equals("document1.pdf")));
        assertTrue(result.getFiles().stream().anyMatch(f -> f.getFileName().equals("document2.docx")));

        // 验证方法调用
        verify(fileMetadataRepository, times(1))
                .findByFileNameContainingIgnoreCaseOrContentContainingIgnoreCase(
                        "document", "document", pageable);
    }

    @Test
    void testSearchFiles_WithEmptyResults_ReturnsEmpty() {
        // 设置分页参数
        Pageable pageable = PageRequest.of(0, 10, Sort.by("lastModified").descending());

        // 模拟空结果
        Page<FileMetadata> emptyPage = new PageImpl<>(Collections.emptyList());
        when(fileMetadataRepository.findByFileNameContainingIgnoreCaseOrContentContainingIgnoreCase(
                "nonexistent", "nonexistent", pageable)).thenReturn(emptyPage);

        // 执行搜索
        SearchResultDto result = searchService.searchFiles("nonexistent", 0, 10);

        // 验证结果
        assertNotNull(result);
        assertEquals(0, result.getTotalResults());
        assertEquals(0, result.getTotalPages());
        assertTrue(result.getFiles().isEmpty());

        // 验证方法调用
        verify(fileMetadataRepository, times(1))
                .findByFileNameContainingIgnoreCaseOrContentContainingIgnoreCase(
                        "nonexistent", "nonexistent", pageable);
    }

    @Test
    void testSearchFiles_WithPath_ReturnsFilteredResults() {
        // 准备测试数据
        List<FileMetadata> files = Collections.singletonList(file1);
        Page<FileMetadata> page = new PageImpl<>(files);

        // 设置分页参数
        Pageable pageable = PageRequest.of(0, 10, Sort.by("lastModified").descending());

        // 模拟repository方法调用
        when(fileMetadataRepository.findByFilePathContainingAndFileNameContainingIgnoreCaseOrContentContainingIgnoreCase(
                "/documents/", "document", "document", pageable)).thenReturn(page);

        // 执行搜索
        SearchResultDto result = searchService.searchFiles("document", "/documents/", 0, 10);

        // 验证结果
        assertNotNull(result);
        assertEquals(1, result.getTotalResults());
        assertEquals(1, result.getTotalPages());
        assertEquals(1, result.getFiles().size());
        assertEquals("document1.pdf", result.getFiles().get(0).getFileName());

        // 验证方法调用
        verify(fileMetadataRepository, times(1))
                .findByFilePathContainingAndFileNameContainingIgnoreCaseOrContentContainingIgnoreCase(
                        "/documents/", "document", "document", pageable);
    }

    @Test
    void testGetFileById_WithValidId_ReturnsFile() {
        // 模拟repository方法调用
        when(fileMetadataRepository.findById(1L)).thenReturn(Optional.of(file1));

        // 执行查询
        Optional<FileMetadata> result = searchService.getFileById(1L);

        // 验证结果
        assertTrue(result.isPresent());
        assertEquals("document1.pdf", result.get().getFileName());

        // 验证方法调用
        verify(fileMetadataRepository, times(1)).findById(1L);
    }

    @Test
    void testGetFileById_WithInvalidId_ReturnsEmpty() {
        // 模拟repository方法调用
        when(fileMetadataRepository.findById(999L)).thenReturn(Optional.empty());

        // 执行查询
        Optional<FileMetadata> result = searchService.getFileById(999L);

        // 验证结果
        assertFalse(result.isPresent());

        // 验证方法调用
        verify(fileMetadataRepository, times(1)).findById(999L);
    }

    @Test
    void testGetFilesByPath_WithValidPath_ReturnsFiles() {
        // 准备测试数据
        List<FileMetadata> files = Arrays.asList(file1, file2);
        Page<FileMetadata> page = new PageImpl<>(files);

        // 设置分页参数
        Pageable pageable = PageRequest.of(0, 10, Sort.by("lastModified").descending());

        // 模拟repository方法调用
        when(fileMetadataRepository.findByFilePathContaining("/documents/", pageable)).thenReturn(page);

        // 执行查询
        SearchResultDto result = searchService.getFilesByPath("/documents/", 0, 10);

        // 验证结果
        assertNotNull(result);
        assertEquals(2, result.getTotalResults());
        assertEquals(1, result.getTotalPages());
        assertEquals(2, result.getFiles().size());

        // 验证方法调用
        verify(fileMetadataRepository, times(1)).findByFilePathContaining("/documents/", pageable);
    }

    @Test
    void testGetSuggestions_WithQuery_ReturnsSuggestions() {
        // 准备测试数据
        List<String> suggestions = Arrays.asList("document", "document1", "document2");

        // 模拟repository方法调用
        when(fileMetadataRepository.findDistinctFileNamesByFileNameContainingIgnoreCase("doc")).thenReturn(suggestions);

        // 执行查询
        List<String> result = searchService.getSuggestions("doc");

        // 验证结果
        assertNotNull(result);
        assertEquals(3, result.size());
        assertTrue(result.contains("document"));
        assertTrue(result.contains("document1"));
        assertTrue(result.contains("document2"));

        // 验证方法调用
        verify(fileMetadataRepository, times(1)).findDistinctFileNamesByFileNameContainingIgnoreCase("doc");
    }
}    