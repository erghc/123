package com.example.ftpsearch.repository;

import com.example.ftpsearch.model.FileMetadata;
import com.example.ftpsearch.model.FileType;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.test.context.ActiveProfiles;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
@ActiveProfiles("test")
public class FileMetadataRepositoryTest {

    @Autowired
    private FileMetadataRepository fileMetadataRepository;

    private FileMetadata file1, file2, file3;

    @BeforeEach
    void setUp() {
        // 创建测试数据
        file1 = new FileMetadata();
        file1.setFileName("document.pdf");
        file1.setFilePath("/documents/");
        file1.setFileSize(1024L);
        file1.setLastModified(LocalDateTime.now().minusDays(1));
        file1.setFileType(FileType.PDF);
        file1.setIndexed(true);
        file1.setContent("Sample PDF content about programming");

        file2 = new FileMetadata();
        file2.setFileName("spreadsheet.xlsx");
        file2.setFilePath("/documents/");
        file2.setFileSize(2048L);
        file2.setLastModified(LocalDateTime.now().minusDays(2));
        file2.setFileType(FileType.XLSX);
        file2.setIndexed(true);
        file2.setContent("Financial data spreadsheet");

        file3 = new FileMetadata();
        file3.setFileName("presentation.pptx");
        file3.setFilePath("/presentations/");
        file3.setFileSize(4096L);
        file3.setLastModified(LocalDateTime.now().minusDays(3));
        file3.setFileType(FileType.PPTX);
        file3.setIndexed(true);
        file3.setContent("Technical presentation slides");

        // 保存到数据库
        fileMetadataRepository.saveAll(List.of(file1, file2, file3));
    }

    @Test
    void testFindById_ExistingFile_ReturnsFile() {
        Optional<FileMetadata> result = fileMetadataRepository.findById(file1.getId());

        assertTrue(result.isPresent());
        assertEquals("document.pdf", result.get().getFileName());
    }

    @Test
    void testFindById_NonExistingFile_ReturnsEmpty() {
        Optional<FileMetadata> result = fileMetadataRepository.findById(999L);

        assertFalse(result.isPresent());
    }

    @Test
    void testFindByFileNameContainingIgnoreCase_WithMatch_ReturnsFiles() {
        Page<FileMetadata> result = fileMetadataRepository.findByFileNameContainingIgnoreCase(
                "sheet", PageRequest.of(0, 10));

        assertEquals(1, result.getTotalElements());
        assertEquals("spreadsheet.xlsx", result.getContent().get(0).getFileName());
    }

    @Test
    void testFindByFileNameContainingIgnoreCase_NoMatch_ReturnsEmpty() {
        Page<FileMetadata> result = fileMetadataRepository.findByFileNameContainingIgnoreCase(
                "nonexistent", PageRequest.of(0, 10));

        assertEquals(0, result.getTotalElements());
    }

    @Test
    void testFindByFilePathContainingIgnoreCase_WithMatch_ReturnsFiles() {
        Page<FileMetadata> result = fileMetadataRepository.findByFilePathContainingIgnoreCase(
                "presentations", PageRequest.of(0, 10));

        assertEquals(1, result.getTotalElements());
        assertEquals("presentation.pptx", result.getContent().get(0).getFileName());
    }

    @Test
    void testFindByContentContainingIgnoreCase_WithMatch_ReturnsFiles() {
        Page<FileMetadata> result = fileMetadataRepository.findByContentContainingIgnoreCase(
                "programming", PageRequest.of(0, 10));

        assertEquals(1, result.getTotalElements());
        assertEquals("document.pdf", result.getContent().get(0).getFileName());
    }

    @Test
    void testFindByFileType_WithMatch_ReturnsFiles() {
        Page<FileMetadata> result = fileMetadataRepository.findByFileType(
                FileType.XLSX, PageRequest.of(0, 10));

        assertEquals(1, result.getTotalElements());
        assertEquals("spreadsheet.xlsx", result.getContent().get(0).getFileName());
    }

    @Test
    void testFindByIndexedIsTrue_ReturnsIndexedFiles() {
        Page<FileMetadata> result = fileMetadataRepository.findByIndexedIsTrue(
                PageRequest.of(0, 10));

        assertEquals(3, result.getTotalElements());
    }

    @Test
    void testFindByFileNameContainingIgnoreCaseAndFileType_WithMatch_ReturnsFiles() {
        Page<FileMetadata> result = fileMetadataRepository.findByFileNameContainingIgnoreCaseAndFileType(
                "document", FileType.PDF, PageRequest.of(0, 10));

        assertEquals(1, result.getTotalElements());
        assertEquals("document.pdf", result.getContent().get(0).getFileName());
    }

    @Test
    void testFindByFileNameContainingIgnoreCaseOrContentContainingIgnoreCase_WithMatch_ReturnsFiles() {
        Page<FileMetadata> result = fileMetadataRepository.findByFileNameContainingIgnoreCaseOrContentContainingIgnoreCase(
                "financial", "financial", PageRequest.of(0, 10));

        assertEquals(1, result.getTotalElements());
        assertEquals("spreadsheet.xlsx", result.getContent().get(0).getFileName());
    }

    @Test
    void testCountByFileType_ReturnsCorrectCounts() {
        long pdfCount = fileMetadataRepository.countByFileType(FileType.PDF);
        long xlsxCount = fileMetadataRepository.countByFileType(FileType.XLSX);
        long pptxCount = fileMetadataRepository.countByFileType(FileType.PPTX);

        assertEquals(1, pdfCount);
        assertEquals(1, xlsxCount);
        assertEquals(1, pptxCount);
    }

    @Test
    void testFindTop10ByOrderByLastModifiedDesc_ReturnsLatestFiles() {
        List<FileMetadata> result = fileMetadataRepository.findTop10ByOrderByLastModifiedDesc();

        assertEquals(3, result.size());
        assertEquals("document.pdf", result.get(0).getFileName()); // 最新的文件
    }
}    