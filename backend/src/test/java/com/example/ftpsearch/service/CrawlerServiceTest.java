package com.example.ftpsearch.service;

import com.example.ftpsearch.model.FileMetadata;
import com.example.ftpsearch.repository.FileMetadataRepository;
import org.apache.commons.net.ftp.FTPClient;
import org.apache.commons.net.ftp.FTPFile;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.io.IOException;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class CrawlerServiceTest {

    @Mock
    private FileMetadataRepository fileMetadataRepository;

    @Mock
    private FTPClient ftpClient;

    @InjectMocks
    private CrawlerServiceImpl crawlerService;

    @BeforeEach
    void setUp() {
        // 设置FTP连接参数
        ReflectionTestUtils.setField(crawlerService, "ftpHost", "localhost");
        ReflectionTestUtils.setField(crawlerService, "ftpPort", 21);
        ReflectionTestUtils.setField(crawlerService, "ftpUser", "testuser");
        ReflectionTestUtils.setField(crawlerService, "ftpPassword", "testpass");
    }

    @Test
    void testConnectToFTP_Success() throws IOException {
        when(ftpClient.connect("localhost", 21)).thenReturn(true);
        when(ftpClient.login("testuser", "testpass")).thenReturn(true);

        boolean result = crawlerService.connectToFTP();

        assertTrue(result);
        verify(ftpClient, times(1)).connect("localhost", 21);
        verify(ftpClient, times(1)).login("testuser", "testpass");
    }

    @Test
    void testConnectToFTP_Failure() throws IOException {
        when(ftpClient.connect("localhost", 21)).thenReturn(false);

        boolean result = crawlerService.connectToFTP();

        assertFalse(result);
        verify(ftpClient, times(1)).connect("localhost", 21);
        verify(ftpClient, never()).login(anyString(), anyString());
    }

    @Test
    void testDisconnectFromFTP() throws IOException {
        doNothing().when(ftpClient).logout();
        doNothing().when(ftpClient).disconnect();

        crawlerService.disconnectFromFTP();

        verify(ftpClient, times(1)).logout();
        verify(ftpClient, times(1)).disconnect();
    }

    @Test
    void testCrawlDirectory_WithEmptyDirectory() throws IOException {
        // 模拟连接成功
        when(ftpClient.isConnected()).thenReturn(true);
        when(ftpClient.listFiles("/test")).thenReturn(new FTPFile[0]);

        List<FileMetadata> result = crawlerService.crawlDirectory("/test");

        assertNotNull(result);
        assertTrue(result.isEmpty());
        verify(ftpClient, times(1)).listFiles("/test");
    }

    @Test
    void testCrawlDirectory_WithFilesAndDirectories() throws IOException {
        // 创建模拟FTP文件和目录
        FTPFile dir1 = new FTPFile();
        dir1.setName("subdir");
        dir1.setType(FTPFile.DIRECTORY_TYPE);

        FTPFile file1 = new FTPFile();
        file1.setName("document.pdf");
        file1.setType(FTPFile.FILE_TYPE);
        file1.setSize(1024L);
        file1.setTimestamp(new org.apache.commons.net.ftp.FTPFile.Date(2023, 5, 15, 12, 0, 0));

        FTPFile[] ftpFiles = {dir1, file1};

        // 模拟连接成功
        when(ftpClient.isConnected()).thenReturn(true);
        when(ftpClient.listFiles("/test")).thenReturn(ftpFiles);
        when(ftpClient.listFiles("/test/subdir")).thenReturn(new FTPFile[0]);

        List<FileMetadata> result = crawlerService.crawlDirectory("/test");

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("document.pdf", result.get(0).getFileName());
        assertEquals("/test/", result.get(0).getFilePath());
        assertEquals(1024L, result.get(0).getFileSize());

        verify(ftpClient, times(1)).listFiles("/test");
        verify(ftpClient, times(1)).listFiles("/test/subdir");
    }

    @Test
    void testCrawlFTP_Success() throws IOException {
        // 创建模拟FTP文件和目录
        FTPFile rootDir = new FTPFile();
        rootDir.setName("documents");
        rootDir.setType(FTPFile.DIRECTORY_TYPE);

        FTPFile file1 = new FTPFile();
        file1.setName("file1.txt");
        file1.setType(FTPFile.FILE_TYPE);
        file1.setSize(512L);

        FTPFile[] rootFiles = {rootDir};
        FTPFile[] docFiles = {file1};

        // 模拟连接和文件列表
        when(ftpClient.isConnected()).thenReturn(true);
        when(ftpClient.listFiles("/")).thenReturn(rootFiles);
        when(ftpClient.listFiles("/documents")).thenReturn(docFiles);

        // 模拟保存文件元数据
        when(fileMetadataRepository.save(any(FileMetadata.class))).thenAnswer(invocation -> {
            FileMetadata saved = invocation.getArgument(0);
            saved.setId(1L);
            return saved;
        });

        int result = crawlerService.crawlFTP();

        assertEquals(1, result);
        verify(fileMetadataRepository, times(1)).save(any(FileMetadata.class));
    }

    @Test
    void testCreateFileMetadata_FromFTPFile() {
        FTPFile ftpFile = new FTPFile();
        ftpFile.setName("test.pdf");
        ftpFile.setSize(2048L);
        ftpFile.setTimestamp(new org.apache.commons.net.ftp.FTPFile.Date(2023, 5, 15, 10, 30, 0));

        FileMetadata result = crawlerService.createFileMetadata(ftpFile, "/docs/");

        assertNotNull(result);
        assertEquals("test.pdf", result.getFileName());
        assertEquals("/docs/", result.getFilePath());
        assertEquals(2048L, result.getFileSize());
        assertNotNull(result.getLastModified());
    }

    @Test
    void testIsSupportedFileType_WithSupportedType() {
        assertTrue(crawlerService.isSupportedFileType("document.pdf"));
        assertTrue(crawlerService.isSupportedFileType("spreadsheet.xlsx"));
        assertTrue(crawlerService.isSupportedFileType("presentation.pptx"));
        assertTrue(crawlerService.isSupportedFileType("image.jpg"));
        assertTrue(crawlerService.isSupportedFileType("text.txt"));
    }

    @Test
    void testIsSupportedFileType_WithUnsupportedType() {
        assertFalse(crawlerService.isSupportedFileType("script.sh"));
        assertFalse(crawlerService.isSupportedFileType("archive.zip"));
        assertFalse(crawlerService.isSupportedFileType("executable.exe"));
    }
}    