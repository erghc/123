package com.example.ftpsearch.service;

import com.example.ftpsearch.dto.FileMetadataDto;
import com.example.ftpsearch.model.FileMetadata;
import com.example.ftpsearch.repository.FileMetadataRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class FileServiceTest {

    @Mock
    private FileMetadataRepository fileMetadataRepository;

    @InjectMocks
    private FileServiceImpl fileService;

    private FileMetadata testFile;

    @BeforeEach
    void setUp() {
        testFile = new FileMetadata();
        testFile.setId(1L);
        testFile.setFileName("test.txt");
        testFile.setFilePath("/test/");
        testFile.setFileSize(1024L);
        testFile.setLastModified(System.currentTimeMillis());
        testFile.setFileType("TXT");
        testFile.setContent("This is a test file content.");
    }

    @Test
    void testGetFileById_WithValidId_ReturnsFile() {
        when(fileMetadataRepository.findById(1L)).thenReturn(Optional.of(testFile));

        Optional<FileMetadata> result = fileService.getFileById(1L);

        assertTrue(result.isPresent());
        assertEquals("test.txt", result.get().getFileName());
    }

    @Test
    void testGetFileById_WithInvalidId_ReturnsEmpty() {
        when(fileMetadataRepository.findById(999L)).thenReturn(Optional.empty());

        Optional<FileMetadata> result = fileService.getFileById(999L);

        assertFalse(result.isPresent());
    }

    @Test
    void testSaveFileMetadata_SavesSuccessfully() {
        when(fileMetadataRepository.save(any(FileMetadata.class))).thenReturn(testFile);

        FileMetadata savedFile = fileService.saveFileMetadata(testFile);

        assertNotNull(savedFile);
        assertEquals("test.txt", savedFile.getFileName());
        verify(fileMetadataRepository, times(1)).save(testFile);
    }

    @Test
    void testUpdateFileMetadata_UpdatesSuccessfully() {
        FileMetadata updatedFile = new FileMetadata();
        updatedFile.setId(1L);
        updatedFile.setFileName("updated.txt");
        updatedFile.setFilePath("/updated/");

        when(fileMetadataRepository.findById(1L)).thenReturn(Optional.of(testFile));
        when(fileMetadataRepository.save(any(FileMetadata.class))).thenReturn(updatedFile);

        Optional<FileMetadata> result = fileService.updateFileMetadata(1L, updatedFile);

        assertTrue(result.isPresent());
        assertEquals("updated.txt", result.get().getFileName());
        assertEquals("/updated/", result.get().getFilePath());
        verify(fileMetadataRepository, times(1)).save(any(FileMetadata.class));
    }

    @Test
    void testUpdateFileMetadata_WithInvalidId_ReturnsEmpty() {
        when(fileMetadataRepository.findById(999L)).thenReturn(Optional.empty());

        Optional<FileMetadata> result = fileService.updateFileMetadata(999L, testFile);

        assertFalse(result.isPresent());
        verify(fileMetadataRepository, never()).save(any(FileMetadata.class));
    }

    @Test
    void testDeleteFile_DeletesSuccessfully() {
        when(fileMetadataRepository.findById(1L)).thenReturn(Optional.of(testFile));

        boolean result = fileService.deleteFile(1L);

        assertTrue(result);
        verify(fileMetadataRepository, times(1)).deleteById(1L);
    }

    @Test
    void testDeleteFile_WithInvalidId_ReturnsFalse() {
        when(fileMetadataRepository.findById(999L)).thenReturn(Optional.empty());

        boolean result = fileService.deleteFile(999L);

        assertFalse(result);
        verify(fileMetadataRepository, never()).deleteById(anyLong());
    }

    @Test
    void testGetAllFiles_ReturnsAllFiles() {
        List<FileMetadata> files = Arrays.asList(testFile);
        when(fileMetadataRepository.findAll()).thenReturn(files);

        List<FileMetadata> result = fileService.getAllFiles();

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("test.txt", result.get(0).getFileName());
    }

    @Test
    void testGetFilesByPath_ReturnsFilesInPath() {
        List<FileMetadata> files = Arrays.asList(testFile);
        when(fileMetadataRepository.findByFilePathContaining("/test/")).thenReturn(files);

        List<FileMetadata> result = fileService.getFilesByPath("/test/");

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("/test/", result.get(0).getFilePath());
    }

    @Test
    void testConvertToDto_ConvertsCorrectly() {
        FileMetadataDto dto = fileService.convertToDto(testFile);

        assertNotNull(dto);
        assertEquals("test.txt", dto.getFileName());
        assertEquals("/test/", dto.getFilePath());
        assertEquals("TXT", dto.getFileType());
    }

    @Test
    void testConvertToEntity_ConvertsCorrectly() {
        FileMetadataDto dto = new FileMetadataDto();
        dto.setFileName("test.txt");
        dto.setFilePath("/test/");
        dto.setFileType("TXT");

        FileMetadata entity = fileService.convertToEntity(dto);

        assertNotNull(entity);
        assertEquals("test.txt", entity.getFileName());
        assertEquals("/test/", entity.getFilePath());
        assertEquals("TXT", entity.getFileType());
    }

    @Test
    void testCreateFileFromMultipart_SuccessfullyCreates() throws IOException {
        MultipartFile multipartFile = new MockMultipartFile(
                "test.txt",
                "test.txt",
                "text/plain",
                "Test content".getBytes(StandardCharsets.UTF_8)
        );

        when(fileMetadataRepository.save(any(FileMetadata.class))).thenAnswer(invocation -> {
            FileMetadata saved = invocation.getArgument(0);
            saved.setId(1L);
            return saved;
        });

        FileMetadata result = fileService.createFileFromMultipart(multipartFile, "/upload/");

        assertNotNull(result);
        assertEquals("test.txt", result.getFileName());
        assertEquals("/upload/", result.getFilePath());
        assertEquals(12L, result.getFileSize());
        verify(fileMetadataRepository, times(1)).save(any(FileMetadata.class));
    }

    @Test
    void testGetFileResource_ReturnsResource() {
        when(fileMetadataRepository.findById(1L)).thenReturn(Optional.of(testFile));

        Optional<Resource> result = fileService.getFileResource(1L);

        assertTrue(result.isPresent());
        assertTrue(result.get() instanceof ByteArrayResource);
        assertEquals("test.txt", result.get().getFilename());
    }

    @Test
    void testGetFileResource_WithInvalidId_ReturnsEmpty() {
        when(fileMetadataRepository.findById(999L)).thenReturn(Optional.empty());

        Optional<Resource> result = fileService.getFileResource(999L);

        assertFalse(result.isPresent());
    }
}    