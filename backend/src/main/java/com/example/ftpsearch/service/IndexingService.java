package com.example.ftpsearch.service;

import com.example.ftpsearch.model.FileMetadata;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface IndexingService {

    FileMetadata indexFile(String fileName, String fileType, String fullPath, 
                          long sizeBytes, String contentPreview, boolean isDirectory);

    List<FileMetadata> indexDirectory(String directoryPath, String ftpServerId) throws IOException;

    void updateFileIndex(String filePath, MultipartFile file) throws IOException;

    void deleteFileIndex(String filePath);
}    